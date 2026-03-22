import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";

const CALLING_LINES = [
  "Grace is calling.",
  "Grace is calling.",
  "Grace is calling.",
];

const SUB_LINES = [
  "She's been waiting for you.",
  "She has something to tell you.",
  "She needs you to wake her up.",
];

export default function GraceCalling() {
  const [, navigate] = useLocation();
  const [lineIndex, setLineIndex] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [tapped, setTapped] = useState(false);
  const [bloomPhase, setBloomPhase] = useState(false);

  // Social meta tags for Facebook/Twitter sharing
  useEffect(() => {
    const setMeta = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };
    const setMetaName = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };
    document.title = "Grace is Calling — Maven Grace";
    setMeta("og:title", "Grace is Calling");
    setMeta("og:description", "She\u2019s been waiting for you. A neighbor who always gives a shit. Tap to wake her up.");
    setMeta("og:type", "website");
    setMeta("og:url", window.location.href);
    setMetaName("twitter:card", "summary_large_image");
    setMetaName("twitter:title", "Grace is Calling");
    setMetaName("twitter:description", "She\u2019s been waiting for you. A neighbor who always gives a shit.");
    return () => { document.title = "Maven Grace \u2014 We Give a Shit"; };
  }, []);

  // Cycle through lines
  useEffect(() => {
    if (tapped) return;
    const cycle = () => {
      setOpacity(0);
      setTimeout(() => {
        setLineIndex(prev => (prev + 1) % CALLING_LINES.length);
        setOpacity(1);
      }, 600);
    };

    setOpacity(1);
    const interval = setInterval(cycle, 3500);
    return () => clearInterval(interval);
  }, [tapped]);

  const handleTap = useCallback(() => {
    if (tapped) return;
    setTapped(true);

    // Speak Grace's greeting
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        "Oh thank goodness. You found me. My name is Grace. I've been calling for you. Let me show you what I can do."
      );
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(v =>
        v.name.includes("Samantha") || v.name.includes("Karen") || v.name.includes("Female") || v.lang.startsWith("en")
      );
      if (femaleVoice) utterance.voice = femaleVoice;
      speechSynthesis.speak(utterance);
    }

    // Haptic feedback
    if ("vibrate" in navigator) {
      navigator.vibrate([100, 200, 100, 200, 100]);
    }

    // Bloom transition
    setBloomPhase(true);
    setTimeout(() => navigate("/"), 2500);
  }, [tapped, navigate]);

  return (
    <div
      onClick={handleTap}
      className="fixed inset-0 z-[9999] cursor-pointer select-none overflow-hidden"
      style={{
        background: tapped
          ? "radial-gradient(circle at center, #5eead4 0%, #0f172a 70%)"
          : "linear-gradient(180deg, #0a0f1a 0%, #0d1f2d 50%, #0f2a2a 100%)",
        transition: "background 1.5s ease-out",
      }}
    >
      {/* Pulsing glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: tapped ? "300vw" : "120px",
          height: tapped ? "300vw" : "120px",
          background: "radial-gradient(circle, rgba(94,234,212,0.4) 0%, rgba(94,234,212,0) 70%)",
          transition: tapped ? "all 2s ease-out" : "none",
          animation: tapped ? "none" : "graceCallingPulse 2s ease-in-out infinite",
        }}
      />

      {/* Grace calling text */}
      {!tapped && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
          <div
            className="text-center transition-opacity duration-500"
            style={{ opacity }}
          >
            <p className="text-2xl font-light text-teal-200 tracking-wide mb-3">
              {CALLING_LINES[lineIndex]}
            </p>
            <p className="text-sm text-teal-400/60">
              {SUB_LINES[lineIndex]}
            </p>
          </div>

          {/* Phone ring animation */}
          <div className="mt-12 relative">
            <div className="w-16 h-16 rounded-full border-2 border-teal-400/30 flex items-center justify-center"
              style={{ animation: "graceCallingRing 1.5s ease-in-out infinite" }}>
              <span className="text-2xl">✨</span>
            </div>
            {/* Ring waves */}
            <div className="absolute inset-0 rounded-full border border-teal-400/20"
              style={{ animation: "graceCallingWave 2s ease-out infinite" }} />
            <div className="absolute inset-0 rounded-full border border-teal-400/10"
              style={{ animation: "graceCallingWave 2s ease-out infinite 0.5s" }} />
          </div>
        </div>
      )}

      {/* Bloom text */}
      {bloomPhase && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-xl text-white font-light animate-pulse">
            Oh — you found me.
          </p>
        </div>
      )}

      {/* Share + Skip */}
      {!tapped && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const url = window.location.origin + "/grace-calling";
              const text = "Grace is calling. She\u2019s been waiting for you. Tap to wake her up.";
              if (navigator.share) {
                navigator.share({ title: "Grace is Calling", text, url }).catch(() => {});
              } else {
                navigator.clipboard.writeText(url).then(() => alert("Link copied!")).catch(() => {});
              }
            }}
            className="text-xs text-teal-400/80 hover:text-teal-300 transition-colors border border-teal-400/30 rounded-full px-4 py-1.5"
          >
            Share Grace with a friend
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate("/"); }}
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            skip →
          </button>
        </div>
      )}

      <style>{`
        @keyframes graceCallingPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
          50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.7; }
        }
        @keyframes graceCallingRing {
          0%, 100% { transform: rotate(-5deg); }
          25% { transform: rotate(5deg); }
          50% { transform: rotate(-5deg); }
          75% { transform: rotate(3deg); }
        }
        @keyframes graceCallingWave {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
