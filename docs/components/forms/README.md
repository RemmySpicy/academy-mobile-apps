# Form Components

The Academy Mobile Apps include a comprehensive set of form components built with React Hook Form integration, accessibility support, and consistent styling.

## 🎯 Overview

All form components are designed with:
- **React Hook Form Integration** - Built-in validation and error handling
- **Accessibility First** - Screen reader support, proper focus management
- **Consistent Styling** - Unified design system across all components
- **TypeScript Support** - Full type safety with comprehensive interfaces
- **Performance Optimized** - React.memo and efficient re-rendering
- **Cross-Platform** - Works seamlessly on iOS and Android

## 📋 Available Components

### Core Input Components
- [**CustomInput**](./CUSTOM_INPUT.md) - Text input with variants and validation
- [**CustomDropdown**](./CUSTOM_DROPDOWN.md) - Dropdown/select with modal interface
- [**CustomTextArea**](./CUSTOM_TEXTAREA.md) - Multi-line text input with character counting

### Specialized Input Components
- [**OtpField**](./OTP_FIELD.md) - One-time password input with visual boxes
- [**QuantityController**](./QUANTITY_CONTROLLER.md) - Numeric input with increment/decrement

### Selection Components
- [**CustomCheckBox**](./CUSTOM_CHECKBOX.md) - Checkbox with multiple variants
- [**RadioButton**](./RADIO_BUTTON.md) - Radio button and radio group components

## 🚀 Quick Start

### Basic Form Setup

```typescript
import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  CustomInput, 
  CustomDropdown, 
  CustomCheckBox,
  SubmitButton 
} from '@shared';

interface UserForm {
  name: string;
  email: string;
  course: string;
  agreeToTerms: boolean;
}

export default function UserFormExample() {
  const { control, handleSubmit, watch } = useForm<UserForm>();
  
  const onSubmit = (data: UserForm) => {
    console.log('Form data:', data);
  };
  
  return (
    <View style={styles.container}>
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
      
      <SubmitButton
        title="Submit"
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
}
```

## 🎨 Design System

### Color Variants

All form components support consistent color variants:

```typescript
type ComponentVariant = 
  | 'primary'    // Academy purple theme
  | 'secondary'  // Gray theme
  | 'success'    // Green theme
  | 'warning'    // Orange theme
  | 'danger'     // Red theme
  | 'info'       // Blue theme
  | 'outline'    // Outlined style
  | 'ghost';     // Minimal style
```

### Size Options

Components support three standard sizes:

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

### Theme Colors

```typescript
const theme = {
  colors: {
    primary: '#4F2EC9',      // Academy purple
    secondary: '#5B5F5F',    // Gray
    success: '#10B981',      // Green
    warning: '#F59E0B',      // Orange
    danger: '#EF4444',       // Red
    info: '#3B82F6',         // Blue
    
    // Neutrals
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
  }
};
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
- **Focus indicators** clearly visible
- **Keyboard shortcuts** for common actions
- **Enter key handling** for form submission

### Color Accessibility

- **High contrast** color combinations
- **Color blind friendly** palette
- **Focus indicators** that don't rely solely on color
- **Error states** with icons and text, not just color

## 🔧 Advanced Usage

### Custom Validation Rules

```typescript
import { useForm } from 'react-hook-form';

const { control } = useForm({
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

function DynamicForm() {
  const { control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'students'
  });
  
  return (
    <View>
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
          
          <Button
            title="Remove"
            onPress={() => remove(index)}
            variant="danger"
          />
        </View>
      ))}
      
      <Button
        title="Add Student"
        onPress={() => append({ name: '', age: '' })}
        variant="outline"
      />
    </View>
  );
}
```

### Conditional Fields

```typescript
function ConditionalForm() {
  const { control, watch } = useForm();
  const userType = watch('userType');
  
  return (
    <View>
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
          options={[
            { label: 'Swimming', value: 'swimming' },
            { label: 'Tennis', value: 'tennis' },
          ]}
          rules={{ required: 'Specialization is required' }}
        />
      )}
    </View>
  );
}
```

## 🧪 Testing Form Components

### Unit Testing

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { useForm } from 'react-hook-form';
import { CustomInput } from '@shared';

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

test('form submission with validation', async () => {
  const onSubmit = jest.fn();
  const { getByPlaceholderText, getByText } = render(
    <UserForm onSubmit={onSubmit} />
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

### From basic TextInput

```typescript
// Old approach
<TextInput
  placeholder="Email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  style={styles.input}
/>

// New approach with validation
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

### From Picker components

```typescript
// Old approach
<Picker
  selectedValue={course}
  onValueChange={setCourse}
  style={styles.picker}
>
  <Picker.Item label="Swimming" value="swimming" />
  <Picker.Item label="Tennis" value="tennis" />
</Picker>

// New approach
<CustomDropdown
  name="course"
  control={control}
  placeholder="Select course"
  options={[
    { label: 'Swimming', value: 'swimming' },
    { label: 'Tennis', value: 'tennis' },
  ]}
  rules={{ required: 'Please select a course' }}
/>
```

## 📱 Platform Considerations

### iOS Specific Features
- **Native feel** with proper iOS styling
- **Keyboard handling** with proper return key behavior
- **Focus management** following iOS patterns

### Android Specific Features
- **Material Design** elements where appropriate
- **Android keyboard** handling and behavior
- **Focus indicators** following Android accessibility guidelines

## 🎯 Best Practices

### Performance

1. **Use React.memo** for components that don't need frequent re-renders
2. **Optimize re-renders** with proper dependency arrays
3. **Lazy load** heavy components when possible

### Accessibility

1. **Always provide** accessibility labels and hints
2. **Test with screen readers** on both platforms
3. **Ensure proper focus order** for keyboard navigation

### Validation

1. **Validate on appropriate events** (onChange, onBlur, onSubmit)
2. **Provide clear error messages** that help users fix issues
3. **Use consistent validation patterns** across the app

### Styling

1. **Use the design system** colors and spacing
2. **Maintain consistency** across all forms
3. **Test on different screen sizes** and orientations

For detailed documentation on specific components, see the individual component documentation files in this directory.