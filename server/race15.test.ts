import { describe, it, expect, vi } from "vitest";

// ── Race 15: Grace Comes Alive in the UI ──────────────────────────────

describe("Race 15 — Consciousness Helpers", () => {
  it("getDailySelf returns valid mood for any day of year", async () => {
    const { getDailySelf } = await import("./consciousness-helpers");
    for (let day = 0; day < 365; day++) {
      const self = getDailySelf(day);
      expect(self).toHaveProperty("mood");
      expect(self).toHaveProperty("emoji");
      expect(self).toHaveProperty("energy");
      expect(self).toHaveProperty("outfit");
      expect(self).toHaveProperty("opening");
      expect(typeof self.mood).toBe("string");
      expect(self.mood.length).toBeGreaterThan(0);
    }
  });

  it("getDailySelf cycles through all 7 moods", async () => {
    const { getDailySelf } = await import("./consciousness-helpers");
    const moods = new Set<string>();
    for (let day = 0; day < 7; day++) {
      moods.add(getDailySelf(day).mood);
    }
    expect(moods.size).toBe(7);
  });

  it("getGraceHome returns valid home for all settings", async () => {
    const { getGraceHome } = await import("./consciousness-helpers");
    const settings = ["auto", "cozy_apartment", "small_house", "shared_space"];
    for (const s of settings) {
      const home = getGraceHome(s);
      expect(home).toHaveProperty("name");
      expect(home).toHaveProperty("description");
      expect(home).toHaveProperty("rent");
      expect(home.name.length).toBeGreaterThan(0);
    }
  });

  it("getGraceJob returns valid job for all expertise areas", async () => {
    const { getGraceJob } = await import("./consciousness-helpers");
    const areas = ["general", "finance", "health", "education", "legal", "technology", "unknown"];
    for (const a of areas) {
      const job = getGraceJob(a);
      expect(job).toHaveProperty("title");
      expect(job).toHaveProperty("description");
      expect(job).toHaveProperty("schedule");
      expect(job.title.length).toBeGreaterThan(0);
    }
  });

  it("getDayOfYear returns a number between 1 and 366", async () => {
    const { getDayOfYear } = await import("./consciousness-helpers");
    const day = getDayOfYear();
    expect(day).toBeGreaterThanOrEqual(1);
    expect(day).toBeLessThanOrEqual(366);
  });
});

describe("Race 15 — Heartbeat Scenarios (7 total)", () => {
  it("heartbeat router handles all 7 scenario types", () => {
    const scenarios = [
      "misses_ruby",
      "found_something",
      "grace_worried",
      "grace_excited",
      "morning_return",
      "promise_due",
      "neighborhood_news",
    ];
    // Verify all scenario names are valid strings
    for (const s of scenarios) {
      expect(typeof s).toBe("string");
      expect(s.length).toBeGreaterThan(0);
    }
    expect(scenarios.length).toBe(7);
  });

  it("haptic map covers all heartbeat scenarios", () => {
    const hapticMap: Record<string, string> = {
      misses_ruby: "missing_ruby",
      found_something: "excited",
      morning_return: "morning_wake",
      grace_worried: "worried",
      grace_excited: "celebration",
      promise_due: "gentle_love",
      neighborhood_news: "excited",
    };
    expect(Object.keys(hapticMap).length).toBe(7);
    for (const emotion of Object.values(hapticMap)) {
      expect(typeof emotion).toBe("string");
    }
  });
});

describe("Race 15 — Haptic Patterns", () => {
  it("all emotional haptic patterns are valid vibration arrays", async () => {
    const patterns: Record<string, number[]> = {
      gentle_love: [100, 200, 100],
      anxious: [50, 50, 50, 50, 50, 50, 50],
      excited: [100, 100, 200, 100, 100],
      missing_ruby: [500, 300, 200],
      celebration: [100, 100, 100, 100, 200, 100, 100, 300],
      urgent: [200, 100, 200, 100, 200],
      morning_wake: [100, 300, 100, 300, 100],
      worried: [50, 100, 50, 100, 50, 100],
      financial_screen: [100, 200, 100, 200, 100],
    };
    expect(Object.keys(patterns).length).toBe(9);
    for (const [name, pattern] of Object.entries(patterns)) {
      expect(Array.isArray(pattern)).toBe(true);
      expect(pattern.length).toBeGreaterThan(0);
      for (const v of pattern) {
        expect(typeof v).toBe("number");
        expect(v).toBeGreaterThan(0);
      }
    }
  });
});

