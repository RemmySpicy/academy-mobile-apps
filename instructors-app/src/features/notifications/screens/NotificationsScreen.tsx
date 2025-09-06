import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { 
  NotificationList, 
  useTheme 
} from '@academy/mobile-shared';
import type { NotificationItem } from '@academy/mobile-shared';

interface NotificationsScreenProps {}

/**
 * Notifications Screen for Instructors
 * 
 * Features:
 * - Display notifications list with Academy theming
 * - Mark notifications as read/unread
 * - Handle notification interactions
 * - Navigation integration
 */
const NotificationsScreen: React.FC<NotificationsScreenProps> = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const styles = createStyles(theme);

  // Mock notifications data - replace with real data from API
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'New Student Enrolled',
      message: 'Sarah Johnson has enrolled in your Advanced Swimming class. Review her profile and prepare for the first session.',
      timestamp: '2 hours ago',
      isRead: false,
      type: 'info',
      iconName: 'person-add',
    },
    {
      id: '2',
      title: 'Class Schedule Update',
      message: 'Your Tuesday 3:00 PM session has been moved to 3:30 PM due to facility maintenance.',
      timestamp: '4 hours ago',
      isRead: false,
      type: 'update',
      iconName: 'time',
    },
    {
      id: '3',
      title: 'Performance Report Ready',
      message: 'Monthly performance reports for your classes are now available to review.',
      timestamp: '1 day ago',
      isRead: true,
      type: 'info',
      iconName: 'bar-chart',
    },
    {
      id: '4',
      title: 'Attendance Reminder',
      message: 'Please mark attendance for today\'s classes. 3 classes pending attendance submission.',
      timestamp: '2 days ago',
      isRead: true,
      type: 'reminder',
      iconName: 'checkmark-circle',
    },
    {
      id: '5',
      title: 'System Maintenance',
      message: 'The Elitesgen Academy system will undergo maintenance this Sunday from 2:00 AM to 6:00 AM. Plan accordingly.',
      timestamp: '3 days ago',
      isRead: true,
      type: 'alert',
      iconName: 'construct',
    },
  ]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
    
    // TODO: API call to mark as read
    console.log('Marking notification as read:', notificationId);
  };

  const handleMarkAsUnread = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: false }
          : notification
      )
    );
    
    // TODO: API call to mark as unread
    console.log('Marking notification as unread:', notificationId);
  };

  // TODO: Load notifications from API
  useEffect(() => {
    // loadNotifications();
  }, []);

  return (
    <View style={styles.container}>
      <NotificationList
        notifications={notifications}
        onClose={handleBackPress}
        onMarkAsRead={handleMarkAsRead}
        onMarkAsUnread={handleMarkAsUnread}
        title="Notifications"
        showBackButton={true}
      />
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
});

export default NotificationsScreen;