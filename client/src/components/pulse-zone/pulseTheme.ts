// Pulse Zone — Warehouse World Color Tokens
// "It's expensive to be poor." We think that's a crime in society, and we're trying to change it.

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

  // Village-specific
  villageBg: '#0D0D1A',
  villageCard: '#1A1A2E',

  // North Star
  darkStarfield: '#0D0D08',
  deepTeal: '#0D3330',
} as const;

export type ScoreColor = 'teal' | 'orange' | 'gold';

export function getScoreColor(color: ScoreColor): string {
  switch (color) {
    case 'teal': return COLORS.teal;
    case 'orange': return COLORS.scoreOrange;
    case 'gold': return COLORS.scoreGold;
  }
}

export function getDotColor(color: 'teal' | 'orange' | 'red'): string {
  switch (color) {
    case 'teal': return COLORS.dotTeal;
    case 'orange': return COLORS.dotOrange;
    case 'red': return COLORS.dotRed;
  }
}

export function getBadgeColor(color: 'teal' | 'orange' | 'red'): string {
  switch (color) {
    case 'teal': return COLORS.badgeTeal;
    case 'orange': return COLORS.badgeOrange;
    case 'red': return COLORS.badgeRed;
  }
}
