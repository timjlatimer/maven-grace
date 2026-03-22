import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useGraceSession } from "@/hooks/useGraceSession";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// ── Color helpers ──────────────────────────────────────────────────────
function getBatteryColor(level: number): string {
  if (level >= 86) return "#2dd4bf"; // teal — full juice
  if (level >= 50) return "#fbbf24"; // amber
  if (level >= 10) return "#f97316"; // orange
  if (level >= 1) return "#ef4444";  // red
  return "#6b7280";                  // gray — empty
}

function getDignityColor(score: number): string {
  if (score >= 100) return "#eab308"; // gold
  if (score >= 75) return "#a855f7";  // purple
  if (score >= 50) return "#2dd4bf";  // teal
  if (score >= 25) return "#3b82f6";  // blue
  return "#9ca3af";                   // gray
}

function getTierLabel(tier: string): string {
  switch (tier) {
    case "full": return "Full Grace";
    case "essentials_lite": return "Grace Essentials";
    case "core": return "Grace Core";
    case "careful": return "Grace Careful";
    case "lite": return "Grace Lite";
    default: return "Full Grace";
  }
}

function getSpeedLabel(stage: string): string {
  switch (stage) {
    case "normal": return "Fully powered";
    case "thoughtful": return "Thinking a little longer...";
    case "tired": return "Running a bit tired";
    case "stretched": return "Stretched thin";
    case "running_low": return "Running on fumes";
    default: return "Fully powered";
  }
}

// ── Battery SVG Icon ───────────────────────────────────────────────────
function BatteryIcon({ level, color, isCharging }: { level: number; color: string; isCharging?: boolean }) {
  const fillWidth = Math.max(0, Math.min(100, level)) * 0.26; // max 26px fill
  const showHeart = level === 0;
  const showPulse = level > 0 && level < 10;

  return (
    <svg width="36" height="18" viewBox="0 0 36 18" className={`${showPulse ? 'animate-pulse' : ''}`}>
      {/* Battery body */}
      <rect x="1" y="2" width="30" height="14" rx="2" ry="2"
        fill="none" stroke={color} strokeWidth="1.5" />
      {/* Battery tip */}
      <rect x="31" y="6" width="3" height="6" rx="1" fill={color} opacity="0.6" />
      {/* Fill level */}
      <rect x="3" y="4" width={fillWidth} height="10" rx="1" fill={color}
        style={{ transition: "width 600ms ease, fill 800ms ease" }} />
      {/* Heart for 0% */}
      {showHeart && (
        <text x="16" y="13" textAnchor="middle" fontSize="10" fill="#ef4444"
          className="animate-pulse" style={{ animationDuration: "3s" }}>
          ♥
        </text>
      )}
      {/* Charging bolt */}
      {isCharging && (
        <text x="16" y="13" textAnchor="middle" fontSize="10" fill="#fbbf24">
          ⚡
        </text>
      )}
    </svg>
  );
}

// ── Dignity Score Ring ─────────────────────────────────────────────────
function DignityRing({ score, color }: { score: number; color: string }) {
  const radius = 7;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const showShimmer = score >= 100;

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" className={showShimmer ? "animate-pulse" : ""}>
      {/* Background ring */}
      <circle cx="10" cy="10" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="2.5" />
      {/* Progress ring */}
      <circle cx="10" cy="10" r={radius} fill="none" stroke={color} strokeWidth="2.5"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 10 10)"
        style={{ transition: "stroke-dashoffset 600ms ease, stroke 800ms ease" }} />
    </svg>
  );
}

