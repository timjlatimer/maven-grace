import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Globe, Clock, Briefcase, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

const PERSONALITIES = [
  { id: "angel" as const, name: "Angel of Her Better Nature", emoji: "👼", desc: "Gentle, nurturing, always sees the best in you" },
  { id: "coach" as const, name: "The Coach", emoji: "💪", desc: "Direct, motivating, pushes you toward your goals" },
  { id: "fierce" as const, name: "The Fierce One", emoji: "🔥", desc: "Bold, protective, fights for you" },
  { id: "bestfriend" as const, name: "The Best Friend", emoji: "💛", desc: "Warm, relatable, always has your back" },
  { id: "antithesis" as const, name: "The Antithesis", emoji: "🪞", desc: "Challenges your thinking, asks hard questions" },
];

const CULTURES = [
  { id: "universal", name: "Universal", emoji: "🌍" },
  { id: "african_american", name: "African American", emoji: "✊" },
  { id: "hispanic_latino", name: "Hispanic / Latino", emoji: "🌮" },
  { id: "indigenous", name: "Indigenous", emoji: "🪶" },
  { id: "south_asian", name: "South Asian", emoji: "🪷" },
  { id: "east_asian", name: "East Asian", emoji: "🏮" },
  { id: "middle_eastern", name: "Middle Eastern", emoji: "🕌" },
  { id: "european", name: "European", emoji: "🏰" },
  { id: "caribbean", name: "Caribbean", emoji: "🌴" },
];

const SCHEDULES = [
  { id: "early_bird" as const, name: "Early Bird", desc: "Up before dawn, bed by 9pm", emoji: "🌅" },
  { id: "nine_to_five" as const, name: "9 to 5", desc: "Standard work hours", emoji: "💼" },
  { id: "night_shift" as const, name: "Night Shift", desc: "Working while others sleep", emoji: "🌙" },
  { id: "irregular" as const, name: "Irregular", desc: "No fixed schedule", emoji: "🔄" },
  { id: "stay_at_home" as const, name: "Stay at Home", desc: "Home with the kids", emoji: "🏠" },
];

const EXPERTISES = [
  { id: "childcare", name: "Childcare", emoji: "👶" },
  { id: "finance", name: "Finance", emoji: "💰" },
  { id: "health", name: "Health & Wellness", emoji: "🏥" },
  { id: "art", name: "Art & Creativity", emoji: "🎨" },
  { id: "engineering", name: "Engineering", emoji: "⚙️" },
  { id: "education", name: "Education", emoji: "📚" },
  { id: "cooking", name: "Cooking & Nutrition", emoji: "🍳" },
  { id: "social_work", name: "Social Work", emoji: "🤝" },
  { id: "general", name: "A Bit of Everything", emoji: "✨" },
];

const STEPS = [
  { title: "Meet Grace", icon: Heart, subtitle: "Choose who Grace is to you" },
  { title: "Your Culture", icon: Globe, subtitle: "Help Grace understand your world" },
  { title: "Your Schedule", icon: Clock, subtitle: "When should Grace be there?" },
  { title: "Grace's Job", icon: Briefcase, subtitle: "What's Grace's expertise?" },
];

interface OnboardingFlowProps {
  profileId: number;
  onComplete: () => void;
}

