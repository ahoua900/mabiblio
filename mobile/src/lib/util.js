export function uid() {
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(16).slice(2, 10);
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
