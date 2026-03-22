import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";

export function ConsciousnessRing() {
  const { profileId } = useGraceSession();

  const { data } = trpc.consciousness.getConsciousnessRing.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId, refetchInterval: 30000 }
  );

  if (!profileId || !data) return null;

  const stateLabels: Record<string, string> = {
    present: "Present",
    warming_up: "Warming Up",
    deeply_connected: "Connected",
    fully_engaged: "Fully Here",
  };

  return (
    <div className="flex items-center gap-1.5" title={`Grace is ${stateLabels[data.state] || 'Present'} (${data.level}%)`}>
      {/* The ring — a pulsing circle that glows based on consciousness level */}
      <div className="relative w-5 h-5">
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            backgroundColor: data.glowColor,
            opacity: 0.3,
            filter: `blur(${Math.max(2, data.level / 20)}px)`,
          }}
        />
        {/* Inner ring */}
        <div
          className="absolute inset-0.5 rounded-full border-2"
          style={{
            borderColor: data.glowColor,
            backgroundColor: `${data.glowColor}20`,
          }}
        />
        {/* Center dot */}
        <div
          className="absolute inset-[5px] rounded-full"
          style={{ backgroundColor: data.glowColor }}
        />
      </div>
      <span className="text-[10px] font-medium" style={{ color: data.glowColor }}>
        {data.level}%
      </span>
    </div>
  );
}
