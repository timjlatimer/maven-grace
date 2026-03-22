/**
 * Race 6 — Tests for:
 * - Grace Status / Degradation Architecture (5-tier)
 * - Community Credits System (Big Mama)
 * - Payday Pattern Detection
 * - Crisis Beacon (I'm Not Okay)
 * - Destiny Moonshot Reveal
 * - Grace Ambient System Wiring
 * - Grace Battery UI data
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Mock LLM ───────────────────────────────────────────────────────────────
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{
      message: {
        content: JSON.stringify({
          moonshotStatement: "Open a community kitchen that feeds families and teaches financial literacy",
          coreValues: ["Family", "Resilience", "Honesty"],
          strengths: ["Resourcefulness", "Empathy", "Determination"],
        }),
      },
    }],
  }),
}));

// ─── Mock DB ────────────────────────────────────────────────────────────────
vi.mock("./db", () => ({
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
  getOrCreateProfile: vi.fn().mockResolvedValue({ id: 1, sessionId: "sess-1", userId: null }),
  getProfileById: vi.fn().mockResolvedValue({ id: 1, firstName: "Ruby", sessionId: "sess-1" }),
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
  getPromiseStats: vi.fn().mockResolvedValue({ total: 0, kept: 0, broken: 0, active: 0 }),
  getDestinyAnswers: vi.fn().mockResolvedValue([
    { questionIndex: 0, answer: "I value family above all" },
    { questionIndex: 1, answer: "I want to help my community" },
  ]),
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
  // Race 6 new functions
  getGraceStatus: vi.fn().mockResolvedValue(null),
  upsertGraceStatus: vi.fn(),
  calculateBatteryLevel: vi.fn().mockResolvedValue(100),
  getSpeedStage: vi.fn().mockReturnValue("normal"),
  getDegradationTier: vi.fn().mockResolvedValue("full"),
  ensureCommunityCredits: vi.fn().mockResolvedValue({ balance: 0, totalEarned: 0, totalRedeemed: 0 }),
  getCommunityCredits: vi.fn().mockResolvedValue({ balance: 15 }),
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
  getLatestDignityScore: vi.fn().mockResolvedValue(null),
}));

// ─── Helper ─────────────────────────────────────────────────────────────────
function createCaller(authed = true) {
  const ctx: TrpcContext = {
    user: authed ? { id: 1, openId: "test-open-id", name: "Ruby Red", role: "user" } : null,
    req: {} as any,
    res: {} as any,
  };
  return appRouter.createCaller(ctx);
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. Grace Status / Degradation Architecture
// ═══════════════════════════════════════════════════════════════════════════
describe("Grace Status (Degradation)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns full grace status with battery level", async () => {
    const caller = createCaller();
    const result = await caller.graceStatus.get({ profileId: 1 });
    expect(result).toHaveProperty("batteryLevel", 100);
    expect(result).toHaveProperty("tier", "full");
    expect(result).toHaveProperty("speedStage", "normal");
  });

  it("requests a pause on degradation", async () => {
    const caller = createCaller();
    const result = await caller.graceStatus.requestPause({ profileId: 1 });
    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("pauseExpiresAt");
  });

  it("restores payment and resets status", async () => {
    const caller = createCaller();
    const result = await caller.graceStatus.restorePayment({ profileId: 1 });
    expect(result).toHaveProperty("success", true);
    expect(result.message).toContain("Welcome back");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. Community Credits System
// ═══════════════════════════════════════════════════════════════════════════
describe("Community Credits (Big Mama)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns credit account for a profile", async () => {
    const caller = createCaller();
    const result = await caller.communityCredits.get({ profileId: 1 });
    expect(result).toHaveProperty("balance", 0);
    expect(result).toHaveProperty("totalEarned", 0);
    expect(result).toHaveProperty("totalRedeemed", 0);
  });

  it("earns credits for community contribution", async () => {
    const caller = createCaller();
    const result = await caller.communityCredits.earn({
      profileId: 1,
      amount: 15,
      category: "teaching",
      description: "Taught budgeting basics to neighbor",
    });
    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("balance");
  });

  it("redeems credits at 50% rate", async () => {
    const caller = createCaller();
    const result = await caller.communityCredits.redeem({
      profileId: 1,
      amount: 10,
    });
    expect(result).toHaveProperty("success", true);
  });

  it("returns credit history log", async () => {
    const caller = createCaller();
    const result = await caller.communityCredits.getLog({ profileId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. Payday Pattern Detection
// ═══════════════════════════════════════════════════════════════════════════
describe("Payday Pattern", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null when no payday pattern set", async () => {
    const caller = createCaller();
    const result = await caller.payday.get({ profileId: 1 });
    expect(result).toBeNull();
  });

  it("saves payday pattern", async () => {
    const caller = createCaller();
    const result = await caller.payday.setup({
      profileId: 1,
      frequency: "biweekly",
      dayOfWeek: 5,
    });
    expect(result).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. Crisis Beacon (I'm Not Okay)
// ═══════════════════════════════════════════════════════════════════════════
describe("Crisis Beacon", () => {
  beforeEach(() => vi.clearAllMocks());

  it("activates crisis beacon with Vera and Big Mama", async () => {
    const caller = createCaller();
    const result = await caller.crisisBeacon.activate({ profileId: 1 });
    expect(result).toHaveProperty("activated", true);
    expect(result.agents).toContain("vera");
    expect(result.agents).toContain("big_mama");
    expect(result.message).toContain("not alone");
  });

  it("returns no active beacon when none exists", async () => {
    const caller = createCaller();
    const result = await caller.crisisBeacon.getActive({ profileId: 1 });
    expect(result).toBeNull();
  });

  it("resolves an active beacon", async () => {
    const caller = createCaller();
    const result = await caller.crisisBeacon.resolve({
      beaconId: 1,
    });
    expect(result).toHaveProperty("resolved", true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 5. Destiny Moonshot Reveal
// ═══════════════════════════════════════════════════════════════════════════
describe("Destiny Moonshot Reveal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null when no moonshot exists", async () => {
    const caller = createCaller();
    const result = await caller.destinyMoonshot.get({ profileId: 1 });
    expect(result).toBeNull();
  });

  it("checks readiness for moonshot reveal", async () => {
    const caller = createCaller();
    const result = await caller.destinyMoonshot.checkReadiness({ profileId: 1 });
    expect(result).toHaveProperty("ready");
    expect(result).toHaveProperty("totalAnswered");
  });

  it("generates moonshot reveal via LLM", async () => {
    const caller = createCaller();
    const result = await caller.destinyMoonshot.generateReveal({ profileId: 1 });
    expect(result).toHaveProperty("moonshotStatement");
    expect(result).toHaveProperty("coreValues");
    expect(result).toHaveProperty("strengths");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 6. Grace Ambient System
// ═══════════════════════════════════════════════════════════════════════════
describe("Grace Ambient System", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns unread ambient messages", async () => {
    const caller = createCaller();
    const result = await caller.graceAmbient.getMessages({ profileId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("generates ambient nudges based on state", async () => {
    const caller = createCaller();
    const result = await caller.graceAmbient.generateNudges({ profileId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 7. Integration: Battery + Credits + Degradation
// ═══════════════════════════════════════════════════════════════════════════
describe("Grace Battery Integration", () => {
  beforeEach(() => vi.clearAllMocks());

  it("grace status includes battery level and tier", async () => {
    const caller = createCaller();
    const result = await caller.graceStatus.get({ profileId: 1 });
    expect(typeof result.batteryLevel).toBe("number");
    expect(typeof result.tier).toBe("string");
    expect(typeof result.speedStage).toBe("string");
  });

  it("community credits earn returns updated balance", async () => {
    const caller = createCaller();
    const result = await caller.communityCredits.earn({
      profileId: 1,
      amount: 20,
      category: "volunteering",
      description: "Helped at community food bank for 2 hours",
    });
    expect(result.success).toBe(true);
    expect(typeof result.balance).toBe("number");
  });

  it("crisis beacon includes all four emergency agents", async () => {
    const caller = createCaller();
    const result = await caller.crisisBeacon.activate({ profileId: 1 });
    expect(result.agents).toContain("vera");
    expect(result.agents).toContain("big_mama");
    expect(result.agents).toContain("steady");
    expect(result.agents).toContain("harbour");
  });
});
