/**
 * Race 7 — Tests for:
 * - Essentials Box Fulfillment (admin + member-facing)
 * - Member order creation
 * - Admin order management (list, update status, notes, courier, manual create)
 * - Order stats
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Mock LLM ───────────────────────────────────────────────────────────────
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{
      message: { content: "Grace says: Your Essentials Box is being prepared with love." },
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
  // Race 7 fulfillment functions
  createEssentialsOrder: vi.fn().mockResolvedValue({ id: 42 }),
  listEssentialsOrders: vi.fn().mockResolvedValue([
    {
      id: 1, profileId: 1, userId: 1, memberName: "Ruby Red", memberEmail: "ruby@example.com",
      deliveryAddress: "123 Main St, Red Deer, AB", postalCode: "T4N 1A1",
      itemsRequested: "Toilet paper, soap, toothpaste", status: "pending",
      notes: null, courierMethod: null, trackingNumber: null, requestSource: "member",
      statusUpdatedAt: null, createdAt: new Date(), updatedAt: new Date(),
    },
    {
      id: 2, profileId: null, userId: null, memberName: "Manual Entry", memberEmail: null,
      deliveryAddress: "456 Oak Ave, Red Deer, AB", postalCode: "T4N 2B2",
      itemsRequested: null, status: "packed",
      notes: "Amazon order #ABC123", courierMethod: "Canada Post", trackingNumber: "CP123456",
      requestSource: "admin_manual",
      statusUpdatedAt: new Date(), createdAt: new Date(), updatedAt: new Date(),
    },
  ]),
  getEssentialsOrder: vi.fn().mockResolvedValue({
    id: 1, profileId: 1, status: "pending", deliveryAddress: "123 Main St",
  }),
  updateEssentialsOrderStatus: vi.fn(),
  updateEssentialsOrderNotes: vi.fn(),
  updateEssentialsOrderCourier: vi.fn(),
  getMemberOrders: vi.fn().mockResolvedValue([
    {
      id: 1, profileId: 1, status: "pending", deliveryAddress: "123 Main St, Red Deer, AB",
      itemsRequested: "Toilet paper", createdAt: new Date(),
    },
  ]),
  getEssentialsOrderStats: vi.fn().mockResolvedValue({
    total: 5, pending: 2, packed: 1, shipped: 1, delivered: 1,
  }),
}));

// ─── Mock Stripe ────────────────────────────────────────────────────────────
vi.mock("./stripe", () => ({
  createCheckoutSession: vi.fn(),
  isStripeConfigured: vi.fn().mockReturnValue(false),
  MAVEN_PRODUCTS: [],
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

function createUnauthCaller() {
  const ctx: TrpcContext = {
    user: null,
    req: {} as any,
    res: {} as any,
  };
  return appRouter.createCaller(ctx);
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. MEMBER-FACING: Request an Essentials Box
// ═══════════════════════════════════════════════════════════════════════════
describe("Fulfillment — Member Box Request", () => {
  it("should create an order when member requests a box", async () => {
    const caller = createCaller("user");
    const result = await caller.fulfillment.requestBox({
      profileId: 1,
      deliveryAddress: "123 Main St, Red Deer, AB",
      postalCode: "T4N 1A1",
      itemsRequested: "Toilet paper, soap",
    });
    expect(result.orderId).toBe(42);
    expect(result.message).toContain("Essentials Box");
  });

  it("should reject unauthenticated box requests", async () => {
    const caller = createUnauthCaller();
    await expect(
      caller.fulfillment.requestBox({
        profileId: 1,
        deliveryAddress: "123 Main St, Red Deer, AB",
      })
    ).rejects.toThrow();
  });

  it("should reject box request with empty address", async () => {
    const caller = createCaller("user");
    await expect(
      caller.fulfillment.requestBox({
        profileId: 1,
        deliveryAddress: "ab", // too short, min 5
      })
    ).rejects.toThrow();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. MEMBER-FACING: View My Orders
// ═══════════════════════════════════════════════════════════════════════════
describe("Fulfillment — Member Order History", () => {
  it("should return member's orders", async () => {
    const caller = createCaller("user");
    const orders = await caller.fulfillment.myOrders({ profileId: 1 });
    expect(Array.isArray(orders)).toBe(true);
    expect(orders.length).toBeGreaterThan(0);
    expect(orders[0].profileId).toBe(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. ADMIN: List All Orders
// ═══════════════════════════════════════════════════════════════════════════
describe("Fulfillment — Admin List Orders", () => {
  it("should return all orders for admin", async () => {
    const caller = createCaller("admin");
    const orders = await caller.fulfillment.listOrders({});
    expect(Array.isArray(orders)).toBe(true);
    expect(orders.length).toBe(2);
  });

  it("should filter orders by status for admin", async () => {
    const caller = createCaller("admin");
    const orders = await caller.fulfillment.listOrders({ status: "pending" });
    expect(Array.isArray(orders)).toBe(true);
  });

  it("should reject non-admin from listing orders", async () => {
    const caller = createCaller("user");
    await expect(caller.fulfillment.listOrders({})).rejects.toThrow();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. ADMIN: Order Stats
// ═══════════════════════════════════════════════════════════════════════════
describe("Fulfillment — Admin Order Stats", () => {
  it("should return order stats for admin", async () => {
    const caller = createCaller("admin");
    const stats = await caller.fulfillment.orderStats();
    expect(stats.total).toBe(5);
    expect(stats.pending).toBe(2);
    expect(stats.packed).toBe(1);
    expect(stats.shipped).toBe(1);
    expect(stats.delivered).toBe(1);
  });

  it("should reject non-admin from viewing stats", async () => {
    const caller = createCaller("user");
    await expect(caller.fulfillment.orderStats()).rejects.toThrow();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 5. ADMIN: Update Order Status
// ═══════════════════════════════════════════════════════════════════════════
describe("Fulfillment — Admin Update Status", () => {
  it("should update order status for admin", async () => {
    const caller = createCaller("admin");
    const result = await caller.fulfillment.updateStatus({ orderId: 1, status: "shipped" });
    expect(result.success).toBe(true);
  });

  it("should reject invalid status values", async () => {
    const caller = createCaller("admin");
    await expect(
      caller.fulfillment.updateStatus({ orderId: 1, status: "invalid_status" as any })
    ).rejects.toThrow();
  });

  it("should reject non-admin from updating status", async () => {
    const caller = createCaller("user");
    await expect(
      caller.fulfillment.updateStatus({ orderId: 1, status: "shipped" })
    ).rejects.toThrow();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 6. ADMIN: Update Notes
// ═══════════════════════════════════════════════════════════════════════════
describe("Fulfillment — Admin Update Notes", () => {
  it("should update notes for admin", async () => {
    const caller = createCaller("admin");
    const result = await caller.fulfillment.updateNotes({ orderId: 1, notes: "Amazon order #ABC123" });
    expect(result.success).toBe(true);
  });

  it("should reject non-admin from updating notes", async () => {
    const caller = createCaller("user");
    await expect(
      caller.fulfillment.updateNotes({ orderId: 1, notes: "test" })
    ).rejects.toThrow();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 7. ADMIN: Update Courier Info
// ═══════════════════════════════════════════════════════════════════════════
describe("Fulfillment — Admin Update Courier", () => {
  it("should update courier info for admin", async () => {
    const caller = createCaller("admin");
    const result = await caller.fulfillment.updateCourier({
      orderId: 1,
      courierMethod: "Canada Post",
      trackingNumber: "CP123456789",
    });
    expect(result.success).toBe(true);
  });

  it("should accept courier without tracking number", async () => {
    const caller = createCaller("admin");
    const result = await caller.fulfillment.updateCourier({
      orderId: 1,
      courierMethod: "Hand delivery",
    });
    expect(result.success).toBe(true);
  });

  it("should reject non-admin from updating courier", async () => {
    const caller = createCaller("user");
    await expect(
      caller.fulfillment.updateCourier({ orderId: 1, courierMethod: "test" })
    ).rejects.toThrow();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 8. ADMIN: Create Manual Order
// ═══════════════════════════════════════════════════════════════════════════
describe("Fulfillment — Admin Create Manual Order", () => {
  it("should create a manual order for admin", async () => {
    const caller = createCaller("admin");
    const result = await caller.fulfillment.createManual({
      memberName: "Manual Ruby",
      memberEmail: "manual@example.com",
      deliveryAddress: "789 Elm St, Red Deer, AB",
      postalCode: "T4N 3C3",
      itemsRequested: "Toilet paper, diapers",
      notes: "Referred by community partner",
    });
    expect(result.orderId).toBe(42);
    expect(result.success).toBe(true);
  });

  it("should reject manual order with empty name", async () => {
    const caller = createCaller("admin");
    await expect(
      caller.fulfillment.createManual({
        memberName: "",
        deliveryAddress: "789 Elm St, Red Deer, AB",
      })
    ).rejects.toThrow();
  });

  it("should reject non-admin from creating manual orders", async () => {
    const caller = createCaller("user");
    await expect(
      caller.fulfillment.createManual({
        memberName: "Test",
        deliveryAddress: "789 Elm St, Red Deer, AB",
      })
    ).rejects.toThrow();
  });
});
