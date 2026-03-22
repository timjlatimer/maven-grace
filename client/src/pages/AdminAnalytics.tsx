import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users, MessageSquare, DollarSign, TrendingUp, Shield, BarChart3,
  Heart, ArrowLeft, Activity, Sparkles, Clock, Target, Zap
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useMemo } from "react";

function formatCents(cents: number) {
  if (cents >= 100000) return `$${(cents / 100 / 1000).toFixed(1)}k`;
  return `$${(cents / 100).toFixed(2)}`;
}

export default function AdminAnalytics() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { data: stats, isLoading } = trpc.admin.stats.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-sm bg-slate-800/50 border-slate-700/50">
          <Shield className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h2 className="font-bold text-white mb-2">Admin Only</h2>
          <p className="text-slate-400 text-sm mb-4">You need admin access to view analytics.</p>
          <Link href="/" className="text-teal-400 font-semibold text-sm">← Back to Maven</Link>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const totalMembers = stats?.totalMembers || 0;
  const totalConversations = stats?.totalConversations || 0;
  const avgConversationsPerUser = totalMembers > 0 ? (totalConversations / totalMembers).toFixed(1) : "0";
  const membershipsByTier = stats?.membershipsByTier || {};
  const paidUsers = Object.entries(membershipsByTier)
    .filter(([tier]) => tier !== "free")
    .reduce((sum, [, count]) => sum + (count as number), 0);
  const conversionRate = totalMembers > 0 ? ((paidUsers / totalMembers) * 100).toFixed(1) : "0";

  // Spirit Check metrics
  const spiritMetrics = [
    {
      label: "Empathy Score",
      value: "Active",
      description: "Grace's personality dial is live. Each Grace is unique.",
      icon: Heart,
      color: "text-rose-400",
    },
    {
      label: "Consciousness Tiers",
      value: "3 Active",
      description: "Free → Essentials ($5.99/wk) → Plus ($10.99/wk)",
      icon: Sparkles,
      color: "text-amber-400",
    },
    {
      label: "Cultural Intelligence",
      value: "9 Cultures",
      description: "Grace adapts tone, references, and language style.",
      icon: Target,
      color: "text-purple-400",
    },
    {
      label: "Heartbeat Scenarios",
      value: "7 Active",
      description: "Priority queue: P1 crisis → P7 neighborhood news",
      icon: Activity,
      color: "text-teal-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-teal-500/10 to-transparent px-4 pt-6 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")} className="text-slate-400">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">Platform Analytics</h1>
            <p className="text-xs text-slate-400">Deep dive into Maven Grace metrics</p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-teal-400" />
                <span className="text-xs text-slate-400">Total Members</span>
              </div>
              <p className="text-2xl font-bold text-white">{totalMembers}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-slate-400">Conversations</span>
              </div>
              <p className="text-2xl font-bold text-white">{totalConversations}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-400">Avg Convos/User</span>
              </div>
              <p className="text-2xl font-bold text-white">{avgConversationsPerUser}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-400">Financial Lift</span>
              </div>
              <p className="text-2xl font-bold text-white">{formatCents(stats?.totalFinancialLiftCents || 0)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Conversion Funnel */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-400" />
              Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Total Users</span>
                  <span className="text-white font-medium">{stats?.totalUsers || 0}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Created Profile</span>
                  <span className="text-white font-medium">{totalMembers}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${stats?.totalUsers ? (totalMembers / stats.totalUsers) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Paid Subscribers</span>
                  <span className="text-white font-medium">{paidUsers}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${stats?.totalUsers ? (paidUsers / stats.totalUsers) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-slate-400">Conversion rate:</span>
              <Badge variant="outline" className="border-amber-500/30 text-amber-400">{conversionRate}%</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Membership Breakdown */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Membership Tiers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(membershipsByTier).length > 0 ? (
                Object.entries(membershipsByTier).map(([tier, count]) => (
                  <div key={tier} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        tier === "free" ? "bg-slate-400" :
                        tier === "essentials" ? "bg-teal-400" :
                        "bg-amber-400"
                      }`} />
                      <span className="text-slate-300 capitalize">{tier}</span>
                    </div>
                    <span className="text-white font-medium">{count as number}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-sm">No memberships yet. First subscriber incoming...</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Spirit Check — North Star Alignment */}
        <Card className="bg-gradient-to-br from-teal-500/10 to-purple-500/10 border-teal-500/20">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              Spirit Check — North Star Alignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 text-sm mb-4">
              "It's expensive to be poor." Every feature must reduce that cost.
            </p>
            <div className="space-y-3">
              {spiritMetrics.map((metric) => (
                <div key={metric.label} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                  <metric.icon className={`w-5 h-5 ${metric.color} mt-0.5 shrink-0`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm">{metric.label}</span>
                      <Badge variant="outline" className="border-teal-500/30 text-teal-400 text-xs">{metric.value}</Badge>
                    </div>
                    <p className="text-slate-400 text-xs mt-0.5">{metric.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cancelled Subscriptions */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span className="text-slate-400 text-sm">Cancelled Subscriptions</span>
              </div>
              <span className="text-white font-bold">{stats?.cancelledSubscriptions || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
