# Academy Instructors App

Modern React Native application for Academy Management System instructors, coordinators, and program administrators.

## 🎯 Overview

**Version 2.0** - Complete architectural overhaul with modern React Native patterns, shared component library integration, and offline-first capabilities.

### Target Users
- **Instructors**: Manage classes, track student progress, record attendance
- **Coordinators**: Oversee program operations, manage schedules, monitor performance  
- **Program Admins**: Administrative oversight, team management, reporting

### Key Features
- ✅ **Multi-Program Support** - Switch between programs seamlessly
- ✅ **Offline-First** - Smart caching with automatic sync
- ✅ **Real-time Updates** - Live data synchronization
- ✅ **Tablet Optimized** - Responsive design for tablets and phones
- ✅ **Role-Based Access** - Features adapt to user permissions
- ✅ **Modern UI/UX** - Professional, accessible interface

## 🏗️ Architecture

### Technology Stack
```
React Native 0.76+     # Latest stable version
Expo Dev Client 52+    # Development and building
Zustand 5+             # State management (replaces Redux)
React Navigation 6+    # Navigation with latest patterns
NativeWind 2+          # Tailwind CSS for React Native
TypeScript 5.6+        # Strict type checking
React Hook Form 7+     # Form handling with validation
```

### Project Structure
```
src/
├── components/        # Reusable UI components
├── features/          # Feature-specific modules
├── navigation/        # Navigation configuration
├── screens/           # Screen components
├── store/             # Zustand state management
├── hooks/             # Custom React hooks
├── services/          # API and business logic
├── types/             # TypeScript type definitions
├── utils/             # Helper functions
└── constants/         # App constants

existing-code/         # Legacy code for reference
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android  
npm run android

# Run on web (for testing)
npm run web
```

### Development Workflow
```bash
# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Testing
npm test
npm run test:watch
npm run test:coverage

# Building
npm run build:development
npm run build:preview
npm run build:production
```

## 📱 Features Implementation

### Phase 1: Authentication & Program Context ✅
- [x] JWT-based authentication with shared library
- [x] Program switching with context headers
- [x] Secure token storage with AsyncStorage
- [x] Offline auth state persistence
- [x] Professional login/register UI

### Phase 2: Student Management (In Progress)
- [ ] Student list with search and filters
- [ ] Individual student profiles
- [ ] Progress tracking and analytics
- [ ] Parent communication tools
- [ ] Attendance management

### Phase 3: Class Scheduling & Management
- [ ] Calendar view with class scheduling
- [ ] Class creation and editing
- [ ] Attendance tracking interface
- [ ] Session notes and observations
- [ ] Resource management

### Phase 4: Analytics & Reporting
- [ ] Student progress analytics
- [ ] Class performance metrics
- [ ] Custom report generation
- [ ] Data export capabilities
- [ ] Performance dashboards

## 🔧 State Management

### Zustand Stores

#### AuthStore (`/store/authStore.ts`)
```typescript
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  currentProgram: Program | null;
  availablePrograms: Program[];
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchProgram: (programId: string) => Promise<void>;
  // ... more actions
}
```

#### AppStore (`/store/appStore.ts`)
```typescript
interface AppState {
  isFirstLaunch: boolean;
  hasCompletedOnboarding: boolean;
  theme: 'light' | 'dark' | 'system';
  isOnline: boolean;
  // ... more state
}
```

#### CacheStore (`/store/cacheStore.ts`)
```typescript
interface CacheState {
  cache: Map<string, CacheEntry>;
  defaultTTL: number;
  maxSize: number;
  
  // Actions
  set: <T>(key: string, data: T, ttl?: number) => void;
  get: <T>(key: string) => T | null;
  // ... more cache operations
}
```

## 🌐 API Integration

### Shared Library Usage
```typescript
// Import shared components
import { CustomInput, CustomButton } from '@shared/components/forms';

// Import shared hooks
import { useAuth, useApiClient } from '@shared/hooks';

// Import shared services  
import { authService, apiClient } from '@shared/services';

// Import shared utilities
import { formatCurrency, validateEmail } from '@shared/utils';
```

### API Client Configuration
```typescript
// Automatic configuration for academy backend
const apiClient = new ApiClient('http://localhost:8000/api/v1');

// Automatic features:
// - JWT token management
// - Program context headers (X-Program-Context)
// - Request/response interceptors
// - Error handling with retry logic
```

## 📋 Navigation Structure

