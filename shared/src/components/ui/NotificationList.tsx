import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, createThemedStyles } from '../../theme';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type?: 'reminder' | 'update' | 'alert' | 'info';
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

export interface NotificationListProps {
  notifications?: NotificationItem[];
  onClose?: () => void;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAsUnread?: (notificationId: string) => void;
  title?: string;
  showBackButton?: boolean;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications = [],
  onClose,
  onMarkAsRead,
  onMarkAsUnread,
  title = 'Notifications',
  showBackButton = true,
}) => {
  const { theme } = useTheme();
  const [localNotifications, setLocalNotifications] = useState(notifications);
  
  const styles = useThemedStyles();

  const unreadNotifications = localNotifications.filter(notification => !notification.isRead);
  const readNotifications = localNotifications.filter(notification => notification.isRead);

  const handleToggleReadStatus = (notification: NotificationItem) => {
    const updatedNotifications = localNotifications.map(item =>
      item.id === notification.id
        ? { ...item, isRead: !item.isRead }
        : item
    );
    setLocalNotifications(updatedNotifications);

    if (notification.isRead) {
      onMarkAsUnread?.(notification.id);
    } else {
      onMarkAsRead?.(notification.id);
    }
  };

  const getIconForType = (type: string = 'reminder') => {
    switch (type) {
      case 'alert':
        return { name: 'alert-circle' as const, color: theme.colors.status.error };
      case 'update':
        return { name: 'checkmark-circle' as const, color: theme.colors.status.success };
      case 'info':
        return { name: 'information-circle' as const, color: theme.colors.interactive.primary };
      case 'reminder':
      default:
        return { name: 'notifications' as const, color: '#00DEA5' };
    }
  };

  const renderNotification = (notification: NotificationItem) => {
    const icon = getIconForType(notification.type);
    
    return (
      <View key={notification.id} style={styles.notificationItem}>
        <View style={styles.notificationHeader}>
          <View style={styles.notificationTitleSection}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={notification.iconName || icon.name}
                size={14}
                color={notification.iconColor || icon.color}
              />
            </View>
            <Text style={styles.notificationTitle}>
              {notification.title}
            </Text>
          </View>

          <View style={styles.timestampSection}>
            <Text style={styles.timestamp}>{notification.timestamp}</Text>
            {!notification.isRead && (
              <View style={styles.unreadDot} />
            )}
          </View>
        </View>

        <View style={styles.notificationBody}>
          <Text style={styles.notificationMessage}>
            {notification.message}
          </Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleToggleReadStatus(notification)}
          >
            <Text style={styles.actionButtonText}>
              {notification.isRead ? 'Mark as unread' : 'Mark as read'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderNotificationSection = (sectionTitle: string, notifications: NotificationItem[]) => {
    if (notifications.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
        {notifications.map(renderNotification)}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {showBackButton && (
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderNotificationSection('Unread', unreadNotifications)}
        {renderNotificationSection('Read', readNotifications)}
        
        {localNotifications.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons 
              name="notifications-outline" 
              size={64} 
              color={theme.colors.text.tertiary} 
            />
            <Text style={styles.emptyStateTitle}>No notifications</Text>
            <Text style={styles.emptyStateMessage}>
              You're all caught up! New notifications will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const useThemedStyles = createThemedStyles((theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  backButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.sm,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 32, // Compensate for back button width
  },
  headerTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  section: {
    marginVertical: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.base,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  notificationItem: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  notificationTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    backgroundColor: theme.colors.background.tertiary,
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
  },
  notificationTitle: {
    fontSize: theme.fontSizes.base,
    fontWeight: theme.fontConfig.fontWeight.medium,
    color: theme.colors.text.primary,
    flex: 1,
  },
  timestampSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.xs,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.interactive.primary,
  },
  notificationBody: {
    alignItems: 'flex-end',
  },
  notificationMessage: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.fontSizes.sm * 1.4,
    marginBottom: theme.spacing.md,
    width: '100%',
  },
  actionButton: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  actionButtonText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.interactive.primary,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyStateTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyStateMessage: {
    fontSize: theme.fontSizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
    lineHeight: theme.fontSizes.base * 1.5,
  },
}));

export default NotificationList;