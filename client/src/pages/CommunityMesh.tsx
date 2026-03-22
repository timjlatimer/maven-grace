import { motion } from "framer-motion";
import { Users, Heart, MapPin, ArrowLeft, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import BottomNav from "@/components/BottomNav";
import GraceEmptyState from "@/components/GraceEmptyState";
import { useAuth } from "@/_core/hooks/useAuth";

export default function CommunityMesh() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { data: stats } = trpc.consciousness.getCommunityStats.useQuery();
  const { data: referrals } = trpc.consciousness.getReferrals.useQuery(
    { profileId: user?.id ?? 0 },
    { enabled: !!user?.id }
  );

  const totalFriends = referrals?.friendCount ?? 0;
  const totalNeighbors = stats?.neighborCount ?? 0;
  const totalNetwork = totalFriends + totalNeighbors;

  // Generate mesh nodes for visualization
  const nodes = Array.from({ length: Math.min(totalNetwork + 1, 25) }, (_, i) => ({
    id: i,
    x: i === 0 ? 50 : 15 + Math.random() * 70,
    y: i === 0 ? 50 : 15 + Math.random() * 70,
    size: i === 0 ? 12 : 4 + Math.random() * 4,
    isCenter: i === 0,
    delay: i * 0.1,
  }));

  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-teal-500/10 to-transparent px-4 pt-6 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1 as any)} className="text-slate-400">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Your Grace Village</h1>
        </div>
        <p className="text-slate-400 text-sm">The mesh of people Grace connects.</p>
      </div>

      <div className="px-4 space-y-4">
        {/* Network Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-teal-400">{totalFriends}</p>
              <p className="text-xs text-slate-400">Friends with Grace</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-400">{totalNeighbors}</p>
              <p className="text-xs text-slate-400">Neighbors</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-400">{totalNetwork}</p>
              <p className="text-xs text-slate-400">Total Network</p>
            </CardContent>
          </Card>
        </div>

        {/* Mesh Visualization */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Share2 className="w-4 h-4 text-teal-400" />
              Your Village Mesh
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalNetwork === 0 ? (
              <GraceEmptyState page="friends" action={{ label: "Invite a Friend", path: "/friends" }} />
            ) : (
              <div className="relative w-full aspect-square bg-slate-900/50 rounded-xl overflow-hidden">
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full">
                  {nodes.slice(1).map((node) => (
                    <motion.line
                      key={`line-${node.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.15 }}
                      transition={{ delay: node.delay }}
                      x1={`${nodes[0].x}%`}
                      y1={`${nodes[0].y}%`}
                      x2={`${node.x}%`}
                      y2={`${node.y}%`}
                      stroke="rgb(45, 212, 191)"
                      strokeWidth="1"
                    />
                  ))}
                </svg>

                {/* Nodes */}
                {nodes.map((node) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: node.delay, type: "spring" }}
                    className="absolute"
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div
                      className={`rounded-full ${
                        node.isCenter
                          ? "bg-teal-500 ring-4 ring-teal-500/30"
                          : "bg-teal-400/60"
                      }`}
                      style={{
                        width: `${node.size * 2}px`,
                        height: `${node.size * 2}px`,
                      }}
                    />
                    {node.isCenter && (
                      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-teal-300 whitespace-nowrap">
                        You
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grace's Village Quote */}
        <Card className="bg-gradient-to-br from-teal-500/10 to-purple-500/10 border-teal-500/20">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-white font-medium mb-1">Grace says:</p>
                <p className="text-slate-300 text-sm italic leading-relaxed">
                  {totalNetwork === 0
                    ? "\"Every village starts with one person brave enough to say 'I need help.' That's you. Now let's grow this.\""
                    : totalNetwork < 5
                    ? `"Your village has ${totalNetwork} ${totalNetwork === 1 ? 'soul' : 'souls'} now. Each one is someone who chose dignity. I'm proud of what you're building."`
                    : `"Look at this — ${totalNetwork} people connected through you. This is what community looks like. This is what changes the world."`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invite CTA */}
        <Button
          onClick={() => navigate("/friends")}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-6"
        >
          <Heart className="w-4 h-4 mr-2" />
          Invite Someone to Meet Grace
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
