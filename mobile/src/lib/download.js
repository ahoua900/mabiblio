import * as FileSystem from 'expo-file-system/legacy';
import { resolveDownload } from './bookSearch';
import { epubToHtml } from './epub';
import { uid } from './util';

// Télécharge un résultat de recherche en ligne (ou une entrée du catalogue de
// découverte) et l'ajoute à la bibliothèque de l'utilisateur. Partagé entre
// la recherche en ligne (ExploreScreen) et l'ouverture d'un livre du
// catalogue (BookScreen).
export async function downloadOnlineBook(app, result, onProgress) {
  const found = await resolveDownload(result);
  if (!found) {
    const err = new Error('no-file');
    err.code = 'NO_FILE';
    err.previewLink = result.previewLink || null;
    throw err;
  }

  const id = uid();
  const dest = FileSystem.documentDirectory + id + '.' + found.ext;
  const task = FileSystem.createDownloadResumable(found.url, dest, {}, (p) => {
    if (onProgress) onProgress(p.totalBytesExpectedToWrite > 0 ? p.totalBytesWritten / p.totalBytesExpectedToWrite : null);
  });
  const res = await task.downloadAsync();
  let localUri = res.uri;

  // EPUB → conversion en HTML lisible hors-ligne
  if (found.ext === 'epub') {
    if (onProgress) onProgress(null);
    try {
      const html = await epubToHtml(localUri);
      const htmlDest = FileSystem.documentDirectory + id + '.html';
      await FileSystem.writeAsStringAsync(htmlDest, html);
      await FileSystem.deleteAsync(localUri, { idempotent: true });
      localUri = htmlDest;
    } catch (e) {
      await FileSystem.deleteAsync(localUri, { idempotent: true }).catch(() => {});
      const err = new Error('epub-unreadable');
      err.code = 'EPUB_UNREADABLE';
      err.previewLink = result.previewLink || null;
      throw err;
    }
  }

  const book = {
    id,
    title: result.title,
    author: result.authors || result.author || 'Auteur inconnu',
    genre: result.genre || 'Roman',
    age: result.age || 'Adultes',
    color: result.color,
    thumbnail: result.thumbnail || null,
    rating: 0,
    language: result.language || 'Français',
    pageCount: 1,
    summaryFull: result.description || result.summaryFull || `Livre importé depuis ${found.source}.`,
    reviews: [],
    localUri,
    source: found.source,
  };
  await app.addBook(book, localUri);
  return book;
}
