// ─── Pulse Zone Types ─────────────────────────────────────────────
// Race 20A — Pulse Zone MVP

// ─── Grace Battery (Relationship Battery) ─────────────────────────
export interface BatteryFactor {
  id: string;
  label: string;
  description: string;
  icon: string;
  weight: number;       // percentage weight (e.g. 30 = 30%)
  current: number;      // current points earned
  max: number;          // max possible points
}

export interface RelationshipBattery {
  level: number;         // 0-100
  status: string;        // e.g. "We're fully connected right now. I'm at my best for you."
  factors: BatteryFactor[];
  availableFeatures: string[];
  philosophy: string;
}

// ─── Dignity Score ────────────────────────────────────────────────
export type DignityTier = 'survival' | 'finding-stride' | 'rising' | 'thriving' | 'sovereign';

export interface DignityPillar {
  id: string;
  label: string;
  description: string;
  icon: string;
  maxPoints: number;
  currentPoints: number;
  color: string;
}

export interface DignityClimbPoint {
  day: number;
  score: number;
}

export interface DignityScore {
  score: number;          // 0-100
  tier: DignityTier;
  tierLabel: string;
  encouragement: string;
  pillars: DignityPillar[];
  climb: DignityClimbPoint[];
  philosophy: string;
}

// ─── Dignity Cascade (Also Working For You) ───────────────────────
export interface CascadeService {
  id: string;
  name: string;
  description: string;
  score: number;
  status: string;
  statusColor: string;
}

// ─── Village Active ───────────────────────────────────────────────
export interface VillageConnection {
  id: string;
  label: string;
  description: string;
  status: string;
  statusColor: string;
  dotColor: string;
}

export interface VillageBenefit {
  id: string;
  title: string;
  description: string;
}

export interface VillageWeekData {
  week: string;
  connections: number;
}

export interface VillageActive {
  activeConnections: number;
  totalConnections: number;
  friends: number;
  neighbors: number;
  encouragement: string;
  connections: VillageConnection[];
  weeklyPulse: VillageWeekData[];
  benefits: VillageBenefit[];
}

// ─── Village Cascade (Also In Your Village) ───────────────────────
export interface VillageCascadeService {
  id: string;
  name: string;
  description: string;
  status: string;
  statusColor: string;
}

// ─── Give Back ────────────────────────────────────────────────────
export type GiveBackStatus = 'active' | 'available' | 'coming-soon';

export interface GiveBackProgram {
  id: string;
  name: string;
  description: string;
  statusColor: string;   // color of the progress bar
  status: GiveBackStatus;
}

// ─── North Star ───────────────────────────────────────────────────
export interface NorthStarDimension {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  amount: string;
  percentage: number;
  barColor: string;
}

export interface NorthStar90Day {
  percentComplete: number;
  totalImpact: string;
  projectedImpact: string;
  encouragement: string;
  dimensions: NorthStarDimension[];
}

export interface NorthStarCompassCard {
  direction: 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';
  title: string;
  content: string;
  letter: string;
}

export interface NorthStarPrime {
  headline: string;
  quote: string;
  quoteAuthor: string;
  compass: NorthStarCompassCard[];
  encouragement: string;
}

export interface NorthStarDing {
  headline: string;
  subheadline: string;
  immediateWork: string;
  deeperWork: string;
  theDing: string;
  closingQuote: string;
  steveJobsQuote: string;
}

// ─── Pulse Zone Home ──────────────────────────────────────────────
export type GreetingType = 'morning-return' | 'first-visit' | 'evening-check' | 'milestone';

export interface PulseZoneHome {
  greeting: string;
  greetingSubtext: string;
  greetingType: GreetingType;
  batteryLevel: number;
  dignityScore: number;
  villageSummary: string;
}

// ─── Heartbeat Quadrants ──────────────────────────────────────────
export interface HeartbeatQuadrant {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  route: string;
}
