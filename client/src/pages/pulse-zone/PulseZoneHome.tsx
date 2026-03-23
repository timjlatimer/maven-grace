import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Battery, Star, Users, Search, MessageSquare, GitBranch, Pentagon } from "lucide-react";
import { mockData } from "@/components/pulse-zone/mockData";

// ─── KPI Pill ───────────────────────────────────────────────────────────────
function KPIPill({ label, value, icon, onClick }: {
  label: string; value: string | number; icon: React.ReactNode; onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-full"
      style={{
        background: "linear-gradient(135deg, #B8922E 0%, #D4A843 50%, #B8922E 100%)",
        boxShadow: "0 2px 8px rgba(212,168,67,0.3)",
        minWidth: 0,
      }}
    >
      <span className="opacity-80">{icon}</span>
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[10px] font-medium text-white/90 whitespace-nowrap">{label}</span>
        <span className="text-sm font-bold text-white whitespace-nowrap">{String(value)}</span>
      </span>
    </motion.button>
  );
}

// ─── Heartbeat Quadrant Wheel ───────────────────────────────────────────────
function HeartbeatWheel({ onQuadrantTap }: { onQuadrantTap: (route: string) => void }) {
  const quadrants = mockData.quadrants;
  const iconMap: Record<string, React.ReactNode> = {
    search: <Search className="w-5 h-5 text-white/80" />,
    "message-square": <MessageSquare className="w-5 h-5 text-white/80" />,
    "git-branch": <GitBranch className="w-5 h-5 text-white/80" />,
    pentagon: <Pentagon className="w-5 h-5 text-white/80" />,
  };

  return (
    <div className="relative w-72 h-72 mx-auto">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(212,168,67,0.15) 0%, rgba(212,168,67,0.05) 50%, transparent 70%)",
        }}
      />
      {/* Outer ring */}
      <div className="absolute inset-2 rounded-full border border-amber-700/30" />
      {/* Middle ring */}
      <div className="absolute inset-8 rounded-full border border-amber-600/40" />
      {/* Inner golden circle */}
      <div className="absolute inset-14 rounded-full"
        style={{
          background: "radial-gradient(circle at 40% 40%, #E8C060 0%, #D4A843 40%, #B8922E 80%, #8B6914 100%)",
          boxShadow: "0 0 40px rgba(212,168,67,0.4), inset 0 0 30px rgba(255,255,255,0.1)",
        }}
      />
      {/* Center G */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="w-8 h-8 rounded-full border border-amber-600/60 flex items-center justify-center"
          style={{ background: "rgba(13,13,8,0.6)" }}>
          <span className="text-amber-400 font-bold text-sm">G</span>
        </div>
      </div>
      {/* Cross lines */}
      <svg className="absolute inset-0 w-full h-full z-5" viewBox="0 0 288 288">
        <line x1="144" y1="56" x2="144" y2="232" stroke="rgba(212,168,67,0.2)" strokeWidth="0.5" />
        <line x1="56" y1="144" x2="232" y2="144" stroke="rgba(212,168,67,0.2)" strokeWidth="0.5" />
      </svg>
      {/* Quadrant labels */}
      {quadrants.map((q) => {
        const positions: Record<string, string> = {
          "top-left": "top-[30%] left-[12%]",
          "top-right": "top-[30%] right-[12%]",
          "bottom-left": "bottom-[28%] left-[12%]",
          "bottom-right": "bottom-[28%] right-[8%]",
        };
        return (
          <motion.button
            key={q.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => onQuadrantTap(q.route)}
            className={`absolute ${positions[q.position]} z-20 flex flex-col items-center gap-0.5`}
          >
            {iconMap[q.icon]}
            <span className="text-white font-bold text-sm">{q.label}</span>
            <span className="text-white/60 text-[10px]">{q.subtitle}</span>
          </motion.button>
        );
      })}
      {/* HEARTBEAT label */}
      <div className="absolute -bottom-8 left-0 right-0 text-center">
        <span className="text-amber-700/40 text-xs tracking-[0.3em] font-medium">HEARTBEAT</span>
      </div>
    </div>
  );
}

// ─── Floating TP Roll Button ────────────────────────────────────────────────
function FloatingTPRoll({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.8 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-8 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #F5F0E8 0%, #E8DDD0 100%)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4), 0 0 10px rgba(245,240,232,0.2)",
      }}
      aria-label="Give Back - Tap for TP"
    >
      {/* TP Roll icon */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <ellipse cx="14" cy="14" rx="10" ry="10" fill="#D4C4A8" />
        <ellipse cx="14" cy="14" rx="4" ry="4" fill="#F5F0E8" />
        <path d="M24 14 C24 14, 26 12, 26 10 C26 8, 24 7, 24 7" stroke="#C4B498" strokeWidth="1.5" fill="none" />
        <path d="M24 7 L26 7 L26 18 L24 18" stroke="#C4B498" strokeWidth="1" fill="#E8DDD0" />
      </svg>
    </motion.button>
  );
}

// ─── Floating North Star Button ─────────────────────────────────────────────
function FloatingNorthStar({ onClick }: { onClick: () => void }) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 150, damping: 12, delay: 1.2 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="absolute z-40"
      style={{ right: "16px", top: "0px" }}
      aria-label="Your North Star"
    >
      <div className="relative">
        {pulse && (
          <motion.div
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 rounded-full"
            style={{ background: "rgba(255,255,255,0.15)" }}
          />
        )}
        <Star
          className="w-8 h-8"
          fill="rgba(255,255,255,0.15)"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth={1.5}
        />
      </div>
    </motion.button>
  );
}

// ─── Main Pulse Zone Home Screen ────────────────────────────────────────────
export default function PulseZoneHome() {
  const [, navigate] = useLocation();
  const { greeting, kpiPills } = mockData;

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: "#0D0D08" }}
    >
      {/* Status bar spacer */}
      <div className="h-12" />

      {/* KPI Pills Row */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex gap-2 px-3 mb-3 overflow-x-auto no-scrollbar"
      >
        <KPIPill
          label={kpiPills.battery.label}
          value={kpiPills.battery.value}
          icon={<Battery className="w-4 h-4 text-white" />}
          onClick={() => navigate("/pulse/battery")}
        />
        <KPIPill
          label={kpiPills.dignity.label}
          value={kpiPills.dignity.value}
          icon={<Star className="w-4 h-4 text-white" />}
          onClick={() => navigate("/pulse/dignity")}
        />
        <KPIPill
          label={kpiPills.village.label}
          value={kpiPills.village.value}
          icon={<Users className="w-4 h-4 text-white" />}
          onClick={() => navigate("/pulse/village")}
        />
      </motion.div>

      {/* Greeting + North Star */}
      <div className="relative px-4 mb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h2 className="text-amber-400 font-semibold text-base">{greeting.title}</h2>
          <p className="text-white/50 text-sm">{greeting.subtitle}</p>
        </motion.div>
        {/* North Star floating button — positioned to the right of greeting */}
        <FloatingNorthStar onClick={() => navigate("/pulse/north-star")} />
      </div>

      {/* Heartbeat Wheel */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.4 }}
        >
          <HeartbeatWheel onQuadrantTap={(route) => navigate(route)} />
        </motion.div>
      </div>

      {/* Swipe up hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="text-center pb-6"
      >
        <div className="flex flex-col items-center gap-1">
          <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
            <path d="M2 10L10 2L18 10" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-white/30 text-xs">swipe up</span>
        </div>
      </motion.div>

      {/* Floating TP Roll */}
      <FloatingTPRoll onClick={() => navigate("/pulse/give-back")} />
    </div>
  );
}
