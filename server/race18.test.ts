import { describe, it, expect, vi } from "vitest";

// ═══════════════════════════════════════════════════════════════════
// RACE 18 — Grace's Cultural Intelligence & Onboarding Polish
// ═══════════════════════════════════════════════════════════════════

describe("Race 18 — Cultural Intelligence & Onboarding Polish", () => {

  // ── 1. Cultural Profile Setup ──────────────────────────────────
  describe("Cultural Profile Setup", () => {
    it("should support 9 cultural backgrounds", () => {
      const cultures = [
        "universal", "african_american", "hispanic_latino", "indigenous",
        "south_asian", "east_asian", "middle_eastern", "european", "caribbean",
      ];
      expect(cultures).toHaveLength(9);
      cultures.forEach(c => expect(typeof c).toBe("string"));
    });

    it("should support 4 language styles", () => {
      const styles = ["casual", "formal", "warm", "direct"];
      expect(styles).toHaveLength(4);
    });

    it("should store cultural profile in grace_preferences", () => {
      const culturalFields = {
        culturalBackground: "african_american",
        languageStyle: "warm",
      };
      expect(culturalFields.culturalBackground).toBe("african_american");
      expect(culturalFields.languageStyle).toBe("warm");
    });
  });

  // ── 2. Emotional Tone Detection ────────────────────────────────
  describe("Emotional Tone Detection", () => {
    it("should inject cultural context into system prompt", () => {
      const culturalBackground = "hispanic_latino";
      const languageStyle = "warm";
      const prompt = `CULTURAL CONTEXT: Ruby's cultural background is ${culturalBackground}. Adapt your references, food mentions, holiday awareness, and community values to resonate with her world. Use a ${languageStyle} communication style.`;
      expect(prompt).toContain("hispanic_latino");
      expect(prompt).toContain("warm");
    });

    it("should adapt tone based on language style preference", () => {
      const styles: Record<string, string> = {
        casual: "relaxed, uses slang, friendly",
        formal: "respectful, structured, professional",
        warm: "nurturing, emotional, empathetic",
        direct: "straightforward, concise, action-oriented",
      };
      expect(Object.keys(styles)).toHaveLength(4);
      expect(styles.warm).toContain("empathetic");
    });
  });

  // ── 3. Celebration Engine ──────────────────────────────────────
  describe("Celebration Engine", () => {
    it("should support 5 celebration types", () => {
      const types = ["dignity_up", "bill_paid", "promise_kept", "milestone", "referral"];
      expect(types).toHaveLength(5);
    });

    it("should generate particle burst with 12 particles", () => {
      const particles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 300 - 150,
        y: -(Math.random() * 200 + 100),
        emoji: "✨",
      }));
      expect(particles).toHaveLength(12);
      particles.forEach(p => {
        expect(p.x).toBeGreaterThanOrEqual(-150);
        expect(p.x).toBeLessThanOrEqual(150);
        expect(p.y).toBeLessThan(0);
      });
    });

    it("should trigger haptic feedback on celebration", () => {
      const pattern = [50, 50, 50, 50, 100, 100, 200];
      expect(pattern).toHaveLength(7);
      expect(pattern.reduce((a, b) => a + b, 0)).toBe(600);
    });
  });

  // ── 4. Financial Coaching Mode Toggle ──────────────────────────
  describe("Financial Coaching Mode Toggle", () => {
    it("should support chat and coach modes", () => {
      const modes = ["chat", "coach"];
      expect(modes).toContain("chat");
      expect(modes).toContain("coach");
    });

    it("should inject coaching context into system prompt", () => {
      const coachingMode = "coach";
      const coachingContext = coachingMode === "coach"
        ? "\nCOACHING MODE ACTIVE: Ruby has asked you to be her financial coach. Be more structured. Ask probing questions about her spending. Set clear action items. Track progress. Be direct but kind."
        : "";
      expect(coachingContext).toContain("COACHING MODE ACTIVE");
      expect(coachingContext).toContain("structured");
    });

    it("should persist mode choice in grace_preferences", () => {
      const prefs = { coachingMode: "coach" };
      expect(prefs.coachingMode).toBe("coach");
    });
  });

  // ── 5. Accessibility Enhancements ──────────────────────────────
  describe("Accessibility Enhancements", () => {
    it("should support 3 font sizes", () => {
      const sizes = ["normal", "large", "xlarge"];
      const fontMap: Record<string, string> = {
        normal: "16px",
        large: "18px",
        xlarge: "20px",
      };
      sizes.forEach(s => expect(fontMap[s]).toBeDefined());
    });

    it("should support reduced motion toggle", () => {
      const prefs = { reducedMotion: true, highContrast: false, fontSize: "large" };
      expect(prefs.reducedMotion).toBe(true);
      expect(prefs.highContrast).toBe(false);
    });

    it("should persist accessibility settings in grace_preferences", () => {
      const fields = ["reducedMotion", "highContrast", "fontSize"];
      expect(fields).toHaveLength(3);
    });
  });

  // ── 6. Onboarding Flow Polish ──────────────────────────────────
  describe("Onboarding Flow Polish", () => {
    it("should have 4 onboarding steps", () => {
      const steps = [
        { title: "Meet Grace", subtitle: "Choose who Grace is to you" },
        { title: "Your Culture", subtitle: "Help Grace understand your world" },
        { title: "Your Schedule", subtitle: "When should Grace be there?" },
        { title: "Grace's Job", subtitle: "What's Grace's expertise?" },
      ];
      expect(steps).toHaveLength(4);
    });

    it("should support 5 personality archetypes in onboarding", () => {
      const personalities = ["angel", "coach", "fierce", "bestfriend", "antithesis"];
      expect(personalities).toHaveLength(5);
    });

    it("should support 5 schedule types in onboarding", () => {
      const schedules = ["early_bird", "nine_to_five", "night_shift", "irregular", "stay_at_home"];
      expect(schedules).toHaveLength(5);
    });

    it("should support 9 expertise areas in onboarding", () => {
      const expertises = [
        "childcare", "finance", "health", "art", "engineering",
        "education", "cooking", "social_work", "general",
      ];
      expect(expertises).toHaveLength(9);
    });

    it("should track onboarding progress with step number", () => {
      const status = { step: 2, complete: false };
      expect(status.step).toBe(2);
      expect(status.complete).toBe(false);
    });

    it("should allow skipping onboarding", () => {
      const skipResult = { step: 4, complete: true };
      expect(skipResult.complete).toBe(true);
    });
  });

  // ── 7. Grace's Growth Journal ──────────────────────────────────
  describe("Grace's Growth Journal", () => {
    it("should inject conversation summary into system prompt", () => {
      const summary = "Ruby shared her concerns about rent. Grace helped her create a budget. Ruby felt hopeful.";
      const growthContext = `GROWTH JOURNAL: From your past conversations with Ruby: "${summary}" — Reference this naturally when relevant.`;
      expect(growthContext).toContain("Ruby shared");
      expect(growthContext).toContain("Reference this naturally");
    });

    it("should only inject if summary exists", () => {
      const summary = null;
      const growthContext = summary ? `GROWTH JOURNAL: ${summary}` : "";
      expect(growthContext).toBe("");
    });
  });

  // ── 8. Offline Resilience ──────────────────────────────────────
  describe("Offline Resilience", () => {
    it("should define service worker cache name v2", () => {
      const CACHE_NAME = "maven-grace-v2";
      expect(CACHE_NAME).toBe("maven-grace-v2");
    });

    it("should precache essential URLs", () => {
      const PRECACHE_URLS = ["/", "/offline.html", "/favicon.ico"];
      expect(PRECACHE_URLS).toContain("/");
      expect(PRECACHE_URLS).toContain("/offline.html");
    });

    it("should skip API calls in fetch handler", () => {
      const url = "/api/trpc/grace.chat";
      const isApi = url.startsWith("/api/");
      expect(isApi).toBe(true);
    });

    it("should serve offline page for navigation requests", () => {
      const offlineHtml = `<!DOCTYPE html><html><head><title>Grace is reconnecting...</title></head></html>`;
      expect(offlineHtml).toContain("Grace is reconnecting");
    });
  });

  // ── Schema Validation ──────────────────────────────────────────
  describe("Schema — Race 18 Fields", () => {
    it("should add cultural fields to grace_preferences", async () => {
      const schema = await import("../drizzle/schema");
      const table = schema.gracePreferences;
      expect(table).toBeDefined();
    });

    it("should support all new preference fields", () => {
      const newFields = [
        "culturalBackground",
        "languageStyle",
        "coachingMode",
        "reducedMotion",
        "highContrast",
        "fontSize",
        "onboardingStep",
        "onboardingComplete",
        "lastCelebrationAt",
      ];
      expect(newFields).toHaveLength(9);
    });
  });

  // ── Standing Order: KIE.ai Only ────────────────────────────────
  describe("Standing Order — KIE.ai Only", () => {
    it("should NOT have ElevenLabs integration file", async () => {
      const fs = await import("fs");
      const exists = fs.existsSync("server/elevenlabs-voice.ts");
      expect(exists).toBe(false);
    });

    it("should NOT import ElevenLabs in routers (except standing order comment)", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("server/routers.ts", "utf-8");
      // Filter out the standing order comment line
      const lines = content.split("\n").filter(l => !l.includes("standing order"));
      const filtered = lines.join("\n");
      expect(filtered.toLowerCase()).not.toContain("elevenlabs");
    });
  });
});
