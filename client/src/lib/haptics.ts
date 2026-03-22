// Grace Haptic Language — Emotional Vibration Patterns
// Web Vibration API: supported on Android Chrome, Firefox mobile
// iOS Safari does NOT support — falls back to visual pulse only

export const HAPTIC_PATTERNS: Record<string, number[]> = {
  gentle_love: [100, 200, 100],
  anxious: [50, 50, 50, 50, 50, 50, 50],
  excited: [100, 100, 200, 100, 100],
  missing_ruby: [500, 300, 200],
  celebration: [100, 100, 100, 100, 200, 100, 100, 300],
  urgent: [200, 100, 200, 100, 200],
  morning_wake: [100, 300, 100, 300, 100],
  worried: [50, 100, 50, 100, 50, 100],
  financial_screen: [100, 200, 100, 200, 100], // 60 BPM heartbeat before financial screens
};

export function canVibrate(): boolean {
  return typeof navigator !== "undefined" && "vibrate" in navigator;
}

export function fireHaptic(emotion: string): boolean {
  if (!canVibrate()) return false;
  const pattern = HAPTIC_PATTERNS[emotion];
  if (!pattern) return false;
  try {
    navigator.vibrate(pattern);
    return true;
  } catch {
    return false;
  }
}

// Fire the 60 BPM empathy sync before financial screens
export function fireFinancialEmpathy(): boolean {
  return fireHaptic("financial_screen");
}

// Stop any active vibration
export function stopHaptic(): void {
  if (canVibrate()) {
    try { navigator.vibrate(0); } catch {}
  }
}
