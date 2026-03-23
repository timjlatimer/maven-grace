import React from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Star, Zap, Shield, BarChart2, Users, BookOpen, Droplet, TrendingDown, RefreshCw, ArrowRight } from "lucide-react";
import { mockData } from "@/components/pulse-zone/mockData";

const iconMap: Record<string, React.ReactNode> = {
  zap: <Zap className="w-4 h-4" />,
  shield: <Shield className="w-4 h-4" />,
  "bar-chart": <BarChart2 className="w-4 h-4" />,
  users: <Users className="w-4 h-4" />,
  "book-open": <BookOpen className="w-4 h-4" />,
  droplet: <Droplet className="w-4 h-4" />,
  "trending-down": <TrendingDown className="w-4 h-4" />,
  "refresh-cw": <RefreshCw className="w-4 h-4" />,
};

function ProgressRing({ percent }: { percent: number }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#1A2A28" strokeWidth="10" />
        <motion.circle
          cx="80" cy="80" r={radius} fill="none"
          stroke="#2DD4BF" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-white">{percent}%</span>
        <span className="text-white/40 text-xs">of your 100% lift goal</span>
      </div>
    </div>
  );
}

function DimensionRow({ dimension, index }: {
  dimension: typeof mockData.northStar90Day.dimensions[0]; index: number;
}) {
  const progressColor = dimension.progressPercent >= 50 ? "#2DD4BF" : "#E8A020";
  const letterMap: Record<string, string> = {
    "Vampire Slayer": "V", "NSF Shield": "N", "Budget Mastery": "B",
    "Neighbor Economy": "N", "Wisdom Giants": "W", "Milk Money": "M",
    "Debt Reduced": "D", "Barter Value": "B",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index }}
      className="rounded-xl p-3"
      style={{ background: "#1A1A12", border: "1px solid rgba(212,168,67,0.1)" }}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(45,212,191,0.15)", border: "1px solid rgba(45,212,191,0.3)" }}>
          <span className="text-teal-400 font-bold text-xs">{letterMap[dimension.name] || "?"}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-white font-semibold text-sm">{dimension.name}</h4>
              <p className="text-white/40 text-xs">{dimension.feature}</p>
            </div>
            <span className="text-teal-400 font-bold text-sm flex-shrink-0 ml-2">
              {dimension.dollarLabel}
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-2 h-1.5 rounded-full bg-gray-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${dimension.progressPercent}%` }}
              transition={{ delay: 0.1 * index, duration: 0.8 }}
              className="h-full rounded-full"
              style={{ background: progressColor }}
            />
          </div>
          <span className="text-white/30 text-[10px] mt-0.5 block text-right">{dimension.progressPercent}%</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function NorthStar90DayScreen() {
  const [, navigate] = useLocation();
  const data = mockData.northStar90Day;

  return (
    <div className="min-h-screen pb-8" style={{ background: "#0D0D08" }}>
      {/* Header */}
      <div className="pt-12 px-4">
        <button onClick={() => navigate("/pulse")} className="flex items-center gap-1 text-amber-400 mb-2">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Pulse Zone</span>
        </button>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-amber-400 font-bold text-xs tracking-wider">YOUR NORTH STAR</span>
          <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
        </div>
        <h2 className="text-white text-xl font-medium">90 Days with Grace</h2>
      </div>

      {/* Progress Ring */}
      <div className="px-4 mt-6">
        <ProgressRing percent={data.overallProgressPercent} />
        <p className="text-amber-400 text-center text-sm italic mt-4">{data.graceVoice}</p>
      </div>

      {/* Dimensions */}
      <div className="px-4 mt-6 space-y-2">
        {data.dimensions.map((dim, i) => (
          <DimensionRow key={dim.id} dimension={dim} index={i} />
        ))}
      </div>

      {/* Total Impact */}
      <div className="mx-4 mt-4 rounded-xl p-4 text-center"
        style={{ background: "#1A2A12", border: "1px solid rgba(45,212,191,0.3)" }}>
        <span className="text-amber-400 font-bold text-xs tracking-wider">TOTAL 90-DAY IMPACT</span>
        <div className="mt-1">
          <span className="text-teal-400 font-bold text-2xl">${data.totalImpactDollars.toLocaleString()} kept in your pocket</span>
        </div>
        <p className="text-white/50 text-xs mt-1">
          On track for ${data.projectedDay90Dollars.toLocaleString()} by Day 90
        </p>
      </div>

      {/* Link to Prime */}
      <div className="px-4 mt-6">
        <div className="border-t border-white/10 pt-4 flex flex-col items-center">
          <Star className="w-4 h-4 text-amber-400 mb-1" fill="currentColor" />
          <button
            onClick={() => navigate("/pulse/north-star/prime")}
            className="text-amber-400 text-sm font-medium flex items-center gap-1"
          >
            There's a bigger reason you're here <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
