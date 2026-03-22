import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart, Flame, Shield, Sparkles, Zap } from "lucide-react";

const ARCHETYPES = [
  {
    id: "angel" as const,
    name: "Angel of Her Better Nature",
    icon: Heart,
    color: "from-pink-400 to-rose-300",
    borderColor: "border-pink-300",
    description: "Gentle, nurturing, patient beyond measure. The voice that whispers 'you can do this' when you doubt yourself.",
    sample: '"Sweetheart, I see you. And I believe in you."',
  },
  {
    id: "coach" as const,
    name: "The Coach",
    icon: Zap,
    color: "from-amber-400 to-yellow-300",
    borderColor: "border-amber-300",
    description: "Direct, energetic, action-oriented. Sets small challenges and celebrates every win like it's the Super Bowl.",
    sample: '"Let\'s GO! You crushed that bill payment. What\'s next?"',
  },
  {
    id: "fierce" as const,
    name: "The Fierce One",
    icon: Flame,
    color: "from-red-400 to-orange-300",
    borderColor: "border-red-300",
    description: "The mama bear. Protective, fierce, and not polite about injustice. Shows up with a baseball bat when someone messes with you.",
    sample: '"Oh HELL no. That company has been robbing you blind."',
  },
  {
    id: "bestfriend" as const,
    name: "The Best Friend",
    icon: Sparkles,
    color: "from-teal-400 to-emerald-300",
    borderColor: "border-teal-300",
    description: "The ride-or-die. Gossips kindly, laughs easily, shares her own stories. The friend you text at 2am.",
    sample: '"Girl, wait — tell me everything. I need the full story."',
  },
  {
    id: "antithesis" as const,
    name: "The Antithesis",
    icon: Shield,
    color: "from-violet-400 to-purple-300",
    borderColor: "border-violet-300",
    description: "Intellectually challenging. Plays devil's advocate — lovingly. Asks the hard questions nobody else will.",
    sample: '"But what if you COULD? What would that look like?"',
  },
];

export default function PersonalityDial() {
  const { profileId } = useGraceSession();
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: prefs } = trpc.consciousness.getPreferences.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const setPersonality = trpc.consciousness.setPersonality.useMutation();

  const currentPersonality = selected || prefs?.personality || "bestfriend";

  const handleSave = async () => {
    if (!profileId || !selected) return;
    setSaving(true);
    try {
      await setPersonality.mutateAsync({ profileId, personality: selected as any });
      navigate("/grace");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-teal-900 text-white p-4 pb-32">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center pt-6 pb-4">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-teal-500/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-teal-300" />
          </div>
          <h1 className="text-xl font-bold mb-1">Who Should Grace Be?</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Every Grace is unique. Pick the version of me that feels right for you. 
            You can always change your mind later.
          </p>
        </div>

        {/* Archetype Cards */}
        <div className="space-y-3 mt-4">
          {ARCHETYPES.map((arch) => {
            const Icon = arch.icon;
            const isSelected = currentPersonality === arch.id;
            return (
              <button
                key={arch.id}
                onClick={() => setSelected(arch.id)}
                className={`w-full text-left rounded-xl p-4 transition-all duration-300 ${
                  isSelected
                    ? `bg-gradient-to-r ${arch.color} text-slate-900 shadow-lg scale-[1.02]`
                    : `bg-slate-800/60 border ${arch.borderColor}/20 hover:bg-slate-700/60`
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-white/30' : 'bg-slate-700'
                  }`}>
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-slate-900' : 'text-slate-300'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-sm ${isSelected ? 'text-slate-900' : 'text-white'}`}>
                      {arch.name}
                    </h3>
                    <p className={`text-xs mt-1 leading-relaxed ${isSelected ? 'text-slate-800' : 'text-slate-400'}`}>
                      {arch.description}
                    </p>
                    <p className={`text-xs mt-2 italic ${isSelected ? 'text-slate-700' : 'text-slate-500'}`}>
                      {arch.sample}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-white/40 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="mt-6 pb-4">
          <Button
            onClick={handleSave}
            disabled={!selected || saving}
            className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold py-3 rounded-xl"
          >
            {saving ? "Saving..." : selected ? `Be My ${ARCHETYPES.find(a => a.id === selected)?.name}` : "Pick Your Grace"}
          </Button>
          <button
            onClick={() => navigate("/grace")}
            className="w-full mt-2 text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            Skip for now — I'll be your Best Friend
          </button>
        </div>
      </div>
    </div>
  );
}
