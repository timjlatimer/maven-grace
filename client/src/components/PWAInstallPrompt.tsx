import { useState, useEffect } from "react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Download, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PWAInstallPrompt() {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user previously dismissed
    try {
      const d = localStorage.getItem("maven-pwa-dismissed");
      if (d) {
        const dismissedAt = parseInt(d, 10);
        // Re-show after 7 days
        if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) {
          setDismissed(true);
          return;
        }
      }
    } catch {}

    // Delay showing the prompt for 30 seconds after first interaction
    const timer = setTimeout(() => {
      if (isInstallable && !isInstalled) {
        setShow(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [isInstallable, isInstalled]);

  if (!show || dismissed || isInstalled || !isInstallable) return null;

  const handleDismiss = () => {
    setDismissed(true);
    setShow(false);
    try {
      localStorage.setItem("maven-pwa-dismissed", Date.now().toString());
    } catch {}
  };

  const handleInstall = async () => {
    const success = await promptInstall();
    if (success) {
      setShow(false);
    }
  };

  return (
    <div className="fixed bottom-16 left-2 right-2 z-50 max-w-sm mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl p-4 shadow-xl shadow-teal-900/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white">Add Grace to Your Home Screen</h3>
            <p className="text-xs text-teal-100 mt-0.5 leading-relaxed">
              Keep Grace one tap away. She'll be right there when you need her.
            </p>
            <button
              onClick={handleInstall}
              className="mt-2 bg-white text-teal-700 text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-teal-50 transition-colors"
            >
              Add to Home Screen
            </button>
          </div>
          <button onClick={handleDismiss} className="text-white/60 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
