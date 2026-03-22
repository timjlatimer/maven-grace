import { useState, useEffect } from "react";
import { MessageCircle, GraduationCap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface CoachingModeToggleProps {
  profileId: number;
}

export default function CoachingModeToggle({ profileId }: CoachingModeToggleProps) {
  const { data: prefs } = trpc.consciousness.getPreferences.useQuery(
    { profileId },
    { enabled: profileId > 0 }
  );

  const [mode, setMode] = useState<"chat" | "coach">("chat");

  useEffect(() => {
    if (prefs?.coachingMode) setMode(prefs.coachingMode as "chat" | "coach");
  }, [prefs]);

  const toggleMut = trpc.consciousness.setCoachingMode.useMutation({
    onSuccess: (data) => {
      setMode(data.mode);
      toast.success(data.mode === "coach" ? "Coach mode activated — Grace is ready to guide you" : "Back to casual chat mode");
    },
  });

  const handleToggle = () => {
    const newMode = mode === "chat" ? "coach" : "chat";
    toggleMut.mutate({ profileId, mode: newMode });
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        mode === "coach"
          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
          : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600"
      }`}
      title={mode === "coach" ? "Switch to casual chat" : "Switch to coaching mode"}
    >
      {mode === "coach" ? (
        <>
          <GraduationCap className="w-3.5 h-3.5" />
          Coach
        </>
      ) : (
        <>
          <MessageCircle className="w-3.5 h-3.5" />
          Chat
        </>
      )}
    </button>
  );
}
