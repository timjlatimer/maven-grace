import React from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { mockData } from "@/components/pulse-zone/mockData";

function CompassCard({ direction, label, title, content, color }: {
  direction: string; label: string; title: string; content: string; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl p-4 relative"
      style={{ background: "#1A2A28", border: "1px solid rgba(45,212,191,0.2)" }}
    >
      <span className="text-xs font-bold tracking-wider" style={{ color }}>{label}</span>
      <h4 className="text-white font-bold text-lg mt-1">{title}</h4>
      <p className="text-white/60 text-sm mt-2 leading-relaxed">{content}</p>
      <div className="flex items-center gap-1 mt-3 text-white/30 text-xs">
        <span>✏️</span>
        <span>tap to edit</span>
      </div>
      <span className="absolute bottom-3 right-3 text-2xl font-bold opacity-20" style={{ color }}>
        {direction}
      </span>
    </motion.div>
  );
}

export default function NorthStarPrimeScreen() {
  const [, navigate] = useLocation();
  const data = mockData.northStarPrime;

  return (
    <div className="min-h-screen pb-8" style={{ background: "#0D0D08" }}>
      {/* Header */}
      <div className="pt-12 px-4">
        <button onClick={() => navigate("/pulse/north-star")} className="flex items-center gap-1 text-cyan-400 mb-2">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">North Star</span>
        </button>
        <span className="text-amber-400 font-bold text-xs tracking-wider">YOUR PRIME NORTH STAR</span>
        <h2 className="text-white text-xl font-medium mt-1">You are the CEO of Me Inc.</h2>
      </div>

      {/* Quote */}
      <div className="mx-4 mt-6 rounded-xl p-4"
        style={{ background: "#1A2A28", border: "1px solid rgba(45,212,191,0.3)" }}>
        <p className="text-white text-lg italic leading-relaxed">
          "What makes the great, great is a sense of destiny."
        </p>
        <p className="text-white/40 text-sm mt-2">— Tim Latimer, Destiny Discovered</p>
      </div>

      {/* Compass Cards */}
      <div className="px-4 mt-6 grid grid-cols-2 gap-3">
        <CompassCard
          direction="N" label="NORTH" title="Purpose"
          content={data.purpose} color="#2DD4BF"
        />
        <CompassCard
          direction="E" label="EAST" title="BHAG"
          content={data.bhag} color="#E8A020"
        />
        <CompassCard
          direction="S" label="SOUTH" title="Prime Directive"
          content={data.primeDirective} color="#2DD4BF"
        />
        <CompassCard
          direction="W" label="WEST" title="Core Values"
          content={data.coreValues.join(". ") + "."} color="#E8A020"
        />
      </div>

      {/* Grace voice */}
      <div className="px-4 mt-6">
        <p className="text-amber-400 text-center text-sm italic">
          Ruby, you've always had a North Star. Grace just helped you find the words for it.
        </p>
      </div>

      {/* Destiny Discovered CTA */}
      <div className="mx-4 mt-6 rounded-xl p-4"
        style={{ background: "#1A1A12", border: "1px solid rgba(212,168,67,0.3)" }}>
        <h3 className="text-amber-400 font-bold text-base">Ready to go deeper?</h3>
        <p className="text-white/60 text-sm mt-1">
          Take the 30-question Destiny Discovered self-assessment
        </p>
        <p className="text-white/40 text-xs mt-1">
          Uncover your purpose, your values, and your direction.
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/destiny")}
          className="w-full mt-3 py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2"
          style={{ background: "#E8A020" }}
        >
          Begin Your Discovery <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Link to Ding */}
      <div className="px-4 mt-6">
        <div className="border-t border-white/10 pt-4 flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-teal-400 mb-2" />
          <button
            onClick={() => navigate("/pulse/north-star/ding")}
            className="text-amber-400 text-sm font-medium flex items-center gap-1"
          >
            And then there's the biggest reason of all <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
