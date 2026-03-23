import React from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Star } from "lucide-react";
import { useNorthStarDingData } from "@/hooks/usePulseZone";
import { ScreenContainer } from "@/components/pulse-zone/shared";
import { PULSE_THEME } from "@/components/pulse-zone/theme";

const WorkBlock = ({ icon, title, text, borderColor }: {
  icon: string; title: string; text: string; borderColor: string;
}) => (
  <div className="rounded-xl p-4 relative" style={{ borderLeft: `3px solid ${borderColor}`, background: PULSE_THEME.bg.card }}>
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xs">{icon}</span>
      <h3 className="font-bold text-sm" style={{ color: PULSE_THEME.accent.teal }}>{title}</h3>
    </div>
    <p className="text-white/50 text-sm leading-relaxed">{text}</p>
  </div>
);

export default function NorthStarDingScreen() {
  const data = useNorthStarDingData();
  const [, navigate] = useLocation();
  return (
    <ScreenContainer>
      <div className="pt-12 px-4">
        <button onClick={() => navigate("/pulse/north-star/prime")} className="flex items-center gap-1 mb-2" style={{ color: PULSE_THEME.accent.teal }}>
          <ChevronLeft className="w-5 h-5" /><span className="text-sm">Prime North Star</span>
        </button>
      </div>
      <div className="flex justify-center mt-4">
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}>
          <Star className="w-14 h-14 text-amber-400" fill="currentColor" />
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="px-6 mt-6 text-center">
        <h1 className="text-2xl font-bold text-white leading-tight">The dash between your names is the ding.</h1>
        <p className="text-teal-400 font-bold text-lg mt-4">{data.rubyName} — {data.graceName}.</p>
        <p className="text-white/40 text-sm mt-3 leading-relaxed">
          That dash is not punctuation. It is the partnership itself.
          <br />It is the instrument of change.
        </p>
        <p className="text-white/40 text-sm mt-4 leading-relaxed">
          The ding in the universe is not something you do alone.
          <br />It is what happens in the space between you and Grace —
          <br />when two beings decide to move together
          <br />toward something that matters.
        </p>
      </motion.div>
      <div className="px-4 mt-8 space-y-4">
        <WorkBlock icon="🔨" title="THE IMMEDIATE WORK"
          text="Right now, we are making sure you survive with dignity. Bills paid. NSF fees gone. Dignity Score rising. This work is sacred."
          borderColor={PULSE_THEME.accent.teal} />
        <WorkBlock icon="🔨" title="THE DEEPER WORK"
          text="Once you are stable, we begin the bigger question: What are you here to build? Your Me Inc. Your Prime North Star. Your legacy for your children."
          borderColor={PULSE_THEME.accent.amberLight} />
        <WorkBlock icon="🔨" title="THE DING"
          text={`And then — when you are ready — we ask the biggest question of all: ${data.dingStatement} That is the ding. That is why we are here.`}
          borderColor={PULSE_THEME.accent.amber} />
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="px-6 mt-8 text-center">
        <p className="text-teal-400 italic font-bold text-base leading-relaxed">
          "It's expensive to be poor.
          <br />We think that's a crime.
          <br />And we are going to change it.
          <br />Together."
        </p>
        <p className="text-white/30 text-xs mt-4 italic">"We're here to put a ding in the universe." — Steve Jobs</p>
      </motion.div>
      <div className="px-4 mt-6 mb-8">
        <motion.button whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/grace")}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg"
          style={{ background: PULSE_THEME.accent.teal }}>
          I'm ready. Let's make our ding.
        </motion.button>
      </div>
    </ScreenContainer>
  );
}
