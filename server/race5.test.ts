/**
 * Race 5 — Tests for:
 * - Dignity Score composite metric
 * - Promises to Keep (PTK) Genie
 * - Destiny Discovery
 * - Jolene the Journalist (Story Library)
 * - AI Village Naming Convention
 * - Milk Money Nudges
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
          title: "The Day She Said Enough",
          content: "Ruby stood at the kitchen counter, staring at the stack of bills...",
          greatQuote: "Sometimes the bravest thing is just showing up.",
          grade: "A",
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
  getMemories: vi.fn().mockResolvedValue([{ id: 1, fact: "Lives in Ontario", category: "personal" }]),
  getMembership: vi.fn().mockResolvedValue(null),
  upsertMembership: vi.fn(),
  getMilkMoneyAccount: vi.fn().mockResolvedValue({
    id: 1, profileId: 1, tier: "rookie", creditLimitCents: 2000,
    currentBalanceCents: 0, totalBorrowedCents: 0, totalRepaidCents: 0,
    onTimeRepayments: 0, lateRepayments: 0, trustScore: 0, isEligible: true, frozenReason: null,
  }),
  createMilkMoneyAccount: vi.fn(),
  updateMilkMoneyAccount: vi.fn(),
  addMilkMoneyTransaction: vi.fn().mockResolvedValue({ id: 1 }),
  getMilkMoneyTransactions: vi.fn().mockResolvedValue([]),
  createAnthemShareToken: vi.fn(),
  getAnthemShareToken: vi.fn(),
  incrementShareTokenView: vi.fn(),
  getAdminStats: vi.fn().mockResolvedValue({ totalMembers: 0, totalLiftCents: 0, activeMemberships: 0 }),
  // ─── Race 5 mocks ──────────────────────────────────────────────────────
  calculateDignityScore: vi.fn().mockResolvedValue({
    id: 1, profileId: 1, totalScore: 42, tier: "building_momentum",
    vampireSlayer: 12, nsfShield: 8, budgetMastery: 10, milkMoneyTrust: 6, engagement: 6,
    calculatedAt: Date.now(),
  }),
  getLatestDignityScore: vi.fn().mockResolvedValue({
    id: 1, profileId: 1, totalScore: 42, tier: "building_momentum",
    vampireSlayer: 12, nsfShield: 8, budgetMastery: 10, milkMoneyTrust: 6, engagement: 6,
    calculatedAt: Date.now(),
  }),
  getDignityScoreHistory: vi.fn().mockResolvedValue([
    { totalScore: 30, calculatedAt: Date.now() - 86400000 },
    { totalScore: 42, calculatedAt: Date.now() },
  ]),
  createPromise: vi.fn().mockResolvedValue({ id: 1, description: "Pay rent on time", direction: "made_by_ruby", status: "active" }),
  getPromises: vi.fn().mockResolvedValue([
    { id: 1, description: "Pay rent on time", direction: "made_by_ruby", status: "active", category: "payment", commitmentScore: 85 },
    { id: 2, description: "Landlord will fix the heater", direction: "made_to_ruby", status: "active", category: "general", commitmentScore: 60 },
  ]),
  updatePromise: vi.fn().mockResolvedValue({ id: 1, status: "completed" }),
  getPromiseStats: vi.fn().mockResolvedValue({ active: 2, completed: 5, broken: 1 }),
  addDestinyAnswer: vi.fn().mockResolvedValue({ id: 1 }),
  getDestinyAnswers: vi.fn().mockResolvedValue([
    { id: 1, questionNumber: 1, question: "Where did you grow up?", answer: "Small town in Ontario", wave: "safe" },
  ]),
  getDestinyProgress: vi.fn().mockResolvedValue({ answered: 1, total: 30, currentWave: "safe" }),
  upsertDestinySynthesis: vi.fn().mockResolvedValue({ id: 1 }),
  getDestinySynthesis: vi.fn().mockResolvedValue(null),
  createStory: vi.fn().mockResolvedValue({
    id: 1, title: "The Day She Said Enough", storyType: "moment", grade: "A",
    content: "Ruby stood at the kitchen counter...",
  }),
  getStories: vi.fn().mockResolvedValue([
    { id: 1, title: "The Day She Said Enough", storyType: "moment", grade: "A", isDelivered: false, visibility: "private", createdAt: Date.now() },
  ]),
  getStoryById: vi.fn().mockResolvedValue({
    id: 1, title: "The Day She Said Enough", content: "Ruby stood at the kitchen counter...",
    storyType: "moment", grade: "A", isDelivered: false, visibility: "private",
  }),
  updateStory: vi.fn().mockResolvedValue({ id: 1 }),
  getCommunityStories: vi.fn().mockResolvedValue([]),
  getAllVillageAgents: vi.fn().mockResolvedValue([
    { id: 1, agentKey: "grace", defaultName: "Grace", category: "inner_circle", description: "Your primary companion" },
    { id: 2, agentKey: "jolene_journalist", defaultName: "Jolene the Journalist", category: "specialist", description: "Storytelling" },
    { id: 3, agentKey: "nana_promise_keeper", defaultName: "Nana the Promise Keeper", category: "specialist", description: "Promise tracking" },
  ]),
  getAgentByKey: vi.fn().mockResolvedValue({ id: 2, agentKey: "jolene_journalist", defaultName: "Jolene the Journalist" }),
  getIntroducedAgents: vi.fn().mockResolvedValue([
    { agent: { agentKey: "grace", defaultName: "Grace", category: "inner_circle", description: "Your primary companion" }, introduction: { customName: null } },
  ]),
  introduceAgent: vi.fn().mockResolvedValue({ id: 1 }),
  renameAgent: vi.fn().mockResolvedValue({ id: 1 }),
  incrementAgentInteraction: vi.fn(),
  getOverdueBorrows: vi.fn().mockResolvedValue([]),
  getUpcomingBorrows: vi.fn().mockResolvedValue([]),
  // ─── Existing mocks needed by router ──────────────────────────────────
  addFinancialImpact: vi.fn(),
  getFinancialImpacts: vi.fn().mockResolvedValue([]),
  getFinancialSummary: vi.fn().mockResolvedValue({ total: 0, byCategory: {} }),
  addGraceMessage: vi.fn().mockResolvedValue({ id: 1 }),
  getGraceMessages: vi.fn().mockResolvedValue([]),
  getRecentGraceContext: vi.fn().mockResolvedValue([]),
  addSubscription: vi.fn(),
  getSubscriptions: vi.fn().mockResolvedValue([]),
  updateSubscription: vi.fn(),
  deleteSubscription: vi.fn(),
  addSong: vi.fn(),
  getSongs: vi.fn().mockResolvedValue([]),
  addJourneyMilestone: vi.fn(),
  getJourneyMilestones: vi.fn().mockResolvedValue([]),
  addAmbientMessage: vi.fn(),
  getUnreadAmbientMessages: vi.fn().mockResolvedValue([]),
  markAmbientMessageRead: vi.fn(),
  addBudgetEntry: vi.fn(),
  getBudgetEntries: vi.fn().mockResolvedValue([]),
  updateBudgetEntry: vi.fn(),
  deleteBudgetEntry: vi.fn(),
  upsertPaycheck: vi.fn(),
  getPaycheck: vi.fn().mockResolvedValue(null),
  addBill: vi.fn(),
  getBills: vi.fn().mockResolvedValue([]),
  updateBill: vi.fn(),
  deleteBill: vi.fn(),
}));

// ─── Helper ─────────────────────────────────────────────────────────────────
const MOCK_USER = { id: 1, openId: "test-open-id", name: "Ruby Red", email: "ruby@test.com", role: "user" as const, avatarUrl: null };

function createCaller(overrides: Partial<TrpcContext> = {}) {
  return appRouter.createCaller({
    user: MOCK_USER,
    req: { headers: { origin: "http://localhost:3000" } } as any,
    res: {} as any,
    ...overrides,
  } as TrpcContext);
}

// ═══════════════════════════════════════════════════════════════════════════
// DIGNITY SCORE
// ═══════════════════════════════════════════════════════════════════════════
describe("Dignity Score", () => {
  it("calculates dignity score for a profile", async () => {
    const caller = createCaller();
    const result = await caller.dignity.calculate({ profileId: 1 });
    expect(result).toBeDefined();
    expect(result.totalScore).toBe(42);
    expect(result.tier).toBe("building_momentum");
  });

  it("returns latest dignity score", async () => {
    const caller = createCaller();
    const result = await caller.dignity.getLatest({ profileId: 1 });
    expect(result).toBeDefined();
    expect(result!.vampireSlayer).toBe(12);
    expect(result!.nsfShield).toBe(8);
  });

  it("returns dignity score history", async () => {
    const caller = createCaller();
    const result = await caller.dignity.getHistory({ profileId: 1, limit: 7 });
    expect(result).toHaveLength(2);
    expect(result[0].totalScore).toBe(30);
    expect(result[1].totalScore).toBe(42);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// PROMISES TO KEEP
// ═══════════════════════════════════════════════════════════════════════════
describe("Promises to Keep (PTK)", () => {
  it("creates a promise made by Ruby", async () => {
    const caller = createCaller();
    const result = await caller.promises.create({
      profileId: 1,
      direction: "made_by_ruby",
      description: "Pay rent on time",
    });
    expect(result).toBeDefined();
    expect(result.direction).toBe("made_by_ruby");
  });

  it("lists promises for a profile", async () => {
    const caller = createCaller();
    const result = await caller.promises.list({ profileId: 1 });
    expect(result).toHaveLength(2);
    expect(result[0].direction).toBe("made_by_ruby");
    expect(result[1].direction).toBe("made_to_ruby");
  });

  it("updates promise status to completed", async () => {
    const caller = createCaller();
    const result = await caller.promises.update({ id: 1, status: "completed" });
    expect(result).toBeDefined();
  });

  it("returns promise stats", async () => {
    const caller = createCaller();
    const result = await caller.promises.stats({ profileId: 1 });
    expect(result.active).toBe(2);
    expect(result.completed).toBe(5);
    expect(result.broken).toBe(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// DESTINY DISCOVERY
// ═══════════════════════════════════════════════════════════════════════════
describe("Destiny Discovery", () => {
  it("asks the next destiny question", async () => {
    const caller = createCaller();
    const result = await caller.destiny.askQuestion({ profileId: 1 });
    expect(result).toBeDefined();
    // Should return a question since only 1 of 30 answered
    expect(result.complete).toBeFalsy();
    expect(result.question).toBeDefined();
    expect(result.question!.number).toBeGreaterThan(0);
  });

  it("answers a destiny question", async () => {
    const caller = createCaller();
    const result = await caller.destiny.answerQuestion({
      profileId: 1,
      questionNumber: 2,
      answer: "I grew up in a small town in Ontario",
    });
    expect(result).toBeDefined();
  });

  it("returns destiny progress", async () => {
    const caller = createCaller();
    const result = await caller.destiny.getProgress({ profileId: 1 });
    expect(result.answered).toBe(1);
    expect(result.total).toBe(30);
    expect(result.currentWave).toBe("safe");
  });

  it("returns destiny answers", async () => {
    const caller = createCaller();
    const result = await caller.destiny.getAnswers({ profileId: 1 });
    expect(result).toHaveLength(1);
    expect(result[0].question).toBe("Where did you grow up?");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// JOLENE THE JOURNALIST (STORY LIBRARY)
// ═══════════════════════════════════════════════════════════════════════════
describe("Jolene the Journalist", () => {
  it("generates a story using LLM", async () => {
    const caller = createCaller();
    const result = await caller.stories.generate({ profileId: 1 });
    expect(result).toBeDefined();
    expect(result.title).toBe("The Day She Said Enough");
    expect(result.grade).toBe("A");
  });

  it("lists stories for a profile", async () => {
    const caller = createCaller();
    const result = await caller.stories.list({ profileId: 1 });
    expect(result).toHaveLength(1);
    expect(result[0].storyType).toBe("moment");
  });

  it("delivers a story (grace reads)", async () => {
    const caller = createCaller();
    const result = await caller.stories.deliver({ id: 1, method: "grace_read" });
    expect(result).toBeDefined();
  });

  it("updates story visibility", async () => {
    const caller = createCaller();
    const result = await caller.stories.updateVisibility({ id: 1, visibility: "community" });
    expect(result).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// AI VILLAGE
// ═══════════════════════════════════════════════════════════════════════════
describe("AI Village", () => {
  it("returns all village agents", async () => {
    const caller = createCaller();
    const result = await caller.village.allAgents();
    expect(result).toHaveLength(3);
    expect(result[0].agentKey).toBe("grace");
  });

  it("returns introduced agents for a profile", async () => {
    const caller = createCaller();
    const result = await caller.village.myAgents({ profileId: 1 });
    expect(result).toHaveLength(1);
    expect(result[0].agent.agentKey).toBe("grace");
  });

  it("introduces a new agent to a profile", async () => {
    const caller = createCaller();
    const result = await caller.village.introduce({ profileId: 1, agentKey: "jolene_journalist" });
    expect(result).toBeDefined();
  });

  it("renames an agent", async () => {
    const caller = createCaller();
    const result = await caller.village.rename({
      profileId: 1,
      agentKey: "jolene_journalist",
      customName: "Jo the Storyteller",
    });
    expect(result).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// MILK MONEY NUDGES
// ═══════════════════════════════════════════════════════════════════════════
describe("Milk Money Nudges", () => {
  it("returns overdue borrows", async () => {
    const caller = createCaller();
    const result = await caller.milkMoneyNudges.getOverdue({ profileId: 1 });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("returns upcoming borrows", async () => {
    const caller = createCaller();
    const result = await caller.milkMoneyNudges.getUpcoming({ profileId: 1 });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});
