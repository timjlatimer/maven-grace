import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, Zap, Type, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AccessibilitySettings() {
  const [, navigate] = useLocation();
  const profileId = Number(localStorage.getItem("maven-grace-profileId") || "0");

  const { data: prefs } = trpc.consciousness.getPreferences.useQuery(
    { profileId },
    { enabled: profileId > 0 }
  );

  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");

  useEffect(() => {
    if (prefs) {
      setReducedMotion(prefs.reducedMotion ?? false);
      setHighContrast(prefs.highContrast ?? false);
      setFontSize((prefs.fontSize as any) ?? "normal");
    }
  }, [prefs]);

  const updateMut = trpc.consciousness.updateAccessibility.useMutation({
    onSuccess: () => toast.success("Settings saved"),
  });

  const handleSave = () => {
    updateMut.mutate({ profileId, reducedMotion, highContrast, fontSize });
    // Apply immediately to document
    document.documentElement.classList.toggle("reduce-motion", reducedMotion);
    document.documentElement.classList.toggle("high-contrast", highContrast);
    document.documentElement.style.fontSize = fontSize === "xlarge" ? "20px" : fontSize === "large" ? "18px" : "16px";
  };

  // Apply on mount
  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reducedMotion);
    document.documentElement.classList.toggle("high-contrast", highContrast);
    document.documentElement.style.fontSize = fontSize === "xlarge" ? "20px" : fontSize === "large" ? "18px" : "16px";
  }, [reducedMotion, highContrast, fontSize]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 p-4">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button onClick={() => navigate("/grace-status")} className="p-2 rounded-lg hover:bg-slate-800">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Accessibility</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-slate-400 text-sm"
        >
          Grace wants to be comfortable for everyone. Adjust these settings to make your experience better.
        </motion.p>

        {/* Reduced Motion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl border border-slate-800 bg-slate-800/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="font-semibold">Reduced Motion</div>
                <div className="text-sm text-slate-400">Minimize animations and transitions</div>
              </div>
            </div>
            <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
          </div>
        </motion.div>

        {/* High Contrast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl border border-slate-800 bg-slate-800/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="font-semibold">High Contrast</div>
                <div className="text-sm text-slate-400">Increase contrast for better readability</div>
              </div>
            </div>
            <Switch checked={highContrast} onCheckedChange={setHighContrast} />
          </div>
        </motion.div>

        {/* Font Size */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl border border-slate-800 bg-slate-800/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
              <Type className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="font-semibold">Font Size</div>
              <div className="text-sm text-slate-400">Adjust text size for comfort</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: "normal" as const, label: "Normal", size: "text-sm" },
              { id: "large" as const, label: "Large", size: "text-base" },
              { id: "xlarge" as const, label: "X-Large", size: "text-lg" },
            ]).map(s => (
              <button
                key={s.id}
                onClick={() => setFontSize(s.id)}
                className={`p-3 rounded-lg border text-center transition-all ${
                  fontSize === s.id
                    ? 'border-teal-400 bg-teal-500/10'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <span className={`${s.size} font-medium`}>{s.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Save button */}
        <Button
          onClick={handleSave}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white"
          disabled={updateMut.isPending}
        >
          <Check className="w-4 h-4 mr-2" />
          {updateMut.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
