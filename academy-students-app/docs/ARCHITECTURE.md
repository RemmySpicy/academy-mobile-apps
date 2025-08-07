# Architecture Guide

## Overview

The Academy Students App follows a modern, feature-based architecture designed for scalability, maintainability, and developer experience. This document outlines the architectural decisions, patterns, and conventions used throughout the application.

## 🏗️ Architectural Principles

### Feature-Based Organization
Instead of organizing by technical concerns (components, services, etc.), we organize by business features. This approach:
- **Improves maintainability**: Related code lives together
- **Enables team scalability**: Teams can own entire features
- **Reduces cognitive load**: Easier to understand and navigate
- **Facilitates testing**: Feature-specific test organization

### Unidirectional Data Flow
- **State flows down**: Parent components pass data to children via props
- **Events flow up**: Child components communicate with parents via callbacks
- **Global state**: Managed centrally with Zustand stores
- **API state**: Handled with proper loading/error/success states

## 📁 Directory Structure

```
src/
├── features/                    # Feature modules
│   ├── auth/                   # Authentication feature
│   │   ├── components/         # Feature-specific components
│   │   ├── hooks/             # Feature-specific hooks
│   │   ├── navigation/        # Feature navigation
│   │   ├── screens/           # Feature screens
│   │   ├── services/          # Feature-specific API calls
│   │   ├── store/             # Feature-specific state
│   │   └── types/             # Feature-specific types
│   ├── home/                  # Dashboard feature
│   ├── courses/               # Course management
│   ├── bookings/              # Booking system
│   ├── progress/              # Progress tracking
│   └── profile/               # User profile
├── shared/                     # Shared resources
│   ├── components/            # Reusable UI components
│   ├── hooks/                 # Shared custom hooks
│   ├── navigation/            # App-wide navigation
│   ├── services/              # Global API services
│   ├── store/                 # Global state management
│   ├── theme/                 # Design system & theming
│   ├── types/                 # Global TypeScript types
│   └── utils/                 # Utility functions
└── App.tsx                    # App entry point
```

## 🎯 Feature Architecture

Each feature follows a consistent internal structure:

### Feature Components
```typescript
// Feature-specific components that aren't screens
features/courses/components/
├── CourseCard.tsx             # Course display card
├── CourseFilters.tsx          # Filtering interface
└── CourseSearch.tsx           # Search functionality
```

### Feature Screens
```typescript
// Main screens for the feature
features/courses/screens/
├── CoursesScreen.tsx          # Course listing
├── CourseDetailScreen.tsx     # Course details
└── CourseEnrollScreen.tsx     # Enrollment process
```

### Feature Navigation
```typescript
// Navigation configuration for the feature
features/courses/navigation/
└── CoursesNavigator.tsx       # Stack navigator for courses
```

### Feature Services
```typescript
// API calls specific to this feature
features/courses/services/
├── coursesApi.ts              # Course-related API calls
└── types.ts                   # API response types
```

### Feature Store
```typescript
// State management for the feature
features/courses/store/
├── coursesStore.ts            # Zustand store
└── types.ts                   # Store types
```

## 🔄 State Management Strategy

### Local Component State
Use React's built-in state for:
- Component-specific UI state
- Temporary form data
- Animation states
- Component lifecycle state

```typescript
const [isLoading, setIsLoading] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
```

### Global Application State (Zustand)
Use Zustand for:
- User authentication state
- App-wide preferences
- Cross-feature shared data
- Persistent application state

```typescript
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (credentials) => {
        // Login logic
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

### Form State (React Hook Form)
Use React Hook Form for:
- Complex forms with validation
- Multi-step forms
- Dynamic form fields
- Form submission handling

```typescript
const {
  control,
  handleSubmit,
  formState: { errors, isValid },
} = useForm<FormData>({
  resolver: yupResolver(validationSchema),
  mode: 'onChange',
});
```

## 🛣️ Navigation Architecture

### Navigation Hierarchy
```
AppNavigator (Stack)
├── AuthNavigator (Stack)      # Authentication flow
└── TabNavigator (Tabs)        # Main app navigation
    ├── HomeNavigator (Stack)
    ├── CoursesNavigator (Stack)
    ├── BookingsNavigator (Stack)
    ├── ProgressNavigator (Stack)
    └── ProfileNavigator (Stack)
```

### Type-Safe Navigation
All navigation is fully typed with TypeScript:

```typescript
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  CoursesTab: undefined;
  // ...
};

export type CoursesStackParamList = {
  CoursesList: undefined;
  CourseDetail: { courseId: string };
  CourseEnroll: { courseId: string };
};
```

### Navigation Best Practices
- **Deep Linking**: All screens support deep linking
- **State Persistence**: Navigation state persists across app restarts
- **Type Safety**: Full TypeScript support for route params
- **Accessibility**: Proper screen reader navigation

## 🎨 Component Architecture

### Component Hierarchy
```
Shared Components (@shared/components)
├── forms/                     # Form components
├── ui/                        # Basic UI components
├── charts/                    # Data visualization
└── auth/                      # Authentication components

