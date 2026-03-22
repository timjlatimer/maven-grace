import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Check, X, Heart, ArrowRight, ArrowLeft as ArrowIn, Sparkles, Clock, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const CATEGORY_COLORS: Record<string, string> = {
  payment: "bg-blue-100 text-blue-700",
  personal: "bg-purple-100 text-purple-700",
  family: "bg-pink-100 text-pink-700",
  health: "bg-green-100 text-green-700",
  career: "bg-amber-100 text-amber-700",
  education: "bg-indigo-100 text-indigo-700",
  general: "bg-gray-100 text-gray-700",
};

type TabType = "active" | "completed" | "all";

export default function PromisesKeep() {
  const [, navigate] = useLocation();
  const { profileId } = useGraceSession();
  const [tab, setTab] = useState<TabType>("active");
  const [showAdd, setShowAdd] = useState(false);
  const [newPromise, setNewPromise] = useState("");
  const [newDirection, setNewDirection] = useState<"made_by_ruby" | "made_to_ruby">("made_by_ruby");

  const { data: allPromises, refetch } = trpc.promises.list.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const { data: stats } = trpc.promises.stats.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const createMut = trpc.promises.create.useMutation({
    onSuccess: () => {
      refetch();
      setNewPromise("");
      setShowAdd(false);
      toast.success("Promise tracked!");
    },
  });

  const updateMut = trpc.promises.update.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Promise updated!");
    },
  });

  const filtered = useMemo(() => {
    if (!allPromises) return [];
    if (tab === "active") return allPromises.filter((p: any) => p.status === "active");
    if (tab === "completed") return allPromises.filter((p: any) => p.status === "completed");
    return allPromises;
  }, [allPromises, tab]);

  const keepRate = stats ? (stats.completed + stats.active > 0
    ? Math.round((stats.completed / (stats.completed + stats.broken)) * 100) || 100
    : 100) : 100;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-card/80 backdrop-blur-sm">
        <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Promises to Keep</h1>
        {profileId && <span className="text-xs text-muted-foreground ml-auto">Nana the Promise Keeper</span>}
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-3 text-center">
              <p className="text-2xl font-extrabold text-primary">{stats?.active || 0}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Active</p>
            </CardContent>
          </Card>
          <Card className="bg-lift/5 border-lift/20">
            <CardContent className="py-3 text-center">
              <p className="text-2xl font-extrabold text-lift">{stats?.completed || 0}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Kept</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-primary/5 to-lift/5">
            <CardContent className="py-3 text-center">
              <p className="text-2xl font-extrabold text-foreground">{keepRate}%</p>
              <p className="text-[10px] text-muted-foreground font-medium">Keep Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(["active", "completed", "all"] as TabType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                tab === t ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Add Promise */}
        <AnimatePresence>
          {showAdd ? (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <Card>
                <CardContent className="py-4 space-y-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setNewDirection("made_by_ruby")}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                        newDirection === "made_by_ruby" ? "bg-primary/10 text-primary border border-primary/30" : "bg-muted/30 text-muted-foreground"
                      }`}
                    >
                      <ArrowRight className="w-3 h-3 inline mr-1" />
                      I promised
                    </button>
                    <button
                      onClick={() => setNewDirection("made_to_ruby")}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                        newDirection === "made_to_ruby" ? "bg-lift/10 text-lift border border-lift/30" : "bg-muted/30 text-muted-foreground"
                      }`}
                    >
                      <ArrowIn className="w-3 h-3 inline mr-1" />
                      Promised to me
                    </button>
                  </div>
                  <Input
                    placeholder="What's the promise?"
                    value={newPromise}
                    onChange={(e) => setNewPromise(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newPromise.trim() && profileId) {
                        createMut.mutate({ profileId, direction: newDirection, description: newPromise.trim() });
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => profileId && newPromise.trim() && createMut.mutate({ profileId, direction: newDirection, description: newPromise.trim() })}
                      disabled={!newPromise.trim() || createMut.isPending}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Track Promise
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Button variant="outline" className="w-full" onClick={() => setShowAdd(true)}>
              <Plus className="w-4 h-4 mr-2" /> Add a Promise
            </Button>
          )}
        </AnimatePresence>

        {/* Promise List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <Heart className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  {tab === "active" ? "No active promises. Grace will help you track them as you talk." : "No promises yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <AnimatePresence>
              {filtered.map((promise: any) => (
                <motion.div
                  key={promise.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  layout
                >
                  <Card className={`transition-all ${promise.status === "completed" ? "opacity-70" : ""}`}>
                    <CardContent className="py-3">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          promise.direction === "made_by_ruby" ? "bg-primary/10" : "bg-lift/10"
                        }`}>
                          {promise.direction === "made_by_ruby"
                            ? <ArrowRight className="w-4 h-4 text-primary" />
                            : <ArrowIn className="w-4 h-4 text-lift" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${promise.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                            {promise.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[promise.category] || CATEGORY_COLORS.general}`}>
                              {promise.category}
                            </span>
                            {promise.commitmentScore >= 70 && (
                              <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5">
                                <Sparkles className="w-3 h-3" /> Strong
                              </span>
                            )}
                            {promise.dueDate && (
                              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                <Clock className="w-3 h-3" />
                                {new Date(promise.dueDate).toLocaleDateString()}
                              </span>
                            )}
                            {promise.status === "broken" && (
                              <span className="text-[10px] text-destructive flex items-center gap-0.5">
                                <AlertTriangle className="w-3 h-3" /> Broken
                              </span>
                            )}
                          </div>
                        </div>
                        {promise.status === "active" && (
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => updateMut.mutate({ id: promise.id, status: "completed" })}
                              className="w-8 h-8 rounded-full bg-lift/10 hover:bg-lift/20 flex items-center justify-center transition-all"
                            >
                              <Check className="w-4 h-4 text-lift" />
                            </button>
                            <button
                              onClick={() => updateMut.mutate({ id: promise.id, status: "broken" })}
                              className="w-8 h-8 rounded-full bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center transition-all"
                            >
                              <X className="w-4 h-4 text-destructive" />
                            </button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Spirit Check */}
        <Card className="border-warmth/30 bg-warmth/5">
          <CardContent className="py-4 text-center">
            <p className="text-sm text-foreground/80 italic">
              "I never forget a promise. Not to nag — but because every promise kept is a brick
              in the foundation of the life you're building."
            </p>
            <p className="text-xs text-muted-foreground mt-2">— Nana the Promise Keeper</p>
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
}
