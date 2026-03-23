import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { PULSE_COLORS } from '@/lib/pulse-zone-theme';
import { dignityScore, dignityCascadeServices } from '@/lib/pulse-zone-data';

function ScoreRing({ score }: { score: number }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative mx-auto" style={{ width: '180px', height: '180px' }}>
      <svg width="180" height="180" viewBox="0 0 180 180">
        {/* Background ring */}
        <circle cx="90" cy="90" r={radius} fill="none" stroke={PULSE_COLORS.bgCardLight} strokeWidth="10" />
        {/* Score ring */}
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
        <span className="text-5xl font-extrabold text-white">{score}</span>
        <span className="text-sm" style={{ color: PULSE_COLORS.textMuted }}>
          /100
        </span>
      </div>
    </div>
  );
}

function PillarRow({
  icon,
  label,
  description,
  maxPoints,
  currentPoints,
  color,
}: {
  icon: string;
  label: string;
  description: string;
  maxPoints: number;
  currentPoints: number;
  color: string;
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
            {maxPoints} pts
          </p>
          <p className="font-bold text-sm" style={{ color }}>
            {currentPoints} / {maxPoints}
          </p>
        </div>
      </div>
    </div>
  );
}

function ClimbChart({ data }: { data: typeof dignityScore.climb }) {
  const maxScore = 100;
  const chartWidth = 300;
  const chartHeight = 120;
  const padding = { top: 10, right: 10, bottom: 25, left: 25 };
  const plotW = chartWidth - padding.left - padding.right;
  const plotH = chartHeight - padding.top - padding.bottom;

  const points = data.map((d, i) => ({
    x: padding.left + (d.day / 90) * plotW,
    y: padding.top + plotH - (d.score / maxScore) * plotH,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + plotH} L ${points[0].x} ${padding.top + plotH} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="mx-auto">
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((v) => {
        const y = padding.top + plotH - (v / maxScore) * plotH;
        return (
          <g key={v}>
            <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke={PULSE_COLORS.borderMuted} strokeWidth="0.5" />
            <text x={padding.left - 4} y={y + 3} textAnchor="end" fill={PULSE_COLORS.textMuted} fontSize="7">
              {v}
            </text>
          </g>
        );
      })}
      {/* X axis labels */}
      {[1, 30, 47, 60, 90].map((d) => (
        <text
          key={d}
          x={padding.left + (d / 90) * plotW}
          y={chartHeight - 4}
          textAnchor="middle"
          fill={PULSE_COLORS.textMuted}
          fontSize="7"
        >
          D{d}
        </text>
      ))}
      {/* Area fill */}
      <path d={areaPath} fill={PULSE_COLORS.tealMuted} />
      {/* Line */}
      <path d={linePath} fill="none" stroke={PULSE_COLORS.teal} strokeWidth="2" />
      {/* Current point */}
      {points.length > 0 && (
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="4" fill={PULSE_COLORS.teal} />
      )}
      {/* Day label */}
      {points.length > 0 && (
        <text
          x={points[points.length - 1].x}
          y={points[points.length - 1].y - 8}
          textAnchor="middle"
          fill={PULSE_COLORS.teal}
          fontSize="8"
          fontWeight="bold"
        >
          Day {data[data.length - 1].day}
        </text>
      )}
    </svg>
  );
}

function CascadeRow({
  name,
  description,
  score,
  status,
  statusColor,
}: {
  name: string;
  description: string;
  score: number;
  status: string;
  statusColor: string;
}) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl mb-2"
      style={{ background: PULSE_COLORS.bgCard, border: `1px solid ${PULSE_COLORS.borderMuted}` }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-3 h-3 rounded-full shrink-0" style={{ background: PULSE_COLORS.teal }} />
        <div className="min-w-0">
          <p className="font-bold text-white text-sm">{name}</p>
          <p className="text-xs truncate" style={{ color: PULSE_COLORS.textMuted }}>
            {description}
          </p>
        </div>
      </div>
      <div className="text-right ml-3 shrink-0">
        <p className="text-xs" style={{ color: PULSE_COLORS.textMuted }}>
          Score: {score}
        </p>
        <p className="text-xs font-semibold" style={{ color: statusColor }}>
          {status}
        </p>
      </div>
    </div>
  );
}

