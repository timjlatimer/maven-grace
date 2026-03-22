import { useHapticEmpathy } from "@/hooks/useHapticEmpathy";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, TrendingUp, Shield, Banknote, PiggyBank, Milk,
  CalendarDays, PlusCircle, MessageCircle, BarChart3,
  AlertTriangle, CheckCircle, Clock, DollarSign, ChevronRight,
  Wallet, CreditCard, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";

function formatCents(cents: number): string {
  return `$${(Math.abs(cents) / 100).toFixed(2)}`;
}

function getDaysUntilDue(dueDay: number): number {
  const today = new Date().getDate();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  let diff = dueDay - today;
  if (diff < 0) diff += daysInMonth;
  return diff;
}

const CATEGORY_COLORS: Record<string, string> = {
  rent: "#ef4444",
  utilities: "#f97316",
  phone: "#eab308",
  internet: "#22c55e",
  insurance: "#3b82f6",
  medical: "#8b5cf6",
  credit_card: "#ec4899",
  loan: "#f43f5e",
  childcare: "#14b8a6",
  groceries: "#84cc16",
  transport: "#06b6d4",
  other: "#94a3b8",
};

const PIE_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#84cc16", "#06b6d4", "#94a3b8"];

// ─── BILL CALENDAR ────────────────────────────────────────────────
function BillCalendar({ bills }: { bills: any[] }) {
  const today = new Date().getDate();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const monthName = new Date().toLocaleString("default", { month: "long" });

  const calendarDays = useMemo(() => {
    const days = [];
    const firstDayOfWeek = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay();
    // Pad start
    for (let i = 0; i < firstDayOfWeek; i++) days.push({ day: 0, bills: [] as any[] });
    for (let d = 1; d <= daysInMonth; d++) {
      const dayBills = bills.filter(b => b.dueDay === d);
      days.push({ day: d, bills: dayBills });
    }
    return days;
  }, [bills, daysInMonth]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-grace" /> {monthName} Bills
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="text-[10px] font-medium text-muted-foreground py-1">{d}</div>
          ))}
          {calendarDays.map((cell, i) => {
            if (cell.day === 0) return <div key={`pad-${i}`} />;
            const isToday = cell.day === today;
            const hasBills = cell.bills.length > 0;
            const allPaid = hasBills && cell.bills.every(b => b.isPaid);
            const isPast = cell.day < today;
            const isOverdue = hasBills && !allPaid && isPast;

            let bgClass = "";
            if (isToday) bgClass = "ring-2 ring-grace";
            if (hasBills && allPaid) bgClass += " bg-green-100 dark:bg-green-900/30";
            else if (isOverdue) bgClass += " bg-red-100 dark:bg-red-900/30";
            else if (hasBills) bgClass += " bg-amber-100 dark:bg-amber-900/30";

            return (
              <div
                key={cell.day}
                className={`relative rounded-md py-1.5 text-xs ${bgClass} ${isToday ? "font-bold" : ""}`}
                title={cell.bills.map(b => `${b.name}: ${formatCents(b.amountCents)}`).join(", ")}
              >
                {cell.day}
                {hasBills && (
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {cell.bills.map((b: any, j: number) => (
                      <div
                        key={j}
                        className={`w-1 h-1 rounded-full ${
                          b.isPaid ? "bg-green-500" : isPast ? "bg-red-500" : "bg-amber-500"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> Paid</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Upcoming</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Overdue</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── SPENDING INSIGHTS ────────────────────────────────────────────
function SpendingInsights({ entries }: { entries: any[] }) {
  const expenseData = useMemo(() => {
    const expenses = entries.filter(e => e.type === "expense");
    const byCategory: Record<string, number> = {};
    expenses.forEach(e => {
      const cat = e.category || "other";
      byCategory[cat] = (byCategory[cat] || 0) + (e.amountCents || 0);
    });
    return Object.entries(byCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [entries]);

  const totalExpenses = expenseData.reduce((sum, d) => sum + d.value, 0);

  if (expenseData.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <BarChart3 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Add expenses to your budget to see spending insights</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" /> Where Your Money Goes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="w-28 h-28">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={45}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {expenseData.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-1.5">
            {expenseData.slice(0, 5).map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="text-xs text-foreground capitalize flex-1">{d.name}</span>
                <span className="text-xs font-medium text-foreground">{formatCents(d.value)}</span>
                <span className="text-[10px] text-muted-foreground">
                  {totalExpenses > 0 ? Math.round((d.value / totalExpenses) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── PAYCHECK TIMELINE ────────────────────────────────────────────
function PaycheckTimeline({ payday, bills }: { payday: any; bills: any[] }) {
  if (!payday) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <Wallet className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground mb-2">Set up your payday to see your pay-cycle timeline</p>
          <Button variant="outline" size="sm" onClick={() => window.location.href = "/payday"}>
            Set Up Payday
          </Button>
        </CardContent>
      </Card>
    );
  }

  const now = new Date();
  const nextPayday = payday.nextPayday ? new Date(payday.nextPayday) : null;
  if (!nextPayday) return null;

  // Calculate days between paydays based on frequency
  const freqDays: Record<string, number> = { weekly: 7, biweekly: 14, semimonthly: 15, monthly: 30 };
  const cycleDays = freqDays[payday.frequency] || 14;
  const lastPayday = new Date(nextPayday.getTime() - cycleDays * 24 * 60 * 60 * 1000);
  const totalMs = nextPayday.getTime() - lastPayday.getTime();
  const elapsedMs = now.getTime() - lastPayday.getTime();
  const progress = Math.min(Math.max(elapsedMs / totalMs, 0), 1);
  const daysLeft = Math.max(0, Math.ceil((nextPayday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  // Bills due before next payday
  const upcomingBills = bills.filter(b => {
    const daysUntil = getDaysUntilDue(b.dueDay);
    return daysUntil <= daysLeft && !b.isPaid;
  });
  const totalDue = upcomingBills.reduce((sum: number, b: any) => sum + (b.amountCents || 0), 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Wallet className="w-4 h-4 text-lift" /> Paycheck Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-grace to-lift"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-muted-foreground">Last payday</span>
            <span className="text-[10px] font-medium text-foreground">{daysLeft} days left</span>
            <span className="text-[10px] text-muted-foreground">Next payday</span>
          </div>
        </div>
        {upcomingBills.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3">
            <p className="text-xs font-medium text-amber-800 dark:text-amber-200 mb-1">
              Due before payday: {formatCents(totalDue)}
            </p>
            <div className="space-y-1">
              {upcomingBills.slice(0, 3).map((b: any) => (
                <div key={b.id} className="flex justify-between text-[10px]">
                  <span className="text-amber-700 dark:text-amber-300">{b.name}</span>
                  <span className="text-amber-800 dark:text-amber-200 font-medium">{formatCents(b.amountCents)}</span>
                </div>
              ))}
              {upcomingBills.length > 3 && (
                <p className="text-[10px] text-amber-600">+{upcomingBills.length - 3} more</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── DIGNITY SCORE TREND ──────────────────────────────────────────
function DignityTrend({ history }: { history: any[] }) {
  const chartData = useMemo(() => {
    return [...history].reverse().map((h, i) => ({
      date: new Date(h.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" }),
      score: h.totalScore || 0,
    }));
  }, [history]);

  if (chartData.length < 2) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <TrendingUp className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Keep using Grace to build your Dignity Score history</p>
        </CardContent>
      </Card>
    );
  }

  const latest = chartData[chartData.length - 1]?.score || 0;
  const previous = chartData[chartData.length - 2]?.score || 0;
  const trend = latest - previous;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Shield className="w-4 h-4 text-grace" /> Dignity Score Trend
          {trend > 0 && <Badge variant="outline" className="text-green-600 border-green-200 text-[10px]">+{trend}</Badge>}
          {trend < 0 && <Badge variant="outline" className="text-red-600 border-red-200 text-[10px]">{trend}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} width={30} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
                formatter={(value: number) => [`${value}`, "Score"]}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2dd4bf"
                strokeWidth={2}
                dot={{ r: 3, fill: "#2dd4bf" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── MILK MONEY HISTORY ───────────────────────────────────────────
function MilkMoneyHistory({ transactions, account }: { transactions: any[]; account: any }) {
  if (!account) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <Milk className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground mb-2">Open a Milk Money account for emergency cash</p>
          <Button variant="outline" size="sm" onClick={() => window.location.href = "/milk-money"}>
            Open Account
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Milk className="w-4 h-4 text-purple-500" /> Milk Money
          </CardTitle>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Balance</p>
            <p className={`text-sm font-bold ${account.currentBalanceCents > 0 ? "text-amber-600" : "text-green-600"}`}>
              {account.currentBalanceCents > 0 ? "-" : ""}{formatCents(account.currentBalanceCents)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-2">No transactions yet</p>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {transactions.slice(0, 8).map((tx: any) => (
              <div key={tx.id} className="flex items-center gap-2 py-1 border-b border-border/30 last:border-0">
                {tx.type === "borrow" ? (
                  <ArrowDownRight className="w-3 h-3 text-amber-500 shrink-0" />
                ) : (
                  <ArrowUpRight className="w-3 h-3 text-green-500 shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-xs text-foreground">{tx.description || tx.type}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className={`text-xs font-medium ${tx.type === "borrow" ? "text-amber-600" : "text-green-600"}`}>
                  {tx.type === "borrow" ? "-" : "+"}{formatCents(tx.amountCents)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── QUICK ACTIONS BAR ────────────────────────────────────────────
function QuickActions({ navigate }: { navigate: (path: string) => void }) {
  const actions = [
    { icon: PlusCircle, label: "Add Bill", path: "/bills", color: "bg-red-500" },
    { icon: DollarSign, label: "Log Expense", path: "/budget", color: "bg-green-500" },
    { icon: MessageCircle, label: "Talk to Grace", path: "/grace", color: "bg-grace" },
    { icon: Shield, label: "My Score", path: "/dignity", color: "bg-lift" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {actions.map((a) => (
        <motion.button
          key={a.label}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(a.path)}
          className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-card border border-border/50 hover:border-grace/30 transition-colors"
        >
          <div className={`w-8 h-8 rounded-lg ${a.color} flex items-center justify-center`}>
            <a.icon className="w-4 h-4 text-white" />
          </div>
          <span className="text-[10px] font-medium text-foreground">{a.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

// ─── PROACTIVE BILL ALERTS ────────────────────────────────────────
function BillAlerts({ bills }: { bills: any[] }) {
  const alerts = useMemo(() => {
    const today = new Date().getDate();
    return bills
      .filter(b => !b.isPaid)
      .map(b => ({
        ...b,
        daysUntil: getDaysUntilDue(b.dueDay),
      }))
      .filter(b => b.daysUntil <= 7)
      .sort((a, b) => a.daysUntil - b.daysUntil);
  }, [bills]);

  if (alerts.length === 0) return null;

  return (
    <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
      <CardContent className="py-3 px-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <p className="text-xs font-bold text-amber-800 dark:text-amber-200">
            Grace says: "{alerts.length === 1 ? `Your ${alerts[0].name} is due ${alerts[0].daysUntil === 0 ? 'today' : `in ${alerts[0].daysUntil} day${alerts[0].daysUntil > 1 ? 's' : ''}`}` : `You have ${alerts.length} bills coming up this week`}"
          </p>
        </div>
        <div className="space-y-1">
          {alerts.map((b: any) => (
            <div key={b.id} className="flex items-center justify-between text-xs">
              <span className="text-amber-700 dark:text-amber-300">{b.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-amber-800 dark:text-amber-200 font-medium">{formatCents(b.amountCents)}</span>
                <Badge variant="outline" className={`text-[9px] ${b.daysUntil <= 2 ? "border-red-300 text-red-600" : "border-amber-300 text-amber-600"}`}>
                  {b.daysUntil === 0 ? "Today" : b.daysUntil === 1 ? "Tomorrow" : `${b.daysUntil}d`}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────
export default function FinancialDashboard() {
  useHapticEmpathy();
  const [, navigate] = useLocation();
  const { profileId } = useGraceSession();

  const { data: bills } = trpc.bills.list.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );
  const { data: budgetData } = trpc.budget.getEntries.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );
  const budgetEntries = budgetData?.entries || [];
  const { data: dignityHistory } = trpc.dignity.getHistory.useQuery(
    { profileId: profileId!, limit: 30 },
    { enabled: !!profileId }
  );
  const { data: payday } = trpc.payday.get.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );
  const { data: milkAccount } = trpc.milkMoney.getAccount.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );
  const { data: milkTransactions } = trpc.milkMoney.getTransactions.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );
  const { data: summary } = trpc.financial.getSummary.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  // Compute overview stats
  const totalBills = (bills || []).reduce((s: number, b: any) => s + (b.amountCents || 0), 0);
  const paidBills = (bills || []).filter((b: any) => b.isPaid).length;
  const totalBillCount = (bills || []).length;
  const monthlyIncome = budgetEntries
    .filter((e: any) => e.type === "income")
    .reduce((s: number, e: any) => s + (e.amountCents || 0), 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-1">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">My Finances</h1>
            <p className="text-[10px] text-muted-foreground">Grace is watching over your money</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Overview Cards */}
        <div className="grid grid-cols-3 gap-2">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="text-center py-3">
              <CardContent className="p-0">
                <p className="text-lg font-bold text-foreground">{formatCents(monthlyIncome)}</p>
                <p className="text-[10px] text-muted-foreground">Monthly Income</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="text-center py-3">
              <CardContent className="p-0">
                <p className="text-lg font-bold text-foreground">{formatCents(totalBills)}</p>
                <p className="text-[10px] text-muted-foreground">Total Bills</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="text-center py-3">
              <CardContent className="p-0">
                <p className="text-lg font-bold text-grace">{paidBills}/{totalBillCount}</p>
                <p className="text-[10px] text-muted-foreground">Bills Paid</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Proactive Bill Alerts */}
        <BillAlerts bills={bills || []} />

        {/* Quick Actions */}
        <QuickActions navigate={navigate} />

        {/* Paycheck Timeline */}
        <PaycheckTimeline payday={payday} bills={bills || []} />

        {/* Bill Calendar */}
        <BillCalendar bills={bills || []} />

        {/* Spending Insights */}
        <SpendingInsights entries={budgetEntries} />

        {/* Dignity Score Trend */}
        <DignityTrend history={dignityHistory || []} />

        {/* Milk Money History */}
        <MilkMoneyHistory transactions={milkTransactions || []} account={milkAccount} />

        {/* Navigation Links */}
        <div className="space-y-2">
          {[
            { label: "Budget Builder", path: "/budget", icon: PiggyBank, desc: "Track income & expenses" },
            { label: "Bill Tracker", path: "/bills", icon: CreditCard, desc: "Manage your bills" },
            { label: "Vampire Slayer", path: "/vampire-slayer", icon: Shield, desc: "Cancel subscriptions" },
            { label: "Milk Money", path: "/milk-money", icon: Milk, desc: "Emergency cash" },
          ].map((link) => (
            <Card
              key={link.path}
              className="cursor-pointer hover:border-grace/30 transition-colors"
              onClick={() => navigate(link.path)}
            >
              <CardContent className="flex items-center gap-3 py-3 px-4">
                <link.icon className="w-5 h-5 text-grace shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{link.label}</p>
                  <p className="text-[10px] text-muted-foreground">{link.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>

        {!profileId && (
          <Card>
            <CardContent className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Talk to Grace first — she'll help you set up your financial dashboard.
              </p>
              <Button onClick={() => navigate("/grace")} variant="outline">
                Talk to Grace
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
