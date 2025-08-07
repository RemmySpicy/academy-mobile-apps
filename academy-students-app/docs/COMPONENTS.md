# Component Library Documentation

This document provides comprehensive documentation for all components used in the Academy Students App, including shared components from the monorepo and app-specific components.

## 📚 Component Organization

### Shared Components (`@shared/components`)
These components are available across both instructor and student apps:

```
@shared/components/
├── forms/              # Form components
├── ui/                 # Basic UI components  
├── auth/               # Authentication components
├── charts/             # Data visualization
└── program/            # Multi-program context components
```

### App-Specific Components
Student app specific components organized by feature:

```
src/features/*/components/
├── CourseCard.tsx      # Course display components
├── BookingCard.tsx     # Booking management components
├── ProgressCard.tsx    # Progress tracking components
└── ProfileCard.tsx     # Profile management components
```

## 🧱 Shared Form Components

### CustomInput

A flexible, accessible input component with multiple variants and full validation support.

```typescript
import { CustomInput } from '@shared/components/forms';

interface CustomInputProps {
  name: string;
  control?: Control<FieldValues>;
  rules?: RegisterOptions;
  variant?: 'standard' | 'outline' | 'ghost' | 'password';
  size?: 'small' | 'medium' | 'large';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
  maxLength?: number;
  defaultValue?: string;
  editable?: boolean;
  autoFocus?: boolean;
  returnKeyType?: "done" | "go" | "next" | "search" | "send" | "default";
  onSubmitEditing?: () => void;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  containerStyle?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}
```

**Usage Examples:**

```typescript
// Basic input
<CustomInput
  name="email"
  control={control}
  placeholder="Enter your email"
  keyboardType="email-address"
  variant="outline"
/>

// Password input with toggle
<CustomInput
  name="password"
  control={control}
  placeholder="Enter password"
  secureTextEntry
  showPasswordToggle
  variant="standard"
/>

// Input with icons
<CustomInput
  name="search"
  control={control}
  placeholder="Search courses..."
  leftIcon={<Ionicons name="search" size={20} color="#9CA3AF" />}
  rightIcon={<Ionicons name="close" size={20} color="#9CA3AF" />}
  variant="ghost"
/>

// Multiline text area
<CustomInput
  name="notes"
  control={control}
  placeholder="Additional notes..."
  multiline
  numberOfLines={4}
  variant="outline"
  size="large"
/>
```

**Variants:**
- `standard`: Default bordered input
- `outline`: Outlined input with background
- `ghost`: Borderless input with underline
- `password`: Specialized for password fields

### CustomButton

A comprehensive button component supporting multiple variants, sizes, and states.

```typescript
import { CustomButton } from '@shared/components/forms';

interface CustomButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  disabled?: boolean;
  isLoading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  shadow?: boolean;
  shadowColor?: string;
  shadowOpacity?: number;
  shadowOffset?: { width: number; height: number };
  shadowRadius?: number;
  loaderColor?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

type ButtonVariant = 
  | 'primary'           // Academy purple with white text
  | 'outline'           // Light gray background 
  | 'outlineTheme'      // White with purple border
  | 'danger'            // Red background with opacity
  | 'gray'              // Gray background
  | 'faded'             // Faded background
  | 'orange'            // Orange theme
  | 'lightGray'         // Light gray variant
  | 'black'             // Black background
  | 'cancel'            // Cancel button style
  | 'normal';           // Normal variant
```

**Usage Examples:**

```typescript
// Primary button
<CustomButton
  title="Enroll Now"
  onPress={handleEnroll}
  variant="primary"
  size="md"
/>

// Loading button
<CustomButton
  title="Booking..."
  onPress={handleBooking}
  variant="primary"
  isLoading={isLoading}
  disabled={isLoading}
/>

// Button with icons
<CustomButton
  title="Share Progress"
  onPress={handleShare}
  variant="outline"
  startIcon={<Ionicons name="share" size={16} color="#3B82F6" />}
  endIcon={<Ionicons name="external-link" size={16} color="#3B82F6" />}
/>

// Danger button with shadow
<CustomButton
  title="Cancel Booking"
  onPress={handleCancel}
  variant="danger"
  shadow
  shadowColor="#EF4444"
/>
```

### CustomDropdown

A feature-rich dropdown component with search, multi-select, and custom styling.

