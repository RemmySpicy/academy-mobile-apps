# FormDropdown Component

A traditional modal-based dropdown component designed for forms with React Hook Form integration, search capability, and Academy theming.

## Overview

The `FormDropdown` component provides a standard dropdown picker interface using a modal bottom sheet. It's ideal for traditional form fields, large option sets with search functionality, and scenarios where a compact trigger is needed with an expanded selection interface.

## Features

- ✅ **Modal-based selection** - Full-screen modal with bottom sheet presentation
- ✅ **Search capability** - Built-in search/filter for large option sets
- ✅ **Form integration** - React Hook Form ready with validation support
- ✅ **Error states** - Form validation and error message display
- ✅ **Icon support** - Ionicons in options and trigger
- ✅ **Required field indicator** - Visual required field marking
- ✅ **Disabled states** - Component and individual option disabling
- ✅ **Academy theming** - Consistent styling with Academy brand colors
- ✅ **TypeScript support** - Complete type safety
- ✅ **Accessibility** - Full screen reader and keyboard support

## Basic Usage

```typescript
import React, { useState } from 'react';
import { FormDropdown } from '@academy/mobile-shared';

function InstructorSelector() {
  const [selectedInstructor, setSelectedInstructor] = useState<string>('');

  const instructors = [
    { id: '1', label: 'Sarah Johnson', value: 'sarah_johnson', icon: 'person' },
    { id: '2', label: 'Mike Chen', value: 'mike_chen', icon: 'person' },
    { id: '3', label: 'Emma Wilson', value: 'emma_wilson', icon: 'person' },
  ];

  return (
    <FormDropdown
      label="Assign Instructor"
      options={instructors}
      value={selectedInstructor}
      onSelectionChange={setSelectedInstructor}
      placeholder="Select an instructor"
      required
    />
  );
}
```

## Props

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | **Required** | Label text displayed above the dropdown |
| `options` | `DropdownOption[] \| string[]` | **Required** | Array of options to display |
| `value` | `string` | `undefined` | Selected value |
| `onSelectionChange` | `(selected: string) => void` | `undefined` | Callback when selection changes |
| `placeholder` | `string` | `"Select an option"` | Placeholder text when no selection |

### Form Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `error` | `string` | `undefined` | Error message to display |
| `required` | `boolean` | `false` | Required field indicator |
| `disabled` | `boolean` | `false` | Disabled state |

### Feature Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `searchable` | `boolean` | `false` | Enable search/filter functionality |

### Styling Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `style` | `ViewStyle` | `undefined` | Custom container styles |
| `triggerStyle` | `ViewStyle` | `undefined` | Custom dropdown trigger styles |
| `labelStyle` | `TextStyle` | `undefined` | Custom label styles |

### Testing Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `testID` | `string` | `'form-dropdown'` | Test ID for testing |

## Types

### DropdownOption Interface

```typescript
export interface DropdownOption {
  /** Unique identifier for the option */
  id: string;
  /** Display label for the option */
  label: string;
  /** Optional value (defaults to id if not provided) */
  value?: string;
  /** Whether this option is disabled */
  disabled?: boolean;
  /** Optional icon name from Ionicons */
  icon?: string;
}
```

## Usage Examples

### Basic Form Integration

```typescript
import { useForm, Controller } from 'react-hook-form';
import { FormDropdown } from '@academy/mobile-shared';

function ProgramForm() {
  const { control, handleSubmit, formState: { errors } } = useForm();

  const programs = [
    { id: 'swim', label: 'Swimming Program', value: 'swimming', icon: 'water' },
    { id: 'football', label: 'Football Training', value: 'football', icon: 'football' },
    { id: 'basketball', label: 'Basketball Skills', value: 'basketball', icon: 'basketball' },
  ];

  return (
    <Controller
      name="program"
      control={control}
      rules={{ required: 'Please select a program' }}
      render={({ field: { onChange, value } }) => (
        <FormDropdown
          label="Program Type"
          options={programs}
          value={value}
          onSelectionChange={onChange}
          placeholder="Select a program"
          error={errors.program?.message}
          required
        />
      )}
    />
  );
}
```

### Searchable Large Option Set

```typescript
function InstructorAssignment() {
  const [selectedInstructor, setSelectedInstructor] = useState<string>('');

  // Large option set (50+ instructors)
  const instructors = Array.from({ length: 50 }, (_, i) => ({
    id: `instructor-${i}`,
    label: `Instructor ${i + 1} - ${getRandomName()}`,
    value: `instructor_${i}`,
    icon: 'person',
  }));

  return (
    <FormDropdown
      label="Assign Instructor"
      options={instructors}
      value={selectedInstructor}
      onSelectionChange={setSelectedInstructor}
      placeholder="Search and select instructor"
      searchable
      required
    />
  );
}
```

### With Error Validation

```typescript
function ValidatedDropdown() {
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSelectionChange = (selected: string) => {
    setValue(selected);
    
    // Clear error when user makes selection
    if (error) {
      setError('');
    }
  };

  const validateSelection = () => {
    if (!value) {
      setError('This field is required');
      return false;
    }
    return true;
  };

  return (
    <FormDropdown
      label="Required Selection"
      options={['Option 1', 'Option 2', 'Option 3']}
      value={value}
      onSelectionChange={handleSelectionChange}
      placeholder="Make a selection"
      error={error}
      required
    />
  );
}
```

### Disabled State

