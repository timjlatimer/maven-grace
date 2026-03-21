import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Heart, Gift, Music, Shield, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useGraceSession } from "@/hooks/useGraceSession";
import { motion } from "framer-motion";

export default function Home() {
  const [, navigate] = useLocation();
  const { profileId } = useGraceSession();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero — Warm, inviting, gamified top 25% */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/30 to-warmth/20 px-4 pt-12 pb-10">
        <div className="absolute top-4 right-4 opacity-20">
          <Heart className="w-24 h-24 text-primary" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-grace/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-grace" />
            </div>
            <span className="text-sm font-semibold text-grace">Maven Grace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground leading-tight mb-3">
            Hey there, neighbor.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            I'm Grace — and I've got something for you. No forms. No catch. Just a little help from someone who gets it.
          </p>
          <Button
            size="lg"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base rounded-xl h-14 px-8 shadow-lg"
            onClick={() => navigate("/grace")}
          >
            <Gift className="w-5 h-5 mr-2" />
            Get Your Free Gift
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Seriously. Free toilet paper delivered to your door. That's it.
          </p>
        </motion.div>
      </div>

      {/* What Maven Grace Does — Feature Cards */}
      <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
        <h2 className="text-lg font-bold text-foreground">How Grace helps</h2>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-grace/20 hover:border-grace/40 transition-colors cursor-pointer" onClick={() => navigate("/grace")}>
            <CardContent className="flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-xl bg-grace/10 flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5 text-grace" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Free Essentials Delivered</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Toilet paper, right to your door. Every 2-3 weeks. Because you shouldn't have to choose between essentials.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer" onClick={() => navigate("/song")}>
            <CardContent className="flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Music className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Your Personal Anthem</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Grace writes a song just for you. About your strength, your story, your life. It's yours.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-destructive/20 hover:border-destructive/40 transition-colors cursor-pointer" onClick={() => navigate("/vampire-slayer")}>
            <CardContent className="flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Vampire Slayer</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Those subscriptions draining your wallet? Grace finds them and helps you stake them. Dead.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-lift/20 hover:border-lift/40 transition-colors cursor-pointer" onClick={() => navigate("/dashboard")}>
            <CardContent className="flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-xl bg-lift/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-lift" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Your Financial Lift</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  See exactly how much better off you are. Every dollar saved, every vampire slayed, all in one place.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trust statement */}
        <div className="text-center pt-4 pb-2">
          <p className="text-xs text-muted-foreground italic">
            "It's expensive to be poor." — We're trying to change that.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