```typescript
import { CustomDropdown } from '@shared/components/forms';

interface CustomDropdownProps<T> {
  name: string;
  control?: Control<FieldValues>;
  options: DropdownOption<T>[];
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  maxSelections?: number;
  disabled?: boolean;
  required?: boolean;
  variant?: 'standard' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onSelectionChange?: (selected: T | T[]) => void;
  renderOption?: (option: DropdownOption<T>) => React.ReactNode;
  renderSelectedItem?: (option: DropdownOption<T>) => React.ReactNode;
  style?: ViewStyle;
  dropdownStyle?: ViewStyle;
  accessibilityLabel?: string;
  testID?: string;
}

interface DropdownOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: React.ReactNode;
  group?: string;
}
```

**Usage Examples:**

```typescript
// Basic dropdown
<CustomDropdown
  name="courseLevel"
  control={control}
  options={[
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
  ]}
  placeholder="Select course level"
  variant="outline"
/>

// Searchable dropdown
<CustomDropdown
  name="instructor"
  control={control}
  options={instructors}
  placeholder="Choose instructor"
  searchable
  leftIcon={<Ionicons name="person" size={20} />}
/>

// Multiple selection
<CustomDropdown
  name="skills"
  control={control}
  options={availableSkills}
  placeholder="Select skills to focus on"
  multiple
  maxSelections={3}
  variant="outline"
/>
```

### CustomCheckBox

A styled checkbox component with label support and validation.

```typescript
import { CustomCheckBox } from '@shared/components/forms';

interface CustomCheckBoxProps {
  name: string;
  control?: Control<FieldValues>;
  label: string;
  disabled?: boolean;
  required?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  onValueChange?: (checked: boolean) => void;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  accessibilityLabel?: string;
  testID?: string;
}
```

**Usage Examples:**

```typescript
// Terms acceptance checkbox
<CustomCheckBox
  name="acceptTerms"
  control={control}
  label="I agree to the Terms of Service and Privacy Policy"
  required
/>

// Settings checkbox
<CustomCheckBox
  name="notifications"
  control={control}
  label="Receive push notifications"
  size="large"
  color="#3B82F6"
/>
```

## 🎨 Shared UI Components

### CustomModal

A flexible modal component with multiple presentation styles and animations.

```typescript
import { CustomModal } from '@shared/components/ui';

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  variant?: 'center' | 'bottom' | 'fullscreen' | 'popover';
  animationType?: 'slide' | 'fade' | 'none';
  dismissible?: boolean;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  title?: string;
  subtitle?: string;
  maxHeight?: number | string;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  backdropStyle?: ViewStyle;
  onShow?: () => void;
  onDismiss?: () => void;
  testID?: string;
}
```

**Usage Examples:**

```typescript
// Bottom sheet modal
<CustomModal
  isVisible={showBookingModal}
  onClose={() => setShowBookingModal(false)}
  variant="bottom"
  title="Book Session"
  subtitle="Choose your preferred time slot"
>
  <BookingForm />
</CustomModal>

// Full screen modal
<CustomModal
  isVisible={showCourseDetail}
  onClose={() => setShowCourseDetail(false)}
  variant="fullscreen"
  animationType="slide"
>
  <CourseDetailContent />
</CustomModal>

// Popover modal
<CustomModal
  isVisible={showFilters}
  onClose={() => setShowFilters(false)}
  variant="popover"
  dismissible
  closeOnBackdrop
>
  <FilterOptions />
</CustomModal>
```

### CustomAlert

A comprehensive alert system with multiple types and actions.

```typescript
import { CustomAlert } from '@shared/components/ui';

interface CustomAlertProps {
  isVisible: boolean;
  onClose: () => void;
  type?: AlertType;
  title: string;
  message?: string;
  position?: AlertPosition;
  duration?: number;
  actions?: AlertAction[];
  showCloseButton?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  messageStyle?: TextStyle;
  testID?: string;
}

type AlertType = 'success' | 'error' | 'warning' | 'info';
type AlertPosition = 'top' | 'center' | 'bottom';

interface AlertAction {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}
```

**Usage Examples:**

