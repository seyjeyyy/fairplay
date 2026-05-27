import React from 'react';
import { useNotification } from '../../hooks/useNotification';
import { renderIcon } from '../common/Icon';
import './Notification.css';

// Individual Notification Component
const Notification = ({ notification }) => {
  const { removeNotification } = useNotification();

  return (
    <div className={`notification notification-${notification.type} animate-slide-in-right`}>
      <div className="notification-icon">{renderIcon(notification.type)}</div>
      <div className="notification-message">{notification.message}</div>
      <button
        className="notification-close"
        onClick={() => removeNotification(notification.id)}
        aria-label="Close notification"
      >
        {renderIcon('close')}
      </button>
    </div>
  );
};

export default Notification;
