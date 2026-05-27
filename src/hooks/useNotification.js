import useNotificationStore from '../store/notificationStore';

export const useNotification = () => {
  const store = useNotificationStore();

  return {
    notifications: store.notifications,
    addNotification: store.addNotification,
    removeNotification: store.removeNotification,
    clearAll: store.clearNotifications,
    success: store.success,
    error: store.error,
    warning: store.warning,
    info: store.info,
  };
};