Feature Components (features/*/components)
├── FeatureCard.tsx           # Feature-specific cards
├── FeatureList.tsx           # Feature-specific lists
└── FeatureModal.tsx          # Feature-specific modals
```

### Component Patterns

#### Compound Components
For complex UI components with multiple parts:

```typescript
const CourseCard = ({ children, ...props }) => {
  return <View {...props}>{children}</View>;
};

CourseCard.Header = CourseCardHeader;
CourseCard.Content = CourseCardContent;
CourseCard.Actions = CourseCardActions;

// Usage
<CourseCard>
  <CourseCard.Header title="Learn to Swim" />
  <CourseCard.Content description="..." />
  <CourseCard.Actions onEnroll={handleEnroll} />
</CourseCard>
```

#### Render Props Pattern
For sharing stateful logic:

```typescript
const DataFetcher = ({ children, url }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch logic...
  
  return children({ data, loading });
};

// Usage
<DataFetcher url="/api/courses">
  {({ data, loading }) => (
    loading ? <Loading /> : <CourseList courses={data} />
  )}
</DataFetcher>
```

### Component Best Practices
- **Single Responsibility**: Each component has one clear purpose
- **Composition over Inheritance**: Build complex components from simple ones
- **Props Interface**: Clear, typed interfaces for all components
- **Default Props**: Sensible defaults for optional props
- **Accessibility**: WCAG 2.1 compliant components

## 🔧 Service Layer Architecture

### API Service Organization
```typescript
// Base API configuration
shared/services/
├── apiClient.ts               # Axios configuration
├── apiTypes.ts                # Common API types
└── apiUtils.ts                # API utilities

// Feature-specific services
features/courses/services/
├── coursesApi.ts              # Course endpoints
├── bookingsApi.ts             # Booking endpoints
└── types.ts                   # Feature API types
```

### API Client Pattern
```typescript
class ApiClient {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });
    
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for auth tokens
    this.axios.interceptors.request.use((config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.axios.get<T>(url);
    return response.data;
  }

  // Other HTTP methods...
}
```

### Error Handling Strategy
- **Global Error Handler**: Centralized error processing
- **User-Friendly Messages**: Technical errors translated to user language
- **Retry Logic**: Automatic retry for network failures
- **Offline Support**: Graceful degradation when offline

## 📱 Platform-Specific Considerations

### iOS Specific
- **Safe Area Handling**: Proper inset management
- **Navigation Patterns**: iOS-style navigation animations
- **Permissions**: iOS permission request patterns
- **Haptic Feedback**: iOS haptic feedback integration

### Android Specific
- **Back Button**: Proper Android back button handling
- **Material Design**: Android design language support
- **Permissions**: Android runtime permission handling
- **Navigation**: Android-specific navigation patterns

### Cross-Platform Optimization
```typescript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
```

## 🎯 Performance Optimization

### Bundle Optimization
- **Code Splitting**: Lazy loading for non-critical screens
- **Tree Shaking**: Remove unused code
- **Asset Optimization**: Image compression and caching
- **Bundle Analysis**: Regular bundle size monitoring

### Runtime Performance
- **Memoization**: React.memo, useMemo, useCallback
- **Virtualization**: FlatList for large datasets
- **Image Loading**: Progressive image loading
- **State Updates**: Efficient state update patterns

### Memory Management
- **Listener Cleanup**: Proper event listener removal
- **Timer Cleanup**: Clear timeouts and intervals
- **Subscription Management**: Unsubscribe from observables
- **Cache Management**: LRU cache for frequently accessed data

## 🧪 Testing Architecture

### Test Organization
```
src/
├── features/
│   └── courses/
│       ├── __tests__/
│       │   ├── CoursesScreen.test.tsx
│       │   ├── coursesApi.test.ts
│       │   └── coursesStore.test.ts
│       └── components/
│           └── __tests__/
│               └── CourseCard.test.tsx
```

### Testing Strategies
- **Unit Tests**: Component and utility testing
- **Integration Tests**: Feature workflow testing
- **E2E Tests**: Critical user journey validation
- **Visual Regression**: UI consistency testing

### Testing Utilities
```typescript
// Custom render with providers
export const renderWithProviders = (ui: ReactElement, options?: RenderOptions) => {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <NavigationContainer>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </NavigationContainer>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
};
```

## 🔐 Security Architecture

### Authentication Security
- **JWT Token Management**: Secure token storage and refresh
- **Biometric Authentication**: Face ID / Touch ID support
- **Session Management**: Automatic logout on inactivity
- **Token Rotation**: Regular token refresh for security

### Data Security
- **Encrypted Storage**: Sensitive data encryption at rest
- **Network Security**: Certificate pinning for API calls
- **Input Validation**: Client and server-side validation
- **Privacy Protection**: User data anonymization

## 📈 Monitoring & Analytics

### Error Monitoring
- **Crash Reporting**: Automatic crash detection and reporting
- **Error Boundaries**: Graceful error handling in UI
- **Log Management**: Structured logging for debugging
- **Performance Monitoring**: App performance metrics

### User Analytics
- **Usage Tracking**: Feature usage and user behavior
- **Performance Metrics**: App performance analytics
- **A/B Testing**: Feature flag and experiment support
- **Conversion Tracking**: User journey and conversion metrics

## 🚀 Deployment Architecture

### Environment Management
```typescript
interface AppConfig {
  apiUrl: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    analytics: boolean;
    crashReporting: boolean;
    developmentTools: boolean;
  };
}

const config: AppConfig = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL!,
  environment: process.env.EXPO_PUBLIC_ENV as any,
  features: {
    analytics: process.env.EXPO_PUBLIC_ANALYTICS === 'true',
    crashReporting: process.env.EXPO_PUBLIC_CRASH_REPORTING === 'true',
    developmentTools: __DEV__,
  },
};
```

### Build Configuration
- **Development**: Fast refresh and debugging enabled
- **Staging**: Production-like environment for testing
- **Production**: Optimized builds with analytics and monitoring

### Deployment Strategy
- **Over-the-Air Updates**: Expo Updates for JavaScript changes
- **Binary Updates**: App store updates for native changes
- **Gradual Rollouts**: Phased deployment to minimize risk
- **Rollback Capability**: Quick rollback for critical issues

---

This architecture supports the Academy Students App's requirements for scalability, maintainability, and user experience while following modern React Native best practices.