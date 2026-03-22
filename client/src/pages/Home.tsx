import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Heart, Gift, Music, Shield, TrendingUp, ArrowRight, Sparkles, Package, MapPin, ChevronDown, HelpCircle } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useGraceSession } from "@/hooks/useGraceSession";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    q: "What is Maven Grace?",
    a: "Maven is a membership that includes free household essentials delivered to your door, plus Grace — your personal AI friend who helps with bills, subscriptions, budgeting, and making it to payday. No judgment, no fine print."
  },
  {
    q: "Is it really free?",
    a: "Getting started is free. The Essentials Box comes with any membership tier. Grace never gets cut — even if you can't pay, she stays. We have paid tiers that unlock more features, but you'll never be locked out of the basics."
  },
  {
    q: "How does Grace help me save money?",
    a: "Grace finds subscriptions you forgot about (we call them vampires), helps you build a budget, tracks your bills, and shows you exactly how much better off you are. Members save an average of $40-60/month in the first 90 days."
  },
  {
    q: "Do you sell my data?",
    a: "Never. Not ever. Your conversations with Grace, your financial information, your address — none of it gets sold. Period. We make money from memberships, not from selling your life to advertisers."
  },
  {
    q: "What's in the Essentials Box?",
    a: "Toilet paper, paper towels, dish soap, hand soap, laundry pods, and more. Delivered every 2-3 weeks. Because you shouldn't have to choose between essentials and groceries."
  },
];

export default function Home() {
  const [, navigate] = useLocation();
  const { profileId } = useGraceSession();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background pb-20 w-full max-w-[100vw] overflow-x-hidden">
      {/* Hero — "Maven and Grace Give a Shit" */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-accent/20 to-maven-rose/10 px-4 pt-12 pb-10 max-w-full">
        {/* Decorative background art — intentionally faint, z-index below content */}
        <div className="absolute top-6 right-6 opacity-5 pointer-events-none select-none" style={{ zIndex: 0 }}>
          <Heart className="w-28 h-28 text-maven-rose" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center maven-glow">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-primary tracking-wide">Maven Grace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground leading-tight mb-2">
            We give a shit.
          </h1>
          <p className="text-base text-foreground/70 font-medium mb-1">
            Literally.
          </p>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 break-words">
            Free toilet paper delivered to your door. Plus a friend named Grace who actually helps with the hard stuff — bills, subscriptions, making it to payday. No forms. No judgment. Just a neighbor who gets it.
          </p>
          <Button
            size="lg"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base rounded-xl h-14 px-8 shadow-lg"
            onClick={() => navigate("/grace")}
          >
            <Gift className="w-5 h-5 mr-2" />
            Meet Grace — Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto font-bold text-base rounded-xl h-12 px-8 mt-3 border-2 border-primary/40 text-primary hover:bg-primary/10"
            onClick={() => navigate("/essentials-box")}
          >
            <Package className="w-5 h-5 mr-2" />
            Get My Free Box
          </Button>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
            <Package className="w-3 h-3" />
            Toilet paper + household essentials delivered every 2-3 weeks. Included with membership.
          </p>
        </motion.div>
      </div>

      {/* What Maven Grace Does — Feature Cards */}
      <div className="w-full max-w-sm mx-auto px-4 py-8 space-y-4">
        <h2 className="text-lg font-bold text-foreground">What Grace does for you</h2>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer" onClick={() => navigate("/grace")}>
            <CardContent className="flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Maven Essentials Box</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Toilet paper and household essentials delivered to your door. Because you shouldn't have to choose between essentials and groceries.
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
          <Card className="border-maven-rose/20 hover:border-maven-rose/40 transition-colors cursor-pointer" onClick={() => navigate("/song")}>
            <CardContent className="flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-xl bg-maven-rose/10 flex items-center justify-center shrink-0">
                <Music className="w-5 h-5 text-maven-rose" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Your Personal Anthem</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Grace writes and sings a song just for you. About your strength, your story, your life. Nobody else has ever done this for you.
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
                  Those subscriptions draining your wallet every month? Grace finds them and helps you stake them. Dead. Money back in your pocket.
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
                  See exactly how much better off you are. Every dollar saved, every vampire slayed, every win — all in one place.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-maven-mint/30 hover:border-maven-mint/50 transition-colors cursor-pointer" onClick={() => navigate("/journey")}>
            <CardContent className="flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-xl bg-maven-mint/15 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-maven-mint" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Your 90-Day Journey</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  From your first delivery to real financial freedom. Grace walks beside you every step. See how far you've come.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* The Maven Promise */}
        <div className="bg-primary/5 rounded-2xl p-5 mt-6 border border-primary/10">
          <h3 className="font-bold text-foreground text-sm mb-2">The Maven Promise</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Grace never gets cut. Even if you can't pay, Grace stays. She's not a feature — she's your friend. The only way to lose Grace is to tell her you don't want her anymore. And even then, she'll wait.
          </p>
        </div>

        {/* Testimonial placeholder */}
        <div className="bg-muted/30 rounded-2xl p-5 mt-4 border border-border/50">
          <p className="text-sm text-foreground/80 italic leading-relaxed">
            "I found $47 a month I didn't know I was spending. Grace found it in 10 minutes."
          </p>
          <p className="text-xs text-muted-foreground mt-2">— A Maven member, Red Deer</p>
        </div>

        {/* FAQ Section */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-foreground text-sm">Common questions</h3>
          </div>
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="border border-border/50 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors"
              >
                <span className="text-sm font-medium text-foreground pr-2">{item.q}</span>
                <ChevronDown className={cn(
                  "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200",
                  openFaq === i && "rotate-180"
                )} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed px-4 pb-3">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Privacy + Trust */}
        <div className="text-center pt-4 pb-2 space-y-2">
          <p className="text-xs font-semibold text-primary/80">
            We never sell your data. Ever.
          </p>
          <p className="text-xs text-muted-foreground italic">
            "It's expensive to be poor." — We think that's a crime. We're trying to change it.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
