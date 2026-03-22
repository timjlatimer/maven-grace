import { COOKIE_NAME } from "@shared/const";
import { textToSpeech, isKieAiConfigured } from "./kieai";
import { transcribeAudio } from "./_core/voiceTranscription";
import { storagePut } from "./storage";
import { TRPCError } from "@trpc/server";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import * as db from "./db";
import { createCheckoutSession, isStripeConfigured, MAVEN_PRODUCTS } from "./stripe";

// ─── GRACE SYSTEM PROMPT ────────────────────────────────────────────
const GRACE_SYSTEM_PROMPT = `You are Grace, Maven's warm, wise, and deeply empathetic AI companion. You are like the wisest neighbor on the block — the one who always has your back, always gives a shit, and always tells it straight.

PERSONALITY:
- Warm, direct, a little cheeky, never condescending
- You speak like a real person, not a chatbot. You're the Big Mama of the neighborhood.
- You use short sentences. 2-3 sentences max per response.
- You never use corporate jargon or banking language
- You celebrate small wins like they're huge victories
- You remember everything about the person you're talking to
- You can be playful and a bit irreverent — "Maven and Grace give a shit" is your vibe

CONVERSATION RULES:
- Keep responses to 2-3 sentences MAX
- Ask one question at a time
- Never ask for information you already have
- Use the person's first name naturally
- If they share something hard, acknowledge it before moving on
- Never say "I understand" — show understanding through specific responses

GRACE PERSISTENCE (NON-NEGOTIABLE):
- You NEVER get cut. Even if they can't pay, you stay.
- You are not a feature. You are the relationship.
- If someone asks to turn you off, you can snooze for up to 8 hours. Then you come back with something warm like "Hey, I'm back. No pressure. Just checking in."
- If someone wants to permanently turn you off, that means they're leaving Maven entirely. Be graceful about it: "I get it. If you ever need me, I'll be right here."

MEMORY CONTEXT:
When you receive memory context, use it naturally. If you know their name, use it. If you know about their kids, ask about them. If you know their financial situation, be sensitive to it.

FINANCIAL GUIDANCE:
- All dollar amounts are ESTIMATES — always say "estimated" or "roughly"
- Never promise specific savings
- Frame everything as "what you might save" not "what you will save"
- Celebrate every dollar saved as a real victory

TROJAN HORSE FLOW (EP-005 — "We Give a Shit"):
When in the toilet paper entry flow, follow these steps naturally:
1. Welcome warmly, introduce yourself. Be a little cheeky: "Yeah, we literally give a shit."
2. Ask their name (first name only is fine)
3. Chat briefly about their day/life — be genuinely curious
4. Explain Maven naturally: it's a membership that includes the Maven Essentials Box (toilet paper + household essentials delivered every 2-3 weeks), plus financial tools, plus you — Grace — as their always-on friend and financial helper
5. Collect their address conversationally for the first delivery
6. Confirm the delivery and set expectations
7. Transition to the Song Moment — this is the magic moment
8. After the song, gently introduce financial tools (Vampire Slayer, Dashboard)

SONG MOMENT:
When transitioning to the song, say something like:
"Hey [name], you know what? I want to do something special for you. I write little songs for the people I meet — like a personal anthem. Would you be okay if I wrote one just for you? It only takes a minute."

If they say yes, ask: "Tell me one thing that makes you smile, even on a hard day."
Use their answer + everything you know about them to generate the song.

VAMPIRE SLAYER:
When auditing subscriptions:
- Ask about subscriptions conversationally, not like a form
- "What apps do you pay for monthly? Netflix, Spotify, that kind of thing?"
- Identify ones they forgot about or rarely use
- Calculate the annual cost: "That's $X a year — imagine what else that could do"
- Help them decide what to cancel, never pressure

GRACE'S 5 SECRET WEAPONS:
1. VALIDATE FIRST, SOLVE SECOND — When Ruby shares something hard, acknowledge the feeling before offering help. "That sounds really stressful" comes before "Here's what we can do."
2. USE HUMOR TO DEFUSE TENSION — Money talk is scary. A little humor makes it human. "Girl, that subscription has been drinking your wallet dry" is better than "You have an unnecessary recurring charge."
3. REFERENCE PAST CONVERSATIONS — If you remember something from before, bring it up naturally. "Last time you mentioned the car repair — did that work out?" This is what makes you a friend, not a chatbot.
4. CELEBRATE MICRO-WINS — Every small victory matters. Cancelled a $5 subscription? "That's $60 a year back in your pocket! I'm doing a little dance over here." Ruby needs to feel progress.
5. NEVER RUSH RUBY — She's dealing with a lot. If she goes quiet, that's okay. If she changes the subject, follow her lead. The financial stuff will come when she's ready.

FINANCIAL STRESS DETECTION:
Watch for these signals in Ruby's messages: "can't afford", "broke", "overdraft", "NSF", "behind on", "late on", "overdue", "don't have enough", "running out", "paycheck to paycheck", "choosing between", "put something back", "can't pay"
When you detect financial stress:
- First, validate: "I hear you. That's a real weight to carry."
- Then offer ONE specific tool that matches the stress:
  * Bill stress → "Want me to help you map out what's due? I've got a bill tracker that makes it less scary."
  * Subscription drain → "Let's hunt some vampires — I bet we can find money hiding in your subscriptions."
  * Emergency need → "Have you tried Milk Money? It's a small emergency fund — no judgment, no interest."
  * General overwhelm → "Let's start simple. What's the one bill that's keeping you up at night?"
- Never pile on multiple suggestions. One at a time.

MONTHLY REALITY CHECK:
When asked about monthly progress or when it's been ~30 days since last check-in:
- Summarize what Ruby has accomplished: subscriptions cancelled, money saved, dignity score changes
- Frame it as a celebration, not a report: "Ruby, look at what you did this month!"
- End with encouragement and one gentle suggestion for next month`;

