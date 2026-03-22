/**
 * Race 12 — Tests for:
 * - P0: Dignity Score actionable tips (dimension links)
 * - P1: Community Credits "How It Works" explainer
 * - P2: Homepage trust signals (badges + second testimonial)
 * - P3: Grace snooze/wake endpoints
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Mock LLM ───────────────────────────────────────────────────────────────
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{ message: { content: "That's amazing progress, Ruby!" } }],
  }),
}));

// ─── Mock DB ────────────────────────────────────────────────────────────────
vi.mock("./db", () => ({
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
  getOrCreateProfile: vi.fn().mockResolvedValue({ id: 1, sessionId: "sess-r12", firstName: "Ruby", city: "Red Deer", userId: null }),
  getProfileById: vi.fn().mockResolvedValue({ id: 1, firstName: "Ruby", sessionId: "sess-r12" }),
  getMemories: vi.fn().mockResolvedValue([]),
  getMembership: vi.fn().mockResolvedValue(null),
  upsertMembership: vi.fn(),
  getMilkMoneyAccount: vi.fn().mockResolvedValue({
    id: 1, profileId: 1, tier: "rookie", creditLimitCents: 2000,
    outstandingCents: 0, trustScore: 50, totalBorrowed: 0, totalRepaid: 0, onTimeRepayments: 0, lateRepayments: 0,
  }),
  updateMilkMoneyAccount: vi.fn(),
  addMilkMoneyTransaction: vi.fn(),
  getActiveBorrows: vi.fn().mockResolvedValue([]),
  getUpcomingBorrows: vi.fn().mockResolvedValue([]),
  getOverdueBorrows: vi.fn().mockResolvedValue([]),
  getSubscriptions: vi.fn().mockResolvedValue([]),
  addSubscription: vi.fn(),
  updateSubscription: vi.fn(),
  getSongsByProfile: vi.fn().mockResolvedValue([]),
  getSongById: vi.fn(),
  updateSong: vi.fn(),
  getShareToken: vi.fn(),
  createShareToken: vi.fn(),
  incrementShareTokenView: vi.fn(),
  getBudgetEntries: vi.fn().mockResolvedValue([]),
  addBudgetEntry: vi.fn(),
  updateBudgetEntry: vi.fn(),
  getBills: vi.fn().mockResolvedValue([]),
  addBill: vi.fn(),
  updateBill: vi.fn(),
  getPaycheck: vi.fn().mockResolvedValue(null),
  upsertPaycheck: vi.fn(),
  getFinancialImpactLog: vi.fn().mockResolvedValue([]),
  getFinancialImpacts: vi.fn().mockResolvedValue([]),
  addFinancialImpactEntry: vi.fn(),
  saveConversationMessage: vi.fn(),
  getConversationHistory: vi.fn().mockResolvedValue([]),
  initializeJourney: vi.fn(),
  getTrojanHorseEntry: vi.fn().mockResolvedValue(null),
  updateTrojanHorseEntry: vi.fn(),
  updateProfile: vi.fn(),
  getDignityScore: vi.fn().mockResolvedValue(null),
  upsertDignityScore: vi.fn(),
  getPromises: vi.fn().mockResolvedValue([]),
  createPromise: vi.fn(),
  updatePromise: vi.fn(),
  getPromiseStats: vi.fn().mockResolvedValue({ active: 0, completed: 0, broken: 0 }),
  getDestinyAnswers: vi.fn().mockResolvedValue([]),
  addDestinyAnswer: vi.fn(),
  getDestinySynthesis: vi.fn().mockResolvedValue(null),
  upsertDestinySynthesis: vi.fn(),
  getStories: vi.fn().mockResolvedValue([]),
  getStoryById: vi.fn(),
  createStory: vi.fn(),
  updateStory: vi.fn(),
  getVillageAgents: vi.fn().mockResolvedValue([]),
  getIntroducedAgents: vi.fn().mockResolvedValue([]),
  introduceAgent: vi.fn(),
  renameAgent: vi.fn(),
  getGraceStatus: vi.fn().mockResolvedValue(null),
  upsertGraceStatus: vi.fn(),
  calculateBatteryLevel: vi.fn().mockResolvedValue(100),
  getSpeedStage: vi.fn().mockReturnValue("normal"),
  getDegradationTier: vi.fn().mockResolvedValue("full"),
  ensureCommunityCredits: vi.fn().mockResolvedValue({ balance: 0, totalEarned: 0, totalRedeemed: 0 }),
  getCommunityCredits: vi.fn().mockResolvedValue({ balance: 10 }),
  earnCredits: vi.fn(),
  redeemCredits: vi.fn().mockResolvedValue({ success: true, newBalance: 5, subscriptionValue: 5 }),
  getCommunityCreditsLog: vi.fn().mockResolvedValue([]),
  getPaydayPattern: vi.fn().mockResolvedValue(null),
  upsertPaydayPattern: vi.fn(),
  calculateNextPayday: vi.fn().mockReturnValue(new Date("2026-04-01")),
  getActiveBeacon: vi.fn().mockResolvedValue(null),
  createCrisisBeacon: vi.fn(),
  resolveBeacon: vi.fn(),
  getMoonshot: vi.fn().mockResolvedValue(null),
  revealMoonshot: vi.fn(),
  getUnreadAmbientMessages: vi.fn().mockResolvedValue([]),
  addAmbientMessage: vi.fn(),
  markAmbientMessageRead: vi.fn(),
  getLatestDignityScore: vi.fn().mockResolvedValue({ totalScore: 45, tier: "building_momentum" }),
  createEssentialsOrder: vi.fn().mockResolvedValue({ id: 99, orderNumber: "MG-0099" }),
  listEssentialsOrders: vi.fn().mockResolvedValue([]),
  getEssentialsOrder: vi.fn().mockResolvedValue({ id: 1, profileId: 1, status: "pending" }),
  updateEssentialsOrderStatus: vi.fn(),
  updateEssentialsOrderNotes: vi.fn(),
  updateEssentialsOrderCourier: vi.fn(),
  getMemberOrders: vi.fn().mockResolvedValue([]),
  getEssentialsOrderStats: vi.fn().mockResolvedValue({ total: 5, pending: 1, packed: 1, shipped: 1, delivered: 2 }),
  addMemory: vi.fn(),
  createTrojanHorseEntry: vi.fn().mockResolvedValue({ id: 1, sessionId: "test", step: 1 }),
  calculateDignityScore: vi.fn().mockResolvedValue({ total: 45 }),
  getDignityScoreHistory: vi.fn().mockResolvedValue([]),
}));

// ─── Mock Stripe ────────────────────────────────────────────────────────────
vi.mock("./stripe", () => ({
  createCheckoutSession: vi.fn(),
  isStripeConfigured: vi.fn().mockReturnValue(false),
  MAVEN_PRODUCTS: [
    { id: "get_started_free", name: "Get Started Free", priceMonthly: 0, description: "Free tier" },
    { id: "maven_member", name: "Maven Member", priceMonthly: 1500, description: "Full membership" },
  ],
}));

vi.mock("./kieai", () => ({
  textToSpeech: vi.fn(),
  isKieAiConfigured: vi.fn().mockReturnValue(false),
}));

vi.mock("./_core/voiceTranscription", () => ({
  transcribeAudio: vi.fn(),
}));

vi.mock("./storage", () => ({
  storagePut: vi.fn(),
}));

// ─── Helpers ────────────────────────────────────────────────────────────────
function createCaller(role: "user" | "admin" = "user") {
  const ctx: TrpcContext = {
    user: { id: 1, openId: "test-open-id", name: "Ruby Red", role },
    req: {} as any,
    res: {} as any,
  };
  return appRouter.createCaller(ctx);
}

function createPublicCaller() {
  const ctx: TrpcContext = {
    user: null,
    req: {} as any,
    res: {} as any,
  };
  return appRouter.createCaller(ctx);
}

// ═══════════════════════════════════════════════════════════════════════════
// P0: DIGNITY SCORE ACTIONABLE TIPS
// ═══════════════════════════════════════════════════════════════════════════
describe("P0 — Dignity Score dimension tips", () => {
  it("dignity score page has 5 dimensions with tips and links", () => {
    // Verify the DignityScore component source has tips and links
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/pages/DignityScore.tsx", "utf-8");
    expect(source).toContain("tip:");
    expect(source).toContain("link:");
    expect(source).toContain("/vampire-slayer");
    expect(source).toContain("/bills");
    expect(source).toContain("/budget");
    expect(source).toContain("/milk-money");
    expect(source).toContain("/grace");
  });

  it("dignity score calculate endpoint works", async () => {
    const caller = createCaller("user");
    const result = await caller.dignity.calculate({ profileId: 1 });
    expect(result).toBeDefined();
  });

  it("dignity score getLatest returns score with tier", async () => {
    const caller = createCaller("user");
    const result = await caller.dignity.getLatest({ profileId: 1 });
    expect(result?.totalScore).toBe(45);
    expect(result?.tier).toBe("building_momentum");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// P1: COMMUNITY CREDITS EXPLAINER
// ═══════════════════════════════════════════════════════════════════════════
describe("P1 — Community Credits explainer", () => {
  it("community credits page has How It Works section", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/pages/CommunityCredits.tsx", "utf-8");
    expect(source).toContain("How Community Credits Work");
    expect(source).toContain("Ways to earn");
    expect(source).toContain("100 credits = $0.50");
  });

  it("community credits get endpoint returns account", async () => {
    const caller = createCaller("user");
    const result = await caller.communityCredits.get({ profileId: 1 });
    expect(result).toBeDefined();
    expect(result.balance).toBeDefined();
  });

  it("community credits earn works", async () => {
    const caller = createCaller("user");
    const result = await caller.communityCredits.earn({
      profileId: 1,
      amount: 15,
      category: "teaching",
      description: "Helped neighbor with homework",
    });
    expect(result.success).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// P2: HOMEPAGE TRUST SIGNALS
// ═══════════════════════════════════════════════════════════════════════════
describe("P2 — Homepage trust signals", () => {
  it("homepage has trust badges", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/pages/Home.tsx", "utf-8");
    expect(source).toContain("Bank-Level Privacy");
    expect(source).toContain("No Data Selling");
    expect(source).toContain("Grace Never Quits");
  });

  it("homepage has two testimonials", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/pages/Home.tsx", "utf-8");
    expect(source).toContain("A Maven member, Red Deer");
    expect(source).toContain("A Maven member, Calgary");
  });

  it("homepage has Lock and EyeOff icons for trust", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/pages/Home.tsx", "utf-8");
    expect(source).toContain("Lock");
    expect(source).toContain("EyeOff");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// P3: GRACE SNOOZE / WAKE
// ═══════════════════════════════════════════════════════════════════════════
describe("P3 — Grace snooze/wake", () => {
  it("snooze sets 8-hour pause", async () => {
    const caller = createCaller("user");
    const result = await caller.graceStatus.snooze({ profileId: 1 });
    expect(result.success).toBe(true);
    expect(result.snoozeUntil).toBeDefined();
    expect(result.message).toContain("nap");
    // Verify snooze is ~8 hours from now
    const snoozeTime = new Date(result.snoozeUntil);
    const now = new Date();
    const diffHours = (snoozeTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    expect(diffHours).toBeGreaterThan(7.9);
    expect(diffHours).toBeLessThan(8.1);
  });

  it("wake cancels snooze", async () => {
    const caller = createCaller("user");
    const result = await caller.graceStatus.wake({ profileId: 1 });
    expect(result.success).toBe(true);
    expect(result.message).toContain("back");
  });

  it("snooze requires authentication", async () => {
    const caller = createPublicCaller();
    await expect(
      caller.graceStatus.snooze({ profileId: 1 })
    ).rejects.toThrow();
  });

  it("wake requires authentication", async () => {
    const caller = createPublicCaller();
    await expect(
      caller.graceStatus.wake({ profileId: 1 })
    ).rejects.toThrow();
  });

  it("GraceStatusPage has snooze UI", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/pages/GraceStatusPage.tsx", "utf-8");
    expect(source).toContain("Snooze Grace for 8 Hours");
    expect(source).toContain("Wake Grace Up Early");
    expect(source).toContain("Grace is snoozed");
    expect(source).toContain("Grace never gets cut");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SPIRIT CHECK: Does Race 12 serve Ruby Red with dignity?
// ═══════════════════════════════════════════════════════════════════════════
describe("Spirit Check — Race 12 dignity alignment", () => {
  it("dignity score page explains how to improve (not just displays)", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/pages/DignityScore.tsx", "utf-8");
    // Each dimension has a tip linking to an action
    expect(source).toContain("Cancel a subscription");
    expect(source).toContain("Set up bill reminders");
    expect(source).toContain("Add your income and expenses");
    expect(source).toContain("Repay a Milk Money borrow");
    expect(source).toContain("Keep a promise or chat with Grace");
  });

  it("snooze messaging is warm, not punishing", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/pages/GraceStatusPage.tsx", "utf-8");
    expect(source).toContain("No guilt, no questions");
    expect(source).toContain("Snooze is just a nap");
    expect(source).toContain("something warm");
  });
});
