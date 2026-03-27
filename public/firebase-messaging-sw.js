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

//  Handle background messages
messaging.onBackgroundMessage(function (payload) {
  console.log("[firebase-messaging-sw.js] Received:", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message",
    icon: "/icons/icon-192.png", // put your icon in /public/icons
    data: {
      url: payload.data?.url || "/", // redirect on click
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

//  Handle notification click
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});