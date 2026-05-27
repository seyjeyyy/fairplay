import React from 'react';
import { useNotification } from '../../hooks/useNotification';
import Notification from './Notification';
import './NotificationContainer.css';

// Notification Container Component
const NotificationContainer = () => {
  const { notifications } = useNotification();

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationContainer;
