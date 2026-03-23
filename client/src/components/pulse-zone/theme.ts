// Pulse Zone — Warehouse World Color Tokens
// Canonical color reference from tech spec v1.1

export const COLORS = {
  // Backgrounds
  background: '#0D0D08',
  cardBackground: '#1A1A12',
  cardBackgroundElevated: '#242418',

  // Primary Accents
  amber: '#D4A843',
  amberPill: '#B8922E',
  amberLight: '#E8C060',

  // Teal Family
  teal: '#2DD4BF',
  tealDark: '#1A9E8F',
  tealLight: '#5EEAD4',

  // Score Colors
  scoreOrange: '#E8A020',
  scoreGold: '#FFD700',

  // CTA Colors
  roseCTA: '#D4878F',
  tealCTA: '#2DD4BF',

  // Badge Colors
  badgeTeal: '#2DD4BF',
  badgeOrange: '#E8A020',
  badgeRed: '#E05050',

  // Icon Colors
  purple: '#A855F7',
  pink: '#E8A0A0',
  white: '#FFFFFF',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',

  // Borders
  borderAmber: '#D4A84380',
  borderTeal: '#2DD4BF80',

  // Indicators
  dotTeal: '#2DD4BF',
  dotOrange: '#E8A020',
  dotRed: '#E05050',

  // Village specific
  villageBg: '#0A0F1A',
  villageCard: '#111827',

  // North Star
  darkStarfield: '#0D0D08',
  deepTeal: '#0D3330',
} as const;

export type ColorKey = keyof typeof COLORS;
