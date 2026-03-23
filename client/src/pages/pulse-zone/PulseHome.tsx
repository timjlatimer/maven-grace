import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Battery, Star, Users, Search, MessageSquare, GitBranch, Pentagon, ChevronUp } from "lucide-react";
import { COLORS } from "@/components/pulse-zone/pulseTheme";
import { pulseData } from "@/components/pulse-zone/pulseData";

// KPI Pill Component
function KPIPill({ label, value, icon: Icon, onClick }: { label: string; value: string | number; icon: React.ElementType; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95, opacity: 0.85 }}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-full min-w-0"
      style={{ backgroundColor: COLORS.amberPill }}
    >
      <Icon className="w-4 h-4 shrink-0" style={{ color: COLORS.white }} />
      <div className="flex flex-col items-start min-w-0">
        <span className="text-[10px] font-medium leading-tight" style={{ color: 'rgba(255,255,255,0.85)' }}>{label}</span>
        <span className="text-sm font-bold leading-tight" style={{ color: COLORS.white }}>{String(value)}</span>
      </div>
    </motion.button>
  );
}

// Heartbeat Quadrant
function Quadrant({ icon: Icon, label, subtitle, position, onClick }: {
  icon: React.ElementType; label: string; subtitle: string; position: string; onClick?: () => void;
}) {
  const posStyles: Record<string, string> = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };
  const alignStyles: Record<string, string> = {
    "top-left": "items-center text-center",
    "top-right": "items-center text-center",
    "bottom-left": "items-center text-center",
    "bottom-right": "items-center text-center",
  };
  return (
    <button
      onClick={onClick}
      className={`absolute ${posStyles[position]} flex flex-col ${alignStyles[position]} w-[42%] h-[42%] justify-center`}
    >
      <Icon className="w-5 h-5 mb-1" style={{ color: 'rgba(255,255,255,0.8)' }} />
      <span className="text-lg font-bold" style={{ color: COLORS.white }}>{label}</span>
      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{subtitle}</span>
    </button>
  );
}

// Floating North Star Button
function FloatingNorthStar({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      animate={{ scale: [1, 1.08, 1], opacity: [0.43, 0.55, 0.43] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="absolute z-20"
      style={{ right: 16, top: 148 }}
      aria-label="Your North Star — tap to explore your 90-day journey"
    >
      <svg width="48" height="48" viewBox="0 0 68 68" fill="none">
        <polygon
          points="34,4 42,26 66,26 48,41 55,64 34,50 13,64 20,41 2,26 26,26"
          fill="rgba(255,255,255,0.43)"
          stroke="rgba(255,255,255,0.67)"
          strokeWidth="1.5"
        />
      </svg>
    </motion.button>
  );
}

// Floating TP Roll Button
function FloatingTPRoll({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      className="absolute z-20 bottom-6 right-4 w-14 h-14 rounded-full flex items-center justify-center"
      style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)' }}
      aria-label="Give Back — tap to see what the Village provides"
    >
      <span className="text-2xl">🧻</span>
    </motion.button>
  );
}

export default function PulseHome() {
  const [, navigate] = useLocation();
  const { greeting, kpiPills } = pulseData;

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: COLORS.background }}>
      {/* KPI Pill Row */}
      <div className="relative z-10 flex gap-2 px-3 pt-4 pb-2 overflow-x-auto">
        <KPIPill label={kpiPills.battery.label} value={kpiPills.battery.value} icon={Battery} onClick={() => navigate("/pulse-zone/battery")} />
        <KPIPill label={kpiPills.dignity.label} value={kpiPills.dignity.value} icon={Star} onClick={() => navigate("/pulse-zone/dignity")} />
        <KPIPill label={kpiPills.village.label} value={kpiPills.village.value} icon={Users} onClick={() => navigate("/pulse-zone/village")} />
      </div>

      {/* Greeting */}
      <div className="relative z-10 px-4 pt-1 pb-2">
        <h2 className="text-lg font-bold" style={{ color: COLORS.amber }}>{greeting.title}</h2>
        <p className="text-sm" style={{ color: COLORS.textSecondary }}>{greeting.subtitle}</p>
      </div>

      {/* Floating North Star */}
      <FloatingNorthStar onClick={() => navigate("/pulse-zone/north-star")} />

      {/* Heartbeat Circle */}
      <div className="relative z-10 flex flex-col items-center justify-center" style={{ minHeight: '55vh' }}>
        {/* Outer rings */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.05, 0.15] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full"
          style={{ width: 340, height: 340, border: '1px solid', borderColor: COLORS.amber, opacity: 0.15 }}
        />
        <motion.div
          animate={{ scale: [1, 1.04, 1], opacity: [0.25, 0.1, 0.25] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full"
          style={{ width: 290, height: 290, border: '1px solid', borderColor: COLORS.amber, opacity: 0.25 }}
        />
        {/* Inner glow ring */}
        <motion.div
          animate={{ scale: [1, 1.02, 1], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full"
          style={{
            width: 260, height: 260,
            background: `radial-gradient(circle, ${COLORS.amber}40 0%, ${COLORS.amber}15 50%, transparent 70%)`,
          }}
        />

        {/* Main heartbeat circle */}
        <div
          className="relative rounded-full flex items-center justify-center"
          style={{
            width: 240, height: 240,
            background: `radial-gradient(circle at 40% 40%, ${COLORS.amberLight}90, ${COLORS.amber}70, ${COLORS.amberPill}50)`,
          }}
        >
          {/* Cross dividers */}
          <div className="absolute w-full h-[1px]" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
          <div className="absolute h-full w-[1px]" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />

          {/* Quadrants */}
          <Quadrant icon={Search} label="Research" subtitle="Dept" position="top-left" />
          <Quadrant icon={MessageSquare} label="Hello" subtitle="Let's Chat" position="top-right" onClick={() => navigate("/grace")} />
          <Quadrant icon={GitBranch} label="I Have" subtitle="a Guy" position="bottom-left" />
          <Quadrant icon={Pentagon} label="PTK" subtitle="Promises to Keep" position="bottom-right" onClick={() => navigate("/promises")} />

          {/* Center G logo */}
          <div className="absolute w-10 h-10 rounded-full border-2 flex items-center justify-center z-10"
            style={{ borderColor: COLORS.amber, backgroundColor: 'rgba(13,13,8,0.7)' }}>
            <span className="text-lg font-bold" style={{ color: COLORS.amber }}>G</span>
          </div>
        </div>

        {/* HEARTBEAT label */}
        <p className="mt-4 text-xs tracking-[0.3em] uppercase" style={{ color: COLORS.textMuted }}>
          HEARTBEAT
        </p>
      </div>

      {/* Swipe Up Indicator */}
      <div className="relative z-10 flex flex-col items-center pb-8">
        <ChevronUp className="w-5 h-5 mb-1" style={{ color: COLORS.textMuted }} />
        <span className="text-xs" style={{ color: COLORS.textMuted }}>swipe up</span>
      </div>

      {/* Floating TP Roll */}
      <FloatingTPRoll onClick={() => navigate("/pulse-zone/give-back")} />
    </div>
  );
}
