# SelectOptions Component

A comprehensive grid-based selection component for single and multi-select scenarios with Academy theming and responsive design.

## Overview

The `SelectOptions` component provides a flexible, grid-based selection interface that automatically adapts to screen sizes and supports both single and multiple selection modes. It's perfect for skill level selection, program choice, and option grids where visual layout is important.

## Features

- ✅ **Single & Multi-select modes** - Toggle between exclusive and multiple selection
- ✅ **Size variants** - Small, medium, and large sizing options
- ✅ **Visual styles** - Filled, outlined, and minimal appearance variants
- ✅ **Responsive grid** - Auto-calculates columns based on screen width
- ✅ **Disabled states** - Component-wide and individual option disabling
- ✅ **Custom layouts** - Configurable column counts
- ✅ **Academy theming** - Consistent branding with purple selection states
- ✅ **TypeScript support** - Full type safety with comprehensive interfaces
- ✅ **Accessibility** - Screen reader support and proper touch targets

## Basic Usage

```typescript
import React, { useState } from 'react';
import { SelectOptions } from '@academy/mobile-shared';

function SkillLevelSelector() {
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  const skillLevels = [
    { id: 'beginner', label: 'Beginner', value: 'beginner' },
    { id: 'intermediate', label: 'Intermediate', value: 'intermediate' },
    { id: 'advanced', label: 'Advanced', value: 'advanced' },
    { id: 'expert', label: 'Expert', value: 'expert' },
  ];

  return (
    <SelectOptions
      title="Swimming Level"
      options={skillLevels}
      value={selectedLevel}
      onSelectionChange={(selected) => {
        setSelectedLevel(typeof selected === 'string' ? selected : selected[0]);
      }}
      multiSelect={false}
    />
  );
}
```

## Props

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | **Required** | Title text displayed above the options |
| `options` | `SelectOption[] \| string[]` | **Required** | Array of options to display |
| `value` | `string \| string[]` | `undefined` | Selected value(s) - string for single select, array for multi-select |
| `onSelectionChange` | `(selected: string \| string[]) => void` | `undefined` | Callback when selection changes |
| `multiSelect` | `boolean` | `false` | Enable multiple selection |

### Display Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant for spacing and typography |
| `variant` | `'filled' \| 'outlined' \| 'minimal'` | `'filled'` | Visual style variant |
| `columns` | `number` | Auto-calculated | Number of columns in the grid |
| `minOptionWidth` | `number` | `120` | Minimum width for each option in pixels |

### State Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Disabled state for entire component |

### Styling Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `style` | `ViewStyle` | `undefined` | Custom container styles |
| `titleStyle` | `TextStyle` | `undefined` | Custom title styles |
| `optionStyle` | `ViewStyle` | `undefined` | Custom option styles |
| `selectedOptionStyle` | `ViewStyle` | `undefined` | Custom selected option styles |

### Testing Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `testID` | `string` | `'select-options'` | Test ID for testing |

## Types

### SelectOption Interface

```typescript
export interface SelectOption {
  /** Unique identifier for the option */
  id: string;
  /** Display label for the option */
  label: string;
  /** Optional value (defaults to id if not provided) */
  value?: string;
  /** Whether this option is disabled */
  disabled?: boolean;
}
```

## Size Variants

### Small (`size="sm"`)
- Compact spacing and smaller fonts
- Best for: Secondary selections, space-constrained layouts
- Font size: Caption level with reduced padding

### Medium (`size="md"`) - Default
- Balanced sizing for most use cases
- Best for: Primary selections, standard forms
- Font size: Body level with standard padding

### Large (`size="lg"`)
- Generous spacing and larger fonts
- Best for: Important selections, accessibility needs
- Font size: Large body with expanded padding

## Visual Style Variants

### Filled (`variant="filled"`) - Default
- Background with borders
- Classic card-like appearance
- Best for: Standard selections with clear boundaries

### Outlined (`variant="outlined"`)
- Transparent background with prominent borders
- Clean, minimal appearance
- Best for: Modern interfaces, overlays

### Minimal (`variant="minimal"`)
- No borders or background containers
- Ultra-clean appearance
- Best for: Subtle selections, integrated layouts

## Usage Examples

### Multi-Select with Large Size

```typescript
function ProgramSelector() {
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);

  const programs = [
    'Swimming Program',
    'Football Training', 
    'Basketball Skills',
    'Music Lessons',
    'Coding Bootcamp'
  ];

  return (
    <SelectOptions
      title="Select Programs"
      options={programs}
      value={selectedPrograms}
      onSelectionChange={setSelectedPrograms}
      multiSelect={true}
      size="lg"
      variant="outlined"
    />
  );
}
```

