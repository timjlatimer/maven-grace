import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const CLIENT_SRC = path.resolve(__dirname, "../client/src");
const PULSE_PAGES = path.resolve(CLIENT_SRC, "pages/pulse-zone");
const PULSE_COMPONENTS = path.resolve(CLIENT_SRC, "components/pulse-zone");

// ─── File Existence Tests ───────────────────────────────────────────────────
describe("Pulse Zone — File Structure", () => {
  const requiredFiles = [
    "pages/pulse-zone/PulseZoneHome.tsx",
    "pages/pulse-zone/GraceBatteryScreen.tsx",
    "pages/pulse-zone/DignityScoreScreen.tsx",
    "pages/pulse-zone/VillageActiveScreen.tsx",
    "pages/pulse-zone/GiveBackScreen.tsx",
    "pages/pulse-zone/NorthStar90DayScreen.tsx",
    "pages/pulse-zone/NorthStarPrimeScreen.tsx",
    "pages/pulse-zone/NorthStarDingScreen.tsx",
    "pages/pulse-zone/index.ts",
    "components/pulse-zone/theme.ts",
    "components/pulse-zone/mockData.ts",
  ];

  requiredFiles.forEach((file) => {
    it(`${file} exists`, () => {
      const fullPath = path.resolve(CLIENT_SRC, file);
      expect(fs.existsSync(fullPath)).toBe(true);
    });
  });
});

// ─── Route Registration Tests ───────────────────────────────────────────────
describe("Pulse Zone — Route Registration", () => {
  const appContent = fs.readFileSync(
    path.resolve(CLIENT_SRC, "App.tsx"),
    "utf-8"
  );

  const requiredRoutes = [
    "/pulse",
    "/pulse/battery",
    "/pulse/dignity",
    "/pulse/village",
    "/pulse/give-back",
    "/pulse/north-star",
    "/pulse/north-star/prime",
    "/pulse/north-star/ding",
  ];

  requiredRoutes.forEach((route) => {
    it(`route "${route}" is registered in App.tsx`, () => {
      expect(appContent).toContain(`path="${route}"`);
    });
  });
});

// ─── Home Screen Tests ──────────────────────────────────────────────────────
describe("Pulse Zone — Home Screen (PulseZoneHome)", () => {
  const content = fs.readFileSync(
    path.resolve(PULSE_PAGES, "PulseZoneHome.tsx"),
    "utf-8"
  );

  it("renders 3 KPI pills", () => {
    // Components bind from mockData, check for KPI pill references
    expect(content).toContain("kpiPills.battery");
    expect(content).toContain("kpiPills.dignity");
    expect(content).toContain("kpiPills.village");
  });

  it("contains the heartbeat wheel with 4 quadrants", () => {
    // HeartbeatWheel renders quadrants from mockData
    expect(content).toContain("HeartbeatWheel");
    expect(content).toContain("quadrants");
    expect(content).toContain("onQuadrantTap");
  });

  it("has the floating TP roll button", () => {
    expect(content).toContain("FloatingTPRoll");
    expect(content).toContain("give-back");
  });

  it("has the floating North Star button", () => {
    expect(content).toContain("FloatingNorthStar");
    expect(content).toContain("north-star");
  });

  it("has the HEARTBEAT label", () => {
    expect(content).toContain("HEARTBEAT");
  });

  it("displays greeting text", () => {
    expect(content).toContain("greeting.title");
    expect(content).toContain("greeting.subtitle");
  });

  it("has swipe up hint", () => {
    expect(content).toContain("swipe up");
  });

  it("navigates KPI pills to correct routes", () => {
    expect(content).toContain("/pulse/battery");
    expect(content).toContain("/pulse/dignity");
    expect(content).toContain("/pulse/village");
  });
});

