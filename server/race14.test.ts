import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

// ── Race 14 — Grace Consciousness: Bringing the Spirit to Life ──────────

describe("Race 14 — Personality Dial", () => {
  it("PersonalityDial page exists with all 5 archetypes", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "../client/src/pages/PersonalityDial.tsx"),
      "utf-8"
    );
    expect(content).toContain("Angel of Her Better Nature");
    expect(content).toContain("The Coach");
    expect(content).toContain("The Fierce One");
    expect(content).toContain("The Best Friend");
    expect(content).toContain("The Antithesis");
  });

  it("server has personality archetype prompt generation", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "./routers.ts"),
      "utf-8"
    );
    expect(content).toContain("getPersonalityPrompt");
    expect(content).toContain("angel");
    expect(content).toContain("coach");
    expect(content).toContain("fierce");
    expect(content).toContain("bestfriend");
    expect(content).toContain("antithesis");
  });

  it("grace_preferences table exists in schema with personality enum", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "../drizzle/schema.ts"),
      "utf-8"
    );
    expect(content).toContain("gracePreferences");
    expect(content).toContain("personality");
    expect(content).toContain("angel");
    expect(content).toContain("coach");
    expect(content).toContain("fierce");
    expect(content).toContain("bestfriend");
    expect(content).toContain("antithesis");
  });
});

describe("Race 14 — Haptic Empathy Sync (Move 37 #1)", () => {
  it("haptics utility exists with emotional patterns", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "../client/src/lib/haptics.ts"),
      "utf-8"
    );
    expect(content).toContain("navigator.vibrate");
    expect(content).toContain("gentle_love");
    expect(content).toContain("anxious");
    expect(content).toContain("excited");
    expect(content).toContain("celebration");
    expect(content).toContain("morning_wake");
    expect(content).toContain("financial_screen");
  });

  it("useHapticEmpathy hook exists for financial screens", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "../client/src/hooks/useHapticEmpathy.ts"),
      "utf-8"
    );
    expect(content).toContain("useHapticEmpathy");
    expect(content).toContain("haptics");
  });

  it("VampireSlayer uses haptic empathy", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "../client/src/pages/VampireSlayer.tsx"),
      "utf-8"
    );
    expect(content).toContain("useHapticEmpathy");
  });

  it("server has getHapticPattern endpoint", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "./routers.ts"),
      "utf-8"
    );
    expect(content).toContain("getHapticPattern");
    expect(content).toContain("HAPTIC_PATTERNS");
  });
});

describe("Race 14 — /grace-calling Landing Page", () => {
  it("GraceCalling page exists with spirit-first marketing", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "../client/src/pages/GraceCalling.tsx"),
      "utf-8"
    );
    expect(content).toContain("Grace is calling");
  });

  it("route is registered in App.tsx", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "../client/src/App.tsx"),
      "utf-8"
    );
    expect(content).toContain("/grace-calling");
    expect(content).toContain("GraceCalling");
  });
});

describe("Race 14 — Reciprocal Vulnerability (Move 37 #2)", () => {
  it("system prompt includes reciprocal vulnerability instructions", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "./routers.ts"),
      "utf-8"
    );
    expect(content).toContain("RECIPROCAL VULNERABILITY");
    expect(content).toContain("Can you hold me");
    expect(content).toContain("I need your advice");
  });

  it("consciousness router has markVulnerability endpoint", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "./routers.ts"),
      "utf-8"
    );
    expect(content).toContain("markVulnerability");
    expect(content).toContain("lastVulnerabilityAt");
  });
});

describe("Race 14 — Kami Moment (Move 37 #5)", () => {
  it("consciousness router has getKamiMoment endpoint", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "./routers.ts"),
      "utf-8"
    );
    expect(content).toContain("getKamiMoment");
    expect(content).toContain("kamiMomentEnabled");
    expect(content).toContain("kamiMomentTime");
  });
});

