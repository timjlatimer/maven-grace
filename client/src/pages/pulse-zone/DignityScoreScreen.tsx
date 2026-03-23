import React, { memo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Zap, Shield, BarChart2, Droplet, MessageCircle, ArrowRight } from "lucide-react";
import { useDignityScoreData } from "@/hooks/usePulseZone";
import { ScreenContainer, ScreenHeader, SectionHeader, PhilosophyBlock, TotalBar, CTAButton } from "@/components/pulse-zone/shared";
import { PULSE_THEME } from "@/components/pulse-zone/theme";
import type { DignityDimension, CascadeService } from "@/types/pulse-zone";

const iconMap: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  zap: Zap, shield: Shield, "bar-chart": BarChart2, droplet: Droplet, "message-circle": MessageCircle,
};

const ScoreRing = memo(function ScoreRing({ score, tierLabel, tierColor }: { score: number; tierLabel: string; tierColor: string }) {
  const circumference = 2 * Math.PI * 60;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        <motion.circle cx="80" cy="80" r="60" fill="none" stroke={PULSE_THEME.accent.teal} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          transform="rotate(-90 80 80)" />
        <text x="80" y="75" textAnchor="middle" fill="white" fontSize="36" fontWeight="bold">{score}</text>
        <text x="80" y="95" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="12">/100</text>
      </svg>
      <span className="font-bold text-xs tracking-wider mt-2" style={{ color: tierColor }}>{tierLabel}</span>
    </div>
  );
});

const DimensionRow = memo(function DimensionRow({ dim, index }: { dim: DignityDimension; index: number }) {
  const Icon = iconMap[dim.icon] || Zap;
  const scoreColor = dim.scoreColor === "teal" ? PULSE_THEME.accent.teal : PULSE_THEME.accent.amberLight;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index }}
      className="rounded-xl p-3" style={{ background: PULSE_THEME.bg.card, border: `1px solid ${PULSE_THEME.border.subtle}` }}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: dim.iconColor }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div><h4 className="text-white font-semibold text-sm">{dim.name}</h4><p className="text-white/40 text-xs mt-0.5">{dim.tagline}</p></div>
            <div className="text-right flex-shrink-0 ml-2">
              <span className="text-white/40 text-xs">{dim.maxScore} pts</span>
              <span className="block font-bold text-sm" style={{ color: scoreColor }}>{dim.score} / {dim.maxScore}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const ClimbChart = memo(function ClimbChart({ data, summary }: { data: readonly { day: number; score: number }[]; summary: string }) {
  const width = 300; const height = 120;
  const points = data.map((d) => ({ x: (d.day / 90) * width, y: height - (d.score / 100) * height }));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
  return (
    <div className="px-4 mt-6">
      <SectionHeader title="YOUR 90-DAY CLIMB" color={PULSE_THEME.accent.teal} />
      <svg viewBox={`0 0 ${width} ${height + 20}`} className="w-full">
        {[0, 25, 50, 75, 100].map((v) => (
          <React.Fragment key={v}>
            <line x1="0" y1={height - (v / 100) * height} x2={width} y2={height - (v / 100) * height} stroke="rgba(255,255,255,0.05)" />
            <text x="-5" y={height - (v / 100) * height + 4} fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="end">{v}</text>
          </React.Fragment>
        ))}
        <path d={areaD} fill={`${PULSE_THEME.accent.teal}30`} />
        <path d={pathD} fill="none" stroke={PULSE_THEME.accent.teal} strokeWidth="2" />
        {points.length > 0 && <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="4" fill="white" />}
        {["D1", "D30", "D47", "D60", "D90"].map((l, i) => (
          <text key={l} x={(i / 4) * width} y={height + 15} fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle">{l}</text>
        ))}
      </svg>
      <p className="text-white/40 text-center text-xs mt-2">{summary}</p>
    </div>
  );
});

const ServiceRow = memo(function ServiceRow({ service, index }: { service: CascadeService; index: number }) {
  const colorMap: Record<string, string> = { teal: PULSE_THEME.accent.teal, orange: PULSE_THEME.accent.amberLight, red: PULSE_THEME.accent.red };
  const indicatorColor = colorMap[service.indicatorColor] || PULSE_THEME.accent.teal;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * index }}
      className="rounded-xl p-3 flex items-start gap-3" style={{ background: PULSE_THEME.bg.card, border: `1px solid ${PULSE_THEME.border.subtle}` }}>
      <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ background: indicatorColor }} />
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-semibold text-sm">{service.name}</h4>
        <p className="text-white/40 text-xs truncate">{service.tagline}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <span className="text-white/40 text-xs">Score: {service.score}</span>
        <span className="block text-xs font-medium" style={{ color: indicatorColor }}>{service.usageLabel}</span>
      </div>
    </motion.div>
  );
});

export default function DignityScoreScreen() {
  const data = useDignityScoreData();
  return (
    <ScreenContainer>
      <ScreenHeader backLabel="Pulse Zone" backRoute="/pulse" title="Dignity Score" subtitle="Your 90-day journey to financial freedom" />
      <div className="px-4 mt-6 rounded-2xl p-6 mx-4" style={{ background: PULSE_THEME.bg.card, border: `1px solid ${PULSE_THEME.border.warm}` }}>
        <ScoreRing score={data.totalScore} tierLabel={data.tier} tierColor={data.tierColor} />
      </div>
      <p className="text-teal-400 text-center text-sm mt-4 px-4 italic">{data.graceQuote}</p>
      <div className="px-4 mt-6">
        <SectionHeader title="WHAT BUILDS YOUR SCORE" />
        <div className="space-y-2">{data.dimensions.map((dim, i) => <DimensionRow key={dim.id} dim={dim} index={i} />)}</div>
        <div className="mt-3"><TotalBar label="Total Dignity Score" value={`${data.totalScore} / 100`} borderColor={PULSE_THEME.accent.amber} /></div>
      </div>
      <ClimbChart data={data.climbData} summary={data.climbSummary} />
      <PhilosophyBlock text={data.philosophyText} />
      <CTAButton label="Talk to Grace Now" route="/grace" />
      <div className="px-4 mt-8 border-t border-white/5 pt-6">
        <SectionHeader title="ALSO WORKING FOR YOU" color={PULSE_THEME.accent.teal} />
        <p className="text-white/30 text-xs mb-3">Swipe up to explore everything Grace does for you</p>
        <div className="space-y-2">{data.workingForYouServices.map((s, i) => <ServiceRow key={s.id} service={s} index={i} />)}</div>
        <div className="mt-4 rounded-xl p-3 flex items-center justify-between" style={{ background: PULSE_THEME.bg.card, border: `1px solid ${PULSE_THEME.border.subtle}` }}>
          <div><p className="text-white text-sm">Grace has even more tools waiting for you</p><p className="text-white/30 text-xs">Explore the full Village</p></div>
          <ArrowRight className="w-5 h-5 text-teal-400" />
        </div>
      </div>
    </ScreenContainer>
  );
}
