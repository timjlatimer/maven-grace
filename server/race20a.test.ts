import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Race 20A — Pulse Zone MVP", () => {
  // ─── 1. Types & Theme ─────────────────────────────────────────────
  describe("Types & Theme", () => {
    it("pulse-zone-types.ts exists with all core interfaces", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/lib/pulse-zone-types.ts"),
        "utf-8"
      );
      expect(file).toContain("PulseZoneHome");
      expect(file).toContain("RelationshipBattery");
      expect(file).toContain("DignityScore");
      expect(file).toContain("VillageActive");
      expect(file).toContain("GiveBackProgram");
      expect(file).toContain("NorthStar90Day");
      expect(file).toContain("NorthStarPrime");
    });

    it("pulse-zone-theme.ts exports PULSE_COLORS with all required colors", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/lib/pulse-zone-theme.ts"),
        "utf-8"
      );
      expect(file).toContain("PULSE_COLORS");
      expect(file).toContain("bg");
      expect(file).toContain("gold");
      expect(file).toContain("teal");
      expect(file).toContain("rose");
      expect(file).toContain("orange");
      expect(file).toContain("starGold");
      expect(file).toContain("starGray");
    });

    it("pulse-zone-data.ts exports all mock data stores", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/lib/pulse-zone-data.ts"),
        "utf-8"
      );
      expect(file).toContain("pulseZoneHome");
      expect(file).toContain("heartbeatQuadrants");
      expect(file).toContain("relationshipBattery");
      expect(file).toContain("dignityScore");
      expect(file).toContain("villageActive");
      expect(file).toContain("giveBackPrograms");
      expect(file).toContain("northStar90Day");
      expect(file).toContain("northStarPrime");
      expect(file).toContain("dignityCascadeServices");
      expect(file).toContain("villageCascadeServices");
    });
  });

  // ─── 2. Pulse Zone Home Screen ────────────────────────────────────
  describe("Pulse Zone Home Screen", () => {
    it("PulseZoneHome.tsx exists", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseZoneHome.tsx"),
        "utf-8"
      );
      expect(file).toBeTruthy();
    });

    it("has 3 KPI pills (Relationship Battery, Dignity Score, Village Active)", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseZoneHome.tsx"),
        "utf-8"
      );
      expect(file).toContain("Relationship Battery");
      expect(file).toContain("Dignity Score");
      expect(file).toContain("Village Active");
    });

    it("has data-testid for KPI pills", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseZoneHome.tsx"),
        "utf-8"
      );
      expect(file).toContain('data-testid="kpi-pills"');
    });

    it("has floating TP roll button with data-testid", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseZoneHome.tsx"),
        "utf-8"
      );
      expect(file).toContain('data-testid="tp-roll-button"');
      expect(file).toContain("give-back");
    });

    it("has floating North Star button with data-testid", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseZoneHome.tsx"),
        "utf-8"
      );
      expect(file).toContain('data-testid="north-star-button"');
      expect(file).toContain("north-star");
    });

    it("has heartbeat quadrants (Research, Hello, I Have a Guy, PTK)", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseZoneHome.tsx"),
        "utf-8"
      );
      expect(file).toContain("HeartbeatQuadrant");
      expect(file).toContain("heartbeatQuadrants");
    });

    it("has HEARTBEAT label", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseZoneHome.tsx"),
        "utf-8"
      );
      expect(file).toContain("H E A R T B E A T");
    });

    it("has swipe up indicator", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseZoneHome.tsx"),
        "utf-8"
      );
      expect(file).toContain("swipe up");
    });

    it("has data-testid for home screen", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseZoneHome.tsx"),
        "utf-8"
      );
      expect(file).toContain('data-testid="pulse-zone-home"');
    });
  });

  // ─── 3. Relationship Battery ──────────────────────────────────────
  describe("Relationship Battery", () => {
    it("RelationshipBattery.tsx exists", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/RelationshipBattery.tsx"),
        "utf-8"
      );
      expect(file).toBeTruthy();
    });

    it("has battery visual and percentage display", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/RelationshipBattery.tsx"),
        "utf-8"
      );
      expect(file).toContain("BatteryVisual");
      expect(file).toContain("level");
    });

    it("has WHAT CHARGES OUR RELATIONSHIP section", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/RelationshipBattery.tsx"),
        "utf-8"
      );
      expect(file).toContain("WHAT CHARGES OUR RELATIONSHIP");
    });

    it("has WHAT'S AVAILABLE RIGHT NOW section", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/RelationshipBattery.tsx"),
        "utf-8"
      );
      expect(file).toContain("AVAILABLE RIGHT NOW");
    });

    it("has THE PHILOSOPHY section", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/RelationshipBattery.tsx"),
        "utf-8"
      );
      expect(file).toContain("THE PHILOSOPHY");
    });

    it("has Talk to Grace Now CTA", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/RelationshipBattery.tsx"),
        "utf-8"
      );
      expect(file).toContain("Talk to Grace Now");
    });

    it("has back navigation to Pulse Zone", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/RelationshipBattery.tsx"),
        "utf-8"
      );
      expect(file).toContain("Pulse Zone");
      expect(file).toContain("/pulse-zone");
    });

    it("has data-testid", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/RelationshipBattery.tsx"),
        "utf-8"
      );
      expect(file).toContain('data-testid="relationship-battery"');
    });
  });

  // ─── 4. Dignity Score ─────────────────────────────────────────────
  describe("Dignity Score", () => {
    it("DignityScore.tsx exists in pulse-zone directory", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/DignityScore.tsx"),
        "utf-8"
      );
      expect(file).toBeTruthy();
    });

    it("has score ring visualization", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/DignityScore.tsx"),
        "utf-8"
      );
      expect(file).toContain("ScoreRing");
    });

    it("has WHAT BUILDS YOUR SCORE section", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/DignityScore.tsx"),
        "utf-8"
      );
      expect(file).toContain("WHAT BUILDS YOUR SCORE");
    });

    it("has 90-DAY CLIMB chart", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/DignityScore.tsx"),
        "utf-8"
      );
      expect(file).toContain("90-DAY CLIMB");
      expect(file).toContain("ClimbChart");
    });

    it("has cascade section ALSO WORKING FOR YOU", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/DignityScore.tsx"),
        "utf-8"
      );
      expect(file).toContain("ALSO WORKING FOR YOU");
      expect(file).toContain("dignityCascadeServices");
    });

    it("has data-testid", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/DignityScore.tsx"),
        "utf-8"
      );
      expect(file).toContain('data-testid="dignity-score"');
    });
  });

  // ─── 5. Village Active ────────────────────────────────────────────
  describe("Village Active", () => {
    it("VillageActive.tsx exists", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/VillageActive.tsx"),
        "utf-8"
      );
      expect(file).toBeTruthy();
    });

    it("has village hub visualization", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/VillageActive.tsx"),
        "utf-8"
      );
      expect(file).toContain("VillageHub");
    });

    it("has YOUR VILLAGE CONNECTIONS section", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/VillageActive.tsx"),
        "utf-8"
      );
      expect(file).toContain("YOUR VILLAGE CONNECTIONS");
    });

    it("has 30-DAY VILLAGE PULSE chart", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/VillageActive.tsx"),
        "utf-8"
      );
      expect(file).toContain("30-DAY VILLAGE PULSE");
      expect(file).toContain("WeeklyPulseChart");
    });

    it("has WHAT YOUR VILLAGE DOES FOR YOU benefits", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/VillageActive.tsx"),
        "utf-8"
      );
      expect(file).toContain("WHAT YOUR VILLAGE DOES FOR YOU");
    });

    it("has cascade section ALSO IN YOUR VILLAGE", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/VillageActive.tsx"),
        "utf-8"
      );
      expect(file).toContain("ALSO IN YOUR VILLAGE");
      expect(file).toContain("villageCascadeServices");
    });

    it("has Meet Your Village CTA", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/VillageActive.tsx"),
        "utf-8"
      );
      expect(file).toContain("Meet Your Village");
    });

    it("has data-testid", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/VillageActive.tsx"),
        "utf-8"
      );
      expect(file).toContain('data-testid="village-active"');
    });
  });

  // ─── 6. Give Back ─────────────────────────────────────────────────
  describe("Give Back", () => {
    it("GiveBack.tsx exists", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/GiveBack.tsx"),
        "utf-8"
      );
      expect(file).toBeTruthy();
    });

    it("has WHAT THE VILLAGE PROVIDES section", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/GiveBack.tsx"),
        "utf-8"
      );
      expect(file).toContain("WHAT THE VILLAGE PROVIDES");
    });

    it("has HOW IT WORKS section", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/GiveBack.tsx"),
        "utf-8"
      );
      expect(file).toContain("HOW IT WORKS");
      expect(file).toContain("application required");
      expect(file).toContain("nominates you");
      expect(file).toContain("Dignity");
    });

    it("has Tell Grace What You Need CTA", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/GiveBack.tsx"),
        "utf-8"
      );
      expect(file).toContain("Tell Grace What You Need");
    });

    it("has hero card with dignity messaging", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/GiveBack.tsx"),
        "utf-8"
      );
      expect(file).toContain("No applications. No shame. Just help.");
    });

    it("has data-testid", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/GiveBack.tsx"),
        "utf-8"
      );
      expect(file).toContain('data-testid="give-back"');
    });
  });

  // ─── 7. North Star 90-Day ─────────────────────────────────────────
  describe("North Star 90-Day", () => {
    it("NorthStar90Day.tsx exists", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStar90Day.tsx"),
        "utf-8"
      );
      expect(file).toBeTruthy();
    });

    it("has YOUR NORTH STAR header with star", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStar90Day.tsx"),
        "utf-8"
      );
      expect(file).toContain("YOUR NORTH STAR");
      expect(file).toContain("★");
    });

    it("has progress ring visualization", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStar90Day.tsx"),
        "utf-8"
      );
      expect(file).toContain("ProgressRing");
    });

    it("has 8 financial dimensions", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStar90Day.tsx"),
        "utf-8"
      );
      expect(file).toContain("DimensionRow");
      expect(file).toContain("dimensions");
    });

    it("has TOTAL 90-DAY IMPACT section", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStar90Day.tsx"),
        "utf-8"
      );
      expect(file).toContain("TOTAL 90-DAY IMPACT");
      expect(file).toContain("kept in your pocket");
    });

    it("links to Prime North Star", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStar90Day.tsx"),
        "utf-8"
      );
      expect(file).toContain("/pulse-zone/north-star/prime");
      expect(file).toContain("bigger reason");
    });

    it("has data-testid", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStar90Day.tsx"),
        "utf-8"
      );
      expect(file).toContain('data-testid="north-star-90day"');
    });
  });

  // ─── 8. North Star Prime ──────────────────────────────────────────
  describe("North Star Prime", () => {
    it("NorthStarPrime.tsx exists", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStarPrime.tsx"),
        "utf-8"
      );
      expect(file).toBeTruthy();
    });

    it("has YOUR PRIME NORTH STAR header", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStarPrime.tsx"),
        "utf-8"
      );
      expect(file).toContain("YOUR PRIME NORTH STAR");
    });

    it("has compass cards (NORTH, EAST, SOUTH, WEST)", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStarPrime.tsx"),
        "utf-8"
      );
      expect(file).toContain("CompassCard");
      expect(file).toContain("NORTH");
      expect(file).toContain("EAST");
      expect(file).toContain("SOUTH");
      expect(file).toContain("WEST");
    });

    it("has Destiny Discovered CTA", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStarPrime.tsx"),
        "utf-8"
      );
      expect(file).toContain("Begin Your Discovery");
    });

    it("links to Ding in the Universe", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStarPrime.tsx"),
        "utf-8"
      );
      expect(file).toContain("/pulse-zone/north-star/ding");
      expect(file).toContain("biggest reason of all");
    });

    it("has data-testid", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStarPrime.tsx"),
        "utf-8"
      );
      expect(file).toContain('data-testid="north-star-prime"');
    });
  });

  // ─── 9. North Star Ding in the Universe ───────────────────────────
  describe("North Star Ding in the Universe", () => {
    it("NorthStarDing.tsx exists", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStarDing.tsx"),
        "utf-8"
      );
      expect(file).toBeTruthy();
    });

    it("has the ding headline", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStarDing.tsx"),
        "utf-8"
      );
      expect(file).toContain("The dash between your names");
      expect(file).toContain("is the ding");
    });

    it("has Ruby — Grace partnership text", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStarDing.tsx"),
        "utf-8"
      );
      expect(file).toContain("Ruby — Grace");
    });

    it("has three work sections (Immediate, Deeper, Ding)", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStarDing.tsx"),
        "utf-8"
      );
      expect(file).toContain("THE IMMEDIATE WORK");
      expect(file).toContain("THE DEEPER WORK");
      expect(file).toContain("THE DING");
    });

    it("has the manifesto quote", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStarDing.tsx"),
        "utf-8"
      );
      expect(file).toContain("expensive to be poor");
      expect(file).toContain("crime");
      expect(file).toContain("change it");
    });

    it("has Steve Jobs quote", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStarDing.tsx"),
        "utf-8"
      );
      expect(file).toContain("ding in the universe");
      expect(file).toContain("Steve Jobs");
    });

    it("has final CTA", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStarDing.tsx"),
        "utf-8"
      );
      expect(file).toContain("ready. Let's make our ding");
    });

    it("has data-testid", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStarDing.tsx"),
        "utf-8"
      );
      expect(file).toContain('data-testid="north-star-ding"');
    });
  });

  // ─── 10. Routing Integration ──────────────────────────────────────
  describe("Routing Integration", () => {
    it("App.tsx has all 8 Pulse Zone routes", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/App.tsx"),
        "utf-8"
      );
      expect(file).toContain('path="/pulse-zone"');
      expect(file).toContain('path="/pulse-zone/battery"');
      expect(file).toContain('path="/pulse-zone/dignity"');
      expect(file).toContain('path="/pulse-zone/village"');
      expect(file).toContain('path="/pulse-zone/give-back"');
      expect(file).toContain('path="/pulse-zone/north-star"');
      expect(file).toContain('path="/pulse-zone/north-star/prime"');
      expect(file).toContain('path="/pulse-zone/north-star/ding"');
    });

    it("App.tsx lazy-loads all Pulse Zone components", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/App.tsx"),
        "utf-8"
      );
      expect(file).toContain("PulseZoneHome");
      expect(file).toContain("RelationshipBattery");
      expect(file).toContain("VillageActive");
      expect(file).toContain("GiveBack");
      expect(file).toContain("NorthStar90Day");
      expect(file).toContain("NorthStarPrime");
      expect(file).toContain("NorthStarDing");
    });
  });

  // ─── 11. Mock Data Completeness ───────────────────────────────────
  describe("Mock Data Completeness", () => {
    it("has 4 heartbeat quadrants", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/lib/pulse-zone-data.ts"),
        "utf-8"
      );
      expect(file).toContain("Research");
      expect(file).toContain("Hello");
      expect(file).toContain("I Have");
      expect(file).toContain("PTK");
    });

    it("has 5 battery factors", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/lib/pulse-zone-data.ts"),
        "utf-8"
      );
      expect(file).toContain("Talking to Grace");
      expect(file).toContain("Subscription current");
      expect(file).toContain("Budgeting together");
      expect(file).toContain("Village activity");
      expect(file).toContain("Bringing friends");
    });

    it("has 5 dignity pillars", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/lib/pulse-zone-data.ts"),
        "utf-8"
      );
      expect(file).toContain("Vampire Slayer");
      expect(file).toContain("NSF Shield");
      expect(file).toContain("Budget Mastery");
      expect(file).toContain("Milk Money Trust");
      expect(file).toContain("Engagement");
    });

    it("has 15+ give-back programs", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/lib/pulse-zone-data.ts"),
        "utf-8"
      );
      expect(file).toContain("Golden Ticket");
      expect(file).toContain("First Day Fund");
      expect(file).toContain("Giving Tree");
      expect(file).toContain("Blue Seal");
      expect(file).toContain("Power Buy");
    });

    it("has 8 North Star dimensions", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/lib/pulse-zone-data.ts"),
        "utf-8"
      );
      expect(file).toContain("Vampire Slayer");
      expect(file).toContain("NSF Shield");
      expect(file).toContain("Budget Mastery");
      expect(file).toContain("Neighbor Economy");
      expect(file).toContain("Wisdom Giants");
      expect(file).toContain("Milk Money");
      expect(file).toContain("Debt Reduced");
      expect(file).toContain("Barter Value");
    });

    it("has 15+ dignity cascade services", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/lib/pulse-zone-data.ts"),
        "utf-8"
      );
      expect(file).toContain("Milk Money");
      expect(file).toContain("Debt Snowball");
      expect(file).toContain("Wallet Warrior");
      expect(file).toContain("Phoenix Mode");
      expect(file).toContain("Gig Alert");
    });

    it("has 15+ village cascade services", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/lib/pulse-zone-data.ts"),
        "utf-8"
      );
      expect(file).toContain("Big Mama");
      expect(file).toContain("Wisdom Circle");
      expect(file).toContain("Town Crier");
      expect(file).toContain("Village Mood Ring");
      expect(file).toContain("The Union");
    });

    it("has compass data for Prime North Star", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/lib/pulse-zone-data.ts"),
        "utf-8"
      );
      expect(file).toContain("Purpose");
      expect(file).toContain("BHAG");
      expect(file).toContain("Prime Directive");
      expect(file).toContain("Core Values");
    });
  });

  // ─── 12. Screen Count Verification ────────────────────────────────
  describe("Screen Count — All 15 Screens", () => {
    const screens = [
      { name: "01 Home Screen", file: "client/src/pages/pulse-zone/PulseZoneHome.tsx" },
      { name: "02-03 Relationship Battery", file: "client/src/pages/pulse-zone/RelationshipBattery.tsx" },
      { name: "04-06 Dignity Score + Cascade", file: "client/src/pages/pulse-zone/DignityScore.tsx" },
      { name: "07-10 Village Active + Cascade", file: "client/src/pages/pulse-zone/VillageActive.tsx" },
      { name: "11-12 Give Back", file: "client/src/pages/pulse-zone/GiveBack.tsx" },
      { name: "13 North Star 90-Day", file: "client/src/pages/pulse-zone/NorthStar90Day.tsx" },
      { name: "14 North Star Prime", file: "client/src/pages/pulse-zone/NorthStarPrime.tsx" },
      { name: "15 North Star Ding", file: "client/src/pages/pulse-zone/NorthStarDing.tsx" },
    ];

    screens.forEach(({ name, file }) => {
      it(`${name} screen file exists`, () => {
        expect(fs.existsSync(path.resolve(file))).toBe(true);
      });
    });
  });

  // ─── 13. Floating Buttons ─────────────────────────────────────────
  describe("Floating Buttons", () => {
    it("TP roll button navigates to give-back", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseZoneHome.tsx"),
        "utf-8"
      );
      expect(file).toContain("FloatingTPRoll");
      expect(file).toContain("/pulse-zone/give-back");
    });

    it("North Star button navigates to north-star", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseZoneHome.tsx"),
        "utf-8"
      );
      expect(file).toContain("FloatingNorthStar");
      expect(file).toContain("/pulse-zone/north-star");
    });

    it("TP roll uses emoji 🧻", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseZoneHome.tsx"),
        "utf-8"
      );
      expect(file).toContain("🧻");
    });

    it("North Star uses star character ★", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseZoneHome.tsx"),
        "utf-8"
      );
      expect(file).toContain("★");
    });
  });
});
