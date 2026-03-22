import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  gracePersonProfiles, graceMemory, graceConversations,
  trojanHorseEntries, songs, financialImpactLog,
  subscriptions, journeyMilestones, graceAmbientMessages,
  essentialsOrders, gracePreferences, graceReferrals,
  pushSubscriptions, conversationSummaries
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

export async function getSongById(songId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(songs).where(eq(songs.id, songId)).limit(1);
  return result[0] || null;
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

// ══════════════════════════════════════════════════════════════════════
// RACE 3 DATABASE HELPERS
// ══════════════════════════════════════════════════════════════════════

import {
  mavenMemberships, budgetEntries, paychecks,
  bills, milkMoneyAccounts, milkMoneyTransactions, anthemShareTokens
} from "../drizzle/schema";

// ─── MAVEN MEMBERSHIPS ──────────────────────────────────────────────

export async function getMembership(profileId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(mavenMemberships).where(eq(mavenMemberships.profileId, profileId)).limit(1);
  return result[0] || null;
}

export async function upsertMembership(profileId: number, data: Partial<typeof mavenMemberships.$inferInsert>) {
  const db = await getDb();
  if (!db) return null;
  const existing = await getMembership(profileId);
  if (existing) {
    await db.update(mavenMemberships).set(data).where(eq(mavenMemberships.profileId, profileId));
  } else {
    await db.insert(mavenMemberships).values({ profileId, ...data });
  }
  return getMembership(profileId);
}

export async function getAllMemberships() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(mavenMemberships).orderBy(desc(mavenMemberships.createdAt));
}

// ─── BUDGET ENTRIES ─────────────────────────────────────────────────

export async function addBudgetEntry(data: typeof budgetEntries.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(budgetEntries).values(data);
  const result = await db.select().from(budgetEntries).where(eq(budgetEntries.profileId, data.profileId)).orderBy(desc(budgetEntries.createdAt)).limit(1);
  return result[0] || null;
}

export async function getBudgetEntries(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(budgetEntries).where(and(eq(budgetEntries.profileId, profileId), eq(budgetEntries.isActive, true))).orderBy(budgetEntries.type, budgetEntries.category);
}

export async function updateBudgetEntry(id: number, data: Partial<typeof budgetEntries.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(budgetEntries).set(data).where(eq(budgetEntries.id, id));
}

export async function deleteBudgetEntry(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(budgetEntries).set({ isActive: false }).where(eq(budgetEntries.id, id));
}

// ─── PAYCHECKS ──────────────────────────────────────────────────────

export async function upsertPaycheck(profileId: number, data: Partial<typeof paychecks.$inferInsert>) {
  const db = await getDb();
  if (!db) return null;
  const existing = await db.select().from(paychecks).where(and(eq(paychecks.profileId, profileId), eq(paychecks.isActive, true))).limit(1);
  if (existing.length > 0) {
    await db.update(paychecks).set(data).where(eq(paychecks.id, existing[0].id));
    const updated = await db.select().from(paychecks).where(eq(paychecks.id, existing[0].id)).limit(1);
    return updated[0] || null;
  } else {
    await db.insert(paychecks).values({ profileId, amountCents: data.amountCents || 0, ...data });
    const created = await db.select().from(paychecks).where(eq(paychecks.profileId, profileId)).orderBy(desc(paychecks.createdAt)).limit(1);
    return created[0] || null;
  }
}

export async function getPaycheck(profileId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(paychecks).where(and(eq(paychecks.profileId, profileId), eq(paychecks.isActive, true))).limit(1);
  return result[0] || null;
}

// ─── BILLS ──────────────────────────────────────────────────────────

export async function addBill(data: typeof bills.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(bills).values(data);
  const result = await db.select().from(bills).where(eq(bills.profileId, data.profileId)).orderBy(desc(bills.createdAt)).limit(1);
  return result[0] || null;
}

export async function getBills(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bills).where(and(eq(bills.profileId, profileId), eq(bills.isActive, true))).orderBy(bills.dueDay);
}

export async function updateBill(id: number, data: Partial<typeof bills.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(bills).set(data).where(eq(bills.id, id));
}

export async function deleteBill(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(bills).set({ isActive: false }).where(eq(bills.id, id));
}

