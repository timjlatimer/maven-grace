import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";

interface KpiData {
  moneySaved: string;
  boxesDelivered: string;
  dignityScore: string;
  promisesKept: string;
  vampiresSlayed: string;
  neighborsHelped: string;
  daysToPayday: string;
  creditsEarned: string;
  villageMembers: string;
  graceBattery: string;
}

const KPI_ITEMS = [
  { key: "moneySaved", emoji: "💰", label: "Money Saved This Month" },
  { key: "boxesDelivered", emoji: "🧻", label: "Essentials Boxes Delivered" },
  { key: "dignityScore", emoji: "⭐", label: "Dignity Score" },
  { key: "promisesKept", emoji: "🤝", label: "Promises Kept" },
  { key: "vampiresSlayed", emoji: "🧛", label: "Vampires Slayed" },
  { key: "neighborsHelped", emoji: "🏘️", label: "Neighbors Helped" },
  { key: "daysToPayday", emoji: "📅", label: "Days to Next Payday" },
  { key: "creditsEarned", emoji: "💳", label: "Community Credits Earned" },
  { key: "villageMembers", emoji: "🌟", label: "Village Members Active" },
  { key: "graceBattery", emoji: "🔋", label: "Relationship Battery" },
];

/**
 * KPI Ticker Tape — NYSE-style scrolling above the bottom nav
 * Shows 10 KPIs in a continuous horizontal scroll with warm teal colors
 */
export default function KpiTicker() {
  const { profileId } = useGraceSession();
  const [kpis, setKpis] = useState<KpiData | null>(null);

  // Fetch KPI data
  const kpiQuery = trpc.ticker.getKpis.useQuery(
    { profileId: profileId ?? undefined },
    { enabled: true, refetchInterval: 60000 } // Refetch every minute
  );

  useEffect(() => {
    if (kpiQuery.data) {
      setKpis(kpiQuery.data);
    }
  }, [kpiQuery.data]);

  if (!kpis) {
    return null;
  }

  // Build ticker items with values
  const tickerItems = KPI_ITEMS.map((item) => ({
    ...item,
    value: kpis[item.key as keyof KpiData],
  }));

  // Duplicate items for seamless loop
  const doubledItems = [...tickerItems, ...tickerItems];

  return (
    <div
      className="fixed bottom-14 left-0 right-0 z-40 bg-gradient-to-r from-teal-50/80 to-mint-50/80 dark:from-teal-950/40 dark:to-mint-950/40 backdrop-blur-sm border-t border-teal-200/30 dark:border-teal-800/30 overflow-hidden"
      style={{ height: "28px" }}
    >
      {/* Ticker scroll container */}
      <div
        className="flex items-center h-full whitespace-nowrap"
        style={{
          animation: "tickerScroll 60s linear infinite",
        }}
      >
        {doubledItems.map((item, idx) => (
          <div
            key={`${item.key}-${idx}`}
            className="flex items-center gap-1 px-3 flex-shrink-0"
          >
            {/* Emoji */}
            <span className="text-sm">{item.emoji}</span>

            {/* Value */}
            <span
              className="text-xs font-semibold tabular-nums"
              style={{ color: "var(--maven-teal)" }}
            >
              {item.value}
            </span>

            {/* Divider dot (except last item) */}
            {idx < doubledItems.length - 1 && (
              <span
                className="w-1 h-1 rounded-full mx-1"
                style={{ backgroundColor: "rgba(45,212,191,0.3)" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes tickerScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
