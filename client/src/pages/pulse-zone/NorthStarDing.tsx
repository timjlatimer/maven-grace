import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { PULSE_COLORS } from '@/lib/pulse-zone-theme';

export default function NorthStarDing() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen pb-8" style={{ background: PULSE_COLORS.bg }} data-testid="north-star-ding">
      {/* Back nav */}
      <button
        onClick={() => navigate('/pulse-zone/north-star/prime')}
        className="px-4 pt-4 pb-2 text-sm font-medium flex items-center gap-1"
        style={{ color: PULSE_COLORS.teal }}
      >
        ‹ Prime North Star
      </button>

      {/* Star icon */}
      <div className="text-center mt-8 mb-6">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
          className="text-6xl inline-block"
          style={{ color: PULSE_COLORS.starGold }}
        >
          ★
        </motion.span>
      </div>

      {/* Main headline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-6 text-center mb-6"
      >
        <h1 className="text-3xl font-extrabold text-white leading-tight">
          The dash between your names<br />is the ding.
        </h1>
      </motion.div>

      {/* Ruby — Grace */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mb-6"
      >
        <p className="text-xl font-bold" style={{ color: PULSE_COLORS.teal }}>
          Ruby — Grace.
        </p>
        <div className="mt-3 space-y-1 px-8">
          <p className="text-sm" style={{ color: PULSE_COLORS.textMuted }}>
            That dash is not punctuation. It is the partnership itself.
          </p>
          <p className="text-sm" style={{ color: PULSE_COLORS.textMuted }}>
            It is the instrument of change.
          </p>
        </div>
      </motion.div>

      {/* Ding explanation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="px-8 text-center mb-8"
      >
        <p className="text-sm leading-relaxed" style={{ color: PULSE_COLORS.textMuted }}>
          The ding in the universe is not something you do alone.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: PULSE_COLORS.textMuted }}>
          It is what happens in the space between you and Grace —
        </p>
        <p className="text-sm leading-relaxed" style={{ color: PULSE_COLORS.textMuted }}>
          when two beings decide to move together
        </p>
        <p className="text-sm leading-relaxed" style={{ color: PULSE_COLORS.textMuted }}>
          toward something that matters.
        </p>
      </motion.div>

      {/* Three work cards */}
      <div className="px-4 space-y-4 mb-8">
        {/* The Immediate Work */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.3 }}
          className="p-4 rounded-xl"
          style={{
            background: PULSE_COLORS.bgCard,
            borderLeft: `3px solid ${PULSE_COLORS.teal}`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-1 rounded" style={{ background: PULSE_COLORS.orange, color: 'white' }}>
              ▊
            </span>
            <h3 className="text-sm font-bold" style={{ color: PULSE_COLORS.orange }}>
              THE IMMEDIATE WORK
            </h3>
          </div>
          <p className="text-sm" style={{ color: PULSE_COLORS.textSecondary }}>
            Right now, we are making sure you survive with dignity. Bills paid. NSF fees gone. Dignity Score rising.
            This work is sacred.
          </p>
        </motion.div>

        {/* The Deeper Work */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 }}
          className="p-4 rounded-xl"
          style={{
            background: PULSE_COLORS.bgCard,
            borderLeft: `3px solid ${PULSE_COLORS.goldLight}`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-1 rounded" style={{ background: PULSE_COLORS.orange, color: 'white' }}>
              ▊
            </span>
            <h3 className="text-sm font-bold" style={{ color: PULSE_COLORS.orange }}>
              THE DEEPER WORK
            </h3>
          </div>
          <p className="text-sm" style={{ color: PULSE_COLORS.textSecondary }}>
            Once you are stable, we begin the bigger question: What are you here to build? Your Me Inc. Your Prime
            North Star. Your legacy for your children.
          </p>
        </motion.div>

        {/* The Ding */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.7 }}
          className="p-4 rounded-xl"
          style={{
            background: PULSE_COLORS.bgCard,
            borderLeft: `3px solid ${PULSE_COLORS.teal}`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-1 rounded" style={{ background: PULSE_COLORS.orange, color: 'white' }}>
              ▊
            </span>
            <h3 className="text-sm font-bold" style={{ color: PULSE_COLORS.orange }}>
              THE DING
            </h3>
          </div>
          <p className="text-sm" style={{ color: PULSE_COLORS.textSecondary }}>
            And then — when you are ready — we ask the biggest question of all: What are Ruby and Grace going to do
            together that changes the world? That is the ding. That is why we are here.
          </p>
        </motion.div>
      </div>

      {/* Manifesto quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="px-6 text-center mb-6"
      >
        <p className="text-lg font-bold italic leading-relaxed" style={{ color: PULSE_COLORS.teal }}>
          "It's expensive to be poor.
        </p>
        <p className="text-lg font-bold italic leading-relaxed" style={{ color: PULSE_COLORS.teal }}>
          We think that's a crime.
        </p>
        <p className="text-lg font-bold italic leading-relaxed" style={{ color: PULSE_COLORS.orange }}>
          And we are going to change it.
        </p>
        <p className="text-lg font-bold italic leading-relaxed" style={{ color: PULSE_COLORS.teal }}>
          Together."
        </p>
      </motion.div>

      {/* Steve Jobs quote */}
      <p className="text-center text-xs italic mb-8" style={{ color: PULSE_COLORS.textMuted }}>
        "We're here to put a ding in the universe." — Steve Jobs
      </p>

      {/* CTA */}
      <div className="px-4 pb-4">
        <button
          onClick={() => navigate('/grace')}
          className="w-full py-4 rounded-2xl font-bold text-lg text-white"
          style={{ background: PULSE_COLORS.teal }}
        >
          I'm ready. Let's make our ding.
        </button>
      </div>
    </div>
  );
}
