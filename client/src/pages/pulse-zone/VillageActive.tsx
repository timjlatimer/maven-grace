import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Shield, Phone, Gift, ArrowRight } from "lucide-react";
import { COLORS, getDotColor } from "@/components/pulse-zone/pulseTheme";
import { pulseData } from "@/components/pulse-zone/pulseData";

export default function VillageActive() {
  const [, navigate] = useLocation();
  const data = pulseData.villageActive;

  // Bar chart data
  const maxVal = Math.max(...data.pulseChartData.map(d => d.value));

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: COLORS.villageBg }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <button onClick={() => navigate("/pulse")} className="flex items-center gap-1 mb-3">
          <ChevronLeft className="w-4 h-4" style={{ color: COLORS.amber }} />
          <span className="text-sm" style={{ color: COLORS.amber }}>Pulse Zone</span>
        </button>
        <h1 className="text-3xl font-bold leading-tight" style={{ color: COLORS.white }}>Village<br />Active</h1>
        <p className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>Your connections in the Maven Village</p>
      </div>

      {/* Village Hub Visualization */}
      <div className="mx-4 mt-4 p-6 rounded-2xl flex flex-col items-center" style={{ backgroundColor: COLORS.villageCard }}>
        {/* Simple hub visualization */}
        <div className="relative w-56 h-56">
          {/* Center node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center z-10"
            style={{ backgroundColor: COLORS.tealDark, border: `3px solid ${COLORS.teal}` }}>
            <span className="text-sm font-bold" style={{ color: COLORS.white }}>RR</span>
          </div>
          {/* Satellite nodes */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle - 90) * (Math.PI / 180);
            const x = 50 + 38 * Math.cos(rad);
            const y = 50 + 38 * Math.sin(rad);
            const isActive = i < data.activeCount;
            return (
              <div key={i} className="absolute w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  left: `${x}%`, top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: isActive ? COLORS.tealDark : '#333',
                  border: `2px solid ${isActive ? COLORS.teal : '#555'}`,
                }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: isActive ? COLORS.teal : '#666' }} />
              </div>
            );
          })}
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const rad = (angle - 90) * (Math.PI / 180);
              const x = 50 + 38 * Math.cos(rad);
              const y = 50 + 38 * Math.sin(rad);
              const isActive = i < data.activeCount;
              return (
                <line key={i} x1="50" y1="50" x2={x} y2={y}
                  stroke={isActive ? COLORS.teal : '#444'}
                  strokeWidth="1"
                  opacity={isActive ? 0.6 : 0.3}
                />
              );
            })}
          </svg>
        </div>
        <p className="text-4xl font-bold mt-4" style={{ color: COLORS.teal }}>
          {data.activeCount} of {data.totalCount}
        </p>
        <p className="text-sm" style={{ color: COLORS.textSecondary }}>Active Connections</p>
        <p className="text-sm mt-2 text-center" style={{ color: COLORS.teal }}>{data.graceQuote}</p>
      </div>

      {/* Your Village Connections */}
      <div className="px-4 mt-6">
        <h3 className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: COLORS.teal }}>
          YOUR VILLAGE CONNECTIONS
        </h3>
        <div className="flex flex-col gap-2">
          {data.connections.map((conn, i) => (
            <motion.div
              key={conn.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ backgroundColor: COLORS.villageCard }}
            >
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: getDotColor(conn.iconColor) }} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: COLORS.white }}>{conn.name}</p>
                <p className="text-xs" style={{ color: COLORS.textSecondary }}>{conn.type}</p>
              </div>
              <p className="text-sm font-medium shrink-0" style={{ color: getDotColor(conn.iconColor) }}>
                {typeof conn.metricValue === 'number' && conn.metricValue > 0
                  ? `${conn.metricValue} ${conn.metricLabel}`
                  : typeof conn.metricValue === 'string'
                    ? conn.metricValue
                    : '0'}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Active Count Banner */}
        <div className="mt-3 p-3 rounded-xl border" style={{ borderColor: COLORS.borderTeal, backgroundColor: COLORS.villageCard }}>
          <p className="text-center font-bold" style={{ color: COLORS.teal }}>
            {data.activeCount} of {data.totalCount} connections active
          </p>
        </div>
      </div>

      {/* 30-Day Village Pulse */}
      <div className="px-4 mt-6">
        <h3 className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: COLORS.teal }}>
          30-DAY VILLAGE PULSE
        </h3>
        <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.villageCard }}>
          <div className="flex items-end gap-3 h-28 justify-center">
            {data.pulseChartData.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-xs" style={{ color: COLORS.teal }}>{d.value === maxVal ? d.value : ''}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.value / 6) * 80}px` }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="w-14 rounded-t"
                  style={{ backgroundColor: COLORS.teal }}
                />
                <span className="text-xs" style={{ color: COLORS.textMuted }}>{d.week}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-center mt-3" style={{ color: COLORS.teal }}>{data.pulseQuote}</p>
        </div>
      </div>

      {/* What Your Village Does For You */}
      <div className="px-4 mt-6">
        <h3 className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: COLORS.teal }}>
          WHAT YOUR VILLAGE DOES FOR YOU
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {data.impactCards.map((card) => (
            <div key={card.id} className="min-w-[140px] p-3 rounded-xl flex flex-col" style={{ backgroundColor: COLORS.villageCard }}>
              <div className="w-3 h-3 rounded-full mb-2" style={{ backgroundColor: COLORS.teal }} />
              <p className="font-bold text-sm" style={{ color: COLORS.white }}>{card.title}</p>
              <p className="text-xs mt-1" style={{ color: COLORS.textSecondary }}>{card.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Meet Your Village CTA */}
      <div className="px-4 mt-6">
        <button
          className="w-full py-4 rounded-full text-lg font-bold"
          style={{ backgroundColor: COLORS.tealCTA, color: COLORS.white }}
        >
          Meet Your Village
        </button>
        <p className="text-center text-xs mt-2" style={{ color: COLORS.textMuted }}>See who's in your corner</p>
      </div>

      {/* Divider */}
      <div className="mx-4 mt-8 mb-4 border-t" style={{ borderColor: '#333' }} />

      {/* Also In Your Village — Service Cascade */}
      <div className="px-4 pb-8">
        <h3 className="text-xs font-bold tracking-wider uppercase mb-1" style={{ color: COLORS.teal }}>
          ALSO IN YOUR VILLAGE
        </h3>
        <p className="text-sm mb-3" style={{ color: COLORS.textSecondary }}>Swipe up to explore your community</p>
        <div className="flex flex-col gap-2">
          {data.alsoInVillageServices.map((svc, i) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{ backgroundColor: COLORS.villageCard }}
            >
              <div className="w-3 h-3 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: getDotColor(svc.indicatorColor) }} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: COLORS.white }}>{svc.name}</p>
                <p className="text-xs mt-0.5 truncate" style={{ color: COLORS.textSecondary }}>{svc.tagline}</p>
              </div>
              <p className="text-xs font-medium shrink-0" style={{ color: getDotColor(svc.indicatorColor) }}>{svc.usageLabel}</p>
            </motion.div>
          ))}
        </div>

        {/* Explore More + TP Roll */}
        <div className="mt-4 p-3 rounded-xl flex items-center justify-between" style={{ backgroundColor: COLORS.villageCard }}>
          <div>
            <p className="text-sm font-medium" style={{ color: COLORS.white }}>There's even more in your village</p>
            <p className="text-xs" style={{ color: COLORS.textSecondary }}>Explore everything</p>
          </div>
          <button
            onClick={() => navigate("/pulse/give-back")}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(45,212,191,0.15)', border: `2px solid ${COLORS.teal}` }}
          >
            <span className="text-lg">🧻</span>
          </button>
        </div>

        {/* Tap for Give Back label */}
        <div className="flex items-center justify-end gap-2 mt-2">
          <span className="text-xs" style={{ color: COLORS.teal }}>Tap for Give Back</span>
          <ArrowRight className="w-3 h-3" style={{ color: COLORS.teal }} />
          <span className="text-xs font-bold" style={{ color: COLORS.teal }}>TP</span>
        </div>
      </div>
    </div>
  );
}
