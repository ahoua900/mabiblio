import config from '../config';

// ============================================================================
// Recherche de livres en ligne, selon la cascade :
//   Google Books (recherche + métadonnées)
//     └─ si fichier téléchargeable → on télécharge
//        sinon → Open Library → Project Gutenberg → Internet Archive
// ============================================================================

const TIMEOUT = 11000;
const PALETTE = ['#B0413E', '#C97A1B', '#1F7A4D', '#5B4A9E', '#1E7F8C', '#994488', '#2F7D63', '#4A5568', '#8A3D8F'];

export function colorFromString(s) {
  let h = 0;
  for (let i = 0; i < (s || '').length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

async function getJson(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

const https = (u) => (u ? String(u).replace(/^http:\/\//, 'https://') : u);

// ---------------------------------------------------------------------------
// 1. Google Books — recherche principale
// ---------------------------------------------------------------------------
export async function searchOnline(query) {
  const q = encodeURIComponent(query.trim());
  if (!q) return [];
  const key = config.googleBooksApiKey ? `&key=${config.googleBooksApiKey}` : '';
  const url = `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=24&country=US${key}`;
  const data = await getJson(url);
  return (data.items || []).map(normalizeGoogle).filter(Boolean);
}

function normalizeGoogle(it) {
  const vi = it.volumeInfo || {};
  const ai = it.accessInfo || {};
  if (!vi.title) return null;
  const thumb = vi.imageLinks && https(vi.imageLinks.thumbnail || vi.imageLinks.smallThumbnail);
  // Google ne fournit un PDF/EPUB librement téléchargeable que pour le domaine
  // public et sans jeton DRM (acsTokenLink). Sinon c'est un aperçu.
  const clean = (fmt) => (fmt && fmt.isAvailable && ai.publicDomain && !fmt.acsTokenLink ? https(fmt.downloadLink) : null);
  const { genre, age } = classify(vi.categories, ai.maturityRating);
  return {
    key: 'google:' + it.id,
    source: 'Google Books',
    title: vi.title + (vi.subtitle ? ' — ' + vi.subtitle : ''),
    authors: (vi.authors || []).join(', '),
    thumbnail: thumb || null,
    description: vi.description || '',
    year: (vi.publishedDate || '').slice(0, 4),
    publisher: vi.publisher || '',
    language: langLabel(vi.language),
    genre,
    age,
    previewLink: ai.webReaderLink || vi.previewLink || vi.infoLink || null,
    publicDomain: !!ai.publicDomain,
    googlePdf: clean(ai.pdf),
    googleEpub: clean(ai.epub),
    color: colorFromString(vi.title),
  };
}

function langLabel(code) {
  const map = { fr: 'Français', en: 'English', es: 'Español', de: 'Deutsch', ar: 'العربية', zh: '中文' };
  return map[code] || 'Français';
}

// Déduit un genre et une tranche d'âge à partir des catégories Google Books.
export function classify(categories, maturity) {
  const c = (categories || []).join(' ').toLowerCase();
  let genre = 'Roman';
  if (/comic|graphic novel|bande dessin/.test(c)) genre = 'Bande dessinée';
  else if (/education|study aids?|textbook|school|teaching|juvenile nonfiction/.test(c)) genre = 'Scolaire';
  else if (/fiction|novel|stor(y|ies)|literary|roman|poetry|drama/.test(c)) genre = 'Roman';
  else if (/philosoph|essay|biograph|history|science|psycholog|religion|self-?help|business|politic|nonfiction|social/.test(c)) genre = 'Essai';

  let age = 'Adultes';
  if (maturity === 'MATURE') age = 'Adultes';
  else if (/young adult|jeunesse|teen/.test(c)) age = 'Jeunesse';
  else if (/juvenile|children|picture book|kids|enfant/.test(c)) age = 'Enfants';
  return { genre, age };
}

// ---------------------------------------------------------------------------
// Résolution d'un fichier téléchargeable (cascade)
// Retourne { url, ext, source } ou null.
// ---------------------------------------------------------------------------
export async function resolveDownload(result) {
  // 0. Fichier direct de Google Books (domaine public, rare)
  if (result.googlePdf) return { url: result.googlePdf, ext: 'pdf', source: 'Google Books' };
  if (result.googleEpub) return { url: result.googleEpub, ext: 'epub', source: 'Google Books' };

  const title = result.title.split(' — ')[0];
  const author = result.authors;

  // 1. Open Library → Internet Archive
  try {
    const ol = await tryOpenLibrary(title, author);
    if (ol) return ol;
  } catch (e) {}
  // 2. Project Gutenberg (Gutendex)
  try {
    const gb = await tryGutenberg(title, author);
    if (gb) return gb;
  } catch (e) {}
  // 3. Internet Archive (recherche directe)
  try {
    const ia = await tryArchive(title);
    if (ia) return ia;
  } catch (e) {}

  return null;
}

async function tryOpenLibrary(title, author) {
  const q = encodeURIComponent([title, author].filter(Boolean).join(' '));
  const url = `https://openlibrary.org/search.json?q=${q}&fields=title,author_name,ia,ebook_access&limit=5`;
  const data = await getJson(url);
  const docs = (data.docs || []).filter((d) => Array.isArray(d.ia) && d.ia.length && d.ebook_access && d.ebook_access !== 'no_ebook' && d.ebook_access !== 'unclassified');
  for (const d of docs.slice(0, 3)) {
    const file = await archiveFileFor(d.ia[0]);
    if (file) return file;
  }
  return null;
}

async function tryGutenberg(title, author) {
  const q = encodeURIComponent([title, author].filter(Boolean).join(' '));
  const data = await getJson(`https://gutendex.com/books/?search=${q}`);
  const book = (data.results || [])[0];
  if (!book || !book.formats) return null;
  const f = book.formats;
  const pick = (needle) => {
    const k = Object.keys(f).find((m) => m.indexOf(needle) !== -1 && !/zip$/i.test(f[m]));
    return k ? https(f[k]) : null;
  };
  const pdf = pick('application/pdf');
  if (pdf) return { url: pdf, ext: 'pdf', source: 'Project Gutenberg' };
  const html = pick('text/html');
  if (html) return { url: html, ext: 'html', source: 'Project Gutenberg' };
  const txt = pick('text/plain');
  if (txt) return { url: txt, ext: 'txt', source: 'Project Gutenberg' };
  const epub = pick('application/epub');
  if (epub) return { url: epub, ext: 'epub', source: 'Project Gutenberg' };
  return null;
}

async function tryArchive(title) {
  const q = encodeURIComponent(`title:(${title}) AND mediatype:texts`);
  const url = `https://archive.org/advancedsearch.php?q=${q}&fl[]=identifier&rows=5&output=json`;
  const data = await getJson(url);
  const docs = (data.response && data.response.docs) || [];
  for (const d of docs.slice(0, 3)) {
    const file = await archiveFileFor(d.identifier);
    if (file) return file;
  }
  return null;
}

// Cherche un PDF (à défaut un texte) dans un item Internet Archive.
async function archiveFileFor(identifier) {
  if (!identifier) return null;
  const meta = await getJson(`https://archive.org/metadata/${encodeURIComponent(identifier)}`);
  const files = meta.files || [];
  const dl = (name) => `https://archive.org/download/${encodeURIComponent(identifier)}/${encodeURIComponent(name)}`;
  const pdf = files.find((f) => f.name && /\.pdf$/i.test(f.name) && f.format !== 'Abbyy GZ');
  if (pdf) return { url: dl(pdf.name), ext: 'pdf', source: 'Internet Archive' };
  const txt = files.find((f) => f.name && /_djvu\.txt$/i.test(f.name));
  if (txt) return { url: dl(txt.name), ext: 'txt', source: 'Internet Archive' };
  return null;
}
