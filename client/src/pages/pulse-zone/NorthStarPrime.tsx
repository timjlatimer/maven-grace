import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { PULSE_COLORS } from '@/lib/pulse-zone-theme';
import { northStarPrime } from '@/lib/pulse-zone-data';

function CompassCard({
  direction,
  title,
  content,
  letter,
  index,
}: {
  direction: string;
  title: string;
  content: string;
  letter: string;
  index: number;
}) {
  const directionColors: Record<string, string> = {
    NORTH: PULSE_COLORS.teal,
    EAST: PULSE_COLORS.orange,
    SOUTH: PULSE_COLORS.teal,
    WEST: PULSE_COLORS.orange,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      className="p-4 rounded-xl relative"
      style={{
        background: PULSE_COLORS.bgCard,
        border: `1px solid ${PULSE_COLORS.borderTeal}`,
      }}
    >
      <p
        className="text-xs font-bold tracking-wider mb-1"
        style={{ color: directionColors[direction] || PULSE_COLORS.teal }}
      >
        {direction}
      </p>
      <p className="font-bold text-white text-base mb-2">{title}</p>
      <p className="text-sm leading-relaxed" style={{ color: PULSE_COLORS.textSecondary }}>
        {content}
      </p>
      <p className="text-xs mt-3" style={{ color: PULSE_COLORS.textMuted }}>
        ✏ tap to edit
      </p>
      <span
        className="absolute bottom-3 right-3 text-2xl font-bold opacity-30"
        style={{ color: directionColors[direction] || PULSE_COLORS.teal }}
      >
        {letter}
      </span>
    </motion.div>
  );
}

export default function NorthStarPrime() {
  const [, navigate] = useLocation();
  const data = northStarPrime;

  return (
    <div className="min-h-screen pb-8" style={{ background: PULSE_COLORS.bg }} data-testid="north-star-prime">
      {/* Back nav */}
      <button
        onClick={() => navigate('/pulse-zone/north-star')}
        className="px-4 pt-4 pb-2 text-sm font-medium flex items-center gap-1"
        style={{ color: PULSE_COLORS.teal }}
      >
        ‹ North Star
      </button>

      {/* Title */}
      <div className="px-4 mb-6">
        <h2 className="text-xs font-bold tracking-wider mb-1" style={{ color: PULSE_COLORS.goldLight }}>
          YOUR PRIME NORTH STAR
        </h2>
        <h1 className="text-2xl font-extrabold text-white">{data.headline}</h1>
      </div>

      {/* Quote */}
      <div className="px-4 mb-6">
        <div
          className="p-5 rounded-xl"
          style={{
            background: PULSE_COLORS.tealDark,
            border: `1px solid ${PULSE_COLORS.borderTeal}`,
          }}
        >
          <p className="text-lg italic font-semibold text-white leading-relaxed">
            {data.quote}
          </p>
          <p className="text-sm mt-2" style={{ color: PULSE_COLORS.textMuted }}>
            {data.quoteAuthor}
          </p>
        </div>
      </div>

      {/* Compass Grid */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          {data.compass.map((card, i) => (
            <CompassCard
              key={card.direction}
              direction={card.direction}
              title={card.title}
              content={card.content}
              letter={card.letter}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Encouragement */}
      <p className="px-4 text-center text-sm italic mb-6" style={{ color: PULSE_COLORS.teal }}>
        {data.encouragement}
      </p>

      {/* Destiny Discovered CTA */}
      <div className="px-4 mb-6">
        <div
          className="p-4 rounded-xl"
          style={{
            background: PULSE_COLORS.bgCard,
            border: `1px solid ${PULSE_COLORS.borderGold}`,
          }}
        >
          <p className="font-bold text-lg" style={{ color: PULSE_COLORS.orange }}>
            Ready to go deeper?
          </p>
          <p className="text-sm mt-1" style={{ color: PULSE_COLORS.textSecondary }}>
            Take the 30-question Destiny Discovered self-assessment
          </p>
          <p className="text-xs mt-1" style={{ color: PULSE_COLORS.textMuted }}>
            Uncover your purpose, your values, and...
          </p>
          <button
            className="w-full py-3 rounded-xl font-bold text-sm mt-3"
            style={{ background: PULSE_COLORS.orange, color: 'white' }}
          >
            Begin Your Discovery →
          </button>
        </div>
      </div>

      {/* Link to Ding */}
      <div className="px-4 pb-4 text-center">
        <div className="border-t mb-4" style={{ borderColor: PULSE_COLORS.borderMuted }} />
        <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ background: PULSE_COLORS.teal }} />
        <button
          onClick={() => navigate('/pulse-zone/north-star/ding')}
          className="text-sm font-medium"
          style={{ color: PULSE_COLORS.teal }}
        >
          And then there's the biggest reason of all →
        </button>
      </div>
    </div>
  );
}
