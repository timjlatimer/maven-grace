/**
 * GraceBatteryScreen — Relationship Battery drill-down.
 * Runner B: Uses shared components, custom hooks, strict typing.
 */
import React, { memo } from "react";
import { motion } from "framer-motion";
import { Heart, Star, MessageSquare, CreditCard, BarChart2, Home, Users } from "lucide-react";
import { useGraceBatteryData } from "@/hooks/usePulseZone";
import { ScreenContainer, ScreenHeader, SectionHeader, PhilosophyBlock, FeatureCheck, TotalBar, CTAButton } from "@/components/pulse-zone/shared";
import { PULSE_THEME } from "@/components/pulse-zone/theme";
import type { ChargingFactor } from "@/types/pulse-zone";

const iconMap: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  "message-square": MessageSquare,
  "credit-card": CreditCard,
  "bar-chart": BarChart2,
  home: Home,
  users: Users,
};

const BatteryVisual = memo(function BatteryVisual({ score }: { score: number }) {
  const fillPercent = Math.min(100, Math.max(0, score));
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-20 rounded-xl border-2 border-white/20 overflow-hidden">
        <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-2 h-6 bg-white/20 rounded-r" />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${fillPercent}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full rounded-lg flex items-center justify-center"
          style={{ background: PULSE_THEME.accent.teal }}
        >
          <Heart className="w-6 h-6 text-gray-800" fill="currentColor" />
        </motion.div>
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-5xl font-bold text-white mt-4"
      >
        {score}%
      </motion.span>
    </div>
  );
});

const FactorRow = memo(function FactorRow({ factor, index }: { factor: ChargingFactor; index: number }) {
  const Icon = iconMap[factor.icon] || MessageSquare;
  const scoreColorMap: Record<string, string> = {
    teal: PULSE_THEME.accent.teal,
    orange: PULSE_THEME.accent.amberLight,
    gold: PULSE_THEME.accent.amber,
  };
  const scoreColor = scoreColorMap[factor.scoreColor] || PULSE_THEME.accent.teal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      className="rounded-xl p-3"
      style={{ background: PULSE_THEME.bg.card, border: `1px solid ${PULSE_THEME.border.subtle}` }}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: factor.iconColor }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-white font-semibold text-sm">{factor.name}</h4>
              <p className="text-white/40 text-xs mt-0.5">{factor.description}</p>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <span className="text-white/40 text-xs">{factor.weightPercent}%</span>
              <div className="flex items-center gap-0.5">
                <span className="font-bold text-sm" style={{ color: scoreColor }}>
                  {factor.currentScore} / {factor.maxScore}
                </span>
                {factor.hasBonus && <Star className="w-3 h-3 text-amber-400" fill="currentColor" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default function GraceBatteryScreen() {
  const data = useGraceBatteryData();

  return (
    <ScreenContainer>
      <ScreenHeader
        backLabel="Pulse Zone"
        backRoute="/pulse"
        title="Relationship Battery"
        subtitle="How connected are we right now"
      />

      <div className="px-4 mt-6 rounded-2xl p-6 mx-4"
        style={{ background: PULSE_THEME.bg.card, border: `1px solid ${PULSE_THEME.border.warm}` }}>
        <BatteryVisual score={data.totalScore} />
      </div>

      <p className="text-teal-400 text-center text-sm mt-4 px-4">{data.graceQuote}</p>

      <div className="px-4 mt-6">
        <SectionHeader title="WHAT CHARGES OUR RELATIONSHIP" />
        <div className="space-y-2">
          {data.factors.map((factor, i) => (
            <FactorRow key={factor.id} factor={factor} index={i} />
          ))}
        </div>
        <div className="mt-3">
          <TotalBar label="Total Relationship Battery" value={`${data.totalScore} / 100`} />
        </div>
      </div>

      <div className="px-4 mt-6">
        <SectionHeader title="WHAT'S AVAILABLE RIGHT NOW" color={PULSE_THEME.accent.teal} />
        <div className="space-y-2">
          {data.availableFeatures.map((f) => (
            <FeatureCheck key={f.id} text={f.text} isAvailable={f.isAvailable} />
          ))}
        </div>
      </div>

      <PhilosophyBlock text={data.philosophyText} />
      <CTAButton label="Talk to Grace Now" route="/grace" />
    </ScreenContainer>
  );
}
