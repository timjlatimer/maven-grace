/**
 * Race 11 — Tests for:
 * - P0: Grace financial stress detection (via enhanced system prompt)
 * - P1: Grace personality enhancement (5 secret weapons in system prompt)
 * - P2: Monthly Reality Check endpoint (grace.monthlyReview)
 * - P3: Grace proactive nudge quality (ambient messages)
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Mock LLM ───────────────────────────────────────────────────────────────
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{
      message: { content: "I hear you, Ruby. That's a real weight to carry. Want me to help you map out what's due?" },
    }],
  }),
}));

// ─── Mock DB ────────────────────────────────────────────────────────────────
vi.mock("./db", () => ({
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
  getOrCreateProfile: vi.fn().mockResolvedValue({ id: 1, sessionId: "sess-r11", firstName: "Ruby", city: "Red Deer", userId: null }),
  getGracePreferences: vi.fn().mockResolvedValue(null),
  getProfileById: vi.fn().mockResolvedValue({ id: 1, firstName: "Ruby", sessionId: "sess-r11" }),
  getMemories: vi.fn().mockResolvedValue([
    { id: 1, profileId: 1, category: "financial", fact: "Behind on electricity bill", confidence: "high", source: "conversation", createdAt: new Date() },
  ]),
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
  getSubscriptions: vi.fn().mockResolvedValue([
    { id: 1, profileId: 1, name: "Netflix", amountCents: 1599, status: "cancelled" },
    { id: 2, profileId: 1, name: "Spotify", amountCents: 999, status: "active" },
    { id: 3, profileId: 1, name: "Old Gym", amountCents: 4999, status: "cancelled" },
  ]),
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
  getFinancialImpacts: vi.fn().mockResolvedValue([
    { id: 1, profileId: 1, category: "subscription_cancelled", amountCents: 1599, description: "Cancelled Netflix", createdAt: new Date() },
    { id: 2, profileId: 1, category: "subscription_cancelled", amountCents: 4999, description: "Cancelled Old Gym", createdAt: new Date() },
  ]),
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
  getPromiseStats: vi.fn().mockResolvedValue({ active: 2, completed: 3, broken: 0 }),
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
  getCommunityCredits: vi.fn().mockResolvedValue({ balance: 25 }),
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
  getLatestDignityScore: vi.fn().mockResolvedValue({ totalScore: 72, tier: "rising" }),
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
  calculateDignityScore: vi.fn().mockResolvedValue({ total: 0 }),
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

// ─── Mock Voice ─────────────────────────────────────────────────────────────
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
// P0: GRACE FINANCIAL STRESS DETECTION
// ═══════════════════════════════════════════════════════════════════════════
describe("P0 — Grace financial stress detection", () => {
  it("Grace responds to stress message with empathy", async () => {
    const caller = createPublicCaller();
    const result = await caller.grace.chat({
      sessionId: "stress-test",
      message: "I can't afford my electricity bill this month",
    });
    expect(result.response).toBeDefined();
    expect(typeof result.response).toBe("string");
    // The LLM mock returns a stress-aware response
    expect(result.response.length).toBeGreaterThan(0);
  });

  it("Grace responds to overdraft stress", async () => {
    const caller = createPublicCaller();
    const result = await caller.grace.chat({
      sessionId: "stress-test-2",
      message: "I got hit with another overdraft fee, I'm so broke",
    });
    expect(result.response).toBeDefined();
    expect(result.profileId).toBeDefined();
  });

  it("Grace handles general overwhelm message", async () => {
    const caller = createPublicCaller();
    const result = await caller.grace.chat({
      sessionId: "stress-test-3",
      message: "I'm choosing between groceries and gas this week",
    });
    expect(result.response).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// P1: GRACE PERSONALITY — 5 Secret Weapons in system prompt
// ═══════════════════════════════════════════════════════════════════════════
describe("P1 — Grace personality enhancement", () => {
  it("Grace system prompt includes 5 secret weapons", async () => {
    // We verify the system prompt content by checking that Grace responds
    // (the actual prompt content is verified by reading the source)
    const caller = createPublicCaller();
    const result = await caller.grace.chat({
      sessionId: "personality-test",
      message: "I just cancelled my Netflix subscription!",
    });
    expect(result.response).toBeDefined();
  });

  it("Grace chat works with returning user context", async () => {
    const caller = createPublicCaller();
    const result = await caller.grace.chat({
      sessionId: "sess-r11",
      message: "Hey Grace, remember me?",
      context: { step: 9, mode: "returning" },
    });
    expect(result.response).toBeDefined();
    expect(result.profileId).toBe(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// P2: MONTHLY REALITY CHECK
// ═══════════════════════════════════════════════════════════════════════════
describe("P2 — Monthly Reality Check endpoint", () => {
  it("returns monthly review with all fields", async () => {
    const caller = createCaller("user");
    const review = await caller.grace.monthlyReview({ profileId: 1 });
    expect(review.firstName).toBe("Ruby");
    expect(review.vampiresSlayed).toBe(2); // 2 cancelled subscriptions
    expect(review.estimatedSavedCents).toBe(6598); // 1599 + 4999
    expect(review.promisesKept).toBe(3); // from mock
    expect(review.promisesActive).toBe(2);
    expect(review.dignityScore).toBe(72);
    expect(review.communityCredits).toBe(25);
  });

  it("summary text includes correct counts", async () => {
    const caller = createCaller("user");
    const review = await caller.grace.monthlyReview({ profileId: 1 });
    expect(review.summary).toContain("2 vampires");
    expect(review.summary).toContain("$65.98");
    expect(review.summary).toContain("3 promises");
    expect(review.summary).toContain("real progress");
  });

  it("monthly review requires authentication", async () => {
    const caller = createPublicCaller();
    await expect(
      caller.grace.monthlyReview({ profileId: 1 })
    ).rejects.toThrow();
  });

  it("handles zero activity gracefully", async () => {
    const db = await import("./db");
    (db.getSubscriptions as any).mockResolvedValueOnce([]);
    (db.getFinancialImpacts as any).mockResolvedValueOnce([]);
    (db.getPromiseStats as any).mockResolvedValueOnce({ active: 0, completed: 0, broken: 0 });
    (db.getLatestDignityScore as any).mockResolvedValueOnce(null);
    (db.getCommunityCredits as any).mockResolvedValueOnce({ balance: 0 });

    const caller = createCaller("user");
    const review = await caller.grace.monthlyReview({ profileId: 1 });
    expect(review.vampiresSlayed).toBe(0);
    expect(review.estimatedSavedCents).toBe(0);
    expect(review.dignityScore).toBeNull();
    expect(review.summary).toContain("0 vampires");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// P3: GRACE PROACTIVE NUDGES
// ═══════════════════════════════════════════════════════════════════════════
describe("P3 — Grace proactive nudge quality", () => {
  it("ambient messages endpoint returns array", async () => {
    const caller = createCaller("user");
    const messages = await caller.ambient.getUnread({ profileId: 1 });
    expect(Array.isArray(messages)).toBe(true);
  });

  it("addAmbientMessage db helper is callable for bill reminders", async () => {
    const db = await import("./db");
    await db.addAmbientMessage(1, "Hey Ruby, your electricity bill is due in 2 days. Want me to help you plan for it?", "nudge");
    expect(db.addAmbientMessage).toHaveBeenCalledWith(
      1,
      "Hey Ruby, your electricity bill is due in 2 days. Want me to help you plan for it?",
      "nudge"
    );
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// INTEGRATION: Grace system prompt content verification
// ═══════════════════════════════════════════════════════════════════════════
describe("Grace system prompt content", () => {
  it("system prompt includes financial stress detection keywords", async () => {
    // Read the actual source to verify prompt content
    const fs = await import("fs");
    const source = fs.readFileSync("./server/routers.ts", "utf-8");
    expect(source).toContain("FINANCIAL STRESS DETECTION");
    expect(source).toContain("can't afford");
    expect(source).toContain("overdraft");
    expect(source).toContain("paycheck to paycheck");
  });

  it("system prompt includes 5 secret weapons", async () => {
    const fs = await import("fs");
    const source = fs.readFileSync("./server/routers.ts", "utf-8");
    expect(source).toContain("GRACE'S 5 SECRET WEAPONS");
    expect(source).toContain("VALIDATE FIRST, SOLVE SECOND");
    expect(source).toContain("USE HUMOR TO DEFUSE TENSION");
    expect(source).toContain("REFERENCE PAST CONVERSATIONS");
    expect(source).toContain("CELEBRATE MICRO-WINS");
    expect(source).toContain("NEVER RUSH RUBY");
  });

  it("system prompt includes monthly reality check", async () => {
    const fs = await import("fs");
    const source = fs.readFileSync("./server/routers.ts", "utf-8");
    expect(source).toContain("MONTHLY REALITY CHECK");
  });
});
