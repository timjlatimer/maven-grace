import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

const VOICE_ENABLED_KEY = "maven-grace-voice-enabled";

/**
 * Grace Voice Enable Button — small sound toggle in the corner
 * When tapped, enables Grace's voice for the session
 */
export default function GraceVoiceToggle() {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Load voice preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(VOICE_ENABLED_KEY);
      if (saved === "true") {
        setVoiceEnabled(true);
        setHasInteracted(true);
      }
    } catch {}
  }, []);

  const handleToggle = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    setHasInteracted(true);

    try {
      localStorage.setItem(VOICE_ENABLED_KEY, newState ? "true" : "false");
    } catch {}

    // Optional: Provide feedback
    if (newState && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance("Grace is ready to speak.");
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = 0.8;

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.name.includes("Samantha") ||
          v.name.includes("Karen") ||
          v.name.includes("Moira") ||
          v.name.includes("Fiona") ||
          (v.lang.startsWith("en") && v.name.toLowerCase().includes("female"))
      );
      if (preferred) utterance.voice = preferred;

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center justify-center w-8 h-8 rounded-full transition-all hover:bg-primary/10 active:scale-95"
      title={voiceEnabled ? "Grace voice is on" : "Enable Grace voice"}
      aria-label={voiceEnabled ? "Disable Grace voice" : "Enable Grace voice"}
      style={{
        color: voiceEnabled ? "var(--maven-teal)" : "var(--muted-foreground)",
      }}
    >
      {voiceEnabled ? (
        <Volume2 className="w-4 h-4" />
      ) : (
        <VolumeX className="w-4 h-4" />
      )}
    </button>
  );
}

/**
 * Check if voice is enabled for this session
 */
export function isVoiceEnabled(): boolean {
  try {
    return localStorage.getItem(VOICE_ENABLED_KEY) === "true";
  } catch {
    return false;
  }
}
