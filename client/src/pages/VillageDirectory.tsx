import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users, Star, Pencil, Check, X, Sparkles, Shield, Heart, Music, Compass, BookOpen, Wallet, Milk, Zap, Search as SearchIcon, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const AGENT_ICONS: Record<string, typeof Users> = {
  grace: Heart,
  rosa_union_boss: Shield,
  big_mama: Heart,
  frankie_banker: Wallet,
  sunny_joy_genie: Music,
  vinnie_handyman: Zap,
  sage_elder: Star,
  sloane_vampire_slayer: Shield,
  jolene_journalist: BookOpen,
  nana_promise_keeper: Heart,
  north_navigator: Compass,
  penny_collector: Milk,
  moxie_negotiator: TrendingUp,
  stretch_budgeteer: Wallet,
  spike_fee_fighter: Zap,
  avalanche_debt_crusher: TrendingUp,
  scout_gig_finder: SearchIcon,
  steady_crisis_coach: Shield,
  maria_narrator: Music,
  lucia_composer: Music,
  mama_bear_rephraser: Heart,
};

const CATEGORY_CONFIG = {
  inner_circle: { label: "Inner Circle", color: "text-primary", bg: "bg-primary/5", border: "border-primary/20" },
  specialist: { label: "Specialists", color: "text-lift", bg: "bg-lift/5", border: "border-lift/20" },
  creative_studio: { label: "Creative Studio", color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-200" },
};

export default function VillageDirectory() {
  const [, navigate] = useLocation();
  const { profileId } = useGraceSession();
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const { data: allAgents } = trpc.village.allAgents.useQuery();
  const { data: myAgents, refetch: refetchMy } = trpc.village.myAgents.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const introduceMut = trpc.village.introduce.useMutation({
    onSuccess: () => {
      refetchMy();
      toast.success("New friend in your village!");
    },
  });

  const renameMut = trpc.village.rename.useMutation({
    onSuccess: () => {
      refetchMy();
      setRenamingId(null);
      setRenameValue("");
      toast.success("Agent renamed!");
    },
  });

  const myAgentKeys = new Set((myAgents || []).map((a: any) => a.agent.agentKey));
  const myAgentMap = new Map((myAgents || []).map((a: any) => [a.agent.agentKey, a]));

  // Group by category
  const grouped = (allAgents || []).reduce((acc: any, agent: any) => {
    if (!acc[agent.category]) acc[agent.category] = [];
    acc[agent.category].push(agent);
    return acc;
  }, {} as Record<string, any[]>);

  const introducedCount = myAgents?.length || 0;
  const totalCount = allAgents?.length || 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-card/80 backdrop-blur-sm">
        <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-foreground">The Village</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Intro */}
        <Card className="bg-gradient-to-br from-primary/5 via-accent/10 to-lift/5 border-primary/20">
          <CardContent className="py-6 text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-base font-bold text-foreground mb-1">Your AI Village</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every person here has a name and a trade — like the old guild system.
              Grace introduces them as you need them. You can rename anyone.
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              {introducedCount} of {totalCount} agents in your village
            </p>
          </CardContent>
        </Card>

        {/* Agent Categories */}
        {(["inner_circle", "specialist", "creative_studio"] as const).map((category) => {
          const config = CATEGORY_CONFIG[category];
          const agents = grouped[category] || [];
          if (agents.length === 0) return null;

          return (
            <div key={category} className="space-y-3">
              <h2 className={`text-sm font-bold ${config.color} flex items-center gap-2`}>
                <Sparkles className="w-4 h-4" />
                {config.label}
              </h2>

              <div className="space-y-2">
                {agents.map((agent: any) => {
                  const isIntroduced = myAgentKeys.has(agent.agentKey);
                  const myData = myAgentMap.get(agent.agentKey);
                  const displayName = myData?.introduction?.customName || agent.defaultName;
                  const Icon = AGENT_ICONS[agent.agentKey] || Users;
                  const isRenaming = renamingId === agent.agentKey;

                  return (
                    <motion.div key={agent.id} layout>
                      <Card className={`transition-all ${isIntroduced ? config.border : "border-muted/30 opacity-60"} ${isIntroduced ? config.bg : ""}`}>
                        <CardContent className="py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                              isIntroduced ? "bg-primary/10" : "bg-muted/20"
                            }`}>
                              <Icon className={`w-5 h-5 ${isIntroduced ? "text-primary" : "text-muted-foreground"}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              {isRenaming ? (
                                <div className="flex gap-2 items-center">
                                  <Input
                                    value={renameValue}
                                    onChange={(e) => setRenameValue(e.target.value)}
                                    className="h-8 text-sm"
                                    placeholder="New name..."
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" && renameValue.trim() && profileId) {
                                        renameMut.mutate({ profileId, agentKey: agent.agentKey, customName: renameValue.trim() });
                                      }
                                    }}
                                  />
                                  <button
                                    onClick={() => profileId && renameValue.trim() && renameMut.mutate({ profileId, agentKey: agent.agentKey, customName: renameValue.trim() })}
                                    className="text-lift"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => setRenamingId(null)} className="text-muted-foreground">
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <p className="text-sm font-bold text-foreground truncate">{displayName}</p>
                                  <p className="text-xs text-muted-foreground">{agent.description}</p>
                                </>
                              )}
                            </div>
                            {isIntroduced && !isRenaming ? (
                              <button
                                onClick={() => {
                                  setRenamingId(agent.agentKey);
                                  setRenameValue(displayName);
                                }}
                                className="text-muted-foreground hover:text-foreground p-1"
                                title="Rename"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            ) : !isIntroduced ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => profileId && introduceMut.mutate({ profileId, agentKey: agent.agentKey })}
                                disabled={introduceMut.isPending}
                              >
                                Meet
                              </Button>
                            ) : null}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Spirit Check */}
        <Card className="border-warmth/30 bg-warmth/5">
          <CardContent className="py-4 text-center">
            <p className="text-sm text-foreground/80 italic">
              "She's got a guy for that. And I heard his reputation is amazing."
            </p>
            <p className="text-xs text-muted-foreground mt-2">— How the village talks about your team</p>
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
}
