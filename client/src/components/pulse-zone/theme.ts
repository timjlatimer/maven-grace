/**
 * Pulse Zone Theme Tokens — Runner B
 * Architecture-first: all tokens typed and documented.
 */

export const PULSE_THEME = {
  bg: {
    primary: "#0D0D08",
    village: "#0A0F1A",
    card: "#1A1A12",
    cardCool: "#111827",
    elevated: "#1A2A28",
    overlay: "rgba(0,0,0,0.6)",
  },
  accent: {
    amber: "#D4A843",
    amberLight: "#E8A020",
    teal: "#2DD4BF",
    tealDark: "#1A9E8F",
    rose: "#D4878F",
    red: "#E05050",
    cyan: "#22D3EE",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "rgba(255,255,255,0.6)",
    muted: "rgba(255,255,255,0.4)",
    faint: "rgba(255,255,255,0.3)",
    amber: "#D4A843",
    teal: "#2DD4BF",
    cyan: "#22D3EE",
    rose: "#D4878F",
  },
  border: {
    subtle: "rgba(255,255,255,0.05)",
    warm: "rgba(212,168,67,0.15)",
    teal: "rgba(45,212,191,0.2)",
    tealStrong: "rgba(45,212,191,0.3)",
    amber: "rgba(212,168,67,0.3)",
  },
  gradient: {
    heartbeat: "radial-gradient(circle, #D4A843 0%, #8B6914 40%, #3D2E08 70%, #0D0D08 100%)",
    tpRoll: "linear-gradient(135deg, #D4A08F, #C09080)",
    ctaTeal: "linear-gradient(135deg, #2DD4BF, #1A9E8F)",
  },
  spacing: { screenPadding: 16, cardPadding: 12, sectionGap: 24 },
  radius: { pill: 9999, card: 12, button: 16 },
  animation: { fast: 200, normal: 400, slow: 800, ring: 2000 },
} as const;

export type PulseTheme = typeof PULSE_THEME;
