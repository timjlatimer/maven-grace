import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface GraceTypingIndicatorProps {
  personality?: "angel" | "coach" | "fierce" | "bestfriend" | "antithesis";
  isTyping: boolean;
}

const TYPING_STYLES: Record<string, { speed: number; color: string; label: string; emoji: string }> = {
  angel: { speed: 1.2, color: "bg-teal-400", label: "Grace is reflecting...", emoji: "✨" },
  coach: { speed: 0.6, color: "bg-amber-400", label: "Grace is preparing your plan...", emoji: "📋" },
  fierce: { speed: 0.3, color: "bg-rose-400", label: "Grace is fired up...", emoji: "🔥" },
  bestfriend: { speed: 0.8, color: "bg-purple-400", label: "Grace is thinking...", emoji: "💭" },
  antithesis: { speed: 1.0, color: "bg-blue-400", label: "Grace is considering...", emoji: "🪞" },
};

export default function GraceTypingIndicator({ personality = "bestfriend", isTyping }: GraceTypingIndicatorProps) {
  const style = TYPING_STYLES[personality] || TYPING_STYLES.bestfriend;
  const [dots, setDots] = useState(0);

  useEffect(() => {
    if (!isTyping) return;
    const interval = setInterval(() => {
      setDots(d => (d + 1) % 4);
    }, style.speed * 500);
    return () => clearInterval(interval);
  }, [isTyping, style.speed]);

  if (!isTyping) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-2 px-4 py-2"
    >
      <div className="flex items-center gap-1.5 bg-slate-800/60 rounded-2xl px-4 py-2.5 border border-slate-700/50">
        {/* Animated dots */}
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{
                scale: dots === i || dots === i + 1 ? 1.3 : 0.8,
                opacity: dots === i || dots === i + 1 ? 1 : 0.4,
              }}
              transition={{ duration: style.speed * 0.3 }}
              className={`w-2 h-2 rounded-full ${style.color}`}
            />
          ))}
        </div>
        <span className="text-xs text-slate-400 ml-1.5">
          {style.emoji} {style.label}
        </span>
      </div>
    </motion.div>
  );
}
