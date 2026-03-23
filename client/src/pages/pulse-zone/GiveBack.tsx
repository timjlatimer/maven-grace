import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { COLORS, getBadgeColor } from "@/components/pulse-zone/pulseTheme";
import { pulseData } from "@/components/pulse-zone/pulseData";

export default function GiveBack() {
  const [, navigate] = useLocation();
  const data = pulseData.giveBack;

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: COLORS.villageBg }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <button onClick={() => navigate("/pulse-zone")} className="flex items-center gap-1 mb-3">
          <ChevronLeft className="w-4 h-4" style={{ color: COLORS.amber }} />
          <span className="text-sm" style={{ color: COLORS.amber }}>Pulse Zone</span>
        </button>
        <h1 className="text-3xl font-bold leading-tight" style={{ color: COLORS.white }}>Give Back</h1>
        <p className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>What the Village gives to you</p>
      </div>

      {/* Hero Card */}
      <div className="mx-4 mt-4 p-6 rounded-2xl flex flex-col items-center" style={{ backgroundColor: COLORS.villageCard }}>
        {/* TP Roll icon */}
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: '#D4878F40' }}>
          <span className="text-3xl">🧻</span>
        </div>
        <p className="text-sm text-center" style={{ color: COLORS.teal }}>{data.graceQuote}</p>
        <p className="text-sm text-center mt-1" style={{ color: COLORS.teal }}>{data.graceSubQuote}</p>
      </div>

      {/* What The Village Provides */}
      <div className="px-4 mt-6">
        <h3 className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: COLORS.teal }}>
          WHAT THE VILLAGE PROVIDES
        </h3>
        <div className="flex flex-col gap-2">
          {data.programs.map((program, i) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{ backgroundColor: COLORS.villageCard }}
            >
              <div className="w-3 h-3 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: '#D4878F' }} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: COLORS.white }}>{program.name}</p>
                <p className="text-xs mt-0.5" style={{ color: COLORS.textSecondary }}>{program.tagline}</p>
              </div>
              {/* Status badge */}
              <div className="shrink-0 w-20 h-3 rounded-full mt-2" style={{ backgroundColor: getBadgeColor(program.badgeColor) }} />
            </motion.div>
          ))}
        </div>

        {/* Programs Count */}
        <div className="mt-3 p-3 rounded-xl border" style={{ borderColor: COLORS.borderTeal, backgroundColor: COLORS.villageCard }}>
          <p className="text-center font-bold" style={{ color: COLORS.teal }}>
            {data.programs.length} programs working for you
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="px-4 mt-6">
        <h3 className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: COLORS.teal }}>
          HOW IT WORKS
        </h3>
        <div className="flex gap-3">
          {data.howItWorks.map((step, i) => (
            <div key={i} className="flex-1 p-3 rounded-xl text-center" style={{ backgroundColor: COLORS.villageCard }}>
              <p className="text-xs font-medium" style={{ color: COLORS.textSecondary }}>{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 mt-6">
        <button
          onClick={() => navigate("/grace")}
          className="w-full py-4 rounded-full text-lg font-bold"
          style={{ backgroundColor: COLORS.tealCTA, color: COLORS.white }}
        >
          Tell Grace What You Need
        </button>
        <p className="text-center text-xs mt-2" style={{ color: COLORS.textMuted }}>
          She's already watching. She just wants to hear it from you.
        </p>
      </div>
    </div>
  );
}
