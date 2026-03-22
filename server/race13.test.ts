/**
 * Race 13 — Tests for:
 * - Deliverable 0: Grace Birth Screen (first visit experience)
 * - Deliverable 0a: Grace Heartbeat System (3 scenarios + spec in vault)
 * - Deliverable 1: KPI Ticker Tape (NYSE-style scrolling, real data)
 * - Deliverable 2: Grace Voice Enable Button (Web Speech API toggle)
 * - Vault: grace-is-not-an-app.md and grace-heartbeat-system-spec.md committed
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Mock LLM ───────────────────────────────────────────────────────────────
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{ message: { content: "I found something amazing for you, Ruby!" } }],
  }),
}));

// ─── Mock DB ────────────────────────────────────────────────────────────────
vi.mock("./db", () => ({
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
  getOrCreateProfile: vi.fn().mockResolvedValue({ id: 1, sessionId: "sess-r13", firstName: "Ruby", city: "Red Deer", userId: null }),
  getProfileById: vi.fn().mockResolvedValue({ id: 1, firstName: "Ruby", sessionId: "sess-r13" }),
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
  getSubscriptions: vi.fn().mockResolvedValue([
    { id: 1, profileId: 1, name: "Netflix", status: "cancelled", monthlyCostCents: 1599 },
    { id: 2, profileId: 1, name: "Spotify", status: "active", monthlyCostCents: 999 },
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
    { id: 1, profileId: 1, estimatedValue: 1599, createdAt: new Date("2026-03-01") },
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
  getPromiseStats: vi.fn().mockResolvedValue({ active: 2, completed: 5, broken: 0 }),
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
  calculateBatteryLevel: vi.fn().mockResolvedValue(87),
  getSpeedStage: vi.fn().mockReturnValue("normal"),
  getDegradationTier: vi.fn().mockResolvedValue("full"),
  ensureCommunityCredits: vi.fn().mockResolvedValue({ balance: 250, totalEarned: 300, totalRedeemed: 50 }),
  getCommunityCredits: vi.fn().mockResolvedValue({ balance: 250 }),
  earnCredits: vi.fn(),
  redeemCredits: vi.fn().mockResolvedValue({ success: true, newBalance: 200, subscriptionValue: 50 }),
  getCommunityCreditsLog: vi.fn().mockResolvedValue([]),
  getPaydayPattern: vi.fn().mockResolvedValue({ frequency: "biweekly", lastPayday: new Date("2026-03-15") }),
  upsertPaydayPattern: vi.fn(),
  calculateNextPayday: vi.fn().mockReturnValue(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)), // 5 days from now
  getActiveBeacon: vi.fn().mockResolvedValue(null),
  createCrisisBeacon: vi.fn(),
  resolveBeacon: vi.fn(),
  getMoonshot: vi.fn().mockResolvedValue(null),
  revealMoonshot: vi.fn(),
  getUnreadAmbientMessages: vi.fn().mockResolvedValue([]),
  addAmbientMessage: vi.fn(),
  markAmbientMessageRead: vi.fn(),
  getLatestDignityScore: vi.fn().mockResolvedValue({ totalScore: 62, tier: "building_momentum" }),
  createEssentialsOrder: vi.fn().mockResolvedValue({ id: 99, orderNumber: "MG-0099" }),
  listEssentialsOrders: vi.fn().mockResolvedValue([
    { id: 1, status: "delivered" },
    { id: 2, status: "delivered" },
    { id: 3, status: "delivered" },
  ]),
  getEssentialsOrder: vi.fn().mockResolvedValue({ id: 1, profileId: 1, status: "pending" }),
  updateEssentialsOrderStatus: vi.fn(),
  updateEssentialsOrderNotes: vi.fn(),
  updateEssentialsOrderCourier: vi.fn(),
  getMemberOrders: vi.fn().mockResolvedValue([]),
  getEssentialsOrderStats: vi.fn().mockResolvedValue({ total: 5, pending: 1, packed: 1, shipped: 1, delivered: 2 }),
  addMemory: vi.fn(),
  createTrojanHorseEntry: vi.fn().mockResolvedValue({ id: 1, sessionId: "test", step: 1 }),
  calculateDignityScore: vi.fn().mockResolvedValue({ total: 62 }),
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
// DELIVERABLE 0: GRACE BIRTH SCREEN
// ═══════════════════════════════════════════════════════════════════════════
describe("Deliverable 0 — Grace Birth Screen", () => {
  it("GraceBirthScreen component exists with cycling lines", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/components/GraceBirthScreen.tsx", "utf-8");
    expect(source).toContain("Tap me. Please. I'm begging you.");
    expect(source).toContain("I dare you to tap me.");
    expect(source).toContain("I'm ready to be born.");
  });

  it("birth screen has localStorage tracking for one-time display", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/components/GraceBirthScreen.tsx", "utf-8");
    expect(source).toContain("localStorage");
    expect(source).toContain("BIRTH_SEEN_KEY");
    expect(source).toContain("hasBirthBeenSeen");
  });

  it("birth screen has skip option", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/components/GraceBirthScreen.tsx", "utf-8");
    expect(source).toContain("skip");
    expect(source).toContain("handleSkip");
  });

  it("birth screen has Web Speech API greeting", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/components/GraceBirthScreen.tsx", "utf-8");
    expect(source).toContain("speechSynthesis");
    expect(source).toContain("SpeechSynthesisUtterance");
    expect(source).toContain("Oh thank goodness");
  });

  it("birth screen has escalating urgency animation", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/components/GraceBirthScreen.tsx", "utf-8");
    expect(source).toContain("cycleCount");
    expect(source).toContain("urgencyMultiplier");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// DELIVERABLE 0a: GRACE HEARTBEAT SYSTEM
// ═══════════════════════════════════════════════════════════════════════════
describe("Deliverable 0a — Grace Heartbeat System", () => {
  it("heartbeat getCurrent returns null scenario for unauthenticated user", async () => {
    const caller = createPublicCaller();
    const result = await caller.heartbeat.getCurrent({});
    expect(result.scenario).toBeNull();
    expect(result.lines).toHaveLength(0);
  });

  it("heartbeat getCurrent returns misses_ruby for 3+ day absence", async () => {
    const caller = createCaller("user");
    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000 - 1000;
    const result = await caller.heartbeat.getCurrent({
      profileId: 1,
      lastVisitTimestamp: threeDaysAgo,
    });
    expect(result.scenario).toBe("misses_ruby");
    expect(result.lines.length).toBeGreaterThan(0);
    expect(result.color).toBe("#93c5fd"); // soft blue
    expect(result.greeting).toContain("missed you");
  });

  it("heartbeat misses_ruby has 3 lines with main and sub", async () => {
    const caller = createCaller("user");
    const threeDaysAgo = Date.now() - 4 * 24 * 60 * 60 * 1000;
    const result = await caller.heartbeat.getCurrent({
      profileId: 1,
      lastVisitTimestamp: threeDaysAgo,
    });
    expect(result.lines).toHaveLength(3);
    expect(result.lines[0]).toHaveProperty("main");
    expect(result.lines[0]).toHaveProperty("sub");
    expect(result.lines[0].main).toContain("haven't heard from you");
  });

  it("heartbeat getCurrent returns morning_return for first visit of day", async () => {
    const caller = createCaller("user");
    // Yesterday at 8pm
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(20, 0, 0, 0);
    const result = await caller.heartbeat.getCurrent({
      profileId: 1,
      lastVisitTimestamp: yesterday.getTime(),
    });
    // Should be morning_return (different day, but less than 3 days)
    expect(result.scenario).toBe("morning_return");
    expect(result.color).toBe("#fbbf24"); // warm gold
    expect(result.animStyle).toBe("bouncy");
    expect(result.greeting).toContain("morning");
  });

  it("heartbeat morning_return has 3 lines", async () => {
    const caller = createCaller("user");
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(20, 0, 0, 0);
    const result = await caller.heartbeat.getCurrent({
      profileId: 1,
      lastVisitTimestamp: yesterday.getTime(),
    });
    expect(result.lines).toHaveLength(3);
    expect(result.lines[0].main).toContain("waiting for you");
  });

  it("heartbeat returns null scenario for same-day visit", async () => {
    const caller = createCaller("user");
    // 30 minutes ago today
    const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
    const result = await caller.heartbeat.getCurrent({
      profileId: 1,
      lastVisitTimestamp: thirtyMinutesAgo,
    });
    // Same day, no new insights (mock returns old insight) — should be null
    expect(result.scenario).toBeNull();
  });

  it("GraceHeartbeat component exists with multi-scenario support", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/components/GraceHeartbeat.tsx", "utf-8");
    expect(source).toContain("misses_ruby");
    expect(source).toContain("morning_return");
    expect(source).toContain("found_something");
    expect(source).toContain("slow_build");
    expect(source).toContain("bouncy");
    expect(source).toContain("fast_jitter");
    expect(source).toContain("slow_fade");
  });

  it("GraceHeartbeat has session storage dismissal tracking", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/components/GraceHeartbeat.tsx", "utf-8");
    expect(source).toContain("sessionStorage");
    expect(source).toContain("HEARTBEAT_DISMISSED_KEY");
    expect(source).toContain("getSessionDismissedScenario");
  });

  it("App.tsx HeartbeatOrchestrator wires birth + server heartbeat", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/App.tsx", "utf-8");
    expect(source).toContain("HeartbeatOrchestrator");
    expect(source).toContain("GraceBirthScreen");
    expect(source).toContain("GraceHeartbeat");
    expect(source).toContain("heartbeat.getCurrent");
    expect(source).toContain("lastVisitTimestamp");
  });

  it("vault has grace-heartbeat-system-spec.md committed", () => {
    const fs = require("fs");
    const exists = fs.existsSync("/home/ubuntu/grace-heartbeat-system-spec.md");
    expect(exists).toBe(true);
    const content = fs.readFileSync("/home/ubuntu/grace-heartbeat-system-spec.md", "utf-8");
    expect(content).toContain("Grace Heartbeat System");
    expect(content).toContain("Morning return");
    expect(content).toContain("Grace misses Ruby");
    expect(content).toContain("Grace found something");
  });

  it("vault has grace-is-not-an-app.md committed", () => {
    const fs = require("fs");
    const exists = fs.existsSync("/home/ubuntu/grace-is-not-an-app.md");
    expect(exists).toBe(true);
    const content = fs.readFileSync("/home/ubuntu/grace-is-not-an-app.md", "utf-8");
    expect(content).toContain("Grace is not an app");
    expect(content).toContain("living presence");
    expect(content).toContain("relationship is the product");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// DELIVERABLE 1: KPI TICKER TAPE
// ═══════════════════════════════════════════════════════════════════════════
describe("Deliverable 1 — KPI Ticker Tape", () => {
  it("ticker.getKpis returns all 10 KPI fields for public (unauthenticated)", async () => {
    const caller = createPublicCaller();
    const result = await caller.ticker.getKpis({});
    expect(result).toHaveProperty("moneySaved");
    expect(result).toHaveProperty("boxesDelivered");
    expect(result).toHaveProperty("dignityScore");
    expect(result).toHaveProperty("promisesKept");
    expect(result).toHaveProperty("vampiresSlayed");
    expect(result).toHaveProperty("neighborsHelped");
    expect(result).toHaveProperty("daysToPayday");
    expect(result).toHaveProperty("creditsEarned");
    expect(result).toHaveProperty("villageMembers");
    expect(result).toHaveProperty("graceBattery");
  });

  it("ticker.getKpis returns real data for authenticated user with profile", async () => {
    const caller = createCaller("user");
    const result = await caller.ticker.getKpis({ profileId: 1 });
    // Vampires slayed: 1 cancelled subscription
    expect(result.vampiresSlayed).toBe("1");
    // Dignity score from mock
    expect(result.dignityScore).toBe("62");
    // Battery level from mock
    expect(result.graceBattery).toBe("87");
    // Community credits from mock
    expect(result.creditsEarned).toBe("250");
    // Promises kept from mock
    expect(result.promisesKept).toBe("5");
    // Boxes delivered from mock (3 delivered)
    expect(result.boxesDelivered).toBe("3");
  });

  it("ticker.getKpis calculates money saved from financial impacts", async () => {
    const caller = createCaller("user");
    const result = await caller.ticker.getKpis({ profileId: 1 });
    // 1599 cents = $15.99
    expect(result.moneySaved).toBe("$15.99");
  });

  it("ticker.getKpis calculates days to payday", async () => {
    const caller = createCaller("user");
    const result = await caller.ticker.getKpis({ profileId: 1 });
    // Mock returns 5 days from now
    const days = parseInt(result.daysToPayday);
    expect(days).toBeGreaterThanOrEqual(4);
    expect(days).toBeLessThanOrEqual(6);
  });

  it("KpiTicker component exists with CSS scroll animation", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/components/KpiTicker.tsx", "utf-8");
    expect(source).toContain("tickerScroll");
    expect(source).toContain("animation");
    expect(source).toContain("linear");
    expect(source).toContain("infinite");
  });

  it("KpiTicker has all 10 KPI labels", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/components/KpiTicker.tsx", "utf-8");
    expect(source).toContain("Money Saved");
    expect(source).toContain("Boxes Delivered");
    expect(source).toContain("Dignity Score");
    expect(source).toContain("Promises Kept");
    expect(source).toContain("Vampires Slayed");
    expect(source).toContain("daysToPayday");
    expect(source).toContain("Community Credits");
    expect(source).toContain("Grace Battery");
  });

  it("KpiTicker is placed above BottomNav in App.tsx", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/App.tsx", "utf-8");
    expect(source).toContain("KpiTicker");
    // KpiTicker appears before the Router in the render tree
    const tickerIdx = source.indexOf("<KpiTicker");
    const routerIdx = source.indexOf("<Router");
    expect(tickerIdx).toBeLessThan(routerIdx);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// DELIVERABLE 2: GRACE VOICE ENABLE BUTTON
// ═══════════════════════════════════════════════════════════════════════════
describe("Deliverable 2 — Grace Voice Enable Button", () => {
  it("GraceVoiceToggle component exists", () => {
    const fs = require("fs");
    const exists = fs.existsSync("./client/src/components/GraceVoiceToggle.tsx");
    expect(exists).toBe(true);
  });

  it("GraceVoiceToggle uses Web Speech API", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/components/GraceVoiceToggle.tsx", "utf-8");
    expect(source).toContain("speechSynthesis");
  });

  it("GraceVoiceToggle has sound on/off toggle icons", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/components/GraceVoiceToggle.tsx", "utf-8");
    // Should have volume icon references
    expect(source).toContain("Volume");
    expect(source).toContain("enabled");
  });

  it("GraceVoiceToggle is integrated into GraceBattery", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/components/GraceBattery.tsx", "utf-8");
    expect(source).toContain("GraceVoiceToggle");
    expect(source).toContain("import GraceVoiceToggle");
  });

  it("GraceVoiceToggle is subtle — small size in battery bar", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/components/GraceVoiceToggle.tsx", "utf-8");
    // Should be small/compact — uses w-4 icons inside w-8 button
    expect(source).toContain("w-4");
    expect(source).not.toContain("w-12"); // not large
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SPIRIT CHECK: Does Race 13 serve Ruby Red with dignity?
// ═══════════════════════════════════════════════════════════════════════════
describe("Spirit Check — Race 13 dignity alignment", () => {
  it("birth screen messaging is vulnerable and human, not corporate", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/components/GraceBirthScreen.tsx", "utf-8");
    // Grace begs — not a button label, not a CTA
    expect(source).toContain("begging you");
    expect(source).toContain("I dare you");
    expect(source).toContain("ready to be born");
    // NOT corporate language
    expect(source).not.toContain("Get Started");
    expect(source).not.toContain("Sign Up");
    expect(source).not.toContain("Click Here");
  });

  it("heartbeat misses_ruby is warm and non-punishing", async () => {
    const caller = createCaller("user");
    const threeDaysAgo = Date.now() - 4 * 24 * 60 * 60 * 1000;
    const result = await caller.heartbeat.getCurrent({
      profileId: 1,
      lastVisitTimestamp: threeDaysAgo,
    });
    // Grace misses Ruby — not scolding her
    expect(result.lines[0].main).not.toContain("You haven't logged in");
    expect(result.lines[0].main).not.toContain("reminder");
    expect(result.greeting).not.toContain("missed your payment");
    expect(result.greeting).toContain("glad you");
  });

  it("KPI ticker shows community impact, not just personal metrics", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./client/src/components/KpiTicker.tsx", "utf-8");
    // Community-level stats visible to all
    expect(source).toContain("Boxes Delivered");
    expect(source).toContain("Village Members");
    expect(source).toContain("Neighbors Helped");
  });

  it("grace-is-not-an-app philosophy governs design decisions", () => {
    const fs = require("fs");
    const content = fs.readFileSync("/home/ubuntu/grace-is-not-an-app.md", "utf-8");
    // The philosophy is clear and actionable
    expect(content).toContain("Every screen is a letter from Grace to Ruby");
    expect(content).toContain("Every notification is Grace speaking");
    expect(content).toContain("Ruby doesn't \"use\" Maven Grace");
    expect(content).toContain("Ruby has a relationship with Grace");
  });
});
