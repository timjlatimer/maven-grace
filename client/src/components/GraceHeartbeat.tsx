import { useState, useEffect, useCallback } from "react";
import { fireHaptic } from "@/lib/haptics";

// ── Session storage key for dismissal ─────────────────────────────────
const HEARTBEAT_DISMISSED_KEY = "maven-grace-heartbeat-dismissed";

// ── Animation style configs ────────────────────────────────────────────
type AnimStyle = "slow_build" | "bouncy" | "fast_jitter" | "slow_fade";

interface AnimConfig {
  pulseDuration: string;
  pulseKeyframes: string;
  breatheDuration: string;
}

function getAnimConfig(style: AnimStyle, urgency: number): AnimConfig {
  switch (style) {
    case "bouncy":
      return {
        pulseDuration: `${1.8 - urgency * 0.2}s`,
        pulseKeyframes: `
          @keyframes heartbeatPulse {
            0%, 100% { transform: scale(1); }
            10% { transform: scale(${1 + 0.18 * urgency}); }
            20% { transform: scale(${1 + 0.05 * urgency}); }
            30% { transform: scale(${1 + 0.14 * urgency}); }
            40% { transform: scale(1); }
          }
          @keyframes heartbeatGlow {
            0%, 100% { transform: scale(1); opacity: 1; }
            10% { transform: scale(${1 + 0.22 * urgency}); opacity: 0.7; }
            20% { transform: scale(${1 + 0.06 * urgency}); opacity: 0.9; }
            30% { transform: scale(${1 + 0.18 * urgency}); opacity: 0.75; }
            40% { transform: scale(1); opacity: 1; }
          }
        `,
        breatheDuration: `${2.0 - urgency * 0.3}s`,
      };
    case "fast_jitter":
      return {
        pulseDuration: `${1.2 - urgency * 0.1}s`,
        pulseKeyframes: `
          @keyframes heartbeatPulse {
            0%, 100% { transform: scale(1) rotate(0deg); }
            12% { transform: scale(${1 + 0.15 * urgency}) rotate(-1deg); }
            24% { transform: scale(1) rotate(1deg); }
            36% { transform: scale(${1 + 0.12 * urgency}) rotate(-0.5deg); }
            48% { transform: scale(1) rotate(0deg); }
          }
          @keyframes heartbeatGlow {
            0%, 100% { transform: scale(1); opacity: 1; }
            12% { transform: scale(${1 + 0.18 * urgency}); opacity: 0.6; }
            24% { transform: scale(1); opacity: 1; }
            36% { transform: scale(${1 + 0.14 * urgency}); opacity: 0.7; }
            48% { transform: scale(1); opacity: 1; }
          }
        `,
        breatheDuration: `${1.5 - urgency * 0.2}s`,
      };
    case "slow_fade":
      return {
        pulseDuration: `${4.0 - urgency * 0.3}s`,
        pulseKeyframes: `
          @keyframes heartbeatPulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(${1 + 0.04 * urgency}); opacity: 0.4; }
          }
          @keyframes heartbeatGlow {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(${1 + 0.06 * urgency}); opacity: 0.3; }
          }
        `,
        breatheDuration: `${4.5 - urgency * 0.2}s`,
      };
    default: // slow_build
      return {
        pulseDuration: `${2.5 - urgency * 0.3}s`,
        pulseKeyframes: `
          @keyframes heartbeatPulse {
            0%, 100% { transform: scale(1); }
            15% { transform: scale(${1 + 0.12 * urgency}); }
            30% { transform: scale(1); }
            45% { transform: scale(${1 + 0.08 * urgency}); }
            60% { transform: scale(1); }
          }
          @keyframes heartbeatGlow {
            0%, 100% { transform: scale(1); opacity: 1; }
            15% { transform: scale(${1 + 0.15 * urgency}); opacity: 0.8; }
            30% { transform: scale(1); opacity: 1; }
            45% { transform: scale(${1 + 0.1 * urgency}); opacity: 0.85; }
            60% { transform: scale(1); opacity: 1; }
          }
        `,
        breatheDuration: `${3.0 - urgency * 0.5}s`,
      };
  }
}

