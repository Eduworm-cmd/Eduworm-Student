importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAPxgpKfCJHm2rWeKt2-lzb-9fF7T0UmJo",
  authDomain: "eduworm-db533.firebaseapp.com",
  projectId: "eduworm-db533",
  storageBucket: "eduworm-db533.appspot.com",
  messagingSenderId: "409752336553",
  appId: "1:409752336553:web:249d2ee2b7b725bbee51b8",
  measurementId: "G-GP1QTEJV5R"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[Service Worker] Background FCM received:', payload);

  const notificationTitle = payload.notification?.title || 'Background Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/logo192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
