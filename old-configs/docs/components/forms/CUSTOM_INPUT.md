# CustomInput Component

A versatile, accessible text input component with React Hook Form integration, validation support, and multiple styling variants.

## 🎯 Overview

The `CustomInput` component provides a consistent, accessible text input field that integrates seamlessly with React Hook Form for validation and state management.

## 🚀 Basic Usage

```typescript
import { CustomInput } from '@shared';
import { useForm } from 'react-hook-form';

function MyForm() {
  const { control } = useForm();
  
  return (
    <CustomInput
      name="email"
      control={control}
      placeholder="Enter your email"
      keyboardType="email-address"
      rules={{ required: 'Email is required' }}
    />
  );
}
```

## 📋 Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Field name for React Hook Form registration |
| `control` | `Control` | React Hook Form control object |
| `placeholder` | `string` | Placeholder text shown when input is empty |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'standard' \| 'outline' \| 'ghost' \| 'password'` | `'standard'` | Visual style variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the input field |
| `leftIcon` | `React.ReactNode` | - | Icon displayed on the left side |
| `rightIcon` | `React.ReactNode` | - | Icon displayed on the right side |
| `secureTextEntry` | `boolean` | `false` | Whether to hide text (for passwords) |
| `showPasswordToggle` | `boolean` | `false` | Show password visibility toggle |
| `multiline` | `boolean` | `false` | Allow multiple lines of text |
| `numberOfLines` | `number` | `1` | Number of lines for multiline input |
| `keyboardType` | `KeyboardTypeOptions` | `'default'` | Keyboard type to display |
| `maxLength` | `number` | - | Maximum number of characters |
| `editable` | `boolean` | `true` | Whether the input is editable |
| `autoFocus` | `boolean` | `false` | Auto focus on component mount |
| `returnKeyType` | `ReturnKeyTypeOptions` | `'default'` | Return key type |
| `onValueChange` | `(value: string) => void` | - | Callback when value changes |
| `rules` | `ValidationRules` | - | React Hook Form validation rules |

### Accessibility Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `accessibilityLabel` | `string` | - | Label for screen readers |
| `accessibilityHint` | `string` | - | Additional context for screen readers |
| `required` | `boolean` | `false` | Indicates required field to screen readers |

## 🎨 Variants

### Standard (Default)
Clean, minimal input with subtle border and focus states.

```typescript
<CustomInput
  name="name"
  control={control}
  placeholder="Full Name"
  variant="standard"
/>
```

### Outline
Input with prominent border outline.

```typescript
<CustomInput
  name="email"
  control={control}
  placeholder="Email Address"
  variant="outline"
/>
```

### Ghost
Minimal input with no border, only background change on focus.

```typescript
<CustomInput
  name="search"
  control={control}
  placeholder="Search..."
  variant="ghost"
/>
```

### Password
Specialized variant for password inputs with built-in security features.

```typescript
<CustomInput
  name="password"
  control={control}
  placeholder="Password"
  variant="password"
  secureTextEntry
  showPasswordToggle
/>
```

## 📏 Sizes

### Small
Compact input for tight layouts.

```typescript
<CustomInput
  name="code"
  control={control}
  placeholder="Code"
  size="small"
/>
```

### Medium (Default)
Standard size for most use cases.

```typescript
<CustomInput
  name="name"
  control={control}
  placeholder="Name"
  size="medium"
/>
```

### Large
Prominent input for important fields.

```typescript
<CustomInput
  name="title"
  control={control}
  placeholder="Title"
  size="large"
/>
```

## 🎭 With Icons

### Left Icon

```typescript
import { Iconify } from 'react-native-iconify';

<CustomInput
  name="email"
  control={control}
  placeholder="Email Address"
  leftIcon={<Iconify icon="ri:mail-line" size={20} color="#6B7280" />}
  keyboardType="email-address"
/>
```

### Right Icon

```typescript
<CustomInput
  name="search"
  control={control}
  placeholder="Search..."
  rightIcon={<Iconify icon="ri:search-line" size={20} color="#6B7280" />}
/>
```

### Password Toggle

```typescript
<CustomInput
  name="password"
  control={control}
  placeholder="Password"
  secureTextEntry
  showPasswordToggle // Automatically adds eye/eye-off toggle
/>
```

## 📝 Multiline Usage

### Basic Multiline

```typescript
<CustomInput
  name="description"
  control={control}
  placeholder="Enter description..."
  multiline
  numberOfLines={4}
/>
```

### Auto-expanding Multiline

```typescript
<CustomInput
  name="notes"
  control={control}
  placeholder="Add your notes..."
  multiline
  numberOfLines={2}
  maxLength={500}
/>
```

## ✅ Validation

### Basic Validation

```typescript
<CustomInput
  name="email"
  control={control}
  placeholder="Email Address"
  keyboardType="email-address"
  rules={{
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Please enter a valid email address'
    }
  }}
/>
```

### Advanced Validation

```typescript
import { useForm } from 'react-hook-form';

