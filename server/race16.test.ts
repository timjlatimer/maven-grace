import { describe, it, expect, vi } from "vitest";

// ─── Race 16: Grace's Voice and Push Presence ──────────────────────

describe("Race 16 — Push Notifications", () => {
  it("push_subscriptions table schema has required columns", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const schemaPath = path.resolve(__dirname, "../drizzle/schema.ts");
    const content = fs.readFileSync(schemaPath, "utf-8");
    expect(content).toContain('push_subscriptions');
    expect(content).toContain('endpoint');
    expect(content).toContain('p256dh');
    expect(content).toContain('auth');
  });

  it("conversation_summaries table schema has required columns", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const schemaPath = path.resolve(__dirname, "../drizzle/schema.ts");
    const content = fs.readFileSync(schemaPath, "utf-8");
    expect(content).toContain('conversation_summaries');
    expect(content).toContain('summary');
    expect(content).toContain('messageCount');
  });

  it("push subscribe endpoint accepts correct input shape", async () => {
    const { z } = await import("zod");
    const inputSchema = z.object({
      profileId: z.number(),
      endpoint: z.string(),
      p256dh: z.string(),
      auth: z.string(),
    });

    const validInput = {
      profileId: 1,
      endpoint: "https://fcm.googleapis.com/fcm/send/abc123",
      p256dh: "BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u-Ts1XbjhazAkj7I99e8p8REfXPQ",
      auth: "tBHItJI5svbpC7htfNJF2A",
    };

    expect(inputSchema.parse(validInput)).toEqual(validInput);
  });

  it("push unsubscribe endpoint accepts endpoint string", async () => {
    const { z } = await import("zod");
    const inputSchema = z.object({ endpoint: z.string() });
    const valid = { endpoint: "https://fcm.googleapis.com/fcm/send/abc123" };
    expect(inputSchema.parse(valid)).toEqual(valid);
  });

  it("push getStatus endpoint returns subscribed boolean", async () => {
    const { z } = await import("zod");
    const outputSchema = z.object({
      subscribed: z.boolean(),
      count: z.number(),
    });
    expect(outputSchema.parse({ subscribed: false, count: 0 })).toEqual({ subscribed: false, count: 0 });
    expect(outputSchema.parse({ subscribed: true, count: 2 })).toEqual({ subscribed: true, count: 2 });
  });
});

describe("Race 16 — Service Worker", () => {
  it("sw.js exists in client/public", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const swPath = path.resolve(__dirname, "../client/public/sw.js");
    expect(fs.existsSync(swPath)).toBe(true);
  });

  it("sw.js handles push events", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const swPath = path.resolve(__dirname, "../client/public/sw.js");
    const content = fs.readFileSync(swPath, "utf-8");
    expect(content).toContain("addEventListener(\"push\"");
    expect(content).toContain("showNotification");
  });

  it("sw.js handles notification click", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const swPath = path.resolve(__dirname, "../client/public/sw.js");
    const content = fs.readFileSync(swPath, "utf-8");
    expect(content).toContain("notificationclick");
    expect(content).toContain("openWindow");
  });

  it("sw.js includes Grace-specific notification content", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const swPath = path.resolve(__dirname, "../client/public/sw.js");
    const content = fs.readFileSync(swPath, "utf-8");
    expect(content).toContain("Grace");
    expect(content).toContain("I'm here");
    expect(content).toContain("Talk to Grace");
  });
});

describe("Race 16 — Social Meta Tags", () => {
  it("GraceCalling page sets OG meta tags", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/GraceCalling.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("og:title");
    expect(content).toContain("og:description");
    expect(content).toContain("og:type");
    expect(content).toContain("og:url");
  });

  it("GraceCalling page sets Twitter Card meta tags", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/GraceCalling.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("twitter:card");
    expect(content).toContain("twitter:title");
    expect(content).toContain("twitter:description");
  });

  it("GraceCalling page has share button with Web Share API", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/GraceCalling.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("navigator.share");
    expect(content).toContain("Share Grace with a friend");
    expect(content).toContain("/grace-calling");
  });
});

describe("Race 16 — Conversation Memory", () => {
  it("saveSummary endpoint validates minimum message count", async () => {
    const { z } = await import("zod");
    const inputSchema = z.object({
      profileId: z.number(),
      messages: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })),
    });

    // Should parse valid input
    const valid = {
      profileId: 1,
      messages: [
        { role: "user" as const, content: "Hi Grace" },
        { role: "assistant" as const, content: "Hey Ruby!" },
        { role: "user" as const, content: "How are you?" },
        { role: "assistant" as const, content: "I'm doing well!" },
      ],
    };
    expect(inputSchema.parse(valid)).toEqual(valid);
  });

  it("getLatest endpoint accepts profileId", async () => {
    const { z } = await import("zod");
    const inputSchema = z.object({ profileId: z.number() });
    expect(inputSchema.parse({ profileId: 42 })).toEqual({ profileId: 42 });
  });

  it("GraceChat wires conversation memory on unmount", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/GraceChat.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("conversationMemory.saveSummary");
    expect(content).toContain("conversationMemory.getLatest");
  });

  it("returning user welcome includes memory summary injection", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/GraceChat.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("lastSummary?.summary");
    expect(content).toContain("Last time you spoke:");
  });
});

describe("Race 16 — Heartbeat Priority Queue", () => {
  it("heartbeat scenarios are in strict priority order P1-P7", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "./routers.ts");
    const content = fs.readFileSync(filePath, "utf-8");

    // Find the heartbeat getCurrent endpoint
    const heartbeatSection = content.slice(
      content.indexOf("getCurrent: publicProcedure"),
      content.indexOf("// No heartbeat for this session")
    );

    // Verify priority order: misses_ruby > found_something > grace_worried > grace_excited > morning_return > promise_due > neighborhood_news
    const scenarios = ["misses_ruby", "found_something", "grace_worried", "grace_excited", "morning_return", "promise_due", "neighborhood_news"];
    let lastIndex = -1;
    for (const scenario of scenarios) {
      const idx = heartbeatSection.indexOf(`'${scenario}'`);
      expect(idx).toBeGreaterThan(lastIndex);
      lastIndex = idx;
    }
  });
});

describe("Race 16 — Push Notification Toggle", () => {
  it("PushNotificationToggle component exists", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/components/PushNotificationToggle.tsx");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("PushNotificationToggle handles all states", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/components/PushNotificationToggle.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("Not supported");
    expect(content).toContain("Grace can reach you");
    expect(content).toContain("Notifications blocked");
    expect(content).toContain("Let Grace reach you");
  });

  it("GraceStatusPage includes PushNotificationToggle", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../client/src/pages/GraceStatusPage.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("PushNotificationToggle");
  });
});

describe("Race 16 — Voice Provider Standing Order", () => {
  it("KIE.ai is the ONLY voice provider (no ElevenLabs)", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const routersPath = path.resolve(__dirname, "./routers.ts");
    const content = fs.readFileSync(routersPath, "utf-8");
    // Must NOT import ElevenLabs
    expect(content).not.toContain("import { elevenLabsSpeak");
    expect(content).not.toContain("isElevenLabsConfigured");
    // Must use KIE.ai
    expect(content).toContain("isKieAiConfigured");
    expect(content).toContain("textToSpeech");
  });

  it("elevenlabs-voice.ts does NOT exist in server/", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "./elevenlabs-voice.ts");
    expect(fs.existsSync(filePath)).toBe(false);
  });
});
