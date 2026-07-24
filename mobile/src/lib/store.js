import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from './db';
import { storage } from './storage';
import audio from './audio';
import { uid, initialOf } from './util';

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

  useEffect(() => { boot(); }, []);

  async function boot() {
    const [rl, rc, pf, pg, ls] = await Promise.all([
      storage.get('readingList', []),
      storage.get('recent', []),
      storage.get('readerPrefs', null),
      storage.get('progress', {}),
      storage.get('listenSeconds', 0),
    ]);
    setReadingList(rl || []);
    setRecent(rc || []);
    if (pf) setPrefs({ ...DEFAULT_PREFS, ...pf });
    setProgress(pg || {});
    setListenSeconds(ls || 0);
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
      await db.saveBook(book, fileUri, user);
      setCustomBooks((prev) => [...prev, book]);
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
    booting, user, customBooks, reviewsByBook, readingList, recent, prefs, progress, listenSeconds,
    ...actions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp doit être utilisé dans <AppProvider>');
  return ctx;
}
