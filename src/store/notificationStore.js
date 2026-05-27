import { create } from 'zustand';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  toasts: [],

  addToast: (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
    return id;
  },

  success: (message) => get().addToast(message, 'success'),
  error: (message) => get().addToast(message, 'error', 5000),
  info: (message) => get().addToast(message, 'info'),
  warning: (message) => get().addToast(message, 'warning', 4000),

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [
        { id: Date.now(), read: false, time: new Date().toISOString(), ...notification },
        ...state.notifications,
      ],
    }));
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  clearNotifications: () => set({ notifications: [] }),
}));

export default useNotificationStore;
