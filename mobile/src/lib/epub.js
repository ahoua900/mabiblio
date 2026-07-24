import * as FileSystem from 'expo-file-system/legacy';
import JSZip from 'jszip';

// Convertit un fichier EPUB en une page HTML unique, lisible hors-ligne dans la
// liseuse (WebView). On concatène le corps des chapitres dans l'ordre de la
// « spine », en retirant les images (qui ne seraient pas résolues).
export async function epubToHtml(fileUri) {
  const b64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
  const zip = await JSZip.loadAsync(b64, { base64: true });

  // 1. Localiser le fichier OPF via META-INF/container.xml
  const containerFile = zip.file('META-INF/container.xml');
  if (!containerFile) throw new Error('EPUB invalide (container manquant)');
  const container = await containerFile.async('text');
  const opfPath = (/full-path="([^"]+)"/.exec(container) || [])[1];
  if (!opfPath) throw new Error('EPUB invalide (OPF introuvable)');
  const opfDir = opfPath.indexOf('/') !== -1 ? opfPath.replace(/\/[^/]*$/, '/') : '';
  const opf = await zip.file(opfPath).async('text');

  // 2. Manifeste : id -> { href, media }
  const manifest = {};
  const itemRe = /<item\b[^>]*>/g;
  let m;
  while ((m = itemRe.exec(opf))) {
    const id = (/id="([^"]+)"/.exec(m[0]) || [])[1];
    const href = (/href="([^"]+)"/.exec(m[0]) || [])[1];
    const media = (/media-type="([^"]+)"/.exec(m[0]) || [])[1] || '';
    if (id && href) manifest[id] = { href: decodeURIComponent(href), media };
  }

  // 3. Ordre de lecture (spine)
  const spine = [];
  const refRe = /<itemref\b[^>]*idref="([^"]+)"[^>]*>/g;
  while ((m = refRe.exec(opf))) spine.push(m[1]);

  // 4. Concaténer les corps XHTML
  let body = '';
  for (const id of spine) {
    const item = manifest[id];
    if (!item) continue;
    if (item.media && item.media.indexOf('html') === -1 && item.media.indexOf('xml') === -1) continue;
    const file = zip.file(opfDir + item.href) || zip.file(item.href);
    if (!file) continue;
    const xhtml = await file.async('text');
    const inner = (/<body[^>]*>([\s\S]*?)<\/body>/i.exec(xhtml) || [])[1] || xhtml;
    body += inner + '\n<hr class="chap"/>\n';
  }
  body = body.replace(/<img[^>]*>/gi, '').replace(/<svg[\s\S]*?<\/svg>/gi, '');

  return (
    '<!doctype html><html><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<style>' +
    'body{font-family:Georgia,serif;line-height:1.75;padding:20px 22px;color:#1a1a1a;font-size:18px}' +
    'h1,h2,h3{line-height:1.3}img{max-width:100%}' +
    'hr.chap{border:none;border-top:1px solid #e2e2e2;margin:30px 0}' +
    'a{color:#E4002B}' +
    '</style></head><body>' + body + '</body></html>'
  );
}
