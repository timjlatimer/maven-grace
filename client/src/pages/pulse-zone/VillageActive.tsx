import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { PULSE_COLORS } from '@/lib/pulse-zone-theme';
import { villageActive, villageCascadeServices } from '@/lib/pulse-zone-data';

// ─── Village Hub Visualization ────────────────────────────────────
function VillageHub({ active, total }: { active: number; total: number }) {
  const nodePositions = [
    { x: 50, y: 12 },   // top
    { x: 18, y: 30 },   // top-left
    { x: 82, y: 30 },   // top-right
    { x: 18, y: 65 },   // bottom-left
    { x: 82, y: 65 },   // bottom-right
    { x: 50, y: 82 },   // bottom
  ];

  const icons = ['≋', '★', '◇', '☺', '⬆', '◁'];

  return (
    <div className="relative mx-auto" style={{ width: '240px', height: '240px' }}>
      <svg width="240" height="240" viewBox="0 0 100 100">
        {/* Connection lines */}
        {nodePositions.map((pos, i) => (
          <line
            key={`line-${i}`}
            x1="50"
            y1="47"
            x2={pos.x}
            y2={pos.y}
            stroke={i < active ? PULSE_COLORS.teal : PULSE_COLORS.bgCardLight}
            strokeWidth="0.8"
            opacity={i < active ? 0.6 : 0.3}
          />
        ))}

        {/* Center node (Ruby Red) */}
        <circle cx="50" cy="47" r="10" fill={PULSE_COLORS.tealDark} stroke={PULSE_COLORS.teal} strokeWidth="1.5" />
        <text x="50" y="50" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">
          RR
        </text>

        {/* Outer nodes */}
        {nodePositions.map((pos, i) => (
          <g key={`node-${i}`}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r="7"
              fill={i < active ? PULSE_COLORS.tealDark : PULSE_COLORS.bgCardLight}
              stroke={i < active ? PULSE_COLORS.teal : PULSE_COLORS.borderMuted}
              strokeWidth="1"
            />
            <text
              x={pos.x}
              y={pos.y + 2}
              textAnchor="middle"
              fill={i < active ? PULSE_COLORS.teal : PULSE_COLORS.textMuted}
              fontSize="5"
            >
              {icons[i]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── Connection Row ───────────────────────────────────────────────
function ConnectionRow({
  label,
  description,
  status,
  statusColor,
  dotColor,
}: {
  label: string;
  description: string;
  status: string;
  statusColor: string;
  dotColor: string;
}) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl mb-2"
      style={{ background: PULSE_COLORS.villageCard, border: `1px solid ${PULSE_COLORS.borderMuted}` }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-3 h-3 rounded-full shrink-0" style={{ background: dotColor }} />
        <div className="min-w-0">
          <p className="font-bold text-white text-sm">{label}</p>
          <p className="text-xs" style={{ color: PULSE_COLORS.textMuted }}>
            {description}
          </p>
        </div>
      </div>
      <p className="text-xs font-semibold ml-3 shrink-0" style={{ color: statusColor }}>
        {status}
      </p>
    </div>
  );
}

// ─── Weekly Pulse Chart ───────────────────────────────────────────
function WeeklyPulseChart({ data }: { data: typeof villageActive.weeklyPulse }) {
  const maxVal = Math.max(...data.map((d) => d.connections), 6);
  const barWidth = 50;
  const chartWidth = data.length * (barWidth + 20) + 40;
  const chartHeight = 140;
  const plotH = 100;

  return (
    <svg width="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="mx-auto">
      {/* Grid lines */}
      {[0, 1, 2, 3, 4, 5, 6].map((v) => {
        const y = 10 + plotH - (v / maxVal) * plotH;
        return (
          <g key={v}>
            <line x1="30" y1={y} x2={chartWidth - 10} y2={y} stroke={PULSE_COLORS.borderMuted} strokeWidth="0.5" />
            <text x="25" y={y + 3} textAnchor="end" fill={PULSE_COLORS.textMuted} fontSize="8">
              {v}
            </text>
          </g>
        );
      })}
      {/* Bars */}
      {data.map((d, i) => {
        const barH = (d.connections / maxVal) * plotH;
        const x = 40 + i * (barWidth + 20);
        const y = 10 + plotH - barH;
        return (
          <g key={d.week}>
            <rect x={x} y={y} width={barWidth} height={barH} rx="4" fill={PULSE_COLORS.teal} />
            {/* Value label on last bar */}
            {i === data.length - 1 && (
              <text x={x + barWidth / 2} y={y - 5} textAnchor="middle" fill={PULSE_COLORS.teal} fontSize="10" fontWeight="bold">
                {d.connections}
              </text>
            )}
            <text x={x + barWidth / 2} y={chartHeight - 2} textAnchor="middle" fill={PULSE_COLORS.textMuted} fontSize="8">
              {d.week}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Benefit Card ─────────────────────────────────────────────────
function BenefitCard({ title, description }: { title: string; description: string }) {
  return (
    <div
      className="p-4 rounded-xl min-w-[140px] max-w-[160px] shrink-0"
      style={{ background: PULSE_COLORS.villageCard, border: `1px solid ${PULSE_COLORS.borderMuted}` }}
    >
      <div className="w-4 h-4 rounded-full mb-2" style={{ background: PULSE_COLORS.teal }} />
      <p className="font-bold text-white text-sm mb-1">{title}</p>
      <p className="text-xs" style={{ color: PULSE_COLORS.textMuted }}>
        {description}
      </p>
    </div>
  );
}

// ─── Cascade Row ──────────────────────────────────────────────────
function VillageCascadeRow({
  name,
  description,
  status,
  statusColor,
}: {
  name: string;
  description: string;
  status: string;
  statusColor: string;
}) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl mb-2"
      style={{ background: PULSE_COLORS.villageCard, border: `1px solid ${PULSE_COLORS.borderMuted}` }}
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
      <p className="text-xs font-semibold ml-3 shrink-0" style={{ color: statusColor }}>
        {status}
      </p>
    </div>
  );
}

// ─── Main Village Active Screen ───────────────────────────────────
export default function VillageActivePage() {
  const [, navigate] = useLocation();
  const data = villageActive;

  return (
    <div className="min-h-screen pb-8" style={{ background: PULSE_COLORS.villageBg }} data-testid="village-active">
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
          Village<br />Active
        </h1>
        <p className="text-sm mt-1" style={{ color: PULSE_COLORS.textMuted }}>
          Your connections in the Maven Village
        </p>
      </div>

      {/* Hub visualization */}
      <div className="px-4 mb-4">
        <div className="p-4 rounded-2xl" style={{ background: PULSE_COLORS.villageCard }}>
          <VillageHub active={data.activeConnections} total={data.totalConnections} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-2"
          >
            <p className="text-4xl font-extrabold" style={{ color: PULSE_COLORS.teal }}>
              {data.activeConnections} of {data.totalConnections}
            </p>
            <p className="text-sm" style={{ color: PULSE_COLORS.textMuted }}>
              Active Connections
            </p>
            <p className="text-sm mt-1 italic" style={{ color: PULSE_COLORS.teal }}>
              {data.encouragement}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Your Village Connections */}
      <div className="px-4 mb-6">
        <h2 className="text-xs font-bold tracking-wider mb-3" style={{ color: PULSE_COLORS.teal }}>
          YOUR VILLAGE CONNECTIONS
        </h2>
        {data.connections.map((c) => (
          <ConnectionRow
            key={c.id}
            label={c.label}
            description={c.description}
            status={c.status}
            statusColor={c.statusColor}
            dotColor={c.dotColor}
          />
        ))}

        {/* Total bar */}
        <div
          className="p-3 rounded-xl text-center mt-2"
          style={{
            background: PULSE_COLORS.villageCard,
            border: `1px solid ${PULSE_COLORS.borderTeal}`,
          }}
        >
          <span className="text-sm font-bold" style={{ color: PULSE_COLORS.teal }}>
            {data.activeConnections} of {data.totalConnections} connections active
          </span>
        </div>
      </div>

      {/* 30-Day Village Pulse */}
      <div className="px-4 mb-6">
        <h2 className="text-xs font-bold tracking-wider mb-3" style={{ color: PULSE_COLORS.teal }}>
          30-DAY VILLAGE PULSE
        </h2>
        <div className="p-4 rounded-2xl" style={{ background: PULSE_COLORS.villageCard }}>
          <WeeklyPulseChart data={data.weeklyPulse} />
          <p className="text-center text-xs mt-3 italic" style={{ color: PULSE_COLORS.teal }}>
            You've been more connected this month than last. That matters.
          </p>
        </div>
      </div>

      {/* What Your Village Does For You */}
      <div className="px-4 mb-6">
        <h2 className="text-xs font-bold tracking-wider mb-3" style={{ color: PULSE_COLORS.teal }}>
          WHAT YOUR VILLAGE DOES FOR YOU
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {data.benefits.map((b) => (
            <BenefitCard key={b.id} title={b.title} description={b.description} />
          ))}
        </div>
      </div>

      {/* Meet Your Village CTA */}
      <div className="px-4 mb-8">
        <button
          onClick={() => navigate('/community')}
          className="w-full py-4 rounded-2xl font-bold text-lg text-white"
          style={{ background: PULSE_COLORS.teal }}
        >
          Meet Your Village
        </button>
        <p className="text-center text-xs mt-2" style={{ color: PULSE_COLORS.textMuted }}>
          See who's in your corner
        </p>
      </div>

      {/* ─── Cascade: Also In Your Village ─────────────────────── */}
      <div className="px-4 mb-6">
        <div className="border-t mb-6" style={{ borderColor: PULSE_COLORS.borderMuted }} />
        <h2 className="text-xs font-bold tracking-wider mb-1" style={{ color: PULSE_COLORS.orange }}>
          ALSO IN YOUR VILLAGE
        </h2>
        <p className="text-xs mb-4" style={{ color: PULSE_COLORS.textMuted }}>
          Swipe up to explore your community
        </p>
        {villageCascadeServices.map((s) => (
          <VillageCascadeRow
            key={s.id}
            name={s.name}
            description={s.description}
            status={s.status}
            statusColor={s.statusColor}
          />
        ))}

        {/* Explore more */}
        <div
          className="flex items-center justify-between p-4 rounded-xl mt-4"
          style={{ background: PULSE_COLORS.villageCard, border: `1px solid ${PULSE_COLORS.borderMuted}` }}
        >
          <div>
            <p className="text-sm text-white font-medium">There's even more in your village</p>
            <p className="text-xs" style={{ color: PULSE_COLORS.textMuted }}>
              Explore everything
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: PULSE_COLORS.tealDark, border: `2px solid ${PULSE_COLORS.teal}` }}
          >
            <span className="text-white text-xs">◎</span>
          </div>
        </div>
      </div>

      {/* Floating TP Roll hint */}
      <div className="px-4 pb-20">
        <div className="flex items-center justify-end gap-2">
          <span className="text-xs" style={{ color: PULSE_COLORS.teal }}>
            Tap for Give Back →
          </span>
          <button
            onClick={() => navigate('/pulse-zone/give-back')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: PULSE_COLORS.teal, color: 'white' }}
          >
            TP
          </button>
        </div>
      </div>
    </div>
  );
}
