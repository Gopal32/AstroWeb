"use client";

import { useEffect } from "react";
import {
  initMessaging,
  requestForToken,
  onMessageListener,
} from "@/lib/firebase-messaging";
import { useSession } from "@/context/SessionProvider";

export default function FCMProvider() {
  const { setSessionToken, handleExit } = useSession();

  useEffect(() => {
    const initFCM = async () => {
      try {
        //  Register SW
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );

        //  Permission
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        //  Init messaging
        await initMessaging();

        //  Get FCM token
        const token = await requestForToken(registration);

        if (token) {
          console.log(" FCM token:", token)
          await fetch("/api/user/fcm-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
        }

        //  LISTEN FCM EVENTS
        onMessageListener((payload) => {
          const type = payload?.data?.notificationType;

          console.log("📩 FCM TYPE:", type);

          //  SESSION READY
          if (type === "sessionReady") {
            const sessionToken = payload?.data?.token;

            console.log("🚀 SESSION TOKEN:", sessionToken);

            setSessionToken(sessionToken);
          }

          //  SESSION CLOSED
          if (type === "sessionCancelled" || type === "sessionEnded") {
            handleExit();
          }
        });
      } catch (err) {
        console.error("FCM error:", err);
      }
    };

    initFCM();
  }, []);

  return null;
}