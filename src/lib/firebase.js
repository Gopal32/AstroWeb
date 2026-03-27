import { initializeApp, getApps, getApp } from "firebase/app";

//  Validate required env variables (only on server start, not browser crash)
const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

if (typeof window === "undefined") {
  const missingVars = requiredEnvVars.filter(
    (key) => !process.env[key]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `❌ Missing Firebase env variables: ${missingVars.join(", ")}`
    );
  }
}

//  Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined,
};

//  Singleton pattern (safe for SSR + HMR)
const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();

export default app;