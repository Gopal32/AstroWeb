import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import app from "@/lib/firebase";

let messaging = null;

export const initMessaging = async () => {
  const supported = await isSupported();
  if (!supported) return null;

  messaging = getMessaging(app);
  return messaging;
};

export const requestForToken = async (registration) => {
  try {
    if (!messaging) return null;

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    return token;
  } catch (err) {
    console.error("Token error:", err);
  }
};

export const onMessageListener = (callback) => {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("🔥 FCM Foreground:", payload);
    callback(payload);
  });
};