// ─── MILK MONEY ─────────────────────────────────────────────────────

export async function getMilkMoneyAccount(profileId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(milkMoneyAccounts).where(eq(milkMoneyAccounts.profileId, profileId)).limit(1);
  return result[0] || null;
}

export async function createMilkMoneyAccount(profileId: number) {
  const db = await getDb();
  if (!db) return null;
  const existing = await getMilkMoneyAccount(profileId);
  if (existing) return existing;
  await db.insert(milkMoneyAccounts).values({ profileId });
  return getMilkMoneyAccount(profileId);
}

export async function updateMilkMoneyAccount(profileId: number, data: Partial<typeof milkMoneyAccounts.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(milkMoneyAccounts).set(data).where(eq(milkMoneyAccounts.profileId, profileId));
}

export async function addMilkMoneyTransaction(data: typeof milkMoneyTransactions.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(milkMoneyTransactions).values(data);
  const result = await db.select().from(milkMoneyTransactions).where(eq(milkMoneyTransactions.accountId, data.accountId)).orderBy(desc(milkMoneyTransactions.createdAt)).limit(1);
  return result[0] || null;
}

export async function getMilkMoneyTransactions(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(milkMoneyTransactions).where(eq(milkMoneyTransactions.profileId, profileId)).orderBy(desc(milkMoneyTransactions.createdAt));
}

// ─── ANTHEM SHARE TOKENS ────────────────────────────────────────────

