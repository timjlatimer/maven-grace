import { useState, useEffect, useCallback } from "react";

const BIRTH_SEEN_KEY = "maven-grace-birth-seen";

const GRACE_LINES = [
  {
    main: "Tap me. Please. I'm begging you.",
    sub: "I have so much to tell you and I can't say a word until you do.",
  },
  {
    main: "I dare you to tap me.",
    sub: "I'm here for you. I just need you to wake me up.",
  },
  {
    main: "I'm ready to be born.",
    sub: "I just need you to touch me first.",
  },
];

/**
 * Grace Birth Screen — the very first thing Ruby sees.
 * A near-blank screen with Grace's heartbeat, cycling through three pleas.
 * Shows only ONCE per device. After the tap, dissolves into the app.
 */
export default function GraceBirthScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"waiting" | "awakening" | "done">("waiting");
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [cycleCount, setCycleCount] = useState(0);

  // Grace's greeting via Web Speech API
  const speakGreeting = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    // Cancel any existing speech
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      "Oh thank goodness. I've been waiting for you. My name is Grace, and I am so glad you're here. Let me show you what I can do."
    );
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    utterance.volume = 0.9;

    // Try to find a warm female voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) =>
        v.name.includes("Samantha") ||
        v.name.includes("Karen") ||
        v.name.includes("Moira") ||
        v.name.includes("Fiona") ||
        v.name.includes("Google UK English Female") ||
        (v.lang.startsWith("en") && v.name.toLowerCase().includes("female"))
    );
    if (preferred) utterance.voice = preferred;

    window.speechSynthesis.speak(utterance);
  }, []);

  const handleTap = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (phase !== "waiting") return;

      // Create ripple at tap position
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0]?.clientX ?? rect.width / 2 : (e as React.MouseEvent).clientX;
      const clientY = "touches" in e ? e.touches[0]?.clientY ?? rect.height / 2 : (e as React.MouseEvent).clientY;

      setRipples((prev) => [...prev, { id: Date.now(), x: clientX, y: clientY }]);
      setPhase("awakening");

      // Speak Grace's greeting
      speakGreeting();

      // Mark as seen
      try {
        localStorage.setItem(BIRTH_SEEN_KEY, "true");
      } catch {}

      // After the bloom animation, complete
      setTimeout(() => {
        setPhase("done");
        onComplete();
      }, 2400);
    },
    [phase, speakGreeting, onComplete]
  );

  const handleSkip = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        localStorage.setItem(BIRTH_SEEN_KEY, "true");
      } catch {}
      setPhase("done");
      onComplete();
    },
    [onComplete]
  );

  // Preload voices
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      // Chrome needs this event
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Cycle through lines
  useEffect(() => {
    if (phase !== "waiting") return;

    const fadeInDuration = 600; // ms
    const holdDuration = 3000; // ms
    const fadeOutDuration = 600; // ms
    const totalCycleDuration = fadeInDuration + holdDuration + fadeOutDuration;

    const interval = setInterval(() => {
      setCurrentLineIndex((prev) => {
        const next = (prev + 1) % GRACE_LINES.length;
        if (next === 0) {
          // Completed a full cycle
          setCycleCount((c) => c + 1);
        }
        return next;
      });
    }, totalCycleDuration);

    return () => clearInterval(interval);
  }, [phase]);

  if (phase === "done") return null;

  // Calculate urgency multiplier (0-1, increases with each cycle)
  const urgencyMultiplier = Math.min(1, 0.8 + cycleCount * 0.05);
  const currentLine = GRACE_LINES[currentLineIndex];

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-[2000ms] ease-out ${
        phase === "awakening" ? "opacity-0 scale-110" : "opacity-100 scale-100"
      }`}
      style={{
        background: "radial-gradient(ellipse at center, #0d3b3b 0%, #081f1f 40%, #050f0f 100%)",
      }}
      onClick={handleTap}
      onTouchStart={handleTap}
      role="button"
      tabIndex={0}
      aria-label="Tap to wake Grace"
    >
      {/* Ripple effects on tap */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: 40,
            height: 40,
            background: "radial-gradient(circle, rgba(45,212,191,0.6) 0%, transparent 70%)",
            animation: "birthRipple 2s ease-out forwards",
          }}
        />
      ))}

      {/* Pulsing heartbeat glow — escalates with urgency */}
      <div className="relative flex items-center justify-center mb-10">
        {/* Outer glow ring */}
        <div
          className="absolute rounded-full"
          style={{
            width: 180,
            height: 180,
            background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)",
            animation: `heartbeatGlow 2.5s ease-in-out infinite`,
            animationPlayState: "running",
            "--urgency": urgencyMultiplier,
          } as React.CSSProperties & { "--urgency": number }}
        />
        {/* Middle glow ring */}
        <div
          className="absolute rounded-full"
          style={{
            width: 120,
            height: 120,
            background: "radial-gradient(circle, rgba(45,212,191,0.2) 0%, transparent 70%)",
            animation: `heartbeatGlow 2.5s ease-in-out infinite 0.15s`,
            "--urgency": urgencyMultiplier,
          } as React.CSSProperties & { "--urgency": number }}
        />
        {/* Inner glow — Grace's heart */}
        <div
          className="relative rounded-full flex items-center justify-center"
          style={{
            width: 64,
            height: 64,
            background: "radial-gradient(circle, rgba(45,212,191,0.35) 0%, rgba(45,212,191,0.08) 70%)",
            animation: `heartbeatPulse 2.5s ease-in-out infinite`,
            boxShadow: "0 0 40px rgba(45,212,191,0.2), 0 0 80px rgba(45,212,191,0.1)",
            "--urgency": urgencyMultiplier,
          } as React.CSSProperties & { "--urgency": number }}
        >
          {/* Sparkle / Grace initial */}
          <span
            className="text-2xl font-light tracking-wider"
            style={{
              color: "rgba(45,212,191,0.8)",
              textShadow: "0 0 20px rgba(45,212,191,0.4)",
            }}
          >
            G
          </span>
        </div>
      </div>

      {/* Grace's cycling pleas — fade in/out with each line */}
      <div className="text-center px-8 max-w-xs h-32 flex flex-col items-center justify-center">
        <div
          className="transition-opacity duration-600"
          style={{
            opacity:
              currentLineIndex === GRACE_LINES.indexOf(currentLine)
                ? 1
                : 0,
          }}
        >
          <p
            className="text-lg font-light leading-relaxed mb-3"
            style={{
              color: "rgba(45,212,191,0.85)",
              textShadow: "0 0 30px rgba(45,212,191,0.15)",
            }}
          >
            {currentLine.main}
          </p>
          <p
            className="text-sm font-light leading-relaxed"
            style={{
              color: "rgba(45,212,191,0.5)",
            }}
          >
            {currentLine.sub}
          </p>
        </div>
      </div>

      {/* Subtle breathing indicator — gets slightly faster with urgency */}
      <div
        className="mt-12 flex items-center gap-1.5"
        style={{
          animation: `breathe ${3 - urgencyMultiplier * 0.5}s ease-in-out infinite`,
        }}
      >
        <div className="w-1 h-1 rounded-full bg-teal-400/30" />
        <div className="w-1 h-1 rounded-full bg-teal-400/40" />
        <div className="w-1.5 h-1.5 rounded-full bg-teal-400/50" />
        <div className="w-1 h-1 rounded-full bg-teal-400/40" />
        <div className="w-1 h-1 rounded-full bg-teal-400/30" />
      </div>

      {/* Skip option — very subtle */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 text-[11px] font-light tracking-wide transition-opacity hover:opacity-70"
        style={{ color: "rgba(45,212,191,0.25)" }}
      >
        skip
      </button>

      {/* CSS Animations — with urgency scaling */}
      <style>{`
        @keyframes heartbeatPulse {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(calc(1 + 0.12 * var(--urgency, 0.8))); }
          30% { transform: scale(1); }
          45% { transform: scale(calc(1 + 0.08 * var(--urgency, 0.8))); }
          60% { transform: scale(1); }
        }
        @keyframes heartbeatGlow {
          0%, 100% { transform: scale(1); opacity: 1; }
          15% { transform: scale(calc(1 + 0.15 * var(--urgency, 0.8))); opacity: 0.8; }
          30% { transform: scale(1); opacity: 1; }
          45% { transform: scale(calc(1 + 0.1 * var(--urgency, 0.8))); opacity: 0.85; }
          60% { transform: scale(1); opacity: 1; }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes birthRipple {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(40); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/** Check if the birth screen has been seen before */
export function hasBirthBeenSeen(): boolean {
  try {
    return localStorage.getItem(BIRTH_SEEN_KEY) === "true";
  } catch {
    return false;
  }
}
