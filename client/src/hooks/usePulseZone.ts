/**
 * usePulseZone — Custom hook for Pulse Zone data management
 * Runner B: Architecture-first approach with proper data layer separation
 *
 * Currently returns mock data. In production, this would connect to
 * tRPC queries for real-time data from the server.
 */
import { useMemo } from "react";
import { mockData } from "@/components/pulse-zone/mockData";
import type { PulseZoneState, GraceBatteryData, DignityScoreData, VillageActiveData, GiveBackData, NorthStar90DayData, NorthStarPrimeData, NorthStarDingData } from "@/types/pulse-zone";

export function usePulseZone(): PulseZoneState {
  // In production: return trpc.pulseZone.getState.useQuery()
  return useMemo(() => mockData, []);
}

export function useGraceBatteryData(): GraceBatteryData {
  const state = usePulseZone();
  return state.graceBattery;
}

export function useDignityScoreData(): DignityScoreData {
  const state = usePulseZone();
  return state.dignityScore;
}

export function useVillageActiveData(): VillageActiveData {
  const state = usePulseZone();
  return state.villageActive;
}

export function useGiveBackData(): GiveBackData {
  const state = usePulseZone();
  return state.giveBack;
}

export function useNorthStar90DayData(): NorthStar90DayData {
  const state = usePulseZone();
  return state.northStar90Day;
}

export function useNorthStarPrimeData(): NorthStarPrimeData {
  const state = usePulseZone();
  return state.northStarPrime;
}

export function useNorthStarDingData(): NorthStarDingData {
  const state = usePulseZone();
  return state.northStarDing;
}
