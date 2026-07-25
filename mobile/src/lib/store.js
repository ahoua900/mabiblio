import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { db } from './db';
import { storage } from './storage';
import audio from './audio';
import { uid, initialOf } from './util';
import { loadCatalog } from './catalog';
import { extractBookText, extOf, estimatePageCount } from './textExtract';
import { getBookText } from './content';
import PdfTextEngine from '../components/PdfTextEngine';

const AppContext = createContext(null);

const DEFAULT_PREFS = { theme: 'light', fontKey: 'serif', size: 18, margin: 'normal' };

export function AppProvider({ children }) {
  const [booting, setBooting] = useState(true);
  const [user, setUser] = useState(null);
  const [customBooks, setCustomBooks] = useState([]);
  const [reviewsByBook, setReviewsByBook] = useState({});
  const [readingList, setReadingList] = useState([]);
  const [recent, setRecent] = useState([]);
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [progress, setProgress] = useState({});
  const [listenSeconds, setListenSeconds] = useState(0);
  const [translations, setTranslations] = useState({});
  const [catalog, setCatalog] = useState([]);
  const pdfEngineRef = useRef(null);

  useEffect(() => { boot(); }, []);
  useEffect(() => { loadCatalog().then(setCatalog); }, []);

  async function boot() {
    const [rl, rc, pf, pg, ls, tr] = await Promise.all([
      storage.get('readingList', []),
      storage.get('recent', []),
      storage.get('readerPrefs', null),
      storage.get('progress', {}),
      storage.get('listenSeconds', 0),
      storage.get('translations', {}),
    ]);
    setReadingList(rl || []);
    setRecent(rc || []);
    if (pf) setPrefs({ ...DEFAULT_PREFS, ...pf });
    setProgress(pg || {});
    setListenSeconds(ls || 0);
    setTranslations(tr || {});
    try {
      const s = await db.session();
      if (s) { setUser(s); await loadData(); }
    } catch (e) { console.warn(e); }
    setBooting(false);
  }

  async function loadData() {
    try {
      const [b, r] = await Promise.all([db.loadBooks(), db.loadReviews()]);
      setCustomBooks(b || []);
      setReviewsByBook(r || {});
    } catch (e) { console.warn(e); }
  }

  const actions = {
    isRemote: db.isRemote(),

    async signIn(email, password) {
      const s = await db.signIn(email, password);
      setUser(s);
      await loadData();
      return s;
    },
    async signUp(email, password, name) {
      const s = await db.signUp(email, password, name);
      setUser(s);
      await loadData();
      return s;
    },
    async signOut() {
      audio.stop();
      await db.signOut();
      setUser(null);
      setCustomBooks([]);
      setReviewsByBook({});
    },

    async addReview(bookId, rating, comment) {
      const review = { id: uid(), user: user.name, initial: initialOf(user.name), rating, comment, date: 'à l’instant' };
      await db.saveReview(bookId, review, user);
      setReviewsByBook((prev) => ({ ...prev, [bookId]: [review, ...(prev[bookId] || [])] }));
    },

    async addBook(book, fileUri) {
      const srcUri = book.localUri || fileUri;
      const ext = extOf(srcUri);
      let textUri = null;
      try {
        const text = await extractBookText(ext, srcUri, pdfEngineRef.current);
        if (text && text.trim().length > 40) {
          textUri = FileSystem.documentDirectory + book.id + '.txt';
          await FileSystem.writeAsStringAsync(textUri, text);
          book.textUri = textUri;
          book.pageCount = estimatePageCount(text);
        }
      } catch (e) { console.warn('extractBookText', e.message); }
      await db.saveBook(book, fileUri, user, textUri);
      setCustomBooks((prev) => [...prev, book]);
    },

    async getBookText(book) {
      return getBookText(book);
    },

    async deleteBook(book) {
      try { await db.deleteBook(book, user); } catch (e) { console.warn('deleteBook', e.message); }
      if (book.localUri) { try { await FileSystem.deleteAsync(book.localUri, { idempotent: true }); } catch (e) {} }
      if (book.textUri) { try { await FileSystem.deleteAsync(book.textUri, { idempotent: true }); } catch (e) {} }
      setCustomBooks((prev) => prev.filter((b) => b.id !== book.id));
      setReadingList((prev) => { const n = prev.filter((x) => x !== book.id); storage.set('readingList', n); return n; });
      setProgress((prev) => { const n = { ...prev }; delete n[book.id]; storage.set('progress', n); return n; });
      setTranslations((prev) => {
        const n = {};
        Object.keys(prev).forEach((k) => { if (k.indexOf(book.id + ':') !== 0) n[k] = prev[k]; });
        storage.set('translations', n);
        return n;
      });
    },

    // La traduction se fait page par page (un livre entier dépasserait la taille
    // acceptée par l'agent de traduction) : la clé de cache inclut donc la page.
    getTranslation(bookId, lang, page) {
      return translations[bookId + ':' + lang + ':' + page] || null;
    },
    async saveTranslation(bookId, lang, page, text) {
      const next = { ...translations, [bookId + ':' + lang + ':' + page]: text };
      setTranslations(next);
      await storage.set('translations', next);
    },

    async toggleList(id) {
      let next;
      let added;
      if (readingList.indexOf(id) === -1) { next = [...readingList, id]; added = true; }
      else { next = readingList.filter((x) => x !== id); added = false; }
      setReadingList(next);
      await storage.set('readingList', next);
      return added;
    },
    inList: (id) => readingList.indexOf(id) !== -1,

    async addRecent(q) {
      q = (q || '').trim();
      if (!q) return;
      const next = [q, ...recent.filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 8);
      setRecent(next);
      await storage.set('recent', next);
    },
    async removeRecent(q) {
      const next = recent.filter((x) => x !== q);
      setRecent(next);
      await storage.set('recent', next);
    },
    async clearRecent() {
      setRecent([]);
      await storage.set('recent', []);
    },

    async setReaderPref(patch) {
      const next = { ...prefs, ...patch };
      setPrefs(next);
      await storage.set('readerPrefs', next);
    },

    async setBookProgress(id, title, color, value) {
      const next = { ...progress, [id]: { title, color, value, updatedAt: Date.now() } };
      setProgress(next);
      await storage.set('progress', next);
    },
    history() {
      return Object.keys(progress)
        .map((id) => ({ id, ...progress[id] }))
        .sort((a, b) => b.updatedAt - a.updatedAt);
    },

    async refreshListen() {
      const ls = (await storage.get('listenSeconds', 0)) || 0;
      setListenSeconds(ls);
    },
    pdfUrl: (book) => db.pdfUrl(book),
  };

  const value = {
    booting, user, customBooks, reviewsByBook, readingList, recent, prefs, progress, listenSeconds, catalog,
    ...actions,
  };

  return (
    <AppContext.Provider value={value}>
      <PdfTextEngine ref={pdfEngineRef} />
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp doit être utilisé dans <AppProvider>');
  return ctx;
}
