import React, { memo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Star, ArrowRight, ChevronLeft } from "lucide-react";
import { useNorthStar90DayData } from "@/hooks/usePulseZone";
import { ScreenContainer } from "@/components/pulse-zone/shared";
import { PULSE_THEME } from "@/components/pulse-zone/theme";
import type { FinancialDimension } from "@/types/pulse-zone";

const ProgressRing = memo(function ProgressRing({ percent }: { percent: number }) {
  const circumference = 2 * Math.PI * 60;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r="60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
        <motion.circle cx="90" cy="90" r="60" fill="none" stroke={PULSE_THEME.accent.teal} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut" }}
          transform="rotate(-90 90 90)" />
        <text x="90" y="85" textAnchor="middle" fill="white" fontSize="40" fontWeight="bold">{percent}%</text>
        <text x="90" y="105" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11">of your 100% lift goal</text>
      </svg>
    </div>
  );
});

const DimensionRow = memo(function DimensionRow({ dim, index }: { dim: FinancialDimension; index: number }) {
  const barColor = dim.progressPercent > 50 ? PULSE_THEME.accent.teal : PULSE_THEME.accent.amberLight;
  const isSpec = dim.status === "SPEC_ONLY";
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index }}
      className="rounded-xl p-3" style={{ background: PULSE_THEME.bg.card, border: `1px solid ${PULSE_THEME.border.subtle}` }}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: `${PULSE_THEME.accent.teal}30`, color: PULSE_THEME.accent.teal }}>
            {dim.name.charAt(0)}
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm">{dim.name}{isSpec ? " *" : ""}</h4>
            <p className="text-white/40 text-xs">{dim.feature}</p>
          </div>
        </div>
        <span className="text-teal-400 font-bold text-sm">{dim.dollarLabel}</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${dim.progressPercent}%` }}
            transition={{ delay: 0.1 * index, duration: 0.8 }}
            className="h-full rounded-full" style={{ background: barColor }} />
        </div>
        <span className="text-white/30 text-xs">{dim.progressPercent}%</span>
      </div>
    </motion.div>
  );
});

export default function NorthStar90DayScreen() {
  const data = useNorthStar90DayData();
  const [, navigate] = useLocation();
  return (
    <ScreenContainer>
      <div className="pt-12 px-4">
        <button onClick={() => navigate("/pulse")} className="flex items-center gap-1 mb-2" style={{ color: PULSE_THEME.accent.teal }}>
          <ChevronLeft className="w-5 h-5" /><span className="text-sm">Pulse Zone</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-wider" style={{ color: PULSE_THEME.accent.amber }}>YOUR NORTH STAR</span>
          <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
        </div>
        <h1 className="text-2xl font-bold text-white">90 Days with Grace</h1>
      </div>
      <div className="px-4 mt-6"><ProgressRing percent={data.overallProgressPercent} /></div>
      <p className="text-teal-400 text-center text-sm mt-4 px-4 italic">{data.graceVoice}</p>
      <div className="px-4 mt-6 space-y-2">
        {data.dimensions.map((dim, i) => <DimensionRow key={dim.id} dim={dim} index={i} />)}
      </div>
      <div className="mx-4 mt-4 rounded-xl p-4 text-center"
        style={{ background: `${PULSE_THEME.accent.teal}15`, border: `1px solid ${PULSE_THEME.accent.teal}` }}>
        <span className="text-xs font-bold tracking-wider" style={{ color: PULSE_THEME.accent.amber }}>TOTAL 90-DAY IMPACT</span>
        <p className="text-2xl font-bold text-teal-400 mt-1">${data.totalImpactDollars.toLocaleString()} kept in your pocket</p>
        <p className="text-white/40 text-xs mt-1">On track for ${data.projectedDay90Dollars.toLocaleString()} by Day 90</p>
      </div>
      <div className="flex flex-col items-center mt-6 mb-8">
        <Star className="w-5 h-5 text-amber-400 mb-1" fill="currentColor" />
        <button onClick={() => navigate("/pulse/north-star/prime")} className="text-teal-400 text-sm flex items-center gap-1">
          There's a bigger reason you're here <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </ScreenContainer>
  );
}
