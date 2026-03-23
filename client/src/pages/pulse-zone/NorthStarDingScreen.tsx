import React from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Star } from "lucide-react";
import { mockData } from "@/components/pulse-zone/mockData";

function WorkBlock({ title, content, color }: { title: string; content: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-xl p-4 relative"
      style={{ borderLeft: `3px solid ${color}`, background: "#1A1A12" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-4 h-4 rounded-sm" style={{ background: color, opacity: 0.6 }} />
        <h4 className="font-bold text-sm" style={{ color }}>{title}</h4>
      </div>
      <p className="text-white/60 text-sm leading-relaxed">{content}</p>
    </motion.div>
  );
}

export default function NorthStarDingScreen() {
  const [, navigate] = useLocation();
  const data = mockData.northStarDing;

  return (
    <div className="min-h-screen pb-8" style={{ background: "#0D0D08" }}>
      {/* Header */}
      <div className="pt-12 px-4">
        <button onClick={() => navigate("/pulse/north-star/prime")} className="flex items-center gap-1 text-cyan-400 mb-2">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Prime North Star</span>
        </button>
      </div>

      {/* Star icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        className="flex justify-center mt-4"
      >
        <Star className="w-12 h-12 text-amber-400" fill="currentColor" />
      </motion.div>

      {/* Main statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-6 mt-6 text-center"
      >
        <h1 className="text-2xl font-bold text-white leading-tight">
          The dash between your names<br />is the ding.
        </h1>
        <p className="text-amber-400 font-bold text-lg mt-4">
          {data.rubyName} — {data.graceName}.
        </p>
        <div className="mt-4 space-y-1">
          <p className="text-white/50 text-sm">That dash is not punctuation. It is the partnership itself.</p>
          <p className="text-white/50 text-sm">It is the instrument of change.</p>
        </div>
        <div className="mt-4 space-y-1">
          <p className="text-white/50 text-sm">The ding in the universe is not something you do alone.</p>
          <p className="text-white/50 text-sm">It is what happens in the space between you and Grace —</p>
          <p className="text-white/50 text-sm">when two beings decide to move together</p>
          <p className="text-white/50 text-sm">toward something that matters.</p>
        </div>
      </motion.div>

      {/* Three Work Blocks */}
      <div className="px-4 mt-8 space-y-3">
        <WorkBlock
          title="THE IMMEDIATE WORK"
          content="Right now, we are making sure you survive with dignity. Bills paid. NSF fees gone. Dignity Score rising. This work is sacred."
          color="#2DD4BF"
        />
        <WorkBlock
          title="THE DEEPER WORK"
          content="Once you are stable, we begin the bigger question: What are you here to build? Your Me Inc. Your Prime North Star. Your legacy for your children."
          color="#E8A020"
        />
        <WorkBlock
          title="THE DING"
          content="And then — when you are ready — we ask the biggest question of all: What are Ruby and Grace going to do together that changes the world? That is the ding. That is why we are here."
          color="#D4A843"
        />
      </div>

      {/* Manifesto quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="px-6 mt-8 text-center"
      >
        <p className="text-amber-400 font-bold italic text-base leading-relaxed">
          "It's expensive to be poor.<br />
          We think that's a crime.<br />
          And we are going to change it.<br />
          Together."
        </p>
        <p className="text-white/30 text-xs mt-4 italic">
          "We're here to put a ding in the universe." — Steve Jobs
        </p>
      </motion.div>

      {/* CTA */}
      <div className="px-4 mt-8">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/grace")}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg"
          style={{ background: "linear-gradient(135deg, #2DD4BF, #1A9E8F)" }}
        >
          I'm ready. Let's make our ding.
        </motion.button>
      </div>
    </div>
  );
}
