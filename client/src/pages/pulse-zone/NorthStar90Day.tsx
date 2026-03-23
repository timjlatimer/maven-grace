import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { PULSE_COLORS } from '@/lib/pulse-zone-theme';
import { northStar90Day } from '@/lib/pulse-zone-data';

function ProgressRing({ percent }: { percent: number }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative mx-auto" style={{ width: '180px', height: '180px' }}>
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={radius} fill="none" stroke={PULSE_COLORS.bgCardLight} strokeWidth="10" />
        <motion.circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={PULSE_COLORS.teal}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          transform="rotate(-90 90 90)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-extrabold text-white">{percent}%</span>
        <span className="text-xs" style={{ color: PULSE_COLORS.textMuted }}>
          of your 100% lift goal
        </span>
      </div>
    </div>
  );
}

function DimensionRow({
  icon,
  label,
  sublabel,
  amount,
  percentage,
  barColor,
  index,
}: {
  icon: string;
  label: string;
  sublabel: string;
  amount: string;
  percentage: number;
  barColor: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="p-4 rounded-xl mb-3"
      style={{ background: PULSE_COLORS.bgCard, border: `1px solid ${PULSE_COLORS.borderMuted}` }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: PULSE_COLORS.tealDark, color: PULSE_COLORS.teal }}
          >
            {icon}
          </div>
          <div>
            <p className="font-bold text-white text-sm">{label}</p>
            <p className="text-xs" style={{ color: PULSE_COLORS.textMuted }}>
              {sublabel}
            </p>
          </div>
        </div>
        <p className="font-bold text-sm" style={{ color: PULSE_COLORS.teal }}>
          {amount}
        </p>
      </div>
      {/* Progress bar */}
      <div className="w-full h-2 rounded-full" style={{ background: PULSE_COLORS.bgCardLight }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: index * 0.08 + 0.3 }}
          className="h-full rounded-full"
          style={{ background: barColor }}
        />
      </div>
      <p className="text-right text-xs mt-1" style={{ color: PULSE_COLORS.textMuted }}>
        {percentage}%
      </p>
    </motion.div>
  );
}

export default function NorthStar90Day() {
  const [, navigate] = useLocation();
  const data = northStar90Day;

  return (
    <div className="min-h-screen pb-8" style={{ background: PULSE_COLORS.bg }} data-testid="north-star-90day">
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
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xs font-bold tracking-wider" style={{ color: PULSE_COLORS.goldLight }}>
            YOUR NORTH STAR
          </h2>
          <span style={{ color: PULSE_COLORS.starGold }}>★</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white">90 Days with Grace</h1>
      </div>

      {/* Progress ring */}
      <div className="px-4 mb-4">
        <ProgressRing percent={data.percentComplete} />
      </div>

      {/* Encouragement */}
      <p className="px-4 text-center text-sm italic mb-6" style={{ color: PULSE_COLORS.teal }}>
        {data.encouragement}
      </p>

      {/* Dimensions */}
      <div className="px-4 mb-6">
        {data.dimensions.map((d, i) => (
          <DimensionRow
            key={d.id}
            icon={d.icon}
            label={d.label}
            sublabel={d.sublabel}
            amount={d.amount}
            percentage={d.percentage}
            barColor={d.barColor}
            index={i}
          />
        ))}
      </div>

      {/* Total Impact */}
      <div className="px-4 mb-6">
        <div
          className="p-4 rounded-xl text-center"
          style={{
            background: PULSE_COLORS.bgCard,
            border: `1px solid ${PULSE_COLORS.borderGold}`,
          }}
        >
          <p className="text-xs font-bold tracking-wider" style={{ color: PULSE_COLORS.goldLight }}>
            TOTAL 90-DAY IMPACT
          </p>
          <p className="text-3xl font-extrabold mt-1" style={{ color: PULSE_COLORS.teal }}>
            {data.totalImpact} kept in your pocket
          </p>
          <p className="text-sm mt-1" style={{ color: PULSE_COLORS.teal }}>
            On track for {data.projectedImpact} by Day 90
          </p>
        </div>
      </div>

      {/* Link to Prime */}
      <div className="px-4 pb-4 text-center">
        <div className="border-t mb-4" style={{ borderColor: PULSE_COLORS.borderMuted }} />
        <span style={{ color: PULSE_COLORS.starGold }}>★</span>
        <button
          onClick={() => navigate('/pulse-zone/north-star/prime')}
          className="block mx-auto text-sm font-medium mt-2"
          style={{ color: PULSE_COLORS.teal }}
        >
          There's a bigger reason you're here →
        </button>
      </div>
    </div>
  );
}
