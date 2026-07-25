// Nettoyage du texte extrait (PDF/EPUB/TXT) avant affichage et surtout avant
// synthese vocale : sans ca, la lecture audio bute sur des artefacts
// d'extraction qu'elle prononce litteralement ou qui la font trebucher
// (ligatures de police, mots coupes en fin de ligne, marqueurs d'italique en
// _souligne_ des textes Gutenberg, glyphes de police sans caractere reel...).

// Plages de caracteres a retirer : controle C0/C1, DEL, et zone d'usage prive
// Unicode (glyphes de police sans caractere reel associe — polices PDF mal
// encodees, affiches comme des carres et imprononcables par le moteur vocal).
// Codes numeriques (comparaison directe) plutot qu'une classe de regex avec
// des echappements unicode, pour eviter toute ambiguite de source.
function isStrippableCode(code) {
  if (code <= 8) return true; // C0 avant tabulation (0-8)
  if (code === 11 || code === 12) return true; // VT, FF
  if (code >= 14 && code <= 31) return true; // reste de C0
  if (code === 127) return true; // DEL
  if (code >= 128 && code <= 159) return true; // C1
  if (code >= 0xE000 && code <= 0xF8FF) return true; // zone d'usage prive
  return false;
}

// Espaces "exotiques" (insecable, cadratins, espace fine...) a normaliser en
// espace ordinaire avant de collapser les repetitions.
function isExoticSpaceCode(code) {
  if (code === 160) return true; // espace insecable
  if (code >= 0x2000 && code <= 0x200B) return true; // espaces typographiques + espace zero-largeur
  if (code === 0x202F || code === 0x205F || code === 0x3000) return true;
  return false;
}

function stripAndNormalizeChars(s) {
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    if (isStrippableCode(code)) continue;
    out += isExoticSpaceCode(code) ? ' ' : s[i];
  }
  return out;
}

export function cleanExtractedText(raw) {
  if (!raw) return '';
  let t = String(raw);

  // Ligatures typographiques issues du rendu PDF, illisibles telles quelles.
  t = t
    .replace(/ﬁ/g, 'fi')
    .replace(/ﬂ/g, 'fl')
    .replace(/ﬀ/g, 'ff')
    .replace(/ﬃ/g, 'ffi')
    .replace(/ﬄ/g, 'ffl');

  // Emphase en texte brut a la Gutenberg (_italique_, *gras*) : on garde le
  // mot, pas les marqueurs, sinon la voix prononce "souligne", "etoile"...
  t = t.replace(/_([^_\n]{1,80})_/g, '$1').replace(/\*([^*\n]{1,80})\*/g, '$1');

  // Mot coupe par un saut de ligne dans le PDF d'origine ("exem- ple").
  t = t.replace(/([a-zàâäéèêëïîôöùûüç])-\s+([a-zàâäéèêëïîôöùûüç])/gi, '$1$2');

  // Caracteres de controle, DEL, zone d'usage prive, espaces exotiques.
  t = stripAndNormalizeChars(t);

  // Espaces et sauts de ligne repetes -> un seul (en gardant les coupures de paragraphe).
  t = t.replace(/[ \t]{2,}/g, ' ');
  t = t.replace(/\n{3,}/g, '\n\n');

  return t.trim();
}
