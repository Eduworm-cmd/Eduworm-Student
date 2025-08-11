import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDJKLPANcsO1FoDITnaJ3TX-83-RG48e9g",
  authDomain: "eduworm-14688.firebaseapp.com",
  projectId: "eduworm-14688",
  storageBucket: "eduworm-14688.firebasestorage.app",
  messagingSenderId: "705534579139",
  appId: "1:705534579139:web:7c28b3b9deb5f52cc72d76",
  measurementId: "G-1PS8FYSL7Q"
};

const firebaseApp = initializeApp(firebaseConfig);

// Add support check to avoid "unsupported-browser" error
let messaging;
const messagingSupport = await isSupported();
if (messagingSupport) {
  messaging = getMessaging(firebaseApp);
}

export { messaging, getToken, onMessage };

// Request permission only if supported and messaging is initialized
export const requestPermission = async () => {
  if (!messagingSupport || !messaging) {
    console.warn('Firebase messaging is not supported in this browser.');
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');

      const token = await getToken(messaging, {
        vapidKey: 'BDYM5hClwc4gN92zyA6yrXqShKHLV-DhkanFyvKT2SKCPhq05Au-MHIyI8GrxRTBXjSbCDwzTfDufPYwpw6U4Ag'
      });

      console.log("FCM Token:", token);

      const userId = "687741a970653e04bafe3911";
      await fetch('http://192.168.1.2:4000/api/fcm/save-fcm-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, fcmToken: token })
      });
    } else {
      console.warn('Notification permission denied:', permission);
    }
  } catch (error) {
    console.error('Error getting permission or token:', error);
  }
};
