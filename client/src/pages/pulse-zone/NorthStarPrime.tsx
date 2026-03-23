import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { COLORS } from "@/components/pulse-zone/pulseTheme";
import { pulseData } from "@/components/pulse-zone/pulseData";

export default function NorthStarPrime() {
  const [, navigate] = useLocation();
  const data = pulseData.northStarPrime;

  const compassCards = [
    { direction: "NORTH", label: "Purpose", text: data.purpose, letter: "N", color: COLORS.tealDark },
    { direction: "EAST", label: "BHAG", text: data.bhag, letter: "E", color: COLORS.tealDark },
    { direction: "SOUTH", label: "Prime Directive", text: data.primeDirective, letter: "S", color: COLORS.tealDark },
    { direction: "WEST", label: "Core Values", text: data.coreValues.join(". ") + ".", letter: "W", color: COLORS.tealDark },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: COLORS.darkStarfield }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <button onClick={() => navigate("/pulse-zone/north-star")} className="flex items-center gap-1 mb-3">
          <ChevronLeft className="w-4 h-4" style={{ color: COLORS.teal }} />
          <span className="text-sm" style={{ color: COLORS.teal }}>North Star</span>
        </button>
        <h3 className="text-xs font-bold tracking-wider uppercase" style={{ color: COLORS.amber }}>YOUR PRIME NORTH STAR</h3>
        <h1 className="text-2xl font-bold mt-1" style={{ color: COLORS.white }}>You are the CEO of Me Inc.</h1>
      </div>

      {/* Quote Card */}
      <div className="mx-4 mt-4 p-5 rounded-2xl border" style={{ borderColor: COLORS.borderTeal, backgroundColor: COLORS.deepTeal }}>
        <p className="text-lg italic font-medium" style={{ color: COLORS.white }}>
          "What makes the great, great is a sense of destiny."
        </p>
        <p className="text-sm mt-2" style={{ color: COLORS.textSecondary }}>— Tim Latimer, Destiny Discovered</p>
      </div>

      {/* Compass Grid */}
      <div className="px-4 mt-6 grid grid-cols-2 gap-3">
        {compassCards.map((card, i) => (
          <motion.div
            key={card.direction}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.12 }}
            className="p-4 rounded-xl border relative"
            style={{ borderColor: COLORS.borderTeal, backgroundColor: COLORS.cardBackground }}
          >
            <p className="text-xs font-bold tracking-wider uppercase" style={{ color: COLORS.amber }}>{card.direction}</p>
            <p className="font-bold text-sm mt-1" style={{ color: COLORS.white }}>{card.label}</p>
            <p className="text-xs mt-2 leading-relaxed" style={{ color: COLORS.textSecondary }}>{card.text}</p>
            {/* Tap to edit */}
            <div className="flex items-center gap-1 mt-3">
              <span className="text-[10px]" style={{ color: COLORS.textMuted }}>✏️ tap to edit</span>
            </div>
            {/* Direction letter */}
            <span className="absolute bottom-2 right-3 text-2xl font-bold opacity-20" style={{ color: card.color }}>
              {card.letter}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Grace Voice */}
      <div className="px-4 mt-6">
        <p className="text-sm text-center italic" style={{ color: COLORS.teal }}>
          Ruby, you've always had a North Star. Grace just helped you find the words for it.
        </p>
      </div>

      {/* Destiny Discovered CTA */}
      <div className="mx-4 mt-6 p-4 rounded-xl border" style={{ borderColor: COLORS.borderAmber, backgroundColor: COLORS.cardBackground }}>
        <h3 className="text-lg font-bold" style={{ color: COLORS.amber }}>Ready to go deeper?</h3>
        <p className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>
          Take the 30-question Destiny Discovered self-assessment
        </p>
        <p className="text-xs mt-1" style={{ color: COLORS.textMuted }}>
          Uncover your purpose, your values, and your prime directive.
        </p>
        <button className="w-full mt-3 py-3 rounded-full text-sm font-bold"
          style={{ backgroundColor: COLORS.scoreOrange, color: COLORS.white }}>
          Begin Your Discovery →
        </button>
      </div>

      {/* Navigation to Ding */}
      <div className="px-4 mt-6 flex flex-col items-center">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.teal }} />
        <button onClick={() => navigate("/pulse-zone/north-star/ding")} className="flex items-center gap-2 mt-2">
          <span className="text-sm" style={{ color: COLORS.teal }}>And then there's the biggest reason of all</span>
          <ArrowRight className="w-4 h-4" style={{ color: COLORS.teal }} />
        </button>
      </div>
    </div>
  );
}