```typescript
// Success alert
<CustomAlert
  isVisible={showSuccess}
  onClose={() => setShowSuccess(false)}
  type="success"
  title="Booking Confirmed!"
  message="Your swimming session has been successfully booked."
  position="top"
  duration={3000}
/>

// Error with actions
<CustomAlert
  isVisible={showError}
  onClose={() => setShowError(false)}
  type="error"
  title="Booking Failed"
  message="Unable to complete your booking. Please try again."
  actions={[
    { text: 'Cancel', style: 'cancel' },
    { text: 'Retry', onPress: handleRetry },
  ]}
/>

// Warning with custom icon
<CustomAlert
  isVisible={showWarning}
  onClose={() => setShowWarning(false)}
  type="warning"
  title="Session Starting Soon"
  message="Your swimming lesson starts in 15 minutes."
  icon={<Ionicons name="time" size={24} color="#F59E0B" />}
  position="bottom"
/>
```

### Show (Conditional Rendering)

Advanced conditional rendering components with multiple patterns.

```typescript
import { Show, ShowWhen, ShowElse } from '@shared/components/ui';

// Basic usage
<Show>
  <ShowWhen isTrue={isLoading}>
    <LoadingSpinner />
  </ShowWhen>
  <ShowWhen isTrue={hasError}>
    <ErrorMessage />
  </ShowWhen>
  <ShowElse>
    <CourseContent />
  </ShowElse>
</Show>

// Switch-style rendering
<ShowSwitch value={userRole}>
  <ShowCase value="student">
    <StudentDashboard />
  </ShowCase>
  <ShowCase value="parent">
    <ParentDashboard />
  </ShowCase>
  <ShowDefault>
    <GuestView />
  </ShowDefault>
</ShowSwitch>

// Unless pattern
<ShowUnless isTrue={isOffline}>
  <OnlineFeatures />
</ShowUnless>
```

## 🔐 Authentication Components

### SocialAuthButtons

Pre-built social authentication buttons with platform-specific styling.

```typescript
import { SocialAuthButtons } from '@shared/components/auth';

interface SocialAuthButtonsProps {
  onGooglePress?: () => void;
  onApplePress?: () => void;
  onFacebookPress?: () => void;
  layout?: 'horizontal' | 'vertical' | 'grid';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  showLabels?: boolean;
  style?: ViewStyle;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
}
```

**Usage Examples:**

```typescript
// All social auth options
<SocialAuthButtons
  onGooglePress={handleGoogleAuth}
  onApplePress={handleAppleAuth}
  onFacebookPress={handleFacebookAuth}
  layout="vertical"
  size="large"
  showLabels
/>

// Google only
<SocialAuthButtons
  onGooglePress={handleGoogleAuth}
  layout="horizontal"
  size="medium"
/>
```

## 📊 Chart Components

### PerformanceChart

Interactive charts for displaying student progress and performance data.

```typescript
import { PerformanceChart } from '@shared/components/charts';

interface PerformanceChartProps {
  data: ChartData[];
  type: 'line' | 'bar' | 'area' | 'pie';
  width?: number;
  height?: number;
  color?: string;
  gradientColors?: string[];
  showGrid?: boolean;
  showLabels?: boolean;
  animated?: boolean;
  interactive?: boolean;
  onDataPointPress?: (data: ChartData) => void;
  style?: ViewStyle;
}

interface ChartData {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}
```

**Usage Examples:**

```typescript
// Progress line chart
<PerformanceChart
  data={progressData}
  type="line"
  height={200}
  color="#3B82F6"
  gradientColors={['#3B82F6', '#93C5FD']}
  animated
  interactive
  onDataPointPress={handleDataPointPress}
/>

// Skill distribution pie chart
<PerformanceChart
  data={skillData}
  type="pie"
  width={250}
  height={250}
  showLabels
  animated
/>
```

## 🎯 Multi-Program Components

### ProgramSelector

UI component for switching between different academy programs.

```typescript
import { ProgramSelector } from '@shared/components/program';

interface ProgramSelectorProps {
  variant?: 'button' | 'dropdown' | 'card';
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  showDescription?: boolean;
  disabled?: boolean;
  onProgramChange?: (program: Program) => void;
  style?: ViewStyle;
  buttonStyle?: ViewStyle;
  dropdownStyle?: ViewStyle;
  textStyle?: TextStyle;
}
```

**Usage Examples:**

```typescript
// Simple button selector
<ProgramSelector 
  variant="button" 
  size="medium"
  showIcon
/>

// Dropdown selector
<ProgramSelector 
  variant="dropdown"
  showDescription
  onProgramChange={handleProgramChange}
/>

// Card-style selector
<ProgramSelector 
  variant="card"
  size="large"
  showIcon
  showDescription
/>
```

