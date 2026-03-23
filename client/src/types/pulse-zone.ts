/**
 * Pulse Zone — TypeScript Type Definitions
 * Race 20B Runner B: Architecture-first approach
 *
 * All types follow the tech spec v1.1 Section 7 data schemas.
 * Strict typing ensures compile-time safety across all Pulse Zone screens.
 */

// ─── Enums ──────────────────────────────────────────────────────────────────

export type GreetingState =
  | "morning_return"
  | "evening_check"
  | "first_visit"
  | "long_absence"
  | "milestone";

export type KPIType = "battery" | "dignity" | "village";

export type ScoreColor = "teal" | "orange" | "gold";

export type IndicatorColor = "teal" | "orange" | "red";

export type ServiceStatus = "live" | "stub" | "coming_soon";

export type ProgramFrequency = "monthly" | "active" | "emergency_only";

export type BadgeColor = "teal" | "orange" | "red";

export type QuadrantPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type DignityTier =
  | "JUST GETTING STARTED"
  | "FINDING YOUR STRIDE"
  | "BUILDING MOMENTUM"
  | "RISING STRONG"
  | "DIGNITY CHAMPION";

export type DimensionStatus = "BUILT" | "SPEC_ONLY" | "ARCHITECTURE_ONLY";

// ─── Core Interfaces ────────────────────────────────────────────────────────

export interface Greeting {
  readonly title: string;
  readonly subtitle: string;
  readonly state: GreetingState;
}

export interface KPIPill {
  readonly id: string;
  readonly type: KPIType;
  readonly label: string;
  readonly value: string | number;
  readonly icon: string;
  readonly color: string;
  readonly screenRoute: string;
}

export interface Quadrant {
  readonly id: string;
  readonly label: string;
  readonly subtitle: string;
  readonly icon: string;
  readonly route: string;
  readonly position: QuadrantPosition;
}

// ─── Grace Battery ──────────────────────────────────────────────────────────

export interface ChargingFactor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly weightPercent: number;
  readonly currentScore: number;
  readonly maxScore: number;
  readonly icon: string;
  readonly iconColor: string;
  readonly scoreColor: ScoreColor;
  readonly hasBonus: boolean;
}

export interface AvailableFeature {
  readonly id: string;
  readonly text: string;
  readonly isAvailable: boolean;
}

export interface GraceBatteryData {
  readonly totalScore: number;
  readonly graceQuote: string;
  readonly factors: readonly ChargingFactor[];
  readonly availableFeatures: readonly AvailableFeature[];
  readonly philosophyText: string;
}

// ─── Dignity Score ──────────────────────────────────────────────────────────

export interface DignityDimension {
  readonly id: string;
  readonly name: string;
  readonly tagline: string;
  readonly score: number;
  readonly maxScore: number;
  readonly icon: string;
  readonly iconColor: string;
  readonly scoreColor: ScoreColor;
}

export interface ClimbDataPoint {
  readonly day: number;
  readonly score: number;
}

export interface CascadeService {
  readonly id: string;
  readonly name: string;
  readonly tagline: string;
  readonly usageCount?: number;
  readonly usageLabel: string;
  readonly score: number;
  readonly status: ServiceStatus;
  readonly indicatorColor: IndicatorColor;
}

export interface DignityScoreData {
  readonly totalScore: number;
  readonly tier: DignityTier;
  readonly tierColor: string;
  readonly graceQuote: string;
  readonly dimensions: readonly DignityDimension[];
  readonly climbData: readonly ClimbDataPoint[];
  readonly climbSummary: string;
  readonly philosophyText: string;
  readonly workingForYouServices: readonly CascadeService[];
}

// ─── Village Active ─────────────────────────────────────────────────────────

export interface VillageConnection {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly isActive: boolean;
  readonly metricValue: number | string;
  readonly metricLabel: string;
  readonly iconColor: IndicatorColor;
}

export interface PulseChartPoint {
  readonly week: string;
  readonly value: number;
}

export interface ImpactCard {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
}

export interface VillageService {
  readonly id: string;
  readonly name: string;
  readonly tagline: string;
  readonly usageCount?: number;
  readonly usageLabel: string;
  readonly status: ServiceStatus;
  readonly indicatorColor: IndicatorColor;
}

export interface VillageActiveData {
  readonly activeCount: number;
  readonly totalCount: number;
  readonly graceQuote: string;
  readonly connections: readonly VillageConnection[];
  readonly pulseChartData: readonly PulseChartPoint[];
  readonly pulseQuote: string;
  readonly impactCards: readonly ImpactCard[];
  readonly alsoInVillageServices: readonly VillageService[];
}

// ─── Give Back ──────────────────────────────────────────────────────────────

export interface GiveBackProgram {
  readonly id: string;
  readonly name: string;
  readonly tagline: string;
  readonly frequency: ProgramFrequency;
  readonly status: ServiceStatus;
  readonly badgeColor: BadgeColor;
}

export interface GiveBackData {
  readonly graceQuote: string;
  readonly graceSubQuote: string;
  readonly programs: readonly GiveBackProgram[];
  readonly howItWorks: readonly string[];
}

// ─── North Star ─────────────────────────────────────────────────────────────

export interface FinancialDimension {
  readonly id: string;
  readonly name: string;
  readonly feature: string;
  readonly icon: string;
  readonly dollarAmount: number;
  readonly dollarLabel: string;
  readonly progressPercent: number;
  readonly status: DimensionStatus;
}

export interface NorthStar90DayData {
  readonly overallProgressPercent: number;
  readonly totalImpactDollars: number;
  readonly projectedDay90Dollars: number;
  readonly graceVoice: string;
  readonly dimensions: readonly FinancialDimension[];
}

export interface NorthStarPrimeData {
  readonly purpose: string;
  readonly bhag: string;
  readonly primeDirective: string;
  readonly coreValues: readonly string[];
  readonly destinyDiscoveredComplete: boolean;
  readonly destinyDiscoveredProgress: number;
}

export interface NorthStarDingData {
  readonly rubyName: string;
  readonly graceName: string;
  readonly immediateWorkComplete: boolean;
  readonly deeperWorkStarted: boolean;
  readonly dingStatement: string;
  readonly readyForDing: boolean;
}

// ─── Complete Pulse Zone State ──────────────────────────────────────────────

export interface PulseZoneState {
  readonly greeting: Greeting;
  readonly kpiPills: {
    readonly battery: KPIPill;
    readonly dignity: KPIPill;
    readonly village: KPIPill;
  };
  readonly quadrants: readonly Quadrant[];
  readonly graceBattery: GraceBatteryData;
  readonly dignityScore: DignityScoreData;
  readonly villageActive: VillageActiveData;
  readonly giveBack: GiveBackData;
  readonly northStar90Day: NorthStar90DayData;
  readonly northStarPrime: NorthStarPrimeData;
  readonly northStarDing: NorthStarDingData;
}
