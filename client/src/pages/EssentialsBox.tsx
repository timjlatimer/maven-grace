import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useGraceSession } from "@/hooks/useGraceSession";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Package, Heart, Sparkles, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function EssentialsBox() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { profileId } = useGraceSession();
  const [address, setAddress] = useState("");
  const [items, setItems] = useState("Toilet paper, paper towels, dish soap");
  const [submitted, setSubmitted] = useState(false);

  const requestBox = trpc.fulfillment.requestBox.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Your box is on its way!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Something went wrong. Try again?");
    },
  });

  const handleSubmit = () => {
    if (!profileId) return;
    if (!address.trim()) {
      toast.error("We need your address to deliver your box!");
      return;
    }
    requestBox.mutate({
      profileId,
      deliveryAddress: address.trim(),
      itemsRequested: items.trim() || "Toilet paper, paper towels, dish soap",
    });
  };

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-background pb-20">
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-card/80 backdrop-blur-sm">
        <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Package className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-bold text-foreground">Get Your Free Box</h1>
      </div>

      <div className="w-full max-w-lg mx-auto px-4 py-6 space-y-5">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle2 className="w-20 h-20 text-primary mx-auto" />
              </motion.div>
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-foreground">Your box is on its way!</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We're packing your essentials right now. You'll get a notification when it ships.
                  In the meantime, Grace would love to chat — she's got some ideas about saving you money.
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <Button onClick={() => navigate("/grace")} className="bg-primary hover:bg-primary/90">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Talk to Grace
                </Button>
                <Button variant="outline" onClick={() => navigate("/")}>
                  Back to Home
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {/* Warm intro */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="py-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-maven-rose" />
                    <span className="font-semibold text-foreground">Maven Essentials Box</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Toilet paper, paper towels, dish soap — the stuff you shouldn't have to stress about.
                    We deliver it to your door every 2-3 weeks. No catch. No judgment. Just a neighbor
                    who gets it.
                  </p>
                </CardContent>
              </Card>

              {!user ? (
                /* Not logged in — show sign up prompt */
                <Card className="border-dashed border-2 border-primary/30">
                  <CardContent className="py-6 text-center space-y-4">
                    <Sparkles className="w-10 h-10 text-primary mx-auto" />
                    <div className="space-y-2">
                      <h3 className="font-bold text-foreground">Sign up to get your free box</h3>
                      <p className="text-sm text-muted-foreground">
                        It takes 30 seconds. Then we'll get your essentials packed and on the way.
                      </p>
                    </div>
                    <Button
                      onClick={() => { window.location.href = getLoginUrl(); }}
                      className="bg-primary hover:bg-primary/90 w-full"
                    >
                      Get Started Free
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                /* Logged in — show the request form */
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Delivery address</label>
                    <Input
                      placeholder="123 Main St, Red Deer, AB"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="bg-card"
                    />
                    <p className="text-xs text-muted-foreground">
                      We deliver within Red Deer and surrounding areas.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">What do you need most?</label>
                    <Input
                      placeholder="Toilet paper, paper towels, dish soap..."
                      value={items}
                      onChange={(e) => setItems(e.target.value)}
                      className="bg-card"
                    />
                    <p className="text-xs text-muted-foreground">
                      Tell us what would help most. We'll do our best to include it.
                    </p>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={requestBox.isPending || !address.trim()}
                    className="w-full bg-primary hover:bg-primary/90 py-6 text-base"
                  >
                    {requestBox.isPending ? (
                      <span className="flex items-center gap-2">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                          <Package className="w-5 h-5" />
                        </motion.div>
                        Packing your box...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Send My Free Box
                      </span>
                    )}
                  </Button>
                </div>
              )}

              {/* What's included */}
              <Card className="bg-card/50">
                <CardContent className="py-4 space-y-3">
                  <h3 className="font-semibold text-sm text-foreground">What's in the box?</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" /> Toilet paper
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" /> Paper towels
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" /> Dish soap
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" /> Hand soap
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" /> Laundry pods
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" /> + more
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    Delivered every 2-3 weeks. Included with any membership tier.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
