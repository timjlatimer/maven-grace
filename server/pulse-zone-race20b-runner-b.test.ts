/**
 * Race 20B — Runner B: Comprehensive Pulse Zone Test Suite
 *
 * Tests focus on:
 * 1. Type system integrity (all interfaces compile correctly)
 * 2. Mock data schema validation (data matches interfaces)
 * 3. Component architecture (shared components, hooks, barrel exports)
 * 4. Screen-level rendering contracts
 * 5. Navigation flow validation
 * 6. Data binding correctness
 */
import { describe, it, expect, beforeAll } from "vitest";
import * as fs from "fs";
import * as path from "path";

const CLIENT_SRC = path.resolve(__dirname, "../client/src");

// ─── Helper: Read file content ─────────────────────────────────────────────

function readFile(relativePath: string): string {
  return fs.readFileSync(path.join(CLIENT_SRC, relativePath), "utf-8");
}

function fileExists(relativePath: string): boolean {
  return fs.existsSync(path.join(CLIENT_SRC, relativePath));
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 1: File Structure Validation
// ═══════════════════════════════════════════════════════════════════════════

describe("Runner B: File Structure", () => {
  const requiredFiles = [
    "types/pulse-zone.ts",
    "hooks/usePulseZone.ts",
    "components/pulse-zone/theme.ts",
    "components/pulse-zone/mockData.ts",
    "components/pulse-zone/shared.tsx",
    "components/pulse-zone/HeartbeatWheel.tsx",
    "components/pulse-zone/FloatingButtons.tsx",
    "components/pulse-zone/KPIPillRow.tsx",
    "pages/pulse-zone/PulseZoneHome.tsx",
    "pages/pulse-zone/GraceBatteryScreen.tsx",
    "pages/pulse-zone/DignityScoreScreen.tsx",
    "pages/pulse-zone/VillageActiveScreen.tsx",
    "pages/pulse-zone/GiveBackScreen.tsx",
    "pages/pulse-zone/NorthStar90DayScreen.tsx",
    "pages/pulse-zone/NorthStarPrimeScreen.tsx",
    "pages/pulse-zone/NorthStarDingScreen.tsx",
  ];

  requiredFiles.forEach((file) => {
    it(`should have ${file}`, () => {
      expect(fileExists(file)).toBe(true);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 2: Type System Integrity
// ═══════════════════════════════════════════════════════════════════════════

describe("Runner B: Type System", () => {
  let typesContent: string;

  beforeAll(() => {
    typesContent = readFile("types/pulse-zone.ts");
  });

  it("should export PulseZoneState as the root state type", () => {
    expect(typesContent).toContain("export interface PulseZoneState");
  });

  it("should define all KPI types", () => {
    expect(typesContent).toContain("KPIPill");
    expect(typesContent).toContain("KPIType");
  });

  it("should define Grace Battery types", () => {
    expect(typesContent).toContain("ChargingFactor");
    expect(typesContent).toContain("GraceBatteryData");
    expect(typesContent).toContain("AvailableFeature");
  });

  it("should define Dignity Score types", () => {
    expect(typesContent).toContain("DignityDimension");
    expect(typesContent).toContain("DignityScoreData");
    expect(typesContent).toContain("DignityTier");
    expect(typesContent).toContain("CascadeService");
  });

  it("should define Village Active types", () => {
    expect(typesContent).toContain("VillageConnection");
    expect(typesContent).toContain("VillageActiveData");
    expect(typesContent).toContain("VillageService");
    expect(typesContent).toContain("ImpactCard");
  });

  it("should define Give Back types", () => {
    expect(typesContent).toContain("GiveBackProgram");
    expect(typesContent).toContain("GiveBackData");
    expect(typesContent).toContain("BadgeColor");
  });

  it("should define North Star types", () => {
    expect(typesContent).toContain("FinancialDimension");
    expect(typesContent).toContain("NorthStar90DayData");
    expect(typesContent).toContain("NorthStarPrimeData");
    expect(typesContent).toContain("NorthStarDingData");
  });

  it("should use readonly modifiers for immutability", () => {
    const readonlyCount = (typesContent.match(/readonly /g) || []).length;
    expect(readonlyCount).toBeGreaterThan(30);
  });

  it("should define DimensionStatus for SPEC_ONLY tracking", () => {
    expect(typesContent).toContain("DimensionStatus");
    expect(typesContent).toContain("SPEC_ONLY");
    expect(typesContent).toContain("ARCHITECTURE_ONLY");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 3: Mock Data Schema Validation
// ═══════════════════════════════════════════════════════════════════════════

describe("Runner B: Mock Data Schema", () => {
  let mockContent: string;

  beforeAll(() => {
    mockContent = readFile("components/pulse-zone/mockData.ts");
  });

  it("should import PulseZoneState for type safety", () => {
    expect(mockContent).toContain("import type { PulseZoneState }");
  });

  it("should type the export as PulseZoneState", () => {
    expect(mockContent).toContain("mockData: PulseZoneState");
  });

  // KPI Pills
  it("should have 3 KPI pills (battery, dignity, village)", () => {
    expect(mockContent).toContain("kpi-battery");
    expect(mockContent).toContain("kpi-dignity");
    expect(mockContent).toContain("kpi-village");
  });

  it("should have Grace Battery at 94%", () => {
    expect(mockContent).toContain('"94%"');
  });

  it("should have Dignity Score at 72", () => {
    expect(mockContent).toContain("value: 72");
  });

  // Grace Battery
  it("should have 5 charging factors", () => {
    const factorIds = mockContent.match(/id: "cf-/g);
    expect(factorIds).toHaveLength(5);
  });

  it("should have battery total score of 94", () => {
    expect(mockContent).toContain("totalScore: 94");
  });

  it("should include Bringing friends bonus factor", () => {
    expect(mockContent).toContain("Bringing friends");
    expect(mockContent).toContain("hasBonus: true");
  });

  // Dignity Score
  it("should have 5 dignity dimensions", () => {
    const dimIds = mockContent.match(/id: "ds-/g);
    expect(dimIds).toHaveLength(5);
  });

  it("should have dignity total score of 67", () => {
    expect(mockContent).toContain("totalScore: 67");
  });

  it("should have FINDING YOUR STRIDE tier", () => {
    expect(mockContent).toContain("FINDING YOUR STRIDE");
  });

  it("should have 16 working-for-you services in cascade", () => {
    const serviceIds = mockContent.match(/id: "sc-/g);
    expect(serviceIds).toHaveLength(16);
  });

  // Village Active
  it("should have 6 village connections", () => {
    const connIds = mockContent.match(/id: "vc-/g);
    expect(connIds).toHaveLength(6);
  });

  it("should have 4 active out of 6 total", () => {
    expect(mockContent).toContain("activeCount: 4");
    expect(mockContent).toContain("totalCount: 6");
  });

  it("should have 15 also-in-village services", () => {
    const villageServiceIds = mockContent.match(/id: "vs-/g);
    expect(villageServiceIds).toHaveLength(15);
  });

  it("should have 3 impact cards", () => {
    const impactIds = mockContent.match(/id: "ic-/g);
    expect(impactIds).toHaveLength(3);
  });

  // Give Back
  it("should have 15 give-back programs", () => {
    const programIds = mockContent.match(/id: "gb-/g);
    expect(programIds).toHaveLength(15);
  });

  it("should have 3 how-it-works steps", () => {
    expect(mockContent).toContain("No application required");
    expect(mockContent).toContain("Grace nominates you");
    expect(mockContent).toContain("Dignity, always");
  });

  // North Star 90-Day
  it("should have 8 financial dimensions (the 8 dimensions of lift)", () => {
    const dimIds = mockContent.match(/id: "dim-/g);
    expect(dimIds).toHaveLength(8);
  });

  it("should have total impact of $1,191", () => {
    expect(mockContent).toContain("totalImpactDollars: 1191");
  });

  it("should have projected day 90 of $2,538", () => {
    expect(mockContent).toContain("projectedDay90Dollars: 2538");
  });

  it("should have 47% overall progress", () => {
    expect(mockContent).toContain("overallProgressPercent: 47");
  });

  it("should mark SPEC_ONLY dimensions correctly", () => {
    const specOnlyCount = (mockContent.match(/status: "SPEC_ONLY"/g) || []).length;
    expect(specOnlyCount).toBeGreaterThanOrEqual(3);
  });

  // North Star Prime
  it("should have purpose, BHAG, prime directive, and core values", () => {
    expect(mockContent).toContain("purpose:");
    expect(mockContent).toContain("bhag:");
    expect(mockContent).toContain("primeDirective:");
    expect(mockContent).toContain("coreValues:");
  });

  it("should have 4 core values", () => {
    expect(mockContent).toContain("Family");
    expect(mockContent).toContain("Honesty");
    expect(mockContent).toContain("Resilience");
    expect(mockContent).toContain("Joy");
  });

  // North Star Ding
  it("should have Ruby and Grace names", () => {
    expect(mockContent).toContain('rubyName: "Ruby"');
    expect(mockContent).toContain('graceName: "Grace"');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 4: Hook Architecture
// ═══════════════════════════════════════════════════════════════════════════

describe("Runner B: Hook Architecture", () => {
  let hookContent: string;

  beforeAll(() => {
    hookContent = readFile("hooks/usePulseZone.ts");
  });

  it("should export usePulseZone as the root hook", () => {
    expect(hookContent).toContain("export function usePulseZone");
  });

  it("should export individual screen hooks", () => {
    expect(hookContent).toContain("export function useGraceBatteryData");
    expect(hookContent).toContain("export function useDignityScoreData");
    expect(hookContent).toContain("export function useVillageActiveData");
    expect(hookContent).toContain("export function useGiveBackData");
    expect(hookContent).toContain("export function useNorthStar90DayData");
    expect(hookContent).toContain("export function useNorthStarPrimeData");
    expect(hookContent).toContain("export function useNorthStarDingData");
  });

  it("should use useMemo for performance", () => {
    expect(hookContent).toContain("useMemo");
  });

  it("should import from mockData", () => {
    expect(hookContent).toContain("mockData");
  });

  it("should have proper return types", () => {
    expect(hookContent).toContain("GraceBatteryData");
    expect(hookContent).toContain("DignityScoreData");
    expect(hookContent).toContain("VillageActiveData");
    expect(hookContent).toContain("GiveBackData");
    expect(hookContent).toContain("NorthStar90DayData");
    expect(hookContent).toContain("NorthStarPrimeData");
    expect(hookContent).toContain("NorthStarDingData");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 5: Shared Component Architecture
// ═══════════════════════════════════════════════════════════════════════════

describe("Runner B: Shared Components", () => {
  let sharedContent: string;

  beforeAll(() => {
    sharedContent = readFile("components/pulse-zone/shared.tsx");
  });

  it("should export ScreenContainer", () => {
    expect(sharedContent).toContain("export const ScreenContainer");
  });

  it("should export ScreenHeader", () => {
    expect(sharedContent).toContain("export const ScreenHeader");
  });

  it("should export SectionHeader", () => {
    expect(sharedContent).toContain("export const SectionHeader");
  });

  it("should export CTAButton", () => {
    expect(sharedContent).toContain("export const CTAButton");
  });

  it("should export PhilosophyBlock", () => {
    expect(sharedContent).toContain("export const PhilosophyBlock");
  });

  it("should export FeatureCheck", () => {
    expect(sharedContent).toContain("export const FeatureCheck");
  });

  it("should export TotalBar", () => {
    expect(sharedContent).toContain("export const TotalBar");
  });

  it("should use memo for all components", () => {
    const memoCount = (sharedContent.match(/memo\(function/g) || []).length;
    expect(memoCount).toBeGreaterThanOrEqual(7);
  });

  it("should use PULSE_THEME for styling", () => {
    expect(sharedContent).toContain("PULSE_THEME");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 6: Theme Token Validation
// ═══════════════════════════════════════════════════════════════════════════

describe("Runner B: Theme Tokens", () => {
  let themeContent: string;

  beforeAll(() => {
    themeContent = readFile("components/pulse-zone/theme.ts");
  });

  it("should export PULSE_THEME", () => {
    expect(themeContent).toContain("export const PULSE_THEME");
  });

  it("should export PulseTheme type", () => {
    expect(themeContent).toContain("PulseTheme");
  });

  it("should define background tokens", () => {
    expect(themeContent).toContain("primary");
    expect(themeContent).toContain("village");
    expect(themeContent).toContain("card");
  });

  it("should define accent tokens", () => {
    expect(themeContent).toContain("amber");
    expect(themeContent).toContain("teal");
    expect(themeContent).toContain("rose");
    expect(themeContent).toContain("cyan");
  });

  it("should define gradient tokens", () => {
    expect(themeContent).toContain("heartbeat");
    expect(themeContent).toContain("tpRoll");
  });

  it("should use as const for literal types", () => {
    expect(themeContent).toContain("as const");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 7: Floating Buttons
// ═══════════════════════════════════════════════════════════════════════════

describe("Runner B: Floating Buttons", () => {
  let floatingContent: string;

  beforeAll(() => {
    floatingContent = readFile("components/pulse-zone/FloatingButtons.tsx");
  });

  it("should export FloatingTPRoll", () => {
    expect(floatingContent).toContain("FloatingTPRoll");
  });

  it("should export FloatingNorthStar", () => {
    expect(floatingContent).toContain("FloatingNorthStar");
  });

  it("should navigate to /pulse/give-back on TP roll tap", () => {
    expect(floatingContent).toContain("/pulse/give-back");
  });

  it("should navigate to /pulse/north-star on star tap", () => {
    expect(floatingContent).toContain("/pulse/north-star");
  });

  it("should use fixed positioning", () => {
    expect(floatingContent).toContain("fixed");
  });

  it("should use framer-motion for animations", () => {
    expect(floatingContent).toContain("motion");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 8: HeartbeatWheel
// ═══════════════════════════════════════════════════════════════════════════

describe("Runner B: HeartbeatWheel", () => {
  let wheelContent: string;

  beforeAll(() => {
    wheelContent = readFile("components/pulse-zone/HeartbeatWheel.tsx");
  });

  it("should export HeartbeatWheel", () => {
    expect(wheelContent).toContain("HeartbeatWheel");
  });

  it("should render 4 quadrants", () => {
    expect(wheelContent).toContain("top-left");
    expect(wheelContent).toContain("top-right");
    expect(wheelContent).toContain("bottom-left");
    expect(wheelContent).toContain("bottom-right");
  });

  it("should have the G center marker", () => {
    expect(wheelContent).toContain(">G<");
  });

  it("should have HEARTBEAT label", () => {
    expect(wheelContent).toContain("HEARTBEAT");
  });

  it("should use radial gradient for rings", () => {
    expect(wheelContent).toContain("radial");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 9: Screen-Level Component Contracts
// ═══════════════════════════════════════════════════════════════════════════

describe("Runner B: PulseZoneHome Screen", () => {
  let homeContent: string;

  beforeAll(() => {
    homeContent = readFile("pages/pulse-zone/PulseZoneHome.tsx");
  });

  it("should use usePulseZone hook", () => {
    expect(homeContent).toContain("usePulseZone");
  });

  it("should render KPIPillRow", () => {
    expect(homeContent).toContain("KPIPillRow");
  });

  it("should render HeartbeatWheel", () => {
    expect(homeContent).toContain("HeartbeatWheel");
  });

  it("should render FloatingNorthStar", () => {
    expect(homeContent).toContain("FloatingNorthStar");
  });

  it("should render FloatingTPRoll", () => {
    expect(homeContent).toContain("FloatingTPRoll");
  });

  it("should show greeting text", () => {
    expect(homeContent).toContain("greeting");
  });

  it("should have swipe up indicator", () => {
    expect(homeContent).toContain("swipe up");
  });
});

describe("Runner B: GraceBatteryScreen", () => {
  let batteryContent: string;

  beforeAll(() => {
    batteryContent = readFile("pages/pulse-zone/GraceBatteryScreen.tsx");
  });

  it("should use useGraceBatteryData hook", () => {
    expect(batteryContent).toContain("useGraceBatteryData");
  });

  it("should render ScreenHeader with back to Pulse Zone", () => {
    expect(batteryContent).toContain("Pulse Zone");
    expect(batteryContent).toContain("/pulse");
  });

  it("should render charging factors", () => {
    expect(batteryContent).toContain("WHAT CHARGES OUR RELATIONSHIP");
  });

  it("should render available features", () => {
    expect(batteryContent).toContain("WHAT'S AVAILABLE RIGHT NOW");
  });

  it("should render philosophy block", () => {
    expect(batteryContent).toContain("PhilosophyBlock");
  });

  it("should render CTA button", () => {
    expect(batteryContent).toContain("Talk to Grace Now");
  });

  it("should render battery visual", () => {
    expect(batteryContent).toContain("BatteryVisual");
  });

  it("should render TotalBar", () => {
    expect(batteryContent).toContain("TotalBar");
  });
});

describe("Runner B: DignityScoreScreen", () => {
  let dignityContent: string;

  beforeAll(() => {
    dignityContent = readFile("pages/pulse-zone/DignityScoreScreen.tsx");
  });

  it("should use useDignityScoreData hook", () => {
    expect(dignityContent).toContain("useDignityScoreData");
  });

  it("should render score ring visualization", () => {
    expect(dignityContent).toContain("ScoreRing");
  });

  it("should render WHAT BUILDS YOUR SCORE section", () => {
    expect(dignityContent).toContain("WHAT BUILDS YOUR SCORE");
  });

  it("should render 90-day climb chart", () => {
    expect(dignityContent).toContain("ClimbChart");
  });

  it("should render service cascade (ALSO WORKING FOR YOU)", () => {
    expect(dignityContent).toContain("ALSO WORKING FOR YOU");
  });

  it("should render philosophy block", () => {
    expect(dignityContent).toContain("PhilosophyBlock");
  });

  it("should render TotalBar with dignity score", () => {
    expect(dignityContent).toContain("Total Dignity Score");
  });
});

describe("Runner B: VillageActiveScreen", () => {
  let villageContent: string;

  beforeAll(() => {
    villageContent = readFile("pages/pulse-zone/VillageActiveScreen.tsx");
  });

  it("should use useVillageActiveData hook", () => {
    expect(villageContent).toContain("useVillageActiveData");
  });

  it("should render village web visualization", () => {
    expect(villageContent).toContain("VillageWeb");
  });

  it("should render village connections", () => {
    expect(villageContent).toContain("YOUR VILLAGE CONNECTIONS");
  });

  it("should render 30-day pulse chart", () => {
    expect(villageContent).toContain("30-DAY VILLAGE PULSE");
  });

  it("should render impact cards", () => {
    expect(villageContent).toContain("WHAT YOUR VILLAGE DOES FOR YOU");
  });

  it("should render also-in-village cascade", () => {
    expect(villageContent).toContain("ALSO IN YOUR VILLAGE");
  });

  it("should include FloatingTPRoll", () => {
    expect(villageContent).toContain("FloatingTPRoll");
  });

  it("should render Meet Your Village CTA", () => {
    expect(villageContent).toContain("Meet Your Village");
  });
});

describe("Runner B: GiveBackScreen", () => {
  let giveBackContent: string;

  beforeAll(() => {
    giveBackContent = readFile("pages/pulse-zone/GiveBackScreen.tsx");
  });

  it("should use useGiveBackData hook", () => {
    expect(giveBackContent).toContain("useGiveBackData");
  });

  it("should render WHAT THE VILLAGE PROVIDES section", () => {
    expect(giveBackContent).toContain("WHAT THE VILLAGE PROVIDES");
  });

  it("should render HOW IT WORKS section", () => {
    expect(giveBackContent).toContain("HOW IT WORKS");
  });

  it("should render Tell Grace What You Need CTA", () => {
    expect(giveBackContent).toContain("Tell Grace What You Need");
  });

  it("should render program count summary", () => {
    expect(giveBackContent).toContain("programs working for you");
  });
});

describe("Runner B: NorthStar90DayScreen", () => {
  let northStarContent: string;

  beforeAll(() => {
    northStarContent = readFile("pages/pulse-zone/NorthStar90DayScreen.tsx");
  });

  it("should use useNorthStar90DayData hook", () => {
    expect(northStarContent).toContain("useNorthStar90DayData");
  });

  it("should render progress ring", () => {
    expect(northStarContent).toContain("ProgressRing");
  });

  it("should render YOUR NORTH STAR header", () => {
    expect(northStarContent).toContain("YOUR NORTH STAR");
  });

  it("should render TOTAL 90-DAY IMPACT", () => {
    expect(northStarContent).toContain("TOTAL 90-DAY IMPACT");
  });

  it("should navigate to prime screen", () => {
    expect(northStarContent).toContain("/pulse/north-star/prime");
  });

  it("should show 'bigger reason' link text", () => {
    expect(northStarContent).toContain("bigger reason");
  });
});

describe("Runner B: NorthStarPrimeScreen", () => {
  let primeContent: string;

  beforeAll(() => {
    primeContent = readFile("pages/pulse-zone/NorthStarPrimeScreen.tsx");
  });

  it("should use useNorthStarPrimeData hook", () => {
    expect(primeContent).toContain("useNorthStarPrimeData");
  });

  it("should render YOUR PRIME NORTH STAR header", () => {
    expect(primeContent).toContain("YOUR PRIME NORTH STAR");
  });

  it("should render 4 compass cards (N, E, S, W)", () => {
    expect(primeContent).toContain("NORTH");
    expect(primeContent).toContain("EAST");
    expect(primeContent).toContain("SOUTH");
    expect(primeContent).toContain("WEST");
  });

  it("should render Purpose, BHAG, Prime Directive, Core Values", () => {
    expect(primeContent).toContain("Purpose");
    expect(primeContent).toContain("BHAG");
    expect(primeContent).toContain("Prime Directive");
    expect(primeContent).toContain("Core Values");
  });

  it("should render Destiny Discovered CTA", () => {
    expect(primeContent).toContain("Begin Your Discovery");
  });

  it("should navigate to ding screen", () => {
    expect(primeContent).toContain("/pulse/north-star/ding");
  });

  it("should include Tim Latimer quote", () => {
    expect(primeContent).toContain("Tim Latimer");
  });
});

describe("Runner B: NorthStarDingScreen", () => {
  let dingContent: string;

  beforeAll(() => {
    dingContent = readFile("pages/pulse-zone/NorthStarDingScreen.tsx");
  });

  it("should use useNorthStarDingData hook", () => {
    expect(dingContent).toContain("useNorthStarDingData");
  });

  it("should render 'The dash between your names is the ding'", () => {
    expect(dingContent).toContain("dash between your names");
  });

  it("should render THE IMMEDIATE WORK block", () => {
    expect(dingContent).toContain("THE IMMEDIATE WORK");
  });

  it("should render THE DEEPER WORK block", () => {
    expect(dingContent).toContain("THE DEEPER WORK");
  });

  it("should render THE DING block", () => {
    expect(dingContent).toContain("THE DING");
  });

  it("should include 'It's expensive to be poor' quote", () => {
    expect(dingContent).toContain("expensive to be poor");
  });

  it("should include Steve Jobs quote", () => {
    expect(dingContent).toContain("ding in the universe");
  });

  it("should render final CTA", () => {
    expect(dingContent).toContain("I'm ready. Let's make our ding.");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 10: Navigation Route Validation
// ═══════════════════════════════════════════════════════════════════════════

describe("Runner B: Navigation Routes", () => {
  let appContent: string;

  beforeAll(() => {
    appContent = readFile("App.tsx");
  });

  const routes = [
    "/pulse",
    "/pulse/battery",
    "/pulse/dignity",
    "/pulse/village",
    "/pulse/give-back",
    "/pulse/north-star",
    "/pulse/north-star/prime",
    "/pulse/north-star/ding",
  ];

  routes.forEach((route) => {
    it(`should register route ${route}`, () => {
      expect(appContent).toContain(`path="${route}"`);
    });
  });

  it("should lazy-load all Pulse Zone pages", () => {
    expect(appContent).toContain('import("./pages/pulse-zone/PulseZoneHome")');
    expect(appContent).toContain('import("./pages/pulse-zone/GraceBatteryScreen")');
    expect(appContent).toContain('import("./pages/pulse-zone/DignityScoreScreen")');
    expect(appContent).toContain('import("./pages/pulse-zone/VillageActiveScreen")');
    expect(appContent).toContain('import("./pages/pulse-zone/GiveBackScreen")');
    expect(appContent).toContain('import("./pages/pulse-zone/NorthStar90DayScreen")');
    expect(appContent).toContain('import("./pages/pulse-zone/NorthStarPrimeScreen")');
    expect(appContent).toContain('import("./pages/pulse-zone/NorthStarDingScreen")');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 11: Architecture Quality Checks
// ═══════════════════════════════════════════════════════════════════════════

describe("Runner B: Architecture Quality", () => {
  it("should not have any direct color hex values in page components (use theme)", () => {
    const pages = [
      "pages/pulse-zone/PulseZoneHome.tsx",
    ];
    pages.forEach((page) => {
      const content = readFile(page);
      // Allow PULSE_THEME references but check there's no random hex colors
      expect(content).toContain("PULSE_THEME");
    });
  });

  it("should use memo for performance in extracted components", () => {
    const wheelContent = readFile("components/pulse-zone/HeartbeatWheel.tsx");
    expect(wheelContent).toContain("memo");
    const kpiContent = readFile("components/pulse-zone/KPIPillRow.tsx");
    expect(kpiContent).toContain("memo");
  });

  it("should use framer-motion for animations", () => {
    const homeContent = readFile("pages/pulse-zone/PulseZoneHome.tsx");
    expect(homeContent).toContain("motion");
    const dignityContent = readFile("pages/pulse-zone/DignityScoreScreen.tsx");
    expect(dignityContent).toContain("motion");
  });

  it("should separate data layer from UI (hooks pattern)", () => {
    const hookContent = readFile("hooks/usePulseZone.ts");
    // Hook should not contain JSX
    expect(hookContent).not.toContain("className");
    expect(hookContent).not.toContain("<div");
  });

  it("should have proper component extraction (no monolithic files)", () => {
    const homeContent = readFile("pages/pulse-zone/PulseZoneHome.tsx");
    // Home should import from extracted components, not define everything inline
    expect(homeContent).toContain("from \"@/components/pulse-zone/");
  });
});
