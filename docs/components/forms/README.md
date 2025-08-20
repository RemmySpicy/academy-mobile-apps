# Form Components

The Academy Mobile Apps include a comprehensive set of form components built with React Hook Form integration, accessibility support, and consistent Academy theming.

## 🎯 Overview

All form components are designed with:
- **React Hook Form Integration** - Built-in validation and error handling
- **Academy Theming** - Consistent Academy purple (#4F2EC9) branding
- **Accessibility First** - Screen reader support, proper focus management
- **TypeScript Support** - Full type safety with comprehensive interfaces
- **Performance Optimized** - React.memo and efficient re-rendering
- **Cross-Platform** - Works seamlessly on iOS and Android

## 📋 Available Components

### Core Input Components
- **[CustomInput](./CUSTOM_INPUT.md)** - Text input with variants and validation
- **CustomTextArea** - Multi-line text input with character counting
- **CustomDropdown** - Dropdown/select with modal interface

### Specialized Input Components
- **OtpField** - One-time password input with visual boxes
- **QuantityController** - Numeric input with increment/decrement buttons

### Selection Components
- **CustomCheckBox** - Checkbox with Academy theming and multiple variants
- **RadioCustomButton** - Radio button and radio group components

### Form Utilities
- **CustomButton** - Enhanced Academy-themed buttons with 18 variants, loading states, and icon support
- **Form** - Main form wrapper with validation and submission handling
- **LegacyForm** - Compatibility form wrapper for existing code

## 🚀 Quick Start

### Basic Form Setup

```typescript
import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  CustomInput, 
  CustomDropdown, 
  CustomCheckBox,
  CustomButton,
  Form
} from '@academy/mobile-shared';

interface UserForm {
  name: string;
  email: string;
  course: string;
  agreeToTerms: boolean;
}

export default function UserFormExample() {
  const { control, handleSubmit, formState: { errors } } = useForm<UserForm>();
  
  const onSubmit = (data: UserForm) => {
    console.log('Form data:', data);
  };
  
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <CustomInput
        name="name"
        control={control}
        placeholder="Full Name"
        rules={{ required: 'Name is required' }}
      />
      
      <CustomInput
        name="email"
        control={control}
        placeholder="Email Address"
        keyboardType="email-address"
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        }}
      />
      
      <CustomDropdown
        name="course"
        control={control}
        placeholder="Select a course"
        options={[
          { label: 'Swimming', value: 'swimming' },
          { label: 'Tennis', value: 'tennis' },
          { label: 'Football', value: 'football' },
        ]}
        rules={{ required: 'Please select a course' }}
      />
      
      <CustomCheckBox
        name="agreeToTerms"
        control={control}
        label="I agree to the terms and conditions"
        rules={{ required: 'You must agree to the terms' }}
      />
      
      <CustomButton
        title="Submit"
        onPress={handleSubmit(onSubmit)}
        variant="primary"
        loading={false}
      />
    </Form>
  );
}
```

## 🎨 Academy Design System Integration

### Color Variants

All form components support Academy's design system colors:

```typescript
type ComponentVariant = 
  | 'primary'    // Academy purple (#4F2EC9)
  | 'secondary'  // Gray theme
  | 'success'    // Green theme
  | 'warning'    // Orange theme
  | 'danger'     // Red theme
  | 'info'       // Blue theme
  | 'outline'    // Outlined style
  | 'ghost';     // Minimal style
```

### Size Options

Components support consistent sizing:

```typescript
type ComponentSize = 'small' | 'medium' | 'large';

// Example usage
<CustomInput
  name="example"
  control={control}
  size="large"
  variant="primary"
/>
```

### Enhanced CustomButton Component

The enhanced CustomButton component provides comprehensive Academy-themed styling with 18 variants:

```typescript
import { CustomButton } from '@academy/mobile-shared';

// Primary Variants
<CustomButton title="Primary" variant="primary" />     // Academy purple (#4F2EC9)
<CustomButton title="Teal" variant="teal" />           // Academy teal (#52E2BB)
<CustomButton title="Secondary" variant="secondary" /> // Clean neutral button
<CustomButton title="Ghost" variant="ghost" />         // Transparent background

// Outline Variants
<CustomButton title="Outline" variant="outline" />           // Light background
<CustomButton title="Outline Theme" variant="outlineTheme" /> // Academy purple border
<CustomButton title="Outline Teal" variant="outlineTeal" />   // Academy teal border

// Status Variants
<CustomButton title="Success" variant="success" />     // Green for positive actions
<CustomButton title="Warning" variant="warning" />     // Amber for caution
<CustomButton title="Danger" variant="danger" />       // Red for destructive actions
<CustomButton title="Info" variant="info" />           // Blue for informational

// Utility Variants
<CustomButton title="Faded" variant="faded" />         // Academy faded theme
<CustomButton title="Orange" variant="orange" />       // Academy orange
<CustomButton title="Gray" variant="gray" />           // Neutral gray
<CustomButton title="Light Gray" variant="lightGray" /> // Even lighter gray
<CustomButton title="Black" variant="black" />         // Dark theme
<CustomButton title="Cancel" variant="cancel" />       // Cancel actions
<CustomButton title="Normal" variant="normal" />       // Default neutral

// 2 Button Sizes (optimized for mobile)
<CustomButton title="Small" variant="primary" size="sm" />   // 36px height
<CustomButton title="Medium" variant="primary" size="md" />  // 48px height

// Enhanced Features with Icons
<CustomButton 
  title="With Icons" 
  variant="primary"
  startIcon={<Ionicons name="save" size={16} color="white" />}
  endIcon={<Ionicons name="arrow-forward" size={16} color="white" />}
/>

// Loading States
<CustomButton title="Loading" variant="primary" isLoading={true} />
<CustomButton title="Disabled" variant="primary" disabled />
<CustomButton title="With Shadow" variant="primary" shadow={true} />
```

### Academy Theme Colors

```typescript
// Use Academy theme variables
import { useTheme } from '@academy/mobile-shared';

const { theme } = useTheme();

// Academy brand colors
theme.colors.interactive.primary    // #4F2EC9 Academy purple
theme.colors.interactive.teal       // #52E2BB Academy teal
theme.colors.interactive.orange     // #FEAE24 Academy orange
theme.colors.interactive.themeBlack // #121212 Academy black

// Status colors
theme.colors.status.success         // Green
theme.colors.status.warning         // Orange
theme.colors.status.error           // Red
theme.colors.status.info            // Blue
```

## ♿ Accessibility Features

### Screen Reader Support

All components include:
- **Accessibility labels** for screen readers
- **Accessibility hints** for additional context
- **Accessibility roles** for proper identification
- **State announcements** for value changes

```typescript
<CustomInput
  name="email"
  control={control}
  placeholder="Email Address"
  accessibilityLabel="Email address input field"
  accessibilityHint="Enter your email address for account access"
/>
```

### Keyboard Navigation

- **Tab order** properly managed
- **Focus indicators** clearly visible with Academy theming
- **Keyboard shortcuts** for common actions
- **Enter key handling** for form submission

### Color Accessibility

- **High contrast** color combinations meeting WCAG 2.1 AA
- **Color blind friendly** Academy palette
- **Focus indicators** that don't rely solely on color
- **Error states** with icons and text, not just color

## 🔧 Advanced Usage

### Custom Validation Rules

```typescript
import { useForm } from 'react-hook-form';

const { control, watch } = useForm({
  mode: 'onChange', // Validate on change
  defaultValues: {
    password: '',
    confirmPassword: '',
  }
});

<CustomInput
  name="password"
  control={control}
  placeholder="Password"
  secureTextEntry
  rules={{
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters'
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: 'Password must contain uppercase, lowercase, and number'
    }
  }}
/>

<CustomInput
  name="confirmPassword"
  control={control}
  placeholder="Confirm Password"
  secureTextEntry
  rules={{
    required: 'Please confirm your password',
    validate: (value) => {
      const password = watch('password');
      return value === password || 'Passwords do not match';
    }
  }}
/>
```

### Dynamic Form Fields

```typescript
import { useFieldArray } from 'react-hook-form';

function DynamicStudentForm() {
  const { control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'students'
  });
  
  return (
    <Form>
      {fields.map((field, index) => (
        <View key={field.id} style={styles.fieldGroup}>
          <CustomInput
            name={`students.${index}.name`}
            control={control}
            placeholder="Student Name"
            rules={{ required: 'Name is required' }}
          />
          
          <CustomInput
            name={`students.${index}.age`}
            control={control}
            placeholder="Age"
            keyboardType="numeric"
            rules={{ required: 'Age is required' }}
          />
          
          <CustomButton
            title="Remove Student"
            onPress={() => remove(index)}
            variant="danger"
            size="small"
          />
        </View>
      ))}
      
      <CustomButton
        title="Add Student"
        onPress={() => append({ name: '', age: '' })}
        variant="outline"
      />
    </Form>
  );
}
```

### Conditional Fields with Program Context

```typescript
import { useProgramContext } from '@academy/mobile-shared';

function ConditionalForm() {
  const { control, watch } = useForm();
  const { currentProgram } = useProgramContext();
  const userType = watch('userType');
  
  return (
    <Form>
      <CustomDropdown
        name="userType"
        control={control}
        placeholder="Select user type"
        options={[
          { label: 'Student', value: 'student' },
          { label: 'Parent', value: 'parent' },
          { label: 'Instructor', value: 'instructor' },
        ]}
        rules={{ required: 'Please select user type' }}
      />
      
      {userType === 'parent' && (
        <CustomInput
          name="childName"
          control={control}
          placeholder="Child's Name"
          rules={{ required: 'Child name is required' }}
        />
      )}
      
      {userType === 'instructor' && (
        <CustomDropdown
          name="specialization"
          control={control}
          placeholder="Specialization"
          options={currentProgram?.availableSpecializations || []}
          rules={{ required: 'Specialization is required' }}
        />
      )}
    </Form>
  );
}
```

## 🧪 Testing Form Components

### Unit Testing

```typescript
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useForm } from 'react-hook-form';
import { CustomInput } from '@academy/mobile-shared';

function TestForm() {
  const { control } = useForm();
  return (
    <CustomInput
      name="test"
      control={control}
      placeholder="Test input"
      rules={{ required: 'This field is required' }}
    />
  );
}

test('shows validation error for required field', async () => {
  const { getByPlaceholderText, getByText } = render(<TestForm />);
  
  const input = getByPlaceholderText('Test input');
  
  // Focus and blur without entering text
  fireEvent(input, 'focus');
  fireEvent(input, 'blur');
  
  // Check for error message
  await waitFor(() => {
    expect(getByText('This field is required')).toBeTruthy();
  });
});
```

### Integration Testing

```typescript
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ThemeProvider } from '@academy/mobile-shared';

test('form submission with Academy theming', async () => {
  const onSubmit = jest.fn();
  const { getByPlaceholderText, getByText } = render(
    <ThemeProvider>
      <UserForm onSubmit={onSubmit} />
    </ThemeProvider>
  );
  
  // Fill form fields
  fireEvent.changeText(getByPlaceholderText('Name'), 'John Doe');
  fireEvent.changeText(getByPlaceholderText('Email'), 'john@example.com');
  
  // Submit form
  fireEvent.press(getByText('Submit'));
  
  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com'
    });
  });
});
```

## 🔄 Migration from Existing Components

### From existing-code/ Components

```typescript
// Old approach (from existing-code/)
import { customInput } from '../existing-code/src/components/form/customInput';

// New approach with Academy theming
import { CustomInput } from '@academy/mobile-shared';

<CustomInput
  name="email"
  control={control}
  placeholder="Email"
  keyboardType="email-address"
  variant="primary" // Academy purple styling
  rules={{
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address'
    }
  }}
/>
```

### From basic React Native components

```typescript
// Old approach
<TextInput
  placeholder="Email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  style={styles.input}
/>

// New approach with validation and Academy theming
<CustomInput
  name="email"
  control={control}
  placeholder="Email"
  keyboardType="email-address"
  rules={{
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address'
    }
  }}
/>
```

## 📱 Platform Considerations

### iOS Specific Features
- **Native feel** with Academy-themed iOS styling
- **Keyboard handling** with proper return key behavior
- **Focus management** following iOS accessibility patterns

### Android Specific Features
- **Material Design** elements with Academy branding
- **Android keyboard** handling and behavior
- **Focus indicators** following Android accessibility guidelines

## 🎯 Best Practices

### Performance
1. **Use React.memo** for components that don't need frequent re-renders
2. **Optimize re-renders** with proper dependency arrays
3. **Use Form wrapper** for complex forms to optimize validation

### Accessibility
1. **Always provide** accessibility labels and hints
2. **Test with screen readers** on both platforms
3. **Ensure proper focus order** for keyboard navigation
4. **Use Academy high-contrast colors** for better visibility

### Validation
1. **Validate on appropriate events** (onChange, onBlur, onSubmit)
2. **Provide clear error messages** that help users fix issues
3. **Use consistent validation patterns** across the Academy apps

### Academy Theming
1. **Use Academy color variants** (`primary`, `secondary`, etc.)
2. **Follow Academy spacing** with theme tokens
3. **Maintain consistency** across instructor and student apps
4. **Test in all theme modes** (light, dark, night)

## 📚 Related Documentation

- **[Custom Input Details](./CUSTOM_INPUT.md)** - Comprehensive CustomInput documentation
- **[Academy Theme System](../../THEME_SYSTEM.md)** - Complete theming guide
- **[Enhanced Components](../ENHANCED_COMPONENTS.md)** - Academy-specific component features
- **[Authentication Integration](../../authentication/README.md)** - Using forms with auth

## 📋 Component Development Checklist

When creating or updating form components:

- [ ] Use Academy theme system (`useTheme` hook)
- [ ] Implement React Hook Form integration
- [ ] Add comprehensive accessibility support
- [ ] Include TypeScript interfaces and prop documentation
- [ ] Test with all Academy theme variants
- [ ] Verify keyboard navigation works properly
- [ ] Add unit and integration tests
- [ ] Document usage examples and best practices

The Academy form components provide a robust, accessible, and beautifully themed foundation for building user interfaces across both instructor and student mobile applications.