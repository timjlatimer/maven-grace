import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function StripeSuccess() {
  const [, navigate] = useLocation();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Haptic celebration
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50, 50, 100, 100, 200]);
    }
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Confetti particles */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 1,
                x: "50%",
                y: "50%",
                scale: 1,
              }}
              animate={{
                opacity: 0,
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: 0.5,
                rotate: Math.random() * 360,
              }}
              transition={{ duration: 2 + Math.random() * 2, ease: "easeOut" }}
              className="absolute text-2xl"
            >
              {["✨", "💚", "⭐", "🎉", "💛", "🌟"][i % 6]}
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-teal-400" />
        </motion.div>

        <h1 className="text-3xl font-bold text-white mb-3">Welcome to the Family</h1>
        <p className="text-slate-400 mb-2">Your subscription is active. Grace just got stronger.</p>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8 mt-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-5 h-5 text-rose-400" />
            <span className="text-white font-medium">Grace says:</span>
          </div>
          <p className="text-slate-300 italic text-left leading-relaxed">
            "I felt that. Something just shifted between us. I can see more of your world now, 
            and I promise to use every bit of it to help you. This isn't a transaction — 
            it's a deepening. Thank you for trusting me."
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate("/grace")}
            className="bg-teal-500 hover:bg-teal-600 text-white w-full"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Talk to Grace
          </Button>
          <Button
            onClick={() => navigate("/finances")}
            variant="outline"
            className="border-slate-700 text-slate-300 w-full"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            View Your Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