export async function createAnthemShareToken(songId: number, senderProfileId: number, recipientName?: string, recipientMessage?: string) {
  const db = await getDb();
  if (!db) return null;
  // Generate a unique token
  const token = `anthem_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  await db.insert(anthemShareTokens).values({ songId, senderProfileId, token, recipientName, recipientMessage, expiresAt });
  const result = await db.select().from(anthemShareTokens).where(eq(anthemShareTokens.token, token)).limit(1);
  return result[0] || null;
}

export async function getAnthemShareToken(token: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(anthemShareTokens).where(eq(anthemShareTokens.token, token)).limit(1);
  return result[0] || null;
}

export async function incrementShareTokenView(token: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(anthemShareTokens).set({ viewCount: sql`viewCount + 1` }).where(eq(anthemShareTokens.token, token));
}

// ─── ADMIN STATS ────────────────────────────────────────────────────

export async function getAdminStats() {
  const db = await getDb();
  if (!db) return null;
  const [totalMembers] = await db.select({ count: sql<number>`count(*)` }).from(gracePersonProfiles);
  const [totalUsers] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [totalSongs] = await db.select({ count: sql<number>`count(*)` }).from(songs);
  const [totalConversations] = await db.select({ count: sql<number>`count(*)` }).from(graceConversations);
  const allImpacts = await db.select().from(financialImpactLog);
  const totalFinancialLift = allImpacts.reduce((sum, i) => sum + i.estimatedValue, 0);
  const [cancelledSubs] = await db.select({ count: sql<number>`count(*)` }).from(subscriptions).where(eq(subscriptions.status, 'cancelled'));
  const membershipCounts = await db.select({ tier: mavenMemberships.tier, count: sql<number>`count(*)` }).from(mavenMemberships).groupBy(mavenMemberships.tier);
  return {
    totalMembers: Number(totalMembers?.count || 0),
    totalUsers: Number(totalUsers?.count || 0),
    totalSongs: Number(totalSongs?.count || 0),
    totalConversations: Number(totalConversations?.count || 0),
    totalFinancialLiftCents: totalFinancialLift,
    cancelledSubscriptions: Number(cancelledSubs?.count || 0),
    membershipsByTier: membershipCounts.reduce((acc, m) => ({ ...acc, [m.tier]: Number(m.count) }), {} as Record<string, number>),
  };
}


// ══════════════════════════════════════════════════════════════════════
// RACE 5 — Dignity Score, PTK, Destiny, Journalist, Village
// ══════════════════════════════════════════════════════════════════════

import {
  dignityScores, promises, destinyAnswers, destinySynthesis,
  stories, villageAgents, agentIntroductions
} from "../drizzle/schema";

// ─── DIGNITY SCORES ──────────────────────────────────────────────────

export async function calculateDignityScore(profileId: number) {
  const db = await getDb();
  if (!db) return null;

  // Vampire Slayer dimension (0-20): based on subscriptions cancelled
  const [cancelledSubs] = await db.select({ count: sql<number>`count(*)` }).from(subscriptions)
    .where(and(eq(subscriptions.profileId, profileId), eq(subscriptions.status, 'cancelled')));
  const vampireSlayer = Math.min(20, (Number(cancelledSubs?.count || 0)) * 5);

  // NSF Shield dimension (0-20): based on NSF fees waived
  const [waivedFees] = await db.select({ count: sql<number>`count(*)` }).from(bills)
    .where(and(eq(bills.profileId, profileId), eq(bills.nsfFeeWaived, true)));
  const nsfShield = Math.min(20, (Number(waivedFees?.count || 0)) * 7);

  // Budget Mastery dimension (0-20): based on budget entries and paycheck tracking
  const [budgetCount] = await db.select({ count: sql<number>`count(*)` }).from(budgetEntries)
    .where(eq(budgetEntries.profileId, profileId));
  const [paycheckExists] = await db.select({ count: sql<number>`count(*)` }).from(paychecks)
    .where(eq(paychecks.profileId, profileId));
  const budgetMastery = Math.min(20, (Number(budgetCount?.count || 0) > 0 ? 10 : 0) + (Number(paycheckExists?.count || 0) > 0 ? 10 : 0));

  // Milk Money Trust dimension (0-20): based on trust score
  const mmAccount = await getMilkMoneyAccount(profileId);
  const milkMoneyTrust = mmAccount ? Math.min(20, Math.round(mmAccount.trustScore / 5)) : 0;

  // Engagement dimension (0-20): conversations + promises kept
  const [convCount] = await db.select({ count: sql<number>`count(*)` }).from(graceConversations)
    .where(eq(graceConversations.profileId, profileId));
  const [promisesKept] = await db.select({ count: sql<number>`count(*)` }).from(promises)
    .where(and(eq(promises.profileId, profileId), eq(promises.status, 'completed')));
  const engagement = Math.min(20, Math.min(10, Number(convCount?.count || 0)) + Math.min(10, (Number(promisesKept?.count || 0)) * 2));

  const totalScore = vampireSlayer + nsfShield + budgetMastery + milkMoneyTrust + engagement;

  // Determine tier
  let tier = "starting_out";
  if (totalScore >= 80) tier = "dignity_achieved";
  else if (totalScore >= 60) tier = "rising_strong";
  else if (totalScore >= 40) tier = "building_momentum";
  else if (totalScore >= 20) tier = "finding_footing";

  // Save snapshot
  await db.insert(dignityScores).values({
    profileId, vampireSlayer, nsfShield, budgetMastery, milkMoneyTrust, engagement, totalScore, tier
  });

  return { vampireSlayer, nsfShield, budgetMastery, milkMoneyTrust, engagement, totalScore, tier };
}

export async function getLatestDignityScore(profileId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(dignityScores)
    .where(eq(dignityScores.profileId, profileId))
    .orderBy(desc(dignityScores.createdAt)).limit(1);
  return result[0] || null;
}

export async function getDignityScoreHistory(profileId: number, limit = 30) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(dignityScores)
    .where(eq(dignityScores.profileId, profileId))
    .orderBy(desc(dignityScores.createdAt)).limit(limit);
}

// ─── PROMISES (PTK Genie) ────────────────────────────────────────────

export async function createPromise(data: typeof promises.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(promises).values(data);
  return { id: result[0].insertId };
}

export async function getPromises(profileId: number, status?: string) {
  const db = await getDb();
  if (!db) return [];
  if (status) {
    return db.select().from(promises)
      .where(and(eq(promises.profileId, profileId), eq(promises.status, status as any)))
      .orderBy(desc(promises.createdAt));
  }
  return db.select().from(promises)
    .where(eq(promises.profileId, profileId))
    .orderBy(desc(promises.createdAt));
}

export async function updatePromise(id: number, data: Partial<typeof promises.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(promises).set(data).where(eq(promises.id, id));
}

export async function getPromiseStats(profileId: number) {
  const db = await getDb();
  if (!db) return { active: 0, completed: 0, broken: 0 };
  const [active] = await db.select({ count: sql<number>`count(*)` }).from(promises)
    .where(and(eq(promises.profileId, profileId), eq(promises.status, 'active')));
  const [completed] = await db.select({ count: sql<number>`count(*)` }).from(promises)
    .where(and(eq(promises.profileId, profileId), eq(promises.status, 'completed')));
  const [broken] = await db.select({ count: sql<number>`count(*)` }).from(promises)
    .where(and(eq(promises.profileId, profileId), eq(promises.status, 'broken')));
  return {
    active: Number(active?.count || 0),
    completed: Number(completed?.count || 0),
    broken: Number(broken?.count || 0),
  };
}

// ─── DESTINY DISCOVERY ───────────────────────────────────────────────

export async function addDestinyAnswer(data: typeof destinyAnswers.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(destinyAnswers).values(data);
  return { id: result[0].insertId };
}

export async function getDestinyAnswers(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(destinyAnswers)
    .where(eq(destinyAnswers.profileId, profileId))
    .orderBy(destinyAnswers.questionNumber);
}

export async function getDestinyProgress(profileId: number) {
  const db = await getDb();
  if (!db) return { answered: 0, total: 30, currentWave: 'safe' as const };
  const answers = await db.select().from(destinyAnswers)
    .where(and(eq(destinyAnswers.profileId, profileId), sql`answer IS NOT NULL`));
  const answered = answers.length;
  let currentWave: 'safe' | 'reflective' | 'deep' = 'safe';
  if (answered >= 20) currentWave = 'deep';
  else if (answered >= 10) currentWave = 'reflective';
  return { answered, total: 30, currentWave };
}

export async function upsertDestinySynthesis(profileId: number, data: Partial<typeof destinySynthesis.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(destinySynthesis).where(eq(destinySynthesis.profileId, profileId)).limit(1);
  if (existing.length > 0) {
    await db.update(destinySynthesis).set({ ...data, lastUpdatedAt: new Date() }).where(eq(destinySynthesis.profileId, profileId));
  } else {
    await db.insert(destinySynthesis).values({ profileId, ...data } as any);
  }
}

export async function getDestinySynthesis(profileId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(destinySynthesis).where(eq(destinySynthesis.profileId, profileId)).limit(1);
  return result[0] || null;
}

// ─── STORIES (Jolene the Journalist) ─────────────────────────────────

export async function createStory(data: typeof stories.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(stories).values(data);
  return { id: result[0].insertId };
}

export async function getStories(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stories)
    .where(eq(stories.profileId, profileId))
    .orderBy(desc(stories.createdAt));
}

export async function getStoryById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(stories).where(eq(stories.id, id)).limit(1);
  return result[0] || null;
}

export async function updateStory(id: number, data: Partial<typeof stories.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(stories).set(data).where(eq(stories.id, id));
}

export async function getCommunityStories(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stories)
    .where(eq(stories.visibility, 'community'))
    .orderBy(desc(stories.createdAt)).limit(limit);
}

// ─── VILLAGE AGENTS ──────────────────────────────────────────────────

export async function getAllVillageAgents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(villageAgents).where(eq(villageAgents.isActive, true));
}

export async function getAgentByKey(agentKey: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(villageAgents).where(eq(villageAgents.agentKey, agentKey)).limit(1);
  return result[0] || null;
}

export async function getIntroducedAgents(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    introduction: agentIntroductions,
    agent: villageAgents,
  }).from(agentIntroductions)
    .innerJoin(villageAgents, eq(agentIntroductions.agentId, villageAgents.id))
    .where(eq(agentIntroductions.profileId, profileId));
}

export async function introduceAgent(profileId: number, agentId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(agentIntroductions).values({ profileId, agentId });
  return { id: result[0].insertId };
}

export async function renameAgent(profileId: number, agentId: number, customName: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(agentIntroductions).set({ customName, renamedAt: new Date() })
    .where(and(eq(agentIntroductions.profileId, profileId), eq(agentIntroductions.agentId, agentId)));
}

export async function incrementAgentInteraction(profileId: number, agentId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(agentIntroductions)
    .set({ interactionCount: sql`interactionCount + 1` })
    .where(and(eq(agentIntroductions.profileId, profileId), eq(agentIntroductions.agentId, agentId)));
}

// ─── MILK MONEY NUDGES ──────────────────────────────────────────────

export async function getOverdueBorrows(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(milkMoneyTransactions)
    .where(and(
      eq(milkMoneyTransactions.profileId, profileId),
      eq(milkMoneyTransactions.type, 'borrow'),
      sql`repaidAt IS NULL`,
      sql`dueDate < NOW()`
    ));
}

export async function getUpcomingBorrows(profileId: number, daysAhead = 3) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(milkMoneyTransactions)
    .where(and(
      eq(milkMoneyTransactions.profileId, profileId),
      eq(milkMoneyTransactions.type, 'borrow'),
      sql`repaidAt IS NULL`,
      sql`dueDate BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL ${daysAhead} DAY)`
    ));
}

// ── Race 6 Imports ─────────────────────────────────────────────────────
import {
  graceStatus, communityCredits, communityCreditsLog,
  paydayPatterns, crisisBeacons, destinyMoonshots
} from "../drizzle/schema";

// ── Grace Status (Battery + Degradation) ───────────────────────────────

export async function getGraceStatus(profileId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(graceStatus).where(eq(graceStatus.profileId, profileId));
  return rows[0] || null;
}

export async function upsertGraceStatus(profileId: number, data: Partial<typeof graceStatus.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  const existing = await getGraceStatus(profileId);
  if (existing) {
    await db.update(graceStatus).set({ ...data, updatedAt: new Date() }).where(eq(graceStatus.profileId, profileId));
  } else {
    await db.insert(graceStatus).values({ profileId, ...data });
  }
}

export async function calculateBatteryLevel(profileId: number): Promise<number> {
  const status = await getGraceStatus(profileId);
  if (!status) return 100;
  const daysPastDue = status.daysPastDue || 0;
  if (daysPastDue <= 0) return 100;
  if (daysPastDue <= 3) return 95;    // silent retry
  if (daysPastDue <= 7) return 85;    // gentle notice
  if (daysPastDue <= 14) return 70;   // pause offer
  if (daysPastDue <= 27) return 50;   // tier 1
  if (daysPastDue <= 44) return 30;   // tier 2
  if (daysPastDue <= 60) return 10;   // tier 3/4
  return 5;                           // grace lite floor
}

export async function getSpeedStage(batteryLevel: number): Promise<string> {
  if (batteryLevel >= 86) return "normal";
  if (batteryLevel >= 70) return "thoughtful";
  if (batteryLevel >= 50) return "tired";
  if (batteryLevel >= 30) return "stretched";
  return "running_low";
}

export async function getDegradationTier(profileId: number): Promise<string> {
  const status = await getGraceStatus(profileId);
  if (!status) return "full";
  const days = status.daysPastDue || 0;
  if (days <= 13) return "full";
  if (days <= 27) return "essentials_lite";
  if (days <= 44) return "core";
  if (status.dignityScore100Achieved) return "careful";
  return "lite";
}

// ── Community Credits ──────────────────────────────────────────────────

export async function getCommunityCredits(profileId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(communityCredits).where(eq(communityCredits.profileId, profileId));
  return rows[0] || null;
}

export async function ensureCommunityCredits(profileId: number) {
  const db = await getDb();
  if (!db) return null;
  const existing = await getCommunityCredits(profileId);
  if (existing) return existing;
  await db.insert(communityCredits).values({ profileId });
  return getCommunityCredits(profileId);
}

export async function earnCredits(profileId: number, amount: number, category: string, description?: string) {
  const db = await getDb();
  if (!db) return;
  await ensureCommunityCredits(profileId);
  await db.update(communityCredits).set({
    balance: sql`balance + ${amount}`,
    totalEarned: sql`totalEarned + ${amount}`,
    updatedAt: new Date(),
  }).where(eq(communityCredits.profileId, profileId));
  await db.insert(communityCreditsLog).values({
    profileId, type: "earn", amount, category,
    description: description || `Earned ${amount} credits for ${category}`,
  });
}

export async function redeemCredits(profileId: number, amount: number, description?: string) {
  const db = await getDb();
  if (!db) return { success: false, message: "Database unavailable" };
  const account = await ensureCommunityCredits(profileId);
  if (!account || account.balance < amount) {
    return { success: false, message: "Insufficient credits" };
  }
  // 50% redemption rate: 100 credits = $0.50 toward subscription
  await db.update(communityCredits).set({
    balance: sql`balance - ${amount}`,
    totalRedeemed: sql`totalRedeemed + ${amount}`,
    updatedAt: new Date(),
  }).where(eq(communityCredits.profileId, profileId));
  await db.insert(communityCreditsLog).values({
    profileId, type: "redeem", amount, category: "subscription",
    description: description || `Redeemed ${amount} credits toward subscription`,
  });
  return { success: true, creditsUsed: amount, dollarValue: (amount * 0.5 / 100).toFixed(2) };
}

export async function getCommunityCreditsLog(profileId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(communityCreditsLog)
    .where(eq(communityCreditsLog.profileId, profileId))
    .orderBy(desc(communityCreditsLog.createdAt))
    .limit(limit);
}

// ── Payday Detection ───────────────────────────────────────────────────

export async function getPaydayPattern(profileId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(paydayPatterns).where(eq(paydayPatterns.profileId, profileId));
  return rows[0] || null;
}

export async function upsertPaydayPattern(profileId: number, data: Partial<typeof paydayPatterns.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  const existing = await getPaydayPattern(profileId);
  if (existing) {
    await db.update(paydayPatterns).set({ ...data, updatedAt: new Date() }).where(eq(paydayPatterns.profileId, profileId));
  } else {
    await db.insert(paydayPatterns).values({ profileId, frequency: data.frequency || "biweekly", ...data });
  }
}

export function calculateNextPayday(pattern: { frequency: string; dayOfWeek?: number | null; dayOfMonth1?: number | null; dayOfMonth2?: number | null; lastPayday?: Date | null }): Date {
  const now = new Date();
  const freq = pattern.frequency;
  if (freq === "weekly" && pattern.dayOfWeek != null) {
    const target = new Date(now);
    const diff = (pattern.dayOfWeek - now.getDay() + 7) % 7;
    target.setDate(now.getDate() + (diff === 0 ? 7 : diff));
    return target;
  }
  if (freq === "biweekly" && pattern.lastPayday) {
    const last = new Date(pattern.lastPayday);
    const next = new Date(last);
    next.setDate(last.getDate() + 14);
    while (next <= now) next.setDate(next.getDate() + 14);
    return next;
  }
  if (freq === "monthly" && pattern.dayOfMonth1 != null) {
    const target = new Date(now.getFullYear(), now.getMonth(), pattern.dayOfMonth1);
    if (target <= now) target.setMonth(target.getMonth() + 1);
    return target;
  }
  if (freq === "semimonthly" && pattern.dayOfMonth1 != null && pattern.dayOfMonth2 != null) {
    const d1 = new Date(now.getFullYear(), now.getMonth(), pattern.dayOfMonth1);
    const d2 = new Date(now.getFullYear(), now.getMonth(), pattern.dayOfMonth2);
    if (d1 > now) return d1;
    if (d2 > now) return d2;
    d1.setMonth(d1.getMonth() + 1);
    return d1;
  }
  // Default: assume biweekly from today
  const fallback = new Date(now);
  fallback.setDate(now.getDate() + 14);
  return fallback;
}

// ── Crisis Beacons ─────────────────────────────────────────────────────

export async function createCrisisBeacon(profileId: number, agentsActivated: string[]) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(crisisBeacons).values({
    profileId,
    agentsActivated: JSON.stringify(agentsActivated),
  });
  return result;
}

export async function getActiveBeacon(profileId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(crisisBeacons)
    .where(and(eq(crisisBeacons.profileId, profileId), eq(crisisBeacons.status, "active")));
  return rows[0] || null;
}

export async function resolveBeacon(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(crisisBeacons).set({ status: "resolved", resolvedAt: new Date() }).where(eq(crisisBeacons.id, id));
}

// ── Destiny Moonshot ───────────────────────────────────────────────────

export async function getMoonshot(profileId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(destinyMoonshots).where(eq(destinyMoonshots.profileId, profileId));
  return rows[0] || null;
}

export async function createMoonshot(profileId: number, data: Partial<typeof destinyMoonshots.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  const existing = await getMoonshot(profileId);
  if (existing) {
    await db.update(destinyMoonshots).set(data).where(eq(destinyMoonshots.profileId, profileId));
  } else {
    await db.insert(destinyMoonshots).values({ profileId, ...data });
  }
}

export async function revealMoonshot(profileId: number, statement: string, coreValues: string[], strengths: string[]) {
  const db = await getDb();
  if (!db) return;
  await createMoonshot(profileId, {
    revealed: true,
    revealedAt: new Date(),
    moonshotStatement: statement,
    coreValues: JSON.stringify(coreValues),
    strengths: JSON.stringify(strengths),
  });
}

// ─── ESSENTIALS BOX FULFILLMENT (Race 7) ────────────────────────────

export async function createEssentialsOrder(data: {
  profileId?: number | null;
  userId?: number | null;
  memberName?: string | null;
  memberEmail?: string | null;
  deliveryAddress: string;
  postalCode?: string | null;
  itemsRequested?: string | null;
  requestSource?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(essentialsOrders).values({
    profileId: data.profileId ?? undefined,
    userId: data.userId ?? undefined,
    memberName: data.memberName ?? undefined,
    memberEmail: data.memberEmail ?? undefined,
    deliveryAddress: data.deliveryAddress,
    postalCode: data.postalCode ?? undefined,
    itemsRequested: data.itemsRequested ?? undefined,
    requestSource: data.requestSource ?? "member",
    status: "pending",
  });
  return { id: result[0].insertId };
}

export async function listEssentialsOrders(statusFilter?: string) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(essentialsOrders).orderBy(desc(essentialsOrders.createdAt));
  if (statusFilter && statusFilter !== "all") {
    query = query.where(eq(essentialsOrders.status, statusFilter as any)) as any;
  }
  return query;
}

export async function getEssentialsOrder(orderId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(essentialsOrders).where(eq(essentialsOrders.id, orderId)).limit(1);
  return rows[0] ?? null;
}

export async function updateEssentialsOrderStatus(orderId: number, status: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(essentialsOrders).set({
    status: status as any,
    statusUpdatedAt: new Date(),
  }).where(eq(essentialsOrders.id, orderId));
}

export async function updateEssentialsOrderNotes(orderId: number, notes: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(essentialsOrders).set({ notes }).where(eq(essentialsOrders.id, orderId));
}

export async function updateEssentialsOrderCourier(orderId: number, courierMethod: string, trackingNumber?: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(essentialsOrders).set({
    courierMethod,
    trackingNumber: trackingNumber ?? undefined,
  }).where(eq(essentialsOrders.id, orderId));
}

export async function getMemberOrders(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(essentialsOrders)
    .where(eq(essentialsOrders.profileId, profileId))
    .orderBy(desc(essentialsOrders.createdAt));
}

export async function getEssentialsOrderStats() {
  const db = await getDb();
  if (!db) return { total: 0, pending: 0, packed: 0, shipped: 0, delivered: 0 };
  const all = await db.select().from(essentialsOrders);
  return {
    total: all.length,
    pending: all.filter(o => o.status === "pending").length,
    packed: all.filter(o => o.status === "packed").length,
    shipped: all.filter(o => o.status === "shipped").length,
    delivered: all.filter(o => o.status === "delivered").length,
  };
}

// ══════════════════════════════════════════════════════════════════════
// RACE 14 — Grace Consciousness DB Helpers
// ══════════════════════════════════════════════════════════════════════

export async function getGracePreferences(profileId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(gracePreferences).where(eq(gracePreferences.profileId, profileId)).limit(1);
  return rows[0] || null;
}

export async function upsertGracePreferences(profileId: number, data: Partial<{
  userId: number;
  personality: "angel" | "coach" | "fierce" | "bestfriend" | "antithesis";
  expertise: string;
  scheduleType: "early_bird" | "nine_to_five" | "night_shift" | "irregular" | "stay_at_home";
  wakeTime: string;
  sleepTime: string;
  consciousnessTier: "free" | "essentials" | "plus";
  hapticsEnabled: boolean;
  kamiMomentEnabled: boolean;
  kamiMomentTime: string;
  graceHomeSetting: string;
  culturalBackground: string;
  languageStyle: "casual" | "formal" | "warm" | "direct";
  coachingMode: "chat" | "coach";
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: "normal" | "large" | "xlarge";
  onboardingStep: number;
  onboardingComplete: boolean;
  lastDailySelfAt: Date;
  lastVulnerabilityAt: Date;
  lastSelfCareCheckAt: Date;
  lastCelebrationAt: Date;
}>) {
  const db = await getDb();
  if (!db) return null;
  const existing = await getGracePreferences(profileId);
  if (existing) {
    await db.update(gracePreferences).set(data).where(eq(gracePreferences.profileId, profileId));
    return { ...existing, ...data };
  } else {
    const result = await db.insert(gracePreferences).values({ profileId, ...data });
    return { profileId, ...data, id: result[0].insertId };
  }
}

export async function createReferralCode(profileId: number) {
  const db = await getDb();
  if (!db) return null;
  const code = `grace-${profileId}-${Math.random().toString(36).substring(2, 8)}`;
  await db.insert(graceReferrals).values({ referrerProfileId: profileId, referralCode: code });
  return code;
}

export async function getReferralsByProfile(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(graceReferrals).where(eq(graceReferrals.referrerProfileId, profileId));
}

export async function claimReferral(referralCode: string, referredProfileId: number, referredName: string) {
  const db = await getDb();
  if (!db) return false;
  const rows = await db.select().from(graceReferrals).where(eq(graceReferrals.referralCode, referralCode)).limit(1);
  if (!rows[0] || rows[0].status !== "pending") return false;
  await db.update(graceReferrals).set({
    referredProfileId,
    referredName,
    status: "joined",
    joinedAt: new Date(),
  }).where(eq(graceReferrals.referralCode, referralCode));
  return true;
}

export async function countFriendsWithGrace(profileId: number) {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db.select().from(graceReferrals)
    .where(and(eq(graceReferrals.referrerProfileId, profileId), eq(graceReferrals.status, "joined")));
  return rows.length;
}

export async function countNeighborsWithGrace() {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db.select().from(gracePersonProfiles);
  return rows.length;
}


// ─── PUSH SUBSCRIPTIONS (Race 16) ──────────────────────────────────

export async function savePushSubscription(profileId: number, endpoint: string, p256dh: string, auth: string) {
  const db = await getDb();
  if (!db) return null;
  // Upsert — replace if same endpoint exists
  const existing = await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));
  if (existing.length > 0) {
    await db.update(pushSubscriptions).set({ profileId, p256dh, auth, updatedAt: new Date() }).where(eq(pushSubscriptions.endpoint, endpoint));
    return existing[0];
  }
  const [result] = await db.insert(pushSubscriptions).values({ profileId, endpoint, p256dh, auth });
  return { id: result.insertId };
}

export async function getPushSubscriptions(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pushSubscriptions).where(eq(pushSubscriptions.profileId, profileId));
}

export async function deletePushSubscription(endpoint: string) {
  const db = await getDb();
  if (!db) return;
  await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));
}

// ─── CONVERSATION SUMMARIES (Race 16) ──────────────────────────────

export async function saveConversationSummary(profileId: number, summary: string, messageCount: number) {
  const db = await getDb();
  if (!db) return null;
  // Only keep the latest summary per profile
  const existing = await db.select().from(conversationSummaries).where(eq(conversationSummaries.profileId, profileId));
  if (existing.length > 0) {
    await db.update(conversationSummaries).set({ summary, messageCount, lastConversationAt: new Date() }).where(eq(conversationSummaries.profileId, profileId));
    return existing[0];
  }
  const [result] = await db.insert(conversationSummaries).values({ profileId, summary, messageCount, lastConversationAt: new Date() });
  return { id: result.insertId };
}

export async function getConversationSummary(profileId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(conversationSummaries).where(eq(conversationSummaries.profileId, profileId));
  return rows[0] ?? null;
}
