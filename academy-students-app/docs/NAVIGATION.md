# Navigation Guide

This document outlines the navigation structure, routing patterns, and implementation details for the Academy Students App.

## 🧭 Navigation Architecture

### Navigation Hierarchy

The app uses a hierarchical navigation structure with React Navigation 6:

```
AppNavigator (Stack)
├── AuthNavigator (Stack)           # Authentication flow
│   ├── Login
│   ├── Register  
│   ├── ForgotPassword
│   ├── ResetPassword
│   ├── VerifyEmail
│   └── OnboardingWelcome
└── TabNavigator (BottomTabs)       # Main app navigation
    ├── HomeTab → HomeNavigator (Stack)
    │   ├── HomeMain
    │   ├── CourseDetail
    │   ├── BookingDetail
    │   ├── QuickBooking
    │   └── Notifications
    ├── CoursesTab → CoursesNavigator (Stack)
    │   ├── CoursesList
    │   ├── CourseDetail
    │   ├── CourseSearch
    │   └── CourseCategories
    ├── BookingsTab → BookingsNavigator (Stack)
    │   ├── BookingsList
    │   ├── BookingDetail
    │   ├── CreateBooking
    │   ├── BookingConfirmation
    │   └── RescheduleBooking
    ├── ProgressTab → ProgressNavigator (Stack)
    │   ├── ProgressMain
    │   ├── ProgressDetail
    │   ├── Achievements
    │   ├── ProgressHistory
    │   └── GoalSetting
    └── ProfileTab → ProfileNavigator (Stack)
        ├── ProfileMain
        ├── EditProfile
        ├── Settings
        ├── PaymentMethods
        ├── NotificationSettings
        ├── PrivacySettings
        ├── HelpSupport
        └── About
```

## 🔧 Type-Safe Navigation

### Type Definitions

All navigation is fully typed with TypeScript for compile-time safety:

```typescript
// Root navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Onboarding: undefined;
};

// Main tab navigation types
export type TabParamList = {
  HomeTab: undefined;
  CoursesTab: undefined;
  BookingsTab: undefined;
  ProgressTab: undefined;
  ProfileTab: undefined;
};

// Feature-specific navigation types
export type CoursesStackParamList = {
  CoursesList: undefined;
  CourseDetail: { courseId: string };
  CourseSearch: undefined;
  CourseCategories: undefined;
};

export type BookingsStackParamList = {
  BookingsList: undefined;
  BookingDetail: { bookingId: string };
  CreateBooking: { courseId?: string };
  BookingConfirmation: { bookingId: string };
  RescheduleBooking: { bookingId: string };
};

// Authentication navigation types
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  VerifyEmail: { email: string };
  RoleSelection: undefined;
  OnboardingWelcome: undefined;
  OnboardingPreferences: undefined;
  OnboardingGoals: undefined;
};
```

### Navigation Props

Each screen receives typed navigation props:

```typescript
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type AuthNavigationProps<T extends keyof AuthStackParamList> = 
  NativeStackScreenProps<AuthStackParamList, T>;

// Usage in components
export const LoginScreen: React.FC<AuthNavigationProps<'Login'>> = ({
  navigation,
  route,
}) => {
  // Fully typed navigation and route objects
  const handleRegister = () => {
    navigation.navigate('Register'); // Type-safe navigation
  };

  return (
    // Component implementation
  );
};
```

## 🏗️ Navigator Implementation

### App Navigator (Root)

```typescript
// shared/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProgramContextProvider } from '@shared/components/program';

import { useAuthStore } from '@/shared/store';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { AuthNavigator } from '@/features/auth/navigation/AuthNavigator';
import { TabNavigator } from './TabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ProgramContextProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          ) : (
            <Stack.Screen name="Main" component={TabNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ProgramContextProvider>
  );
};
```

### Tab Navigator

```typescript
// shared/navigation/TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/theme/ThemeProvider';

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'CoursesTab':
              iconName = focused ? 'library' : 'library-outline';
              break;
            case 'BookingsTab':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'ProgressTab':
              iconName = focused ? 'analytics' : 'analytics-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.interactive.primary,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.background.primary,
          borderTopColor: theme.colors.border.primary,
          height: 80,
          paddingTop: 8,
          paddingBottom: 8,
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeNavigator} />
      <Tab.Screen name="CoursesTab" component={CoursesNavigator} />
      <Tab.Screen name="BookingsTab" component={BookingsNavigator} />
      <Tab.Screen name="ProgressTab" component={ProgressNavigator} />
      <Tab.Screen name="ProfileTab" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};
```

### Feature Navigator Example

```typescript
// features/courses/navigation/CoursesNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CoursesScreen } from '../screens/CoursesScreen';
import { CourseDetailScreen } from '../screens/CourseDetailScreen';

const Stack = createNativeStackNavigator<CoursesStackParamList>();

export const CoursesNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        // Custom transition animations
        animation: 'slide_from_right',
        animationDuration: 300,
      }}
    >
      <Stack.Screen 
        name="CoursesList" 
        component={CoursesScreen}
      />
      <Stack.Screen 
        name="CourseDetail" 
        component={CourseDetailScreen}
        options={{
          // Custom options for this screen
          animation: 'fade_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};
```

