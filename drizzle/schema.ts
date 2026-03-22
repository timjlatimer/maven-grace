import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json, bigint, decimal } from "drizzle-orm/mysql-core";

// ─── USERS ───────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── GRACE PERSON PROFILES (Relationship Memory) ────────────────────
export const gracePersonProfiles = mysqlTable("grace_person_profiles", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 128 }).notNull(),
  userId: int("userId"),
  firstName: varchar("firstName", { length: 128 }),
  lastName: varchar("lastName", { length: 128 }),
  province: varchar("province", { length: 64 }),
  city: varchar("city", { length: 128 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 32 }),
  address: text("address"),
  postalCode: varchar("postalCode", { length: 16 }),
  kidsCount: int("kidsCount"),
  kidsNames: text("kidsNames"),
  financialSituation: text("financialSituation"),
  biggestChallenge: text("biggestChallenge"),
  interests: text("interests"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── GRACE MEMORY (Semantic Facts) ──────────────────────────────────
export const graceMemory = mysqlTable("grace_memory", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  fact: text("fact").notNull(),
  confidence: varchar("confidence", { length: 16 }).default("medium"),
  source: varchar("source", { length: 64 }).default("conversation"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── GRACE CONVERSATION HISTORY ─────────────────────────────────────
export const graceConversations = mysqlTable("grace_conversations", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 128 }).notNull(),
  profileId: int("profileId"),
  role: varchar("role", { length: 16 }).notNull(),
  content: text("content").notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── EP-005 TROJAN HORSE ENTRIES ────────────────────────────────────
export const trojanHorseEntries = mysqlTable("trojan_horse_entries", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  sessionId: varchar("sessionId", { length: 128 }).notNull(),
  currentStep: int("currentStep").default(1).notNull(),
  status: mysqlEnum("status", ["in_progress", "completed", "abandoned"]).default("in_progress").notNull(),
  tpDeliveryConfirmed: boolean("tpDeliveryConfirmed").default(false),
  recurringSetup: boolean("recurringSetup").default(false),
  recurringIntervalWeeks: int("recurringIntervalWeeks").default(2),
  songGenerated: boolean("songGenerated").default(false),
  songId: int("songId"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── SONGS (Song Moment) ────────────────────────────────────────────
export const songs = mysqlTable("songs", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  title: varchar("title", { length: 256 }),
  lyrics: text("lyrics"),
  genre: varchar("genre", { length: 64 }),
  mood: varchar("mood", { length: 64 }),
  personalDetails: text("personalDetails"),
  generationPrompt: text("generationPrompt"),
  status: mysqlEnum("status", ["generating", "ready", "failed"]).default("generating").notNull(),
  shareToken: varchar("shareToken", { length: 64 }),   // Race 3: Gift Anthem Dedication
  shareCount: int("shareCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── FINANCIAL IMPACT LOG ───────────────────────────────────────────
export const financialImpactLog = mysqlTable("financial_impact_log", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  category: mysqlEnum("category", [
    "subscription_cancelled",
    "nsf_avoided",
    "barter_value",
    "neighbor_economy",
    "wisdom_giants",
    "expense_reduced",
    "tp_delivery",
    "other"
  ]).notNull(),
  description: text("description").notNull(),
  estimatedValue: int("estimatedValue").notNull(),
  isEstimated: boolean("isEstimated").default(true).notNull(),
  source: varchar("source", { length: 64 }).default("grace"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── SUBSCRIPTIONS (Vampire Slayer) ─────────────────────────────────
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  monthlyCost: int("monthlyCost").notNull(),
  annualCost: int("annualCost"),
  category: varchar("category", { length: 64 }),
  isVampire: boolean("isVampire").default(false),
  vampireReason: text("vampireReason"),
  status: mysqlEnum("status", ["active", "cancelled", "pending_cancel"]).default("active").notNull(),
  cancelledAt: timestamp("cancelledAt"),
  savingsLogged: boolean("savingsLogged").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── JOURNEY MILESTONES (90-Day Tracker) ────────────────────────────
export const journeyMilestones = mysqlTable("journey_milestones", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  day: int("day").notNull(),
  milestoneName: varchar("milestoneName", { length: 256 }).notNull(),
  description: text("description"),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── GRACE AMBIENT MESSAGES ─────────────────────────────────────────
export const graceAmbientMessages = mysqlTable("grace_ambient_messages", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  messageType: varchar("messageType", { length: 64 }).notNull(),
  content: text("content").notNull(),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── APP SETTINGS ───────────────────────────────────────────────────
export const appSettings = mysqlTable("app_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("settingKey", { length: 128 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ══════════════════════════════════════════════════════════════════════
// RACE 3 NEW TABLES
// ══════════════════════════════════════════════════════════════════════

// ─── MAVEN MEMBERSHIPS (Stripe Subscription Tiers) ──────────────────
export const mavenMemberships = mysqlTable("maven_memberships", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  userId: int("userId"),
  tier: mysqlEnum("tier", ["observer", "essentials", "plus"]).default("observer").notNull(),
  status: mysqlEnum("status", ["active", "paused", "cancelled", "pending"]).default("active").notNull(),
  // Stripe fields (populated when Stripe is live; null for placeholder/observer)
  stripeCustomerId: varchar("stripeCustomerId", { length: 128 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 128 }),
  stripePriceId: varchar("stripePriceId", { length: 128 }),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  // Weekly cost in cents (0 for observer, 599 for essentials, 1099 for plus)
  weeklyAmountCents: int("weeklyAmountCents").default(0).notNull(),
  // Delivery preferences
  deliveryAddress: text("deliveryAddress"),
  deliveryPostalCode: varchar("deliveryPostalCode", { length: 16 }),
  deliveryNotes: text("deliveryNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── BUDGET ENTRIES (Budget Builder) ────────────────────────────────
export const budgetEntries = mysqlTable("budget_entries", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  type: mysqlEnum("type", ["income", "expense"]).notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  description: varchar("description", { length: 256 }).notNull(),
  amountCents: int("amountCents").notNull(),          // stored in cents
  frequency: mysqlEnum("frequency", ["one_time", "weekly", "biweekly", "monthly"]).default("monthly").notNull(),
  dueDay: int("dueDay"),                               // day of month (1-31)
  nextDueDate: timestamp("nextDueDate"),
  isPaid: boolean("isPaid").default(false),
  paidAt: timestamp("paidAt"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── PAYCHECKS (Budget Builder — paycheck tracker) ──────────────────
export const paychecks = mysqlTable("paychecks", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  amountCents: int("amountCents").notNull(),
  frequency: mysqlEnum("frequency", ["weekly", "biweekly", "semimonthly", "monthly"]).default("biweekly").notNull(),
  nextPayDate: timestamp("nextPayDate"),
  employer: varchar("employer", { length: 256 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── BILLS (Bill Tracker + NSF Fee Fighter) ──────────────────────────
export const bills = mysqlTable("bills", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  amountCents: int("amountCents").notNull(),
  dueDay: int("dueDay").notNull(),                     // day of month (1-31)
  nextDueDate: timestamp("nextDueDate"),
  category: varchar("category", { length: 64 }).default("other"),
  isPaid: boolean("isPaid").default(false),
  paidAt: timestamp("paidAt"),
  isAutoPay: boolean("isAutoPay").default(false),
  nsfRiskFlagged: boolean("nsfRiskFlagged").default(false),
  nsfRiskFlaggedAt: timestamp("nsfRiskFlaggedAt"),
  // NSF Fee Fighter fields
  nsfFeeAmount: int("nsfFeeAmount"),                   // in cents (e.g., 3500 = $35)
  nsfFeeDisputed: boolean("nsfFeeDisputed").default(false),
  nsfFeeDisputeScript: text("nsfFeeDisputeScript"),
  nsfFeeWaived: boolean("nsfFeeWaived").default(false),
  nsfFeeWaivedAmount: int("nsfFeeWaivedAmount"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── MILK MONEY ACCOUNTS (Emergency Cash) ───────────────────────────
export const milkMoneyAccounts = mysqlTable("milk_money_accounts", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull().unique(),
  tier: mysqlEnum("tier", ["rookie", "regular", "trusted", "elite"]).default("rookie").notNull(),
  // Credit limits by tier (cents): rookie=2000, regular=5000, trusted=10000, elite=15000
  creditLimitCents: int("creditLimitCents").default(2000).notNull(),
  currentBalanceCents: int("currentBalanceCents").default(0).notNull(),
  totalBorrowedCents: int("totalBorrowedCents").default(0).notNull(),
  totalRepaidCents: int("totalRepaidCents").default(0).notNull(),
  onTimeRepayments: int("onTimeRepayments").default(0).notNull(),
  lateRepayments: int("lateRepayments").default(0).notNull(),
  trustScore: int("trustScore").default(0).notNull(),   // 0-100
  isEligible: boolean("isEligible").default(true).notNull(),
  frozenReason: text("frozenReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── MILK MONEY TRANSACTIONS ─────────────────────────────────────────
export const milkMoneyTransactions = mysqlTable("milk_money_transactions", {
  id: int("id").autoincrement().primaryKey(),
  accountId: int("accountId").notNull(),
  profileId: int("profileId").notNull(),
  type: mysqlEnum("type", ["borrow", "repay", "fee_waived"]).notNull(),
  amountCents: int("amountCents").notNull(),
  description: text("description"),
  dueDate: timestamp("dueDate"),
  repaidAt: timestamp("repaidAt"),
  isLate: boolean("isLate").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── ANTHEM SHARE TOKENS (Gift Anthem Dedication) ────────────────────
export const anthemShareTokens = mysqlTable("anthem_share_tokens", {
  id: int("id").autoincrement().primaryKey(),
  songId: int("songId").notNull(),
  senderProfileId: int("senderProfileId").notNull(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  recipientName: varchar("recipientName", { length: 128 }),
  recipientMessage: text("recipientMessage"),
  viewCount: int("viewCount").default(0),
  joinedCount: int("joinedCount").default(0),         // how many joined Maven via this link
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── DIGNITY SCORES (Composite Metric — daily snapshots) ─────────────
export const dignityScores = mysqlTable("dignity_scores", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  // Five dimensions, each 0-20 points (total 0-100)
  vampireSlayer: int("vampireSlayer").default(0).notNull(),      // subscriptions cancelled savings
  nsfShield: int("nsfShield").default(0).notNull(),              // NSF fees avoided/waived
  budgetMastery: int("budgetMastery").default(0).notNull(),      // budget adherence
  milkMoneyTrust: int("milkMoneyTrust").default(0).notNull(),    // Milk Money repayment record
  engagement: int("engagement").default(0).notNull(),            // app usage, promises kept
  totalScore: int("totalScore").default(0).notNull(),            // sum of all dimensions
  tier: varchar("tier", { length: 32 }).default("starting_out").notNull(),
  snapshotDate: timestamp("snapshotDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── PROMISES (PTK Genie — bidirectional promise tracking) ───────────
export const promises = mysqlTable("promises", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  direction: mysqlEnum("direction", ["made_by_ruby", "made_to_ruby"]).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 64 }).default("general").notNull(),
  // Commitment confidence: 0-100 (casual remark vs real commitment)
  commitmentScore: int("commitmentScore").default(50).notNull(),
  status: mysqlEnum("status", ["active", "completed", "broken", "expired", "dormant"]).default("active").notNull(),
  dueDate: timestamp("dueDate"),
  completedAt: timestamp("completedAt"),
  // Willingness meter: mirrors Ruby's energy (1-5)
  willingnessLevel: int("willingnessLevel").default(3).notNull(),
  nudgeCount: int("nudgeCount").default(0).notNull(),
  lastNudgedAt: timestamp("lastNudgedAt"),
  source: varchar("source", { length: 64 }).default("conversation").notNull(), // conversation, manual, grace_detected
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── DESTINY DISCOVERY (30 Questions Journey) ────────────────────────
export const destinyAnswers = mysqlTable("destiny_answers", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  questionNumber: int("questionNumber").notNull(),         // 1-30
  wave: mysqlEnum("wave", ["safe", "reflective", "deep"]).notNull(),
  question: text("question").notNull(),
  answer: text("answer"),
  askedAt: timestamp("askedAt").defaultNow().notNull(),
  answeredAt: timestamp("answeredAt"),
  // Grace's readiness assessment before asking
  readinessScore: int("readinessScore").default(0),        // 0-100
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const destinySynthesis = mysqlTable("destiny_synthesis", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull().unique(),
  coreValues: text("coreValues"),
  strengths: text("strengths"),
  purpose: text("purpose"),
  moonshot: text("moonshot"),
  synthesisText: text("synthesisText"),                    // full narrative
  isRevealed: boolean("isRevealed").default(false).notNull(),
  revealedAt: timestamp("revealedAt"),
  lastUpdatedAt: timestamp("lastUpdatedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── STORIES (Jolene the Journalist) ─────────────────────────────────
export const stories = mysqlTable("stories", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  storyType: mysqlEnum("storyType", ["moment", "feature"]).default("moment").notNull(), // 500 or 1250 words
  content: text("content").notNull(),
  // Jolene Protocol grading
  grade: varchar("grade", { length: 4 }),                  // A+, A, A-, B+, etc.
  physicalObject: varchar("physicalObject", { length: 256 }),
  greatQuote: text("greatQuote"),
  triggerEvent: varchar("triggerEvent", { length: 256 }),   // what triggered the story
  // Delivery
  isDelivered: boolean("isDelivered").default(false).notNull(),
  deliveredAt: timestamp("deliveredAt"),
  deliveryMethod: mysqlEnum("deliveryMethod", ["grace_read", "self_read"]).default("grace_read"),
  // Sharing
  visibility: mysqlEnum("visibility", ["private", "friends", "community"]).default("private").notNull(),
  isAnonymized: boolean("isAnonymized").default(false),
  sharedToSocial: boolean("sharedToSocial").default(false),
  readCount: int("readCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── VILLAGE AGENTS (AI Village Naming Convention) ───────────────────
export const villageAgents = mysqlTable("village_agents", {
  id: int("id").autoincrement().primaryKey(),
  agentKey: varchar("agentKey", { length: 64 }).notNull().unique(),  // e.g. "jolene_journalist"
  defaultName: varchar("defaultName", { length: 128 }).notNull(),     // "Jolene the Journalist"
  tradeName: varchar("tradeName", { length: 128 }).notNull(),         // "Journalist"
  category: mysqlEnum("category", ["inner_circle", "specialist", "creative_studio"]).notNull(),
  personality: text("personality"),
  description: text("description"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const agentIntroductions = mysqlTable("agent_introductions", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  agentId: int("agentId").notNull(),
  introducedAt: timestamp("introducedAt").defaultNow().notNull(),
  customName: varchar("customName", { length: 128 }),                 // Ruby's rename
  renamedAt: timestamp("renamedAt"),
  interactionCount: int("interactionCount").default(0).notNull(),
});

// ── Race 6 Tables ──────────────────────────────────────────────────────

// Grace Status — tracks degradation tier, battery level, speed state
export const graceStatus = mysqlTable("grace_status", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  batteryLevel: int("batteryLevel").default(100).notNull(),          // 0-100
  tier: varchar("tier", { length: 32 }).default("full").notNull(),   // full, essentials_lite, core, careful, lite
  speedStage: varchar("speedStage", { length: 32 }).default("normal").notNull(), // normal, thoughtful, tired, stretched, running_low
  daysPastDue: int("daysPastDue").default(0).notNull(),
  pauseRequested: boolean("pauseRequested").default(false).notNull(),
  pauseExpiresAt: timestamp("pauseExpiresAt"),
  lastPaymentAt: timestamp("lastPaymentAt"),
  dignityScore100Achieved: boolean("dignityScore100Achieved").default(false).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Community Credits — Big Mama as keeper
export const communityCredits = mysqlTable("community_credits", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  balance: int("balance").default(0).notNull(),                      // current credit balance
  totalEarned: int("totalEarned").default(0).notNull(),
  totalRedeemed: int("totalRedeemed").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Community Credit Transactions — earning and spending log
export const communityCreditsLog = mysqlTable("community_credits_log", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  type: varchar("type", { length: 32 }).notNull(),                   // earn, redeem
  amount: int("amount").notNull(),                                   // credits earned or redeemed
  category: varchar("category", { length: 64 }).notNull(),           // teaching, barter, village_hands, mentoring, helping
  description: text("description"),
  validatedBy: varchar("validatedBy", { length: 64 }).default("big_mama").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Payday Detection — tracks Ruby's pay patterns
export const paydayPatterns = mysqlTable("payday_patterns", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  frequency: varchar("frequency", { length: 32 }).notNull(),         // weekly, biweekly, semimonthly, monthly
  nextPayday: timestamp("nextPayday"),
  lastPayday: timestamp("lastPayday"),
  dayOfWeek: int("dayOfWeek"),                                       // 0-6 for weekly/biweekly
  dayOfMonth1: int("dayOfMonth1"),                                   // 1-31 for monthly/semimonthly
  dayOfMonth2: int("dayOfMonth2"),                                   // second day for semimonthly
  confidence: int("confidence").default(50).notNull(),               // 0-100 confidence in detection
  source: varchar("source", { length: 32 }).default("manual").notNull(), // manual, detected, bank
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Crisis Beacon — "I'm Not Okay" signals
export const crisisBeacons = mysqlTable("crisis_beacons", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  status: varchar("status", { length: 32 }).default("active").notNull(), // active, resolved, escalated
  agentsActivated: text("agentsActivated"),                          // JSON array of agent keys
  communityAlertSent: boolean("communityAlertSent").default(false).notNull(),
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Destiny Moonshot — tracks the reveal ceremony
export const destinyMoonshots = mysqlTable("destiny_moonshots", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  revealed: boolean("revealed").default(false).notNull(),
  revealedAt: timestamp("revealedAt"),
  moonshotStatement: text("moonshotStatement"),
  coreValues: text("coreValues"),                                    // JSON array
  strengths: text("strengths"),                                      // JSON array
  destinyAnthem: text("destinyAnthem"),                              // elevated song lyrics
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
