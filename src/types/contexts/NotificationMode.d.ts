// src/types/notification.d.ts
export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (index: number) => void;
}

export interface Notification {
  title: string;
  body: string;
  image?: string;
  link?: string;
}
