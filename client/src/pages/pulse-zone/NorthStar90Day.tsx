import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Star, ArrowRight } from "lucide-react";
import { COLORS } from "@/components/pulse-zone/pulseTheme";
import { pulseData } from "@/components/pulse-zone/pulseData";

export default function NorthStar90Day() {
  const [, navigate] = useLocation();
  const data = pulseData.northStar90Day;

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: COLORS.darkStarfield }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <button onClick={() => navigate("/pulse-zone")} className="flex items-center gap-1 mb-3">
          <ChevronLeft className="w-4 h-4" style={{ color: COLORS.teal }} />
          <span className="text-sm" style={{ color: COLORS.teal }}>Pulse Zone</span>
        </button>
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold tracking-wider uppercase" style={{ color: COLORS.amber }}>YOUR NORTH STAR</h3>
          <Star className="w-4 h-4" style={{ color: COLORS.amber }} />
        </div>
        <h1 className="text-2xl font-bold mt-1" style={{ color: COLORS.white }}>90 Days with Grace</h1>
      </div>

      {/* Progress Ring */}
      <div className="mx-4 mt-4 p-6 rounded-2xl flex flex-col items-center" style={{ backgroundColor: COLORS.cardBackground }}>
        <div className="relative w-44 h-44">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#1A3330" strokeWidth="8" />
            <motion.circle
              cx="60" cy="60" r="52"
              fill="none"
              stroke={COLORS.teal}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - data.overallProgressPercent / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              transform="rotate(-90 60 60)"
            />
            <text x="60" y="55" textAnchor="middle" fill="white" fontSize="32" fontWeight="bold">{data.overallProgressPercent}%</text>
            <text x="60" y="72" textAnchor="middle" fill="#9CA3AF" fontSize="10">of your 100% lift goal</text>
          </svg>
        </div>
        <p className="text-sm mt-2 text-center italic" style={{ color: COLORS.teal }}>{data.graceVoice}</p>
      </div>

      {/* 8 Dimensions */}
      <div className="px-4 mt-6">
        <div className="flex flex-col gap-2">
          {data.dimensions.map((dim, i) => {
            const barColor = dim.progressPercent >= 50 ? COLORS.teal : COLORS.scoreOrange;
            const letter = dim.name.charAt(0).toUpperCase();
            return (
              <motion.div
                key={dim.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-3 rounded-xl"
                style={{ backgroundColor: COLORS.cardBackground }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${COLORS.tealDark}40`, border: `1px solid ${COLORS.teal}40` }}>
                    <span className="text-xs font-bold" style={{ color: COLORS.teal }}>{letter}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm" style={{ color: COLORS.white }}>{dim.name}</p>
                      <p className="text-sm font-bold" style={{ color: COLORS.teal }}>
                        {dim.dollarAmount >= 100 ? `$${dim.dollarAmount}` : `$${dim.dollarAmount}/mo`}
                        {dim.name === 'Neighbor Economy' || dim.name === 'Wisdom Giants' || dim.name === 'Barter Value' ? ' equivalent' : dim.name === 'Budget Mastery' ? '' : ' saved'}
                      </p>
                    </div>
                    <p className="text-xs" style={{ color: COLORS.textSecondary }}>{dim.feature}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: '#333' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${dim.progressPercent}%` }}
                          transition={{ delay: i * 0.08 + 0.3, duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: barColor }}
                        />
                      </div>
                      <span className="text-xs shrink-0" style={{ color: COLORS.textMuted }}>{dim.progressPercent}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Total Impact */}
      <div className="mx-4 mt-4 p-4 rounded-xl border" style={{ borderColor: COLORS.borderAmber, backgroundColor: COLORS.cardBackground }}>
        <p className="text-xs font-bold tracking-wider uppercase text-center" style={{ color: COLORS.amber }}>TOTAL 90-DAY IMPACT</p>
        <p className="text-3xl font-bold text-center mt-1" style={{ color: COLORS.teal }}>
          ${data.totalImpactDollars.toLocaleString()} kept in your pocket
        </p>
        <p className="text-sm text-center mt-1" style={{ color: COLORS.textSecondary }}>
          On track for ${data.projectedDay90Dollars.toLocaleString()} by Day 90
        </p>
      </div>

      {/* Navigation to Prime North Star */}
      <div className="px-4 mt-6 flex flex-col items-center">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.amber }} />
        <button onClick={() => navigate("/pulse-zone/north-star/prime")} className="flex items-center gap-2 mt-2">
          <span className="text-sm" style={{ color: COLORS.teal }}>There's a bigger reason you're here</span>
          <ArrowRight className="w-4 h-4" style={{ color: COLORS.teal }} />
        </button>
      </div>
    </div>
  );
}
