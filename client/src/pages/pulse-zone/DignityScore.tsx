import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Zap, Shield, BarChart2, Droplet, MessageCircle, ArrowRight } from "lucide-react";
import { COLORS, getScoreColor, getDotColor } from "@/components/pulse-zone/pulseTheme";
import { pulseData } from "@/components/pulse-zone/pulseData";

const dimIconMap: Record<string, React.ElementType> = {
  "zap": Zap,
  "shield": Shield,
  "bar-chart-2": BarChart2,
  "droplet": Droplet,
  "message-circle": MessageCircle,
};

export default function DignityScore() {
  const [, navigate] = useLocation();
  const data = pulseData.dignityScore;

  // Build climb chart as simple SVG area chart
  const chartWidth = 320;
  const chartHeight = 100;
  const maxDay = 90;
  const maxScore = 100;
  const points = data.climbData.map(d => ({
    x: (d.day / maxDay) * chartWidth,
    y: chartHeight - (d.score / maxScore) * chartHeight,
  }));
  const areaPath = `M0,${chartHeight} ${points.map(p => `L${p.x},${p.y}`).join(' ')} L${points[points.length - 1].x},${chartHeight} Z`;
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: COLORS.background }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <button onClick={() => navigate("/pulse-zone")} className="flex items-center gap-1 mb-3">
          <ChevronLeft className="w-4 h-4" style={{ color: COLORS.amber }} />
          <span className="text-sm" style={{ color: COLORS.amber }}>Pulse Zone</span>
        </button>
        <h1 className="text-3xl font-bold leading-tight" style={{ color: COLORS.white }}>Dignity<br />Score</h1>
        <p className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>Your 90-day journey to financial freedom</p>
      </div>

      {/* Score Ring */}
      <div className="mx-4 mt-4 p-6 rounded-2xl flex flex-col items-center" style={{ backgroundColor: COLORS.cardBackground }}>
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            {/* Background ring */}
            <circle cx="60" cy="60" r="52" fill="none" stroke="#333" strokeWidth="8" />
            {/* Progress ring */}
            <motion.circle
              cx="60" cy="60" r="52"
              fill="none"
              stroke={COLORS.teal}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - data.totalScore / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              transform="rotate(-90 60 60)"
            />
            <text x="60" y="55" textAnchor="middle" fill="white" fontSize="32" fontWeight="bold">{data.totalScore}</text>
            <text x="60" y="72" textAnchor="middle" fill="#9CA3AF" fontSize="12">/100</text>
          </svg>
        </div>
        <p className="text-xs font-bold tracking-wider uppercase mt-2" style={{ color: data.tierColor }}>{data.tier}</p>
        <p className="text-sm mt-1 text-center" style={{ color: COLORS.teal }}>{data.graceQuote}</p>
      </div>

      {/* What Builds Your Score */}
      <div className="px-4 mt-6">
        <h3 className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: COLORS.amber }}>
          WHAT BUILDS YOUR SCORE
        </h3>
        <div className="flex flex-col gap-2">
          {data.dimensions.map((dim, i) => {
            const Icon = dimIconMap[dim.icon] || Zap;
            return (
              <motion.div
                key={dim.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ backgroundColor: COLORS.cardBackground }}
              >
                <Icon className="w-5 h-5 mt-1 shrink-0" style={{ color: dim.iconColor }} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm" style={{ color: COLORS.white }}>{dim.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: COLORS.textSecondary }}>{dim.tagline}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs" style={{ color: COLORS.textMuted }}>{dim.maxScore} pts</p>
                  <p className="font-bold text-sm" style={{ color: getScoreColor(dim.scoreColor) }}>
                    {dim.score} / {dim.maxScore}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Total */}
        <div className="mt-3 p-3 rounded-xl border" style={{ borderColor: COLORS.borderAmber, backgroundColor: COLORS.cardBackground }}>
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: COLORS.textSecondary }}>Total Dignity Score:</span>
            <span className="text-xl font-bold" style={{ color: COLORS.white }}>{data.totalScore} / 100</span>
          </div>
        </div>
      </div>

      {/* 90-Day Climb Chart */}
      <div className="px-4 mt-6">
        <h3 className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: COLORS.amber }}>
          YOUR 90-DAY CLIMB
        </h3>
        <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.cardBackground }}>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`} className="w-full">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(v => (
              <g key={v}>
                <line x1="0" y1={chartHeight - (v / 100) * chartHeight} x2={chartWidth} y2={chartHeight - (v / 100) * chartHeight} stroke="#333" strokeWidth="0.5" />
                <text x="-2" y={chartHeight - (v / 100) * chartHeight + 3} fill="#6B7280" fontSize="8" textAnchor="end">{v}</text>
              </g>
            ))}
            {/* Area */}
            <path d={areaPath} fill={`${COLORS.teal}30`} />
            {/* Line */}
            <path d={linePath} fill="none" stroke={COLORS.teal} strokeWidth="2" />
            {/* Current point */}
            {points.length > 0 && (
              <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="4" fill="white" stroke={COLORS.teal} strokeWidth="2" />
            )}
            {/* Day labels */}
            {[1, 30, 47, 60, 90].map(d => (
              <text key={d} x={(d / maxDay) * chartWidth} y={chartHeight + 14} fill="#6B7280" fontSize="8" textAnchor="middle">D{d}</text>
            ))}
            {/* Current day label */}
            {points.length > 0 && (
              <text x={points[points.length - 1].x} y={points[points.length - 1].y - 8} fill={COLORS.teal} fontSize="9" textAnchor="middle" fontWeight="bold">Day 47</text>
            )}
          </svg>
          <p className="text-sm text-center mt-2" style={{ color: COLORS.textSecondary }}>{data.climbSummary}</p>
        </div>
      </div>

      {/* Philosophy */}
      <div className="px-4 mt-6">
        <h3 className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: COLORS.amber }}>
          THE PHILOSOPHY
        </h3>
        <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.cardBackground }}>
          <p className="text-sm leading-relaxed" style={{ color: COLORS.textSecondary }}>{data.philosophyText}</p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 mt-6">
        <button
          onClick={() => navigate("/grace")}
          className="w-full py-4 rounded-full text-lg font-bold"
          style={{ backgroundColor: COLORS.roseCTA, color: COLORS.white }}
        >
          Talk to Grace Now
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 mt-8 mb-4 border-t" style={{ borderColor: '#333' }} />

      {/* Also Working For You — Service Cascade */}
      <div className="px-4 pb-8">
        <h3 className="text-xs font-bold tracking-wider uppercase mb-1" style={{ color: COLORS.amber }}>
          ALSO WORKING FOR YOU
        </h3>
        <p className="text-sm mb-3" style={{ color: COLORS.textSecondary }}>Swipe up to explore everything Grace does for you</p>
        <div className="flex flex-col gap-2">
          {data.workingForYouServices.map((svc, i) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{ backgroundColor: COLORS.cardBackground }}
            >
              <div className="w-3 h-3 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: getDotColor(svc.indicatorColor) }} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: COLORS.white }}>{svc.name}</p>
                <p className="text-xs mt-0.5 truncate" style={{ color: COLORS.textSecondary }}>{svc.tagline}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs" style={{ color: COLORS.textMuted }}>Score: {svc.score}</p>
                <p className="text-xs font-medium" style={{ color: getDotColor(svc.indicatorColor) }}>{svc.usageLabel}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Explore More */}
        <div className="mt-4 p-3 rounded-xl flex items-center justify-between" style={{ backgroundColor: COLORS.cardBackground }}>
          <div>
            <p className="text-sm font-medium" style={{ color: COLORS.white }}>Grace has even more tools waiting for you</p>
            <p className="text-xs" style={{ color: COLORS.textSecondary }}>Explore the full Village</p>
          </div>
          <ArrowRight className="w-5 h-5" style={{ color: COLORS.teal }} />
        </div>
      </div>
    </div>
  );
}