## 🎯 Navigation Patterns

### Navigation Between Features

```typescript
// Navigate to another tab's screen
const navigation = useNavigation<NavigationProp<TabParamList>>();

const handleViewCourse = (courseId: string) => {
  // Navigate to Courses tab and then to CourseDetail
  navigation.navigate('CoursesTab', {
    screen: 'CourseDetail',
    params: { courseId },
  });
};
```

### Deep Navigation

```typescript
// Navigate deep into a nested navigator
const handleBookCourse = (courseId: string) => {
  navigation.navigate('BookingsTab', {
    screen: 'CreateBooking',
    params: { courseId },
  });
};
```

### Modal Navigation

```typescript
// Present screens as modals
const Stack = createNativeStackNavigator();

export const ModalNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: 'modal',
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="CourseEnroll"
        component={CourseEnrollScreen}
        options={{
          title: 'Enroll in Course',
          headerLeft: ({ canGoBack }) => (
            canGoBack ? <BackButton /> : <CancelButton />
          ),
        }}
      />
    </Stack.Navigator>
  );
};
```

## 🔗 Deep Linking

### URL Configuration

```typescript
// App.tsx - Deep linking configuration
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['academy-students://'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ResetPassword: 'reset-password/:token',
        },
      },
      Main: {
        screens: {
          HomeTab: {
            screens: {
              HomeMain: 'home',
              CourseDetail: 'course/:courseId',
            },
          },
          CoursesTab: {
            screens: {
              CoursesList: 'courses',
              CourseDetail: 'courses/:courseId',
            },
          },
          BookingsTab: {
            screens: {
              BookingsList: 'bookings',
              BookingDetail: 'bookings/:bookingId',
              CreateBooking: 'bookings/new/:courseId?',
            },
          },
          ProgressTab: {
            screens: {
              ProgressMain: 'progress',
              ProgressDetail: 'progress/:courseId/:level?',
            },
          },
          ProfileTab: {
            screens: {
              ProfileMain: 'profile',
              Settings: 'settings',
            },
          },
        },
      },
    },
  },
};

// Usage in NavigationContainer
<NavigationContainer linking={linking}>
  {/* Navigation components */}
</NavigationContainer>
```

### Handling Deep Links

```typescript
// Custom hook for handling deep links
export const useDeepLinking = () => {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuthStore();

  React.useEffect(() => {
    const handleDeepLink = (url: string) => {
      if (!isAuthenticated && !url.includes('/login') && !url.includes('/register')) {
        // Redirect to login for protected routes
        navigation.navigate('Auth', { screen: 'Login' });
        return;
      }

      // Handle other deep link logic
    };

    // Listen for incoming links
    Linking.addEventListener('url', ({ url }) => handleDeepLink(url));

    // Handle initial URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });
  }, [isAuthenticated, navigation]);
};
```

## 🎨 Navigation UI Customization

### Custom Header

```typescript
// Custom header component
const CustomHeader: React.FC<{
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}> = ({ title, showBack = true, rightAction }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        { 
          paddingTop: insets.top,
          backgroundColor: theme.colors.background.primary,
        },
      ]}
    >
      <View style={styles.headerContent}>
        {showBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={theme.colors.text.primary} 
            />
          </TouchableOpacity>
        )}
        
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
          {title}
        </Text>
        
        <View style={styles.rightAction}>
          {rightAction}
        </View>
      </View>
    </View>
  );
};
```

### Custom Tab Bar

```typescript
// Custom tab bar implementation
const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: theme.colors.background.primary,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
          >
            {options.tabBarIcon?.({
              focused: isFocused,
              color: isFocused 
                ? theme.colors.interactive.primary 
                : theme.colors.text.tertiary,
              size: 24,
            })}
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isFocused 
                    ? theme.colors.interactive.primary 
                    : theme.colors.text.tertiary,
                },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
```

## 🔄 Navigation State Management

### Navigation State Persistence

```typescript
// Persist navigation state across app restarts
import AsyncStorage from '@react-native-async-storage/async-storage';

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';

export const NavigationPersistence = () => {
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState();

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = savedStateString ? JSON.parse(savedStateString) : undefined;

        if (state !== undefined) {
          setInitialState(state);
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
    >
      {/* Your navigation components */}
    </NavigationContainer>
  );
};
```

### Global Navigation Actions

