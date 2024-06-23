import { onMessage } from 'firebase/messaging';
import { messaging } from './Firebase';
import { NotificationContextType } from '../types/contexts/Notification';

const setupFirebaseMessaging = (
  addNotification: NotificationContextType['addNotification']
) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        // console.log('서비스 워커가 등록되었습니다. 범위:', registration.scope);
      })
      .catch((error) => {
        console.log('서비스 워커 등록에 실패했습니다:', error);
      });
  }

  const unsubscribe = onMessage(messaging, (payload) => {
    console.log('메시지가 도착했습니다.', payload);
    addNotification({
      title: payload.notification?.title || '제목 없음',
      body: payload.notification?.body || '내용 없음',
      image: payload.notification?.image,
      link: payload.fcmOptions?.link, // 사용 가능한 경우 링크 추가
    });
  });

  return unsubscribe;
};

export default setupFirebaseMessaging;