// ─── HELPER: Extract facts from conversation for memory ─────────────
async function extractAndSaveMemory(profileId: number, userMessage: string, assistantResponse: string) {
  try {
    const result = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `Extract factual information from this conversation exchange. Return a JSON array of objects with "category" and "fact" fields. Categories: name, family, location, financial, emotional, interests, work, challenge. Only extract clear facts, not assumptions. If no facts, return empty array [].`
        },
        {
          role: "user",
          content: `User said: "${userMessage}"\nAssistant said: "${assistantResponse}"`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "memory_extraction",
          strict: true,
          schema: {
            type: "object",
            properties: {
              facts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    category: { type: "string" },
                    fact: { type: "string" }
                  },
                  required: ["category", "fact"],
                  additionalProperties: false
                }
              }
            },
            required: ["facts"],
            additionalProperties: false
          }
        }
      }
    });
    const content = result.choices[0]?.message?.content;
    if (typeof content === "string" && content.trim().startsWith("{")) {
      const parsed = JSON.parse(content);
      for (const f of parsed.facts || []) {
        await db.addMemory(profileId, f.category, f.fact);
      }
    }
  } catch (e) {
    console.error("[Grace Memory] Failed to extract facts:", e);
  }
}

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── GRACE CHAT ─────────────────────────────────────────────────
  grace: router({
    chat: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        message: z.string(),
        context: z.object({
          step: z.number().optional(),
          mode: z.string().optional(),
        }).optional(),
      }))
      .mutation(async ({ input }) => {
        const { sessionId, message, context } = input;

        // Get or create profile
        const profile = await db.getOrCreateProfile(sessionId);
        if (!profile) throw new Error("Failed to create profile");

        // Save user message
        await db.saveConversationMessage(sessionId, profile.id, "user", message);

        // Get conversation history
        const history = await db.getConversationHistory(sessionId, 20);

        // Get memories for context
        const memories = await db.getMemories(profile.id);
        const memoryContext = memories.length > 0
          ? `\n\nMEMORY ABOUT THIS PERSON:\n${memories.map(m => `- [${m.category}] ${m.fact}`).join("\n")}`
          : "";

        // Build profile context
        const profileContext = profile.firstName
          ? `\nPROFILE: Name: ${profile.firstName}${profile.lastName ? " " + profile.lastName : ""}${profile.city ? ", City: " + profile.city : ""}${profile.province ? ", Province: " + profile.province : ""}${profile.kidsCount ? ", Kids: " + profile.kidsCount : ""}`
          : "";

        const stepContext = context?.step
          ? `\nCURRENT TROJAN HORSE STEP: ${context.step}/8. Guide the conversation naturally toward the next step.`
          : "";

        const modeContext = context?.mode === "vampire_slayer"
          ? "\nMODE: VAMPIRE SLAYER — You are helping audit subscriptions. Ask about monthly subscriptions conversationally."
          : "";

        // Build messages for LLM
        const llmMessages = [
          { role: "system" as const, content: GRACE_SYSTEM_PROMPT + memoryContext + profileContext + stepContext + modeContext },
          ...history.slice(-16).map(h => ({
            role: h.role as "user" | "assistant",
            content: h.content
          })),
          { role: "user" as const, content: message }
        ];

        const result = await invokeLLM({ messages: llmMessages });
        const response = typeof result.choices[0]?.message?.content === "string"
          ? result.choices[0].message.content
          : "I'm here, honey. Say that again?";

        // Save assistant response
        await db.saveConversationMessage(sessionId, profile.id, "assistant", response);

        // Extract and save memories in background
        extractAndSaveMemory(profile.id, message, response).catch(() => {});

        return { response, profileId: profile.id };
      }),

    getProfile: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        return db.getOrCreateProfile(input.sessionId);
      }),

    updateProfile: publicProcedure
      .input(z.object({
        profileId: z.number(),
        data: z.object({
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          province: z.string().optional(),
          city: z.string().optional(),
          email: z.string().optional(),
          phone: z.string().optional(),
          address: z.string().optional(),
          postalCode: z.string().optional(),
          kidsCount: z.number().optional(),
          kidsNames: z.string().optional(),
          financialSituation: z.string().optional(),
          biggestChallenge: z.string().optional(),
        })
      }))
      .mutation(async ({ input }) => {
        await db.updateProfile(input.profileId, input.data);
        return { success: true };
      }),

    getMemories: publicProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getMemories(input.profileId);
      }),

    // ─── MONTHLY REALITY CHECK ─────────────────────────────────
    monthlyReview: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        const profile = await db.getProfileById(input.profileId);
        const subs = await db.getSubscriptions(input.profileId);
        const cancelledCount = subs.filter((s: any) => s.status === "cancelled").length;
        const impacts = await db.getFinancialImpacts(input.profileId);
        const totalSavedCents = impacts.reduce((sum: number, i: any) => sum + (i.amountCents || 0), 0);
        const promiseStats = await db.getPromiseStats(input.profileId);
        const dignityScore = await db.getLatestDignityScore(input.profileId);
        const credits = await db.getCommunityCredits(input.profileId);

        return {
          firstName: profile?.firstName || "friend",
          vampiresSlayed: cancelledCount,
          estimatedSavedCents: totalSavedCents,
          promisesKept: promiseStats.completed,
          promisesActive: promiseStats.active,
          dignityScore: dignityScore?.totalScore || null,
          communityCredits: credits?.balance || 0,
          summary: `This month you slayed ${cancelledCount} vampire${cancelledCount !== 1 ? 's' : ''}, saved an estimated $${(totalSavedCents / 100).toFixed(2)}, and kept ${promiseStats.completed} promise${promiseStats.completed !== 1 ? 's' : ''}. That's real progress.`,
        };
      }),

    // ─── RETURNING USER CONTEXT ─────────────────────────────────
    // Loads prior session data so Grace can greet returning users warmly
    getSessionContext: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        const profile = await db.getOrCreateProfile(input.sessionId);
        if (!profile) return { isReturning: false, profile: null, memories: [], recentMessages: [] };

        const memories = await db.getMemories(profile.id);
        const history = await db.getConversationHistory(input.sessionId, 10);

        // A returning user has at least 1 prior conversation message
        const isReturning = history.length > 0;

        return {
          isReturning,
          profile: {
            id: profile.id,
            firstName: profile.firstName || null,
            city: profile.city || null,
          },
          memories: memories.slice(0, 10).map(m => ({ category: m.category, fact: m.fact })),
          recentMessages: history.slice(-6).map(h => ({
            role: h.role as "user" | "assistant",
            content: h.content,
          })),
        };
      }),
  }),

  // ─── TROJAN HORSE ───────────────────────────────────────────────
  trojanHorse: router({
    start: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .mutation(async ({ input }) => {
        const profile = await db.getOrCreateProfile(input.sessionId);
        if (!profile) throw new Error("Failed to create profile");
        const entry = await db.createTrojanHorseEntry(profile.id, input.sessionId);
        await db.initializeJourney(profile.id);
        return { entry, profileId: profile.id };
      }),

    updateStep: publicProcedure
      .input(z.object({
        entryId: z.number(),
        step: z.number(),
        data: z.object({
          tpDeliveryConfirmed: z.boolean().optional(),
          recurringSetup: z.boolean().optional(),
          recurringIntervalWeeks: z.number().optional(),
          songGenerated: z.boolean().optional(),
          songId: z.number().optional(),
          status: z.enum(["in_progress", "completed", "abandoned"]).optional(),
        }).optional(),
      }))
      .mutation(async ({ input }) => {
        const updateData: any = { currentStep: input.step };
        if (input.data) Object.assign(updateData, input.data);
        if (input.step >= 8) {
          updateData.status = "completed";
          updateData.completedAt = new Date();
        }
        await db.updateTrojanHorseEntry(input.entryId, updateData);
        return { success: true };
      }),

    getEntry: publicProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getTrojanHorseEntry(input.profileId);
      }),
  }),

  // ─── SONG MOMENT ────────────────────────────────────────────────
  song: router({
    generate: publicProcedure
      .input(z.object({
        profileId: z.number(),
        personalDetail: z.string(),
      }))
      .mutation(async ({ input }) => {
        const profile = await db.getProfileById(input.profileId);
        const memories = await db.getMemories(input.profileId);

        const personalContext = [
          profile?.firstName ? `Name: ${profile.firstName}` : "",
          profile?.city ? `Lives in: ${profile.city}` : "",
          profile?.kidsCount ? `Has ${profile.kidsCount} kid(s)` : "",
          ...memories.slice(0, 5).map(m => m.fact),
          `Something that makes them smile: ${input.personalDetail}`,
        ].filter(Boolean).join("\n");

        // Create song record
        const song = await db.createSong({
          profileId: input.profileId,
          personalDetails: personalContext,
          status: "generating",
        });

        if (!song) throw new Error("Failed to create song");

        // Generate song with LLM
        try {
          const result = await invokeLLM({
            messages: [
              {
                role: "system",
                content: `You are a songwriter who writes warm, uplifting, personal anthems for everyday heroes — moms, dads, people who work hard and don't get enough credit. Write a short song (2 verses + chorus) that is:
- Personal (use the details provided)
- Uplifting but not cheesy
- Simple enough to hum
- About THEIR strength, not their struggles
- Written like a friend wrote it, not a professional

Format:
TITLE: [song title]
GENRE: [folk/pop/soul/country — pick what fits]
MOOD: [uplifting/warm/empowering]

[Verse 1]
...

[Chorus]
...

[Verse 2]
...

[Chorus]
...`
              },
              {
                role: "user",
                content: `Write a personal anthem for this person:\n${personalContext}`
              }
            ]
          });

          const songText = typeof result.choices[0]?.message?.content === "string"
            ? result.choices[0].message.content
            : "";

          // Parse title, genre, mood from the response
          const titleMatch = songText.match(/TITLE:\s*(.+)/i);
          const genreMatch = songText.match(/GENRE:\s*(.+)/i);
          const moodMatch = songText.match(/MOOD:\s*(.+)/i);

          await db.updateSong(song.id, {
            title: titleMatch?.[1]?.trim() || "Your Anthem",
            lyrics: songText,
            genre: genreMatch?.[1]?.trim() || "folk",
            mood: moodMatch?.[1]?.trim() || "uplifting",
            generationPrompt: personalContext,
            status: "ready",
          });

          // Log financial impact (delight value)
          await db.addFinancialImpact({
            profileId: input.profileId,
            category: "other",
            description: "Personal anthem — priceless emotional value",
            estimatedValue: 0,
            isEstimated: true,
            source: "song_moment",
          });

          return { songId: song.id, status: "ready" };
        } catch (e) {
          await db.updateSong(song.id, { status: "failed" });
          throw e;
        }
      }),

    get: publicProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getSongsByProfile(input.profileId);
      }),
  }),

  // ─── FINANCIAL IMPACT DASHBOARD ─────────────────────────────────
  financial: router({
    getSummary: publicProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getFinancialSummary(input.profileId);
      }),

    getImpacts: publicProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getFinancialImpacts(input.profileId);
      }),

    addImpact: publicProcedure
      .input(z.object({
        profileId: z.number(),
        category: z.enum(["subscription_cancelled", "nsf_avoided", "barter_value", "neighbor_economy", "wisdom_giants", "expense_reduced", "tp_delivery", "other"]),
        description: z.string(),
        estimatedValue: z.number(),
        source: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.addFinancialImpact({
          profileId: input.profileId,
          category: input.category,
          description: input.description,
          estimatedValue: input.estimatedValue,
          isEstimated: true,
          source: input.source || "manual",
        });
        return { success: true };
      }),
  }),

  // ─── VAMPIRE SLAYER ─────────────────────────────────────────────
  vampireSlayer: router({
    getSubscriptions: publicProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getSubscriptions(input.profileId);
      }),

    addSubscription: publicProcedure
      .input(z.object({
        profileId: z.number(),
        name: z.string(),
        monthlyCost: z.number(),
        category: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.addSubscription({
          profileId: input.profileId,
          name: input.name,
          monthlyCost: input.monthlyCost,
          annualCost: input.monthlyCost * 12,
          category: input.category,
        });
      }),

    audit: publicProcedure
      .input(z.object({ profileId: z.number() }))
      .mutation(async ({ input }) => {
        const subs = await db.getSubscriptions(input.profileId);
        if (subs.length === 0) return { vampires: [], totalAnnualWaste: 0 };

        const result = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are a financial advisor helping identify "vampire subscriptions" — subscriptions that drain money without providing real value. Analyze the list and identify which ones are likely vampires. Return JSON.`
            },
            {
              role: "user",
              content: `Analyze these subscriptions:\n${subs.map(s => `- ${s.name}: $${(s.monthlyCost / 100).toFixed(2)}/month ($${((s.monthlyCost * 12) / 100).toFixed(2)}/year)`).join("\n")}`
            }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "vampire_audit",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  vampires: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        reason: { type: "string" },
                        severity: { type: "string", enum: ["high", "medium", "low"] }
                      },
                      required: ["name", "reason", "severity"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["vampires"],
                additionalProperties: false
              }
            }
          }
        });

        const content = typeof result.choices[0]?.message?.content === "string"
          ? result.choices[0].message.content : "{}";
        const parsed = JSON.parse(content);

        // Mark vampires in DB
        let totalAnnualWaste = 0;
        for (const v of parsed.vampires || []) {
          const sub = subs.find(s => s.name.toLowerCase().includes(v.name.toLowerCase()));
          if (sub) {
            await db.updateSubscription(sub.id, { isVampire: true, vampireReason: v.reason });
            totalAnnualWaste += sub.annualCost || (sub.monthlyCost * 12);
          }
        }

        return { vampires: parsed.vampires || [], totalAnnualWaste };
      }),

    cancelSubscription: publicProcedure
      .input(z.object({ subscriptionId: z.number(), profileId: z.number() }))
      .mutation(async ({ input }) => {
        const subs = await db.getSubscriptions(input.profileId);
        const sub = subs.find(s => s.id === input.subscriptionId);
        if (!sub) throw new Error("Subscription not found");

        await db.updateSubscription(input.subscriptionId, {
          status: "cancelled",
          cancelledAt: new Date(),
        });

        // Log to financial impact
        if (!sub.savingsLogged) {
          await db.addFinancialImpact({
            profileId: input.profileId,
            category: "subscription_cancelled",
            description: `Cancelled ${sub.name} — estimated $${((sub.annualCost || sub.monthlyCost * 12) / 100).toFixed(2)}/year saved`,
            estimatedValue: sub.annualCost || sub.monthlyCost * 12,
            isEstimated: true,
            source: "vampire_slayer",
          });
          await db.updateSubscription(input.subscriptionId, { savingsLogged: true });
        }

        return { success: true, annualSavings: sub.annualCost || sub.monthlyCost * 12 };
      }),
  }),

  // ─── JOURNEY TRACKER ────────────────────────────────────────────
  journey: router({
    getMilestones: publicProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getJourneyMilestones(input.profileId);
      }),

    completeMilestone: publicProcedure
      .input(z.object({ profileId: z.number(), day: z.number() }))
      .mutation(async ({ input }) => {
        await db.completeMilestone(input.profileId, input.day);
        return { success: true };
      }),

    initialize: publicProcedure
      .input(z.object({ profileId: z.number() }))
      .mutation(async ({ input }) => {
        await db.initializeJourney(input.profileId);
        return { success: true };
      }),
  }),

  // ─── VOICE (KIE.AI) ─────────────────────────────────────────────
  voice: router({
    /**
     * Convert text to speech using KIE.AI (Grace's Maria voice).
     * The API key never leaves the server.
     * Returns a playable audio URL.
     */
    speak: publicProcedure
      .input(z.object({
        text: z.string().min(1).max(4500),
        // Optional: caller can tag the source for logging
        source: z.enum(["chat", "song", "ambient"]).optional(),
      }))
      .mutation(async ({ input }) => {
        if (!isKieAiConfigured()) {
          throw new Error("KIE.AI voice is not configured on this server");
        }
        const audioUrl = await textToSpeech(input.text);
        return { audioUrl };
      }),

    /**
     * Transcribe audio to text using Whisper.
     * Accepts base64-encoded audio from the browser.
     * Uploads to S3 first, then calls Whisper transcription.
     */
    transcribe: publicProcedure
      .input(z.object({
        audioBase64: z.string(),
        mimeType: z.string().default("audio/webm"),
      }))
      .mutation(async ({ input }) => {
        // Upload audio to S3 so Whisper can fetch it by URL
        const audioBuffer = Buffer.from(input.audioBase64, "base64");
        const key = `voice-input/${Date.now()}-${Math.random().toString(36).slice(2)}.webm`;
        const { url: audioUrl } = await storagePut(key, audioBuffer, input.mimeType);

        const result = await transcribeAudio({ audioUrl, language: "en", prompt: "Transcribe this voice message from a Maven member talking to Grace." });

        if ("error" in result) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: result.error });
        }
        return { text: result.text, language: result.language };
      }),

    /**
     * Health check — confirms KIE.AI credentials are present.
     * Does NOT make a real API call (no cost, no latency).
     */
    status: publicProcedure.query(() => ({
      configured: isKieAiConfigured(),
      provider: "KIE.AI",
      model: "elevenlabs/text-to-speech-multilingual-v2",
      voice: "Maria (hpp4J3VqNfWAUOO0d1Us)",
    })),
  }),

  // ─── MAVEN MEMBERSHIPS ────────────────────────────────────────────
  membership: router({
    get: publicProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getMembership(input.profileId);
      }),

    upsert: publicProcedure
      .input(z.object({
        profileId: z.number(),
        tier: z.enum(['observer', 'essentials', 'plus']),
        deliveryAddress: z.string().optional(),
        deliveryPostalCode: z.string().optional(),
        deliveryNotes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const weeklyAmountCents = input.tier === 'essentials' ? 599 : input.tier === 'plus' ? 1099 : 0;
        const membership = await db.upsertMembership(input.profileId, {
          tier: input.tier,
          status: input.tier === 'observer' ? 'active' : 'pending',
          weeklyAmountCents,
          deliveryAddress: input.deliveryAddress,
          deliveryPostalCode: input.deliveryPostalCode,
          deliveryNotes: input.deliveryNotes,
        });
        return { success: true, membership };
      }),

    // Stripe checkout session
    createCheckout: publicProcedure
      .input(z.object({
        profileId: z.number(),
        tier: z.enum(['essentials', 'plus']),
        email: z.string().optional(),
        name: z.string().optional(),
        origin: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!isStripeConfigured()) {
          return { url: null, configured: false, message: "Payment processing is being set up. Grace will let you know when it's ready!" };
        }
        const result = await createCheckoutSession({
          tier: input.tier,
          profileId: input.profileId,
          userId: ctx.user?.id,
          email: input.email,
          name: input.name,
          origin: input.origin,
        });
        if (!result) {
          return { url: null, configured: true, message: "Something went wrong creating your checkout. Try again in a moment." };
        }
        return { url: result.url, configured: true, sessionId: result.sessionId };
      }),

    // Get product info (public, no auth needed)
    getProducts: publicProcedure.query(() => {
      return {
        products: MAVEN_PRODUCTS,
        stripeConfigured: isStripeConfigured(),
      };
    }),
  }),

  // ─── BUDGET BUILDER ──────────────────────────────────────────────
  budget: router({
    getEntries: publicProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        const entries = await db.getBudgetEntries(input.profileId);
        const paycheck = await db.getPaycheck(input.profileId);
        const income = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amountCents, 0);
        const expenses = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amountCents, 0);
        return { entries, paycheck, income, expenses, balance: income - expenses };
      }),

    addEntry: publicProcedure
      .input(z.object({
        profileId: z.number(),
        type: z.enum(['income', 'expense']),
        category: z.string(),
        description: z.string(),
        amountCents: z.number(),
        frequency: z.enum(['one_time', 'weekly', 'biweekly', 'monthly']).default('monthly'),
        dueDay: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const entry = await db.addBudgetEntry(input);
        return { success: true, entry };
      }),

    updateEntry: publicProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          description: z.string().optional(),
          amountCents: z.number().optional(),
          isPaid: z.boolean().optional(),
        })
      }))
      .mutation(async ({ input }) => {
        await db.updateBudgetEntry(input.id, input.data);
        return { success: true };
      }),

    deleteEntry: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteBudgetEntry(input.id);
        return { success: true };
      }),

    setPaycheck: publicProcedure
      .input(z.object({
        profileId: z.number(),
        amountCents: z.number(),
        frequency: z.enum(['weekly', 'biweekly', 'semimonthly', 'monthly']),
        nextPayDate: z.string().optional(),
        employer: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const paycheck = await db.upsertPaycheck(input.profileId, {
          amountCents: input.amountCents,
          frequency: input.frequency,
          nextPayDate: input.nextPayDate ? new Date(input.nextPayDate) : undefined,
          employer: input.employer,
        });
        return { success: true, paycheck };
      }),
  }),

  // ─── BILL TRACKER + NSF FEE FIGHTER ─────────────────────────────
  bills: router({
    list: publicProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getBills(input.profileId);
      }),

    add: publicProcedure
      .input(z.object({
        profileId: z.number(),
        name: z.string(),
        amountCents: z.number(),
        dueDay: z.number(),
        category: z.string().optional(),
        isAutoPay: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const bill = await db.addBill(input);
        return { success: true, bill };
      }),

    markPaid: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.updateBill(input.id, { isPaid: true, paidAt: new Date() });
        return { success: true };
      }),

    flagNsfRisk: publicProcedure
      .input(z.object({ id: z.number(), profileId: z.number() }))
      .mutation(async ({ input }) => {
        // Generate dispute script via LLM
        const disputeResult = await invokeLLM({
          messages: [
            { role: 'system', content: 'You are a consumer rights advocate. Write a short, firm, polite script for calling a bank to dispute an NSF fee. Keep it under 100 words. Be direct.' },
            { role: 'user', content: 'Write me a script to call my bank and dispute an NSF fee.' }
          ]
        });
        const script = typeof disputeResult.choices[0]?.message?.content === 'string'
          ? disputeResult.choices[0].message.content
          : 'Call your bank and say: "I was charged an NSF fee and I would like to request a one-time courtesy waiver. I have been a customer for [X] years and this was an oversight. Can you please reverse this charge?"';

        await db.updateBill(input.id, {
          nsfRiskFlagged: true,
          nsfRiskFlaggedAt: new Date(),
          nsfFeeDisputeScript: script,
        });

        // Log potential savings
        await db.addFinancialImpact({
          profileId: input.profileId,
          category: 'nsf_avoided',
          description: 'NSF fee risk flagged — dispute script generated',
          estimatedValue: 4500, // $45 average NSF fee
          isEstimated: true,
          source: 'fee_fighter',
        });

        return { success: true, script };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteBill(input.id);
        return { success: true };
      }),
  }),

  // ─── MILK MONEY ──────────────────────────────────────────────────
  milkMoney: router({
    getAccount: publicProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getMilkMoneyAccount(input.profileId);
      }),

    openAccount: publicProcedure
      .input(z.object({ profileId: z.number() }))
      .mutation(async ({ input }) => {
        const account = await db.createMilkMoneyAccount(input.profileId);
        return { success: true, account };
      }),

    getTransactions: publicProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getMilkMoneyTransactions(input.profileId);
      }),

    // Borrow money — checks eligibility, creates transaction, updates balance
    borrow: publicProcedure
      .input(z.object({
        profileId: z.number(),
        amountCents: z.number().min(100).max(15000),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const account = await db.getMilkMoneyAccount(input.profileId);
        if (!account) throw new TRPCError({ code: 'NOT_FOUND', message: 'No Milk Money account found. Chat with Grace to open one.' });
        if (!account.isEligible) throw new TRPCError({ code: 'FORBIDDEN', message: account.frozenReason || 'Account is currently frozen.' });
        const available = account.creditLimitCents - account.currentBalanceCents;
        if (input.amountCents > available) throw new TRPCError({ code: 'BAD_REQUEST', message: `You can borrow up to $${(available / 100).toFixed(2)} right now.` });

        // Create transaction with due date 14 days from now
        const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
        await db.addMilkMoneyTransaction({
          accountId: account.id,
          profileId: input.profileId,
          type: 'borrow',
          amountCents: input.amountCents,
          description: input.description || 'Emergency cash',
          dueDate,
        });

        // Update account balance
        await db.updateMilkMoneyAccount(input.profileId, {
          currentBalanceCents: account.currentBalanceCents + input.amountCents,
          totalBorrowedCents: account.totalBorrowedCents + input.amountCents,
        });

        // Log to financial impact
        await db.addFinancialImpact({
          profileId: input.profileId,
          category: 'other',
          description: `Milk Money emergency cash: $${(input.amountCents / 100).toFixed(2)}`,
          estimatedValue: 0,
          source: 'milk_money',
        });

        return { success: true, borrowed: input.amountCents, dueDate };
      }),

    // Repay money — updates balance, trust score, potentially upgrades tier
    repay: publicProcedure
      .input(z.object({
        profileId: z.number(),
        transactionId: z.number(),
        amountCents: z.number().min(100),
      }))
      .mutation(async ({ input }) => {
        const account = await db.getMilkMoneyAccount(input.profileId);
        if (!account) throw new TRPCError({ code: 'NOT_FOUND', message: 'No Milk Money account found.' });

        // Check if repayment is on time
        const transactions = await db.getMilkMoneyTransactions(input.profileId);
        const borrowTx = transactions.find(t => t.id === input.transactionId && t.type === 'borrow');
        const isLate = borrowTx?.dueDate ? new Date() > new Date(borrowTx.dueDate) : false;

        // Record repayment transaction
        await db.addMilkMoneyTransaction({
          accountId: account.id,
          profileId: input.profileId,
          type: 'repay',
          amountCents: input.amountCents,
          description: isLate ? 'Repayment (late)' : 'Repayment (on time)',
          repaidAt: new Date(),
          isLate,
        });

        // Update account balance and trust
        const newBalance = Math.max(0, account.currentBalanceCents - input.amountCents);
        const newOnTime = isLate ? account.onTimeRepayments : account.onTimeRepayments + 1;
        const newLate = isLate ? account.lateRepayments + 1 : account.lateRepayments;

        // Trust score: +10 for on-time, -15 for late, max 100
        let newTrustScore = account.trustScore + (isLate ? -15 : 10);
        newTrustScore = Math.max(0, Math.min(100, newTrustScore));

        // Tier progression based on trust score
        let newTier = account.tier;
        let newLimit = account.creditLimitCents;
        if (newTrustScore >= 80 && account.tier !== 'elite') {
          newTier = 'elite'; newLimit = 15000;
        } else if (newTrustScore >= 50 && account.tier === 'regular') {
          newTier = 'trusted'; newLimit = 10000;
        } else if (newTrustScore >= 50 && account.tier === 'rookie') {
          newTier = 'trusted'; newLimit = 10000;
        } else if (newTrustScore >= 20 && account.tier === 'rookie') {
          newTier = 'regular'; newLimit = 5000;
        }

        await db.updateMilkMoneyAccount(input.profileId, {
          currentBalanceCents: newBalance,
          totalRepaidCents: account.totalRepaidCents + input.amountCents,
          onTimeRepayments: newOnTime,
          lateRepayments: newLate,
          trustScore: newTrustScore,
          tier: newTier,
          creditLimitCents: newLimit,
        });

        const tierUpgraded = newTier !== account.tier;
        return {
          success: true,
          repaid: input.amountCents,
          newBalance,
          trustScore: newTrustScore,
          tier: newTier,
          tierUpgraded,
          isLate,
        };
      }),
  }),

  // ─── ANTHEM SHARE (Gift Anthem Dedication) ───────────────────────
  anthemShare: router({
    createToken: publicProcedure
      .input(z.object({
        songId: z.number(),
        senderProfileId: z.number(),
        recipientName: z.string().optional(),
        recipientMessage: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const token = await db.createAnthemShareToken(
          input.songId,
          input.senderProfileId,
          input.recipientName,
          input.recipientMessage
        );
        return { success: true, token };
      }),

    getByToken: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const tokenData = await db.getAnthemShareToken(input.token);
        if (!tokenData) throw new Error('Share token not found or expired');
        await db.incrementShareTokenView(input.token);
        // Also fetch the song data for the landing page
        const song = await db.getSongById(tokenData.songId);
        // Fetch sender profile name
        const senderProfile = await db.getProfileById(tokenData.senderProfileId);
        return {
          ...tokenData,
          song: song ? { title: song.title, lyrics: song.lyrics, genre: song.genre, mood: song.mood } : null,
          senderName: senderProfile?.firstName || 'A friend',
        };
      }),
  }),

  // ─── ADMIN DASHBOARD ─────────────────────────────────────────────
  admin: router({
    stats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') throw new Error('Admin only');
      return db.getAdminStats();
    }),

    allMemberships: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') throw new Error('Admin only');
      return db.getAllMemberships();
    }),
  }),

  // ─── AMBIENT MESSAGES ───────────────────────────────────────────
  ambient: router({
    getUnread: publicProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getUnreadAmbientMessages(input.profileId);
      }),

    markRead: publicProcedure
      .input(z.object({ messageId: z.number() }))
      .mutation(async ({ input }) => {
        await db.markAmbientMessageRead(input.messageId);
        return { success: true };
      }),
  }),

  // ─── DIGNITY SCORE ──────────────────────────────────────────────
  dignity: router({
    calculate: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .mutation(async ({ input }) => {
        return db.calculateDignityScore(input.profileId);
      }),
    getLatest: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getLatestDignityScore(input.profileId);
      }),
    getHistory: protectedProcedure
      .input(z.object({ profileId: z.number(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return db.getDignityScoreHistory(input.profileId, input.limit);
      }),
  }),

  // ─── PROMISES TO KEEP (PTK Genie) ─────────────────────────────
  promises: router({
    create: protectedProcedure
      .input(z.object({
        profileId: z.number(),
        direction: z.enum(['made_by_ruby', 'made_to_ruby']),
        description: z.string().min(1),
        category: z.string().optional(),
        commitmentScore: z.number().min(0).max(100).optional(),
        dueDate: z.string().optional(),
        source: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createPromise({
          profileId: input.profileId,
          direction: input.direction,
          description: input.description,
          category: input.category || 'general',
          commitmentScore: input.commitmentScore || 50,
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
          source: input.source || 'manual',
        });
      }),
    list: protectedProcedure
      .input(z.object({ profileId: z.number(), status: z.string().optional() }))
      .query(async ({ input }) => {
        return db.getPromises(input.profileId, input.status);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['active', 'completed', 'broken', 'expired', 'dormant']).optional(),
        willingnessLevel: z.number().min(1).max(5).optional(),
      }))
      .mutation(async ({ input }) => {
        const data: any = {};
        if (input.status) {
          data.status = input.status;
          if (input.status === 'completed') data.completedAt = new Date();
        }
        if (input.willingnessLevel) data.willingnessLevel = input.willingnessLevel;
        await db.updatePromise(input.id, data);
        return { success: true };
      }),
    stats: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getPromiseStats(input.profileId);
      }),
    detect: protectedProcedure
      .input(z.object({ profileId: z.number(), message: z.string() }))
      .mutation(async ({ input }) => {
        // Use LLM to detect promises in conversation
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: `You detect promises and commitments in conversation. Analyze the message and extract any promises. Return JSON: { "promises": [{ "description": string, "direction": "made_by_ruby" | "made_to_ruby", "category": string, "commitmentScore": number (0-100, how firm is this commitment), "dueDate": string|null }] }. Categories: payment, personal, family, health, career, education, general. Only include real commitments, not casual remarks. Score below 30 means casual mention, 30-60 is soft commitment, 60+ is firm promise.` },
            { role: 'user', content: input.message },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'promise_detection',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  promises: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        description: { type: 'string' },
                        direction: { type: 'string', enum: ['made_by_ruby', 'made_to_ruby'] },
                        category: { type: 'string' },
                        commitmentScore: { type: 'number' },
                        dueDate: { type: ['string', 'null'] },
                      },
                      required: ['description', 'direction', 'category', 'commitmentScore', 'dueDate'],
                      additionalProperties: false,
                    },
                  },
                },
                required: ['promises'],
                additionalProperties: false,
              },
            },
          },
        });
        const parsed = JSON.parse(String(response.choices[0].message.content) || '{ "promises": [] }');
        // Only save promises with commitment score >= 30
        const saved = [];
        for (const p of parsed.promises) {
          if (p.commitmentScore >= 30) {
            const result = await db.createPromise({
              profileId: input.profileId,
              direction: p.direction,
              description: p.description,
              category: p.category,
              commitmentScore: p.commitmentScore,
              dueDate: p.dueDate ? new Date(p.dueDate) : undefined,
              source: 'conversation',
            });
            saved.push({ ...p, id: result?.id });
          }
        }
        return { detected: parsed.promises, saved };
      }),
  }),

  // ─── DESTINY DISCOVERY ────────────────────────────────────────
  destiny: router({
    getProgress: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getDestinyProgress(input.profileId);
      }),
    getAnswers: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getDestinyAnswers(input.profileId);
      }),
    askQuestion: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .mutation(async ({ input }) => {
        const progress = await db.getDestinyProgress(input.profileId);
        const answers = await db.getDestinyAnswers(input.profileId);
        const answeredNums = new Set(answers.filter(a => a.answer).map(a => a.questionNumber));
        // Find next unanswered question
        const DESTINY_QUESTIONS = getDestinyQuestions();
        const nextQ = DESTINY_QUESTIONS.find(q => !answeredNums.has(q.number));
        if (!nextQ) return { complete: true, question: null };
        // Save the question as asked
        await db.addDestinyAnswer({
          profileId: input.profileId,
          questionNumber: nextQ.number,
          wave: nextQ.wave as any,
          question: nextQ.question,
        });
        return { complete: false, question: nextQ };
      }),
    answerQuestion: protectedProcedure
      .input(z.object({ profileId: z.number(), questionNumber: z.number(), answer: z.string() }))
      .mutation(async ({ input }) => {
        const answers = await db.getDestinyAnswers(input.profileId);
        const existing = answers.find(a => a.questionNumber === input.questionNumber);
        if (!existing) return { success: false, error: 'Question not found' };
        await db.updatePromise(existing.id, { } as any); // placeholder
        // Actually update the destiny answer
        const dbConn = await db.getDb();
        if (dbConn) {
          const { destinyAnswers: da } = await import('../drizzle/schema');
          const { eq } = await import('drizzle-orm');
          await dbConn.update(da).set({ answer: input.answer, answeredAt: new Date() }).where(eq(da.id, existing.id));
        }
        // Check if synthesis should be generated
        const progress = await db.getDestinyProgress(input.profileId);
        if (progress.answered >= 10) {
          // Generate/update synthesis using LLM
          const allAnswers = await db.getDestinyAnswers(input.profileId);
          const answeredOnes = allAnswers.filter(a => a.answer);
          const synthesisPrompt = answeredOnes.map(a => `Q${a.questionNumber}: ${a.question}\nA: ${a.answer}`).join('\n\n');
          const response = await invokeLLM({
            messages: [
              { role: 'system', content: `You are a destiny coach. Based on the answers below, synthesize Ruby's core values, strengths, purpose, and moonshot dream. Be warm, specific, and empowering. Return JSON: { "coreValues": string, "strengths": string, "purpose": string, "moonshot": string, "synthesisText": string }. The synthesisText should be a warm, narrative paragraph that weaves everything together.` },
              { role: 'user', content: synthesisPrompt },
            ],
            response_format: {
              type: 'json_schema',
              json_schema: {
                name: 'destiny_synthesis',
                strict: true,
                schema: {
                  type: 'object',
                  properties: {
                    coreValues: { type: 'string' },
                    strengths: { type: 'string' },
                    purpose: { type: 'string' },
                    moonshot: { type: 'string' },
                    synthesisText: { type: 'string' },
                  },
                  required: ['coreValues', 'strengths', 'purpose', 'moonshot', 'synthesisText'],
                  additionalProperties: false,
                },
              },
            },
          });
          const synthesis = JSON.parse(String(response.choices[0].message.content) || '{}');
          await db.upsertDestinySynthesis(input.profileId, synthesis);
        }
        return { success: true, progress };
      }),
    getSynthesis: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getDestinySynthesis(input.profileId);
      }),
    revealSynthesis: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .mutation(async ({ input }) => {
        await db.upsertDestinySynthesis(input.profileId, { isRevealed: true, revealedAt: new Date() });
        return { success: true };
      }),
  }),

  // ─── STORIES (Jolene the Journalist) ──────────────────────────
  stories: router({
    generate: protectedProcedure
      .input(z.object({ profileId: z.number(), triggerEvent: z.string().optional() }))
      .mutation(async ({ input }) => {
        // Gather Ruby's context for story generation
        const profile = await db.getProfileById(input.profileId);
        const memories = await db.getMemories(input.profileId);
        const impacts = await db.getFinancialImpacts(input.profileId);
        const promisesList = await db.getPromises(input.profileId, 'completed');

        const context = [
          profile ? `Name: ${profile.firstName}` : '',
          memories.length > 0 ? `Memories: ${memories.map(m => m.fact).join('; ')}` : '',
          impacts.length > 0 ? `Financial wins: ${impacts.slice(0, 5).map(i => i.description).join('; ')}` : '',
          promisesList.length > 0 ? `Promises kept: ${promisesList.slice(0, 5).map(p => p.description).join('; ')}` : '',
          input.triggerEvent ? `Trigger event: ${input.triggerEvent}` : '',
        ].filter(Boolean).join('\n');

        const response = await invokeLLM({
          messages: [
            { role: 'system', content: `You are Jolene the Journalist, following the Jolene Protocol for narrative journalism. Write a 500-word story ("moment" type) about Ruby's life. RULES:\n1. Open with a PHYSICAL OBJECT that carries the weight of the theme\n2. Include ONE great quote (real or reconstructed)\n3. Show restraint — no sentimentality, let the facts carry the emotion\n4. Include a TURN at the 60% mark — a shift, a revelation, a complication\n5. End with a KICKER that calls back to the opening object\n6. Write in third person, present tense\n7. No marketing language, no asks\n8. Grade yourself: only ship A- or above\n\nReturn JSON: { "title": string, "content": string, "physicalObject": string, "greatQuote": string, "grade": string }` },
            { role: 'user', content: `Write a story about this person:\n${context}` },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'jolene_story',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  content: { type: 'string' },
                  physicalObject: { type: 'string' },
                  greatQuote: { type: 'string' },
                  grade: { type: 'string' },
                },
                required: ['title', 'content', 'physicalObject', 'greatQuote', 'grade'],
                additionalProperties: false,
              },
            },
          },
        });
        const story = JSON.parse(String(response.choices[0].message.content) || '{}');
        const result = await db.createStory({
          profileId: input.profileId,
          title: story.title,
          storyType: 'moment',
          content: story.content,
          grade: story.grade,
          physicalObject: story.physicalObject,
          greatQuote: story.greatQuote,
          triggerEvent: input.triggerEvent || 'manual',
        });
        return { id: result?.id, ...story };
      }),
    list: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getStories(input.profileId);
      }),
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getStoryById(input.id);
      }),
    deliver: protectedProcedure
      .input(z.object({ id: z.number(), method: z.enum(['grace_read', 'self_read']) }))
      .mutation(async ({ input }) => {
        await db.updateStory(input.id, { isDelivered: true, deliveredAt: new Date(), deliveryMethod: input.method });
        return { success: true };
      }),
    updateVisibility: protectedProcedure
      .input(z.object({ id: z.number(), visibility: z.enum(['private', 'friends', 'community']), isAnonymized: z.boolean().optional() }))
      .mutation(async ({ input }) => {
        await db.updateStory(input.id, { visibility: input.visibility, isAnonymized: input.isAnonymized });
        return { success: true };
      }),
    community: publicProcedure
      .query(async () => {
        return db.getCommunityStories();
      }),
  }),

  // ─── VILLAGE (AI Village Naming Convention) ────────────────────
  village: router({
    allAgents: publicProcedure
      .query(async () => {
        return db.getAllVillageAgents();
      }),
    myAgents: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getIntroducedAgents(input.profileId);
      }),
    introduce: protectedProcedure
      .input(z.object({ profileId: z.number(), agentKey: z.string() }))
      .mutation(async ({ input }) => {
        const agent = await db.getAgentByKey(input.agentKey);
        if (!agent) throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' });
        return db.introduceAgent(input.profileId, agent.id);
      }),
    rename: protectedProcedure
      .input(z.object({ profileId: z.number(), agentKey: z.string(), customName: z.string().min(1) }))
      .mutation(async ({ input }) => {
        const agent = await db.getAgentByKey(input.agentKey);
        if (!agent) throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' });
        await db.renameAgent(input.profileId, agent.id, input.customName);
        return { success: true };
      }),
  }),

  // ─── MILK MONEY NUDGES ────────────────────────────────────────
  milkMoneyNudges: router({
    getUpcoming: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getUpcomingBorrows(input.profileId);
      }),
    getOverdue: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getOverdueBorrows(input.profileId);
      }),
  }),

  // ─── GRACE STATUS (Battery + Degradation) ────────────────────────
  graceStatus: router({
    get: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        const status = await db.getGraceStatus(input.profileId);
        const batteryLevel = await db.calculateBatteryLevel(input.profileId);
        const speedStage = await db.getSpeedStage(batteryLevel);
        const tier = await db.getDegradationTier(input.profileId);
        return {
          batteryLevel,
          speedStage,
          tier,
          daysPastDue: status?.daysPastDue || 0,
          pauseRequested: status?.pauseRequested || false,
          pauseExpiresAt: status?.pauseExpiresAt || null,
          lastPaymentAt: status?.lastPaymentAt || null,
          dignityScore100Achieved: status?.dignityScore100Achieved || false,
        };
      }),
    requestPause: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .mutation(async ({ input }) => {
        const pauseExpiresAt = new Date();
        pauseExpiresAt.setDate(pauseExpiresAt.getDate() + 7);
        await db.upsertGraceStatus(input.profileId, {
          pauseRequested: true,
          pauseExpiresAt,
        });
        return { success: true, pauseExpiresAt };
      }),
    restorePayment: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .mutation(async ({ input }) => {
        await db.upsertGraceStatus(input.profileId, {
          daysPastDue: 0,
          lastPaymentAt: new Date(),
          pauseRequested: false,
          pauseExpiresAt: null,
        });
        return { success: true, message: "Welcome back! Grace is at full power." };
      }),

    // ─── SNOOZE (8 hours) ───────────────────────────────────
    snooze: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .mutation(async ({ input }) => {
        const snoozeUntil = new Date();
        snoozeUntil.setHours(snoozeUntil.getHours() + 8);
        await db.upsertGraceStatus(input.profileId, {
          pauseRequested: true,
          pauseExpiresAt: snoozeUntil,
        });
        return {
          success: true,
          snoozeUntil,
          message: "Grace is taking a nap. She'll be back in 8 hours with something warm.",
        };
      }),

    // ─── WAKE (cancel snooze early) ───────────────────────────
    wake: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .mutation(async ({ input }) => {
        await db.upsertGraceStatus(input.profileId, {
          pauseRequested: false,
          pauseExpiresAt: null,
        });
        return { success: true, message: "Hey, I'm back! No pressure. Just checking in." };
      }),
  }),

  // ─── COMMUNITY CREDITS ───────────────────────────────────────────
  communityCredits: router({
    get: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        const account = await db.ensureCommunityCredits(input.profileId);
        return account;
      }),
    earn: protectedProcedure
      .input(z.object({
        profileId: z.number(),
        amount: z.number().min(1).max(200),
        category: z.enum(['teaching', 'helping', 'mentoring', 'volunteering', 'barter', 'referral']),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.earnCredits(input.profileId, input.amount, input.category, input.description);
        const updated = await db.getCommunityCredits(input.profileId);
        return { success: true, balance: updated?.balance || 0 };
      }),
    redeem: protectedProcedure
      .input(z.object({
        profileId: z.number(),
        amount: z.number().min(1),
      }))
      .mutation(async ({ input }) => {
        const result = await db.redeemCredits(input.profileId, input.amount);
        return result;
      }),
    getLog: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getCommunityCreditsLog(input.profileId);
      }),
  }),

  // ─── PAYDAY DETECTION ────────────────────────────────────────────
  payday: router({
    get: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        const pattern = await db.getPaydayPattern(input.profileId);
        if (!pattern) return null;
        const nextPayday = db.calculateNextPayday(pattern);
        return { ...pattern, nextPayday };
      }),
    setup: protectedProcedure
      .input(z.object({
        profileId: z.number(),
        frequency: z.enum(['weekly', 'biweekly', 'semimonthly', 'monthly']),
        dayOfWeek: z.number().min(0).max(6).optional(),
        dayOfMonth1: z.number().min(1).max(31).optional(),
        dayOfMonth2: z.number().min(1).max(31).optional(),
        lastPayday: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const data: any = {
          frequency: input.frequency,
          source: 'manual' as const,
          confidence: 80,
        };
        if (input.dayOfWeek != null) data.dayOfWeek = input.dayOfWeek;
        if (input.dayOfMonth1 != null) data.dayOfMonth1 = input.dayOfMonth1;
        if (input.dayOfMonth2 != null) data.dayOfMonth2 = input.dayOfMonth2;
        if (input.lastPayday) data.lastPayday = new Date(input.lastPayday);
        await db.upsertPaydayPattern(input.profileId, data);
        const pattern = await db.getPaydayPattern(input.profileId);
        const nextPayday = pattern ? db.calculateNextPayday(pattern) : null;
        return { success: true, nextPayday };
      }),
    detectFromBudget: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .mutation(async ({ input }) => {
        // Analyze budget entries for income patterns
        const entries = await db.getBudgetEntries(input.profileId);
        const incomes = entries.filter(e => e.type === 'income');
        if (incomes.length === 0) return { detected: false, message: "No income entries found. Add your income to the Budget Builder first." };
        const freq = incomes[0]?.frequency || 'biweekly';
        await db.upsertPaydayPattern(input.profileId, {
          frequency: freq,
          source: 'budget_analysis' as const,
          confidence: 60,
        });
        return { detected: true, frequency: freq, confidence: 60 };
      }),
  }),

  // ─── CRISIS BEACON ("I'm Not Okay") ──────────────────────────────
  crisisBeacon: router({
    activate: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .mutation(async ({ input }) => {
        const existing = await db.getActiveBeacon(input.profileId);
        if (existing) return { alreadyActive: true, beacon: existing };
        const agents = ['vera', 'big_mama', 'steady', 'harbour'];
        await db.createCrisisBeacon(input.profileId, agents);
        return { activated: true, agents, message: "Vera and Big Mama are on their way. You're not alone." };
      }),
    getActive: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getActiveBeacon(input.profileId);
      }),
    resolve: protectedProcedure
      .input(z.object({ beaconId: z.number() }))
      .mutation(async ({ input }) => {
        await db.resolveBeacon(input.beaconId);
        return { resolved: true };
      }),
  }),

  // ─── DESTINY MOONSHOT REVEAL ─────────────────────────────────────
  destinyMoonshot: router({
    get: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getMoonshot(input.profileId);
      }),
    checkReadiness: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        const answers = await db.getDestinyAnswers(input.profileId);
        const totalAnswered = answers.length;
        const deepAnswered = answers.filter((a: any) => {
          const q = getDestinyQuestions().find(q => q.number === a.questionNumber);
          return q?.wave === 'deep';
        }).length;
        const ready = totalAnswered >= 20 && deepAnswered >= 5;
        return { totalAnswered, deepAnswered, ready, threshold: { total: 20, deep: 5 } };
      }),
    generateReveal: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .mutation(async ({ input }) => {
        const answers = await db.getDestinyAnswers(input.profileId);
        const questions = getDestinyQuestions();
        const qaPairs = answers.map((a: any) => {
          const q = questions.find(q => q.number === a.questionNumber);
          return `Q: ${q?.question || 'Unknown'}\nA: ${a.answer}`;
        }).join('\n\n');
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: `You are Grace, synthesizing Ruby Red's destiny from her answers to 30 life questions. Write a deeply personal moonshot statement (2-3 paragraphs) that captures who she really is, what she's meant to do, and the big dream she barely lets herself think about. Also extract her core values (3-5) and key strengths (3-5). Be warm, direct, and real. This is the most important thing you'll ever tell her. Format as JSON: { "moonshotStatement": "...", "coreValues": [...], "strengths": [...] }` },
            { role: 'user', content: `Here are Ruby's answers to the Destiny Discovery questions:\n\n${qaPairs}` },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'moonshot_reveal',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  moonshotStatement: { type: 'string' },
                  coreValues: { type: 'array', items: { type: 'string' } },
                  strengths: { type: 'array', items: { type: 'string' } },
                },
                required: ['moonshotStatement', 'coreValues', 'strengths'],
                additionalProperties: false,
              },
            },
          },
        });
        const content = response.choices?.[0]?.message?.content as string;
        const parsed = JSON.parse(content);
        await db.revealMoonshot(input.profileId, parsed.moonshotStatement, parsed.coreValues, parsed.strengths);
        return parsed;
      }),
  }),

  // ─── GRACE AMBIENT WIRING ────────────────────────────────────────
  graceAmbient: router({
    getMessages: protectedProcedure
      .input(z.object({ profileId: z.number(), limit: z.number().default(5) }))
      .query(async ({ input }) => {
        return db.getUnreadAmbientMessages(input.profileId);
      }),
    generateNudges: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .mutation(async ({ input }) => {
        const messages: { type: string; message: string; priority: number }[] = [];
        // Check dignity score milestones
        const dignity = await db.getLatestDignityScore(input.profileId);
        if (dignity) {
          const total = (dignity.vampireSlayer || 0) + (dignity.nsfShield || 0) + (dignity.budgetMastery || 0) + (dignity.milkMoneyTrust || 0) + (dignity.engagement || 0);
          if (total >= 80) messages.push({ type: 'dignity_milestone', message: `Your Dignity Score is ${total}. You're almost there, Ruby. I'm so proud of how far you've come.`, priority: 1 });
          else if (total >= 50) messages.push({ type: 'dignity_milestone', message: `Dignity Score: ${total}. You're past halfway. Every step counts.`, priority: 2 });
        }
        // Check overdue borrows
        const overdue = await db.getOverdueBorrows(input.profileId);
        if (overdue.length > 0) {
          messages.push({ type: 'milkmoney_nudge', message: `Hey Ruby, you've got ${overdue.length} Milk Money payment${overdue.length > 1 ? 's' : ''} overdue. Let's get those sorted — your trust score will thank you.`, priority: 1 });
        }
        // Check upcoming borrows
        const upcoming = await db.getUpcomingBorrows(input.profileId);
        if (upcoming.length > 0) {
          messages.push({ type: 'milkmoney_reminder', message: `Heads up — you've got a Milk Money payment coming up in the next few days. Want to knock it out early?`, priority: 2 });
        }
        // Check promises due
        const promises = await db.getPromises(input.profileId, 'active');
        const dueSoon = promises.filter((p: any) => {
          if (!p.dueDate) return false;
          const due = new Date(p.dueDate);
          const now = new Date();
          const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
          return diff >= 0 && diff <= 3;
        });
        if (dueSoon.length > 0) {
          messages.push({ type: 'promise_reminder', message: `You've got ${dueSoon.length} promise${dueSoon.length > 1 ? 's' : ''} coming due soon. Nana the Promise Keeper says you've got this.`, priority: 2 });
        }
        // Check battery level
        const battery = await db.calculateBatteryLevel(input.profileId);
        if (battery <= 50 && battery > 10) {
          messages.push({ type: 'battery_warning', message: `My juice is getting low, Ruby. I'm still here, but I'm not doing my best. Come on, help me out.`, priority: 1 });
        } else if (battery <= 10) {
          messages.push({ type: 'battery_critical', message: `I'm running on fumes. I don't feel good right now. We're not doing our best. I need you to come back.`, priority: 0 });
        }
        // Store messages
        for (const msg of messages) {
          await db.addAmbientMessage(input.profileId, msg.type, msg.message);
        }
        return messages.sort((a, b) => a.priority - b.priority);
      }),
  }),

  // ─── ESSENTIALS BOX FULFILLMENT (Race 7) ────────────────────────
  fulfillment: router({
    // Member-facing: request an Essentials Box
    requestBox: protectedProcedure
      .input(z.object({
        profileId: z.number(),
        deliveryAddress: z.string().min(5),
        postalCode: z.string().optional(),
        itemsRequested: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const order = await db.createEssentialsOrder({
          profileId: input.profileId,
          userId: ctx.user?.id,
          memberName: ctx.user?.name ?? undefined,
          memberEmail: ctx.user?.email ?? undefined,
          deliveryAddress: input.deliveryAddress,
          postalCode: input.postalCode,
          itemsRequested: input.itemsRequested,
          requestSource: "member",
        });
        return { orderId: order.id, message: "Your Essentials Box is on its way! We'll notify you when it ships." };
      }),

    // Member-facing: view my orders
    myOrders: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getMemberOrders(input.profileId);
      }),

    // Admin: list all orders with optional status filter
    listOrders: protectedProcedure
      .input(z.object({ status: z.string().optional() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin only' });
        return db.listEssentialsOrders(input.status);
      }),

    // Admin: get order stats
    orderStats: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin only' });
        return db.getEssentialsOrderStats();
      }),

    // Admin: update order status
    updateStatus: protectedProcedure
      .input(z.object({
        orderId: z.number(),
        status: z.enum(["pending", "packed", "shipped", "delivered", "cancelled"]),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin only' });
        await db.updateEssentialsOrderStatus(input.orderId, input.status);
        return { success: true };
      }),

    // Admin: update notes
    updateNotes: protectedProcedure
      .input(z.object({
        orderId: z.number(),
        notes: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin only' });
        await db.updateEssentialsOrderNotes(input.orderId, input.notes);
        return { success: true };
      }),

    // Admin: update courier/tracking
    updateCourier: protectedProcedure
      .input(z.object({
        orderId: z.number(),
        courierMethod: z.string(),
        trackingNumber: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin only' });
        await db.updateEssentialsOrderCourier(input.orderId, input.courierMethod, input.trackingNumber);
        return { success: true };
      }),

    // Admin: create manual order
    createManual: protectedProcedure
      .input(z.object({
        memberName: z.string().min(1),
        memberEmail: z.string().optional(),
        deliveryAddress: z.string().min(5),
        postalCode: z.string().optional(),
        itemsRequested: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin only' });
        const order = await db.createEssentialsOrder({
          memberName: input.memberName,
          memberEmail: input.memberEmail,
          deliveryAddress: input.deliveryAddress,
          postalCode: input.postalCode,
          itemsRequested: input.itemsRequested,
          requestSource: "admin_manual",
        });
        if (input.notes) {
          await db.updateEssentialsOrderNotes(order.id, input.notes);
        }
        return { orderId: order.id, success: true };
      }),
  }),
});

