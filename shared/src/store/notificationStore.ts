import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/**
 * Notification types for different alert scenarios
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Individual notification interface
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number; // Auto-dismiss duration in ms, null for persistent
  timestamp: number;
  isVisible: boolean;
  onPress?: () => void;
  actionLabel?: string;
  actionHandler?: () => void;
}

/**
 * Notification store state interface
 */
interface NotificationState {
  notifications: Notification[];
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isVisible'>) => string;
  removeNotification: (id: string) => void;
  hideNotification: (id: string) => void;
  clearAll: () => void;
  
  // Convenience methods
  showSuccess: (message: string, title?: string, duration?: number) => string;
  showError: (message: string, title?: string, duration?: number) => string;
  showWarning: (message: string, title?: string, duration?: number) => string;
  showInfo: (message: string, title?: string, duration?: number) => string;
}

/**
 * Default durations for different notification types (in milliseconds)
 */
const DEFAULT_DURATIONS: Record<NotificationType, number> = {
  success: 4000,
  error: 8000,
  warning: 6000,
  info: 5000,
};

/**
 * Generate unique notification ID
 */
const generateId = (): string => {
  return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Modern Zustand-based notification store
 */
export const useNotificationStore = create<NotificationState>()(
  immer((set, get) => ({
    notifications: [],

    /**
     * Add a new notification to the store
     */
    addNotification: (notification) => {
      const id = generateId();
      const timestamp = Date.now();
      const duration = notification.duration ?? DEFAULT_DURATIONS[notification.type];

      const newNotification: Notification = {
        ...notification,
        id,
        timestamp,
        isVisible: true,
        duration,
      };

      set((state) => {
        state.notifications.push(newNotification);
      });

      // Auto-dismiss if duration is specified
      if (duration > 0) {
        setTimeout(() => {
          get().hideNotification(id);
        }, duration);

        // Remove completely after fade-out animation (additional 300ms)
        setTimeout(() => {
          get().removeNotification(id);
        }, duration + 300);
      }

      return id;
    },

    /**
     * Remove notification completely from store
     */
    removeNotification: (id) => {
      set((state) => {
        state.notifications = state.notifications.filter(
          (notification) => notification.id !== id
        );
      });
    },

    /**
     * Hide notification (for fade-out animation)
     */
    hideNotification: (id) => {
      set((state) => {
        const notification = state.notifications.find(n => n.id === id);
        if (notification) {
          notification.isVisible = false;
        }
      });
    },

    /**
     * Clear all notifications
     */
    clearAll: () => {
      set((state) => {
        state.notifications = [];
      });
    },

    /**
     * Show success notification
     */
    showSuccess: (message, title, duration) => {
      return get().addNotification({
        type: 'success',
        message,
        title,
        duration,
      });
    },

    /**
     * Show error notification
     */
    showError: (message, title = 'Error', duration) => {
      return get().addNotification({
        type: 'error',
        message,
        title,
        duration,
      });
    },

    /**
     * Show warning notification
     */
    showWarning: (message, title = 'Warning', duration) => {
      return get().addNotification({
        type: 'warning',
        message,
        title,
        duration,
      });
    },

    /**
     * Show info notification
     */
    showInfo: (message, title, duration) => {
      return get().addNotification({
        type: 'info',
        message,
        title,
        duration,
      });
    },
  }))
);

/**
 * Notification store selectors for optimized re-renders
 */
export const notificationSelectors = {
  notifications: (state: NotificationState) => state.notifications,
  visibleNotifications: (state: NotificationState) => 
    state.notifications.filter(n => n.isVisible),
  hasNotifications: (state: NotificationState) => state.notifications.length > 0,
  latestNotification: (state: NotificationState) => 
    state.notifications[state.notifications.length - 1],
};

/**
 * Utility hook for easy notification management
 */
export const useNotifications = () => {
  const store = useNotificationStore();
  
  return {
    notifications: store.notifications,
    showSuccess: store.showSuccess,
    showError: store.showError,
    showWarning: store.showWarning,
    showInfo: store.showInfo,
    removeNotification: store.removeNotification,
    hideNotification: store.hideNotification,
    clearAll: store.clearAll,
  };
};

export default useNotificationStore;