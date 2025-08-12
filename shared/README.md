# Academy Mobile Apps - Shared Package

This package contains shared components, services, types, and utilities for the Academy Management System mobile applications (instructor and student apps).

## 📦 Package Structure

```
shared/
├── src/
│   ├── components/       # Enhanced Academy-themed UI components
│   │   ├── ui/          # Enhanced UI components (Header, StudentCard, InstructorDashboard)
│   │   ├── charts/      # Academy-themed chart components (PerformanceChart)
│   │   ├── forms/       # Form components with React Hook Form integration
│   │   ├── auth/        # Authentication related components
│   │   └── program/     # Program context and management components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API and service layer
│   ├── store/           # Zustand state management stores
│   ├── theme/           # Academy design system and theming
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions and constants
│   └── index.ts         # Main export file
├── assets/              # Shared assets (images, icons)
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Installation

The shared package is automatically installed as a workspace dependency. To use components in your mobile app:

```typescript
import { CustomInput, useAuthStore, UserRole } from '@shared';
```

### Key Features

- ✅ **Enhanced Academy-Themed Components** with instructor utilities
- ✅ **Modern Authentication System** with Zustand and SecureStore
- ✅ **Comprehensive Form Components** with React Hook Form integration
- ✅ **Type-Safe API Client** with automatic error handling
- ✅ **Academy Design System** with consistent theming
- ✅ **Instructor-Specific Tools** for performance monitoring and quick actions
- ✅ **Notification System** for user feedback
- ✅ **Program Context Management** for multi-program support
- ✅ **Role-Based Access Control** with permission management
- ✅ **Accessibility-First Design** with ARIA support

## 🎨 Enhanced Academy Components

The shared package includes enhanced, Academy-themed components optimized for instructor workflows:

### Header Component
Academy-themed header with instructor utilities:

```typescript
import { Header } from '@academy/mobile-shared';

<Header
  title="Student Management"
  variant="instructor"
  onSearchPress={handleSearch}
  onFilterPress={handleFilter}
  onNotificationPress={handleNotifications}
  notificationCount={5}
  showInstructorActions={true}
/>
```

**Features:**
- Multiple variants: `default`, `withBack`, `withNotification`, `withProgram`, `instructor`
- Instructor actions: Search, filter, notifications
- Program context display
- Accessibility support with proper ARIA labels

### StudentCard Component
Enhanced student cards with performance indicators and quick actions:

```typescript
import { StudentCard } from '@academy/mobile-shared';

<StudentCard
  student={studentData}
  variant="detailed"
  enableQuickAttendance={true}
  enableQuickGrading={true}
  showInstructorNotes={true}
  onAttendancePress={handleAttendance}
  onPerformancePress={handleGrading}
  onContactParentPress={handleParentContact}
/>
```

**Features:**
- Performance level indicators with color coding
- Attendance status visualization
- Progress tracking with completion bars
- Quick action buttons for instructors
- Alert system for overdue assignments and parent contact

### InstructorDashboard Component
Comprehensive dashboard for instructor overview screens:

```typescript
import { InstructorDashboard } from '@academy/mobile-shared';

<InstructorDashboard
  metrics={dashboardMetrics}
  chartData={performanceData}
  recentStudents={students}
  recentActivities={activities}
  onMetricPress={handleMetricClick}
  onStudentPress={handleStudentClick}
  showChart={true}
  showStudents={true}
  showActivities={true}
/>
```

**Features:**
- Key performance metrics with change indicators
- Quick action grid for common instructor tasks
- Integrated performance charts
- Recent students and activity feeds
- Customizable sections and limits

### PerformanceChart Component
Academy-themed analytics charts with interactive features:

```typescript
import { PerformanceChart } from '@academy/mobile-shared';

<PerformanceChart
  data={chartData}
  type="line"
  title="Student Performance Trend"
  metrics={performanceMetrics}
  showPeriodSelector={true}
  onPeriodChange={handlePeriodChange}
  primaryColor={theme.colors.academy.purple[500]}
/>
```

**Features:**
- Multiple chart types: line, bar, pie, progress
- Academy theming with automatic color coordination
- Interactive data point selection
- Period filtering (week, month, quarter, year)
- Goal comparison and achievement tracking

### Enhanced Form Components
All form components have been enhanced with Academy theming:

```typescript
import { CustomInput, CustomButton } from '@academy/mobile-shared';

// Enhanced input with Academy theming
<CustomInput
  name="email"
  control={control}
  variant="standard"
  placeholder="Enter email"
  leftIcon={<Iconify icon="ri:mail-line" />}
/>

// Enhanced button with all Academy variants
<CustomButton
  title="Submit"
  variant="primary"
  onPress={handleSubmit}
  isLoading={isLoading}
  startIcon={<Iconify icon="ri:send-plane-line" />}
