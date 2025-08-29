# Notification System

The Academy Mobile Apps feature a comprehensive notification system built with Zustand that provides user feedback for API operations, form validations, and general application events.

## 🎯 Overview

The notification system provides:
- **Multiple Notification Types** - Success, error, warning, and info notifications
- **Unread Count Management** - Centralized tracking of unread notification badges
- **Automatic API Integration** - Notifications triggered by API responses
- **Customizable Duration** - Different auto-dismiss times per notification type
- **Action Support** - Optional action buttons with custom handlers
- **Accessibility** - Screen reader support and proper ARIA attributes
- **Performance Optimized** - Efficient rendering with Zustand selectors

## 🏗️ Architecture

### Notification Flow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Client    │───▶│ Notification    │───▶│  Notification   │
│                 │    │     Store       │    │   Component     │
│ - Success       │    │                 │    │                 │
│ - Error         │    │ - Add/Remove    │    │ - Toast/Modal   │
│ - Network       │    │ - Auto-dismiss  │    │ - Animations    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Store Structure
```typescript
interface NotificationState {
  notifications: Notification[];
  unreadCount: number; // Count of unread notifications in the notification center/inbox
  
  // Toast Notification Actions
  addNotification: (notification) => string;
  removeNotification: (id: string) => void;
  hideNotification: (id: string) => void;
  clearAll: () => void;
  
  // Unread Count Management
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  decrementUnreadCount: () => void;
  clearUnreadCount: () => void;
  
  // Convenience Methods
  showSuccess: (message: string, title?: string) => string;
  showError: (message: string, title?: string) => string;
  showWarning: (message: string, title?: string) => string;
  showInfo: (message: string, title?: string) => string;
}
```

## 🚀 Basic Usage

### Simple Notifications

```typescript
import { useNotifications } from '@academy/mobile-shared';

function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo, unreadCount } = useNotifications();
  
  const handleSave = async () => {
    try {
      await saveData();
      showSuccess('Data saved successfully!');
    } catch (error) {
      showError('Failed to save data. Please try again.');
    }
  };
  
  const handleWarning = () => {
    showWarning('This action cannot be undone');
  };
  
  const handleInfo = () => {
    showInfo('New features are available in settings');
  };
  
  return (
    <View>
      <Button title="Save" onPress={handleSave} />
      <Button title="Delete" onPress={handleWarning} />
      <Button title="Info" onPress={handleInfo} />
    </View>
  );
}
```

### Unread Count Management

The notification store now includes centralized unread count management for header badges:

```typescript
import { useNotifications } from '@academy/mobile-shared';

function HeaderWithNotifications() {
  const { unreadCount, clearUnreadCount, setUnreadCount, incrementUnreadCount } = useNotifications();
  
  const handleNotificationPress = () => {
    clearUnreadCount(); // Clear badge when user opens notifications
    navigation.navigate('Notifications');
  };
  
  // Use unread count in header
  return (
    <Header
      title="Dashboard" 
      showNotifications={true}
      onNotificationPress={handleNotificationPress}
      notificationCount={unreadCount} // Uses shared count
      showProfile={false}
    />
  );
}

// Update count when new notifications arrive
const handleNewNotification = () => {
  incrementUnreadCount(); // Increment badge count
  showInfo('You have a new message'); // Show toast
};

// Set specific count (e.g., from API)
const syncNotificationCount = async () => {
  const response = await apiClient.get('/notifications/unread-count');
  setUnreadCount(response.data.count);
};
```

### Advanced Notifications

```typescript
import { useNotificationStore } from '@academy/mobile-shared';

function AdvancedNotifications() {
  const { addNotification } = useNotificationStore();
  
  const showCustomNotification = () => {
    const id = addNotification({
      type: 'warning',
      title: 'Confirm Action',
      message: 'Are you sure you want to delete this item?',
      duration: 0, // Don't auto-dismiss
      actionLabel: 'Delete',
      actionHandler: () => {
        handleDelete();
        removeNotification(id);
      },
      onPress: () => {
        console.log('Notification pressed');
      }
    });
  };
  
  return (
    <Button title="Show Custom" onPress={showCustomNotification} />
  );
}
```

## 📋 Notification Types

### Success Notifications

```typescript
// Basic success
showSuccess('Operation completed successfully');

// Success with title
showSuccess('Your profile has been updated', 'Success');

// Success with custom duration (5 seconds)
showSuccess('Changes saved', 'Success', 5000);
```

### Error Notifications

```typescript
// Basic error
showError('Something went wrong');

// Error with title
showError('Unable to connect to server', 'Connection Error');

// Error with longer duration (10 seconds)
showError('Please check your internet connection', 'Network Error', 10000);
```

