// src/context/NotificationContext.tsx
import {
  createContext,
  useContext,
  useState,
  FC,
  PropsWithChildren,
} from 'react';

import {
  NotificationContextType,
  Notification,
} from '../types/contexts/Notification';

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [...prev, notification]);
  };

  const removeNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};