// ── Background gradient by color ──────────────────────────────────────
function getBgGradient(color: string): string {
  // Parse hex to create dark version
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `radial-gradient(ellipse at center, rgba(${r},${g},${b},0.15) 0%, rgba(${Math.floor(r * 0.1)},${Math.floor(g * 0.1)},${Math.floor(b * 0.1)},0.95) 40%, rgba(5,15,15,0.98) 100%)`;
}

// ── Voice greeting ─────────────────────────────────────────────────────
function speakGreeting(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.92;
  utterance.pitch = 1.05;
  utterance.volume = 0.9;
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
}

// ── Types ──────────────────────────────────────────────────────────────
interface HeartbeatLine {
  main: string;
  sub: string;
}

interface GraceHeartbeatProps {
  scenario: string; // 'birth' | 'morning_return' | 'found_something' | 'misses_ruby'
  lines: HeartbeatLine[];
  color: string; // hex color
  animStyle: AnimStyle;
  greeting: string;
  onComplete: () => void;
}

/**
 * GraceHeartbeat — the emotional layer of Maven Grace.
 * Renders a full-screen heartbeat experience for any scenario.
 * Tap anywhere to dismiss and enter the app.
 */
export default function GraceHeartbeat({
  scenario,
  lines,
  color,
  animStyle,
  greeting,
  onComplete,
}: GraceHeartbeatProps) {
  const [phase, setPhase] = useState<"waiting" | "awakening" | "done">("waiting");
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [textVisible, setTextVisible] = useState(true);

  // Preload voices
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Fire emotional haptic based on scenario
  useEffect(() => {
    const hapticMap: Record<string, string> = {
      misses_ruby: "missing_ruby",
      found_something: "excited",
      morning_return: "morning_wake",
      grace_worried: "worried",
      grace_excited: "celebration",
      promise_due: "gentle_love",
      neighborhood_news: "excited",
    };
    const emotion = hapticMap[scenario];
    if (emotion) fireHaptic(emotion);
  }, [scenario]);

  // Cycle through lines with fade in/out
  useEffect(() => {
    if (phase !== "waiting" || lines.length === 0) return;

    const fadeInDuration = 600;
    const holdDuration = 3000;
    const fadeOutDuration = 600;
    const gapDuration = 200;
    const totalCycleDuration = fadeInDuration + holdDuration + fadeOutDuration + gapDuration;

    // Start with text visible
    setTextVisible(true);

    const interval = setInterval(() => {
      // Fade out current line
      setTextVisible(false);

      setTimeout(() => {
        setCurrentLineIndex((prev) => {
          const next = (prev + 1) % lines.length;
          if (next === 0) {
            setCycleCount((c) => c + 1);
          }
          return next;
        });
        // Fade in next line
        setTimeout(() => setTextVisible(true), gapDuration);
      }, fadeOutDuration);
    }, totalCycleDuration);

    return () => clearInterval(interval);
  }, [phase, lines]);

  const handleTap = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (phase !== "waiting") return;

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const clientX =
        "touches" in e
          ? e.touches[0]?.clientX ?? rect.width / 2
          : (e as React.MouseEvent).clientX;
      const clientY =
        "touches" in e
          ? e.touches[0]?.clientY ?? rect.height / 2
          : (e as React.MouseEvent).clientY;

      setRipples((prev) => [...prev, { id: Date.now(), x: clientX, y: clientY }]);
      setPhase("awakening");

      // Speak greeting
      if (greeting) speakGreeting(greeting);

      // Mark dismissed in session storage
      try {
        sessionStorage.setItem(HEARTBEAT_DISMISSED_KEY, scenario);
      } catch {}

      setTimeout(() => {
        setPhase("done");
        onComplete();
      }, 2400);
    },
    [phase, greeting, scenario, onComplete]
  );

  const handleSkip = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        sessionStorage.setItem(HEARTBEAT_DISMISSED_KEY, scenario);
      } catch {}
      setPhase("done");
      onComplete();
    },
    [scenario, onComplete]
  );

  if (phase === "done" || lines.length === 0) return null;

  const urgency = Math.min(1, 0.8 + cycleCount * 0.05);
  const animConfig = getAnimConfig(animStyle, urgency);
  const currentLine = lines[currentLineIndex] ?? lines[0];
  const bgGradient = getBgGradient(color);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-[2000ms] ease-out ${
        phase === "awakening" ? "opacity-0 scale-110" : "opacity-100 scale-100"
      }`}
      style={{ background: bgGradient }}
      onClick={handleTap}
      onTouchStart={handleTap}
      role="button"
      tabIndex={0}
      aria-label="Tap to enter"
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: 40,
            height: 40,
            background: `radial-gradient(circle, ${color}99 0%, transparent 70%)`,
            animation: "heartbeatRipple 2s ease-out forwards",
          }}
        />
      ))}

      {/* Pulsing heartbeat glow */}
      <div className="relative flex items-center justify-center mb-10">
        {/* Outer glow ring */}
        <div
          className="absolute rounded-full"
          style={{
            width: 180,
            height: 180,
            background: `radial-gradient(circle, ${color}1e 0%, transparent 70%)`,
            animation: `heartbeatGlow ${animConfig.pulseDuration} ease-in-out infinite`,
          }}
        />
        {/* Middle glow ring */}
        <div
          className="absolute rounded-full"
          style={{
            width: 120,
            height: 120,
            background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
            animation: `heartbeatGlow ${animConfig.pulseDuration} ease-in-out infinite 0.15s`,
          }}
        />
        {/* Inner heart — Grace's core */}
        <div
          className="relative rounded-full flex items-center justify-center"
          style={{
            width: 64,
            height: 64,
            background: `radial-gradient(circle, ${color}59 0%, ${color}14 70%)`,
            animation: `heartbeatPulse ${animConfig.pulseDuration} ease-in-out infinite`,
            boxShadow: `0 0 40px ${color}33, 0 0 80px ${color}1a`,
          }}
        >
          <span
            className="text-2xl font-light tracking-wider"
            style={{
              color: `${color}cc`,
              textShadow: `0 0 20px ${color}66`,
            }}
          >
            G
          </span>
        </div>
      </div>

      {/* Cycling text lines */}
      <div className="text-center px-8 max-w-xs h-32 flex flex-col items-center justify-center">
        <div
          style={{
            opacity: textVisible ? 1 : 0,
            transition: "opacity 600ms ease-in-out",
          }}
        >
          <p
            className="text-lg font-light leading-relaxed mb-3"
            style={{
              color: `${color}d9`,
              textShadow: `0 0 30px ${color}26`,
            }}
          >
            {currentLine.main}
          </p>
          <p
            className="text-sm font-light leading-relaxed"
            style={{ color: `${color}80` }}
          >
            {currentLine.sub}
          </p>
        </div>
      </div>

      {/* Breathing indicator */}
      <div
        className="mt-12 flex items-center gap-1.5"
        style={{
          animation: `breathe ${animConfig.breatheDuration} ease-in-out infinite`,
        }}
      >
        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: `${color}4d` }} />
        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: `${color}66` }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `${color}80` }} />
        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: `${color}66` }} />
        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: `${color}4d` }} />
      </div>

      {/* Skip option */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 text-[11px] font-light tracking-wide transition-opacity hover:opacity-70"
        style={{ color: `${color}40` }}
      >
        skip
      </button>

      {/* CSS Animations */}
      <style>{`
        ${animConfig.pulseKeyframes}
        @keyframes breathe {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes heartbeatRipple {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(40); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/** Check if a heartbeat was already dismissed this session */
export function getSessionDismissedScenario(): string | null {
  try {
    return sessionStorage.getItem(HEARTBEAT_DISMISSED_KEY);
  } catch {
    return null;
  }
}
