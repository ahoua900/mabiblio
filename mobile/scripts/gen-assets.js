/*
 * Génère les icônes et le splash à partir de SVG (marque Lectura : carré rouge + livre blanc).
 *
 * Usage :  cd mobile && npm i -D sharp && node scripts/gen-assets.js
 * (sharp n'est nécessaire QUE pour régénérer les visuels, pas à l'exécution de l'app.)
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets');
fs.mkdirSync(OUT, { recursive: true });

const RED = '#E4002B';
const BOOK =
  '<path d="M4 19.5V6a2 2 0 0 1 2-2h13.5v15.5H6a2 2 0 0 0-2 2Z"/>' +
  '<path d="M20 17.5H6.5A2 2 0 0 0 4.5 19"/>';

function glyph(x, y, size, sw = 1.7, color = '#FFFFFF') {
  return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${BOOK}</svg>`;
}

const icon = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><rect width="1024" height="1024" fill="${RED}"/>${glyph(262, 268, 500, 1.6)}</svg>`;
const adaptive = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">${glyph(300, 306, 424, 1.7)}</svg>`;
const splash = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><rect x="202" y="202" width="620" height="620" rx="150" fill="${RED}"/>${glyph(360, 368, 304, 1.7)}</svg>`;
const favicon = `<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="11" fill="${RED}"/>${glyph(12, 12.5, 24, 1.9)}</svg>`;

async function make(svg, file, size) {
  await sharp(Buffer.from(svg), { density: 384 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(OUT, file));
  console.log('wrote', file);
}

(async () => {
  await make(icon, 'icon.png', 1024);
  await make(adaptive, 'adaptive-icon.png', 1024);
  await make(splash, 'splash-icon.png', 1024);
  await make(favicon, 'favicon.png', 48);
  console.log('done');
})();
