import React from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, MessageSquare, CreditCard, BarChart2, Home, Users, Heart, Check } from "lucide-react";
import { mockData } from "@/components/pulse-zone/mockData";

const iconMap: Record<string, React.ReactNode> = {
  "message-square": <MessageSquare className="w-5 h-5" />,
  "credit-card": <CreditCard className="w-5 h-5" />,
  "bar-chart-2": <BarChart2 className="w-5 h-5" />,
  home: <Home className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
};

function BatteryVisual({ percent }: { percent: number }) {
  const fillWidth = Math.min(100, Math.max(0, percent));
  return (
    <div className="flex items-center justify-center py-6">
      <div className="relative w-48 h-24">
        {/* Battery body */}
        <div className="absolute inset-0 rounded-xl border-2 border-gray-600 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${fillWidth}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full rounded-lg"
            style={{ background: "linear-gradient(90deg, #2DD4BF, #5EEAD4)" }}
          />
        </div>
        {/* Battery nub */}
        <div className="absolute right-[-8px] top-[30%] bottom-[30%] w-2 rounded-r bg-gray-600" />
        {/* Heart icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart className="w-8 h-8 text-gray-800" fill="currentColor" />
        </div>
      </div>
    </div>
  );
}

function ScoreDisplay({ current, max, color }: { current: number; max: number; color: string }) {
  const colorMap: Record<string, string> = {
    teal: "#2DD4BF",
    orange: "#E8A020",
    gold: "#FFD700",
  };
  return (
    <span className="font-bold text-lg" style={{ color: colorMap[color] || "#2DD4BF" }}>
      {current} / {max}
    </span>
  );
}

export default function GraceBatteryScreen() {
  const [, navigate] = useLocation();
  const data = mockData.graceBattery;

  return (
    <div className="min-h-screen pb-8" style={{ background: "#0D0D08" }}>
      {/* Header */}
      <div className="pt-12 px-4">
        <button onClick={() => navigate("/pulse")} className="flex items-center gap-1 text-amber-400 mb-2">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Pulse Zone</span>
        </button>
        <h1 className="text-3xl font-bold text-white leading-tight">Relationship</h1>
        <h1 className="text-3xl font-bold text-white leading-tight">Battery</h1>
        <p className="text-white/50 text-sm mt-1">How connected are we right now</p>
      </div>

      {/* Battery Visual */}
      <div className="mx-4 mt-4 rounded-2xl p-4" style={{ background: "#1A1A12" }}>
        <BatteryVisual percent={data.totalScore} />
        <div className="text-center">
          <span className="text-6xl font-bold text-white">{data.totalScore}%</span>
        </div>
        <p className="text-teal-400 text-center text-sm mt-2 italic">{data.graceQuote}</p>
      </div>

      {/* What Charges Our Relationship */}
      <div className="px-4 mt-6">
        <h3 className="text-amber-400 font-bold text-xs tracking-wider mb-3">WHAT CHARGES OUR RELATIONSHIP</h3>
        <div className="space-y-2">
          {data.factors.map((factor, i) => (
            <motion.div
              key={factor.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="rounded-xl p-3 flex items-start gap-3"
              style={{ background: "#1A1A12", border: "1px solid rgba(212,168,67,0.15)" }}
            >
              <div className="mt-1" style={{ color: factor.iconColor }}>
                {iconMap[factor.icon] || <MessageSquare className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-white font-semibold text-sm">{factor.name}</h4>
                    <p className="text-white/50 text-xs mt-0.5">{factor.description}</p>
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    <div className="text-white/40 text-xs">{factor.weightPercent}%</div>
                    <ScoreDisplay current={factor.currentScore} max={factor.maxScore} color={factor.scoreColor} />
                    {factor.hasBonus && <span className="text-yellow-400 text-xs ml-0.5">★</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-3 rounded-xl p-3 text-center"
          style={{ background: "#1A1A12", border: "1px solid rgba(212,168,67,0.3)" }}>
          <span className="text-white/60 text-sm">Total Relationship Battery: </span>
          <span className="text-white font-bold text-xl">{data.totalScore} / 100</span>
        </div>
      </div>

      {/* What's Available Right Now */}
      <div className="px-4 mt-6">
        <h3 className="text-amber-400 font-bold text-xs tracking-wider mb-3">WHAT'S AVAILABLE RIGHT NOW</h3>
        <div className="space-y-2">
          {data.availableFeatures.map((feature) => (
            <div key={feature.id} className="rounded-xl p-3 flex items-start gap-3"
              style={{ background: "#1A1A12" }}>
              <Check className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <p className="text-white/80 text-sm">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* The Philosophy */}
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
    </div>
  );
}
