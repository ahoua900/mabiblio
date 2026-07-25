import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { initialOf, timeAgo } from './util';

// Décodage base64 → octets, sans dépendre de atob (indisponible sur certains moteurs RN).
function base64ToBytes(b64) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const clean = String(b64).replace(/=+$/, '');
  const out = [];
  let bits = 0;
  let val = 0;
  for (let i = 0; i < clean.length; i++) {
    const idx = chars.indexOf(clean[i]);
    if (idx === -1) continue;
    val = (val << 6) | idx;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out.push((val >> bits) & 0xff);
    }
  }
  return Uint8Array.from(out);
}

// Implémentation Supabase de la couche de données.
export function createSupabaseStore(url, anonKey) {
  const client = createClient(url, anonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  function toSession(user) {
    const name = (user.user_metadata && user.user_metadata.display_name) || (user.email || '').split('@')[0];
    return { id: user.id, email: user.email, name };
  }

  return {
    client,
    async signUp(email, password, name) {
      const { data, error } = await client.auth.signUp({ email, password, options: { data: { display_name: name } } });
      if (error) throw new Error(error.message);
      if (!data.session) throw new Error('Compte créé. Vérifiez votre email pour confirmer, puis connectez-vous.');
      return toSession(data.user);
    },
    async signIn(email, password) {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      return toSession(data.user);
    },
    async signOut() {
      await client.auth.signOut();
    },
    async session() {
      const { data } = await client.auth.getSession();
      return data.session ? toSession(data.session.user) : null;
    },
    async loadBooks() {
      const { data, error } = await client.from('books').select('*').order('created_at', { ascending: true });
      if (error) { console.warn('loadBooks', error.message); return []; }
      return data.map((r) => ({
        id: r.id, owner: r.owner, title: r.title, author: r.author, genre: r.genre, age: r.age,
        color: r.color || '#8A3D8F', thumbnail: r.thumbnail_url || null, rating: 0, language: r.language, pageCount: r.page_count || 12,
        summaryFull: r.summary || '', pdf_path: r.pdf_path, text_path: r.text_path || null, reviews: [],
      }));
    },
    async saveBook(book, fileUri, user, textUri) {
      let pdf_path = null;
      if (fileUri) {
        try {
          const raw = ((book.localUri || fileUri).split('?')[0].split('.').pop() || 'pdf').toLowerCase();
          const ext = ['pdf', 'html', 'txt', 'epub'].indexOf(raw) !== -1 ? raw : 'pdf';
          const MIME = { pdf: 'application/pdf', html: 'text/html', txt: 'text/plain', epub: 'application/epub+zip' };
          const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
          const bytes = base64ToBytes(base64);
          pdf_path = user.id + '/' + book.id + '.' + ext;
          const up = await client.storage.from('pdfs').upload(pdf_path, bytes, { contentType: MIME[ext], upsert: true });
          if (up.error) { console.warn('upload file', up.error.message); pdf_path = null; }
        } catch (e) { console.warn('file read', e.message); pdf_path = null; }
      }

      let text_path = null;
      if (textUri) {
        try {
          const base64 = await FileSystem.readAsStringAsync(textUri, { encoding: FileSystem.EncodingType.Base64 });
          const bytes = base64ToBytes(base64);
          text_path = user.id + '/' + book.id + '.txt';
          const up = await client.storage.from('pdfs').upload(text_path, bytes, { contentType: 'text/plain', upsert: true });
          if (up.error) { console.warn('upload text', up.error.message); text_path = null; }
        } catch (e) { console.warn('text read', e.message); text_path = null; }
      }

      const row = {
        id: book.id, owner: user.id, title: book.title, author: book.author, genre: book.genre, age: book.age,
        language: book.language, color: book.color, page_count: book.pageCount, summary: book.summaryFull,
        pdf_path, text_path, thumbnail_url: book.thumbnail || null,
      };
      // Colonnes optionnelles ajoutées après coup (migrations additives dans supabase/schema.sql) :
      // si l'une d'elles n'existe pas encore côté Supabase, on republie sans elle plutôt que d'échouer.
      const optionalCols = ['text_path', 'thumbnail_url'];
      let error;
      for (let attempt = 0; attempt <= optionalCols.length; attempt++) {
        ({ error } = await client.from('books').insert(row));
        if (!error) break;
        const missing = optionalCols.find((c) => c in row && new RegExp(c, 'i').test(error.message));
        if (!missing) break;
        console.warn(`books.${missing} manquant — exécutez la migration supabase/schema.sql. Détail :`, error.message);
        delete row[missing];
        if (missing === 'text_path') text_path = null;
      }
      if (error) throw new Error(error.message);
      book.pdf_path = pdf_path;
      book.text_path = text_path;
    },
    async deleteBook(book, user) {
      if (book.pdf_path) {
        try { await client.storage.from('pdfs').remove([book.pdf_path]); } catch (e) { console.warn('remove file', e.message); }
      }
      if (book.text_path) {
        try { await client.storage.from('pdfs').remove([book.text_path]); } catch (e) { console.warn('remove text', e.message); }
      }
      const { error } = await client.from('books').delete().eq('id', book.id);
      if (error) throw new Error(error.message);
    },
    async loadReviews() {
      const { data, error } = await client.from('reviews').select('*').order('created_at', { ascending: false });
      if (error) { console.warn('loadReviews', error.message); return {}; }
      const map = {};
      data.forEach((r) => {
        (map[r.book_id] = map[r.book_id] || []).push({
          id: r.id, user: r.user_name, initial: initialOf(r.user_name),
          rating: r.rating, comment: r.comment, date: timeAgo(r.created_at),
        });
      });
      return map;
    },
    async saveReview(bookId, review, user) {
      const { error } = await client.from('reviews').insert({
        book_id: bookId, user_id: user.id, user_name: user.name, rating: review.rating, comment: review.comment,
      });
      if (error) throw new Error(error.message);
    },
    async pdfUrl(book) {
      if (!book.pdf_path) return null;
      const { data } = client.storage.from('pdfs').getPublicUrl(book.pdf_path);
      return data ? data.publicUrl : null;
    },
    async textUrl(book) {
      if (!book.text_path) return null;
      const { data } = client.storage.from('pdfs').getPublicUrl(book.text_path);
      return data ? data.publicUrl : null;
    },
  };
}
