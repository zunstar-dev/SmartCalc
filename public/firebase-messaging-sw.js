// public/firebase-messaging-sw.js
importScripts(
  'https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js'
);

const firebaseConfig = {
  apiKey: 'AIzaSyDUBAYTXSi-tJEKRKYRWH7e0k-54kQaQ98',
  authDomain: 'smartcalc-app.firebaseapp.com',
  projectId: 'smartcalc-app',
  storageBucket: 'smartcalc-app.appspot.com',
  messagingSenderId: '981912178568',
  appId: '1:981912178568:web:4cf9c959483d663f9cf43d',
  measurementId: 'G-9KC9VGWR73',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image, // 이미지 추가
    data: { url: payload.fcmOptions.link }, // 링크 추가
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
  const url = event.notification.data.url;
  event.notification.close(); // 알림을 닫습니다
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
