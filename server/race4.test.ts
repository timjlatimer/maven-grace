/**
 * Race 4 — Tests for:
 * - Milk Money borrow/repay with trust progression
 * - Stripe checkout session creation
 * - Gift Anthem recipient landing page token lookup
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
  getMilkMoneyAccount: vi.fn().mockResolvedValue({
    id: 1,
    profileId: 1,
    tier: "rookie",
    creditLimitCents: 2000,
    currentBalanceCents: 0,
    totalBorrowedCents: 0,
    totalRepaidCents: 0,
    onTimeRepayments: 0,
    lateRepayments: 0,
    trustScore: 0,
    isEligible: true,
    frozenReason: null,
  }),
  createMilkMoneyAccount: vi.fn().mockResolvedValue({
    id: 1,
    tier: "rookie",
    creditLimitCents: 2000,
    currentBalanceCents: 0,
    trustScore: 0,
  }),
  updateMilkMoneyAccount: vi.fn().mockResolvedValue(undefined),
  addMilkMoneyTransaction: vi.fn().mockResolvedValue({ id: 1 }),
  getMilkMoneyTransactions: vi.fn().mockResolvedValue([]),
  addFinancialImpact: vi.fn().mockResolvedValue(undefined),
  createAnthemShareToken: vi.fn().mockResolvedValue({ token: "anthem_test_abc123" }),
  getAnthemShareToken: vi.fn().mockResolvedValue({
    id: 1,
    token: "anthem_test_abc123",
    songId: 1,
    senderProfileId: 1,
    recipientName: "Sarah",
    recipientMessage: "You're amazing!",
    viewCount: 0,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  }),
  incrementShareTokenView: vi.fn().mockResolvedValue(undefined),
  getAdminStats: vi.fn().mockResolvedValue({
    totalUsers: 10,
    totalMembers: 5,
    totalSongs: 3,
    totalConversations: 25,
    cancelledSubscriptions: 2,
    totalFinancialLiftCents: 150000,
    membershipsByTier: { observer: 2, essentials: 2, plus: 1 },
  }),
  getAllMemberships: vi.fn().mockResolvedValue([]),
  getProfileById: vi.fn().mockResolvedValue({ id: 1, sessionId: "sess-1", firstName: "Ruby" }),
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
  getSongById: vi.fn().mockResolvedValue({
    id: 1,
    profileId: 1,
    title: "Ruby's Song",
    lyrics: "You are strong, you are brave",
    genre: "pop",
    audioUrl: "https://example.com/song.mp3",
  }),
  getFinancialSummary: vi.fn().mockResolvedValue({ totalLift: 0, breakdown: [] }),
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
  getBudgetEntries: vi.fn().mockResolvedValue([]),
  addBudgetEntry: vi.fn().mockResolvedValue({ id: 1 }),
  deleteBudgetEntry: vi.fn().mockResolvedValue(undefined),
  setPaycheck: vi.fn().mockResolvedValue({ id: 1 }),
  getBills: vi.fn().mockResolvedValue([]),
  addBill: vi.fn().mockResolvedValue({ id: 1 }),
  markBillPaid: vi.fn().mockResolvedValue(undefined),
  deleteBill: vi.fn().mockResolvedValue(undefined),
  updateBill: vi.fn().mockResolvedValue(undefined),
}));

// Mock Stripe
vi.mock("./stripe", () => ({
  createCheckoutSession: vi.fn().mockResolvedValue({
    url: "https://checkout.stripe.com/test_session_123",
    sessionId: "cs_test_123",
  }),
  isStripeConfigured: vi.fn().mockReturnValue(true),
  MAVEN_PRODUCTS: {
    essentials: { name: "Maven Essentials", priceId: "price_test_ess", weeklyAmountCents: 599 },
    plus: { name: "Maven Plus", priceId: "price_test_plus", weeklyAmountCents: 1099 },
  },
}));

// Mock LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{ message: { content: '{"facts": []}' } }],
  }),
}));

// Mock KIE.AI
vi.mock("./kieai", () => ({
  textToSpeech: vi.fn().mockResolvedValue("https://example.com/audio.mp3"),
  isKieAiConfigured: vi.fn().mockReturnValue(true),
}));

// Mock voice transcription
vi.mock("./_core/voiceTranscription", () => ({
  transcribeAudio: vi.fn().mockResolvedValue({ text: "Hello Grace" }),
}));

// Mock storage
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ url: "https://cdn.example.com/file.mp3", key: "file.mp3" }),
}));

// ─── Test Context ───────────────────────────────────────────────────────────
function createTestContext(): TrpcContext {
  return {
    user: null,
    req: {
      headers: { host: "localhost:3000", origin: "http://localhost:3000" },
      cookies: {},
    } as any,
    res: {
      cookie: vi.fn(),
      clearCookie: vi.fn(),
    } as any,
  };
}

const caller = appRouter.createCaller(createTestContext());

// ─── MILK MONEY BORROW TESTS ───────────────────────────────────────────────
describe("Milk Money — Borrow", () => {
  it("should borrow money within credit limit", async () => {
    const result = await caller.milkMoney.borrow({
      profileId: 1,
      amountCents: 1000,
      description: "Flat tire",
    });

    expect(result.success).toBe(true);
    expect(result.borrowed).toBe(1000);
    expect(result.dueDate).toBeDefined();
    // Due date should be ~14 days from now
    const dueDate = new Date(result.dueDate);
    const now = new Date();
    const diffDays = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    expect(diffDays).toBeGreaterThan(13);
    expect(diffDays).toBeLessThan(15);
  });

  it("should reject borrow exceeding credit limit", async () => {
    await expect(
      caller.milkMoney.borrow({
        profileId: 1,
        amountCents: 3000, // Over $20 rookie limit
      })
    ).rejects.toThrow(/borrow up to/i);
  });

  it("should reject borrow on frozen account", async () => {
    const db = await import("./db");
    (db.getMilkMoneyAccount as any).mockResolvedValueOnce({
      id: 1,
      profileId: 1,
      tier: "rookie",
      creditLimitCents: 2000,
      currentBalanceCents: 0,
      totalBorrowedCents: 0,
      totalRepaidCents: 0,
      onTimeRepayments: 0,
      lateRepayments: 0,
      trustScore: 0,
      isEligible: false,
      frozenReason: "Too many late repayments",
    });

    await expect(
      caller.milkMoney.borrow({ profileId: 1, amountCents: 500 })
    ).rejects.toThrow(/frozen|late/i);
  });

  it("should reject borrow with no account", async () => {
    const db = await import("./db");
    (db.getMilkMoneyAccount as any).mockResolvedValueOnce(null);

    await expect(
      caller.milkMoney.borrow({ profileId: 999, amountCents: 500 })
    ).rejects.toThrow(/no milk money account/i);
  });
});

// ─── MILK MONEY REPAY TESTS ────────────────────────────────────────────────
describe("Milk Money — Repay", () => {
  it("should repay on time and increase trust score", async () => {
    const db = await import("./db");
    // Set up account with a balance
    (db.getMilkMoneyAccount as any).mockResolvedValueOnce({
      id: 1,
      profileId: 1,
      tier: "rookie",
      creditLimitCents: 2000,
      currentBalanceCents: 1000,
      totalBorrowedCents: 1000,
      totalRepaidCents: 0,
      onTimeRepayments: 0,
      lateRepayments: 0,
      trustScore: 0,
      isEligible: true,
      frozenReason: null,
    });
    // Mock a borrow transaction with future due date
    (db.getMilkMoneyTransactions as any).mockResolvedValueOnce([
      {
        id: 10,
        accountId: 1,
        profileId: 1,
        type: "borrow",
        amountCents: 1000,
        description: "Groceries",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        repaidAt: null,
        isLate: false,
      },
    ]);

    const result = await caller.milkMoney.repay({
      profileId: 1,
      transactionId: 10,
      amountCents: 1000,
    });

    expect(result.success).toBe(true);
    expect(result.repaid).toBe(1000);
    expect(result.newBalance).toBe(0);
    expect(result.trustScore).toBe(10); // +10 for on-time
    expect(result.isLate).toBe(false);
  });

  it("should handle late repayment with trust score penalty", async () => {
    const db = await import("./db");
    (db.getMilkMoneyAccount as any).mockResolvedValueOnce({
      id: 1,
      profileId: 1,
      tier: "rookie",
      creditLimitCents: 2000,
      currentBalanceCents: 1000,
      totalBorrowedCents: 1000,
      totalRepaidCents: 0,
      onTimeRepayments: 0,
      lateRepayments: 0,
      trustScore: 20,
      isEligible: true,
      frozenReason: null,
    });
    // Mock a borrow transaction with past due date
    (db.getMilkMoneyTransactions as any).mockResolvedValueOnce([
      {
        id: 11,
        accountId: 1,
        profileId: 1,
        type: "borrow",
        amountCents: 1000,
        description: "Car repair",
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        repaidAt: null,
        isLate: false,
      },
    ]);

    const result = await caller.milkMoney.repay({
      profileId: 1,
      transactionId: 11,
      amountCents: 1000,
    });

    expect(result.success).toBe(true);
    expect(result.trustScore).toBe(5); // 20 - 15 = 5
    expect(result.isLate).toBe(true);
  });

  it("should upgrade tier when trust score reaches threshold", async () => {
    const db = await import("./db");
    (db.getMilkMoneyAccount as any).mockResolvedValueOnce({
      id: 1,
      profileId: 1,
      tier: "rookie",
      creditLimitCents: 2000,
      currentBalanceCents: 500,
      totalBorrowedCents: 5000,
      totalRepaidCents: 4500,
      onTimeRepayments: 1,
      lateRepayments: 0,
      trustScore: 15, // +10 will push to 25, which is >= 20 threshold for regular
      isEligible: true,
      frozenReason: null,
    });
    (db.getMilkMoneyTransactions as any).mockResolvedValueOnce([
      {
        id: 12,
        accountId: 1,
        profileId: 1,
        type: "borrow",
        amountCents: 500,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        repaidAt: null,
        isLate: false,
      },
    ]);

    const result = await caller.milkMoney.repay({
      profileId: 1,
      transactionId: 12,
      amountCents: 500,
    });

    expect(result.success).toBe(true);
    expect(result.tier).toBe("regular");
    expect(result.tierUpgraded).toBe(true);
    expect(result.trustScore).toBe(25);
  });
});

// ─── STRIPE CHECKOUT TESTS ─────────────────────────────────────────────────
describe("Stripe Checkout", () => {
  it("should create checkout session for essentials tier", async () => {
    const result = await caller.membership.createCheckout({
      profileId: 1,
      tier: "essentials",
      origin: "http://localhost:3000",
    });

    expect(result.url).toContain("stripe.com");
    expect(result.configured).toBe(true);
    expect(result.sessionId).toBeDefined();
  });

  it("should create checkout session for plus tier", async () => {
    const result = await caller.membership.createCheckout({
      profileId: 1,
      tier: "plus",
      origin: "http://localhost:3000",
    });

    expect(result.url).toContain("stripe.com");
    expect(result.configured).toBe(true);
  });

  it("should return product info with stripe status", async () => {
    const result = await caller.membership.getProducts();

    expect(result.stripeConfigured).toBe(true);
    expect(result.products).toBeDefined();
    expect(result.products.essentials).toBeDefined();
    expect(result.products.plus).toBeDefined();
  });

  it("should handle Stripe not configured gracefully", async () => {
    const stripe = await import("./stripe");
    (stripe.isStripeConfigured as any).mockReturnValueOnce(false);

    const result = await caller.membership.createCheckout({
      profileId: 1,
      tier: "essentials",
      origin: "http://localhost:3000",
    });

    expect(result.url).toBeNull();
    expect(result.configured).toBe(false);
    expect(result.message).toBeDefined();
  });
});

// ─── GIFT ANTHEM TOKEN TESTS ───────────────────────────────────────────────
describe("Gift Anthem Share Token", () => {
  it("should look up a valid share token and return song data", async () => {
    const result = await caller.anthemShare.getByToken({
      token: "anthem_test_abc123",
    });

    expect(result).toBeDefined();
    expect(result.recipientName).toBe("Sarah");
    expect(result.recipientMessage).toBe("You're amazing!");
    expect(result.senderName).toBe("Ruby");
    expect(result.song).toBeDefined();
    expect(result.song?.title).toBe("Ruby's Song");
  });

  it("should throw for invalid token", async () => {
    const db = await import("./db");
    (db.getAnthemShareToken as any).mockResolvedValueOnce(null);

    await expect(
      caller.anthemShare.getByToken({ token: "invalid_token" })
    ).rejects.toThrow(/not found|expired/i);
  });
});
