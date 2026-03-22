import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Banknote, PiggyBank, Milk, Heart, RefreshCw, Trophy, Star } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { toast } from "sonner";

const TIER_CONFIG: Record<string, { label: string; color: string; emoji: string }> = {
  starting_out: { label: "Starting Out", color: "text-muted-foreground", emoji: "🌱" },
  finding_footing: { label: "Finding Footing", color: "text-blue-500", emoji: "👣" },
  building_momentum: { label: "Building Momentum", color: "text-primary", emoji: "🔥" },
  rising_strong: { label: "Rising Strong", color: "text-lift", emoji: "⭐" },
  dignity_achieved: { label: "Dignity Achieved", color: "text-yellow-500", emoji: "👑" },
};

const DIMENSION_CONFIG = [
  { key: "vampireSlayer" as const, label: "Vampire Slayer", icon: Shield, color: "#ef4444", desc: "Subscriptions cancelled" },
  { key: "nsfShield" as const, label: "NSF Shield", icon: Banknote, color: "#3b82f6", desc: "NSF fees avoided" },
  { key: "budgetMastery" as const, label: "Budget Mastery", icon: PiggyBank, color: "#22c55e", desc: "Budget adherence" },
  { key: "milkMoneyTrust" as const, label: "Milk Money Trust", icon: Milk, color: "#a855f7", desc: "Repayment record" },
  { key: "engagement" as const, label: "Engagement", icon: Heart, color: "#f97316", desc: "Activity & promises kept" },
];

function RadialProgress({ score, size = 180 }: { score: number; size?: number }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 80 ? "#eab308" : score >= 60 ? "#22c55e" : score >= 40 ? "#2dd4bf" : score >= 20 ? "#3b82f6" : "#94a3b8";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="currentColor" strokeWidth="8"
          className="text-muted/30"
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-foreground">{score}</span>
        <span className="text-xs text-muted-foreground font-medium">of 100</span>
      </div>
    </div>
  );
}

function DimensionBar({ label, value, max, color, icon: Icon, desc }: {
  label: string; value: number; max: number; color: string; icon: typeof Shield; desc: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" style={{ color }} />
          <span className="text-sm font-semibold text-foreground">{label}</span>
        </div>
        <span className="text-sm font-bold" style={{ color }}>{value}/{max}</span>
      </div>
      <div className="h-2.5 bg-muted/40 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}

export default function DignityScore() {
  const [, navigate] = useLocation();
  const { profileId } = useGraceSession();

  const { data: score, refetch } = trpc.dignity.getLatest.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const { data: history } = trpc.dignity.getHistory.useQuery(
    { profileId: profileId!, limit: 7 },
    { enabled: !!profileId }
  );

  const calculateMut = trpc.dignity.calculate.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Dignity Score updated!");
    },
  });

  const tierInfo = TIER_CONFIG[score?.tier || "starting_out"];
  const totalScore = score?.totalScore || 0;

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-background pb-20">
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-card/80 backdrop-blur-sm">
        <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Dignity Score</h1>
      </div>

      <div className="w-full max-w-sm mx-auto px-4 py-6 space-y-6">
        {/* Radial Score */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-br from-primary/5 via-accent/10 to-lift/5 border-primary/20">
            <CardContent className="flex flex-col items-center py-8">
              <RadialProgress score={totalScore} />
              <div className="mt-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {tierInfo.emoji} {tierInfo.label}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {totalScore < 20 && "Every journey starts with a single step. You're here — that matters."}
                  {totalScore >= 20 && totalScore < 40 && "You're finding your footing. Grace sees the effort."}
                  {totalScore >= 40 && totalScore < 60 && "Momentum is building. You're making real moves."}
                  {totalScore >= 60 && totalScore < 80 && "Rising strong. Look how far you've come."}
                  {totalScore >= 80 && "Dignity achieved. You did this. All of it."}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => profileId && calculateMut.mutate({ profileId })}
                disabled={calculateMut.isPending}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${calculateMut.isPending ? "animate-spin" : ""}`} />
                Refresh Score
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dimension Breakdown */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            Your Five Dimensions
          </h2>
          <Card>
            <CardContent className="py-5 space-y-5">
              {DIMENSION_CONFIG.map((dim) => (
                <DimensionBar
                  key={dim.key}
                  label={dim.label}
                  value={(score as any)?.[dim.key] || 0}
                  max={20}
                  color={dim.color}
                  icon={dim.icon}
                  desc={dim.desc}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* History */}
        {history && history.length > 1 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Star className="w-4 h-4 text-lift" />
              Recent Progress
            </h2>
            <Card>
              <CardContent className="py-4">
                <div className="flex items-end justify-between gap-2 h-24">
                  {history.slice().reverse().map((h, i) => {
                    const height = Math.max(8, (h.totalScore / 100) * 80);
                    return (
                      <div key={i} className="flex flex-col items-center gap-1 flex-1">
                        <span className="text-[10px] font-bold text-foreground">{h.totalScore}</span>
                        <motion.div
                          className="w-full rounded-t-md bg-primary/70"
                          initial={{ height: 0 }}
                          animate={{ height }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Spirit Check */}
        <Card className="border-warmth/30 bg-warmth/5">
          <CardContent className="py-5 text-center">
            <p className="text-sm text-foreground/80 italic">
              "This score is a celebration, never a report card. It measures how much the world
              has gotten out of your way — not how hard you've tried. You've always been trying."
            </p>
            <p className="text-xs text-muted-foreground mt-2">— Grace</p>
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
}
