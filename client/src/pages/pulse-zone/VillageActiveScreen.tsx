import React from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Shield, Phone, Gift, ArrowRight } from "lucide-react";
import { mockData } from "@/components/pulse-zone/mockData";

// ─── Village Web Visualization ──────────────────────────────────────────────
function VillageWeb({ activeCount, totalCount }: { activeCount: number; totalCount: number }) {
  const nodePositions = [
    { x: 100, y: 25, label: "≈" },   // top
    { x: 45, y: 55, label: "★" },    // top-left
    { x: 155, y: 55, label: "◇" },   // top-right
    { x: 45, y: 105, label: "☺" },   // bottom-left
    { x: 155, y: 105, label: "↑" },  // bottom-right
    { x: 100, y: 135, label: "◁" },  // bottom
  ];

  return (
    <div className="flex flex-col items-center py-6">
      <div className="relative w-52 h-44">
        <svg className="w-full h-full" viewBox="0 0 200 160">
          {/* Connection lines */}
          {nodePositions.map((pos, i) => (
            <line key={`line-${i}`} x1="100" y1="80" x2={pos.x} y2={pos.y}
              stroke={i < activeCount ? "#2DD4BF" : "#374151"} strokeWidth="1.5" opacity="0.6" />
          ))}
          {/* Center node - RR */}
          <circle cx="100" cy="80" r="18" fill="#0A2A2A" stroke="#2DD4BF" strokeWidth="2" />
          <text x="100" y="84" textAnchor="middle" fill="#2DD4BF" fontSize="11" fontWeight="bold">RR</text>
          {/* Outer nodes */}
          {nodePositions.map((pos, i) => (
            <g key={`node-${i}`}>
              <motion.circle
                cx={pos.x} cy={pos.y} r="14"
                fill={i < activeCount ? "#0A3A3A" : "#1F2937"}
                stroke={i < activeCount ? "#2DD4BF" : "#374151"}
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 * i, type: "spring" }}
              />
              <text x={pos.x} y={pos.y + 4} textAnchor="middle"
                fill={i < activeCount ? "#2DD4BF" : "#6B7280"} fontSize="10">
                {pos.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="text-center mt-2">
        <span className="text-4xl font-bold text-cyan-400">{activeCount} of {totalCount}</span>
        <p className="text-white/50 text-sm">Active Connections</p>
      </div>
    </div>
  );
}

// ─── Village Pulse Bar Chart ────────────────────────────────────────────────
function VillagePulseChart({ data }: { data: { week: string; value: number }[] }) {
  const maxVal = Math.max(...data.map(d => d.value));
  return (
    <div className="rounded-2xl p-4" style={{ background: "#111827" }}>
      <div className="flex items-end justify-around h-32 gap-4">
        {data.map((d, i) => {
          const height = (d.value / (maxVal + 1)) * 100;
          return (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              {i === data.length - 1 && (
                <span className="text-cyan-400 text-xs font-bold">{d.value}</span>
              )}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
                className="w-full rounded-t"
                style={{ background: "#2DD4BF", minHeight: 4 }}
              />
              <span className="text-white/30 text-[10px]">{d.week}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Connection Row ─────────────────────────────────────────────────────────
function ConnectionRow({ connection, index }: { connection: typeof mockData.villageActive.connections[0]; index: number }) {
  const colorMap: Record<string, string> = { teal: "#2DD4BF", orange: "#E8A020" };
  const dotColor = colorMap[connection.iconColor] || "#2DD4BF";
  const metricText = typeof connection.metricValue === "number" && connection.metricValue > 0
    ? `${connection.metricValue} ${connection.metricLabel}`
    : typeof connection.metricValue === "string"
      ? connection.metricValue
      : connection.metricValue === 0 ? "0" : "";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * index }}
      className="rounded-xl p-3 flex items-center gap-3"
      style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: dotColor }} />
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-semibold text-sm">{connection.name}</h4>
        <p className="text-white/40 text-xs">{connection.type}</p>
      </div>
      <span className="text-sm font-medium flex-shrink-0" style={{ color: dotColor }}>
        {metricText}
      </span>
    </motion.div>
  );
}

// ─── Village Service Card ───────────────────────────────────────────────────
function VillageServiceCard({ service, index }: { service: typeof mockData.villageActive.alsoInVillageServices[0]; index: number }) {
  const colorMap: Record<string, string> = { teal: "#2DD4BF", orange: "#E8A020" };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.03 * index }}
      className="rounded-xl p-3 flex items-center gap-3"
      style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: colorMap[service.indicatorColor] || "#2DD4BF" }} />
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-semibold text-sm">{service.name}</h4>
        <p className="text-white/40 text-xs truncate">{service.tagline}</p>
      </div>
      <span className="text-sm font-medium flex-shrink-0" style={{ color: colorMap[service.indicatorColor] || "#2DD4BF" }}>
        {service.usageCount !== undefined ? `${service.usageCount} ${service.usageLabel}` : service.usageLabel}
      </span>
    </motion.div>
  );
}

