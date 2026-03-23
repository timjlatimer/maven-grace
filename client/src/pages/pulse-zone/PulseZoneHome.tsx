/**
 * PulseZoneHome — The main Pulse Zone home screen.
 * Runner B: Uses extracted components and custom hooks.
 */
import React from "react";
import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { usePulseZone } from "@/hooks/usePulseZone";
import { KPIPillRow } from "@/components/pulse-zone/KPIPillRow";
import { HeartbeatWheel } from "@/components/pulse-zone/HeartbeatWheel";
import { FloatingTPRoll, FloatingNorthStar } from "@/components/pulse-zone/FloatingButtons";
import { PULSE_THEME } from "@/components/pulse-zone/theme";

export default function PulseZoneHome() {
  const { greeting, kpiPills, quadrants } = usePulseZone();

  return (
    <div className="min-h-screen relative" style={{ background: PULSE_THEME.bg.primary }}>
      {/* KPI Pills */}
      <div className="pt-12">
        <KPIPillRow
          battery={kpiPills.battery}
          dignity={kpiPills.dignity}
          village={kpiPills.village}
        />
      </div>

      {/* Greeting + North Star */}
      <div className="px-4 mt-4 flex items-start justify-between">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-sm"
            style={{ color: PULSE_THEME.accent.amber }}
          >
            {greeting.title}
          </motion.p>
          <p className="text-white/40 text-xs">{greeting.subtitle}</p>
        </div>
        <FloatingNorthStar />
      </div>

      {/* Heartbeat Wheel */}
      <div className="flex items-center justify-center mt-12 mb-16">
        <HeartbeatWheel quadrants={quadrants} />
      </div>

      {/* Swipe Up Hint */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="flex flex-col items-center mt-8"
      >
        <ChevronUp className="w-5 h-5 text-white/20" />
        <span className="text-white/20 text-xs">swipe up</span>
      </motion.div>

      {/* Floating TP Roll */}
      <FloatingTPRoll />
    </div>
  );
}
