import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { apiService } from '../api/apiService';
import Logo from "../assets/IMG_6340-removebg-preview.png"

const firebaseConfig = {
  apiKey: "AIzaSyAPxgpKfCJHm2rWeKt2-lzb-9fF7T0UmJo",
  authDomain: "eduworm-db533.firebaseapp.com",
  projectId: "eduworm-db533",
  storageBucket: "eduworm-db533.appspot.com", 
  messagingSenderId: "409752336553",
  appId: "1:409752336553:web:249d2ee2b7b725bbee51b8",
  measurementId: "G-GP1QTEJV5R"
};

const firebaseApp = initializeApp(firebaseConfig);

let messaging;
const messagingSupport = await isSupported();
if (messagingSupport) {
  messaging = getMessaging(firebaseApp);
}

export { messaging, getToken, onMessage };


export const requestPermission = async (userId) => {
  if (!messagingSupport || !messaging) {
    console.warn('❌ Firebase messaging not supported.');
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'BGtNoSSNnQ7waJbIqM2Qa_otSzocOh2gx6xhtU416zstQRhwRiUIZIDSV70lsolRc8YjvLmJAMnA6lWEI8YS_d0'
      });
      await apiService.post('fcm/save-fcm-token', { userId, fcmToken: token });
    } else {
      console.warn('🚫 Notification permission denied:', permission);
    }
  } catch (error) {
    console.error('🔥 Error getting FCM token:', error);
  }
};

// ✅ Show notification manually if site is open
if (messagingSupport && messaging) {
  onMessage(messaging, (payload) => {
    if (document.visibilityState === 'visible' && Notification.permission === 'granted') {
      const { title, body } = payload.notification;
      new Notification(title, {
        body,
        icon: Logo,
      });
    }
  });
}