### Navigation Hierarchy
```
App Navigator (Root)
├── Onboarding Navigator (First launch)
├── Auth Navigator (Login/Register)
└── Main Navigator (Authenticated)
    ├── Tab Navigator
    │   ├── Home Stack
    │   ├── Students Stack
    │   ├── Schedule Stack
    │   ├── Analytics Stack
    │   └── Profile Stack
    └── Modal Screens
        ├── Student Detail
        ├── Class Detail
        ├── Settings
        └── Notifications
```

### Type-Safe Navigation
```typescript
// Navigation types for type safety
type RootStackParamList = {
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

// Usage in components
type ScreenProps<T extends keyof ParamList> = {
  navigation: NativeStackNavigationProp<ParamList, T>;
  route: RouteProp<ParamList, T>;
};
```

## 🎨 UI/UX Guidelines

### Design System
- **Colors**: Blue primary (#3B82F6), neutral grays, semantic colors
- **Typography**: System fonts with consistent scale
- **Spacing**: 4px grid system (4, 8, 12, 16, 24, 32, 48)
- **Components**: Shared library components with consistent styling
- **Accessibility**: Full WCAG 2.1 AA compliance

### Responsive Design
```typescript
// Tablet/mobile adaptive components
const isTablet = useDeviceInfo().isTablet;

return (
  <View className={clsx(
    'p-4',
    isTablet ? 'p-6 max-w-4xl mx-auto' : 'w-full'
  )}>
    {/* Content adapts to screen size */}
  </View>
);
```

## 🔒 Security & Privacy

### Security Features
- **JWT Authentication** with automatic refresh
- **Secure Storage** for sensitive data (tokens, user info)
- **Program Context Isolation** - users only see their program data
- **Input Validation** on all forms with yup schemas
- **API Request Signing** with program context headers

### Privacy Compliance
- **Data Minimization** - only collect necessary data
- **Local Storage Encryption** for sensitive information
- **Audit Logging** for user actions (where required)
- **GDPR Compliance** preparation with data export/deletion

## 🧪 Testing Strategy

### Testing Levels
```bash
# Unit Tests - Components and utilities
npm test src/components
npm test src/utils

# Integration Tests - Features and flows
npm test src/features

# E2E Tests - Complete user journeys
npm test e2e/

# Coverage Reports
npm run test:coverage
```

### Testing Libraries
- **Jest** - Test runner and assertions
- **React Native Testing Library** - Component testing
- **MSW** - API mocking for tests
- **Detox** - E2E testing (planned)

## 🚀 Deployment

### Build Profiles
```json
// eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

### Deployment Commands
```bash
# Development build
npm run build:development

# Preview build for testing
npm run build:preview

# Production build for app stores
npm run build:production
```

## 📊 Performance Optimization

### Optimization Strategies
- **Code Splitting** with React.lazy for large screens
- **Image Optimization** with Expo Image component  
- **List Virtualization** for large datasets
- **Caching Strategy** with smart TTL and cleanup
- **Bundle Analysis** with Metro bundle analyzer

### Performance Monitoring
```typescript
// Performance metrics tracking
import { startTransition } from 'react';

// Optimize state updates
startTransition(() => {
  setLargeStateUpdate(newData);
});
```

## 🔧 Development Tools

### VS Code Extensions
- ES7+ React/Redux/RN snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- React Native Tools
- GitLens

### Debugging
```bash
# Flipper debugging
npx react-native doctor

# Metro bundler debugging
npx react-native start --verbose

# Performance profiling
npx react-native profile
```

## 📖 Additional Resources

### Documentation Links
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Academy Shared Library](../shared/README.md)

### Internal Documentation
- [API Endpoints](../../docs/api/API_ENDPOINTS.md)
- [Development Workflow](../../docs/development/DEVELOPMENT_WORKFLOW.md)
- [Mobile Development Guide](../../MOBILE_DEVELOPMENT.md)

## 🤝 Contributing

### Development Guidelines
1. **Follow TypeScript strict mode** - no `any` types
2. **Use shared components** when possible
3. **Write tests** for new features
4. **Document components** with JSDoc
5. **Follow commit conventions** with semantic commits

### Code Review Checklist
- [ ] TypeScript compilation passes
- [ ] All tests pass
- [ ] No console errors or warnings
- [ ] Accessibility guidelines followed
- [ ] Performance impact considered
- [ ] Security best practices applied

---

**Built with ❤️ by the Academy Team**

For support or questions, please refer to the [Development Guidelines](../../docs/development/FUTURE_DEVELOPMENT_GUIDELINES.md) or contact the development team.