```typescript
// Global navigation service
class NavigationService {
  private navigationRef = React.createRef<NavigationContainerRef<any>>();

  setTopLevelNavigator(navigatorRef: NavigationContainerRef<any>) {
    this.navigationRef.current = navigatorRef;
  }

  navigate(name: string, params?: any) {
    this.navigationRef.current?.navigate(name, params);
  }

  goBack() {
    this.navigationRef.current?.goBack();
  }

  reset(state: any) {
    this.navigationRef.current?.reset(state);
  }

  // Navigation to specific app sections
  navigateToLogin() {
    this.reset({
      index: 0,
      routes: [{ name: 'Auth', state: { routes: [{ name: 'Login' }] } }],
    });
  }

  navigateToCourse(courseId: string) {
    this.navigate('CoursesTab', {
      screen: 'CourseDetail',
      params: { courseId },
    });
  }

  navigateToBooking(bookingId: string) {
    this.navigate('BookingsTab', {
      screen: 'BookingDetail',
      params: { bookingId },
    });
  }
}

export const navigationService = new NavigationService();
```

## 📱 Platform-Specific Navigation

### iOS-Specific Features

```typescript
// iOS-style navigation with swipe gestures
const Stack = createNativeStackNavigator({
  screenOptions: {
    gestureEnabled: true,
    gestureDirection: 'horizontal',
    animation: 'slide_from_right',
    headerStyle: {
      backgroundColor: 'transparent',
      blurEffect: 'prominent',
    },
    headerLargeTitle: true, // iOS large titles
  },
});
```

### Android-Specific Features

```typescript
// Android-specific navigation patterns
const Stack = createNativeStackNavigator({
  screenOptions: {
    animation: 'slide_from_bottom',
    headerStyle: {
      elevation: 4, // Android shadow
      backgroundColor: theme.colors.surface,
    },
    headerTitleAlign: 'left', // Android header alignment
  },
});
```

## 🎯 Navigation Best Practices

### Performance Optimization

```typescript
// Lazy load screens for better performance
const CoursesScreen = React.lazy(() => 
  import('../screens/CoursesScreen').then(module => ({ 
    default: module.CoursesScreen 
  }))
);

const CourseDetailScreen = React.lazy(() => 
  import('../screens/CourseDetailScreen').then(module => ({ 
    default: module.CourseDetailScreen 
  }))
);

// Use React.Suspense for loading states
<Stack.Screen 
  name="CoursesList" 
  component={() => (
    <React.Suspense fallback={<LoadingScreen />}>
      <CoursesScreen />
    </React.Suspense>
  )}
/>
```

### Navigation Guards

```typescript
// Protect routes based on authentication and role
const ProtectedRoute: React.FC<{
  component: React.ComponentType;
  requiredRole?: string;
}> = ({ component: Component, requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore();
  const navigation = useNavigation();

  if (!isAuthenticated) {
    navigation.navigate('Auth', { screen: 'Login' });
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <UnauthorizedScreen />;
  }

  return <Component />;
};

// Usage
<Stack.Screen 
  name="AdminPanel" 
  component={() => (
    <ProtectedRoute 
      component={AdminPanelScreen} 
      requiredRole="parent" 
    />
  )}
/>
```

### Navigation Analytics

```typescript
// Track navigation events for analytics
const useNavigationAnalytics = () => {
  const navigation = useNavigation();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('state', (e) => {
      const currentRoute = getCurrentRouteName(e.data.state);
      
      // Track screen views
      analytics.track('Screen View', {
        screen: currentRoute,
        timestamp: new Date().toISOString(),
      });
    });

    return unsubscribe;
  }, [navigation]);
};

const getCurrentRouteName = (state: any): string => {
  if (!state || !state.routes || state.routes.length === 0) {
    return 'Unknown';
  }

  const route = state.routes[state.index];
  
  if (route.state) {
    return getCurrentRouteName(route.state);
  }

  return route.name;
};
```

## 🔍 Debugging Navigation

### Navigation Dev Tools

```typescript
// Enable navigation dev tools in development
import { enableScreens } from 'react-native-screens';
import { enableFreeze } from 'react-native-screens';

if (__DEV__) {
  enableScreens(true);
  enableFreeze(true);

  // Navigation logging
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    if (args[0]?.includes?.('Non-serializable values')) {
      return; // Suppress navigation warnings in dev
    }
    originalConsoleWarn(...args);
  };
}
```

### Navigation Testing

```typescript
// Test navigation flows
import { NavigationContainer } from '@react-navigation/native';
import { render, fireEvent } from '@testing-library/react-native';

const TestNavigationWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <NavigationContainer>
      {children}
    </NavigationContainer>
  );
};

describe('Navigation Flow', () => {
  it('navigates from courses list to course detail', () => {
    const { getByTestId } = render(
      <TestNavigationWrapper>
        <CoursesNavigator />
      </TestNavigationWrapper>
    );

    const courseCard = getByTestId('course-card-1');
    fireEvent.press(courseCard);

    expect(getByTestId('course-detail-screen')).toBeTruthy();
  });
});
```

---

This navigation guide provides comprehensive coverage of all navigation patterns and implementations used in the Academy Students App, ensuring type safety, performance, and excellent user experience.