import { Platform } from 'react-native';

export const colors = {
  bg: '#EDEDF0',
  surface: '#FFFFFF',
  text: '#141418',
  muted: '#8A8A90',
  muted2: '#B6B6BC',
  line: '#ECECEF',
  soft: '#F5F5F7',
  soft2: '#EFEFF2',
  red: '#E4002B',
  redInk: '#B80022',
  redSoft: '#FDE7EC',
};

export const radius = { lg: 22, md: 16, sm: 12 };

export const GENRE_COLORS = {
  Roman: '#E4002B',
  'Bande dessinée': '#F59E0B',
  Essai: '#16A34A',
  Scolaire: '#7C3AED',
};

// Police serif « éditoriale » utilisée pour les titres.
export const serif = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });

// Thèmes de lecture (tonalité)
export const THEMES = {
  light: { label: 'Clair', bg: '#FFFFFF', fg: '#1A1A1A', sub: '#8A8A90', chip: '#F1F1F4' },
  sepia: { label: 'Sépia', bg: '#F4ECD8', fg: '#5B4636', sub: '#9A8467', chip: '#EADFC4' },
  dark: { label: 'Sombre', bg: '#121316', fg: '#C9C9CE', sub: '#77777E', chip: '#22242A' },
  charcoal: { label: 'Charbon', bg: '#2C2F36', fg: '#C6C9D0', sub: '#8B8F98', chip: '#3A3E47' },
};

// Familles de police pour la lecture
export const FONTS = {
  serif: { label: 'Littéraire', family: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }) },
  sans: { label: 'Moderne', family: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }) },
  elegant: { label: 'Élégant', family: Platform.select({ ios: 'Palatino', android: 'serif', default: 'serif' }) },
};

// Marges de lecture (padding horizontal)
export const MARGINS = {
  narrow: { label: 'Étroit', pad: 18 },
  normal: { label: 'Normal', pad: 30 },
  wide: { label: 'Large', pad: 48 },
};
