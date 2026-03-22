import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, Package, Sparkles, Heart, Truck, ArrowRight, CreditCard, Loader2 } from "lucide-react";
import { Link } from "wouter";

const TIERS = [
  {
    id: "observer" as const,
    name: "Get Started Free",
    tagline: "Meet Grace, no strings attached",
    weeklyPrice: null,
    monthlyPrice: null,
    color: "bg-gray-50 border-gray-200",
    badge: "Free",
    badgeColor: "bg-gray-100 text-gray-700",
    features: [
      "Chat with Grace",
      "Financial Impact Dashboard",
      "Vampire Slayer (limited)",
      "90-Day Journey Tracker",
    ],
    cta: "Start Free",
    icon: Heart,
  },
  {
    id: "essentials" as const,
    name: "Maven Essentials",
    tagline: "We give a shit. Literally.",
    weeklyPrice: 5.99,
    monthlyPrice: 23.96,
    color: "bg-teal-50 border-teal-300 ring-2 ring-teal-400",
    badge: "Most Popular",
    badgeColor: "bg-teal-500 text-white",
    features: [
      "Everything in Get Started Free",
      "Maven Essentials Box every 2-3 weeks",
      "Toilet paper + household essentials delivered",
      "Full Vampire Slayer",
      "Budget Builder",
      "Bill Tracker + NSF Fee Fighter",
      "Milk Money emergency fund access",
      "Grace always-on voice companion",
    ],
    cta: "Join Essentials",
    icon: Package,
    highlight: true,
  },
  {
    id: "plus" as const,
    name: "Maven Plus",
    tagline: "The full village",
    weeklyPrice: 10.99,
    monthlyPrice: 43.96,
    color: "bg-purple-50 border-purple-300",
    badge: "Full Power",
    badgeColor: "bg-purple-500 text-white",
    features: [
      "Everything in Essentials",
      "Premium Maven Box (bigger, better)",
      "Wisdom Giants coaching sessions",
      "Debt Snowball planner",
      "Dignity Score tracking",
      "Neighbor Economy barter network",
      "Priority Grace response",
      "Monthly financial health report",
    ],
    cta: "Join Plus",
    icon: Sparkles,
  },
];

