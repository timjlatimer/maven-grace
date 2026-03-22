import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Music, MessageSquare, DollarSign, Package, TrendingUp, Shield, BarChart3 } from "lucide-react";
import { Link } from "wouter";

function formatCents(cents: number) {
  if (cents >= 100000) return `$${(cents / 100 / 1000).toFixed(1)}k`;
  return `$${(cents / 100).toFixed(2)}`;
}

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();

  const { data: stats, isLoading } = trpc.admin.stats.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-sm">
          <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h2 className="font-bold text-gray-800 mb-2">Admin Only</h2>
          <p className="text-gray-500 text-sm mb-4">You need admin access to view this page.</p>
          <Link href="/" className="text-teal-600 font-semibold text-sm">← Back to Maven</Link>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading platform stats...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Members", value: stats?.totalMembers || 0, icon: Users, color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Registered Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Songs Generated", value: stats?.totalSongs || 0, icon: Music, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Conversations", value: stats?.totalConversations || 0, icon: MessageSquare, color: "text-rose-500", bg: "bg-rose-50" },
    { label: "Subscriptions Cancelled", value: stats?.cancelledSubscriptions || 0, icon: Shield, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Total Financial Lift", value: formatCents(stats?.totalFinancialLiftCents || 0), icon: TrendingUp, color: "text-teal-700", bg: "bg-teal-50", isString: true },
  ];

  const membershipTiers = stats?.membershipsByTier || {};

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white px-4 pt-12 pb-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400 text-sm font-semibold uppercase tracking-wide">Admin Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">Platform Health</h1>
          <p className="text-gray-400 text-sm">Real-time view of Maven's impact on Ruby Red's financial life.</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4 space-y-4">
        {/* Key stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className={`p-4 border ${stat.bg}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs text-gray-500 font-medium">{stat.label}</span>
                </div>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.isString ? stat.value : stat.value.toLocaleString()}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Membership breakdown */}
        <Card className="p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Package className="w-4 h-4 text-teal-600" /> Membership Tiers
          </h3>
          <div className="space-y-2">
            {[
              { tier: "observer", label: "Get Started Free", color: "bg-gray-200" },
              { tier: "essentials", label: "Maven Essentials ($5.99/wk)", color: "bg-teal-500" },
              { tier: "plus", label: "Maven Plus ($10.99/wk)", color: "bg-purple-500" },
            ].map(({ tier, label, color }) => {
              const count = membershipTiers[tier] || 0;
              const total = Object.values(membershipTiers).reduce((a, b) => a + b, 0) || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={tier}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{label}</span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Financial lift breakdown */}
        <Card className="p-4 border border-teal-200 bg-teal-50">
          <h3 className="font-semibold text-teal-800 mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Financial Impact Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-teal-700">Total estimated lift</span>
              <span className="font-bold text-teal-800">{formatCents(stats?.totalFinancialLiftCents || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-teal-700">Subscriptions cancelled</span>
              <span className="font-bold text-teal-800">{stats?.cancelledSubscriptions || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-teal-700">Avg lift per member</span>
              <span className="font-bold text-teal-800">
                {stats?.totalMembers ? formatCents(Math.round((stats.totalFinancialLiftCents || 0) / stats.totalMembers)) : "$0"}
              </span>
            </div>
          </div>
          <p className="text-teal-500 text-xs mt-3">All figures are estimated. North Star KPI: 100% lift in 90 days.</p>
        </Card>

        {/* Fulfillment Queue Link */}
        <Link href="/admin/fulfillment">
          <Card className="p-4 border border-amber-200 bg-amber-50 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-semibold text-amber-800">Essentials Box Fulfillment</h3>
                  <p className="text-xs text-amber-600">Manage orders, update status, track deliveries</p>
                </div>
              </div>
              <span className="text-amber-400 text-lg">→</span>
            </div>
          </Card>
        </Link>

        {/* North Star tracker */}
        <Card className="p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">North Star KPI Tracker</h3>
          <p className="text-gray-500 text-xs mb-3">Target: 100% lift in Ruby Red's net financial position in 90 days. 50% = extraordinary.</p>
          <div className="space-y-2">
            {[
              { label: "Subscriptions cancelled", target: "10 per member", current: stats?.cancelledSubscriptions || 0 },
              { label: "NSF fees avoided", target: "$45 avg each", current: 0 },
              { label: "Songs generated (viral loop)", target: "1 per member", current: stats?.totalSongs || 0 },
              { label: "Members with financial lift", target: "100%", current: stats?.totalMembers || 0 },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs">{item.target}</span>
                  <Badge className="bg-teal-100 text-teal-700">{item.current}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
