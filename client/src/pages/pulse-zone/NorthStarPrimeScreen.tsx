import React from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { useNorthStarPrimeData } from "@/hooks/usePulseZone";
import { ScreenContainer } from "@/components/pulse-zone/shared";
import { PULSE_THEME } from "@/components/pulse-zone/theme";

const CompassCard = ({ direction, label, title, text, letterColor }: {
  direction: string; label: string; title: string; text: string; letterColor: string;
}) => (
  <div className="rounded-xl p-4 relative" style={{ background: PULSE_THEME.bg.card, border: `1px solid ${PULSE_THEME.border.tealStrong}` }}>
    <span className="text-xs font-bold tracking-wider" style={{ color: PULSE_THEME.accent.cyan }}>{label}</span>
    <h3 className="text-white font-bold text-base mt-1">{title}</h3>
    <p className="text-white/50 text-sm mt-2">{text}</p>
    <p className="text-white/20 text-xs mt-3">tap to edit</p>
    <span className="absolute bottom-3 right-3 text-2xl font-bold" style={{ color: letterColor }}>{direction}</span>
  </div>
);

export default function NorthStarPrimeScreen() {
  const data = useNorthStarPrimeData();
  const [, navigate] = useLocation();
  return (
    <ScreenContainer>
      <div className="pt-12 px-4">
        <button onClick={() => navigate("/pulse/north-star")} className="flex items-center gap-1 mb-2" style={{ color: PULSE_THEME.accent.teal }}>
          <ChevronLeft className="w-5 h-5" /><span className="text-sm">North Star</span>
        </button>
        <span className="text-xs font-bold tracking-wider" style={{ color: PULSE_THEME.accent.amber }}>YOUR PRIME NORTH STAR</span>
        <h1 className="text-2xl font-bold text-white mt-1">You are the CEO of Me Inc.</h1>
      </div>
      <div className="mx-4 mt-6 rounded-xl p-5" style={{ background: PULSE_THEME.bg.elevated, border: `1px solid ${PULSE_THEME.border.tealStrong}` }}>
        <p className="text-white italic text-lg leading-relaxed">"What makes the great, great is a sense of destiny."</p>
        <p className="text-white/40 text-sm mt-2">— Tim Latimer, Destiny Discovered</p>
      </div>
      <div className="px-4 mt-6 grid grid-cols-2 gap-3">
        <CompassCard direction="N" label="NORTH" title="Purpose" text={data.purpose} letterColor="#1A6B5A" />
        <CompassCard direction="E" label="EAST" title="BHAG" text={data.bhag} letterColor="#4A4A4A" />
        <CompassCard direction="S" label="SOUTH" title="Prime Directive" text={data.primeDirective} letterColor="#4A4A4A" />
        <CompassCard direction="W" label="WEST" title="Core Values" text={data.coreValues.join(". ") + "."} letterColor="#4A4A4A" />
      </div>
      <p className="text-teal-400 text-center text-sm mt-6 px-4 italic">
        Ruby, you've always had a North Star. Grace just helped you find the words for it.
      </p>
      <div className="mx-4 mt-6 rounded-xl p-4" style={{ background: PULSE_THEME.bg.card, border: `1px solid ${PULSE_THEME.border.tealStrong}` }}>
        <h3 className="text-amber-400 font-bold text-base">Ready to go deeper?</h3>
        <p className="text-white/50 text-sm mt-1">Take the 30-question Destiny Discovered self-assessment</p>
        <p className="text-white/30 text-xs mt-1">Uncover your purpose, your values, and...</p>
        <motion.button whileTap={{ scale: 0.97 }} className="w-full mt-3 py-3 rounded-xl text-white font-bold text-sm"
          style={{ background: PULSE_THEME.accent.amberLight }}>
          Begin Your Discovery →
        </motion.button>
      </div>
      <div className="flex flex-col items-center mt-6 mb-8">
        <div className="w-3 h-3 rounded-full mb-2" style={{ background: PULSE_THEME.accent.teal }} />
        <button onClick={() => navigate("/pulse/north-star/ding")} className="text-teal-400 text-sm flex items-center gap-1">
          And then there's the biggest reason of all <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </ScreenContainer>
  );
}
