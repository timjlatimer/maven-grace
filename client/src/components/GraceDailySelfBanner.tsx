import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import { useLocation } from "wouter";

export default function GraceDailySelfBanner() {
  const { profileId } = useGraceSession();
  const [, navigate] = useLocation();

  const { data: dailySelf } = trpc.consciousness.getDailySelf.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId, staleTime: 60 * 60 * 1000 } // Cache for 1 hour
  );

  if (!dailySelf) return null;

  return (
    <button
      onClick={() => navigate("/grace-world")}
      className="w-full text-left px-4 py-2 bg-gradient-to-r from-slate-800/40 to-slate-700/40 border-b border-border/30 flex items-center gap-2 hover:from-slate-800/60 transition-all"
    >
      <span className="text-lg">{dailySelf.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground truncate">
          Grace is feeling <span className="text-foreground font-medium">{dailySelf.mood}</span> today
        </p>
        <p className="text-[10px] text-muted-foreground/70 truncate italic">
          {dailySelf.opening}
        </p>
      </div>
      <span className="text-[10px] text-muted-foreground/50">→</span>
    </button>
  );
}