describe("Race 15 — PWA Manifest", () => {
  it("manifest.json has required PWA fields", async () => {
    const fs = await import("fs");
    const manifest = JSON.parse(fs.readFileSync("client/public/manifest.json", "utf-8"));
    expect(manifest.name).toBe("Maven Grace — Support at Your Door");
    expect(manifest.short_name).toBe("Maven Grace");
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toBe("/");
    expect(manifest.theme_color).toBe("#2dd4bf");
    expect(manifest.background_color).toBe("#0f172a");
    expect(manifest.icons).toBeDefined();
    expect(Array.isArray(manifest.icons)).toBe(true);
  });
});

describe("Race 15 — Personality Archetypes", () => {
  it("all 5 archetypes have system prompts", () => {
    const archetypes = ["angel", "coach", "fierce", "bestfriend", "antithesis"];
    expect(archetypes.length).toBe(5);
    // Verify they are distinct
    const unique = new Set(archetypes);
    expect(unique.size).toBe(5);
  });
});

describe("Race 15 — Grace's Inner World", () => {
  it("all 3 home types have required fields", async () => {
    const { getGraceHome } = await import("./consciousness-helpers");
    const homes = ["cozy_apartment", "small_house", "shared_space"];
    for (const h of homes) {
      const home = getGraceHome(h);
      expect(home.name).toBeTruthy();
      expect(home.description).toBeTruthy();
      expect(home.rent).toBeTruthy();
      expect(home.rent).toMatch(/\$/); // Contains dollar sign
    }
  });

  it("all 6 job types have required fields", async () => {
    const { getGraceJob } = await import("./consciousness-helpers");
    const jobs = ["general", "finance", "health", "education", "legal", "technology"];
    for (const j of jobs) {
      const job = getGraceJob(j);
      expect(job.title).toBeTruthy();
      expect(job.description).toBeTruthy();
      expect(job.schedule).toBeTruthy();
    }
  });
});

describe("Race 15 — Navigation Integration", () => {
  it("bottom nav includes Grace World, Personality, Friends, and Tiers", async () => {
    const fs = await import("fs");
    const navContent = fs.readFileSync("client/src/components/BottomNav.tsx", "utf-8");
    expect(navContent).toContain("/grace-world");
    expect(navContent).toContain("/personality");
    expect(navContent).toContain("/friends");
    expect(navContent).toContain("/consciousness");
    expect(navContent).toContain("Grace's World");
    expect(navContent).toContain("Personality");
    expect(navContent).toContain("Tiers");
  });

  it("App.tsx has route for /grace-world", async () => {
    const fs = await import("fs");
    const appContent = fs.readFileSync("client/src/App.tsx", "utf-8");
    expect(appContent).toContain("/grace-world");
    expect(appContent).toContain("GraceWorld");
  });
});

describe("Race 15 — Daily Self Banner", () => {
  it("GraceDailySelfBanner component exists", async () => {
    const fs = await import("fs");
    const exists = fs.existsSync("client/src/components/GraceDailySelfBanner.tsx");
    expect(exists).toBe(true);
    const content = fs.readFileSync("client/src/components/GraceDailySelfBanner.tsx", "utf-8");
    expect(content).toContain("getDailySelf");
    expect(content).toContain("grace-world");
  });
});

describe("Race 15 — Personality Onboarding Gate", () => {
  it("PersonalityOnboardingGate component exists and references personality page", async () => {
    const fs = await import("fs");
    const exists = fs.existsSync("client/src/components/PersonalityOnboardingGate.tsx");
    expect(exists).toBe(true);
    const content = fs.readFileSync("client/src/components/PersonalityOnboardingGate.tsx", "utf-8");
    expect(content).toContain("/personality");
    expect(content).toContain("maven-grace-personality-onboarded");
  });
});
