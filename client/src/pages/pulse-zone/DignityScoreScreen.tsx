import React from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Zap, Shield, BarChart2, Droplet, MessageCircle, ArrowRight } from "lucide-react";
import { mockData } from "@/components/pulse-zone/mockData";

const iconMap: Record<string, React.ReactNode> = {
  zap: <Zap className="w-5 h-5" />,
  shield: <Shield className="w-5 h-5" />,
  "bar-chart-2": <BarChart2 className="w-5 h-5" />,
  droplet: <Droplet className="w-5 h-5" />,
  "message-circle": <MessageCircle className="w-5 h-5" />,
};

function DignityRing({ score, maxScore }: { score: number; maxScore: number }) {
  const percent = (score / maxScore) * 100;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center py-6">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#1A1A12" strokeWidth="8" />
          <motion.circle
            cx="70" cy="70" r={radius} fill="none"
            stroke="#2DD4BF" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-white">{score}</span>
          <span className="text-white/40 text-sm">/100</span>
        </div>
      </div>
      <div className="text-center mt-2">
        <span className="text-amber-400 font-bold text-xs tracking-wider">FINDING YOUR STRIDE</span>
      </div>
    </div>
  );
}

function ClimbChart({ data, currentDay }: { data: { day: number; score: number }[]; currentDay: number }) {
  const maxScore = 100;
  const chartWidth = 300;
  const chartHeight = 120;
  const padding = { top: 10, right: 10, bottom: 25, left: 25 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  const points = data.map((d) => ({
    x: padding.left + (d.day / 90) * plotWidth,
    y: padding.top + plotHeight - (d.score / maxScore) * plotHeight,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaD = `${pathD} L${points[points.length - 1].x},${padding.top + plotHeight} L${points[0].x},${padding.top + plotHeight} Z`;

  const gridLines = [0, 25, 50, 75, 100];
  const dayMarks = [1, 30, currentDay, 60, 90];

  return (
    <svg width="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="mt-4">
      {/* Grid lines */}
      {gridLines.map((v) => {
        const y = padding.top + plotHeight - (v / maxScore) * plotHeight;
        return (
          <g key={v}>
            <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y}
              stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <text x={padding.left - 4} y={y + 3} fill="rgba(255,255,255,0.3)"
              fontSize="7" textAnchor="end">{v}</text>
          </g>
        );
      })}
      {/* Day marks */}
      {dayMarks.map((d) => {
        const x = padding.left + (d / 90) * plotWidth;
        return (
          <text key={d} x={x} y={chartHeight - 5} fill="rgba(255,255,255,0.3)"
            fontSize="7" textAnchor="middle">D{d}</text>
        );
      })}
      {/* Area fill */}
      <path d={areaD} fill="rgba(45,212,191,0.2)" />
      {/* Line */}
      <path d={pathD} fill="none" stroke="#2DD4BF" strokeWidth="2" />
      {/* Current day dot */}
      {points.length > 0 && (
        <>
          <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y}
            r="4" fill="#2DD4BF" />
          <text x={points[points.length - 1].x} y={points[points.length - 1].y - 8}
            fill="#2DD4BF" fontSize="8" textAnchor="middle" fontWeight="bold">
            Day {currentDay}
          </text>
        </>
      )}
    </svg>
  );
}

function ServiceCard({ service, index }: { service: typeof mockData.dignityScore.workingForYouServices[0]; index: number }) {
  const colorMap: Record<string, string> = { teal: "#2DD4BF", orange: "#E8A020", red: "#E05050" };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      className="rounded-xl p-3 flex items-center gap-3"
      style={{ background: "#1A1A12", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="w-3 h-3 rounded-full flex-shrink-0"
        style={{ background: colorMap[service.indicatorColor] || "#2DD4BF" }} />
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-semibold text-sm">{service.name}</h4>
        <p className="text-white/40 text-xs truncate">{service.tagline}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-white/30 text-xs">Score: {service.score}</div>
        <div className="font-medium text-xs" style={{ color: colorMap[service.indicatorColor] || "#2DD4BF" }}>
          {service.usageCount !== undefined ? `${service.usageCount} ${service.usageLabel}` : service.usageLabel}
        </div>
      </div>
    </motion.div>
  );
}

export default function DignityScoreScreen() {
  const [, navigate] = useLocation();
  const data = mockData.dignityScore;
  const scoreColorMap: Record<string, string> = { teal: "#2DD4BF", orange: "#E8A020", gold: "#FFD700" };

  return (
    <div className="min-h-screen pb-8" style={{ background: "#0D0D08" }}>
      {/* Header */}
      <div className="pt-12 px-4">
        <button onClick={() => navigate("/pulse")} className="flex items-center gap-1 text-amber-400 mb-2">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Pulse Zone</span>
        </button>
        <h1 className="text-3xl font-bold text-white leading-tight">Dignity</h1>
        <h1 className="text-3xl font-bold text-white leading-tight">Score</h1>
        <p className="text-white/50 text-sm mt-1">Your 90-day journey to financial freedom</p>
      </div>

      {/* Score Ring */}
      <div className="mx-4 mt-4 rounded-2xl p-4" style={{ background: "#1A1A12" }}>
        <DignityRing score={data.totalScore} maxScore={100} />
        <p className="text-amber-400 text-center text-sm italic">{data.graceQuote}</p>
      </div>

      {/* What Builds Your Score */}
      <div className="px-4 mt-6">
        <h3 className="text-amber-400 font-bold text-xs tracking-wider mb-3">WHAT BUILDS YOUR SCORE</h3>
        <div className="space-y-2">
          {data.dimensions.map((dim, i) => (
            <motion.div
              key={dim.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="rounded-xl p-3 flex items-start gap-3"
              style={{ background: "#1A1A12", border: "1px solid rgba(212,168,67,0.15)" }}
            >
              <div className="mt-1" style={{ color: dim.iconColor }}>
                {iconMap[dim.icon] || <Zap className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-sm">{dim.name}</h4>
                <p className="text-white/50 text-xs">{dim.tagline}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-white/40 text-xs">{dim.maxScore} pts</div>
                <span className="font-bold text-lg" style={{ color: scoreColorMap[dim.scoreColor] || "#2DD4BF" }}>
                  {dim.score} / {dim.maxScore}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-3 rounded-xl p-3 text-center"
          style={{ background: "#1A1A12", border: "1px solid rgba(212,168,67,0.3)" }}>
          <span className="text-white/60 text-sm">Total Dignity Score: </span>
          <span className="text-white font-bold text-xl">{data.totalScore} / 100</span>
        </div>
      </div>

      {/* 90-Day Climb */}
      <div className="px-4 mt-6">
        <h3 className="text-amber-400 font-bold text-xs tracking-wider mb-2">YOUR 90-DAY CLIMB</h3>
        <div className="rounded-2xl p-4" style={{ background: "#1A1A12" }}>
          <ClimbChart data={data.climbData} currentDay={47} />
          <p className="text-white/50 text-center text-xs mt-2">{data.climbSummary}</p>
        </div>
      </div>

      {/* Philosophy */}
      <div className="px-4 mt-6">
        <h3 className="text-amber-400 font-bold text-xs tracking-wider mb-3">THE PHILOSOPHY</h3>
        <div className="rounded-xl p-4" style={{ background: "#1A1A12", border: "1px solid rgba(212,168,67,0.15)" }}>
          <p className="text-white/70 text-sm leading-relaxed italic">{data.philosophyText}</p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 mt-6">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/grace")}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg"
          style={{ background: "linear-gradient(135deg, #D4878F, #C07080)" }}
        >
          Talk to Grace Now
        </motion.button>
      </div>

      {/* Divider */}
      <div className="mx-4 my-6 border-t border-white/10" />

      {/* Also Working For You — Cascade */}
      <div className="px-4">
        <h3 className="text-amber-400 font-bold text-xs tracking-wider mb-1">ALSO WORKING FOR YOU</h3>
        <p className="text-white/40 text-xs mb-3">Swipe up to explore everything Grace does for you</p>
        <div className="space-y-2">
          {data.workingForYouServices.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        {/* Explore more */}
        <div className="mt-4 rounded-xl p-3 flex items-center justify-between"
          style={{ background: "#1A1A12", border: "1px solid rgba(45,212,191,0.2)" }}>
          <div>
            <p className="text-white text-sm font-medium">Grace has even more tools waiting for you</p>
            <p className="text-white/40 text-xs">Explore the full Village</p>
          </div>
          <ArrowRight className="w-5 h-5 text-teal-400" />
        </div>
      </div>
    </div>
  );
}
