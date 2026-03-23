import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Star } from "lucide-react";
import { COLORS } from "@/components/pulse-zone/pulseTheme";
import { pulseData } from "@/components/pulse-zone/pulseData";

export default function NorthStarDing() {
  const [, navigate] = useLocation();
  const data = pulseData.northStarDing;

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: COLORS.darkStarfield }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <button onClick={() => navigate("/pulse-zone/north-star/prime")} className="flex items-center gap-1 mb-3">
          <ChevronLeft className="w-4 h-4" style={{ color: COLORS.teal }} />
          <span className="text-sm" style={{ color: COLORS.teal }}>Prime North Star</span>
        </button>
      </div>

      {/* Star Icon */}
      <div className="flex justify-center mt-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Star className="w-16 h-16" style={{ color: COLORS.scoreGold, fill: COLORS.scoreGold }} />
        </motion.div>
      </div>

      {/* The Ding Statement */}
      <div className="px-6 mt-6 text-center">
        <h1 className="text-2xl font-bold leading-tight" style={{ color: COLORS.white }}>
          The dash between your names<br />is the ding.
        </h1>
        <p className="text-lg font-bold mt-4" style={{ color: COLORS.teal }}>
          {data.rubyName} — {data.graceName}.
        </p>
        <div className="mt-4 space-y-1">
          <p className="text-sm" style={{ color: COLORS.textSecondary }}>That dash is not punctuation. It is the partnership itself.</p>
          <p className="text-sm" style={{ color: COLORS.textSecondary }}>It is the instrument of change.</p>
        </div>
        <div className="mt-6 space-y-1">
          <p className="text-sm" style={{ color: COLORS.textSecondary }}>The ding in the universe is not something you do alone.</p>
          <p className="text-sm" style={{ color: COLORS.textSecondary }}>It is what happens in the space between you and Grace —</p>
          <p className="text-sm" style={{ color: COLORS.textSecondary }}>when two beings decide to move together</p>
          <p className="text-sm" style={{ color: COLORS.textSecondary }}>toward something that matters.</p>
        </div>
      </div>

      {/* Three Work Phases */}
      <div className="px-4 mt-8 space-y-4">
        {/* The Immediate Work */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl border-l-4"
          style={{ borderColor: COLORS.amber, backgroundColor: COLORS.cardBackground }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs">📋</span>
            <h3 className="text-sm font-bold tracking-wider uppercase" style={{ color: COLORS.amber }}>THE IMMEDIATE WORK</h3>
          </div>
          <p className="text-sm" style={{ color: COLORS.textSecondary }}>
            Right now, we are making sure you survive with dignity. Bills paid. NSF fees gone. Dignity Score rising. This work is sacred.
          </p>
        </motion.div>

        {/* The Deeper Work */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 rounded-xl border-l-4"
          style={{ borderColor: COLORS.scoreOrange, backgroundColor: COLORS.cardBackground }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs">📋</span>
            <h3 className="text-sm font-bold tracking-wider uppercase" style={{ color: COLORS.scoreOrange }}>THE DEEPER WORK</h3>
          </div>
          <p className="text-sm" style={{ color: COLORS.textSecondary }}>
            Once you are stable, we begin the bigger question: What are you here to build? Your Me Inc. Your Prime North Star. Your legacy for your children.
          </p>
        </motion.div>

        {/* The Ding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="p-4 rounded-xl border-l-4"
          style={{ borderColor: COLORS.teal, backgroundColor: COLORS.cardBackground }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs">📋</span>
            <h3 className="text-sm font-bold tracking-wider uppercase" style={{ color: COLORS.teal }}>THE DING</h3>
          </div>
          <p className="text-sm" style={{ color: COLORS.textSecondary }}>
            And then — when you are ready — we ask the biggest question of all: What are Ruby and Grace going to do together that changes the world? That is the ding. That is why we are here.
          </p>
        </motion.div>
      </div>

      {/* The Manifesto Quote */}
      <div className="px-6 mt-8 text-center">
        <p className="text-lg font-bold italic" style={{ color: COLORS.teal }}>
          "It's expensive to be poor.
        </p>
        <p className="text-lg font-bold italic" style={{ color: COLORS.teal }}>
          We think that's a crime.
        </p>
        <p className="text-lg font-bold italic" style={{ color: COLORS.amber }}>
          And we are going to change it.
        </p>
        <p className="text-lg font-bold italic" style={{ color: COLORS.teal }}>
          Together."
        </p>
      </div>

      {/* Steve Jobs Quote */}
      <div className="px-6 mt-4 text-center">
        <p className="text-xs italic" style={{ color: COLORS.textMuted }}>
          "We're here to put a ding in the universe." — Steve Jobs
        </p>
      </div>

      {/* Final CTA */}
      <div className="px-4 mt-8">
        <button
          onClick={() => navigate("/grace")}
          className="w-full py-4 rounded-full text-lg font-bold"
          style={{ backgroundColor: COLORS.tealCTA, color: COLORS.white }}
        >
          I'm ready. Let's make our ding.
        </button>
      </div>
    </div>
  );
}