// ─── Impact Card ────────────────────────────────────────────────────────────
function ImpactCard({ card }: { card: typeof mockData.villageActive.impactCards[0] }) {
  return (
    <div className="rounded-xl p-3 min-w-[140px]" style={{ background: "#111827" }}>
      <div className="w-6 h-6 rounded-full bg-cyan-400/20 flex items-center justify-center mb-2">
        <div className="w-2 h-2 rounded-full bg-cyan-400" />
      </div>
      <h4 className="text-white font-bold text-sm">{card.title}</h4>
      <p className="text-white/50 text-xs mt-1">{card.description}</p>
    </div>
  );
}

export default function VillageActiveScreen() {
  const [, navigate] = useLocation();
  const data = mockData.villageActive;

  return (
    <div className="min-h-screen pb-8" style={{ background: "#0A0F1A" }}>
      {/* Header */}
      <div className="pt-12 px-4">
        <button onClick={() => navigate("/pulse")} className="flex items-center gap-1 text-amber-400 mb-2">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Pulse Zone</span>
        </button>
        <h1 className="text-3xl font-bold text-white leading-tight">Village</h1>
        <h1 className="text-3xl font-bold text-white leading-tight">Active</h1>
        <p className="text-white/50 text-sm mt-1">Your connections in the Maven Village</p>
      </div>

      {/* Village Web */}
      <div className="mx-4 mt-4 rounded-2xl p-4" style={{ background: "#111827" }}>
        <VillageWeb activeCount={data.activeCount} totalCount={data.totalCount} />
        <p className="text-cyan-400 text-center text-sm italic">{data.graceQuote}</p>
      </div>

      {/* Your Village Connections */}
      <div className="px-4 mt-6">
        <h3 className="text-cyan-400 font-bold text-xs tracking-wider mb-3">YOUR VILLAGE CONNECTIONS</h3>
        <div className="space-y-2">
          {data.connections.map((conn, i) => (
            <ConnectionRow key={conn.id} connection={conn} index={i} />
          ))}
        </div>

        {/* Total bar */}
        <div className="mt-3 rounded-xl p-3 text-center"
          style={{ border: "1px solid #2DD4BF" }}>
          <span className="text-cyan-400 font-bold text-lg">
            {data.activeCount} of {data.totalCount} connections active
          </span>
        </div>
      </div>

      {/* 30-Day Village Pulse */}
      <div className="px-4 mt-6">
        <h3 className="text-cyan-400 font-bold text-xs tracking-wider mb-3">30-DAY VILLAGE PULSE</h3>
        <VillagePulseChart data={data.pulseChartData} />
        <p className="text-cyan-400 text-center text-sm italic mt-2">{data.pulseQuote}</p>
      </div>

      {/* What Your Village Does For You */}
      <div className="px-4 mt-6">
        <h3 className="text-cyan-400 font-bold text-xs tracking-wider mb-3">WHAT YOUR VILLAGE DOES FOR YOU</h3>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {data.impactCards.map((card) => (
            <ImpactCard key={card.id} card={card} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 mt-6">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/village")}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg"
          style={{ background: "#2DD4BF" }}
        >
          Meet Your Village
        </motion.button>
        <p className="text-white/30 text-center text-xs mt-1">See who's in your corner</p>
      </div>

      {/* Divider */}
      <div className="mx-4 my-6 border-t border-white/10" />

      {/* Also In Your Village — Cascade */}
      <div className="px-4">
        <h3 className="text-cyan-400 font-bold text-xs tracking-wider mb-1">ALSO IN YOUR VILLAGE</h3>
        <p className="text-white/40 text-xs mb-3">Swipe up to explore your community</p>
        <div className="space-y-2">
          {data.alsoInVillageServices.map((service, i) => (
            <VillageServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        {/* Explore more */}
        <div className="mt-4 rounded-xl p-3 flex items-center justify-between"
          style={{ background: "#111827", border: "1px solid rgba(45,212,191,0.2)" }}>
          <div>
            <p className="text-white text-sm font-medium">There's even more in your village</p>
            <p className="text-white/40 text-xs">Explore everything</p>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(45,212,191,0.15)", border: "1px solid rgba(45,212,191,0.3)" }}>
            <div className="w-3 h-3 rounded-full bg-white/60" />
          </div>
        </div>
      </div>
    </div>
  );
}
