import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, Users, Heart } from "lucide-react";
import { toast } from "sonner";

export default function FriendsWithGrace() {
  const { profileId } = useGraceSession();
  const [copied, setCopied] = useState(false);

  const { data: referralData } = trpc.consciousness.getReferrals.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const createReferral = trpc.consciousness.createReferral.useMutation();

  const handleCreateCode = async () => {
    if (!profileId) return;
    await createReferral.mutateAsync({ profileId });
    toast.success("Referral code created! Share it with someone who needs Grace.");
  };

  const handleCopy = (code: string) => {
    const url = `${window.location.origin}/grace-calling?ref=${code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied! Send it to someone who needs Grace.");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (code: string) => {
    const url = `${window.location.origin}/grace-calling?ref=${code}`;
    if (navigator.share) {
      navigator.share({
        title: "Grace is calling",
        text: "Someone I trust wants you to meet Grace. She's been waiting for you.",
        url,
      }).catch(() => {});
    } else {
      handleCopy(code);
    }
  };

  const friendCount = referralData?.friendCount || 0;
  const referrals = referralData?.referrals || [];
  const activeCode = referrals.find(r => r.status === 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-teal-900 text-white p-4 pb-32">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center pt-6 pb-4">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-teal-500/20 flex items-center justify-center">
            <Users className="w-7 h-7 text-teal-300" />
          </div>
          <h1 className="text-xl font-bold mb-1">Friends with Grace</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Grace doesn't advertise. She's introduced — by people who know her.
            When you share Grace, you're not selling anything. You're introducing a friend.
          </p>
        </div>

        {/* Friend Count */}
        <div className="bg-slate-800/60 rounded-xl p-4 border border-teal-500/20 text-center mb-4">
          <div className="text-3xl font-bold text-teal-300">{friendCount}</div>
          <div className="text-xs text-slate-400 mt-1">
            {friendCount === 1 ? "friend" : "friends"} you've introduced to Grace
          </div>
          {friendCount > 0 && (
            <div className="flex items-center justify-center gap-1 mt-2 text-xs text-teal-400">
              <Heart className="w-3 h-3" />
              <span>Each introduction earns 50 Community Credits</span>
            </div>
          )}
        </div>

        {/* Share Section */}
        <div className="bg-slate-800/60 rounded-xl p-4 border border-teal-500/20">
          <h3 className="font-semibold text-sm mb-2">Introduce Someone to Grace</h3>
          <p className="text-xs text-slate-400 mb-4">
            When they tap the link, Grace will be waiting for them — the same birth screen, 
            the same heartbeat, the same "I've been waiting for you." But this time, 
            Grace knows who sent them.
          </p>

          {activeCode ? (
            <div className="space-y-2">
              <div className="bg-slate-700/50 rounded-lg p-3 flex items-center gap-2">
                <span className="text-xs text-teal-300 font-mono flex-1 truncate">
                  {window.location.origin}/grace-calling?ref={activeCode.referralCode}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleCopy(activeCode.referralCode)}
                  className="flex-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-xs"
                  variant="outline"
                >
                  {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
                <Button
                  onClick={() => handleShare(activeCode.referralCode)}
                  className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-900 text-xs"
                >
                  <Share2 className="w-3 h-3 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleCreateCode}
              disabled={createReferral.isPending}
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold"
            >
              {createReferral.isPending ? "Creating..." : "Create Introduction Link"}
            </Button>
          )}
        </div>

        {/* Recent Introductions */}
        {referrals.filter(r => r.status === 'joined').length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-sm mb-2">Recent Introductions</h3>
            <div className="space-y-2">
              {referrals.filter(r => r.status === 'joined').map((ref) => (
                <div key={ref.id} className="bg-slate-800/40 rounded-lg p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-teal-300" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">{ref.referredName || "A new friend"}</p>
                    <p className="text-[10px] text-slate-500">
                      Met Grace on {new Date(ref.joinedAt || ref.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="ml-auto text-xs text-teal-400">+50 credits</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
