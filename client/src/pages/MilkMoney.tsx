import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Milk, Shield, TrendingUp, Lock, CheckCircle, Star } from "lucide-react";

const TIERS = [
  { id: "rookie", label: "Rookie", limit: 20, color: "text-gray-600", bg: "bg-gray-100", description: "Just getting started. $20 available." },
  { id: "regular", label: "Regular", limit: 50, color: "text-teal-600", bg: "bg-teal-100", description: "Proven reliable. $50 available." },
  { id: "trusted", label: "Trusted", limit: 100, color: "text-blue-600", bg: "bg-blue-100", description: "Community trusted. $100 available." },
  { id: "elite", label: "Elite", limit: 150, color: "text-purple-600", bg: "bg-purple-100", description: "Maven Elite. $150 available." },
];

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function MilkMoney() {
  const { profileId } = useGraceSession();

  const { data: account, refetch } = trpc.milkMoney.getAccount.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const { data: transactions } = trpc.milkMoney.getTransactions.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const openAccount = trpc.milkMoney.openAccount.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Milk Money account opened! You start with $20 available.");
    },
  });

  const currentTier = TIERS.find(t => t.id === account?.tier) || TIERS[0];
  const available = account ? account.creditLimitCents - account.currentBalanceCents : 0;
  const trustScore = account?.trustScore || 0;

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white px-4 pt-12 pb-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Milk className="w-5 h-5 text-teal-200" />
            <span className="text-teal-200 text-sm font-semibold uppercase tracking-wide">Milk Money</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">Emergency Cash. No Bank Required.</h1>
          <p className="text-teal-100 text-sm">When the flat tire hits or the fridge breaks down, Milk Money has your back. No credit check. No judgment.</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4 space-y-4">
        {!account ? (
          /* No account yet */
          <Card className="p-6 text-center border-2 border-teal-200">
            <Milk className="w-12 h-12 text-teal-400 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Open Your Milk Money Account</h3>
            <p className="text-gray-500 text-sm mb-4">
              Start with $20 available. Every on-time repayment builds your trust score and unlocks more. No credit check. No forms. Just trust.
            </p>
            <div className="grid grid-cols-4 gap-2 mb-5">
              {TIERS.map(tier => (
                <div key={tier.id} className="text-center">
                  <div className={`${tier.bg} rounded-lg p-2 mb-1`}>
                    <p className={`font-bold text-sm ${tier.color}`}>${tier.limit}</p>
                  </div>
                  <p className="text-xs text-gray-500">{tier.label}</p>
                </div>
              ))}
            </div>
            <Button
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => profileId && openAccount.mutate({ profileId })}
              disabled={openAccount.isPending || !profileId}
            >
              {openAccount.isPending ? "Opening..." : "Open Milk Money Account"}
            </Button>
            {!profileId && <p className="text-gray-400 text-xs mt-2">Chat with Grace first to get started.</p>}
          </Card>
        ) : (
          <>
            {/* Account summary */}
            <Card className="p-5 border-2 border-teal-200 bg-teal-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Available right now</p>
                  <p className="text-4xl font-bold text-teal-700">{formatCents(available)}</p>
                </div>
                <Badge className={`${currentTier.bg} ${currentTier.color} text-sm px-3 py-1`}>
                  {currentTier.label}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white rounded-lg p-2">
                  <p className="text-xs text-gray-400">Limit</p>
                  <p className="font-bold text-gray-800">{formatCents(account.creditLimitCents)}</p>
                </div>
                <div className="bg-white rounded-lg p-2">
                  <p className="text-xs text-gray-400">Balance</p>
                  <p className="font-bold text-gray-800">{formatCents(account.currentBalanceCents)}</p>
                </div>
                <div className="bg-white rounded-lg p-2">
                  <p className="text-xs text-gray-400">Trust Score</p>
                  <p className="font-bold text-teal-600">{trustScore}</p>
                </div>
              </div>
            </Card>

            {/* Trust tier progress */}
            <Card className="p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-600" /> Trust Tiers
              </h3>
              <div className="space-y-2">
                {TIERS.map((tier, i) => {
                  const isCurrent = tier.id === account.tier;
                  const isPast = TIERS.findIndex(t => t.id === account.tier) > i;
                  return (
                    <div key={tier.id} className={`flex items-center gap-3 p-2 rounded-lg ${isCurrent ? "bg-teal-50 border border-teal-200" : ""}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isPast ? "bg-teal-500" : isCurrent ? "bg-teal-500" : "bg-gray-200"}`}>
                        {isPast || isCurrent ? <CheckCircle className="w-4 h-4 text-white" /> : <Lock className="w-3 h-3 text-gray-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-medium text-sm ${isCurrent ? "text-teal-700" : isPast ? "text-gray-600" : "text-gray-400"}`}>{tier.label}</p>
                          {isCurrent && <Badge className="bg-teal-100 text-teal-700 text-xs">Current</Badge>}
                        </div>
                        <p className="text-xs text-gray-400">{tier.description}</p>
                      </div>
                      <span className={`font-bold text-sm ${isCurrent ? "text-teal-700" : isPast ? "text-gray-500" : "text-gray-300"}`}>${tier.limit}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Transaction history */}
            {transactions && transactions.length > 0 && (
              <Card className="p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">Transaction History</h3>
                <div className="space-y-2">
                  {transactions.slice(0, 5).map(tx => (
                    <div key={tx.id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium text-gray-700 capitalize">{tx.type.replace("_", " ")}</p>
                        {tx.description && <p className="text-gray-400 text-xs">{tx.description}</p>}
                      </div>
                      <span className={`font-bold ${tx.type === "borrow" ? "text-rose-500" : "text-teal-600"}`}>
                        {tx.type === "borrow" ? "-" : "+"}{formatCents(tx.amountCents)}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* How it works */}
            <Card className="p-4 bg-amber-50 border-amber-100">
              <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" /> How Milk Money Works
              </h4>
              <ul className="text-amber-700 text-xs space-y-1">
                <li>• Borrow up to your limit when you need it</li>
                <li>• Repay on your next payday — no interest</li>
                <li>• Every on-time repayment raises your trust score</li>
                <li>• Higher trust score = higher limit</li>
                <li>• It's expensive to be poor. We're changing that.</li>
              </ul>
            </Card>

            {/* Borrow button — coming soon */}
            <Button
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => toast.info("Milk Money borrowing is coming in the next sprint! Your account is ready — you'll be first in line.", { duration: 5000 })}
            >
              <Milk className="w-4 h-4 mr-2" />
              Borrow Money (Coming Soon)
            </Button>
          </>
        )}

        {/* Shield info */}
        <Card className="p-4 bg-teal-50 border-teal-100">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-teal-800 text-sm">No Credit Check. Ever.</p>
              <p className="text-teal-600 text-xs">Milk Money is built on trust, not credit scores. Your history with Maven is what matters. "It's expensive to be poor." We're fixing that.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
