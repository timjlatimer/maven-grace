import { useCallback } from "react";
import { fireHaptic, canVibrate } from "@/lib/haptics";

/**
 * Emotional haptic feedback for Grace's consciousness moments.
 * Fires specific vibration patterns tied to Grace's emotional state.
 * Android web only — iOS falls back to visual-only.
 */
export function useEmotionalHaptic() {
  const fireCelebration = useCallback(() => {
    fireHaptic("celebration");
  }, []);

  const fireWorried = useCallback(() => {
    fireHaptic("worried");
  }, []);

  const fireGentleLove = useCallback(() => {
    fireHaptic("gentle_love");
  }, []);

  const fireExcited = useCallback(() => {
    fireHaptic("excited");
  }, []);

  const fireMorningWake = useCallback(() => {
    fireHaptic("morning_wake");
  }, []);

  const fireMissingRuby = useCallback(() => {
    fireHaptic("missing_ruby");
  }, []);

  return {
    canVibrate: canVibrate(),
    fireCelebration,
    fireWorried,
    fireGentleLove,
    fireExcited,
    fireMorningWake,
    fireMissingRuby,
  };
}