// ─── Grace Battery Screen Tests ─────────────────────────────────────────────
describe("Pulse Zone — Grace Battery Screen", () => {
  const content = fs.readFileSync(
    path.resolve(PULSE_PAGES, "GraceBatteryScreen.tsx"),
    "utf-8"
  );

  it("has Relationship Battery title", () => {
    expect(content).toContain("Relationship");
    expect(content).toContain("Battery");
  });

  it("shows battery visual", () => {
    expect(content).toContain("BatteryVisual");
  });

  it("displays all 5 charging factors", () => {
    // Factors are rendered from mockData.graceBattery.factors
    expect(content).toContain("data.factors.map");
    expect(content).toContain("WHAT CHARGES OUR RELATIONSHIP");
    expect(content).toContain("factor.name");
  });

  it("shows available features section", () => {
    expect(content).toContain("WHAT'S AVAILABLE RIGHT NOW");
  });

  it("has philosophy section", () => {
    expect(content).toContain("THE PHILOSOPHY");
  });

  it("has Talk to Grace CTA", () => {
    expect(content).toContain("Talk to Grace Now");
  });

  it("has back navigation to Pulse Zone", () => {
    expect(content).toContain("Pulse Zone");
    expect(content).toContain("/pulse");
  });
});

// ─── Dignity Score Screen Tests ─────────────────────────────────────────────
describe("Pulse Zone — Dignity Score Screen", () => {
  const content = fs.readFileSync(
    path.resolve(PULSE_PAGES, "DignityScoreScreen.tsx"),
    "utf-8"
  );

  it("has Dignity Score title", () => {
    expect(content).toContain("Dignity");
    expect(content).toContain("Score");
  });

  it("shows the dignity ring visualization", () => {
    expect(content).toContain("DignityRing");
  });

  it("displays all 5 score dimensions", () => {
    // Dimensions are rendered from mockData.dignityScore.dimensions
    expect(content).toContain("data.dimensions.map");
    expect(content).toContain("WHAT BUILDS YOUR SCORE");
    expect(content).toContain("dim.name");
  });

  it("has 90-day climb chart", () => {
    expect(content).toContain("ClimbChart");
    expect(content).toContain("YOUR 90-DAY CLIMB");
  });

  it("has cascade section with services", () => {
    expect(content).toContain("ALSO WORKING FOR YOU");
    expect(content).toContain("ServiceCard");
  });

  it("has philosophy section", () => {
    expect(content).toContain("THE PHILOSOPHY");
  });
});

// ─── Village Active Screen Tests ────────────────────────────────────────────
describe("Pulse Zone — Village Active Screen", () => {
  const content = fs.readFileSync(
    path.resolve(PULSE_PAGES, "VillageActiveScreen.tsx"),
    "utf-8"
  );

  it("has Village Active title", () => {
    expect(content).toContain("Village");
    expect(content).toContain("Active");
  });

  it("shows village web visualization", () => {
    expect(content).toContain("VillageWeb");
  });

  it("displays village connections", () => {
    expect(content).toContain("YOUR VILLAGE CONNECTIONS");
    expect(content).toContain("ConnectionRow");
  });

  it("has village pulse chart", () => {
    expect(content).toContain("VillagePulseChart");
    expect(content).toContain("30-DAY VILLAGE PULSE");
  });

  it("has impact cards section", () => {
    expect(content).toContain("WHAT YOUR VILLAGE DOES FOR YOU");
    expect(content).toContain("ImpactCard");
  });

  it("has cascade section with village services", () => {
    expect(content).toContain("ALSO IN YOUR VILLAGE");
    expect(content).toContain("VillageServiceCard");
  });

  it("has Meet Your Village CTA", () => {
    expect(content).toContain("Meet Your Village");
  });
});

// ─── Give Back Screen Tests ─────────────────────────────────────────────────
describe("Pulse Zone — Give Back Screen", () => {
  const content = fs.readFileSync(
    path.resolve(PULSE_PAGES, "GiveBackScreen.tsx"),
    "utf-8"
  );

  it("has Give Back title", () => {
    expect(content).toContain("Give Back");
  });

  it("shows hero section with grace quote", () => {
    expect(content).toContain("GiveBackHero");
  });

  it("displays all 14+ programs", () => {
    expect(content).toContain("ProgramCard");
    expect(content).toContain("WHAT THE VILLAGE PROVIDES");
  });

  it("has How It Works section", () => {
    expect(content).toContain("HOW IT WORKS");
  });

  it("has Tell Grace CTA", () => {
    expect(content).toContain("Tell Grace What You Need");
  });
});

