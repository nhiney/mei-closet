/**
 * Mei Closet Design Tokens (JS Constants)
 * Use these for inline styles or components that need JS values.
 * Note: These values should stay in sync with /theme/*.css
 */

export const COLORS = {
  primary: '#5D4037',
  accent: '#D8A7A7',
  background: '#F7F3EE',
  foreground: '#2B2B2B',
  success: '#7C897B',
  error: '#B71C1C',
} as const;

export const FONTS = {
  main: "'Montserrat', sans-serif",
  serif: "'Playfair Display', serif",
  handwritten: "'Dancing Script', cursive",
} as const;

export const RADII = {
  sm: '4px',
  md: '12px',
  lg: '24px',
} as const;