```typescript
function DisabledDropdown() {
  return (
    <FormDropdown
      label="Locked Field"
      options={['Cannot', 'Be', 'Changed']}
      value="Cannot"
      disabled
      placeholder="Field is locked"
    />
  );
}
```

### Custom Styling

```typescript
import { useTheme } from '@academy/mobile-shared';

function CustomStyledDropdown() {
  const { theme } = useTheme();

  return (
    <FormDropdown
      label="Custom Styled"
      options={['Option 1', 'Option 2']}
      style={{
        marginVertical: theme.spacing.lg,
      }}
      triggerStyle={{
        backgroundColor: theme.colors.background.secondary,
        borderColor: theme.colors.interactive.primary,
        borderWidth: 2,
      }}
      labelStyle={{
        color: theme.colors.interactive.primary,
        fontSize: theme.fontSizes.lg,
      }}
    />
  );
}
```

## Modal Interface

### Modal Features

- **Bottom Sheet Presentation**: Slides up from bottom with smooth animation
- **Safe Area Handling**: Proper insets on all devices including iPhone with notch
- **Close Interaction**: Tap outside or use close button to dismiss
- **Keyboard Friendly**: Proper keyboard handling for search input

### Search Functionality

When `searchable={true}`:

- **Real-time Filter**: Options filtered as user types
- **Case Insensitive**: Search works regardless of letter case
- **Label Matching**: Searches within option labels
- **Clear Search**: Search clears when modal closes

## Academy Theming

### Colors Used

- **Primary**: `theme.colors.interactive.primary` (#4F2EC9) for selected states
- **Text**: `theme.colors.text.primary` for main text
- **Secondary Text**: `theme.colors.text.secondary` for placeholders
- **Error**: `theme.colors.status.error` for validation errors
- **Borders**: `theme.colors.border.primary` for field borders

### Form Integration Colors

- **Normal State**: Standard border color
- **Focus State**: Primary color border
- **Error State**: Error color border with error text
- **Disabled State**: Muted colors with reduced opacity

## Accessibility Features

- **Screen Reader Support**: Proper labels, hints, and roles
- **Keyboard Navigation**: Full keyboard support in modal
- **Focus Management**: Proper focus handling when modal opens/closes
- **Touch Targets**: Minimum 44px touch targets
- **ARIA Attributes**: Proper form field and modal accessibility
- **Required Indicators**: Visual and semantic required field marking

## Performance Considerations

- **Virtualized List**: Efficient rendering for large option sets (100+ options)
- **Search Optimization**: Debounced search to prevent excessive filtering
- **Modal Optimization**: Lazy rendering - modal content only renders when opened
- **Memory Management**: Automatic cleanup when component unmounts

## Form Integration Patterns

### React Hook Form Integration

```typescript
// Register with validation
<Controller
  name="fieldName"
  control={control}
  rules={{ 
    required: 'Field is required',
    validate: (value) => value !== 'invalid' || 'Invalid selection'
  }}
  render={({ field: { onChange, value }, fieldState: { error } }) => (
    <FormDropdown
      label="Field Label"
      options={options}
      value={value}
      onSelectionChange={onChange}
      error={error?.message}
      required
    />
  )}
/>
```

### Formik Integration

```typescript
import { Field } from 'formik';

<Field name="fieldName">
  {({ field, form, meta }) => (
    <FormDropdown
      label="Field Label"
      options={options}
      value={field.value}
      onSelectionChange={(value) => form.setFieldValue(field.name, value)}
      error={meta.touched && meta.error ? meta.error : undefined}
    />
  )}
</Field>
```

## Migration Guide

### From CustomDropDownSelect

```typescript
// Old approach ❌
<CustomDropDownSelect
  data={options}
  onSelect={handleSelect}
  placeholder="Select option"
/>

// New approach ✅
<FormDropdown
  label="Selection Label"
  options={options}
  value={selectedValue}
  onSelectionChange={handleSelect}
  placeholder="Select option"
/>
```

## Best Practices

1. **Use for form fields** - Ideal for traditional form dropdown needs
2. **Enable search for large sets** - Use `searchable={true}` for 10+ options
3. **Provide clear labels** - Always include descriptive labels
4. **Handle validation properly** - Show errors and required indicators
5. **Consider icons** - Use icons to help users identify options quickly
6. **Test on devices** - Verify modal behavior on different screen sizes

## Related Components

- **[SelectOptions](./SelectOptions.md)** - For grid-based selection
- **[CustomInput](../forms/CustomInput.md)** - For text input fields
- **[FilterChip](../search/FilterChip.md)** - For filter-style selection
- **[BottomSheet](./BottomSheet.md)** - For custom modal interfaces

## Troubleshooting

### Common Issues

1. **Modal not opening**: Ensure `disabled={false}` and proper touch handling
2. **Search not working**: Verify `searchable={true}` is set
3. **Value not updating**: Check `onSelectionChange` callback implementation
4. **Styling issues**: Use provided style props instead of external CSS

### Performance Issues

- For extremely large option sets (500+), consider server-side filtering
- Use `searchable={true}` to help users find options quickly
- Consider SelectOptions for smaller, visual option sets

### Accessibility Issues

- Always provide `label` prop for screen readers
- Use `error` prop for validation feedback
- Test with screen reader to verify proper announcement

The FormDropdown component provides a robust, accessible, and form-friendly solution for traditional dropdown selection needs in Academy applications.