# Notification System

The Academy Mobile Apps feature a comprehensive notification system built with Zustand that provides user feedback for API operations, form validations, and general application events.

## 🎯 Overview

The notification system provides:
- **Multiple Notification Types** - Success, error, warning, and info notifications
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
  addNotification: (notification) => string;
  removeNotification: (id: string) => void;
  hideNotification: (id: string) => void;
  clearAll: () => void;
  showSuccess: (message: string, title?: string) => string;
  showError: (message: string, title?: string) => string;
  showWarning: (message: string, title?: string) => string;
  showInfo: (message: string, title?: string) => string;
}
```

## 🚀 Basic Usage

### Simple Notifications

```typescript
import { useNotifications } from '@shared';

function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useNotifications();
  
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

### Advanced Notifications

```typescript
import { useNotificationStore } from '@shared';

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
// Subscribe to specific notification data only
const visibleNotifications = useNotificationStore(
  notificationSelectors.visibleNotifications
);

const hasNotifications = useNotificationStore(
  notificationSelectors.hasNotifications
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