### Warning Notifications

```typescript
// Basic warning
showWarning('This action cannot be undone');

// Warning with title
showWarning('You have unsaved changes', 'Warning');

// Persistent warning (no auto-dismiss)
showWarning('Low storage space', 'Storage Warning', 0);
```

### Info Notifications

```typescript
// Basic info
showInfo('New update available');

// Info with title
showInfo('Version 2.0 includes new features', 'App Update');

// Info with custom duration
showInfo('Welcome to the new interface', 'Welcome', 3000);
```

## 🎨 Notification Configuration

### Default Durations

```typescript
const DEFAULT_DURATIONS = {
  success: 4000,  // 4 seconds
  error: 8000,    // 8 seconds
  warning: 6000,  // 6 seconds
  info: 5000      // 5 seconds
};
```

### Custom Configuration

```typescript
// Custom notification with all options
const customNotification = {
  type: 'success' as NotificationType,
  title: 'Upload Complete',
  message: 'Your files have been uploaded successfully',
  duration: 6000,
  actionLabel: 'View Files',
  actionHandler: () => navigateToFiles(),
  onPress: () => console.log('Notification tapped'),
};

addNotification(customNotification);
```

## 🔧 Integration with API Client

### Automatic API Notifications

```typescript
// The API client automatically shows notifications
try {
  await apiClient.post('/students', studentData);
  // Success notification shown automatically: "Student created successfully"
} catch (error) {
  // Error notification shown automatically based on error type
  // Network error: "Unable to connect. Please check your internet."
  // Validation error: "Please check the form fields and try again."
  // Server error: "Something went wrong. Please try again later."
}
```

### Customizing API Notifications

```typescript
// Override automatic notifications
await apiClient.post('/students', studentData, {
  notifications: {
    success: 'New student added to your program',
    error: 'Failed to add student. Please verify the information.'
  }
});

// Disable automatic notifications
await apiClient.get('/data', {
  silentErrors: true,
  silentSuccess: true
});
```

### Error-Specific Notifications

```typescript
// Different messages for different error types
try {
  await apiClient.post('/enrollment', enrollmentData);
} catch (error) {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        showError('Please check the enrollment information');
        break;
      case 403:
        showError('You do not have permission to enroll students');
        break;
      case 409:
        showWarning('Student is already enrolled in this course');
        break;
      default:
        showError('Enrollment failed. Please try again.');
    }
  } else {
    showError('Network error. Please check your connection.');
  }
}
```

## 🎭 Notification Components

### Toast Notifications (Default)

```typescript
// Appears at the top of the screen
// Auto-dismisses after configured duration
// Can be swiped to dismiss
showSuccess('Operation completed');
```

### Modal Notifications

```typescript
// For critical messages that require acknowledgment
addNotification({
  type: 'error',
  title: 'Critical Error',
  message: 'Unable to save changes. Data may be lost.',
  modal: true, // Show as modal instead of toast
  duration: 0, // Don't auto-dismiss
  actionLabel: 'Retry',
  actionHandler: () => retrySave()
});
```

### In-Line Notifications

```typescript
// For form-specific feedback
function FormWithNotifications() {
  const [showFormError, setShowFormError] = useState(false);
  
  return (
    <View>
      <CustomInput name="email" control={control} />
      
      {showFormError && (
        <InlineNotification
          type="error"
          message="Please enter a valid email address"
          onDismiss={() => setShowFormError(false)}
        />
      )}
      
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}
```

## ♿ Accessibility

### Screen Reader Support

```typescript
// Notifications are automatically announced to screen readers
showSuccess('Profile updated'); // Announced: "Success: Profile updated"
showError('Invalid email'); // Announced: "Error: Invalid email"

// Custom accessibility labels
addNotification({
  type: 'info',
  message: 'New message received',
  accessibilityLabel: 'Information: You have received a new message',
  accessibilityHint: 'Double tap to view message'
});
```

### Focus Management

```typescript
// Important notifications can steal focus for accessibility
addNotification({
  type: 'error',
  title: 'Payment Failed',
  message: 'Your payment could not be processed',
  stealFocus: true, // For critical notifications
  modal: true
});
```

## 🎨 Custom Styling

### Theme Integration

```typescript
// Notifications automatically use theme colors
const theme = {
  colors: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6'
  }
};

// Custom notification styles
addNotification({
  type: 'success',
  message: 'Custom styled notification',
  style: {
    backgroundColor: theme.colors.success,
    borderRadius: 12,
    padding: 16
  }
});
```

