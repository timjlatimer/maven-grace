import { useEffect, useRef } from "react";
import { fireFinancialEmpathy } from "@/lib/haptics";

/**
 * Fires a 60 BPM haptic heartbeat when a financial screen mounts.
 * Move 37 #1 — Haptic Empathy Sync.
 * Grace's heartbeat fires before Ruby sees any financial data.
 * Android web only — iOS gracefully does nothing.
 */
export function useHapticEmpathy() {
  const fired = useRef(false);
  useEffect(() => {
    if (!fired.current) {
      fired.current = true;
      fireFinancialEmpathy();
    }
  }, []);
}
