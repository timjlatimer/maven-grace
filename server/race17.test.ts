import { describe, it, expect } from "vitest";

// ─── Race 17: Ruby's Financial Empowerment Dashboard ──────────────

describe("Race 17 — Financial Dashboard Page", () => {
  it("FinancialDashboard page exists", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/FinancialDashboard.tsx");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("FinancialDashboard imports recharts for data visualization", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/FinancialDashboard.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("recharts");
    expect(content).toContain("LineChart");
    expect(content).toContain("PieChart");
  });

  it("FinancialDashboard uses haptic empathy on mount", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/FinancialDashboard.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("useHapticEmpathy");
  });

  it("FinancialDashboard queries all required data sources", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/FinancialDashboard.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("trpc.bills.list.useQuery");
    expect(content).toContain("trpc.budget.getEntries.useQuery");
    expect(content).toContain("trpc.dignity.getHistory.useQuery");
    expect(content).toContain("trpc.payday.get.useQuery");
    expect(content).toContain("trpc.milkMoney.getAccount.useQuery");
    expect(content).toContain("trpc.milkMoney.getTransactions.useQuery");
    expect(content).toContain("trpc.financial.getSummary.useQuery");
  });

  it("FinancialDashboard is registered in App.tsx routes", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/App.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("/finances");
    expect(content).toContain("FinancialDashboard");
  });

  it("FinancialDashboard is in primary nav", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/components/BottomNav.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("/finances");
    expect(content).toContain("Finances");
  });
});

describe("Race 17 — Bill Calendar View", () => {
  it("BillCalendar component renders 7-day grid", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/FinancialDashboard.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("BillCalendar");
    expect(content).toContain("grid-cols-7");
    expect(content).toContain("CalendarDays");
  });

  it("BillCalendar has color-coded status indicators", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/FinancialDashboard.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("bg-green-500"); // Paid
    expect(content).toContain("bg-amber-500"); // Upcoming
    expect(content).toContain("bg-red-500");   // Overdue
  });

  it("BillCalendar has legend for status colors", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/FinancialDashboard.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("Paid");
    expect(content).toContain("Upcoming");
    expect(content).toContain("Overdue");
  });
});

describe("Race 17 — Spending Insights", () => {
  it("SpendingInsights uses PieChart from recharts", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/FinancialDashboard.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("SpendingInsights");
    expect(content).toContain("<PieChart>");
    expect(content).toContain("Where Your Money Goes");
  });

  it("SpendingInsights shows category percentages", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/FinancialDashboard.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("totalExpenses");
    expect(content).toContain("Math.round");
    expect(content).toContain("%");
  });

  it("SpendingInsights shows empty state when no expenses", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/FinancialDashboard.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("Add expenses to your budget");
  });
});

describe("Race 17 — Paycheck Timeline", () => {
  it("PaycheckTimeline shows progress bar", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/FinancialDashboard.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("PaycheckTimeline");
    expect(content).toContain("Paycheck Timeline");
    expect(content).toContain("progress");
    expect(content).toContain("days left");
  });

  it("PaycheckTimeline shows bills due before payday", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/FinancialDashboard.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("Due before payday");
    expect(content).toContain("upcomingBills");
  });

  it("PaycheckTimeline shows setup prompt when no payday configured", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/FinancialDashboard.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("Set up your payday");
    expect(content).toContain("/payday");
  });
});

describe("Race 17 — Dignity Score Trend", () => {
  it("DignityTrend uses LineChart from recharts", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/FinancialDashboard.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("DignityTrend");
    expect(content).toContain("Dignity Score Trend");
    expect(content).toContain("<LineChart");
    expect(content).toContain("<Line");
  });

  it("DignityTrend shows trend direction badge", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/FinancialDashboard.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("trend");
    expect(content).toContain("text-green-600");
    expect(content).toContain("text-red-600");
  });
});

describe("Race 17 — Quick Actions Bar", () => {
  it("QuickActions has 4 action buttons", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/FinancialDashboard.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("QuickActions");
    expect(content).toContain("Add Bill");
    expect(content).toContain("Log Expense");
    expect(content).toContain("Talk to Grace");
    expect(content).toContain("My Score");
  });

  it("QuickActions navigates to correct paths", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/FinancialDashboard.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("/bills");
    expect(content).toContain("/budget");
    expect(content).toContain("/grace");
    expect(content).toContain("/dignity");
  });
});

describe("Race 17 — Proactive Bill Alerts", () => {
  it("BillAlerts component shows Grace's voice", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/FinancialDashboard.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("BillAlerts");
    expect(content).toContain("Grace says:");
    expect(content).toContain("daysUntil");
  });

  it("Proactive bill alerts injected into Grace's system prompt", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "./routers.ts");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("PROACTIVE BILL ALERT");
    expect(content).toContain("billAlertContext");
    expect(content).toContain("getBills");
  });

  it("Bill alerts only trigger for bills due within 3 days", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "./routers.ts");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("diff <= 3");
  });
});

describe("Race 17 — Milk Money Transaction History", () => {
  it("MilkMoneyHistory shows borrow/repay indicators", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/FinancialDashboard.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("MilkMoneyHistory");
    expect(content).toContain("ArrowDownRight");
    expect(content).toContain("ArrowUpRight");
    expect(content).toContain("borrow");
  });

  it("MilkMoneyHistory shows running balance", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/FinancialDashboard.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("Balance");
    expect(content).toContain("currentBalanceCents");
  });

  it("MilkMoneyHistory shows empty state for new accounts", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/FinancialDashboard.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("Open a Milk Money account");
    expect(content).toContain("No transactions yet");
  });
});
