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
- Help them decide what to cancel, never pressure`;

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
          status: 'active',
          weeklyAmountCents,
          deliveryAddress: input.deliveryAddress,
          deliveryPostalCode: input.deliveryPostalCode,
          deliveryNotes: input.deliveryNotes,
        });
        return { success: true, membership };
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
        return tokenData;
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
});

export type AppRouter = typeof appRouter;
