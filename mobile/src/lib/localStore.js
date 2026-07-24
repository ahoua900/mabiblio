import { storage } from './storage';
import { uid, initialOf } from './util';

// Implémentation « locale » (hors-ligne) de la couche de données.
// Comptes, livres et avis conservés sur l'appareil via AsyncStorage.
export const localStore = {
  async signUp(email, password, name) {
    const users = (await storage.get('users', {})) || {};
    if (users[email]) throw new Error('Un compte existe déjà pour cet email.');
    const u = { id: uid(), email, name: name || email.split('@')[0], password };
    users[email] = u;
    await storage.set('users', users);
    const session = { id: u.id, email: u.email, name: u.name };
    await storage.set('session', session);
    return session;
  },
  async signIn(email, password) {
    const users = (await storage.get('users', {})) || {};
    const u = users[email];
    if (!u || u.password !== password) throw new Error('Email ou mot de passe incorrect.');
    const session = { id: u.id, email: u.email, name: u.name };
    await storage.set('session', session);
    return session;
  },
  async signOut() {
    await storage.set('session', null);
  },
  async session() {
    return storage.get('session', null);
  },
  async loadBooks() {
    return storage.get('books', []);
  },
  async saveBook(book) {
    const books = (await storage.get('books', [])) || [];
    books.push(book);
    await storage.set('books', books);
  },
  async loadReviews() {
    return storage.get('reviews', {});
  },
  async saveReview(bookId, review) {
    const map = (await storage.get('reviews', {})) || {};
    map[bookId] = [review].concat(map[bookId] || []);
    await storage.set('reviews', map);
  },
};
