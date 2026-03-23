import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { PULSE_COLORS } from '@/lib/pulse-zone-theme';
import { relationshipBattery } from '@/lib/pulse-zone-data';

function BatteryVisual({ level }: { level: number }) {
  const fillWidth = Math.min(level, 100);
  return (
    <div
      className="relative mx-auto rounded-xl overflow-hidden"
      style={{
        width: '220px',
        height: '100px',
        background: PULSE_COLORS.bgCard,
        border: `2px solid ${PULSE_COLORS.borderMuted}`,
      }}
    >
      {/* Battery nub */}
      <div
        className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-2 h-8 rounded-r"
        style={{ background: PULSE_COLORS.bgCardLight }}
      />
      {/* Fill */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${fillWidth}%` }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute inset-0 rounded-lg"
        style={{ background: 'linear-gradient(90deg, #5ECFCF, #7EEAEA)' }}
      />
      {/* Heart icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl" style={{ color: '#1A1A1A' }}>♥</span>
      </div>
    </div>
  );
}

function FactorRow({
  icon,
  label,
  description,
  weight,
  current,
  max,
  isBonus,
}: {
  icon: string;
  label: string;
  description: string;
  weight: number;
  current: number;
  max: number;
  isBonus?: boolean;
}) {
  return (
    <div
      className="p-4 rounded-xl mb-3"
      style={{ background: PULSE_COLORS.bgCard, border: `1px solid ${PULSE_COLORS.borderMuted}` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-lg mt-0.5 opacity-70">{icon}</span>
          <div className="min-w-0">
            <p className="font-bold text-white text-sm">{label}</p>
            <p className="text-xs mt-0.5" style={{ color: PULSE_COLORS.textMuted }}>
              {description}
            </p>
          </div>
        </div>
        <div className="text-right ml-3 shrink-0">
          <p className="text-xs" style={{ color: PULSE_COLORS.textMuted }}>
            {weight}%
          </p>
          <p className="font-bold text-sm" style={{ color: PULSE_COLORS.teal }}>
            {current} / {max}
            {isBonus && <span className="text-yellow-400 text-xs ml-0.5">★</span>}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RelationshipBattery() {
  const [, navigate] = useLocation();
  const data = relationshipBattery;
  const total = data.factors.reduce((sum, f) => sum + f.current, 0);
  const totalMax = data.factors.reduce((sum, f) => sum + f.max, 0);

  return (
    <div className="min-h-screen pb-8" style={{ background: PULSE_COLORS.bg }} data-testid="relationship-battery">
      {/* Back nav */}
      <button
        onClick={() => navigate('/pulse-zone')}
        className="px-4 pt-4 pb-2 text-sm font-medium flex items-center gap-1"
        style={{ color: PULSE_COLORS.teal }}
      >
        ‹ Pulse Zone
      </button>

      {/* Title */}
      <div className="px-4 mb-6">
        <h1 className="text-3xl font-extrabold text-white leading-tight">
          Relationship<br />Battery
        </h1>
        <p className="text-sm mt-1" style={{ color: PULSE_COLORS.textMuted }}>
          How connected are we right now
        </p>
      </div>

      {/* Battery visual */}
      <div className="px-4 mb-4">
        <div className="p-6 rounded-2xl" style={{ background: PULSE_COLORS.bgCard }}>
          <BatteryVisual level={data.level} />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-4 text-4xl font-extrabold text-white"
          >
            {data.level}%
          </motion.p>
          <p
            className="text-center text-sm mt-2 italic"
            style={{ color: PULSE_COLORS.teal }}
          >
            {data.status}
          </p>
        </div>
      </div>

      {/* What charges our relationship */}
      <div className="px-4 mb-6">
        <h2 className="text-xs font-bold tracking-wider mb-3" style={{ color: PULSE_COLORS.goldLight }}>
          WHAT CHARGES OUR RELATIONSHIP
        </h2>
        {data.factors.map((f) => (
          <FactorRow
            key={f.id}
            icon={f.icon}
            label={f.label}
            description={f.description}
            weight={f.weight}
            current={f.current}
            max={f.max}
            isBonus={f.current > f.max}
          />
        ))}

        {/* Total bar */}
        <div
          className="p-3 rounded-xl text-center"
          style={{
            background: PULSE_COLORS.bgCard,
            border: `1px solid ${PULSE_COLORS.borderGold}`,
          }}
        >
          <span className="text-sm" style={{ color: PULSE_COLORS.textMuted }}>
            Total Relationship Battery:{' '}
          </span>
          <span className="text-xl font-extrabold text-white">
            {total} / {totalMax}
          </span>
        </div>
      </div>

      {/* What's available right now */}
      <div className="px-4 mb-6">
        <h2 className="text-xs font-bold tracking-wider mb-3" style={{ color: PULSE_COLORS.goldLight }}>
          WHAT'S AVAILABLE RIGHT NOW
        </h2>
        {data.availableFeatures.map((feature, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl mb-2"
            style={{ background: PULSE_COLORS.bgCard }}
          >
            <span style={{ color: PULSE_COLORS.green }}>✓</span>
            <p className="text-sm text-white">{feature}</p>
          </div>
        ))}
      </div>

      {/* Philosophy */}
      <div className="px-4 mb-6">
        <h2 className="text-xs font-bold tracking-wider mb-3" style={{ color: PULSE_COLORS.goldLight }}>
          THE PHILOSOPHY
        </h2>
        <div
          className="p-4 rounded-xl"
          style={{ background: PULSE_COLORS.bgCard, border: `1px solid ${PULSE_COLORS.borderMuted}` }}
        >
          <p className="text-sm leading-relaxed" style={{ color: PULSE_COLORS.textSecondary }}>
            {data.philosophy}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <button
          onClick={() => navigate('/grace')}
          className="w-full py-4 rounded-2xl font-bold text-lg text-white"
          style={{ background: PULSE_COLORS.rose }}
        >
          Talk to Grace Now
        </button>
      </div>
    </div>
  );
}