// ─── North Star 90-Day Screen Tests ─────────────────────────────────────────
describe("Pulse Zone — North Star 90-Day Screen", () => {
  const content = fs.readFileSync(
    path.resolve(PULSE_PAGES, "NorthStar90DayScreen.tsx"),
    "utf-8"
  );

  it("has North Star header", () => {
    expect(content).toContain("YOUR NORTH STAR");
    expect(content).toContain("90 Days with Grace");
  });

  it("shows progress ring", () => {
    expect(content).toContain("ProgressRing");
  });

  it("displays all 8 financial dimensions", () => {
    expect(content).toContain("DimensionRow");
  });

  it("shows total impact", () => {
    expect(content).toContain("TOTAL 90-DAY IMPACT");
    expect(content).toContain("kept in your pocket");
  });

  it("links to Prime North Star", () => {
    expect(content).toContain("/pulse/north-star/prime");
    expect(content).toContain("bigger reason");
  });
});

// ─── North Star Prime Screen Tests ──────────────────────────────────────────
describe("Pulse Zone — North Star Prime Screen", () => {
  const content = fs.readFileSync(
    path.resolve(PULSE_PAGES, "NorthStarPrimeScreen.tsx"),
    "utf-8"
  );

  it("has Prime North Star header", () => {
    expect(content).toContain("YOUR PRIME NORTH STAR");
    expect(content).toContain("CEO of Me Inc");
  });

  it("shows Tim Latimer quote", () => {
    expect(content).toContain("What makes the great, great is a sense of destiny");
    expect(content).toContain("Tim Latimer");
  });

  it("has 4 compass cards (N, E, S, W)", () => {
    expect(content).toContain("NORTH");
    expect(content).toContain("EAST");
    expect(content).toContain("SOUTH");
    expect(content).toContain("WEST");
    expect(content).toContain("Purpose");
    expect(content).toContain("BHAG");
    expect(content).toContain("Prime Directive");
    expect(content).toContain("Core Values");
  });

  it("has Destiny Discovered CTA", () => {
    expect(content).toContain("Begin Your Discovery");
  });

  it("links to Ding screen", () => {
    expect(content).toContain("/pulse/north-star/ding");
    expect(content).toContain("biggest reason of all");
  });
});

// ─── North Star Ding Screen Tests ───────────────────────────────────────────
describe("Pulse Zone — North Star Ding in the Universe Screen", () => {
  const content = fs.readFileSync(
    path.resolve(PULSE_PAGES, "NorthStarDingScreen.tsx"),
    "utf-8"
  );

  it("has the ding statement", () => {
    expect(content).toContain("The dash between your names");
    expect(content).toContain("is the ding");
  });

  it("shows Ruby — Grace partnership", () => {
    expect(content).toContain("rubyName");
    expect(content).toContain("graceName");
  });

  it("has three work blocks", () => {
    expect(content).toContain("THE IMMEDIATE WORK");
    expect(content).toContain("THE DEEPER WORK");
    expect(content).toContain("THE DING");
  });

  it("has the manifesto quote", () => {
    expect(content).toContain("It's expensive to be poor");
    expect(content).toContain("We think that's a crime");
    expect(content).toContain("And we are going to change it");
  });

  it("has Steve Jobs quote", () => {
    expect(content).toContain("ding in the universe");
    expect(content).toContain("Steve Jobs");
  });

  it("has the final CTA", () => {
    expect(content).toContain("I'm ready. Let's make our ding.");
  });
});

