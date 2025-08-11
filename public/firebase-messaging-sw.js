// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDJKLPANcsO1FoDITnaJ3TX-83-RG48e9g",
  authDomain: "eduworm-14688.firebaseapp.com",
  projectId: "eduworm-14688",
  storageBucket: "eduworm-14688.appspot.com",
  messagingSenderId: "705534579139",
  appId: "1:705534579139:web:7c28b3b9deb5f52cc72d76",
  measurementId: "G-1PS8FYSL7Q"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
