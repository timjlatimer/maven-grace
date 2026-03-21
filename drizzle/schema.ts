import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json, bigint } from "drizzle-orm/mysql-core";

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
