# Authentication System

The Academy Mobile Apps use a modern, secure authentication system built with Zustand state management and SecureStore for token security.

## 🔐 Overview

The authentication system provides:
- **JWT-based authentication** with access and refresh tokens
- **SecureStore integration** for encrypted token storage
- **Role-based access control** with program context support
- **Automatic token refresh** and validation
- **Multi-program user support** with context switching
- **Comprehensive error handling** with user notifications

## 🏗️ Architecture

### Authentication Flow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Login Screen  │───▶│   Auth Store    │───▶│  Backend API    │
│                 │    │                 │    │                 │
│ Email/Password  │    │ - Zustand Store │    │ - JWT Tokens    │
│ Form Validation │    │ - SecureStore   │    │ - User Data     │
│ Loading States  │    │ - Program Ctx   │    │ - Role/Perms    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Security Layers
1. **Transport Security**: HTTPS-only communication
2. **Token Security**: SecureStore encrypted storage
3. **Session Security**: Automatic token expiry handling
4. **Access Control**: Role and program-based permissions
5. **Input Security**: Form validation and sanitization

## 🔧 Implementation

### Auth Store Setup

The authentication is managed by a Zustand store with Immer middleware:

```typescript
import { useAuthStore, authSelectors } from '@shared';

// Using the auth store
function MyComponent() {
  const { login, logout, user, isAuthenticated } = useAuthStore();
  
  // Or use selectors for optimized re-renders
  const user = useAuthStore(authSelectors.user);
  const isLoading = useAuthStore(authSelectors.isLoading);
}
```

### Key Store Methods

```typescript
interface AuthStoreState {
  // State
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  user: User | null;
  currentProgram: ProgramAssignment | null;
  availablePrograms: ProgramAssignment[];
  error: AuthError | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setCurrentProgram: (program: ProgramAssignment) => void;
  initializeAuth: () => Promise<void>;
  clearError: () => void;

  // Utilities
  getAuthHeaders: () => AuthHeaders;
  hasRole: (role: UserRole) => boolean;
  hasProgramAccess: (programId: string) => boolean;
  isRoleAllowedInApp: (appType: 'instructor' | 'student') => boolean;
}
```

## 🚀 Usage Examples

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

### Login Screen

```typescript
// LoginScreen.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { CustomInput, useAuthStore } from '@shared';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const { control, handleSubmit } = useForm<LoginForm>();
  const { login, isLoading, error } = useAuthStore();
  
  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);
      // Navigation handled by auth state change
    } catch (error) {
      // Error automatically shown via notification system
      console.error('Login failed:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <CustomInput
        name="email"
        control={control}
        placeholder="Email address"
        keyboardType="email-address"
        rules={{ 
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        }}
      />
      
      <CustomInput
        name="password"
        control={control}
        placeholder="Password"
        secureTextEntry
        showPasswordToggle
        rules={{ 
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters'
          }
        }}
      />
      
      <Button
        title="Sign In"
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        disabled={isLoading}
      />
      
      {error && (
        <Text style={styles.error}>{error.message}</Text>
      )}
    </View>
  );
}
```

### Protected Screens

```typescript
// ProtectedScreen.tsx
import React from 'react';
import { useAuthStore, UserRole } from '@shared';

export default function ProtectedScreen() {
  const { user, hasRole, isRoleAllowedInApp } = useAuthStore();
  
  // Check if user is allowed in this app
  if (!isRoleAllowedInApp('instructor')) {
    return <AccessDenied message="This app is for instructors only" />;
  }
  
  return (
    <View>
      <Text>Welcome, {user?.full_name}!</Text>
      
      {/* Role-based content */}
      <StudentList />
      
      {hasRole(UserRole.PROGRAM_COORDINATOR) && (
        <AdvancedReporting />
      )}
      
      {hasRole(UserRole.PROGRAM_ADMIN) && (
        <AdminControls />
      )}
    </View>
  );
}
```

### Program Context Switching

```typescript
// ProgramSelector.tsx
import React from 'react';
import { useAuthStore } from '@shared';

export default function ProgramSelector() {
  const { 
    currentProgram, 
    availablePrograms, 
    setCurrentProgram 
  } = useAuthStore();
  
  const handleProgramChange = (program: ProgramAssignment) => {
    setCurrentProgram(program);
    // This will update the X-Program-Context header for all API calls
  };
  
  return (
    <View>
      <Text>Current Program: {currentProgram?.program_name}</Text>
      
      {availablePrograms.map((program) => (
        <TouchableOpacity
          key={program.program_id}
          onPress={() => handleProgramChange(program)}
          style={[
            styles.programItem,
            currentProgram?.program_id === program.program_id && styles.active
          ]}
        >
          <Text>{program.program_name}</Text>
          <Text style={styles.role}>{program.role_in_program}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
```