### ProgramGuard

Component for protecting content based on user roles within programs.

```typescript
import { ProgramGuard } from '@shared/components/program';

interface ProgramGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  minimumRoleLevel?: string;
  allowedRoles?: string[];
  program?: Program;
  fallback?: React.ReactNode;
  showFallback?: boolean;
}
```

**Usage Examples:**

```typescript
// Require specific role
<ProgramGuard requiredRole="parent">
  <ParentOnlyFeatures />
</ProgramGuard>

// Require minimum role level
<ProgramGuard minimumRoleLevel="student">
  <StudentFeatures />
</ProgramGuard>

// Multiple allowed roles
<ProgramGuard allowedRoles={['student', 'parent']}>
  <SharedFeatures />
</ProgramGuard>

// With custom fallback
<ProgramGuard 
  requiredRole="parent"
  fallback={<UnauthorizedMessage />}
>
  <ParentDashboard />
</ProgramGuard>
```

## 🏗️ Component Development Patterns

### Component Structure

All components follow this consistent structure:

```typescript
import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme, createThemedStyles } from '@shared/theme/ThemeProvider';

// 1. Interface definitions
interface ComponentProps {
  // Props with clear documentation
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

// 2. Main component
export const ComponentName: React.FC<ComponentProps> = ({
  title,
  onPress,
  style,
  testID,
}) => {
  // 3. Hooks and state
  const { theme } = useTheme();
  const styles = useThemedStyles();

  // 4. Event handlers
  const handlePress = () => {
    onPress?.();
  };

  // 5. Render
  return (
    <View style={[styles.container, style]} testID={testID}>
      {/* Component content */}
    </View>
  );
};

// 6. Themed styles
const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.primary,
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.md,
    },
  })
);

// 7. Default export
export default ComponentName;
```

### Accessibility Standards

All components implement WCAG 2.1 accessibility guidelines:

```typescript
// Accessibility props
interface AccessibilityProps {
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean;
  };
  testID?: string;
}

// Implementation
<TouchableOpacity
  accessibilityLabel="Enroll in swimming course"
  accessibilityHint="Double tap to start enrollment process"
  accessibilityRole="button"
  accessibilityState={{ disabled: isDisabled }}
  testID="enroll-button"
>
  {/* Button content */}
</TouchableOpacity>
```

### Testing Patterns

Components include comprehensive testing:

```typescript
// Component.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { ComponentName } from './ComponentName';
import { TestWrapper } from '../../../test/TestWrapper';

const renderWithProviders = (props: any = {}) => {
  return render(
    <TestWrapper>
      <ComponentName {...props} />
    </TestWrapper>
  );
};

describe('ComponentName', () => {
  it('renders correctly', () => {
    const { getByTestId } = renderWithProviders({
      title: 'Test Title',
      testID: 'component-name',
    });

    expect(getByTestId('component-name')).toBeTruthy();
  });

  it('handles press events', () => {
    const onPress = jest.fn();
    const { getByTestId } = renderWithProviders({
      title: 'Test Title',
      onPress,
      testID: 'component-name',
    });

    fireEvent.press(getByTestId('component-name'));
    expect(onPress).toHaveBeenCalled();
  });

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: '#FF0000' };
    const { getByTestId } = renderWithProviders({
      title: 'Test Title',
      style: customStyle,
      testID: 'component-name',
    });

    const component = getByTestId('component-name');
    expect(component.props.style).toContainEqual(customStyle);
  });
});
```

### Performance Optimization

Components use React optimization techniques:

```typescript
import React, { memo, useCallback, useMemo } from 'react';

// Memoized component
export const OptimizedComponent = memo<ComponentProps>(({
  data,
  onItemPress,
  style,
}) => {
  // Memoized calculations
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      displayName: `${item.firstName} ${item.lastName}`,
    }));
  }, [data]);

  // Memoized callbacks
  const handleItemPress = useCallback((item: Item) => {
    onItemPress?.(item);
  }, [onItemPress]);

  return (
    <FlatList
      data={processedData}
      renderItem={({ item }) => (
        <ItemComponent
          key={item.id}
          item={item}
          onPress={handleItemPress}
        />
      )}
      keyExtractor={(item) => item.id}
      style={style}
    />
  );
});
```

---

This component documentation provides comprehensive guidance for using and developing components in the Academy Students App, ensuring consistency, accessibility, and performance across the application.