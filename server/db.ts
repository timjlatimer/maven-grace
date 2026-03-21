import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  gracePersonProfiles, graceMemory, graceConversations,
  trojanHorseEntries, songs, financialImpactLog,
  subscriptions, journeyMilestones, graceAmbientMessages
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── USER HELPERS ────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get user: database not available"); return undefined; }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── GRACE PERSON PROFILES ──────────────────────────────────────────

export async function getOrCreateProfile(sessionId: string) {
  const db = await getDb();
  if (!db) return null;
  const existing = await db.select().from(gracePersonProfiles).where(eq(gracePersonProfiles.sessionId, sessionId)).limit(1);
  if (existing.length > 0) return existing[0];
  await db.insert(gracePersonProfiles).values({ sessionId });
  const created = await db.select().from(gracePersonProfiles).where(eq(gracePersonProfiles.sessionId, sessionId)).limit(1);
  return created[0] || null;
}

export async function updateProfile(profileId: number, data: Partial<typeof gracePersonProfiles.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(gracePersonProfiles).set(data).where(eq(gracePersonProfiles.id, profileId));
}

export async function getProfileById(profileId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(gracePersonProfiles).where(eq(gracePersonProfiles.id, profileId)).limit(1);
  return result[0] || null;
}

// ─── GRACE MEMORY ───────────────────────────────────────────────────

export async function addMemory(profileId: number, category: string, fact: string, confidence = "medium", source = "conversation") {
  const db = await getDb();
  if (!db) return;
  await db.insert(graceMemory).values({ profileId, category, fact, confidence, source });
}

export async function getMemories(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(graceMemory).where(eq(graceMemory.profileId, profileId)).orderBy(desc(graceMemory.createdAt));
}

// ─── GRACE CONVERSATIONS ────────────────────────────────────────────

export async function saveConversationMessage(sessionId: string, profileId: number | null, role: string, content: string, metadata?: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(graceConversations).values({ sessionId, profileId, role, content, metadata });
}

export async function getConversationHistory(sessionId: string, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(graceConversations).where(eq(graceConversations.sessionId, sessionId)).orderBy(graceConversations.createdAt).limit(limit);
}

// ─── TROJAN HORSE ENTRIES ───────────────────────────────────────────

export async function createTrojanHorseEntry(profileId: number, sessionId: string) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(trojanHorseEntries).values({ profileId, sessionId, currentStep: 1 });
  const result = await db.select().from(trojanHorseEntries).where(and(eq(trojanHorseEntries.profileId, profileId), eq(trojanHorseEntries.sessionId, sessionId))).limit(1);
  return result[0] || null;
}

export async function updateTrojanHorseEntry(id: number, data: Partial<typeof trojanHorseEntries.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(trojanHorseEntries).set(data).where(eq(trojanHorseEntries.id, id));
}

export async function getTrojanHorseEntry(profileId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(trojanHorseEntries).where(eq(trojanHorseEntries.profileId, profileId)).orderBy(desc(trojanHorseEntries.createdAt)).limit(1);
  return result[0] || null;
}

// ─── SONGS ──────────────────────────────────────────────────────────

export async function createSong(data: typeof songs.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(songs).values(data);
  const result = await db.select().from(songs).where(eq(songs.profileId, data.profileId)).orderBy(desc(songs.createdAt)).limit(1);
  return result[0] || null;
}

export async function updateSong(id: number, data: Partial<typeof songs.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(songs).set(data).where(eq(songs.id, id));
}

export async function getSongsByProfile(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(songs).where(eq(songs.profileId, profileId)).orderBy(desc(songs.createdAt));
}

// ─── FINANCIAL IMPACT ───────────────────────────────────────────────

export async function addFinancialImpact(data: typeof financialImpactLog.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(financialImpactLog).values(data);
}

export async function getFinancialImpacts(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(financialImpactLog).where(eq(financialImpactLog.profileId, profileId)).orderBy(desc(financialImpactLog.createdAt));
}

export async function getFinancialSummary(profileId: number) {
  const db = await getDb();
  if (!db) return { total: 0, byCategory: {} };
  const impacts = await db.select().from(financialImpactLog).where(eq(financialImpactLog.profileId, profileId));
  const total = impacts.reduce((sum, i) => sum + i.estimatedValue, 0);
  const byCategory: Record<string, number> = {};
  for (const impact of impacts) {
    byCategory[impact.category] = (byCategory[impact.category] || 0) + impact.estimatedValue;
  }
  return { total, byCategory, count: impacts.length };
}

// ─── SUBSCRIPTIONS (Vampire Slayer) ─────────────────────────────────

export async function addSubscription(data: typeof subscriptions.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(subscriptions).values(data);
  const result = await db.select().from(subscriptions).where(eq(subscriptions.profileId, data.profileId)).orderBy(desc(subscriptions.createdAt)).limit(1);
  return result[0] || null;
}

export async function getSubscriptions(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subscriptions).where(eq(subscriptions.profileId, profileId)).orderBy(desc(subscriptions.createdAt));
}

export async function updateSubscription(id: number, data: Partial<typeof subscriptions.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(subscriptions).set(data).where(eq(subscriptions.id, id));
}

// ─── JOURNEY MILESTONES ─────────────────────────────────────────────

export async function getJourneyMilestones(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(journeyMilestones).where(eq(journeyMilestones.profileId, profileId)).orderBy(journeyMilestones.day);
}

export async function initializeJourney(profileId: number) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(journeyMilestones).where(eq(journeyMilestones.profileId, profileId)).limit(1);
  if (existing.length > 0) return;
  const milestones = [
    { day: 0, milestoneName: "Welcome Gift", description: "Received your first toilet paper delivery and met Grace" },
    { day: 3, milestoneName: "Your Song", description: "Grace wrote you a personalized anthem" },
    { day: 7, milestoneName: "First Check-In", description: "Grace checked in to see how you're doing" },
    { day: 14, milestoneName: "Vampire Hunt", description: "Identified subscriptions draining your wallet" },
    { day: 21, milestoneName: "First Savings", description: "Cancelled your first vampire subscription" },
    { day: 30, milestoneName: "Budget Clarity", description: "Built your first monthly picture" },
    { day: 45, milestoneName: "Neighbor Network", description: "Connected with your local Maven community" },
    { day: 60, milestoneName: "Halfway Hero", description: "60 days of building financial strength" },
    { day: 75, milestoneName: "Wisdom Session", description: "Connected with a Wisdom Giant mentor" },
    { day: 90, milestoneName: "Dignity Score", description: "Your 90-day financial transformation complete" },
  ];
  for (const m of milestones) {
    await db.insert(journeyMilestones).values({ profileId, ...m });
  }
}

export async function completeMilestone(profileId: number, day: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(journeyMilestones).set({ completed: true, completedAt: new Date() }).where(and(eq(journeyMilestones.profileId, profileId), eq(journeyMilestones.day, day)));
}

// ─── GRACE AMBIENT MESSAGES ─────────────────────────────────────────

export async function addAmbientMessage(profileId: number, messageType: string, content: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(graceAmbientMessages).values({ profileId, messageType, content });
}

export async function getUnreadAmbientMessages(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(graceAmbientMessages).where(and(eq(graceAmbientMessages.profileId, profileId), eq(graceAmbientMessages.isRead, false))).orderBy(desc(graceAmbientMessages.createdAt));
}

export async function markAmbientMessageRead(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(graceAmbientMessages).set({ isRead: true }).where(eq(graceAmbientMessages.id, id));
}