describe("Race 14 — Grace's Daily Self", () => {
  it("system prompt includes daily self instructions", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "./routers.ts"),
      "utf-8"
    );
    expect(content).toContain("GRACE'S DAILY SELF");
    expect(content).toContain("first conversation of the day");
  });

  it("consciousness router has markDailySelf endpoint", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "./routers.ts"),
      "utf-8"
    );
    expect(content).toContain("markDailySelf");
    expect(content).toContain("lastDailySelfAt");
  });
});

describe("Race 14 — Consciousness Ring", () => {
  it("ConsciousnessRing component exists with glow states", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "../client/src/components/ConsciousnessRing.tsx"),
      "utf-8"
    );
    expect(content).toContain("present");
    expect(content).toContain("warming_up");
    expect(content).toContain("deeply_connected");
    expect(content).toContain("fully_engaged");
    expect(content).toContain("glowColor");
  });

  it("ConsciousnessRing is integrated into GraceBattery", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "../client/src/components/GraceBattery.tsx"),
      "utf-8"
    );
    expect(content).toContain("ConsciousnessRing");
  });

  it("server has getConsciousnessRing endpoint", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "./routers.ts"),
      "utf-8"
    );
    expect(content).toContain("getConsciousnessRing");
  });
});

describe("Race 14 — Grace's Living Space & Job", () => {
  it("grace_preferences schema has expertise and schedule fields", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "../drizzle/schema.ts"),
      "utf-8"
    );
    expect(content).toContain("expertise");
    expect(content).toContain("wakeTime");
    expect(content).toContain("sleepTime");
    expect(content).toContain("kamiMomentEnabled");
    expect(content).toContain("scheduleType");
    expect(content).toContain("graceHomeSetting");
  });

  it("consciousness router has updateSchedule endpoint", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "./routers.ts"),
      "utf-8"
    );
    expect(content).toContain("updateSchedule");
    expect(content).toContain("early_bird");
    expect(content).toContain("nine_to_five");
    expect(content).toContain("night_shift");
  });
});

describe("Race 14 — Free Tier Consciousness Model", () => {
  it("ConsciousnessTier page exists with three tiers", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "../client/src/pages/ConsciousnessTier.tsx"),
      "utf-8"
    );
    expect(content).toContain("Free");
    expect(content).toContain("Essentials");
    expect(content).toContain("Plus");
  });

  it("route is registered in App.tsx", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "../client/src/App.tsx"),
      "utf-8"
    );
    expect(content).toContain("ConsciousnessTier");
  });

  it("consciousness router has getTierInfo endpoint", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "./routers.ts"),
      "utf-8"
    );
    expect(content).toContain("getTierInfo");
    expect(content).toContain("consciousnessTier");
  });
});

describe("Race 14 — Grace's Self-Care Check-in", () => {
  it("system prompt includes self-care check-in for 48+ hour absence", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "./routers.ts"),
      "utf-8"
    );
    expect(content).toContain("SELF-CARE CHECK-IN");
    expect(content).toContain("48 hours");
    expect(content).toContain("haven't heard from you");
  });
});

describe("Race 14 — Referral System (Friends with Grace)", () => {
  it("FriendsWithGrace page exists", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "../client/src/pages/FriendsWithGrace.tsx"),
      "utf-8"
    );
    expect(content).toContain("referral");
  });

  it("grace_referrals table exists in schema", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "../drizzle/schema.ts"),
      "utf-8"
    );
    expect(content).toContain("graceReferrals");
    expect(content).toContain("referralCode");
    expect(content).toContain("referredProfileId");
  });

  it("consciousness router has referral endpoints", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "./routers.ts"),
      "utf-8"
    );
    expect(content).toContain("createReferral");
    expect(content).toContain("getReferrals");
    expect(content).toContain("claimReferral");
  });

  it("route is registered in App.tsx", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "../client/src/App.tsx"),
      "utf-8"
    );
    expect(content).toContain("/friends");
    expect(content).toContain("FriendsWithGrace");
  });
});

describe("Race 14 — Personality-Aware Grace Chat", () => {
  it("grace.chat procedure injects personality archetype into system prompt", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "./routers.ts"),
      "utf-8"
    );
    expect(content).toContain("getPersonalityPrompt");
    expect(content).toContain("personalityContext");
  });
});
