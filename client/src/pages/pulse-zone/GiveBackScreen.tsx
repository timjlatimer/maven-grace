import React from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { mockData } from "@/components/pulse-zone/mockData";

function GiveBackHero() {
  return (
    <div className="rounded-2xl p-6 flex flex-col items-center" style={{ background: "#111827" }}>
      {/* TP-inspired circle */}
      <div className="w-20 h-20 rounded-full mb-4"
        style={{ background: "linear-gradient(135deg, #D4A08F, #C09080)" }} />
      <p className="text-cyan-400 text-center text-sm font-medium">
        {mockData.giveBack.graceQuote}
      </p>
      <p className="text-cyan-400 text-center text-sm mt-1">
        {mockData.giveBack.graceSubQuote}
      </p>
    </div>
  );
}

function ProgramCard({ program, index }: {
  program: typeof mockData.giveBack.programs[0]; index: number;
}) {
  const badgeColorMap: Record<string, string> = {
    teal: "#2DD4BF",
    orange: "#E8A020",
    red: "#E05050",
  };
  const badgeColor = badgeColorMap[program.badgeColor] || "#2DD4BF";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 * index }}
      className="rounded-xl p-3 flex items-center gap-3"
      style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Circle icon */}
      <div className="w-8 h-8 rounded-full flex-shrink-0"
        style={{ background: "linear-gradient(135deg, #D4A08F, #C09080)" }} />
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-semibold text-sm">{program.name}</h4>
        <p className="text-white/40 text-xs truncate">{program.tagline}</p>
      </div>
      {/* Status badge */}
      <div className="w-20 h-2 rounded-full flex-shrink-0" style={{ background: badgeColor }} />
    </motion.div>
  );
}

export default function GiveBackScreen() {
  const [, navigate] = useLocation();
  const data = mockData.giveBack;

  return (
    <div className="min-h-screen pb-8" style={{ background: "#0A0F1A" }}>
      {/* Header */}
      <div className="pt-12 px-4">
        <button onClick={() => navigate("/pulse")} className="flex items-center gap-1 text-amber-400 mb-2">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Pulse Zone</span>
        </button>
        <h1 className="text-3xl font-bold text-white leading-tight">Give Back</h1>
        <p className="text-white/50 text-sm mt-1">What the Village gives to you</p>
      </div>

      {/* Hero */}
      <div className="px-4 mt-4">
        <GiveBackHero />
      </div>

      {/* Programs */}
      <div className="px-4 mt-6">
        <h3 className="text-cyan-400 font-bold text-xs tracking-wider mb-3">WHAT THE VILLAGE PROVIDES</h3>
        <div className="space-y-2">
          {data.programs.map((program, i) => (
            <ProgramCard key={program.id} program={program} index={i} />
          ))}
        </div>

        {/* Count bar */}
        <div className="mt-3 rounded-xl p-3 text-center"
          style={{ border: "1px solid #2DD4BF" }}>
          <span className="text-cyan-400 font-bold">
            {data.programs.length} programs working for you
          </span>
        </div>
      </div>

      {/* How It Works */}
      <div className="px-4 mt-6">
        <h3 className="text-cyan-400 font-bold text-xs tracking-wider mb-3">HOW IT WORKS</h3>
        <div className="flex gap-3">
          {data.howItWorks.map((step, i) => (
            <div key={i} className="flex-1 rounded-xl p-3 text-center"
              style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)" }}>
              <p className="text-white text-xs font-medium">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 mt-6">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/grace")}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg"
          style={{ background: "#2DD4BF" }}
        >
          Tell Grace What You Need
        </motion.button>
        <p className="text-white/30 text-center text-xs mt-2">
          She's already watching. She just wants to hear it from you.
        </p>
      </div>
    </div>
  );
}
