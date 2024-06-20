// public/firebase-messaging-sw.js

// 서비스 워커 설치 시 특정 파일을 캐시에 저장
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('static-cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/favicon.ico',
        '/manifest.json',
        // 필요한 다른 파일들 추가
      ]);
    })
  );
  self.skipWaiting();
});

// 네트워크 요청이 있을 때 캐시된 파일 제공
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Firebase 메시징 설정
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
    icon: payload.notification.image,
    data: { url: payload.fcmOptions.link },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
  const url = event.notification.data.url;
  event.notification.close();
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