### Animation Customization

```typescript
// Custom entrance/exit animations
addNotification({
  type: 'info',
  message: 'Animated notification',
  animation: {
    entrance: 'slideInDown',
    exit: 'slideOutUp',
    duration: 300
  }
});
```

## 📱 Platform-Specific Behavior

### iOS Specific

```typescript
// Use iOS-style alerts for critical notifications
import { Alert } from 'react-native';

const showIOSAlert = (title: string, message: string) => {
  if (Platform.OS === 'ios') {
    Alert.alert(title, message, [
      { text: 'OK', style: 'default' }
    ]);
  } else {
    showError(message, title);
  }
};
```

### Android Specific

```typescript
// Use Android toast for simple notifications
import { ToastAndroid } from 'react-native';

const showAndroidToast = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    showInfo(message);
  }
};
```

## 🧪 Testing

### Unit Tests

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useNotifications } from '@shared';

describe('Notification System', () => {
  it('should add and remove notifications', () => {
    const { result } = renderHook(() => useNotifications());
    
    act(() => {
      const id = result.current.showSuccess('Test message');
      expect(result.current.notifications).toHaveLength(1);
      
      result.current.removeNotification(id);
      expect(result.current.notifications).toHaveLength(0);
    });
  });
  
  it('should auto-dismiss notifications', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useNotifications());
    
    act(() => {
      result.current.showSuccess('Auto dismiss test', undefined, 1000);
    });
    
    expect(result.current.notifications).toHaveLength(1);
    
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    
    expect(result.current.notifications).toHaveLength(0);
    
    jest.useRealTimers();
  });
});
```

### Integration Tests

```typescript
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { apiClient } from '@shared';

test('shows error notification on API failure', async () => {
  // Mock API failure
  jest.spyOn(apiClient, 'post').mockRejectedValue(
    new ApiError(400, 'Validation failed')
  );
  
  const { getByText } = render(<CreateStudentForm />);
  
  fireEvent.press(getByText('Create Student'));
  
  await waitFor(() => {
    expect(getByText('Validation failed')).toBeTruthy();
  });
});
```

## 🔄 Migration from Redux Alerts

### Old Redux Pattern

```typescript
// Old Redux alert system
import { useAppDispatch } from '../redux/store';
import { setAlert } from '../redux/utils';

const dispatch = useAppDispatch();

const handleError = (error) => {
  dispatch(setAlert({
    msg: error.message,
    type: 'error'
  }));
};
```

### New Notification Pattern

```typescript
// New Zustand notification system
import { useNotifications } from '@shared';

const { showError } = useNotifications();

const handleError = (error) => {
  showError(error.message);
};
```

## 🚀 Advanced Features

### Notification Queue Management

```typescript
// Limit concurrent notifications
const { notifications } = useNotificationStore();

const addQueuedNotification = (notification) => {
  if (notifications.length >= 3) {
    // Remove oldest notification to make room
    removeNotification(notifications[0].id);
  }
  addNotification(notification);
};
```

### Persistent Notifications

```typescript
// Store important notifications in AsyncStorage
const addPersistentNotification = async (notification) => {
  const id = addNotification({
    ...notification,
    persistent: true,
    duration: 0 // Don't auto-dismiss
  });
  
  // Save to storage for app restart
  await AsyncStorage.setItem(`notification_${id}`, JSON.stringify(notification));
};

// Restore on app launch
const restorePersistentNotifications = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const notificationKeys = keys.filter(key => key.startsWith('notification_'));
  
  for (const key of notificationKeys) {
    const notification = JSON.parse(await AsyncStorage.getItem(key));
    addNotification(notification);
  }
};
```

### Notification Analytics

```typescript
// Track notification interactions
const trackNotificationAction = (notificationId, action) => {
  analytics.track('notification_action', {
    notification_id: notificationId,
    action: action, // 'viewed', 'dismissed', 'action_pressed'
    timestamp: new Date().toISOString()
  });
};

// Enhanced notification with tracking
addNotification({
  type: 'info',
  message: 'New feature available',
  onPress: () => trackNotificationAction(id, 'viewed'),
  actionHandler: () => {
    trackNotificationAction(id, 'action_pressed');
    navigateToFeature();
  }
});
```

## 📊 Performance Considerations

### Selective Subscriptions

```typescript
import { notificationSelectors } from '@academy/mobile-shared';

// Subscribe to specific notification data only
const visibleNotifications = useNotificationStore(
  notificationSelectors.visibleNotifications
);

const hasNotifications = useNotificationStore(
  notificationSelectors.hasNotifications
);

