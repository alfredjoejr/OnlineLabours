// Firebase Messaging Service Worker
// This runs in the background to handle push notifications when the app is not in focus.

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
// These values must match your Firebase config — they're injected at build time or hardcoded.
// Since service workers can't use import.meta.env, we check for self.__FIREBASE_CONFIG or use empty defaults.
const firebaseConfig = self.__FIREBASE_CONFIG || {
  apiKey: 'AIzaSyAt68htGOkHj5gmiGUWb9P69jELwgl4Isg',
  authDomain: 'tasklink-23df7.firebaseapp.com',
  projectId: 'tasklink-23df7',
  storageBucket: 'tasklink-23df7.firebasestorage.app',
  messagingSenderId: '312596416959',
  appId: '1:312596416959:web:eea4ccafd975844d3e390a',
};

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  // Handle background messages
  messaging.onBackgroundMessage((payload) => {
    console.log('[SW] Background message received:', payload);

    const notificationTitle = payload.notification?.title || 'TaskLink';
    const notificationOptions = {
      body: payload.notification?.body || 'You have a new notification.',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: payload.data || {},
      tag: 'tasklink-notification',
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });

  // Handle notification click
  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        if (clientList.length > 0) {
          clientList[0].focus();
        } else {
          clients.openWindow('/');
        }
      })
    );
  });
} else {
  console.info('[SW] Firebase not configured — background push disabled.');
}
