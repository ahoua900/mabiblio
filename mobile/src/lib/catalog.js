// ============================================================================
// Catalogue de découverte : livres populaires chargés depuis Project Gutenberg
// (remplace l'ancienne liste de livres mockés). Mis en cache pour un affichage
// instantané et un usage hors-ligne.
// ============================================================================
import { storage } from './storage';
import { colorFromString, classify, langLabel, thumbFromFormats } from './bookSearch';

const CACHE_KEY = 'catalog';
const TTL = 6 * 60 * 60 * 1000; // 6h
const TIMEOUT = 11000;

export async function loadCatalog() {
  const cached = await storage.get(CACHE_KEY, null);
  if (cached && cached.at && Date.now() - cached.at < TTL && cached.books && cached.books.length) {
    return cached.books;
  }
  try {
    const books = await fetchPopular();
    if (books.length) await storage.set(CACHE_KEY, { at: Date.now(), books });
    return books.length ? books : (cached && cached.books) || [];
  } catch (e) {
    return (cached && cached.books) || [];
  }
}

async function fetchPopular() {
  const url = 'https://gutendex.com/books/?sort=popular&page_size=32';
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    return (data.results || []).map(toCatalogBook).filter(Boolean);
  } finally {
    clearTimeout(t);
  }
}

function toCatalogBook(b) {
  if (!b || !b.title || !b.formats) return null;
  const authors = Array.isArray(b.authors) ? b.authors.map((a) => a.name).filter(Boolean) : [];
  const authorLabel = authors.join(', ') || 'Auteur inconnu';
  const { genre, age } = classify(b.subjects, null);
  return {
    id: 'gutenberg:' + b.id,
    remote: true,
    gutenbergId: b.id,
    title: b.title,
    author: authorLabel,
    authors: authorLabel,
    genre,
    age,
    color: colorFromString(b.title),
    thumbnail: thumbFromFormats(b.formats),
    rating: 0,
    language: langLabel((b.languages || [])[0]),
    pageCount: 1,
    summaryFull: (b.subjects || []).slice(0, 4).join(', ') || `Livre du domaine public — ${authorLabel}`,
    description: (b.subjects || []).slice(0, 4).join(', '),
    reviews: [],
    formats: b.formats,
    previewLink: `https://www.gutenberg.org/ebooks/${b.id}`,
    source: 'Project Gutenberg',
  };
}
