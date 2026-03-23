/**
 * HeartbeatWheel — The central pulsing wheel on the Pulse Zone home screen.
 * Runner B: Extracted as a reusable, memoized component.
 */
import React, { memo, useCallback } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, MessageSquare, GitBranch, Pentagon } from "lucide-react";
import type { Quadrant } from "@/types/pulse-zone";
import { PULSE_THEME } from "./theme";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  search: Search,
  "message-square": MessageSquare,
  "git-branch": GitBranch,
  pentagon: Pentagon,
};

interface HeartbeatWheelProps {
  readonly quadrants: readonly Quadrant[];
  readonly onQuadrantTap?: (quadrant: Quadrant) => void;
}

const QuadrantButton = memo(function QuadrantButton({
  quadrant,
  onTap,
}: {
  quadrant: Quadrant;
  onTap: (q: Quadrant) => void;
}) {
  const Icon = iconMap[quadrant.icon] || Search;
  const positionClasses: Record<string, string> = {
    "top-left": "top-[15%] left-[15%]",
    "top-right": "top-[15%] right-[15%]",
    "bottom-left": "bottom-[15%] left-[15%]",
    "bottom-right": "bottom-[15%] right-[15%]",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => onTap(quadrant)}
      className={`absolute flex flex-col items-center ${positionClasses[quadrant.position]}`}
    >
      <Icon className="w-5 h-5 text-white/60 mb-1" />
      <span className="text-white font-bold text-base">{quadrant.label}</span>
      <span className="text-white/50 text-xs">{quadrant.subtitle}</span>
    </motion.button>
  );
});

export const HeartbeatWheel = memo(function HeartbeatWheel({
  quadrants,
  onQuadrantTap,
}: HeartbeatWheelProps) {
  const [, navigate] = useLocation();

  const handleTap = useCallback(
    (q: Quadrant) => {
      if (onQuadrantTap) onQuadrantTap(q);
      navigate(q.route);
    },
    [navigate, onQuadrantTap]
  );

  return (
    <div className="relative mx-auto" style={{ width: 320, height: 320 }}>
      {/* Outer glow ring */}
      <motion.div
        animate={{ scale: [1, 1.04, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${PULSE_THEME.accent.amber}20 0%, transparent 70%)`,
        }}
      />

      {/* Middle ring */}
      <div
        className="absolute rounded-full"
        style={{
          inset: 30,
          background: `radial-gradient(circle, ${PULSE_THEME.accent.amber}40 0%, ${PULSE_THEME.accent.amber}10 60%, transparent 100%)`,
          border: `1px solid ${PULSE_THEME.accent.amber}30`,
        }}
      />

      {/* Inner ring — the bright core */}
      <motion.div
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute rounded-full"
        style={{
          inset: 60,
          background: `radial-gradient(circle, ${PULSE_THEME.accent.amber} 0%, ${PULSE_THEME.accent.amber}80 50%, ${PULSE_THEME.accent.amber}20 100%)`,
        }}
      />

      {/* Center G */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            border: `2px solid ${PULSE_THEME.accent.amber}`,
            background: PULSE_THEME.bg.primary,
          }}
        >
          <span className="text-amber-400 font-bold text-lg">G</span>
        </div>
      </div>

      {/* Crosshair lines */}
      <div className="absolute inset-0 flex items-center justify-center z-5">
        <div className="absolute w-px h-[60%]" style={{ background: `${PULSE_THEME.accent.amber}20` }} />
        <div className="absolute h-px w-[60%]" style={{ background: `${PULSE_THEME.accent.amber}20` }} />
      </div>

      {/* Quadrant buttons */}
      {quadrants.map((q) => (
        <QuadrantButton key={q.id} quadrant={q} onTap={handleTap} />
      ))}

      {/* HEARTBEAT label */}
      <div className="absolute bottom-[-30px] left-0 right-0 text-center">
        <span
          className="text-xs tracking-[0.3em] font-medium"
          style={{ color: `${PULSE_THEME.accent.amber}50` }}
        >
          HEARTBEAT
        </span>
      </div>
    </div>
  );
});
