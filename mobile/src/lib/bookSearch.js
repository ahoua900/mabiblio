// ============================================================================
// Recherche de livres en ligne directement dans Project Gutenberg.
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

// Extrait l'URL de couverture d'un jeu de formats Gutendex.
export function thumbFromFormats(formats) {
  const thumb = formats && (formats['image/jpeg'] || formats['image/png'] || formats['image/gif']);
  return thumb ? https(thumb) : null;
}

// ---------------------------------------------------------------------------
// 1. Project Gutenberg — recherche principale
// ---------------------------------------------------------------------------
// « search » couvre titre + auteur, « topic » couvre sujets/bookshelves ; Gutendex
// combine les deux paramètres en ET, donc pour une recherche « par tout » on
// interroge les deux séparément puis on fusionne (sans doublons).
export async function searchOnline(query) {
  const q = encodeURIComponent(query.trim());
  if (!q) return [];
  const [bySearch, byTopic] = await Promise.all([
    getJson(`https://gutendex.com/books/?search=${q}&page_size=24`).catch((e) => e),
    getJson(`https://gutendex.com/books/?topic=${q}&page_size=24`).catch((e) => e),
  ]);
  // Si les deux requêtes ont échoué (ex. hors-ligne), on le signale à l'appelant
  // plutôt que de renvoyer silencieusement une liste vide.
  if (bySearch instanceof Error && byTopic instanceof Error) throw bySearch;

  const seen = new Set();
  const merged = [];
  const results = [
    ...(bySearch instanceof Error ? [] : bySearch.results || []),
    ...(byTopic instanceof Error ? [] : byTopic.results || []),
  ];
  for (const b of results) {
    if (!b || seen.has(b.id)) continue;
    seen.add(b.id);
    merged.push(b);
  }
  return merged.map(normalizeGutenberg).filter(Boolean);
}

function normalizeGutenberg(book) {
  if (!book || !book.title) return null;
  const authors = Array.isArray(book.authors) ? book.authors.map((a) => a.name).filter(Boolean) : [];
  const year = String(book.bookshelves || []).match(/\d{4}/)?.[0] || '';
  return {
    key: 'gutenberg:' + book.id,
    source: 'Project Gutenberg',
    title: book.title,
    authors: authors.join(', '),
    thumbnail: thumbFromFormats(book.formats),
    description: book.subjects ? book.subjects.slice(0, 4).join(', ') : '',
    year,
    language: langLabel((book.languages || [])[0]),
    genre: 'Roman',
    age: 'Adultes',
    previewLink: `https://www.gutenberg.org/ebooks/${book.id}`,
    publicDomain: true,
    formats: book.formats || {},
    color: colorFromString(book.title),
  };
}

// Transforme un résultat de recherche en ligne en objet « livre », pour
// afficher une page de détail avant même de l'avoir téléchargé.
export function toPreviewBook(result) {
  const authorLabel = result.authors || result.author || 'Auteur inconnu';
  return {
    id: result.key,
    remote: true,
    title: result.title,
    author: authorLabel,
    authors: authorLabel,
    genre: result.genre || 'Roman',
    age: result.age || 'Adultes',
    color: result.color,
    thumbnail: result.thumbnail || null,
    rating: 0,
    language: result.language || 'Français',
    pageCount: 1,
    summaryFull: result.description || `Livre importé depuis ${result.source || 'une source en ligne'}.`,
    description: result.description,
    reviews: [],
    formats: result.formats,
    previewLink: result.previewLink,
    source: result.source,
  };
}

export function langLabel(code) {
  const map = { fr: 'Français', en: 'English', es: 'Español', de: 'Deutsch', ar: 'العربية', zh: '中文' };
  return map[code] || 'Français';
}

// Déduit un genre et une tranche d'âge à partir des catégories du résultat de recherche.
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

  // 0bis. Formats déjà connus (résultat Gutenberg déjà chargé) : pas besoin de rechercher à nouveau.
  if (result.formats && Object.keys(result.formats).length) {
    const direct = pickGutenbergFormat(result.formats);
    if (direct) return direct;
  }

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
  return pickGutenbergFormat(book.formats);
}

// Choisit le meilleur format téléchargeable parmi ceux exposés par Gutendex.
function pickGutenbergFormat(f) {
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
