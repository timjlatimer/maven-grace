/**
 * Floating Buttons — TP Roll and North Star
 * Runner B: Extracted as separate, memoized components with proper typing.
 */
import React, { memo, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import { PULSE_THEME } from "./theme";

// ─── Floating TP Roll ───────────────────────────────────────────────────────

export const FloatingTPRoll = memo(function FloatingTPRoll() {
  const [, navigate] = useLocation();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-4 z-50 flex items-center gap-2">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1"
          >
            <span className="text-white text-xs font-medium">Tap for Give Back</span>
            <ArrowRight className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        onHoverStart={() => setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
        onClick={() => navigate("/pulse/give-back")}
        className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center overflow-hidden"
        style={{ background: PULSE_THEME.gradient.tpRoll }}
        aria-label="Give Back — TP Roll"
      >
        {/* TP roll icon representation */}
        <div className="w-6 h-7 rounded-sm bg-white/80 relative">
          <div className="absolute inset-x-1 top-0 h-1 bg-white/40 rounded-full" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-white/30" />
        </div>
      </motion.button>
    </div>
  );
});

// ─── Floating North Star ────────────────────────────────────────────────────

export const FloatingNorthStar = memo(function FloatingNorthStar() {
  const [, navigate] = useLocation();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
      whileTap={{ scale: 0.85 }}
      onClick={() => navigate("/pulse/north-star")}
      className="w-10 h-10 flex items-center justify-center"
      aria-label="North Star — Your 90-Day Journey"
    >
      <motion.div
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Star className="w-8 h-8 text-white/40" fill="currentColor" />
      </motion.div>
    </motion.button>
  );
});
