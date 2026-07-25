function uuidv4() {
  if (typeof crypto === 'object' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  if (typeof crypto === 'object' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  let timestamp = new Date().getTime();
  let perfTimestamp = (typeof performance === 'object' && typeof performance.now === 'function') ? performance.now() : 0;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16;
    if (timestamp > 0) {
      r = (timestamp + r) % 16 | 0;
      timestamp = Math.floor(timestamp / 16);
    } else {
      r = (perfTimestamp + r) % 16 | 0;
      perfTimestamp = Math.floor(perfTimestamp / 16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export function uid() {
  return uuidv4();
}

export function initialOf(name) {
  const t = (name || '').trim();
  return t ? t[0].toUpperCase() : '?';
}

export function timeAgo(iso) {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (isNaN(d)) return '';
  if (d < 60) return 'à l’instant';
  if (d < 3600) return 'il y a ' + Math.floor(d / 60) + ' min';
  if (d < 86400) return 'il y a ' + Math.floor(d / 3600) + ' h';
  return 'il y a ' + Math.floor(d / 86400) + ' j';
}

export function fmtDuration(sec) {
  sec = Math.floor(sec || 0);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return h + 'h' + String(m).padStart(2, '0');
  return m + ' min';
}
