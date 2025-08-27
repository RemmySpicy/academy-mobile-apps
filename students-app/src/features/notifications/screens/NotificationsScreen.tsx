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
 * Notifications Screen for Students
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
      title: 'Class Reminder',
      message: 'Don\'t forget about your swimming class today at 3:00 PM. Please arrive 10 minutes early.',
      timestamp: '1 hour ago',
      isRead: false,
      type: 'reminder',
      iconName: 'alarm',
    },
    {
      id: '2',
      title: 'Progress Update',
      message: 'Great job! You\'ve completed 80% of your current swimming level. Keep up the excellent work!',
      timestamp: '3 hours ago',
      isRead: false,
      type: 'update',
      iconName: 'trophy',
    },
    {
      id: '3',
      title: 'New Course Available',
      message: 'Advanced Swimming Techniques course is now open for enrollment. Check it out in the Courses section.',
      timestamp: '1 day ago',
      isRead: true,
      type: 'info',
      iconName: 'book',
    },
    {
      id: '4',
      title: 'Schedule Change',
      message: 'Your Monday 4:00 PM class has been rescheduled to 4:30 PM due to instructor availability.',
      timestamp: '2 days ago',
      isRead: true,
      type: 'update',
      iconName: 'time',
    },
    {
      id: '5',
      title: 'Achievement Unlocked',
      message: 'Congratulations! You\'ve earned the "Consistent Learner" badge for attending 10 classes in a row.',
      timestamp: '3 days ago',
      isRead: true,
      type: 'info',
      iconName: 'medal',
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