function PasswordForm() {
  const { control, watch } = useForm();
  
  return (
    <>
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
          },
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            message: 'Password must contain uppercase, lowercase, number, and special character'
          }
        }}
      />
      
      <CustomInput
        name="confirmPassword"
        control={control}
        placeholder="Confirm Password"
        secureTextEntry
        showPasswordToggle
        rules={{
          required: 'Please confirm your password',
          validate: (value) => {
            const password = watch('password');
            return value === password || 'Passwords do not match';
          }
        }}
      />
    </>
  );
}
```

### Custom Validation

```typescript
<CustomInput
  name="username"
  control={control}
  placeholder="Username"
  rules={{
    required: 'Username is required',
    minLength: {
      value: 3,
      message: 'Username must be at least 3 characters'
    },
    validate: async (value) => {
      // Custom async validation
      const isAvailable = await checkUsernameAvailability(value);
      return isAvailable || 'Username is already taken';
    }
  }}
/>
```

## ♿ Accessibility

### Screen Reader Support

```typescript
<CustomInput
  name="email"
  control={control}
  placeholder="Email Address"
  accessibilityLabel="Email address input field"
  accessibilityHint="Enter your email address to create an account"
  required
/>
```

### Focus Management

```typescript
import { useRef } from 'react';

function LoginForm() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  
  return (
    <>
      <CustomInput
        ref={emailRef}
        name="email"
        control={control}
        placeholder="Email"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      
      <CustomInput
        ref={passwordRef}
        name="password"
        control={control}
        placeholder="Password"
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
    </>
  );
}
```

## 🎨 Custom Styling

### Theme Integration

```typescript
const styles = StyleSheet.create({
  customInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    fontSize: 16,
  },
});

<CustomInput
  name="custom"
  control={control}
  placeholder="Custom styled input"
  style={styles.customInput}
/>
```

### Conditional Styling

```typescript
function ConditionalStyledInput() {
  const { watch } = useForm();
  const value = watch('status');
  
  return (
    <CustomInput
      name="status"
      control={control}
      placeholder="Status"
      variant={value === 'error' ? 'danger' : 'standard'}
      leftIcon={
        value === 'error' ? 
          <Iconify icon="ri:error-warning-line" size={20} color="#EF4444" /> :
          <Iconify icon="ri:check-line" size={20} color="#10B981" />
      }
    />
  );
}
```

## 📱 Platform Differences

### iOS Specific

```typescript
<CustomInput
  name="phone"
  control={control}
  placeholder="Phone Number"
  keyboardType="phone-pad"
  returnKeyType="done"
  autoCapitalize="none"
  autoCorrect={false}
/>
```

### Android Specific

```typescript
<CustomInput
  name="search"
  control={control}
  placeholder="Search..."
  keyboardType="web-search"
  returnKeyType="search"
  selectTextOnFocus
/>
```

## 🧪 Testing

### Unit Tests

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
      rules={{ required: 'Required field' }}
    />
  );
}

test('displays validation error', async () => {
  const { getByPlaceholderText, getByText } = render(<TestForm />);
  
  const input = getByPlaceholderText('Test input');
  
  fireEvent(input, 'focus');
  fireEvent(input, 'blur');
  
  await waitFor(() => {
    expect(getByText('Required field')).toBeTruthy();
  });
});

test('handles text input correctly', () => {
  const { getByPlaceholderText } = render(<TestForm />);
  
  const input = getByPlaceholderText('Test input');
  
  fireEvent.changeText(input, 'test value');
  
  expect(input.props.value).toBe('test value');
});
```

### Accessibility Tests

```typescript
test('has proper accessibility attributes', () => {
  const { getByLabelText } = render(
    <TestForm 
      accessibilityLabel="Email input"
      accessibilityHint="Enter your email"
      required
    />
  );
  
  const input = getByLabelText('Email input');
  
  expect(input).toHaveAccessibilityState({ required: true });
  expect(input.props.accessibilityHint).toBe('Enter your email');
});
```

## 🚫 Common Pitfalls

### 1. Missing Control Object

```typescript
// ❌ Wrong - missing control
<CustomInput name="email" placeholder="Email" />

// ✅ Correct - with control from useForm
const { control } = useForm();
<CustomInput name="email" control={control} placeholder="Email" />
```

### 2. Incorrect Validation Rules

```typescript
// ❌ Wrong - validation object structure
<CustomInput
  name="email"
  control={control}
  validation={{ required: true }}
/>

// ✅ Correct - using rules prop
<CustomInput
  name="email"
  control={control}
  rules={{ required: 'Email is required' }}
/>
```

### 3. Performance Issues

```typescript
// ❌ Wrong - inline object causes re-renders
<CustomInput
  name="email"
  control={control}
  rules={{ required: 'Email is required' }}
/>

// ✅ Better - memoize validation rules
const emailRules = useMemo(() => ({
  required: 'Email is required',
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Invalid email'
  }
}), []);

<CustomInput
  name="email"
  control={control}
  rules={emailRules}
/>
```

## 🔄 Migration Guide

### From Basic TextInput

```typescript
// Old approach
const [email, setEmail] = useState('');
const [error, setError] = useState('');

<TextInput
  value={email}
  onChangeText={setEmail}
  placeholder="Email"
  style={styles.input}
/>
{error && <Text style={styles.error}>{error}</Text>}

// New approach
const { control } = useForm();

<CustomInput
  name="email"
  control={control}
  placeholder="Email"
  rules={{ required: 'Email is required' }}
/>
```

The `CustomInput` component provides a robust, accessible, and consistent text input solution that integrates seamlessly with the Academy Mobile Apps form system.