/>
```

**Enhanced Features:**
- Complete Academy color palette support
- Improved accessibility with ARIA compliance
- Better error handling and validation
- Consistent theming across all variants

For complete component documentation, see [ENHANCED_COMPONENTS.md](../ENHANCED_COMPONENTS.md).

## 🔐 Authentication System

### Auth Store (Zustand)

The authentication system is built with Zustand and integrates with SecureStore for security.

```typescript
import { useAuthStore, authSelectors } from '@shared';

function LoginScreen() {
  const { login, isLoading, error } = useAuthStore();
  
  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      // Navigate to home screen
    } catch (error) {
      // Error is automatically handled by notification system
    }
  };
}

// Optimized selector usage
function UserProfile() {
  const user = useAuthStore(authSelectors.user);
  const isAuthenticated = useAuthStore(authSelectors.isAuthenticated);
  
  if (!isAuthenticated) return <LoginPrompt />;
  return <ProfileInfo user={user} />;
}
```

### Key Auth Features

- **SecureStore Integration** - Tokens stored securely, not in AsyncStorage
- **Automatic Token Validation** - Validates tokens on app startup
- **Program Context Management** - Supports multi-program user assignments
- **Role-Based Access Control** - Built-in permission checking
- **Automatic Logout** - Handles expired tokens and 401 errors
- **Error Handling** - Integrated with notification system

### Auth Store API

```typescript
interface AuthStoreState {
  // State
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  user: User | null;
  currentProgram: ProgramAssignment | null;
  error: AuthError | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setCurrentProgram: (program: ProgramAssignment) => void;
  initializeAuth: () => Promise<void>;

  // Utilities
  getAuthHeaders: () => AuthHeaders;
  hasRole: (role: UserRole) => boolean;
  hasProgramAccess: (programId: string) => boolean;
  isRoleAllowedInApp: (appType: 'instructor' | 'student') => boolean;
}
```

## 📋 Form Components

All form components integrate with React Hook Form and include comprehensive validation, accessibility, and error handling.

### CustomInput

```typescript
import { CustomInput } from '@shared';

<CustomInput
  name="email"
  control={control}
  placeholder="Enter your email"
  variant="standard" // standard | outline | ghost
  size="medium" // small | medium | large
  leftIcon={<Iconify icon="ri:mail-line" size={20} />}
  keyboardType="email-address"
  required
  rules={{ required: 'Email is required' }}
/>

// Password input with toggle
<CustomInput
  name="password"
  control={control}
  placeholder="Enter password"
  secureTextEntry
  showPasswordToggle
  variant="password"
/>
```

### CustomDropdown

```typescript
import { CustomDropdown } from '@shared';

const options = [
  { label: 'Swimming', value: 'swimming' },
  { label: 'Tennis', value: 'tennis' },
  { label: 'Football', value: 'football' },
];

<CustomDropdown
  name="course"
  control={control}
  placeholder="Select a course"
  options={options}
  animationType="slide" // slide | fade | none
  multiple={false}
  showCheckmarks
  disabled={isLoading}
  onSelectionChange={(value) => handleCourseChange(value)}
/>
```

### OtpField

```typescript
import { OtpField } from '@shared';

<OtpField
  name="otp"
  control={control}
  length={6}
  placeholder="Enter OTP"
  onComplete={(otp) => verifyOtp(otp)}
  secureTextEntry // Shows dots instead of numbers
/>
```

### CustomCheckBox

```typescript
import { CustomCheckBox } from '@shared';

<CustomCheckBox
  name="terms"
  control={control}
  label="I agree to the terms and conditions"
  variant="primary" // primary | secondary | success | warning | danger | info
  size="medium" // small | medium | large
  required
/>
```

### QuantityController

```typescript
import { QuantityController } from '@shared';

<QuantityController
  name="quantity"
  control={control}
  min={1}
  max={10}
  step={1}
  variant="default" // default | outline | ghost
  size="medium"
  orientation="horizontal" // horizontal | vertical
  onValueChange={(value) => updatePrice(value)}
/>
```

### RadioButton & RadioButtonGroup

```typescript
import { RadioButton, RadioButtonGroup } from '@shared';

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

<RadioButtonGroup
  name="gender"
  control={control}
  options={genderOptions}
  layout="horizontal" // horizontal | vertical
  variant="primary"
  required
/>
```

## 🌐 API Client

The API client provides type-safe HTTP requests with automatic authentication, error handling, and program context.

```typescript
import { apiClient } from '@shared';

// Automatic auth headers and error handling
const students = await apiClient.get<Student[]>('/students');

// With program context
const courses = await apiClient.get<Course[]>('/courses', {
  programId: currentProgram.program_id
});

// Error handling with notifications
try {
  await apiClient.post('/students', studentData);
  // Success notification shown automatically
} catch (error) {
  // Error notification shown automatically
  // Handle specific error cases if needed
}
```

### API Client Features

- **Automatic Authentication** - Adds Bearer token to all requests
- **Program Context** - Adds X-Program-Context header automatically
- **Error Handling** - Parses and displays user-friendly error messages
- **Retry Logic** - Exponential backoff for transient errors
- **Type Safety** - Full TypeScript support with generics
- **Notification Integration** - Automatic success/error notifications

## 🔔 Notification System

The notification system provides user feedback for API operations and form validations.

```typescript
import { useNotifications } from '@shared';

