import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Milk, Shield, TrendingUp, Lock, CheckCircle, Star,
  ArrowDown, ArrowUp, Clock, AlertTriangle, PartyPopper, ChevronRight,
} from "lucide-react";

const TIERS = [
  { id: "rookie", label: "Rookie", limitCents: 2000, scoreNeeded: 0, color: "text-gray-600", bg: "bg-gray-100", ring: "ring-gray-300", description: "Just getting started. $20 available." },
  { id: "regular", label: "Regular", limitCents: 5000, scoreNeeded: 20, color: "text-teal-600", bg: "bg-teal-100", ring: "ring-teal-300", description: "Proven reliable. $50 available." },
  { id: "trusted", label: "Trusted", limitCents: 10000, scoreNeeded: 50, color: "text-blue-600", bg: "bg-blue-100", ring: "ring-blue-300", description: "Community trusted. $100 available." },
  { id: "elite", label: "Elite", limitCents: 15000, scoreNeeded: 80, color: "text-purple-600", bg: "bg-purple-100", ring: "ring-purple-300", description: "Maven Elite. $150 available." },
];

const QUICK_AMOUNTS = [500, 1000, 1500, 2000]; // cents

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function MilkMoney() {
  const { profileId } = useGraceSession();
  const [borrowAmount, setBorrowAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [borrowReason, setBorrowReason] = useState("");
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [showRepayForm, setShowRepayForm] = useState(false);
  const [tierUpgradeAnimation, setTierUpgradeAnimation] = useState(false);

  const utils = trpc.useUtils();

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
      toast.success("Milk Money account opened! You start with $20 available. 🥛");
    },
  });

  const borrowMutation = trpc.milkMoney.borrow.useMutation({
    onSuccess: (data) => {
      utils.milkMoney.getAccount.invalidate();
      utils.milkMoney.getTransactions.invalidate();
      setShowBorrowForm(false);
      setBorrowAmount(null);
      setCustomAmount("");
      setBorrowReason("");
      const dueStr = new Date(data.dueDate).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
      toast.success(`${formatCents(data.borrowed)} is on its way! Due back by ${dueStr}. No interest. No judgment.`, { duration: 6000 });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const repayMutation = trpc.milkMoney.repay.useMutation({
    onSuccess: (data) => {
      utils.milkMoney.getAccount.invalidate();
      utils.milkMoney.getTransactions.invalidate();
      setShowRepayForm(false);
      if (data.tierUpgraded) {
        setTierUpgradeAnimation(true);
        const tierLabel = TIERS.find(t => t.id === data.tier)?.label || data.tier;
        toast.success(`You just leveled up to ${tierLabel}! Your new limit is ${formatCents(TIERS.find(t => t.id === data.tier)?.limitCents || 0)}. You earned this. 🎉`, { duration: 8000 });
        setTimeout(() => setTierUpgradeAnimation(false), 3000);
      } else {
        toast.success(`Repayment received! Trust score: ${data.trustScore}. ${data.isLate ? "It was a bit late, but you showed up. That matters." : "On time — your trust score just went up!"}`, { duration: 5000 });
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const currentTier = TIERS.find(t => t.id === account?.tier) || TIERS[0];
  const currentTierIndex = TIERS.findIndex(t => t.id === account?.tier);
  const nextTier = currentTierIndex < TIERS.length - 1 ? TIERS[currentTierIndex + 1] : null;
  const available = account ? account.creditLimitCents - account.currentBalanceCents : 0;
  const trustScore = account?.trustScore || 0;

  // Find outstanding borrows (no repaidAt)
  const outstandingBorrows = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(t => t.type === "borrow" && !t.repaidAt);
  }, [transactions]);

  const effectiveAmount = borrowAmount || (customAmount ? Math.round(parseFloat(customAmount) * 100) : 0);
  const availableQuickAmounts = QUICK_AMOUNTS.filter(a => a <= available);

  // Trust score progress to next tier
  const progressToNext = nextTier
    ? Math.min(100, Math.round(((trustScore - currentTier.scoreNeeded) / (nextTier.scoreNeeded - currentTier.scoreNeeded)) * 100))
    : 100;

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
                    <p className={`font-bold text-sm ${tier.color}`}>{formatCents(tier.limitCents)}</p>
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
            {/* ─── ACCOUNT SUMMARY ─── */}
            <Card className={`p-5 border-2 border-teal-200 bg-teal-50 transition-all duration-500 ${tierUpgradeAnimation ? "ring-4 ring-yellow-400 scale-[1.02]" : ""}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Available right now</p>
                  <p className="text-4xl font-bold text-teal-700">{formatCents(available)}</p>
                </div>
                <Badge className={`${currentTier.bg} ${currentTier.color} text-sm px-3 py-1`}>
                  {tierUpgradeAnimation && <PartyPopper className="w-3 h-3 mr-1 inline" />}
                  {currentTier.label}
                </Badge>
              </div>

              {/* Trust Score Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">Trust Score: <strong className="text-teal-700">{trustScore}/100</strong></span>
                  {nextTier && <span className="text-gray-400">Next: {nextTier.label} at {nextTier.scoreNeeded}</span>}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-400 to-teal-600 h-2.5 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, trustScore)}%` }}
                  />
                </div>
                {nextTier && (
                  <p className="text-xs text-gray-400 mt-1">
                    {nextTier.scoreNeeded - trustScore > 0
                      ? `${nextTier.scoreNeeded - trustScore} more points to unlock ${nextTier.label} (${formatCents(nextTier.limitCents)})`
                      : "Ready to level up on next repayment!"}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white rounded-lg p-2">
                  <p className="text-xs text-gray-400">Limit</p>
                  <p className="font-bold text-gray-800">{formatCents(account.creditLimitCents)}</p>
                </div>
                <div className="bg-white rounded-lg p-2">
                  <p className="text-xs text-gray-400">Owed</p>
                  <p className="font-bold text-gray-800">{formatCents(account.currentBalanceCents)}</p>
                </div>
                <div className="bg-white rounded-lg p-2">
                  <p className="text-xs text-gray-400">On-Time</p>
                  <p className="font-bold text-teal-600">{account.onTimeRepayments}</p>
                </div>
              </div>
            </Card>

            {/* ─── ACTION BUTTONS ─── */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                className="bg-teal-600 hover:bg-teal-700 text-white h-14 text-base"
                onClick={() => { setShowBorrowForm(!showBorrowForm); setShowRepayForm(false); }}
                disabled={available <= 0 || !account.isEligible}
              >
                <ArrowDown className="w-4 h-4 mr-2" />
                Borrow
              </Button>
              <Button
                variant="outline"
                className="border-teal-300 text-teal-700 hover:bg-teal-50 h-14 text-base"
                onClick={() => { setShowRepayForm(!showRepayForm); setShowBorrowForm(false); }}
                disabled={account.currentBalanceCents <= 0}
              >
                <ArrowUp className="w-4 h-4 mr-2" />
                Repay
              </Button>
            </div>

            {/* Frozen account warning */}
            {!account.isEligible && (
              <Card className="p-4 bg-rose-50 border-rose-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-rose-800 text-sm">Account Paused</p>
                    <p className="text-rose-600 text-xs">{account.frozenReason || "Your account is temporarily paused. Chat with Grace to sort it out."}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* ─── BORROW FORM ─── */}
            {showBorrowForm && (
              <Card className="p-5 border-2 border-teal-300 bg-white animate-in slide-in-from-top-2">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <ArrowDown className="w-4 h-4 text-teal-600" /> How much do you need?
                </h3>

                {/* Quick amounts */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {availableQuickAmounts.map(amt => (
                    <button
                      key={amt}
                      onClick={() => { setBorrowAmount(amt); setCustomAmount(""); }}
                      className={`rounded-lg p-2 text-center text-sm font-semibold transition-all ${
                        borrowAmount === amt
                          ? "bg-teal-600 text-white ring-2 ring-teal-300"
                          : "bg-gray-100 text-gray-700 hover:bg-teal-50"
                      }`}
                    >
                      {formatCents(amt)}
                    </button>
                  ))}
                </div>

                {/* Custom amount */}
                <div className="mb-3">
                  <label className="text-xs text-gray-500 mb-1 block">Or enter a custom amount (max {formatCents(available)})</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      max={available / 100}
                      placeholder="0.00"
                      value={customAmount}
                      onChange={(e) => { setCustomAmount(e.target.value); setBorrowAmount(null); }}
                      className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-teal-300 focus:border-teal-300 outline-none"
                    />
                  </div>
                </div>

                {/* Reason (optional) */}
                <div className="mb-4">
                  <label className="text-xs text-gray-500 mb-1 block">What's it for? (optional — no judgment)</label>
                  <input
                    type="text"
                    placeholder="Flat tire, groceries, kids' school trip..."
                    value={borrowReason}
                    onChange={(e) => setBorrowReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-teal-300 focus:border-teal-300 outline-none"
                  />
                </div>

                {/* Due date notice */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 bg-gray-50 rounded-lg p-2">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <span>Due back in 14 days. No interest. No fees. Just pay it back when you can.</span>
                </div>

                <Button
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  disabled={!effectiveAmount || effectiveAmount > available || effectiveAmount < 100 || borrowMutation.isPending}
                  onClick={() => {
                    if (effectiveAmount && profileId) {
                      borrowMutation.mutate({
                        profileId,
                        amountCents: effectiveAmount,
                        description: borrowReason || undefined,
                      });
                    }
                  }}
                >
                  {borrowMutation.isPending ? "Processing..." : effectiveAmount ? `Borrow ${formatCents(effectiveAmount)}` : "Select an amount"}
                </Button>
              </Card>
            )}

            {/* ─── REPAY FORM ─── */}
            {showRepayForm && outstandingBorrows.length > 0 && (
              <Card className="p-5 border-2 border-teal-300 bg-white animate-in slide-in-from-top-2">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <ArrowUp className="w-4 h-4 text-teal-600" /> Repay a Borrow
                </h3>
                <div className="space-y-3">
                  {outstandingBorrows.map(tx => {
                    const isOverdue = tx.dueDate && new Date() > new Date(tx.dueDate);
                    return (
                      <div key={tx.id} className={`p-3 rounded-lg border ${isOverdue ? "border-amber-300 bg-amber-50" : "border-gray-200 bg-gray-50"}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-800">{formatCents(tx.amountCents)}</p>
                            {tx.description && <p className="text-xs text-gray-500">{tx.description}</p>}
                          </div>
                          {isOverdue && (
                            <Badge className="bg-amber-100 text-amber-700 text-xs">
                              <AlertTriangle className="w-3 h-3 mr-1 inline" /> Overdue
                            </Badge>
                          )}
                        </div>
                        {tx.dueDate && (
                          <p className="text-xs text-gray-400 mb-2">
                            Due: {new Date(tx.dueDate).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        )}
                        <Button
                          size="sm"
                          className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                          disabled={repayMutation.isPending}
                          onClick={() => {
                            if (profileId) {
                              repayMutation.mutate({
                                profileId,
                                transactionId: tx.id,
                                amountCents: tx.amountCents,
                              });
                            }
                          }}
                        >
                          {repayMutation.isPending ? "Processing..." : `Repay ${formatCents(tx.amountCents)}`}
                        </Button>
                      </div>
                    );
                  })}
                </div>
                {outstandingBorrows.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">No outstanding borrows. You're all clear!</p>
                )}
              </Card>
            )}

            {showRepayForm && outstandingBorrows.length === 0 && (
              <Card className="p-5 border-2 border-teal-300 bg-white">
                <div className="text-center py-4">
                  <CheckCircle className="w-10 h-10 text-teal-400 mx-auto mb-2" />
                  <p className="font-semibold text-gray-800">All Clear!</p>
                  <p className="text-gray-500 text-sm">You don't owe anything right now. Your trust score is {trustScore}.</p>
                </div>
              </Card>
            )}

            {/* ─── TRUST TIER PROGRESSION ─── */}
            <Card className="p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-600" /> Trust Progression
              </h3>

              {/* Visual tier ladder */}
              <div className="space-y-2">
                {TIERS.map((tier, i) => {
                  const isCurrent = tier.id === account.tier;
                  const isPast = currentTierIndex > i;
                  const isFuture = currentTierIndex < i;
                  return (
                    <div
                      key={tier.id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                        isCurrent
                          ? `bg-teal-50 border-2 border-teal-300 ${tierUpgradeAnimation ? "animate-pulse" : ""}`
                          : isPast
                          ? "bg-gray-50 border border-gray-200"
                          : "border border-dashed border-gray-200 opacity-60"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isPast ? "bg-teal-500" : isCurrent ? "bg-teal-500" : "bg-gray-200"
                      }`}>
                        {isPast || isCurrent ? <CheckCircle className="w-5 h-5 text-white" /> : <Lock className="w-4 h-4 text-gray-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-semibold text-sm ${isCurrent ? "text-teal-700" : isPast ? "text-gray-600" : "text-gray-400"}`}>
                            {tier.label}
                          </p>
                          {isCurrent && (
                            <Badge className="bg-teal-100 text-teal-700 text-xs">You are here</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{tier.description}</p>
                        {isFuture && (
                          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                            <ChevronRight className="w-3 h-3" /> Needs trust score {tier.scoreNeeded}+
                          </p>
                        )}
                      </div>
                      <span className={`font-bold text-sm ${isCurrent ? "text-teal-700" : isPast ? "text-gray-500" : "text-gray-300"}`}>
                        {formatCents(tier.limitCents)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Progress to next tier */}
              {nextTier && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500">{currentTier.label}</span>
                    <span className="text-gray-500">{nextTier.label}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-400 to-teal-600 h-3 rounded-full transition-all duration-1000 relative"
                      style={{ width: `${progressToNext}%` }}
                    >
                      {progressToNext > 15 && (
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                          {progressToNext}%
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-center">
                    {progressToNext >= 100
                      ? "Ready to level up on your next on-time repayment!"
                      : `${100 - progressToNext}% to go — each on-time repayment gets you closer`}
                  </p>
                </div>
              )}
            </Card>

            {/* ─── TRANSACTION HISTORY ─── */}
            {transactions && transactions.length > 0 && (
              <Card className="p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">Transaction History</h3>
                <div className="space-y-2">
                  {transactions.slice(0, 10).map(tx => (
                    <div key={tx.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          tx.type === "borrow" ? "bg-rose-100" : tx.type === "repay" ? "bg-teal-100" : "bg-amber-100"
                        }`}>
                          {tx.type === "borrow" ? <ArrowDown className="w-3.5 h-3.5 text-rose-500" /> :
                           tx.type === "repay" ? <ArrowUp className="w-3.5 h-3.5 text-teal-500" /> :
                           <Star className="w-3.5 h-3.5 text-amber-500" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 capitalize">{tx.type.replace("_", " ")}</p>
                          <p className="text-gray-400 text-xs">
                            {tx.description || ""}{tx.isLate ? " (late)" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold ${tx.type === "borrow" ? "text-rose-500" : "text-teal-600"}`}>
                          {tx.type === "borrow" ? "-" : "+"}{formatCents(tx.amountCents)}
                        </span>
                        <p className="text-gray-400 text-xs">
                          {new Date(tx.createdAt).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ─── HOW IT WORKS ─── */}
            <Card className="p-4 bg-amber-50 border-amber-100">
              <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" /> How Milk Money Works
              </h4>
              <ul className="text-amber-700 text-xs space-y-1">
                <li>• Borrow up to your limit when you need it</li>
                <li>• Repay within 14 days — no interest, no fees</li>
                <li>• Every on-time repayment raises your trust score (+10 points)</li>
                <li>• Higher trust score = higher tier = bigger limit</li>
                <li>• Late repayment? It happens. Trust score dips (-15) but you can rebuild</li>
                <li>• <strong>"It's expensive to be poor."</strong> We're changing that.</li>
              </ul>
            </Card>
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
