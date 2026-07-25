import * as FileSystem from 'expo-file-system/legacy';
import { db } from './db';

// Récupère le texte intégral d'un livre déjà ajouté à la bibliothèque :
// lit le fichier local s'il existe, sinon le récupère depuis le stockage
// distant (Supabase) et le met en cache localement pour les lectures hors-ligne.
export async function getBookText(book) {
  if (!book) return null;
  if (book.textUri) {
    try {
      const info = await FileSystem.getInfoAsync(book.textUri);
      if (info.exists) return await FileSystem.readAsStringAsync(book.textUri);
    } catch (e) {}
  }
  try {
    const url = await db.textUrl(book);
    if (!url) return null;
    const res = await fetch(url);
    if (!res.ok) return null;
    const text = await res.text();
    try {
      const dest = FileSystem.documentDirectory + book.id + '.txt';
      await FileSystem.writeAsStringAsync(dest, text);
      book.textUri = dest;
    } catch (e) {}
    return text;
  } catch (e) {
    return null;
  }
}