function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useNotifications();

  const handleSubmit = async (data) => {
    try {
      await apiClient.post('/data', data);
      showSuccess('Data saved successfully!');
    } catch (error) {
      showError('Failed to save data. Please try again.');
    }
  };

  return (
    <View>
      <Button title="Show Warning" 
        onPress={() => showWarning('This action cannot be undone')} />
      <Button title="Show Info" 
        onPress={() => showInfo('New features available!')} />
    </View>
  );
}
```

### Notification Features

- **Multiple Types** - Success, error, warning, info
- **Auto Dismiss** - Configurable timeouts per type
- **Action Support** - Optional action buttons
- **Accessibility** - Screen reader support
- **Performance** - Optimized rendering with selectors

## 🎨 Theme System

Components support consistent theming across both apps:

```typescript
// Theme colors used across components
const theme = {
  colors: {
    primary: '#4F2EC9',
    secondary: '#5B5F5F', 
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    
    // Neutrals
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};
```

## 🔒 User Roles & Permissions

The system supports role-based access control with the following roles:

### Instructor App Roles
- **TUTOR** - Basic student interaction and progress viewing
- **PROGRAM_COORDINATOR** - Enhanced management and reporting
- **PROGRAM_ADMIN** - Full program management
- **SUPER_ADMIN** - System-wide administration

### Student App Roles
- **STUDENT** - Course access, assignment submission, progress tracking
- **PARENT** - Child progress monitoring, instructor communication

```typescript
import { UserRole, useAuthStore } from '@shared';

function AdminPanel() {
  const { hasRole, isRoleAllowedInApp } = useAuthStore();
  
  if (!isRoleAllowedInApp('instructor')) {
    return <AccessDenied />;
  }
  
  return (
    <View>
      <StudentList />
      {hasRole(UserRole.PROGRAM_COORDINATOR) && <ReportsSection />}
      {hasRole(UserRole.PROGRAM_ADMIN) && <AdminControls />}
    </View>
  );
}
```

## 📱 Usage in Mobile Apps

### App Initialization

```typescript
// App.tsx
import React, { useEffect } from 'react';
import { useAuthStore } from '@shared';

export default function App() {
  const { initializeAuth, isInitializing } = useAuthStore();
  
  useEffect(() => {
    initializeAuth();
  }, []);
  
  if (isInitializing) {
    return <LoadingScreen />;
  }
  
  return <NavigationContainer>{/* Your app */}</NavigationContainer>;
}
```

### Form Usage Example

```typescript
// LoginScreen.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { CustomInput, CustomButton, useAuthStore } from '@shared';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const { control, handleSubmit } = useForm<LoginForm>();
  const { login, isLoading } = useAuthStore();
  
  const onSubmit = async (data: LoginForm) => {
    await login(data);
  };
  
  return (
    <View style={styles.container}>
      <CustomInput
        name="email"
        control={control}
        placeholder="Email address"
        keyboardType="email-address"
        leftIcon={<MailIcon />}
        rules={{ required: 'Email is required' }}
      />
      
      <CustomInput
        name="password"
        control={control}
        placeholder="Password"
        secureTextEntry
        showPasswordToggle
        rules={{ required: 'Password is required' }}
      />
      
      <CustomButton
        title="Sign In"
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        variant="primary"
      />
    </View>
  );
}
```

## 🧪 Testing

Components include comprehensive TypeScript types and are designed for easy testing:

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { CustomInput } from '@shared';

test('CustomInput handles user input', () => {
  const mockOnChange = jest.fn();
  const { getByPlaceholderText } = render(
    <CustomInput
      name="test"
      control={mockControl}
      placeholder="Test input"
      onValueChange={mockOnChange}
    />
  );
  
  const input = getByPlaceholderText('Test input');
  fireEvent.changeText(input, 'test value');
  
  expect(mockOnChange).toHaveBeenCalledWith('test value');
});
```

## 🔄 Migration from Existing Code

If migrating from the existing Redux-based code:

1. **Replace AuthContext** with `useAuthStore`
2. **Replace Redux alerts** with `useNotifications`
3. **Update form components** to use shared components
4. **Replace AsyncStorage** auth calls with store methods
5. **Update API calls** to use the enhanced `apiClient`

## 📚 API Reference

For complete API documentation, see the TypeScript definitions in `src/types/` directory. All interfaces are fully documented with JSDoc comments.

## 🤝 Contributing

When adding new shared components:

1. Follow the existing patterns in `src/components/forms/`
2. Include comprehensive TypeScript types
3. Add accessibility support
4. Include error handling
5. Add documentation and examples
6. Export from `src/index.ts`

## 📄 License

MIT License - See LICENSE file for details.