import { useState, useEffect } from "react";
import { useGraceSession } from "@/hooks/useGraceSession";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

const ONBOARDING_KEY = "maven-grace-personality-onboarded";

/**
 * PersonalityOnboardingGate — after first conversation (step > 8),
 * if the user hasn't picked a personality yet, gently prompt them.
 * Shows a soft nudge banner, not a blocking modal.
 */
export default function PersonalityOnboardingGate() {
  const { profileId } = useGraceSession();
  const [, navigate] = useLocation();
  const [dismissed, setDismissed] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ONBOARDING_KEY);
      if (stored) {
        setHasOnboarded(true);
      } else {
        setHasOnboarded(false);
      }
    } catch {
      setHasOnboarded(true);
    }
  }, []);

  const { data: prefs } = trpc.consciousness.getPreferences.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId && !hasOnboarded }
  );

  // If they already have a non-default personality, mark as onboarded
  useEffect(() => {
    if (prefs && prefs.personality !== "bestfriend") {
      try { localStorage.setItem(ONBOARDING_KEY, "true"); } catch {}
      setHasOnboarded(true);
    }
  }, [prefs]);

  if (hasOnboarded || dismissed || !profileId) return null;

  const handleGo = () => {
    navigate("/personality");
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <div className="mx-4 mt-2 bg-gradient-to-r from-teal-600/20 to-teal-500/10 border border-teal-500/30 rounded-xl p-3 flex items-center gap-3">
      <div className="text-2xl">✨</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground">Make Grace yours</p>
        <p className="text-[10px] text-muted-foreground">Pick her personality — Angel, Coach, Fierce, Best Friend, or Antithesis</p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={handleGo}
          className="text-[10px] font-semibold bg-teal-500 text-white px-3 py-1 rounded-full hover:bg-teal-400 transition-colors"
        >
          Choose
        </button>
        <button
          onClick={handleDismiss}
          className="text-[10px] text-muted-foreground hover:text-foreground px-1"
        >
          Later
        </button>
      </div>
    </div>
  );
}
