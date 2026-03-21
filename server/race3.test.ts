/**
 * Race 3 — Tests for new routers:
 * membership, budget, bills, milkMoney, admin
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Mock DB ────────────────────────────────────────────────────────────────
vi.mock("./db", () => ({
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
  getOrCreateProfile: vi.fn().mockResolvedValue({ id: 1, sessionId: "sess-1", userId: null }),
  getMembership: vi.fn().mockResolvedValue(null),
  upsertMembership: vi.fn().mockResolvedValue({ id: 1, tier: "essentials", status: "active", weeklyAmountCents: 599 }),
  getBudgetEntries: vi.fn().mockResolvedValue([]),
  addBudgetEntry: vi.fn().mockResolvedValue({ id: 1, type: "expense", category: "utilities", description: "Hydro", amountCents: 8000, frequency: "monthly" }),
  deleteBudgetEntry: vi.fn().mockResolvedValue(undefined),
  setPaycheck: vi.fn().mockResolvedValue({ id: 1, amountCents: 120000, frequency: "biweekly" }),
  getBills: vi.fn().mockResolvedValue([]),
  addBill: vi.fn().mockResolvedValue({ id: 1, name: "Rogers", amountCents: 7500, dueDay: 15, category: "phone", isAutoPay: false, isPaid: false, isActive: true, nsfRiskFlagged: false }),
  markBillPaid: vi.fn().mockResolvedValue(undefined),
  deleteBill: vi.fn().mockResolvedValue(undefined),
  getMilkMoneyAccount: vi.fn().mockResolvedValue(null),
  createMilkMoneyAccount: vi.fn().mockResolvedValue({ id: 1, tier: "rookie", creditLimitCents: 2000, currentBalanceCents: 0, trustScore: 0 }),
  updateMilkMoneyAccount: vi.fn().mockResolvedValue(undefined),
  addMilkMoneyTransaction: vi.fn().mockResolvedValue(undefined),
  getMilkMoneyTransactions: vi.fn().mockResolvedValue([]),
  createAnthemShareToken: vi.fn().mockResolvedValue({ token: "abc123" }),
  getAnthemShareToken: vi.fn().mockResolvedValue(null),
  incrementShareTokenView: vi.fn().mockResolvedValue(undefined),
  getAdminStats: vi.fn().mockResolvedValue({ totalUsers: 10, totalMembers: 5, totalSongs: 3, totalConversations: 25, cancelledSubscriptions: 2, totalFinancialLiftCents: 150000, membershipsByTier: { observer: 2, essentials: 2, plus: 1 } }),
  getAllMemberships: vi.fn().mockResolvedValue([]),
  // other db methods used by other routers
  getOrCreateProfile: vi.fn().mockResolvedValue({ id: 1, sessionId: "sess-1", userId: null }),
  getProfileById: vi.fn().mockResolvedValue({ id: 1, sessionId: "sess-1" }),
  updateProfile: vi.fn().mockResolvedValue(undefined),
  getMemories: vi.fn().mockResolvedValue([]),
  addMemory: vi.fn().mockResolvedValue(undefined),
  getConversationHistory: vi.fn().mockResolvedValue([]),
  saveConversationMessage: vi.fn().mockResolvedValue(undefined),
  getTrojanHorseEntry: vi.fn().mockResolvedValue(null),
  createTrojanHorseEntry: vi.fn().mockResolvedValue({ id: 1 }),
  updateTrojanHorseEntry: vi.fn().mockResolvedValue(undefined),
  createSong: vi.fn().mockResolvedValue({ id: 1 }),
  updateSong: vi.fn().mockResolvedValue(undefined),
  getSongsByProfile: vi.fn().mockResolvedValue([]),
  getFinancialSummary: vi.fn().mockResolvedValue({ totalLift: 0, breakdown: [] }),
  addFinancialImpact: vi.fn().mockResolvedValue(undefined),
  getFinancialImpacts: vi.fn().mockResolvedValue([]),
  getSubscriptions: vi.fn().mockResolvedValue([]),
  addSubscription: vi.fn().mockResolvedValue({ id: 1 }),
  updateSubscription: vi.fn().mockResolvedValue(undefined),
  getJourneyMilestones: vi.fn().mockResolvedValue([]),
  completeMilestone: vi.fn().mockResolvedValue(undefined),
  initializeJourney: vi.fn().mockResolvedValue(undefined),
  getUnreadAmbientMessages: vi.fn().mockResolvedValue([]),
  markAmbientMessageRead: vi.fn().mockResolvedValue(undefined),
  addAmbientMessage: vi.fn().mockResolvedValue(undefined),
  updateBill: vi.fn().mockResolvedValue(undefined),
  upsertPaycheck: vi.fn().mockResolvedValue({ id: 1, amountCents: 120000, frequency: "biweekly" }),
  getPaycheck: vi.fn().mockResolvedValue(null),
  updateBudgetEntry: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{ message: { content: "Test response" } }],
  }),
}));

vi.mock("./kieai", () => ({
  textToSpeech: vi.fn().mockResolvedValue("https://cdn.example.com/audio.mp3"),
  isKieAiConfigured: vi.fn().mockReturnValue(true),
}));

vi.mock("./_core/voiceTranscription", () => ({
  transcribeAudio: vi.fn().mockResolvedValue({ text: "Hello Grace", language: "en", segments: [] }),
}));

vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ key: "voice-input/test.webm", url: "https://s3.example.com/test.webm" }),
}));

// ─── Test context ────────────────────────────────────────────────────────────
function makeCtx(role: "user" | "admin" = "user"): TrpcContext {
  return {
    user: role === "admin" ? {
      id: 99,
      openId: "admin-open-id",
      name: "Admin",
      email: "admin@maven.com",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    } : null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

// ─── Membership ──────────────────────────────────────────────────────────────
describe("membership router", () => {
  it("gets membership for a profile (null when none exists)", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.membership.get({ profileId: 1 });
    expect(result).toBeNull();
  });

  it("upserts membership to essentials tier", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.membership.upsert({ profileId: 1, tier: "essentials" });
    expect(result).toMatchObject({ success: true });
    expect((result as any).membership).toMatchObject({ tier: "essentials", status: "active" });
  });

  it("upserts membership to observer tier (free)", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.membership.upsert({ profileId: 1, tier: "observer" });
    expect(result).toBeDefined();
  });
});

// ─── Budget ──────────────────────────────────────────────────────────────────
describe("budget router", () => {
  it("gets budget entries for a profile", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.budget.getEntries({ profileId: 1 });
    expect(Array.isArray(result.entries)).toBe(true);
    expect(result).toHaveProperty("income");
    expect(result).toHaveProperty("expenses");
  });

  it("adds a budget entry", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.budget.addEntry({
      profileId: 1,
      type: "expense",
      category: "utilities",
      description: "Hydro",
      amountCents: 8000,
      frequency: "monthly",
    });
    expect(result).toMatchObject({ success: true });
    expect((result as any).entry).toMatchObject({ description: "Hydro", amountCents: 8000 });
  });

  it("sets paycheck info", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.budget.setPaycheck({
      profileId: 1,
      amountCents: 120000,
      frequency: "biweekly",
    });
    expect(result).toMatchObject({ success: true });
    expect((result as any).paycheck).toMatchObject({ amountCents: 120000, frequency: "biweekly" });
  });
});

// ─── Bills ───────────────────────────────────────────────────────────────────
describe("bills router", () => {
  it("lists bills for a profile", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.bills.list({ profileId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("adds a bill", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.bills.add({
      profileId: 1,
      name: "Rogers",
      amountCents: 7500,
      dueDay: 15,
      category: "phone",
      isAutoPay: false,
    });
    expect(result).toMatchObject({ success: true });
    expect((result as any).bill).toMatchObject({ name: "Rogers", amountCents: 7500 });
  });

  it("marks a bill as paid", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(caller.bills.markPaid({ id: 1 })).resolves.not.toThrow();
  });
});

// ─── Milk Money ──────────────────────────────────────────────────────────────
describe("milkMoney router", () => {
  it("returns null account when none exists", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.milkMoney.getAccount({ profileId: 1 });
    expect(result).toBeNull();
  });

  it("opens a milk money account at rookie tier", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.milkMoney.openAccount({ profileId: 1 });
    expect(result).toMatchObject({ success: true });
  });

  it("gets transaction history", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.milkMoney.getTransactions({ profileId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });
});

// ─── Admin ───────────────────────────────────────────────────────────────────
describe("admin router", () => {
  it("returns platform stats for admin user", async () => {
    const caller = appRouter.createCaller(makeCtx("admin"));
    const result = await caller.admin.stats();
    expect(result).toMatchObject({
      totalUsers: 10,
      totalMembers: 5,
      cancelledSubscriptions: 2,
    });
  });

  it("throws for non-admin user", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    await expect(caller.admin.stats()).rejects.toThrow();
  });
});
