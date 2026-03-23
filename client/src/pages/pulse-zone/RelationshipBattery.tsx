import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, MessageSquare, CreditCard, BarChart2, Home, Users, Check } from "lucide-react";
import { COLORS, getScoreColor } from "@/components/pulse-zone/pulseTheme";
import { pulseData } from "@/components/pulse-zone/pulseData";

const iconMap: Record<string, React.ElementType> = {
  "message-square": MessageSquare,
  "credit-card": CreditCard,
  "bar-chart-2": BarChart2,
  "home": Home,
  "users": Users,
};

export default function RelationshipBattery() {
  const [, navigate] = useLocation();
  const data = pulseData.graceBattery;

  const batteryFillPercent = data.totalScore;

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: COLORS.background }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <button onClick={() => navigate("/pulse-zone")} className="flex items-center gap-1 mb-3">
          <ChevronLeft className="w-4 h-4" style={{ color: COLORS.amber }} />
          <span className="text-sm" style={{ color: COLORS.amber }}>Pulse Zone</span>
        </button>
        <h1 className="text-3xl font-bold leading-tight" style={{ color: COLORS.white }}>Relationship<br />Battery</h1>
        <p className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>How connected are we right now</p>
      </div>

      {/* Battery Visual */}
      <div className="mx-4 mt-4 p-6 rounded-2xl flex flex-col items-center" style={{ backgroundColor: COLORS.cardBackground }}>
        <div className="relative w-48 h-24 rounded-lg border-2 border-gray-500 flex items-end overflow-hidden">
          {/* Battery nub */}
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-8 rounded-r-sm" style={{ backgroundColor: '#6B7280' }} />
          {/* Fill */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${batteryFillPercent}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full rounded-sm"
            style={{ backgroundColor: '#5EEAD4' }}
          />
          {/* Heart icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🖤</span>
          </div>
        </div>
        <p className="text-6xl font-bold mt-4" style={{ color: COLORS.white }}>{data.totalScore}%</p>
        <p className="text-sm mt-2 text-center" style={{ color: COLORS.teal }}>{data.graceQuote}</p>
      </div>

      {/* What Charges Our Relationship */}
      <div className="px-4 mt-6">
        <h3 className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: COLORS.amber }}>
          WHAT CHARGES OUR RELATIONSHIP
        </h3>
        <div className="flex flex-col gap-2">
          {data.factors.map((factor, i) => {
            const Icon = iconMap[factor.icon] || MessageSquare;
            return (
              <motion.div
                key={factor.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ backgroundColor: COLORS.cardBackground }}
              >
                <Icon className="w-5 h-5 mt-1 shrink-0" style={{ color: factor.iconColor }} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm" style={{ color: COLORS.white }}>{factor.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: COLORS.textSecondary }}>{factor.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs" style={{ color: COLORS.textMuted }}>{factor.weightPercent}%</p>
                  <p className="font-bold text-sm" style={{ color: getScoreColor(factor.scoreColor) }}>
                    {factor.currentScore} / {factor.maxScore}
                    {factor.hasBonus && <span className="text-yellow-400 ml-0.5">★</span>}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Total */}
        <div className="mt-3 p-3 rounded-xl border" style={{ borderColor: COLORS.borderAmber, backgroundColor: COLORS.cardBackground }}>
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: COLORS.textSecondary }}>Total Relationship Battery:</span>
            <span className="text-xl font-bold" style={{ color: COLORS.white }}>{data.totalScore} / 100</span>
          </div>
        </div>
      </div>

      {/* What's Available Right Now */}
      <div className="px-4 mt-6">
        <h3 className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: COLORS.amber }}>
          WHAT'S AVAILABLE RIGHT NOW
        </h3>
        <div className="flex flex-col gap-2">
          {data.availableFeatures.map((feature) => (
            <div key={feature.id} className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: COLORS.cardBackground }}>
              <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: COLORS.teal }} />
              <p className="text-sm" style={{ color: COLORS.textSecondary }}>{feature.text}</p>
            </div>
          ))}
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
    </div>
  );
}