export default function Membership() {
  const { profileId } = useGraceSession();
  const [selectedTier, setSelectedTier] = useState<"observer" | "essentials" | "plus" | null>(null);
  const [joining, setJoining] = useState(false);

  const { data: membership, refetch } = trpc.membership.get.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const { data: productInfo } = trpc.membership.getProducts.useQuery();

  const upsertMembership = trpc.membership.upsert.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Welcome to Maven! Grace is so happy you're here.");
      setJoining(false);
    },
    onError: () => {
      toast.error("Something went wrong. Try again?");
      setJoining(false);
    },
  });

  const createCheckout = trpc.membership.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else if (!data.configured) {
        // Stripe not configured — fall back to free activation
        toast.info("Payment processing is being finalized. We'll activate your membership now and bill you when it's ready. No surprises.", { duration: 6000 });
        if (profileId && selectedTier && selectedTier !== "observer") {
          upsertMembership.mutate({ profileId, tier: selectedTier });
        }
      } else {
        toast.error(data.message || "Something went wrong. Try again?");
        setJoining(false);
      }
    },
    onError: (err) => {
      toast.error(err.message || "Checkout failed. Try again?");
      setJoining(false);
    },
  });

  const handleJoin = async (tier: "observer" | "essentials" | "plus") => {
    if (!profileId) {
      toast.error("Start a conversation with Grace first!");
      return;
    }

    setJoining(true);
    setSelectedTier(tier);

    if (tier === "observer") {
      // Free tier — just activate
      await upsertMembership.mutateAsync({ profileId, tier });
      return;
    }

    // Paid tier — try Stripe checkout
    createCheckout.mutate({
      profileId,
      tier,
      origin: window.location.origin,
    });
  };

  const currentTier = membership?.tier;
  const stripeReady = productInfo?.stripeConfigured ?? false;

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white px-4 pt-12 pb-8">
        <div className="max-w-lg mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Truck className="w-6 h-6" />
            <span className="text-teal-200 font-semibold text-sm uppercase tracking-wide">Maven Membership</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">We Give a Shit.</h1>
          <p className="text-teal-100 text-lg">Literally. Your first toilet paper delivery is on us.</p>
          <p className="text-teal-200 text-sm mt-2">
            Maven is a membership that delivers household essentials to your door — and a financial companion who actually gives a damn.
          </p>
        </div>
      </div>

      {/* Current membership banner */}
      {currentTier && currentTier !== "observer" && (
        <div className="max-w-lg mx-auto px-4 mt-4">
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-teal-800">
                You're a Maven {currentTier === "essentials" ? "Essentials" : "Plus"} member!
              </p>
              <p className="text-teal-600 text-sm">Your next box is on its way. Grace is always here.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tier cards */}
      <div className="max-w-lg mx-auto px-4 mt-6 space-y-4">
        {TIERS.map((tier) => {
          const Icon = tier.icon;
          const isCurrent = currentTier === tier.id;
          const isProcessing = joining && selectedTier === tier.id;
          return (
            <Card key={tier.id} className={`p-5 border-2 ${tier.color} ${tier.highlight ? "shadow-lg" : ""}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${tier.highlight ? "bg-teal-100" : "bg-gray-100"}`}>
                    <Icon className={`w-5 h-5 ${tier.highlight ? "text-teal-600" : "text-gray-600"}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{tier.name}</h3>
                    <p className="text-gray-500 text-sm">{tier.tagline}</p>
                  </div>
                </div>
                <Badge className={tier.badgeColor}>{tier.badge}</Badge>
              </div>

              {/* Price */}
              <div className="mb-4">
                {tier.weeklyPrice ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">${tier.weeklyPrice}</span>
                    <span className="text-gray-500 text-sm">/week CAD</span>
                    <span className="text-gray-400 text-xs ml-2">(~${tier.monthlyPrice}/mo)</span>
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-gray-900">Free</div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isCurrent ? (
                <div className="flex items-center gap-2 text-teal-700 font-semibold">
                  <CheckCircle className="w-5 h-5" />
                  Your current plan
                </div>
              ) : (
                <Button
                  className={`w-full ${tier.highlight ? "bg-teal-600 hover:bg-teal-700 text-white" : "bg-gray-800 hover:bg-gray-900 text-white"}`}
                  onClick={() => handleJoin(tier.id)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      {tier.weeklyPrice && stripeReady && <CreditCard className="w-4 h-4 mr-2" />}
                      {tier.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}

              {/* Stripe badge for paid tiers */}
              {tier.weeklyPrice && (
                <p className="text-xs text-gray-400 mt-2 text-center flex items-center justify-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  {stripeReady ? "Secure payment via Stripe" : "Payment processing being finalized"}
                </p>
              )}
            </Card>
          );
        })}
      </div>

      {/* What's in the box */}
      <div className="max-w-lg mx-auto px-4 mt-8">
        <Card className="p-5 bg-amber-50 border-amber-200">
          <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
            <Package className="w-5 h-5" />
            What's in the Maven Essentials Box?
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-amber-800">
            {["Toilet paper (2-4 rolls)", "Paper towels", "Dish soap", "Laundry pods (4-6)", "Hand soap", "Seasonal surprise item"].map(item => (
              <div key={item} className="flex items-center gap-1">
                <span className="text-amber-500">✓</span> {item}
              </div>
            ))}
          </div>
          <p className="text-amber-600 text-xs mt-3">Delivered every 2-3 weeks. No subscription traps. Cancel anytime. All prices in CAD.</p>
        </Card>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-lg mx-auto px-4 mt-6 text-center">
        <p className="text-gray-500 text-sm">Already a member? <Link href="/grace" className="text-teal-600 font-semibold">Chat with Grace</Link></p>
      </div>
    </div>
  );
}