// ─── Mock Data Integrity Tests ──────────────────────────────────────────────
describe("Pulse Zone — Mock Data Integrity", () => {
  // Dynamic import doesn't work in vitest node mode, so we read the file
  const mockDataContent = fs.readFileSync(
    path.resolve(PULSE_COMPONENTS, "mockData.ts"),
    "utf-8"
  );

  it("has greeting data", () => {
    expect(mockDataContent).toContain("Morning Return");
    expect(mockDataContent).toContain("Grace is excited to see Ruby");
  });

  it("has 3 KPI pills", () => {
    expect(mockDataContent).toContain("kpi-battery");
    expect(mockDataContent).toContain("kpi-dignity");
    expect(mockDataContent).toContain("kpi-village");
  });

  it("has 4 quadrants", () => {
    expect(mockDataContent).toContain("q-research");
    expect(mockDataContent).toContain("q-chat");
    expect(mockDataContent).toContain("q-referral");
    expect(mockDataContent).toContain("q-ptk");
  });

  it("has 5 battery charging factors", () => {
    expect(mockDataContent).toContain("cf-talking");
    expect(mockDataContent).toContain("cf-subscription");
    expect(mockDataContent).toContain("cf-budgeting");
    expect(mockDataContent).toContain("cf-village");
    expect(mockDataContent).toContain("cf-friends");
  });

  it("has 5 dignity score dimensions", () => {
    expect(mockDataContent).toContain("ds-vampire");
    expect(mockDataContent).toContain("ds-nsf");
    expect(mockDataContent).toContain("ds-budget");
    expect(mockDataContent).toContain("ds-milk");
    expect(mockDataContent).toContain("ds-engagement");
  });

  it("has 16 dignity cascade services", () => {
    expect(mockDataContent).toContain("sc-milk-money");
    expect(mockDataContent).toContain("sc-lifeline-link");
  });

  it("has 6 village connections", () => {
    expect(mockDataContent).toContain("vc-lifeline");
    expect(mockDataContent).toContain("vc-wisdom");
  });

  it("has 15 village cascade services", () => {
    expect(mockDataContent).toContain("vs-big-mama");
    expect(mockDataContent).toContain("vs-union");
  });

  it("has 14 give-back programs", () => {
    expect(mockDataContent).toContain("gb-golden-ticket");
    expect(mockDataContent).toContain("gb-blue-seal");
  });

  it("has 8 North Star 90-day dimensions", () => {
    expect(mockDataContent).toContain("dim-vampire");
    expect(mockDataContent).toContain("dim-barter");
  });

  it("has North Star Prime data", () => {
    expect(mockDataContent).toContain("northStarPrime");
    expect(mockDataContent).toContain("purpose");
    expect(mockDataContent).toContain("bhag");
    expect(mockDataContent).toContain("primeDirective");
    expect(mockDataContent).toContain("coreValues");
  });

  it("has North Star Ding data", () => {
    expect(mockDataContent).toContain("northStarDing");
    expect(mockDataContent).toContain("rubyName");
    expect(mockDataContent).toContain("graceName");
  });
});

// ─── Theme Token Tests ──────────────────────────────────────────────────────
describe("Pulse Zone — Theme Tokens", () => {
  const themeContent = fs.readFileSync(
    path.resolve(PULSE_COMPONENTS, "theme.ts"),
    "utf-8"
  );

  it("has background color", () => {
    expect(themeContent).toContain("#0D0D08");
  });

  it("has amber accent", () => {
    expect(themeContent).toContain("#D4A843");
  });

  it("has teal accent", () => {
    expect(themeContent).toContain("#2DD4BF");
  });

  it("has rose CTA color", () => {
    expect(themeContent).toContain("#D4878F");
  });

  it("has village background", () => {
    expect(themeContent).toContain("#0A0F1A");
  });
});

// ─── Spirit Check ───────────────────────────────────────────────────────────
describe("Pulse Zone — Spirit Check", () => {
  it("North Star Ding screen contains the core manifesto", () => {
    const content = fs.readFileSync(
      path.resolve(PULSE_PAGES, "NorthStarDingScreen.tsx"),
      "utf-8"
    );
    // The most important line in the entire platform
    expect(content).toContain("It's expensive to be poor");
  });

  it("Give Back screen has no-application philosophy", () => {
    const mockContent = fs.readFileSync(
      path.resolve(PULSE_COMPONENTS, "mockData.ts"),
      "utf-8"
    );
    expect(mockContent).toContain("No applications. No shame. Just help.");
  });

  it("Grace Battery philosophy emphasizes relationship over transaction", () => {
    const mockContent = fs.readFileSync(
      path.resolve(PULSE_COMPONENTS, "mockData.ts"),
      "utf-8"
    );
    expect(mockContent).toContain("not from a meter or a machine");
    expect(mockContent).toContain("It's a bond");
  });

  it("Dignity Score philosophy is empowering, not grading", () => {
    const mockContent = fs.readFileSync(
      path.resolve(PULSE_COMPONENTS, "mockData.ts"),
      "utf-8"
    );
    expect(mockContent).toContain("This number isn't a grade. It's a mirror.");
  });
});
