import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { PULSE_COLORS } from '@/lib/pulse-zone-theme';
import { giveBackPrograms } from '@/lib/pulse-zone-data';

function ProgramRow({
  name,
  description,
  statusColor,
  status,
  index,
}: {
  name: string;
  description: string;
  statusColor: string;
  status: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between p-4 rounded-xl mb-2"
      style={{ background: PULSE_COLORS.villageCard, border: `1px solid ${PULSE_COLORS.borderMuted}` }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-full shrink-0" style={{ background: PULSE_COLORS.rose, opacity: 0.7 }} />
        <div className="min-w-0">
          <p className="font-bold text-white text-sm">{name}</p>
          <p className="text-xs truncate" style={{ color: PULSE_COLORS.textMuted }}>
            {description}
          </p>
        </div>
      </div>
      <div className="ml-3 shrink-0">
        <div
          className="h-2 w-16 rounded-full"
          style={{ background: statusColor }}
        />
      </div>
    </motion.div>
  );
}

export default function GiveBack() {
  const [, navigate] = useLocation();
  const activeCount = giveBackPrograms.filter((p) => p.status === 'active' || p.status === 'available').length;

  return (
    <div className="min-h-screen pb-8" style={{ background: PULSE_COLORS.villageBg }} data-testid="give-back">
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
        <h1 className="text-3xl font-extrabold text-white leading-tight">Give Back</h1>
        <p className="text-sm mt-1" style={{ color: PULSE_COLORS.textMuted }}>
          What the Village gives to you
        </p>
      </div>

      {/* Hero card */}
      <div className="px-4 mb-6">
        <div className="p-6 rounded-2xl text-center" style={{ background: PULSE_COLORS.villageCard }}>
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4"
            style={{ background: PULSE_COLORS.rose, opacity: 0.6 }}
          />
          <p className="text-sm italic" style={{ color: PULSE_COLORS.teal }}>
            This is what we do for each other.
          </p>
          <p className="text-sm italic" style={{ color: PULSE_COLORS.teal }}>
            No applications. No shame. Just help.
          </p>
        </div>
      </div>

      {/* What the Village Provides */}
      <div className="px-4 mb-6">
        <h2 className="text-xs font-bold tracking-wider mb-3" style={{ color: PULSE_COLORS.teal }}>
          WHAT THE VILLAGE PROVIDES
        </h2>
        {giveBackPrograms.map((p, i) => (
          <ProgramRow
            key={p.id}
            name={p.name}
            description={p.description}
            statusColor={p.statusColor}
            status={p.status}
            index={i}
          />
        ))}

        {/* Count bar */}
        <div
          className="p-3 rounded-xl text-center mt-4"
          style={{
            background: PULSE_COLORS.villageCard,
            border: `1px solid ${PULSE_COLORS.borderTeal}`,
          }}
        >
          <span className="text-sm font-bold" style={{ color: PULSE_COLORS.teal }}>
            {activeCount} programs working for you
          </span>
        </div>
      </div>

      {/* How It Works */}
      <div className="px-4 mb-6">
        <h2 className="text-xs font-bold tracking-wider mb-3" style={{ color: PULSE_COLORS.teal }}>
          HOW IT WORKS
        </h2>
        <div className="flex gap-3">
          {['No\napplication required', 'Grace\nnominates you', 'Dignity,\nalways'].map((text, i) => (
            <div
              key={i}
              className="flex-1 p-3 rounded-xl text-center"
              style={{ background: PULSE_COLORS.villageCard, border: `1px solid ${PULSE_COLORS.borderMuted}` }}
            >
              <p className="text-xs text-white whitespace-pre-line">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <button
          onClick={() => navigate('/grace')}
          className="w-full py-4 rounded-2xl font-bold text-lg text-white"
          style={{ background: PULSE_COLORS.teal }}
        >
          Tell Grace What You Need
        </button>
        <p className="text-center text-xs mt-2 italic" style={{ color: PULSE_COLORS.textMuted }}>
          She's already watching. She just wants to hear it from you.
        </p>
      </div>
    </div>
  );
}
