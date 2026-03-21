import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Shield, Plus, Skull, Trash2, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function VampireSlayer() {
  const [, navigate] = useLocation();
  const { profileId } = useGraceSession();
  const [newName, setNewName] = useState("");
  const [newCost, setNewCost] = useState("");

  const utils = trpc.useUtils();

  const { data: subs, isLoading } = trpc.vampireSlayer.getSubscriptions.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const addMutation = trpc.vampireSlayer.addSubscription.useMutation({
    onSuccess: () => {
      utils.vampireSlayer.getSubscriptions.invalidate();
      setNewName("");
      setNewCost("");
      toast.success("Subscription added!");
    },
  });

  const auditMutation = trpc.vampireSlayer.audit.useMutation({
    onSuccess: (result) => {
      utils.vampireSlayer.getSubscriptions.invalidate();
      if (result.vampires.length > 0) {
        toast.success(`Found ${result.vampires.length} vampire(s)! Estimated annual waste: $${(result.totalAnnualWaste / 100).toFixed(2)}`);
      } else {
        toast.info("No vampires found — your subscriptions look clean!");
      }
    },
  });

  const cancelMutation = trpc.vampireSlayer.cancelSubscription.useMutation({
    onSuccess: (result) => {
      utils.vampireSlayer.getSubscriptions.invalidate();
      utils.financial.getSummary.invalidate();
      toast.success(`Vampire slayed! Estimated $${(result.annualSavings / 100).toFixed(2)}/year saved!`);
    },
  });

  const handleAdd = () => {
    if (!newName.trim() || !newCost || !profileId) return;
    const costCents = Math.round(parseFloat(newCost) * 100);
    if (isNaN(costCents) || costCents <= 0) return;
    addMutation.mutate({ profileId, name: newName.trim(), monthlyCost: costCents });
  };

  const activeSubs = subs?.filter(s => s.status === "active") || [];
  const cancelledSubs = subs?.filter(s => s.status === "cancelled") || [];
  const totalMonthly = activeSubs.reduce((sum, s) => sum + s.monthlyCost, 0);
  const totalAnnual = totalMonthly * 12;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-card/80 backdrop-blur-sm">
        <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Shield className="w-5 h-5 text-destructive" />
        <h1 className="text-lg font-bold text-foreground">Vampire Slayer</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Intro */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Those sneaky subscriptions draining your wallet every month? Let's find them and stake them.
          </p>
        </div>

        {/* Cost Summary */}
        {activeSubs.length > 0 && (
          <Card className="border-destructive/20">
            <CardContent className="text-center py-4">
              <p className="text-xs text-muted-foreground">You're spending roughly</p>
              <p className="text-3xl font-extrabold text-destructive">
                ${(totalMonthly / 100).toFixed(2)}<span className="text-base font-medium text-muted-foreground">/mo</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                That's an estimated ${(totalAnnual / 100).toFixed(2)}/year on subscriptions
              </p>
            </CardContent>
          </Card>
        )}

        {/* Add Subscription */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="text-sm font-bold text-foreground">Add a subscription</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Netflix, Spotify..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 rounded-xl"
              />
              <div className="relative w-24">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  placeholder="15.99"
                  value={newCost}
                  onChange={(e) => setNewCost(e.target.value)}
                  className="pl-7 rounded-xl"
                  type="number"
                  step="0.01"
                />
              </div>
              <Button
                size="icon"
                onClick={handleAdd}
                disabled={!newName.trim() || !newCost || addMutation.isPending || !profileId}
                className="rounded-xl bg-primary"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Monthly cost. Grace will help figure out which ones are vampires.</p>
          </CardContent>
        </Card>

        {/* Audit Button */}
        {activeSubs.length >= 1 && (
          <Button
            className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold rounded-xl h-12"
            onClick={() => profileId && auditMutation.mutate({ profileId })}
            disabled={auditMutation.isPending}
          >
            {auditMutation.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Grace is hunting vampires...</>
            ) : (
              <><Skull className="w-4 h-4 mr-2" /> Hunt for Vampires</>
            )}
          </Button>
        )}

        {/* Active Subscriptions */}
        {activeSubs.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-foreground">Your subscriptions</h3>
            <AnimatePresence>
              {activeSubs.map((sub) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                >
                  <Card className={cn(
                    "transition-colors",
                    sub.isVampire ? "border-destructive/40 bg-destructive/5" : ""
                  )}>
                    <CardContent className="flex items-center gap-3 py-3 px-4">
                      {sub.isVampire ? (
                        <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-muted shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{sub.name}</p>
                        {sub.isVampire && sub.vampireReason && (
                          <p className="text-xs text-destructive mt-0.5">{sub.vampireReason}</p>
                        )}
                      </div>
                      <p className="text-sm font-bold text-foreground mr-2">
                        ${(sub.monthlyCost / 100).toFixed(2)}/mo
                      </p>
                      {sub.isVampire && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="rounded-lg h-8 text-xs"
                          onClick={() => profileId && cancelMutation.mutate({ subscriptionId: sub.id, profileId })}
                          disabled={cancelMutation.isPending}
                        >
                          <Trash2 className="w-3 h-3 mr-1" /> Slay
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Cancelled (Slayed) */}
        {cancelledSubs.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-grace flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Vampires Slayed
            </h3>
            {cancelledSubs.map((sub) => (
              <Card key={sub.id} className="opacity-60">
                <CardContent className="flex items-center gap-3 py-2 px-4">
                  <Skull className="w-4 h-4 text-muted-foreground shrink-0" />
                  <p className="text-sm text-muted-foreground line-through flex-1">{sub.name}</p>
                  <p className="text-sm text-grace font-medium">
                    +${((sub.annualCost || sub.monthlyCost * 12) / 100).toFixed(2)}/yr saved
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!profileId && (
          <Card>
            <CardContent className="text-center py-8">
              <Shield className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Chat with Grace first — she'll help you hunt those vampires.
              </p>
              <button onClick={() => navigate("/grace")} className="text-sm font-medium text-grace hover:underline">
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