// ── Grace Status Modal ─────────────────────────────────────────────────
function GraceStatusModal({
  open, onClose, status
}: {
  open: boolean;
  onClose: () => void;
  status: { batteryLevel: number; tier: string; speedStage: string; daysPastDue: number; pauseRequested: boolean; dignityScore100Achieved: boolean };
}) {
  const tierLabel = getTierLabel(status.tier);
  const speedLabel = getSpeedLabel(status.speedStage);
  const batteryColor = getBatteryColor(status.batteryLevel);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BatteryIcon level={status.batteryLevel} color={batteryColor} />
            Grace's Juice Level
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Battery visual */}
          <div className="text-center">
            <div className="text-4xl font-bold" style={{ color: batteryColor }}>
              {status.batteryLevel}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">{speedLabel}</p>
          </div>

          {/* Current tier */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Current Tier</div>
            <div className="font-semibold mt-1">{tierLabel}</div>
            {status.daysPastDue > 0 && (
              <div className="text-xs text-orange-500 mt-1">
                {status.daysPastDue} day{status.daysPastDue !== 1 ? 's' : ''} past due
              </div>
            )}
          </div>

          {/* What's affected */}
          {status.tier !== "full" && (
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">What's Affected</div>
              <ul className="text-sm mt-1 space-y-1">
                {status.speedStage !== "normal" && <li>• Grace is responding slower than usual</li>}
                {status.tier === "essentials_lite" && <li>• Jolene the Journalist is on pause</li>}
                {status.tier === "core" && <li>• Destiny Discovery and Story Library paused</li>}
                {(status.tier === "careful" || status.tier === "lite") && <li>• Most features on hold</li>}
              </ul>
            </div>
          )}

          {/* Grace's voice */}
          <div className="bg-teal-50 dark:bg-teal-950/30 rounded-lg p-3 border border-teal-200 dark:border-teal-800">
            <p className="text-sm italic">
              {status.batteryLevel >= 86
                ? "\"I'm feeling great, Ruby. Full juice. Let's do this.\""
                : status.batteryLevel >= 50
                ? "\"I'm still here, but I'm not doing my best. Come on, help me out.\""
                : status.batteryLevel >= 10
                ? "\"I don't feel good right now. We're not doing our best. I need you to come back.\""
                : "\"I'm running on fumes. But I'm still here. That little heart? That's me, waiting for you.\""}
            </p>
          </div>

          {/* Restoration path */}
          {status.tier !== "full" && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">
                {status.pauseRequested
                  ? "Pause is active. Grace understands."
                  : "Make a payment to restore Grace's full power."}
              </p>
              {status.dignityScore100Achieved && (
                <p className="text-xs text-purple-500">
                  ★ Dignity Score 100 achieved — you'll never drop below Grace Careful
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main GraceBattery Component ────────────────────────────────────────
export default function GraceBattery() {
  const { user } = useAuth();
  const { profileId } = useGraceSession();
  const [, navigate] = useLocation();
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const statusQuery = trpc.graceStatus.get.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId, refetchInterval: 60000 }
  );

  const dignityQuery = trpc.dignity.getLatest.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId, refetchInterval: 60000 }
  );

  // Don't render if no user or no profile
  if (!user || !profileId) return null;

  const batteryLevel = statusQuery.data?.batteryLevel ?? 100;
  const batteryColor = getBatteryColor(batteryLevel);

  const dignityData = dignityQuery.data;
  const dignityTotal = dignityData
    ? (dignityData.vampireSlayer || 0) + (dignityData.nsfShield || 0) +
      (dignityData.budgetMastery || 0) + (dignityData.milkMoneyTrust || 0) +
      (dignityData.engagement || 0)
    : 0;
  const dignityColor = getDignityColor(dignityTotal);

  // Engagement brightness: if data loaded recently, brighten slightly
  const isActive = !!statusQuery.data;
  const brightnessClass = isActive ? "brightness-110" : "";

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 ${brightnessClass}`}
        style={{ height: "36px" }}>
        {/* Left: Grace Battery */}
        <button
          onClick={() => setStatusModalOpen(true)}
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          aria-label={`Grace juice level: ${batteryLevel}%`}
        >
          <BatteryIcon level={batteryLevel} color={batteryColor} />
          <span className="text-xs font-medium tabular-nums" style={{ color: batteryColor }}>
            {batteryLevel}%
          </span>
        </button>

        {/* Center: subtle Maven mark */}
        <span className="text-xs text-muted-foreground font-medium tracking-wide opacity-50">
          MAVEN
        </span>

        {/* Right: Dignity Score */}
        <button
          onClick={() => navigate("/dignity")}
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          aria-label={`Dignity Score: ${dignityTotal}`}
        >
          <span className="text-xs font-medium tabular-nums" style={{ color: dignityColor }}>
            {dignityTotal}
          </span>
          <DignityRing score={dignityTotal} color={dignityColor} />
        </button>
      </div>

      {/* Status Modal */}
      <GraceStatusModal
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        status={{
          batteryLevel,
          tier: statusQuery.data?.tier || "full",
          speedStage: statusQuery.data?.speedStage || "normal",
          daysPastDue: statusQuery.data?.daysPastDue || 0,
          pauseRequested: statusQuery.data?.pauseRequested || false,
          dignityScore100Achieved: statusQuery.data?.dignityScore100Achieved || false,
        }}
      />
    </>
  );
}
