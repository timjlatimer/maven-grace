/**
 * KPIPillRow — The 3 KPI pills at the top of the Pulse Zone home screen.
 * Runner B: Extracted, typed, memoized.
 */
import React, { memo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Battery, Star, Users } from "lucide-react";
import type { KPIPill } from "@/types/pulse-zone";
import { PULSE_THEME } from "./theme";

const iconMap: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  battery: Battery,
  star: Star,
  users: Users,
};

const Pill = memo(function Pill({ pill, delay }: { pill: KPIPill; delay: number }) {
  const [, navigate] = useLocation();
  const Icon = iconMap[pill.icon] || Star;

  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate(pill.screenRoute)}
      className="flex items-center gap-1.5 px-3 py-2 rounded-full"
      style={{
        background: `${PULSE_THEME.accent.amber}25`,
        border: `1px solid ${PULSE_THEME.accent.amber}40`,
      }}
    >
      <Icon className="w-3.5 h-3.5" style={{ color: PULSE_THEME.accent.amber }} />
      <div className="flex flex-col items-start">
        <span className="text-[10px] font-medium" style={{ color: PULSE_THEME.accent.amber }}>
          {pill.label}
        </span>
        <span className="text-white font-bold text-xs">{pill.value}</span>
      </div>
    </motion.button>
  );
});

interface KPIPillRowProps {
  readonly battery: KPIPill;
  readonly dignity: KPIPill;
  readonly village: KPIPill;
}

export const KPIPillRow = memo(function KPIPillRow({ battery, dignity, village }: KPIPillRowProps) {
  return (
    <div className="flex gap-2 px-4 overflow-x-auto scrollbar-hide">
      <Pill pill={battery} delay={0.1} />
      <Pill pill={dignity} delay={0.2} />
      <Pill pill={village} delay={0.3} />
    </div>
  );
});
