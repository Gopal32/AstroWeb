"use client";

import { useEffect } from "react";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import app from "@/lib/firebase";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export default function FCMProvider() {
  useEffect(() => {
    const initFCM = async () => {
      try {
        //  Check browser support
        const supported = await isSupported();
        if (!supported) {
          console.warn(" FCM not supported in this browser");
          return;
        }

        // Check service worker
        if (!("serviceWorker" in navigator)) {
          console.warn(" Service worker not supported");
          return;
        }

        //  Register service worker
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );

        //  Ask notification permission
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.warn(" Notification permission denied");
          return;
        }

        // ✅ Get messaging instance
        const messaging = getMessaging(app);

        //  Get token
        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (!token) {
          console.warn(" No FCM token received");
          return;
        }

        //  Send token to backend
        await fetch("/api/user/fcm-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        console.log("✅ FCM token:", token);
      } catch (err) {
        console.error(" FCM error:", err);
      }
    };

    initFCM();
  }, []);

  return null;
}