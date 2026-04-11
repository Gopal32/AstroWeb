importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

//  Use REAL config (same as your firebase.js)
firebase.initializeApp({
  apiKey: "AIzaSyCZajj7PP4CTCJWiftXjdzZPRfRFvJT-HM",
  authDomain: "astroway-e0259.firebaseapp.com",
  projectId: "astroway-e0259",
  storageBucket: "astroway-e0259.firebasestorage.app",
  messagingSenderId: "86631191619",
  appId: "1:86631191619:web:a0ee06b430ba5e673630f6",
});

//  Initialize messaging
const messaging = firebase.messaging();

// ✅ Background message
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message:", payload);

  self.registration.showNotification(
    payload.notification?.title || "New Notification",
    {
      body: payload.notification?.body,
      icon: "/icons/icon-192.png",
      data: payload.data,
    }
  );
});

// ✅ Click handling
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});