// Subscribe to unread count only (optimal for header badges)
const unreadCount = useNotificationStore(
  notificationSelectors.unreadCount
);

const hasUnreadNotifications = useNotificationStore(
  notificationSelectors.hasUnreadNotifications
);

// Avoid full store subscription
const { notifications } = useNotificationStore(); // ❌ Causes re-renders
```

### Memory Management

```typescript
// Automatic cleanup of old notifications
useEffect(() => {
  const cleanup = setInterval(() => {
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
    notifications
      .filter(n => n.timestamp < cutoff)
      .forEach(n => removeNotification(n.id));
  }, 60 * 60 * 1000); // Run every hour
  
  return () => clearInterval(cleanup);
}, []);
```

The notification system provides a comprehensive, accessible, and performant solution for user feedback throughout the Academy Mobile Apps, with seamless integration to API operations and form validations.

---

# 🔔 Notifications Page Feature

In addition to toast notifications, both Academy apps feature a dedicated **Notifications Page** that provides a centralized view of all user notifications, including app-specific notifications, system updates, and important announcements.

## 🎯 Overview

The Notifications Page feature provides:
- **Centralized Notification Management** - View all notifications in one place
- **Read/Unread Status Tracking** - Mark notifications as read or unread
- **Contextual Notifications** - Different notification content for instructors vs students
- **Modal Navigation** - Accessed via notification bell icons throughout the app
- **Academy Theming** - Consistent design with the Academy Design System

## 🏗️ Architecture

### Feature Structure
```
features/notifications/
├── navigation/
│   └── NotificationsNavigator.tsx    # Stack navigator for notifications
├── screens/
│   └── NotificationsScreen.tsx       # Main notifications screen
└── index.ts                          # Feature exports
```

### Navigation Integration
```typescript
// Main Stack includes notifications as modal
<Stack.Navigator>
  <Stack.Screen name="Tabs" component={TabNavigator} />
  <Stack.Screen 
    name="Notifications" 
    component={NotificationsNavigator}
    options={{
      presentation: 'modal',
      animation: 'slide_from_bottom',
    }}
  />
</Stack.Navigator>
```

## 📱 User Interface

### Notification Bell Integration
The notification bell icon is integrated into all main screen headers using the centralized unread count:

```typescript
import { useNotifications } from '@academy/mobile-shared';

function DashboardScreen() {
  const { unreadCount, clearUnreadCount } = useNotifications();
  
  const handleNotifications = () => {
    clearUnreadCount(); // Clear badge when opening notifications
    navigation.navigate('Notifications');
  };

  return (
    <Header
      title="Dashboard"
      showProgramSwitcher={true}
      showNotifications={true}
      onNotificationPress={handleNotifications}
      notificationCount={unreadCount} // Uses centralized count
      showProfile={false}
      variant="instructor"
    />
  );
}
```

### Screen Headers with Notifications
All main screens in both apps include notification bells:

**Instructor App:**
- Dashboard (`HomeScreen`)
- Students (`StudentsScreen`)
- Attendance (`AttendanceScreen`)
- Performance (`PerformanceScreen`)
- Classroom (`ClassroomScreen`)

**Student App:**
- Home (`HomeScreen`)
- Courses (`CoursesScreen`)
- Bookings (`BookingsScreen`)
- Progress (`ProgressScreen`)
- Menu (`AppMenuScreen`)

## 🔧 Implementation Details

### NotificationsScreen Component

```typescript
interface NotificationsScreenProps {}

const NotificationsScreen: React.FC<NotificationsScreenProps> = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleMarkAsRead = (notificationId: string) => {
    // Update notification status
    // TODO: API call to mark as read
  };

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
```

### Navigation Handler Pattern

```typescript
import { useNotifications } from '@academy/mobile-shared';

