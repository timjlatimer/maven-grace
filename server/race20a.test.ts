import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Race 20A — Pulse Zone MVP", () => {
  // ─── 1. Core Files Exist ──────────────────────────────────────
  describe("Pulse Zone Core Files", () => {
    it("pulseTheme.ts exists with COLORS export", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/components/pulse-zone/pulseTheme.ts"),
        "utf-8"
      );
      expect(file).toContain("COLORS");
      expect(file).toContain("background");
      expect(file).toContain("amber");
      expect(file).toContain("teal");
    });

    it("pulseData.ts exists with all data sections", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/components/pulse-zone/pulseData.ts"),
        "utf-8"
      );
      expect(file).toContain("pulseData");
      expect(file).toContain("kpiPills");
      expect(file).toContain("graceBattery");
      expect(file).toContain("dignityScore");
      expect(file).toContain("villageActive");
      expect(file).toContain("giveBack");
      expect(file).toContain("northStar90Day");
      expect(file).toContain("northStarPrime");
      expect(file).toContain("northStarDing");
    });
  });

  // ─── 2. Home Screen (Screen 01) ──────────────────────────────
  describe("Pulse Home Screen", () => {
    it("PulseHome.tsx exists with KPI pills", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseHome.tsx"),
        "utf-8"
      );
      expect(file).toContain("kpiPills.battery");
      expect(file).toContain("kpiPills.dignity");
      expect(file).toContain("kpiPills.village");
      // Verify labels exist in data store
      const data = fs.readFileSync(
        path.resolve("client/src/components/pulse-zone/pulseData.ts"),
        "utf-8"
      );
      expect(data).toContain("Grace Battery");
      expect(data).toContain("Dignity Score");
      expect(data).toContain("Village Active");
    });

    it("has Heartbeat radial navigation with 4 quadrants", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseHome.tsx"),
        "utf-8"
      );
      expect(file).toContain("Research");
      expect(file).toContain("Hello");
      expect(file).toContain("I Have");
      expect(file).toContain("PTK");
      expect(file).toContain("HEARTBEAT");
    });

    it("has floating North Star button", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseHome.tsx"),
        "utf-8"
      );
      expect(file).toContain("FloatingNorthStar");
      expect(file).toContain("north-star");
      expect(file).toContain("aria-label");
    });

    it("has floating TP Roll button", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseHome.tsx"),
        "utf-8"
      );
      expect(file).toContain("FloatingTPRoll");
      expect(file).toContain("give-back");
      expect(file).toContain("🧻");
    });

    it("has swipe up indicator", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseHome.tsx"),
        "utf-8"
      );
      expect(file).toContain("swipe up");
    });

    it("has greeting section with Morning Return", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseHome.tsx"),
        "utf-8"
      );
      expect(file).toContain("greeting");
    });
  });

  // ─── 3. Relationship Battery (Screens 02-03) ─────────────────
  describe("Relationship Battery Screen", () => {
    it("RelationshipBattery.tsx exists with 5 charge factors", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/RelationshipBattery.tsx"),
        "utf-8"
      );
      expect(file).toContain("Relationship");
      expect(file).toContain("Battery");
      expect(file).toContain("WHAT CHARGES OUR RELATIONSHIP");
      expect(file).toContain("factors");
    });

    it("has available features section", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/RelationshipBattery.tsx"),
        "utf-8"
      );
      expect(file).toContain("WHAT'S AVAILABLE RIGHT NOW");
      expect(file).toContain("availableFeatures");
    });

    it("has philosophy section", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/RelationshipBattery.tsx"),
        "utf-8"
      );
      expect(file).toContain("THE PHILOSOPHY");
      expect(file).toContain("philosophyText");
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
  });

  // ─── 4. Dignity Score (Screens 04-06) ─────────────────────────
  describe("Dignity Score Screen", () => {
    it("DignityScore.tsx exists with score ring and dimensions", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/DignityScore.tsx"),
        "utf-8"
      );
      expect(file).toContain("Dignity");
      expect(file).toContain("Score");
      expect(file).toContain("WHAT BUILDS YOUR SCORE");
      expect(file).toContain("dimensions");
    });

    it("has 90-day climb chart", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/DignityScore.tsx"),
        "utf-8"
      );
      expect(file).toContain("YOUR 90-DAY CLIMB");
      expect(file).toContain("climbData");
    });

    it("has service cascade (Also Working For You)", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/DignityScore.tsx"),
        "utf-8"
      );
      expect(file).toContain("ALSO WORKING FOR YOU");
      expect(file).toContain("workingForYouServices");
    });

    it("has all 16 services in the cascade data", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/components/pulse-zone/pulseData.ts"),
        "utf-8"
      );
      expect(file).toContain("Milk Money");
      expect(file).toContain("Debt Snowball");
      expect(file).toContain("Wallet Warrior");
      expect(file).toContain("Vampire Slayer");
      expect(file).toContain("Bill Negotiator");
      expect(file).toContain("Rent Gets Credit");
      expect(file).toContain("Hidden Prime Letter");
      expect(file).toContain("Credit Score Simulator");
      expect(file).toContain("Phoenix Mode");
      expect(file).toContain("Gig Alert");
      expect(file).toContain("Village Rolodex");
      expect(file).toContain("Gratitude Loop");
      expect(file).toContain("Financial History Vault");
      expect(file).toContain("Me Inc.");
      expect(file).toContain("Savings Circle");
      expect(file).toContain("Lifeline Link");
    });
  });

  // ─── 5. Village Active (Screens 07-10) ────────────────────────
  describe("Village Active Screen", () => {
    it("VillageActive.tsx exists with hub visualization", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/VillageActive.tsx"),
        "utf-8"
      );
      expect(file).toContain("Village");
      expect(file).toContain("Active");
      expect(file).toContain("Active Connections");
    });

    it("has village connections list", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/VillageActive.tsx"),
        "utf-8"
      );
      expect(file).toContain("YOUR VILLAGE CONNECTIONS");
      expect(file).toContain("connections");
    });

    it("has 30-day village pulse chart", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/VillageActive.tsx"),
        "utf-8"
      );
      expect(file).toContain("30-DAY VILLAGE PULSE");
      expect(file).toContain("pulseChartData");
    });

    it("has impact cards (Safety Net, Flare, Pass the Blessing)", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/VillageActive.tsx"),
        "utf-8"
      );
      expect(file).toContain("WHAT YOUR VILLAGE DOES FOR YOU");
      expect(file).toContain("impactCards");
    });

    it("has Also In Your Village cascade with 15 services", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/VillageActive.tsx"),
        "utf-8"
      );
      expect(file).toContain("ALSO IN YOUR VILLAGE");
      expect(file).toContain("alsoInVillageServices");
    });

    it("has all 15 village services in cascade data", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/components/pulse-zone/pulseData.ts"),
        "utf-8"
      );
      expect(file).toContain("Big Mama");
      expect(file).toContain("Wisdom Circle");
      expect(file).toContain("Town Crier");
      expect(file).toContain("Village Angels");
      expect(file).toContain("Good Side of the Feed");
      expect(file).toContain("Neighbor Knock");
      expect(file).toContain("Don't Get Got");
      expect(file).toContain("Smell Test");
      expect(file).toContain("Village Mood Ring");
      expect(file).toContain("The Watch");
      expect(file).toContain("Trust Ledger");
      expect(file).toContain("Village Petition");
      expect(file).toContain("Ask & Soak");
      expect(file).toContain("Safe Yard");
      expect(file).toContain("The Union");
    });

    it("has TP Roll link to Give Back", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/VillageActive.tsx"),
        "utf-8"
      );
      expect(file).toContain("give-back");
      expect(file).toContain("🧻");
    });
  });

  // ─── 6. Give Back (Screens 11-12) ─────────────────────────────
  describe("Give Back Screen", () => {
    it("GiveBack.tsx exists with 14 programs", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/GiveBack.tsx"),
        "utf-8"
      );
      expect(file).toContain("Give Back");
      expect(file).toContain("WHAT THE VILLAGE PROVIDES");
      expect(file).toContain("programs");
    });

    it("has all 14 Give Back programs in data", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/components/pulse-zone/pulseData.ts"),
        "utf-8"
      );
      expect(file).toContain("Golden Ticket");
      expect(file).toContain("First Day Fund");
      expect(file).toContain("Giving Tree");
      expect(file).toContain("Cap & Gown Fund");
      expect(file).toContain("Medicine Draw");
      expect(file).toContain("Goodbye Money");
      expect(file).toContain("Monthly Dignity Drop");
      expect(file).toContain("Pass the Blessing");
      expect(file).toContain("Safety Net");
      expect(file).toContain("Black Swan");
      expect(file).toContain("Front Row");
      expect(file).toContain("Your Cut");
      expect(file).toContain("Power Buy");
      expect(file).toContain("Blue Seal");
    });

    it("has How It Works section", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/GiveBack.tsx"),
        "utf-8"
      );
      expect(file).toContain("HOW IT WORKS");
      expect(file).toContain("howItWorks");
      // Verify labels exist in data store
      const data = fs.readFileSync(
        path.resolve("client/src/components/pulse-zone/pulseData.ts"),
        "utf-8"
      );
      expect(data).toContain("No application required");
      expect(data).toContain("Grace nominates you");
      expect(data).toContain("Dignity, always");
    });

    it("has Tell Grace What You Need CTA", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/GiveBack.tsx"),
        "utf-8"
      );
      expect(file).toContain("Tell Grace What You Need");
    });
  });

  // ─── 7. North Star 90-Day (Screen 13) ─────────────────────────
  describe("North Star 90-Day Dashboard", () => {
    it("NorthStar90Day.tsx exists with 8 dimensions", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStar90Day.tsx"),
        "utf-8"
      );
      expect(file).toContain("YOUR NORTH STAR");
      expect(file).toContain("90 Days with Grace");
      expect(file).toContain("dimensions");
    });

    it("has total impact section", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStar90Day.tsx"),
        "utf-8"
      );
      expect(file).toContain("TOTAL 90-DAY IMPACT");
      expect(file).toContain("kept in your pocket");
    });

    it("has all 8 financial dimensions in data", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/components/pulse-zone/pulseData.ts"),
        "utf-8"
      );
      // Check the 8 North Star dimensions
      expect(file).toContain("dim-vampire");
      expect(file).toContain("dim-nsf");
      expect(file).toContain("dim-budget");
      expect(file).toContain("dim-neighbor");
      expect(file).toContain("dim-wisdom");
      expect(file).toContain("dim-milk");
      expect(file).toContain("dim-debt");
      expect(file).toContain("dim-barter");
    });

    it("has navigation to Prime North Star", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStar90Day.tsx"),
        "utf-8"
      );
      expect(file).toContain("north-star/prime");
      expect(file).toContain("bigger reason");
    });
  });

  // ─── 8. Prime North Star / Me Inc. (Screen 14) ────────────────
  describe("Prime North Star Screen", () => {
    it("NorthStarPrime.tsx exists with compass grid", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStarPrime.tsx"),
        "utf-8"
      );
      expect(file).toContain("YOUR PRIME NORTH STAR");
      expect(file).toContain("CEO of Me Inc");
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
      expect(file).toContain("Destiny Discovered");
    });

    it("has navigation to Ding screen", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStarPrime.tsx"),
        "utf-8"
      );
      expect(file).toContain("north-star/ding");
      expect(file).toContain("biggest reason");
    });

    it("has Tim Latimer quote", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStarPrime.tsx"),
        "utf-8"
      );
      expect(file).toContain("What makes the great, great is a sense of destiny");
      expect(file).toContain("Tim Latimer");
    });
  });

  // ─── 9. Ding in the Universe (Screen 15) ──────────────────────
  describe("Ding in the Universe Screen", () => {
    it("NorthStarDing.tsx exists with the ding statement", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStarDing.tsx"),
        "utf-8"
      );
      expect(file).toContain("The dash between your names");
      expect(file).toContain("is the ding");
      expect(file).toContain("Ruby");
      expect(file).toContain("Grace");
    });

    it("has three work phases", () => {
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
      expect(file).toContain("It's expensive to be poor");
      expect(file).toContain("We think that's a crime");
      expect(file).toContain("And we are going to change it");
      expect(file).toContain("Together");
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
      expect(file).toContain("I'm ready. Let's make our ding.");
    });
  });

  // ─── 10. Navigation Wiring ────────────────────────────────────
  describe("Navigation & Routing", () => {
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

    it("BottomNav includes Pulse Zone link", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/components/BottomNav.tsx"),
        "utf-8"
      );
      expect(file).toContain("/pulse-zone");
      expect(file).toContain("Pulse Zone");
    });

    it("lazy imports are set up for all Pulse Zone pages", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/App.tsx"),
        "utf-8"
      );
      expect(file).toContain("PulseHome");
      expect(file).toContain("PulseRelationshipBattery");
      expect(file).toContain("PulseDignityScore");
      expect(file).toContain("PulseVillageActive");
      expect(file).toContain("PulseGiveBack");
      expect(file).toContain("PulseNorthStar90Day");
      expect(file).toContain("PulseNorthStarPrime");
      expect(file).toContain("PulseNorthStarDing");
    });
  });

  // ─── 11. Accessibility ────────────────────────────────────────
  describe("Accessibility", () => {
    it("North Star button has aria-label", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseHome.tsx"),
        "utf-8"
      );
      expect(file).toContain("aria-label");
      expect(file).toMatch(/aria-label.*North Star/);
    });

    it("TP Roll button has aria-label", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseHome.tsx"),
        "utf-8"
      );
      expect(file).toMatch(/aria-label.*Give Back/);
    });
  });

  // ─── 12. Animations ──────────────────────────────────────────
  describe("Animations", () => {
    it("Home screen uses framer-motion for heartbeat pulse", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseHome.tsx"),
        "utf-8"
      );
      expect(file).toContain("motion");
      expect(file).toContain("animate");
    });

    it("North Star button has breathing animation", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseHome.tsx"),
        "utf-8"
      );
      expect(file).toContain("FloatingNorthStar");
      expect(file).toContain("animate");
      expect(file).toContain("opacity");
    });

    it("TP Roll button has floating animation", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/PulseHome.tsx"),
        "utf-8"
      );
      expect(file).toContain("FloatingTPRoll");
    });

    it("Dignity Score has animated progress ring", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/DignityScore.tsx"),
        "utf-8"
      );
      expect(file).toContain("motion.circle");
      expect(file).toContain("strokeDashoffset");
    });

    it("90-Day Dashboard has animated progress bars", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/pulse-zone/NorthStar90Day.tsx"),
        "utf-8"
      );
      expect(file).toContain("motion.div");
      expect(file).toContain("progressPercent");
    });
  });
});
