import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Bell, BellOff, BellRing } from "lucide-react";
import { toast } from "sonner";

export default function PushNotificationToggle() {
  const { isSupported, isSubscribed, permission, requestPermission } = usePushNotifications();

  if (!isSupported) {
    return (
      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
        <BellOff className="w-5 h-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-muted-foreground">Push notifications</p>
          <p className="text-xs text-muted-foreground/70">Not supported in this browser</p>
        </div>
      </div>
    );
  }

  if (isSubscribed) {
    return (
      <div className="flex items-center gap-3 p-3 bg-teal-500/10 rounded-xl border border-teal-500/20">
        <BellRing className="w-5 h-5 text-teal-400" />
        <div>
          <p className="text-sm font-medium text-foreground">Grace can reach you</p>
          <p className="text-xs text-muted-foreground">Kami Moments and check-ins enabled</p>
        </div>
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-xl border border-red-500/20">
        <BellOff className="w-5 h-5 text-red-400" />
        <div>
          <p className="text-sm font-medium text-foreground">Notifications blocked</p>
          <p className="text-xs text-muted-foreground">Enable in your browser settings to let Grace reach you</p>
        </div>
      </div>
    );
  }

  const handleEnable = async () => {
    const success = await requestPermission();
    if (success) {
      toast.success("Grace can reach you now", {
        description: "She'll send gentle check-ins and Kami Moments",
      });
    } else {
      toast.error("Couldn't enable notifications", {
        description: "Try enabling them in your browser settings",
      });
    }
  };

  return (
    <button
      onClick={handleEnable}
      className="flex items-center gap-3 p-3 bg-gradient-to-r from-teal-500/10 to-teal-400/5 rounded-xl border border-teal-500/20 hover:border-teal-500/40 transition-all w-full text-left"
    >
      <Bell className="w-5 h-5 text-teal-400" />
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">Let Grace reach you</p>
        <p className="text-xs text-muted-foreground">Enable gentle check-ins and Kami Moments</p>
      </div>
      <span className="text-xs font-semibold text-teal-400 bg-teal-500/20 px-2 py-0.5 rounded-full">Enable</span>
    </button>
  );
}