export default function DignityScorePage() {
  const [, navigate] = useLocation();
  const data = dignityScore;
  const total = data.pillars.reduce((sum, p) => sum + p.currentPoints, 0);
  const totalMax = data.pillars.reduce((sum, p) => sum + p.maxPoints, 0);

  return (
    <div className="min-h-screen pb-8" style={{ background: PULSE_COLORS.bg }} data-testid="dignity-score">
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
          Dignity<br />Score
        </h1>
        <p className="text-sm mt-1" style={{ color: PULSE_COLORS.textMuted }}>
          Your 90-day journey to financial freedom
        </p>
      </div>

      {/* Score ring */}
      <div className="px-4 mb-4">
        <div className="p-6 rounded-2xl" style={{ background: PULSE_COLORS.bgCard }}>
          <ScoreRing score={data.score} />
          <p
            className="text-center text-xs font-bold tracking-wider mt-3"
            style={{ color: PULSE_COLORS.goldLight }}
          >
            {data.tierLabel}
          </p>
          <p
            className="text-center text-sm mt-1 italic"
            style={{ color: PULSE_COLORS.teal }}
          >
            {data.encouragement}
          </p>
        </div>
      </div>

      {/* What builds your score */}
      <div className="px-4 mb-6">
        <h2 className="text-xs font-bold tracking-wider mb-3" style={{ color: PULSE_COLORS.goldLight }}>
          WHAT BUILDS YOUR SCORE
        </h2>
        {data.pillars.map((p) => (
          <PillarRow
            key={p.id}
            icon={p.icon}
            label={p.label}
            description={p.description}
            maxPoints={p.maxPoints}
            currentPoints={p.currentPoints}
            color={p.color}
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
            Total Dignity Score:{' '}
          </span>
          <span className="text-xl font-extrabold text-white">
            {total} / {totalMax}
          </span>
        </div>
      </div>

      {/* 90-Day Climb */}
      <div className="px-4 mb-6">
        <h2 className="text-xs font-bold tracking-wider mb-3" style={{ color: PULSE_COLORS.goldLight }}>
          YOUR 90-DAY CLIMB
        </h2>
        <div className="p-4 rounded-2xl" style={{ background: PULSE_COLORS.bgCard }}>
          <ClimbChart data={data.climb} />
          <p className="text-center text-xs mt-3" style={{ color: PULSE_COLORS.textMuted }}>
            You've gained {data.climb[data.climb.length - 1].score - data.climb[0].score} points in{' '}
            {data.climb[data.climb.length - 1].day} days.
          </p>
        </div>
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
      <div className="px-4 mb-8">
        <button
          onClick={() => navigate('/grace')}
          className="w-full py-4 rounded-2xl font-bold text-lg text-white"
          style={{ background: PULSE_COLORS.rose }}
        >
          Talk to Grace Now
        </button>
      </div>

      {/* ─── Cascade: Also Working For You ─────────────────────── */}
      <div className="px-4 mb-6">
        <div className="border-t mb-6" style={{ borderColor: PULSE_COLORS.borderMuted }} />
        <h2 className="text-xs font-bold tracking-wider mb-1" style={{ color: PULSE_COLORS.orange }}>
          ALSO WORKING FOR YOU
        </h2>
        <p className="text-xs mb-4" style={{ color: PULSE_COLORS.textMuted }}>
          Swipe up to explore everything Grace does for you
        </p>
        {dignityCascadeServices.map((s) => (
          <CascadeRow
            key={s.id}
            name={s.name}
            description={s.description}
            score={s.score}
            status={s.status}
            statusColor={s.statusColor}
          />
        ))}

        {/* Explore more */}
        <div
          className="flex items-center justify-between p-4 rounded-xl mt-4"
          style={{ background: PULSE_COLORS.bgCard, border: `1px solid ${PULSE_COLORS.borderMuted}` }}
        >
          <div>
            <p className="text-sm text-white font-medium">Grace has even more tools waiting for you</p>
            <p className="text-xs" style={{ color: PULSE_COLORS.textMuted }}>
              Explore the full Village
            </p>
          </div>
          <span style={{ color: PULSE_COLORS.teal }} className="text-lg">→</span>
        </div>
      </div>
    </div>
  );
}