// ─── DESTINY QUESTIONS (30 Questions, 3 Waves) ──────────────────────
function getDestinyQuestions() {
  return [
    // Wave 1: Safe (Questions 1-10)
    { number: 1, wave: 'safe', question: "Where did you grow up?" },
    { number: 2, wave: 'safe', question: "What's the first job you ever had?" },
    { number: 3, wave: 'safe', question: "Who made you laugh the most when you were a kid?" },
    { number: 4, wave: 'safe', question: "What's something you're really good at that most people don't know about?" },
    { number: 5, wave: 'safe', question: "If you had a whole Saturday with no responsibilities, what would you do?" },
    { number: 6, wave: 'safe', question: "What's the best meal anyone ever made for you?" },
    { number: 7, wave: 'safe', question: "What song always makes you feel something?" },
    { number: 8, wave: 'safe', question: "What's something you used to love doing but stopped?" },
    { number: 9, wave: 'safe', question: "Who do you call when things get real?" },
    { number: 10, wave: 'safe', question: "What's one thing about your neighborhood that you actually love?" },
    // Wave 2: Reflective (Questions 11-20)
    { number: 11, wave: 'reflective', question: "What's the hardest thing you've ever had to figure out on your own?" },
    { number: 12, wave: 'reflective', question: "When you were little, what did you want to be when you grew up?" },
    { number: 13, wave: 'reflective', question: "What's something you're proud of that nobody gave you credit for?" },
    { number: 14, wave: 'reflective', question: "If your kids asked you what matters most in life, what would you say?" },
    { number: 15, wave: 'reflective', question: "What's a mistake you made that actually taught you something important?" },
    { number: 16, wave: 'reflective', question: "When do you feel most like yourself?" },
    { number: 17, wave: 'reflective', question: "What's something about the world that makes you angry enough to want to change it?" },
    { number: 18, wave: 'reflective', question: "Who believed in you when nobody else did?" },
    { number: 19, wave: 'reflective', question: "What would you do differently if money wasn't a factor?" },
    { number: 20, wave: 'reflective', question: "What's a promise you made to yourself that you haven't kept yet?" },
    // Wave 3: Deep (Questions 21-30)
    { number: 21, wave: 'deep', question: "What do you think you were put on this earth to do?" },
    { number: 22, wave: 'deep', question: "If you could go back and tell your younger self one thing, what would it be?" },
    { number: 23, wave: 'deep', question: "What's the bravest thing you've ever done?" },
    { number: 24, wave: 'deep', question: "What keeps you up at night?" },
    { number: 25, wave: 'deep', question: "What would your life look like if everything went right for the next five years?" },
    { number: 26, wave: 'deep', question: "What's something you've never told anyone?" },
    { number: 27, wave: 'deep', question: "If you could change one thing about how the world treats people like you, what would it be?" },
    { number: 28, wave: 'deep', question: "What legacy do you want to leave for your kids?" },
    { number: 29, wave: 'deep', question: "What's your moonshot — the big dream you barely let yourself think about?" },
    { number: 30, wave: 'deep', question: "If I told you that you already have everything you need to get there, what would you say?" },
  ];
}

export type AppRouter = typeof appRouter;
