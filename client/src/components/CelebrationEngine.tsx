import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star, Heart, PartyPopper } from "lucide-react";

interface CelebrationEngineProps {
  trigger: boolean;
  type?: "dignity_up" | "bill_paid" | "promise_kept" | "milestone" | "referral";
  message?: string;
  onComplete?: () => void;
}

const CELEBRATION_CONFIG: Record<string, { icon: typeof Star; color: string; emoji: string; defaultMsg: string }> = {
  dignity_up: { icon: Star, color: "text-amber-400", emoji: "⭐", defaultMsg: "Your dignity score went up!" },
  bill_paid: { icon: Heart, color: "text-teal-400", emoji: "💚", defaultMsg: "Bill paid — that's strength!" },
  promise_kept: { icon: Sparkles, color: "text-purple-400", emoji: "✨", defaultMsg: "Promise kept — Grace is proud!" },
  milestone: { icon: PartyPopper, color: "text-pink-400", emoji: "🎉", defaultMsg: "You hit a milestone!" },
  referral: { icon: Heart, color: "text-rose-400", emoji: "💕", defaultMsg: "A friend joined Grace!" },
};

export default function CelebrationEngine({ trigger, type = "milestone", message, onComplete }: CelebrationEngineProps) {
  const [show, setShow] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; emoji: string }>>([]);

  const config = CELEBRATION_CONFIG[type] || CELEBRATION_CONFIG.milestone;
  const Icon = config.icon;

  const generateParticles = useCallback(() => {
    const emojis = ["✨", "⭐", "💚", "🎉", "💛", "🌟"];
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 300 - 150,
      y: -(Math.random() * 200 + 100),
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
  }, []);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      setParticles(generateParticles());

      // Haptic celebration
      if (navigator.vibrate) {
        navigator.vibrate([50, 50, 50, 50, 100, 100, 200]);
      }

      const timer = setTimeout(() => {
        setShow(false);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          {/* Particle burst */}
          {particles.map(p => (
            <motion.span
              key={p.id}
              initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              animate={{ opacity: 0, x: p.x, y: p.y, scale: 0.5 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute text-2xl"
              style={{ left: "50%", top: "50%" }}
            >
              {p.emoji}
            </motion.span>
          ))}

          {/* Central message */}
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 text-center max-w-xs mx-4 shadow-2xl"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-3"
            >
              <Icon className={`w-12 h-12 mx-auto ${config.color}`} />
            </motion.div>
            <p className="text-lg font-bold text-white mb-1">{config.emoji} {message || config.defaultMsg}</p>
            <p className="text-sm text-slate-400">Grace is celebrating with you</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
