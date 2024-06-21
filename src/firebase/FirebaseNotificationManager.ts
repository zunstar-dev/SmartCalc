import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './Firebase';
import { NotificationContextType } from '../types/contexts/NotificationMode';

const setupFirebaseMessaging = (
  addNotification: NotificationContextType['addNotification']
) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log(
          'Service Worker registered with scope:',
          registration.scope
        );
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            getToken(messaging, {
              vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
              serviceWorkerRegistration: registration,
            })
              .then((currentToken) => {
                if (currentToken) {
                  console.log('Current token:', currentToken);
                } else {
                  console.log(
                    'No registration token available. Request permission to generate one.'
                  );
                }
              })
              .catch((err: any) => {
                console.error(
                  'An error occurred while retrieving token. ',
                  err
                );
              });
          }
        });
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  }

  const unsubscribe = onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    addNotification({
      title: payload.notification?.title || 'No title',
      body: payload.notification?.body || 'No body',
      image: payload.notification?.image,
      link: payload.fcmOptions?.link, // 사용 가능한 경우 링크 추가
    });
  });

  return unsubscribe;
};

export default setupFirebaseMessaging;
