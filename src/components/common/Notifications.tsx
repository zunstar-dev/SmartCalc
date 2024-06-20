// src/components/common/Notifications.tsx
import { Snackbar, Alert } from '@mui/material';
import { useNotification } from '../../context/NotificationContext';
import { FC } from 'react';

const Notifications: FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <>
      {notifications.map((notification, index) => (
        <Snackbar
          key={index}
          open={true}
          autoHideDuration={null} // 자동으로 닫히지 않도록 설정
        >
          <Alert
            onClose={() => removeNotification(index)}
            severity="info"
            sx={{ width: '100%' }}
          >
            <strong>{notification.title}</strong>: {notification.body}
            {notification.image && (
              <img
                src={notification.image}
                alt="Notification"
                style={{ width: '100%', marginTop: '10px' }}
              />
            )}
            {notification.link && (
              <a
                href={notification.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  marginTop: '10px',
                  color: 'inherit',
                }}
              >
                더보기
              </a>
            )}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default Notifications;
