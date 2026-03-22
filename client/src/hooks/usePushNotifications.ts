import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const { profileId } = useGraceSession();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  const subscribeMutation = trpc.push.subscribe.useMutation();

  useEffect(() => {
    const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);

      // Check if already subscribed
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          setIsSubscribed(!!sub);
        });
      });
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;

    try {
      // Register service worker
      await navigator.serviceWorker.register("/sw.js");
      const reg = await navigator.serviceWorker.ready;

      // Request notification permission
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== "granted") return false;

      // Subscribe to push
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          // VAPID public key — generated server-side
          import.meta.env.VITE_VAPID_PUBLIC_KEY || "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkOs-N0y-qdHe_QSyIoTg8k6iBMpUJnkpoFnLqpDg"
        ),
      });

      const json = sub.toJSON();
      if (profileId && json.endpoint && json.keys?.p256dh && json.keys?.auth) {
        await subscribeMutation.mutateAsync({
          profileId,
          endpoint: json.endpoint,
          p256dh: json.keys.p256dh,
          auth: json.keys.auth,
        });
        setIsSubscribed(true);
        return true;
      }
    } catch (err) {
      console.warn("[Push] Subscription failed:", err);
    }
    return false;
  }, [isSupported, profileId, subscribeMutation]);

  return {
    isSupported,
    isSubscribed,
    permission,
    requestPermission,
  };
}
