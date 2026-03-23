import React, { memo } from "react";
import { motion } from "framer-motion";
import { useVillageActiveData } from "@/hooks/usePulseZone";
import { ScreenContainer, ScreenHeader, SectionHeader, CTAButton } from "@/components/pulse-zone/shared";
import { FloatingTPRoll } from "@/components/pulse-zone/FloatingButtons";
import { PULSE_THEME } from "@/components/pulse-zone/theme";
import type { VillageConnection, VillageService, ImpactCard } from "@/types/pulse-zone";

const VillageWeb = memo(function VillageWeb({ active, total }: { active: number; total: number }) {
  const nodes = [
    { x: 100, y: 30 }, { x: 50, y: 60 }, { x: 150, y: 60 },
    { x: 50, y: 110 }, { x: 150, y: 110 }, { x: 100, y: 140 },
  ];
  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="170" viewBox="0 0 200 170">
        {nodes.map((n, i) => (
          <line key={`l-${i}`} x1="100" y1="85" x2={n.x} y2={n.y} stroke={i < active ? PULSE_THEME.accent.cyan : "rgba(255,255,255,0.1)"} strokeWidth="2" />
        ))}
        <circle cx="100" cy="85" r="20" fill={PULSE_THEME.bg.cardCool} stroke={PULSE_THEME.accent.cyan} strokeWidth="2" />
        <text x="100" y="90" textAnchor="middle" fill={PULSE_THEME.accent.cyan} fontSize="12" fontWeight="bold">RR</text>
        {nodes.map((n, i) => (
          <React.Fragment key={`n-${i}`}>
            <circle cx={n.x} cy={n.y} r="14" fill={PULSE_THEME.bg.cardCool} stroke={i < active ? PULSE_THEME.accent.cyan : "rgba(255,255,255,0.15)"} strokeWidth="2" />
            <circle cx={n.x} cy={n.y} r="4" fill={i < active ? PULSE_THEME.accent.cyan : "rgba(255,255,255,0.15)"} />
          </React.Fragment>
        ))}
      </svg>
      <span className="text-4xl font-bold mt-2" style={{ color: PULSE_THEME.accent.cyan }}>{active} of {total}</span>
      <span className="text-white/40 text-sm">Active Connections</span>
    </div>
  );
});

const ConnectionRow = memo(function ConnectionRow({ conn, index }: { conn: VillageConnection; index: number }) {
  const color = conn.iconColor === "teal" ? PULSE_THEME.accent.cyan : PULSE_THEME.accent.amberLight;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index }}
      className="rounded-xl p-3 flex items-center gap-3" style={{ background: PULSE_THEME.bg.cardCool, border: `1px solid ${PULSE_THEME.border.subtle}` }}>
      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-semibold text-sm">{conn.name}</h4>
        <p className="text-white/40 text-xs">{conn.type}</p>
      </div>
      <span className="text-sm font-medium flex-shrink-0" style={{ color }}>{conn.metricLabel}</span>
    </motion.div>
  );
});

const PulseChart = memo(function PulseChart({ data }: { data: readonly { week: string; value: number }[] }) {
  const maxVal = Math.max(...data.map(d => d.value), 6);
  return (
    <div className="flex items-end gap-3 justify-center h-24">
      {data.map((d, i) => (
        <div key={d.week} className="flex flex-col items-center gap-1">
          <span className="text-xs text-white/40">{i === data.length - 1 ? d.value : ""}</span>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(d.value / maxVal) * 80}px` }}
            transition={{ delay: 0.1 * i, duration: 0.5 }}
            className="w-14 rounded-t"
            style={{ background: PULSE_THEME.accent.cyan }}
          />
          <span className="text-xs text-white/30">{d.week}</span>
        </div>
      ))}
    </div>
  );
});

const ImpactCardComponent = memo(function ImpactCardComponent({ card }: { card: ImpactCard }) {
  return (
    <div className="rounded-xl p-3 min-w-[140px]" style={{ background: PULSE_THEME.bg.cardCool, border: `1px solid ${PULSE_THEME.border.teal}` }}>
      <div className="w-6 h-6 rounded-full mb-2" style={{ background: PULSE_THEME.accent.cyan }} />
      <h4 className="text-white font-semibold text-sm">{card.title}</h4>
      <p className="text-white/40 text-xs mt-1">{card.description}</p>
    </div>
  );
});

const VillageServiceRow = memo(function VillageServiceRow({ service, index }: { service: VillageService; index: number }) {
  const color = service.indicatorColor === "teal" ? PULSE_THEME.accent.cyan : PULSE_THEME.accent.amberLight;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * index }}
      className="rounded-xl p-3 flex items-start gap-3" style={{ background: PULSE_THEME.bg.cardCool, border: `1px solid ${PULSE_THEME.border.subtle}` }}>
      <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ background: color }} />
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-semibold text-sm">{service.name}</h4>
        <p className="text-white/40 text-xs truncate">{service.tagline}</p>
      </div>
      <span className="text-xs font-medium flex-shrink-0" style={{ color }}>{service.usageLabel}</span>
    </motion.div>
  );
});

export default function VillageActiveScreen() {
  const data = useVillageActiveData();
  return (
    <ScreenContainer bg={PULSE_THEME.bg.village}>
      <ScreenHeader backLabel="Pulse Zone" backRoute="/pulse" title="Village Active" subtitle="Your connections in the Maven Village" />
      <div className="px-4 mt-6 rounded-2xl p-6 mx-4" style={{ background: PULSE_THEME.bg.cardCool, border: `1px solid ${PULSE_THEME.border.teal}` }}>
        <VillageWeb active={data.activeCount} total={data.totalCount} />
      </div>
      <p className="text-cyan-400 text-center text-sm mt-4 px-4 italic">{data.graceQuote}</p>
      <div className="px-4 mt-6">
        <SectionHeader title="YOUR VILLAGE CONNECTIONS" color={PULSE_THEME.accent.cyan} />
        <div className="space-y-2">{data.connections.map((c, i) => <ConnectionRow key={c.id} conn={c} index={i} />)}</div>
        <div className="mt-3 rounded-xl p-3 text-center" style={{ border: `1px solid ${PULSE_THEME.accent.cyan}` }}>
          <span className="font-bold" style={{ color: PULSE_THEME.accent.cyan }}>{data.activeCount} of {data.totalCount} connections active</span>
        </div>
      </div>
      <div className="px-4 mt-6">
        <SectionHeader title="30-DAY VILLAGE PULSE" color={PULSE_THEME.accent.cyan} />
        <PulseChart data={data.pulseChartData} />
        <p className="text-cyan-400 text-center text-xs mt-3 italic">{data.pulseQuote}</p>
      </div>
      <div className="px-4 mt-6">
        <SectionHeader title="WHAT YOUR VILLAGE DOES FOR YOU" color={PULSE_THEME.accent.cyan} />
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {data.impactCards.map(c => <ImpactCardComponent key={c.id} card={c} />)}
        </div>
      </div>
      <CTAButton label="Meet Your Village" route="/village" color={PULSE_THEME.accent.cyan} subtitle="See who's in your corner" />
      <div className="px-4 mt-8 border-t border-white/5 pt-6">
        <SectionHeader title="ALSO IN YOUR VILLAGE" color={PULSE_THEME.accent.cyan} />
        <p className="text-white/30 text-xs mb-3">Swipe up to explore your community</p>
        <div className="space-y-2">{data.alsoInVillageServices.map((s, i) => <VillageServiceRow key={s.id} service={s} index={i} />)}</div>
      </div>
      <FloatingTPRoll />
    </ScreenContainer>
  );
}
