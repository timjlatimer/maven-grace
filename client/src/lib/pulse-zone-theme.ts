// ─── Pulse Zone Theme Constants ───────────────────────────────────
// Race 20A — Color palette derived from mockups

export const PULSE_COLORS = {
  // Background
  bg: '#0A0A0A',
  bgCard: '#1A1A1A',
  bgCardLight: '#2A2A2A',

  // Gold / Amber family (home screen, battery)
  gold: '#D4A843',
  goldLight: '#E8C860',
  goldDark: '#B8922E',
  goldMuted: 'rgba(212, 168, 67, 0.3)',
  goldBg: 'rgba(212, 168, 67, 0.15)',

  // Teal / Cyan family (village, active states)
  teal: '#00CED1',
  tealLight: '#40E0D0',
  tealDark: '#008B8B',
  tealMuted: 'rgba(0, 206, 209, 0.3)',
  tealBg: 'rgba(0, 206, 209, 0.15)',

  // Orange family (dignity, warnings)
  orange: '#FFA500',
  orangeLight: '#FFB733',
  orangeMuted: 'rgba(255, 165, 0, 0.3)',

  // Pink / Rose family (buttons, give back)
  rose: '#E8A0B4',
  roseDark: '#C87D94',
  roseLight: '#F0B8C8',

  // Red family (alerts)
  red: '#FF6B6B',
  redMuted: 'rgba(255, 107, 107, 0.3)',

  // Green family (success)
  green: '#4CAF50',
  greenLight: '#66BB6A',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.5)',
  textGold: '#D4A843',
  textTeal: '#00CED1',
  textOrange: '#FFA500',
  textRose: '#E8A0B4',

  // Star
  starGray: 'rgba(255, 255, 255, 0.4)',
  starGold: '#FFD700',

  // Borders
  borderGold: 'rgba(212, 168, 67, 0.4)',
  borderTeal: 'rgba(0, 206, 209, 0.4)',
  borderMuted: 'rgba(255, 255, 255, 0.1)',

  // Village specific
  villageBg: '#0D1117',
  villageCard: '#161B22',
} as const;

// KPI Pill gradient backgrounds
export const KPI_PILL_STYLES = {
  battery: {
    background: 'linear-gradient(135deg, rgba(212, 168, 67, 0.9), rgba(184, 146, 46, 0.9))',
    border: '1px solid rgba(212, 168, 67, 0.6)',
  },
  dignity: {
    background: 'linear-gradient(135deg, rgba(212, 168, 67, 0.85), rgba(184, 146, 46, 0.85))',
    border: '1px solid rgba(212, 168, 67, 0.5)',
  },
  village: {
    background: 'linear-gradient(135deg, rgba(212, 168, 67, 0.8), rgba(184, 146, 46, 0.8))',
    border: '1px solid rgba(212, 168, 67, 0.5)',
  },
} as const;