const handleNotifications = () => {
  const { clearUnreadCount } = useNotifications();
  
  console.log('Notifications pressed');
  clearUnreadCount(); // Clear badge using centralized store
  navigation.navigate('Notifications'); // Navigate to modal
};
```

## 📋 Notification Content

### Instructor App Notifications
```typescript
const instructorNotifications = [
  {
    id: '1',
    title: 'New Student Enrolled',
    message: 'Sarah Johnson has enrolled in your Advanced Swimming class.',
    timestamp: '2 hours ago',
    isRead: false,
    type: 'info',
    iconName: 'person-add',
  },
  {
    id: '2',
    title: 'Class Schedule Update',
    message: 'Your Tuesday 3:00 PM session has been moved to 3:30 PM.',
    timestamp: '4 hours ago',
    isRead: false,
    type: 'update',
    iconName: 'time',
  },
  {
    id: '3',
    title: 'Performance Report Ready',
    message: 'Monthly performance reports are now available to review.',
    timestamp: '1 day ago',
    isRead: true,
    type: 'info',
    iconName: 'bar-chart',
  }
];
```

### Student App Notifications
```typescript
const studentNotifications = [
  {
    id: '1',
    title: 'Class Reminder',
    message: 'Don\'t forget about your swimming class today at 3:00 PM.',
    timestamp: '1 hour ago',
    isRead: false,
    type: 'reminder',
    iconName: 'alarm',
  },
  {
    id: '2',
    title: 'Progress Update',
    message: 'Great job! You\'ve completed 80% of your current level.',
    timestamp: '3 hours ago',
    isRead: false,
    type: 'update',
    iconName: 'trophy',
  },
  {
    id: '3',
    title: 'Achievement Unlocked',
    message: 'You\'ve earned the "Consistent Learner" badge.',
    timestamp: '3 days ago',
    isRead: true,
    type: 'info',
    iconName: 'medal',
  }
];
```

## 🎨 Design System Integration

### Academy Theme Usage
The notifications page uses exact Academy theme variables:

```typescript
const styles = createStyles(theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  // Automatically uses Academy purple and theme colors
});
```

### NotificationList Component
Utilizes the shared `NotificationList` component from `@academy/mobile-shared`:

- **Academy Purple** (`theme.colors.interactive.primary`) for unread indicators
- **Consistent spacing** with `theme.spacing.*` values
- **Typography** following Academy font system
- **Icons** using Ionicons with proper theming

## 🚀 Navigation Flow

### User Journey
1. **User sees notification bell** with badge count on any main screen
2. **Taps notification bell** icon in header
3. **Modal slides up** with notification list
4. **User can:**
   - View all notifications (unread first, then read)
   - Mark individual notifications as read/unread
   - Navigate back with back button or gesture
5. **Badge count updates** when notifications are marked as read

### Modal Presentation
- **Animation**: `slide_from_bottom` for natural mobile UX
- **Presentation**: `modal` for full-screen overlay
- **Gesture Support**: Supports swipe-to-dismiss on iOS

## 🔧 Future Enhancements

### API Integration
```typescript
// TODO: Replace mock data with real API calls
const loadNotifications = async () => {
  try {
    const response = await apiClient.get('/notifications');
    setNotifications(response.data);
  } catch (error) {
    console.error('Failed to load notifications:', error);
  }
};

const markAsRead = async (notificationId: string) => {
  try {
    await apiClient.patch(`/notifications/${notificationId}/read`);
    // Update local state
  } catch (error) {
    console.error('Failed to mark as read:', error);
  }
};
```

### Push Notification Integration
```typescript
// Integration with React Native Push Notifications
import PushNotification from 'react-native-push-notification';

const handlePushNotification = (notification) => {
  // Add to notification list
  addNotification({
    title: notification.title,
    message: notification.message,
    type: 'info',
    isRead: false,
    timestamp: new Date().toISOString(),
  });
};
```

### Real-time Updates
```typescript
import { useNotifications } from '@academy/mobile-shared';

// WebSocket integration for real-time notifications
function useRealTimeNotifications() {
  const { incrementUnreadCount } = useNotifications();
  
  useEffect(() => {
    const socket = io(API_BASE_URL);
    
    socket.on('new_notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      // Update badge count using centralized store
      incrementUnreadCount();
    });
    
    return () => socket.disconnect();
  }, [incrementUnreadCount]);
}
```

The Notifications Page feature provides a complete notification management experience that integrates seamlessly with the existing Academy Mobile Apps architecture and design system.

---

## 🔄 Recent Updates

### Centralized Unread Count Management
The notification system now includes centralized unread count management:

- **Unified Badge System**: All headers use the same `unreadCount` from the notification store
- **Consistent State Management**: No more hardcoded notification counts across different screens
- **App Menu Header Update**: Menu pages now show notification icons instead of profile icons
- **Real-time Synchronization**: Unread counts update automatically across all screens when modified
- **API Ready**: Designed for easy integration with backend notification count endpoints

### Migration from Hardcoded Counts
All screens have been migrated from individual `useState(count)` implementations to the shared notification store:

```typescript
// Old pattern (inconsistent across screens)
const [notificationCount, setNotificationCount] = useState(3); // Different on each screen

// New pattern (consistent across all screens)  
const { unreadCount, clearUnreadCount } = useNotifications(); // Shared count
```

This ensures that notification badges display consistent values across the entire application and provide a foundation for real-time notification updates from the backend.