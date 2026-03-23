import React, { memo } from "react";
import { motion } from "framer-motion";
import { useGiveBackData } from "@/hooks/usePulseZone";
import { ScreenContainer, ScreenHeader, SectionHeader, CTAButton } from "@/components/pulse-zone/shared";
import { PULSE_THEME } from "@/components/pulse-zone/theme";
import type { GiveBackProgram } from "@/types/pulse-zone";

const ProgramRow = memo(function ProgramRow({ program, index }: { program: GiveBackProgram; index: number }) {
  const colorMap: Record<string, string> = {
    teal: PULSE_THEME.accent.cyan, orange: PULSE_THEME.accent.amberLight, red: PULSE_THEME.accent.red,
  };
  const badgeColor = colorMap[program.badgeColor] || PULSE_THEME.accent.cyan;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * index }}
      className="rounded-xl p-3 flex items-center gap-3" style={{ background: PULSE_THEME.bg.cardCool, border: `1px solid ${PULSE_THEME.border.subtle}` }}>
      <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ background: `${PULSE_THEME.accent.rose}60` }} />
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-semibold text-sm">{program.name}</h4>
        <p className="text-white/40 text-xs truncate">{program.tagline}</p>
      </div>
      <div className="w-16 h-2 rounded-full flex-shrink-0" style={{ background: badgeColor }} />
    </motion.div>
  );
});

export default function GiveBackScreen() {
  const data = useGiveBackData();
  return (
    <ScreenContainer bg={PULSE_THEME.bg.village}>
      <ScreenHeader backLabel="Pulse Zone" backRoute="/pulse" title="Give Back" subtitle="What the Village gives to you" />
      <div className="px-4 mt-6 rounded-2xl p-6 mx-4 flex flex-col items-center"
        style={{ background: PULSE_THEME.bg.cardCool, border: `1px solid ${PULSE_THEME.border.teal}` }}>
        <div className="w-20 h-20 rounded-full mb-4" style={{ background: `${PULSE_THEME.accent.rose}60` }} />
        <p className="text-cyan-400 text-center text-sm">{data.graceQuote}</p>
        <p className="text-cyan-400 text-center text-sm font-medium">{data.graceSubQuote}</p>
      </div>
      <div className="px-4 mt-6">
        <SectionHeader title="WHAT THE VILLAGE PROVIDES" color={PULSE_THEME.accent.cyan} />
        <div className="space-y-2">{data.programs.map((p, i) => <ProgramRow key={p.id} program={p} index={i} />)}</div>
        <div className="mt-3 rounded-xl p-3 text-center" style={{ border: `1px solid ${PULSE_THEME.accent.cyan}` }}>
          <span className="font-bold" style={{ color: PULSE_THEME.accent.cyan }}>{data.programs.length} programs working for you</span>
        </div>
      </div>
      <div className="px-4 mt-6">
        <SectionHeader title="HOW IT WORKS" color={PULSE_THEME.accent.cyan} />
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {data.howItWorks.map((step, i) => (
            <div key={i} className="rounded-xl p-3 min-w-[140px] text-center"
              style={{ background: PULSE_THEME.bg.cardCool, border: `1px solid ${PULSE_THEME.border.teal}` }}>
              <span className="text-white text-sm">{step}</span>
            </div>
          ))}
        </div>
      </div>
      <CTAButton label="Tell Grace What You Need" route="/grace" color={PULSE_THEME.accent.cyan}
        subtitle="She's already watching. She just wants to hear it from you." />
    </ScreenContainer>
  );
}
