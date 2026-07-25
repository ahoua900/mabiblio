import * as FileSystem from 'expo-file-system/legacy';
import { cleanExtractedText } from './textClean';

// Caractères approximatifs par page « livre » (utilisé comme métadonnée de
// repli ; la pagination réelle du lecteur est recalculée à l'affichage).
const CHARS_PER_PAGE = 1400;

export function extOf(uri) {
  return (uri || '').split('?')[0].split('.').pop().toLowerCase();
}

export function estimatePageCount(text) {
  return Math.max(1, Math.ceil((text || '').length / CHARS_PER_PAGE));
}

// Retire balises et entités HTML pour ne garder qu'un texte simple, en
// conservant les sauts de paragraphe.
export function stripHtml(html) {
  return String(html || '')
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/(p|div|h[1-6]|li|br|tr)>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Extrait le texte brut d'un fichier local selon son extension. `engine` est
// l'instance de PdfTextEngine (WebView pdf.js) pour les PDF ; ignoré sinon.
// Retourne `null` si l'extraction échoue ou n'est pas supportée pour ce type.
export async function extractBookText(ext, uri, engine) {
  if (!uri) return null;
  try {
    let text = null;
    if (ext === 'pdf') {
      if (!engine) return null;
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      text = await engine.extract(base64);
    } else if (ext === 'html' || ext === 'htm') {
      const html = await FileSystem.readAsStringAsync(uri);
      text = stripHtml(html);
    } else if (ext === 'txt') {
      text = await FileSystem.readAsStringAsync(uri);
    }
    return text ? cleanExtractedText(text) : text;
  } catch (e) {
    return null;
  }
}
