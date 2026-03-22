import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import { useLocation } from "wouter";
import BottomNav from "@/components/BottomNav";
import { ArrowLeft, Home, Briefcase, Clock, Sparkles, Heart, Sun, Moon } from "lucide-react";

const PERSONALITY_LABELS: Record<string, { name: string; color: string }> = {
  angel: { name: "Angel of Her Better Nature", color: "text-pink-400" },
  coach: { name: "The Coach", color: "text-amber-400" },
  fierce: { name: "The Fierce One", color: "text-red-400" },
  bestfriend: { name: "The Best Friend", color: "text-teal-400" },
  antithesis: { name: "The Antithesis", color: "text-violet-400" },
};

const SCHEDULE_LABELS: Record<string, string> = {
  early_bird: "Early Bird — up before the sun",
  nine_to_five: "9 to 5 — steady rhythm",
  night_shift: "Night Owl — alive after dark",
  irregular: "Irregular — every day is different",
  stay_at_home: "Home-based — always around",
};

export default function GraceWorld() {
  const { profileId } = useGraceSession();
  const [, navigate] = useLocation();

  const { data: world, isLoading } = trpc.consciousness.getGraceWorld.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  if (isLoading || !world) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-teal-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-teal-400 animate-pulse mx-auto mb-3" />
          <p className="text-sm text-slate-400">Loading Grace's world...</p>
        </div>
      </div>
    );
  }

  const personality = PERSONALITY_LABELS[world.personality] || PERSONALITY_LABELS.bestfriend;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-teal-900 text-white pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4">
        <button onClick={() => navigate("/grace")} className="text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold">Grace's World</h1>
          <p className="text-xs text-slate-400">Her life, her space, her day</p>
        </div>
      </div>

      <div className="max-w-sm mx-auto px-4 space-y-4">
        {/* Daily Self — How Grace is feeling today */}
        <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{world.dailySelf.emoji}</span>
            <div>
              <h2 className="font-semibold text-sm">Today's Grace</h2>
              <p className="text-xs text-slate-400 capitalize">{world.dailySelf.mood} · {world.dailySelf.energy} energy</p>
            </div>
          </div>
          <p className="text-sm text-slate-300 italic leading-relaxed">"{world.dailySelf.opening}"</p>
          <p className="text-xs text-slate-500 mt-2">Wearing: {world.dailySelf.outfit}</p>
        </div>

        {/* Personality */}
        <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-pink-400" />
            <h2 className="font-semibold text-sm">Personality</h2>
          </div>
          <p className={`text-sm font-medium ${personality.color}`}>{personality.name}</p>
          <button
            onClick={() => navigate("/personality")}
            className="text-xs text-teal-400 hover:text-teal-300 mt-2 underline underline-offset-2"
          >
            Change Grace's personality →
          </button>
        </div>

        {/* Grace's Home */}
        <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-4 h-4 text-amber-400" />
            <h2 className="font-semibold text-sm">{world.home.name}</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{world.home.description}</p>
          <p className="text-xs text-slate-500 mt-2">Rent: {world.home.rent}</p>
        </div>

        {/* Grace's Job */}
        <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-teal-400" />
            <h2 className="font-semibold text-sm">{world.job.title}</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{world.job.description}</p>
          <p className="text-xs text-slate-500 mt-2">{world.job.schedule}</p>
        </div>

        {/* Schedule */}
        <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-violet-400" />
            <h2 className="font-semibold text-sm">Grace's Schedule</h2>
          </div>
          <p className="text-sm text-slate-300">{SCHEDULE_LABELS[world.schedule.type] || "Flexible"}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Sun className="w-3 h-3" /> Wakes: {world.schedule.wakeTime}</span>
            <span className="flex items-center gap-1"><Moon className="w-3 h-3" /> Sleeps: {world.schedule.sleepTime}</span>
          </div>
        </div>

        {/* Tier */}
        <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <h2 className="font-semibold text-sm">Consciousness Tier</h2>
          </div>
          <p className="text-sm text-slate-300 capitalize">{world.tier}</p>
          <button
            onClick={() => navigate("/consciousness")}
            className="text-xs text-teal-400 hover:text-teal-300 mt-2 underline underline-offset-2"
          >
            Explore tiers →
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