## 🔒 Security Features

### Token Management

```typescript
// Tokens are automatically managed by the auth store
const authHeaders = useAuthStore(state => state.getAuthHeaders());
// Returns: { Authorization: 'Bearer <token>', 'X-Program-Context': '<program_id>' }

// Manual token operations (rarely needed)
const { token, refreshUser } = useAuthStore();
```

### Automatic Logout

The system automatically logs out users when:
- **Token expires** and refresh fails
- **401 Unauthorized** responses from API
- **Manual logout** is triggered
- **Security breach** is detected

```typescript
// Logout handling
const { logout } = useAuthStore();

const handleLogout = async () => {
  try {
    await logout();
    // Navigates to login screen automatically
  } catch (error) {
    // Even if server logout fails, local logout succeeds
    console.warn('Server logout failed, but local logout completed');
  }
};
```

### Error Handling

```typescript
// Error types are automatically handled
const { error, clearError } = useAuthStore();

useEffect(() => {
  if (error) {
    // Error is also shown via notification system
    console.error('Auth error:', error);
    
    // Clear error after handling
    setTimeout(clearError, 5000);
  }
}, [error, clearError]);
```

## 🎯 Best Practices

### 1. Use Selectors for Performance

```typescript
// ❌ Bad - causes re-renders on any auth state change
const authState = useAuthStore();

// ✅ Good - only re-renders when user changes
const user = useAuthStore(authSelectors.user);
const isAuthenticated = useAuthStore(authSelectors.isAuthenticated);
```

### 2. Handle Loading States

```typescript
const { isLoading, isInitializing } = useAuthStore();

if (isInitializing) {
  return <SplashScreen />;
}

if (isLoading) {
  return <LoadingSpinner />;
}
```

### 3. Check Permissions Properly

```typescript
// ❌ Bad - doesn't account for program context
if (user?.role === UserRole.PROGRAM_ADMIN) {
  // Show admin features
}

// ✅ Good - uses store method that considers context
if (hasRole(UserRole.PROGRAM_ADMIN)) {
  // Show admin features
}
```

### 4. Handle Network Errors

```typescript
const handleLogin = async (data: LoginForm) => {
  try {
    await login(data);
  } catch (error) {
    if (error instanceof AuthError) {
      // Handle specific auth errors
      if (error.code === 'INVALID_CREDENTIALS') {
        showError('Invalid email or password');
      }
    } else {
      // Handle network errors
      showError('Unable to connect. Please check your internet connection.');
    }
  }
};
```

## 🧪 Testing

### Testing Auth Components

```typescript
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useAuthStore } from '@shared';

// Mock the auth store
jest.mock('@shared', () => ({
  useAuthStore: jest.fn(),
}));

test('handles login correctly', async () => {
  const mockLogin = jest.fn();
  useAuthStore.mockReturnValue({
    login: mockLogin,
    isLoading: false,
    error: null,
  });
  
  const { getByPlaceholderText, getByText } = render(<LoginScreen />);
  
  fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
  fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
  fireEvent.press(getByText('Sign In'));
  
  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
```

## 📱 Platform Considerations

### iOS Specific
- **Keychain Integration**: SecureStore uses iOS Keychain
- **Biometric Support**: Future enhancement for Face ID/Touch ID
- **Background Handling**: Token validation on app resume

### Android Specific
- **Keystore Integration**: SecureStore uses Android Keystore
- **Biometric Support**: Future enhancement for fingerprint
- **Background Handling**: Proper handling of app lifecycle

## 🔄 Migration Guide

### From Redux Auth Context

```typescript
// Old Redux pattern
const dispatch = useAppDispatch();
const { user, isAuthenticated } = useAppSelector(state => state.auth);

// New Zustand pattern
const { user, isAuthenticated } = useAuthStore();
```

### From AsyncStorage

```typescript
// Old AsyncStorage pattern
await AsyncStorage.setItem('token', token);

// New SecureStore pattern (handled automatically)
await login(credentials); // Automatically stores in SecureStore
```

See [Roles and Permissions](./ROLES_AND_PERMISSIONS.md) for detailed role-based access control information.