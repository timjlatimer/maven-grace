import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Coins, Gift, Heart, BookOpen, Users, Handshake, Star } from "lucide-react";

const CATEGORIES = [
  { value: "teaching", label: "Teaching / Tutoring", icon: BookOpen, credits: "15-20/hr" },
  { value: "helping", label: "Helping a Neighbor", icon: Heart, credits: "10-15/hr" },
  { value: "mentoring", label: "Mentoring", icon: Star, credits: "15-20/hr" },
  { value: "volunteering", label: "Volunteering", icon: Users, credits: "10-15/hr" },
  { value: "barter", label: "Skill Exchange / Barter", icon: Handshake, credits: "10-15/hr" },
  { value: "referral", label: "Referring a Friend", icon: Gift, credits: "20 flat" },
] as const;

export default function CommunityCredits() {
  const [, navigate] = useLocation();
  const { profileId } = useGraceSession();
  const [category, setCategory] = useState<string>("");
  const [hours, setHours] = useState("1");
  const [description, setDescription] = useState("");
  const [redeemAmount, setRedeemAmount] = useState("");

  const { data: account, refetch } = trpc.communityCredits.get.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );
  const { data: log } = trpc.communityCredits.getLog.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const earnMut = trpc.communityCredits.earn.useMutation({
    onSuccess: (data) => {
      toast.success(`Big Mama approved! +${hours} hour${Number(hours) > 1 ? "s" : ""} of community love. Balance: ${data.balance} credits.`);
      refetch();
      setCategory("");
      setHours("1");
      setDescription("");
    },
  });

  const redeemMut = trpc.communityCredits.redeem.useMutation({
    onSuccess: (data: any) => {
      if (data.success) {
        toast.success(`Redeemed! $${(data.dollarValue || 0).toFixed(2)} applied toward your subscription. Grace's juice is charging up!`);
        refetch();
        setRedeemAmount("");
      } else {
        toast.error(data.message || "Not enough credits");
      }
    },
  });

  const handleEarn = () => {
    if (!profileId || !category) return;
    const baseCredits = category === "referral" ? 20 : Math.round(Number(hours) * 12.5);
    earnMut.mutate({
      profileId,
      amount: baseCredits,
      category: category as any,
      description: description || undefined,
    });
  };

  const handleRedeem = () => {
    if (!profileId || !redeemAmount) return;
    redeemMut.mutate({ profileId, amount: Number(redeemAmount) });
  };

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container max-w-lg py-6">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full text-xs font-medium mb-2">
            <Coins className="w-3 h-3" /> Big Mama's Community Credits
          </div>
          <h1 className="text-2xl font-bold">Community Credits</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Earn credits through community actions. Redeem at 50% toward your subscription.
          </p>
          <p className="text-xs text-amber-700/70 dark:text-amber-300/70 mt-2 italic">
            Big Mama is the heart of our community. She keeps track of what you give and makes sure it comes back to you.
          </p>
        </div>

        {/* Balance Card */}
        <Card className="mb-6 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6 text-center">
            <div className="text-5xl font-bold text-amber-600">{account?.balance || 0}</div>
            <div className="text-sm text-muted-foreground mt-1">credits available</div>
            <div className="text-xs text-muted-foreground mt-2">
              Lifetime earned: {account?.totalEarned || 0} · Redeemed: {account?.totalRedeemed || 0}
            </div>
            {(account?.balance || 0) > 0 && (
              <div className="text-xs text-amber-600 mt-1">
                Worth ${((account?.balance || 0) * 0.005).toFixed(2)} toward subscription (50% rate)
              </div>
            )}
          </CardContent>
        </Card>

        {/* Earn Credits */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" /> Log Community Contribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="What did you do?" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    <span className="flex items-center gap-2">
                      <c.icon className="w-3 h-3" /> {c.label} ({c.credits})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {category && category !== "referral" && (
              <div>
                <label className="text-xs text-muted-foreground">Hours contributed</label>
                <Input type="number" min="0.5" max="8" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} />
              </div>
            )}

            <Input placeholder="Brief description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />

            <Button onClick={handleEarn} disabled={!category || earnMut.isPending} className="w-full bg-amber-600 hover:bg-amber-700">
              {earnMut.isPending ? "Submitting..." : "Submit to Big Mama"}
            </Button>
          </CardContent>
        </Card>

        {/* Redeem Credits */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-500" /> Redeem Credits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Every 100 credits = $0.50 off your subscription. Charges Grace's battery!
            </p>
            <div className="flex gap-2">
              <Input type="number" min="1" max={account?.balance || 0} placeholder="Credits to redeem" value={redeemAmount} onChange={(e) => setRedeemAmount(e.target.value)} />
              <Button onClick={handleRedeem} disabled={!redeemAmount || redeemMut.isPending} variant="outline">
                Redeem
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity Log */}
        {log && log.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {log.map((entry: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-sm py-2 border-b last:border-0">
                    <div>
                      <div className="font-medium capitalize">{entry.category?.replace("_", " ")}</div>
                      {entry.description && <div className="text-xs text-muted-foreground">{entry.description}</div>}
                    </div>
                    <div className={`font-mono text-sm ${entry.type === "earn" ? "text-green-600" : "text-amber-600"}`}>
                      {entry.type === "earn" ? "+" : "-"}{entry.amount}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