### With Disabled Options

```typescript
function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState<string>('');

  const roles = [
    { id: 'instructor', label: 'Instructor', value: 'instructor' },
    { id: 'admin', label: 'Administrator', value: 'admin', disabled: true },
    { id: 'student', label: 'Student', value: 'student' },
  ];

  return (
    <SelectOptions
      title="User Role"
      options={roles}
      value={selectedRole}
      onSelectionChange={(selected) => {
        setSelectedRole(typeof selected === 'string' ? selected : selected[0]);
      }}
      multiSelect={false}
      variant="filled"
    />
  );
}
```

### Custom Layout with Fixed Columns

```typescript
function CustomLayoutSelector() {
  return (
    <SelectOptions
      title="Options Grid"
      options={['A', 'B', 'C', 'D', 'E', 'F']}
      value={[]}
      multiSelect={true}
      columns={3}
      size="sm"
      variant="minimal"
    />
  );
}
```

## Responsive Behavior

The component automatically adapts to different screen sizes:

- **Phone Portrait**: 2-3 columns based on option width
- **Phone Landscape**: 3-4 columns for better space utilization  
- **Tablet**: 4-6 columns with larger touch targets
- **Custom**: Override with `columns` prop for specific layouts

## Academy Theming

### Colors Used

- **Primary Selection**: `theme.colors.interactive.primary` (#4F2EC9)
- **Text**: `theme.colors.text.primary` and `theme.colors.text.inverse`
- **Borders**: `theme.colors.border.primary`
- **Backgrounds**: `theme.colors.background.primary`

### Theme Integration

```typescript
import { useTheme } from '@academy/mobile-shared';

function ThemedSelectOptions() {
  const { theme } = useTheme();
  
  return (
    <SelectOptions
      title="Custom Styled"
      options={['Option 1', 'Option 2']}
      style={{
        backgroundColor: theme.colors.background.secondary,
        borderRadius: theme.borderRadius.xl,
      }}
      titleStyle={{
        color: theme.colors.interactive.primary,
        fontSize: theme.fontSizes.lg,
      }}
    />
  );
}
```

## Accessibility Features

- **Screen Reader Support**: Proper accessibility labels and roles
- **Keyboard Navigation**: Full keyboard support with focus management
- **Touch Targets**: Minimum 44px touch targets for mobile accessibility
- **Focus Indicators**: Clear focus states with Academy theming
- **ARIA Attributes**: Proper button roles and selection states

## Performance Considerations

- **Optimized Rendering**: Uses React.memo for option components
- **Efficient Updates**: Minimal re-renders with useCallback hooks
- **Memory Management**: Automatic cleanup of event listeners
- **Large Lists**: Handles 50+ options efficiently with proper layout

## Migration Guide

### From Legacy SelectOptions

```typescript
// Old approach ❌
<SelectOptions 
  options={options}
  onPress={handlePress}
/>

// New approach ✅
<SelectOptions
  title="Selection Title"
  options={options}
  value={selectedValue}
  onSelectionChange={handleSelectionChange}
  multiSelect={false}
/>
```

## Best Practices

1. **Use appropriate size variants** - `sm` for secondary selections, `lg` for important choices
2. **Provide clear titles** - Help users understand what they're selecting
3. **Consider multi-select carefully** - Only use when users actually need multiple selections
4. **Disable appropriately** - Use disabled state for unavailable options
5. **Test responsiveness** - Verify layout on different screen sizes

## Related Components

- **[FormDropdown](./FormDropdown.md)** - For traditional dropdown selection
- **[FilterChip](../search/FilterChip.md)** - For filter-based selection
- **[SegmentedControl](./SegmentedControl.md)** - For 2-4 exclusive options
- **[CustomCheckBox](../forms/CustomCheckBox.md)** - For individual checkboxes

## Troubleshooting

### Common Issues

1. **Options not updating**: Ensure `value` prop is properly controlled
2. **Layout issues**: Check `minOptionWidth` and screen dimensions
3. **Selection not working**: Verify `onSelectionChange` callback is provided
4. **Styling conflicts**: Use `style` props instead of external stylesheets

### Performance Issues

- For 100+ options, consider using FormDropdown with search instead
- Use `columns` prop to optimize layout for specific use cases
- Implement virtualization for extremely large option sets

The SelectOptions component provides a robust, accessible, and themeable solution for grid-based selection interfaces in Academy applications.