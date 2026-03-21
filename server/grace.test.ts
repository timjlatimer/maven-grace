import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the LLM to avoid real API calls in tests
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    id: "test",
    created: Date.now(),
    model: "test",
    choices: [{
      index: 0,
      message: {
        role: "assistant",
        content: "Hey there, neighbor! I'm Grace. What's your name?"
      },
      finish_reason: "stop"
    }]
  })
}));

// Mock db functions
vi.mock("./db", () => ({
  getOrCreateProfile: vi.fn().mockResolvedValue({
    id: 1,
    sessionId: "test-session",
    firstName: null,
    lastName: null,
    province: null,
    city: null,
    email: null,
    phone: null,
    address: null,
    postalCode: null,
    kidsCount: null,
    kidsNames: null,
    financialSituation: null,
    biggestChallenge: null,
    interests: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: null,
  }),
  updateProfile: vi.fn().mockResolvedValue(undefined),
  getProfileById: vi.fn().mockResolvedValue({
    id: 1, sessionId: "test-session", firstName: "Ruby"
  }),
  addMemory: vi.fn().mockResolvedValue(undefined),
  getMemories: vi.fn().mockResolvedValue([]),
  saveConversationMessage: vi.fn().mockResolvedValue(undefined),
  getConversationHistory: vi.fn().mockResolvedValue([]),
  createTrojanHorseEntry: vi.fn().mockResolvedValue({
    id: 1, profileId: 1, sessionId: "test-session", currentStep: 1, status: "in_progress"
  }),
  updateTrojanHorseEntry: vi.fn().mockResolvedValue(undefined),
  getTrojanHorseEntry: vi.fn().mockResolvedValue(null),
  createSong: vi.fn().mockResolvedValue({ id: 1, profileId: 1, status: "generating" }),
  updateSong: vi.fn().mockResolvedValue(undefined),
  getSongsByProfile: vi.fn().mockResolvedValue([]),
  addFinancialImpact: vi.fn().mockResolvedValue(undefined),
  getFinancialImpacts: vi.fn().mockResolvedValue([]),
  getFinancialSummary: vi.fn().mockResolvedValue({ total: 1500, byCategory: { subscription_cancelled: 1200, nsf_avoided: 300 }, count: 2 }),
  addSubscription: vi.fn().mockResolvedValue({ id: 1, profileId: 1, name: "Netflix", monthlyCost: 1599 }),
  getSubscriptions: vi.fn().mockResolvedValue([]),
  updateSubscription: vi.fn().mockResolvedValue(undefined),
  getJourneyMilestones: vi.fn().mockResolvedValue([
    { id: 1, profileId: 1, day: 0, milestoneName: "Welcome Gift", completed: true, completedAt: new Date() },
    { id: 2, profileId: 1, day: 3, milestoneName: "Your Song", completed: false, completedAt: null },
  ]),
  initializeJourney: vi.fn().mockResolvedValue(undefined),
  completeMilestone: vi.fn().mockResolvedValue(undefined),
  addAmbientMessage: vi.fn().mockResolvedValue(undefined),
  getUnreadAmbientMessages: vi.fn().mockResolvedValue([]),
  markAmbientMessageRead: vi.fn().mockResolvedValue(undefined),
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn().mockResolvedValue(undefined),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("Grace Chat", () => {
  it("sends a message and gets a response", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.grace.chat({
      sessionId: "test-session",
      message: "Hi Grace!",
    });
    expect(result).toHaveProperty("response");
    expect(result).toHaveProperty("profileId");
    expect(typeof result.response).toBe("string");
    expect(result.response.length).toBeGreaterThan(0);
  });

  it("gets or creates a profile", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const profile = await caller.grace.getProfile({ sessionId: "test-session" });
    expect(profile).toHaveProperty("id");
    expect(profile?.sessionId).toBe("test-session");
  });

  it("updates a profile", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.grace.updateProfile({
      profileId: 1,
      data: { firstName: "Ruby", city: "Edmonton" },
    });
    expect(result.success).toBe(true);
  });
});

describe("Trojan Horse", () => {
  it("starts a trojan horse entry", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.trojanHorse.start({ sessionId: "test-session" });
    expect(result).toHaveProperty("entry");
    expect(result).toHaveProperty("profileId");
    expect(result.entry?.currentStep).toBe(1);
  });

  it("updates a trojan horse step", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.trojanHorse.updateStep({
      entryId: 1,
      step: 3,
    });
    expect(result.success).toBe(true);
  });
});

describe("Financial Impact", () => {
  it("gets financial summary", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const summary = await caller.financial.getSummary({ profileId: 1 });
    expect(summary).toHaveProperty("total");
    expect(summary).toHaveProperty("byCategory");
    expect(summary.total).toBe(1500);
  });

  it("adds a financial impact", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.financial.addImpact({
      profileId: 1,
      category: "subscription_cancelled",
      description: "Cancelled Netflix",
      estimatedValue: 1599,
    });
    expect(result.success).toBe(true);
  });
});

describe("Vampire Slayer", () => {
  it("adds a subscription", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.vampireSlayer.addSubscription({
      profileId: 1,
      name: "Netflix",
      monthlyCost: 1599,
    });
    expect(result).toHaveProperty("id");
    expect(result?.name).toBe("Netflix");
  });
});

describe("Journey Tracker", () => {
  it("gets milestones", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const milestones = await caller.journey.getMilestones({ profileId: 1 });
    expect(milestones.length).toBeGreaterThan(0);
    expect(milestones[0].milestoneName).toBe("Welcome Gift");
  });

  it("completes a milestone", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.journey.completeMilestone({ profileId: 1, day: 0 });
    expect(result.success).toBe(true);
  });

  it("initializes journey", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.journey.initialize({ profileId: 1 });
    expect(result.success).toBe(true);
  });
});

describe("Ambient Messages", () => {
  it("gets unread messages", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const messages = await caller.ambient.getUnread({ profileId: 1 });
    expect(Array.isArray(messages)).toBe(true);
  });
});