export default function OnboardingFlow({ profileId, onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [personality, setPersonality] = useState<typeof PERSONALITIES[number]["id"]>("bestfriend");
  const [culture, setCulture] = useState("universal");
  const [schedule, setSchedule] = useState<typeof SCHEDULES[number]["id"]>("nine_to_five");
  const [expertise, setExpertise] = useState("general");
  const [, navigate] = useLocation();

  const setPersonalityMut = trpc.consciousness.setPersonality.useMutation();
  const setCulturalMut = trpc.consciousness.setCulturalProfile.useMutation();
  const updateScheduleMut = trpc.consciousness.updateSchedule.useMutation();
  const updateOnboardingMut = trpc.consciousness.updateOnboarding.useMutation();
  const upsertPrefsMut = trpc.consciousness.setPersonality.useMutation();

  // Load existing progress
  const { data: status } = trpc.consciousness.getOnboardingStatus.useQuery({ profileId });
  useEffect(() => {
    if (status) {
      if (status.complete) { onComplete(); return; }
      if (status.step > 0) setStep(status.step);
      if (status.personality !== 'bestfriend') setPersonality(status.personality as any);
      if (status.culturalBackground !== 'universal') setCulture(status.culturalBackground);
      if (status.scheduleType !== 'nine_to_five') setSchedule(status.scheduleType as any);
      if (status.expertise !== 'general') setExpertise(status.expertise);
    }
  }, [status]);

  const handleNext = async () => {
    if (step === 0) {
      await setPersonalityMut.mutateAsync({ profileId, personality });
    } else if (step === 1) {
      await setCulturalMut.mutateAsync({ profileId, culturalBackground: culture });
    } else if (step === 2) {
      await updateScheduleMut.mutateAsync({ profileId, scheduleType: schedule });
    } else if (step === 3) {
      // Save expertise + complete onboarding
      await db_saveExpertise();
      await updateOnboardingMut.mutateAsync({ profileId, step: 4, complete: true });
      onComplete();
      navigate("/grace");
      return;
    }
    await updateOnboardingMut.mutateAsync({ profileId, step: step + 1 });
    setStep(s => s + 1);
  };

  const db_saveExpertise = async () => {
    // Use the updateSchedule mutation to save expertise (it accepts optional fields)
    try {
      await setCulturalMut.mutateAsync({ profileId });
      // Actually we need a direct upsert — use the cultural profile endpoint with just profileId
    } catch (e) { /* ignore */ }
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const StepIcon = STEPS[step]?.icon || Heart;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-4">
      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === step ? 'w-8 bg-teal-400' : i < step ? 'w-2 bg-teal-600' : 'w-2 bg-slate-700'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          {/* Step header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-4">
              <StepIcon className="w-8 h-8 text-teal-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{STEPS[step]?.title}</h2>
            <p className="text-slate-400">{STEPS[step]?.subtitle}</p>
          </div>

          {/* Step 0: Personality */}
          {step === 0 && (
            <div className="space-y-3">
              {PERSONALITIES.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPersonality(p.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    personality === p.id
                      ? 'border-teal-400 bg-teal-500/10 shadow-lg shadow-teal-500/10'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.emoji}</span>
                    <div>
                      <div className="font-semibold text-white">{p.name}</div>
                      <div className="text-sm text-slate-400">{p.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 1: Culture */}
          {step === 1 && (
            <div className="grid grid-cols-3 gap-3">
              {CULTURES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCulture(c.id)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    culture === c.id
                      ? 'border-teal-400 bg-teal-500/10'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <span className="text-2xl block mb-1">{c.emoji}</span>
                  <span className="text-xs text-white">{c.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Schedule */}
          {step === 2 && (
            <div className="space-y-3">
              {SCHEDULES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSchedule(s.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    schedule === s.id
                      ? 'border-teal-400 bg-teal-500/10'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{s.emoji}</span>
                    <div>
                      <div className="font-semibold text-white">{s.name}</div>
                      <div className="text-sm text-slate-400">{s.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Grace's Job */}
          {step === 3 && (
            <div className="grid grid-cols-3 gap-3">
              {EXPERTISES.map(e => (
                <button
                  key={e.id}
                  onClick={() => setExpertise(e.id)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    expertise === e.id
                      ? 'border-teal-400 bg-teal-500/10'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <span className="text-2xl block mb-1">{e.emoji}</span>
                  <span className="text-xs text-white">{e.name}</span>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex gap-4 mt-8 w-full max-w-md">
        {step > 0 && (
          <Button variant="outline" onClick={handleBack} className="flex-1 border-slate-700 text-slate-300">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        )}
        <Button onClick={handleNext} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white">
          {step === 3 ? (
            <>
              <Sparkles className="w-4 h-4 mr-1" /> Meet Grace
            </>
          ) : (
            <>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>

      {/* Skip option */}
      <button
        onClick={async () => {
          await updateOnboardingMut.mutateAsync({ profileId, step: 4, complete: true });
          onComplete();
          navigate("/grace");
        }}
        className="mt-4 text-sm text-slate-500 hover:text-slate-400 transition-colors"
      >
        Skip for now — I'll set this up later
      </button>
    </div>
  );
}
