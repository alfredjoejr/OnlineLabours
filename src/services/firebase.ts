/**
 * Firebase Cloud Messaging Service
 * Gracefully no-ops when Firebase keys are not configured.
 */

// Dynamic import to avoid bundling firebase if not used
let firebaseApp: any = null;
let messaging: any = null;
let initialized = false;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

/**
 * Check if Firebase is configured (all required keys are present)
 */
export function isFirebaseConfigured(): boolean {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
}

/**
 * Initialize Firebase app and messaging.
 * Returns true if successful, false if keys are missing or initialization fails.
 */
export async function initializeFirebase(): Promise<boolean> {
  if (initialized) return !!messaging;
  if (!isFirebaseConfigured()) {
    console.info('[Firebase] Not configured — push notifications disabled. Add VITE_FIREBASE_* keys to .env to enable.');
    initialized = true;
    return false;
  }

  try {
    const { initializeApp } = await import('firebase/app');
    const { getMessaging, isSupported } = await import('firebase/messaging');

    const supported = await isSupported();
    if (!supported) {
      console.warn('[Firebase] Messaging is not supported in this browser.');
      initialized = true;
      return false;
    }

    firebaseApp = initializeApp(firebaseConfig);
    messaging = getMessaging(firebaseApp);
    initialized = true;
    console.info('[Firebase] Initialized successfully.');
    return true;
  } catch (error) {
    console.error('[Firebase] Initialization failed:', error);
    initialized = true;
    return false;
  }
}

/**
 * Request notification permission and get the FCM token.
 * Returns the token string, or null if not available.
 */
export async function requestNotificationPermission(): Promise<string | null> {
  const ready = await initializeFirebase();
  if (!ready || !messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.info('[Firebase] Notification permission denied.');
      return null;
    }

    const { getToken } = await import('firebase/messaging');
    const token = await getToken(messaging, { vapidKey });
    console.info('[Firebase] FCM Token obtained.');
    return token;
  } catch (error) {
    console.error('[Firebase] Failed to get FCM token:', error);
    return null;
  }
}

/**
 * Listen for foreground messages.
 * Calls the callback with the payload when a message is received while the app is open.
 */
export async function onForegroundMessage(callback: (payload: any) => void): Promise<() => void> {
  const ready = await initializeFirebase();
  if (!ready || !messaging) return () => {};

  try {
    const { onMessage } = await import('firebase/messaging');
    const unsubscribe = onMessage(messaging, (payload) => {
      console.info('[Firebase] Foreground message received:', payload);
      callback(payload);
    });
    return unsubscribe;
  } catch (error) {
    console.error('[Firebase] Failed to set up foreground listener:', error);
    return () => {};
  }
}

/**
 * Save FCM token to the backend.
 */
export async function saveFcmTokenToBackend(fcmToken: string): Promise<void> {
  const authToken = localStorage.getItem('tasklink_token');
  if (!authToken) return;

  try {
    await fetch('http://tasklink.test/api/user/fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ fcm_token: fcmToken }),
    });
  } catch (error) {
    console.error('[Firebase] Failed to save FCM token to backend:', error);
  }
}
