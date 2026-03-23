import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { PULSE_COLORS } from '@/lib/pulse-zone-theme';
import { pulseZoneHome, heartbeatQuadrants } from '@/lib/pulse-zone-data';

// ─── KPI Pill Component ───────────────────────────────────────────
function KpiPill({
  icon,
  label,
  value,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold"
      style={{
        background: 'linear-gradient(135deg, rgba(212, 168, 67, 0.9), rgba(184, 146, 46, 0.85))',
        border: '1px solid rgba(212, 168, 67, 0.5)',
        color: '#FFFFFF',
        minWidth: 0,
      }}
    >
      <span className="text-xs opacity-80">{icon}</span>
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[10px] font-medium opacity-90">{label}</span>
        <span className="text-xs font-bold">{value}</span>
      </span>
    </motion.button>
  );
}

// ─── Heartbeat Quadrant ───────────────────────────────────────────
function HeartbeatQuadrant({
  label,
  sublabel,
  icon,
  onClick,
  position,
}: {
  label: string;
  sublabel: string;
  icon: string;
  onClick: () => void;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}) {
  const positionClasses: Record<string, string> = {
    'top-left': 'top-[22%] left-[15%]',
    'top-right': 'top-[22%] right-[15%]',
    'bottom-left': 'bottom-[22%] left-[15%]',
    'bottom-right': 'bottom-[22%] right-[15%]',
  };

  return (
    <button
      onClick={onClick}
      className={`absolute ${positionClasses[position]} flex flex-col items-center gap-1 z-10`}
    >
      <span className="text-xl opacity-70">{icon}</span>
      <span className="text-white font-bold text-base leading-tight">{label}</span>
      <span className="text-white/60 text-xs">{sublabel}</span>
    </button>
  );
}

// ─── Floating TP Roll Button ──────────────────────────────────────
function FloatingTPRoll({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-6 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
      aria-label="Give Back — Tap for Give Back"
      data-testid="tp-roll-button"
    >
      <span className="text-2xl">🧻</span>
    </motion.button>
  );
}

// ─── Floating North Star Button ───────────────────────────────────
function FloatingNorthStar({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="absolute z-30"
      style={{
        top: '200px',
        right: '24px',
      }}
      aria-label="Your North Star"
      data-testid="north-star-button"
    >
      <span
        className="text-4xl block"
        style={{
          color: PULSE_COLORS.starGray,
          filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.2))',
        }}
      >
        ★
      </span>
    </motion.button>
  );
}

// ─── Main Pulse Zone Home Screen ──────────────────────────────────
export default function PulseZoneHome() {
  const [, navigate] = useLocation();

  const positions: Array<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'> = [
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
  ];

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: PULSE_COLORS.bg }}
      data-testid="pulse-zone-home"
    >
      {/* ─── KPI Pills Row ─────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-2 overflow-x-auto" data-testid="kpi-pills">
        <KpiPill
          icon="🔋"
          label="Grace Battery"
          value={`${pulseZoneHome.batteryLevel}%`}
          onClick={() => navigate('/pulse-zone/battery')}
        />
        <KpiPill
          icon="⭐"
          label="Dignity Score"
          value={`${pulseZoneHome.dignityScore}`}
          onClick={() => navigate('/pulse-zone/dignity')}
        />
        <KpiPill
          icon="👥"
          label="Village Active"
          value={pulseZoneHome.villageSummary}
          onClick={() => navigate('/pulse-zone/village')}
        />
      </div>

      {/* ─── Greeting + North Star ─────────────────────────────── */}
      <div className="relative px-4 pt-2 pb-4">
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-semibold text-lg"
            style={{ color: PULSE_COLORS.goldLight }}
          >
            {pulseZoneHome.greeting}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm mt-1"
            style={{ color: PULSE_COLORS.textMuted }}
          >
            {pulseZoneHome.greetingSubtext}
          </motion.p>
        </div>
        <FloatingNorthStar onClick={() => navigate('/pulse-zone/north-star')} />
      </div>

      {/* ─── Heartbeat Orb ─────────────────────────────────────── */}
      <div className="flex justify-center items-center mt-4 mb-8">
        <div className="relative" style={{ width: '320px', height: '320px' }}>
          {/* Outer glow rings */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${PULSE_COLORS.goldMuted} 0%, transparent 70%)`,
              transform: 'scale(1.5)',
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${PULSE_COLORS.goldDark} 0%, transparent 60%)`,
              transform: 'scale(1.2)',
            }}
          />

          {/* Main orb */}
          <motion.div
            animate={{
              boxShadow: [
                `0 0 40px ${PULSE_COLORS.goldMuted}`,
                `0 0 60px ${PULSE_COLORS.goldMuted}`,
                `0 0 40px ${PULSE_COLORS.goldMuted}`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 40% 40%, ${PULSE_COLORS.goldLight}, ${PULSE_COLORS.gold}, ${PULSE_COLORS.goldDark})`,
              border: `2px solid ${PULSE_COLORS.goldMuted}`,
            }}
          />

          {/* Cross lines */}
          <div
            className="absolute top-1/2 left-[10%] right-[10%] h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${PULSE_COLORS.goldMuted}, transparent)` }}
          />
          <div
            className="absolute left-1/2 top-[10%] bottom-[10%] w-px"
            style={{ background: `linear-gradient(180deg, transparent, ${PULSE_COLORS.goldMuted}, transparent)` }}
          />

          {/* Center G */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                border: `2px solid ${PULSE_COLORS.gold}`,
                background: 'rgba(0,0,0,0.5)',
              }}
            >
              <span className="text-lg font-bold" style={{ color: PULSE_COLORS.gold }}>
                G
              </span>
            </div>
          </div>

          {/* Quadrants */}
          {heartbeatQuadrants.map((q, i) => (
            <HeartbeatQuadrant
              key={q.id}
              label={q.label}
              sublabel={q.sublabel}
              icon={q.icon}
              position={positions[i]}
              onClick={() => navigate(q.route)}
            />
          ))}
        </div>
      </div>

      {/* ─── HEARTBEAT label ───────────────────────────────────── */}
      <div className="text-center mb-8">
        <span
          className="text-xs tracking-[0.3em] font-medium"
          style={{ color: PULSE_COLORS.textMuted }}
        >
          H E A R T B E A T
        </span>
      </div>

      {/* ─── Swipe Up ──────────────────────────────────────────── */}
      <div className="text-center pb-20">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span style={{ color: PULSE_COLORS.textMuted }} className="text-lg">
            ⌃
          </span>
        </motion.div>
        <span className="text-xs" style={{ color: PULSE_COLORS.textMuted }}>
          swipe up
        </span>
      </div>

      {/* ─── Floating TP Roll ──────────────────────────────────── */}
      <FloatingTPRoll onClick={() => navigate('/pulse-zone/give-back')} />
    </div>
  );
}
