import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, ShieldCheck, Banknote, Users, GraduationCap, Package, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

const CATEGORY_CONFIG: Record<string, { label: string; icon: typeof TrendingUp; color: string }> = {
  subscription_cancelled: { label: "Vampires Slayed", icon: ShieldCheck, color: "text-destructive" },
  nsf_avoided: { label: "NSF Fees Avoided", icon: Banknote, color: "text-grace" },
  barter_value: { label: "Barter Value", icon: Users, color: "text-primary" },
  neighbor_economy: { label: "Neighbor Economy", icon: Users, color: "text-secondary-foreground" },
  wisdom_giants: { label: "Wisdom Giants", icon: GraduationCap, color: "text-lift" },
  expense_reduced: { label: "Expenses Reduced", icon: TrendingUp, color: "text-grace" },
  tp_delivery: { label: "Essentials Delivered", icon: Package, color: "text-primary" },
  other: { label: "Other Wins", icon: Sparkles, color: "text-muted-foreground" },
};

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { profileId } = useGraceSession();

  const { data: summary } = trpc.financial.getSummary.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const { data: impacts } = trpc.financial.getImpacts.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const totalLift = summary?.total || 0;
  const categories = summary?.byCategory || {};

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-background pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-card/80 backdrop-blur-sm">
        <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Your Financial Lift</h1>
      </div>

      <div className="w-full max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Hero Lift Number */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-lift/10 via-accent/20 to-primary/10 border-lift/30">
            <CardContent className="text-center py-8">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Your estimated financial lift this month
              </p>
              <p className="text-5xl font-extrabold text-foreground lift-glow mb-2">
                {formatCents(totalLift)}
              </p>
              <p className="text-xs text-muted-foreground">
                Every dollar counts. This is estimated based on actions taken.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Breakdown */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-foreground">Where your lift comes from</h2>
          {Object.entries(categories).length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Sparkles className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Your lift story starts when you chat with Grace. She'll help you find savings you didn't know you had.
                </p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(categories).map(([cat, amount]) => {
              const config = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.other;
              const Icon = config.icon;
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card>
                    <CardContent className="flex items-center gap-4 py-3 px-4">
                      <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center ${config.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{config.label}</p>
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        {formatCents(amount as number)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Recent Activity */}
        {impacts && impacts.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-foreground">Recent wins</h2>
            {impacts.slice(0, 10).map((impact, i) => (
              <div key={impact.id} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                <div className="w-2 h-2 rounded-full bg-grace mt-2 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{impact.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {impact.isEstimated ? "Estimated" : "Confirmed"} • {new Date(impact.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm font-bold text-grace">
                  +{formatCents(impact.estimatedValue)}
                </p>
              </div>
            ))}
          </div>
        )}

        {!profileId && (
          <Card>
            <CardContent className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Chat with Grace first — she'll help you start building your financial lift.
              </p>
              <button
                onClick={() => navigate("/grace")}
                className="text-sm font-medium text-grace hover:underline"
              >
                Talk to Grace →
              </button>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
