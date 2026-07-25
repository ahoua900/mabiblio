import { localStore } from './localStore';
import { createSupabaseStore } from './supabaseStore';
import config from '../config';

// Façade unique : bascule automatiquement entre Supabase et le stockage local.
let remote = null;
let mode = 'local';

if (config.supabaseUrl && config.supabaseAnonKey) {
  try {
    remote = createSupabaseStore(config.supabaseUrl, config.supabaseAnonKey);
    mode = 'supabase';
  } catch (e) {
    console.warn('Supabase indisponible, mode local :', e.message);
    remote = null;
    mode = 'local';
  }
}

export const db = {
  mode,
  isRemote: () => mode === 'supabase',
  signUp: (e, p, n) => (remote ? remote.signUp(e, p, n) : localStore.signUp(e, p, n)),
  signIn: (e, p) => (remote ? remote.signIn(e, p) : localStore.signIn(e, p)),
  signOut: () => (remote ? remote.signOut() : localStore.signOut()),
  session: () => (remote ? remote.session() : localStore.session()),
  loadBooks: () => (remote ? remote.loadBooks() : localStore.loadBooks()),
  saveBook: (book, fileUri, user, textUri) => (remote ? remote.saveBook(book, fileUri, user, textUri) : localStore.saveBook(book)),
  deleteBook: (book, user) => (remote ? remote.deleteBook(book, user) : localStore.deleteBook(book.id)),
  loadReviews: () => (remote ? remote.loadReviews() : localStore.loadReviews()),
  saveReview: (id, r, user) => (remote ? remote.saveReview(id, r, user) : localStore.saveReview(id, r)),
  // En local, le PDF est déjà un fichier sur l'appareil : on renvoie son uri.
  pdfUrl: (book) => (remote ? remote.pdfUrl(book) : Promise.resolve(book.localUri || null)),
  // Idem pour le texte extrait : localUri en local, URL publique en mode distant.
  textUrl: (book) => (remote ? remote.textUrl(book) : Promise.resolve(book.textUri || null)),
};
