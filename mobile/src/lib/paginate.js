// Découpe un texte en « pages » qui tiennent dans un cadre donné, pour une
// lecture paginée façon livre plutôt qu'un défilement continu. L'estimation
// est approximative (pas de mesure réelle du texte rendu) mais suffisante
// pour un rendu de type page qui tourne, cohérent quelle que soit la taille
// de police ou les marges choisies.
export function estimateCharsPerPage(width, height, fontSize) {
  const avgCharWidth = fontSize * 0.52;
  const lineHeight = fontSize * 1.85;
  const charsPerLine = Math.max(10, Math.floor(width / avgCharWidth));
  const lines = Math.max(3, Math.floor(height / lineHeight));
  return Math.max(200, charsPerLine * lines);
}

export function paginateText(text, charsPerPage) {
  const clean = (text || '').trim();
  if (!clean) return [''];

  const paragraphs = clean.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const pages = [];
  let cur = '';

  const flush = () => {
    if (cur) { pages.push(cur.trim()); cur = ''; }
  };

  for (const para of paragraphs) {
    let remaining = para;
    while (remaining.length > charsPerPage) {
      const room = charsPerPage - cur.length - (cur ? 2 : 0);
      if (room > 40) {
        let cut = remaining.lastIndexOf(' ', room);
        if (cut < room * 0.5) cut = room;
        cur += (cur ? '\n\n' : '') + remaining.slice(0, cut).trim();
        flush();
        remaining = remaining.slice(cut).trim();
      } else {
        flush();
      }
    }
    if (!cur) {
      cur = remaining;
    } else if (cur.length + remaining.length + 2 <= charsPerPage) {
      cur += '\n\n' + remaining;
    } else {
      flush();
      cur = remaining;
    }
  }
  flush();

  return pages.length ? pages : [clean];
}
