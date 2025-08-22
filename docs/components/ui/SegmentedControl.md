# SegmentedControl Component

A modern iOS-style segmented control for toggling between multiple options with Academy theming and smooth animations.

## Overview

The SegmentedControl component provides a clean, animated way to switch between 2-4 mutually exclusive options. It's perfect for view mode toggles, settings, and filtering options where users need to select exactly one option from a small set.

## Features

- **Animated Selection**: Smooth sliding indicator with customizable duration
- **Multiple Variants**: 4 visual styles (default, primary, secondary, compact)
- **Size Options**: 3 sizes (sm, md, lg) for different contexts
- **Icon Support**: Icons with optional text labels
- **Academy Theming**: Full integration with Academy design system
- **Accessibility**: Complete ARIA support and keyboard navigation
- **TypeScript**: Full type safety with comprehensive interfaces

## Basic Usage

```tsx
import { SegmentedControl } from '@academy/mobile-shared';

// Simple string options
<SegmentedControl
  options={['List', 'Grid', 'Card']}
  selectedValue={viewMode}
  onChange={setViewMode}
/>

// Object options with icons
<SegmentedControl
  options={[
    { value: 'list', label: 'List', icon: 'list' },
    { value: 'grid', label: 'Grid', icon: 'grid' },
    { value: 'card', label: 'Card', icon: 'card' },
  ]}
  selectedValue={viewMode}
  onChange={setViewMode}
  variant="primary"
/>
```

## Variant Examples

### Visual Variants

```tsx
// Default - Light background with Academy purple selection
<SegmentedControl
  options={['Option 1', 'Option 2', 'Option 3']}
  selectedValue={selected}
  onChange={setSelected}
  variant="default"
/>

// Primary - Academy purple theme with enhanced contrast
<SegmentedControl
  options={['Option 1', 'Option 2', 'Option 3']}
  selectedValue={selected}
  onChange={setSelected}
  variant="primary"
/>

// Secondary - Neutral theme with subtle selection
<SegmentedControl
  options={['Option 1', 'Option 2', 'Option 3']}
  selectedValue={selected}
  onChange={setSelected}
  variant="secondary"
/>

// Compact - Minimal bordered style
<SegmentedControl
  options={['Option 1', 'Option 2', 'Option 3']}
  selectedValue={selected}
  onChange={setSelected}
  variant="compact"
/>
```

### Size Variants

```tsx
// Small - Compact for space-constrained areas
<SegmentedControl
  options={['S', 'M', 'L']}
  selectedValue={size}
  onChange={setSize}
  size="sm"
/>

// Medium - Default size for most use cases
<SegmentedControl
  options={['Small', 'Medium', 'Large']}
  selectedValue={size}
  onChange={setSize}
  size="md"
/>

// Large - Prominent for important selections
<SegmentedControl
  options={['Today', 'This Week', 'This Month']}
  selectedValue={period}
  onChange={setPeriod}
  size="lg"
/>
```

## Common Use Cases

### View Mode Toggle

```tsx
const [viewMode, setViewMode] = useState('list');

<SegmentedControl
  options={[
    { value: 'list', label: 'List', icon: 'list-outline' },
    { value: 'grid', label: 'Grid', icon: 'grid-outline' },
  ]}
  selectedValue={viewMode}
  onChange={setViewMode}
  variant="primary"
  size="md"
/>
```

### Settings Toggle

```tsx
const [theme, setTheme] = useState('auto');

<SegmentedControl
  options={[
    { value: 'light', label: 'Light', icon: 'sunny' },
    { value: 'dark', label: 'Dark', icon: 'moon' },
    { value: 'auto', label: 'Auto', icon: 'contrast' },
  ]}
  selectedValue={theme}
  onChange={setTheme}
  variant="secondary"
  size="sm"
/>
```

### Time Period Filter

```tsx
const [period, setPeriod] = useState('week');

<SegmentedControl
  options={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
  ]}
  selectedValue={period}
  onChange={setPeriod}
  variant="primary"
  size="lg"
/>
```

### Icon-Only Mode

```tsx
const [alignment, setAlignment] = useState('left');

<SegmentedControl
  options={[
    { value: 'left', label: 'Left', icon: 'text-left' },
    { value: 'center', label: 'Center', icon: 'text-center' },
    { value: 'right', label: 'Right', icon: 'text-right' },
  ]}
  selectedValue={alignment}
  onChange={setAlignment}
  iconOnly={true}
  variant="compact"
/>
```

## Props Interface

```tsx
interface SegmentedControlProps {
  // Core Props
  options: SegmentedControlOption[] | string[];
  selectedValue: string;
  onChange: (value: string) => void;
  
  // Variants
  variant?: 'default' | 'primary' | 'secondary' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  
  // Behavior
  animated?: boolean;
  animationDuration?: number;
  iconOnly?: boolean;
  
  // Styling
  style?: ViewStyle;
  optionStyle?: ViewStyle;
  selectedOptionStyle?: ViewStyle;
  textStyle?: TextStyle;
  selectedTextStyle?: TextStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  testID?: string;
}

interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
}
```

## Animation Configuration

```tsx
// Disable animations
<SegmentedControl
  options={options}
  selectedValue={selected}
  onChange={setSelected}
  animated={false}
/>

// Custom animation duration
<SegmentedControl
  options={options}
  selectedValue={selected}
  onChange={setSelected}
  animated={true}
  animationDuration={300}
/>
```

## Custom Styling

```tsx
<SegmentedControl
  options={options}
  selectedValue={selected}
  onChange={setSelected}
  style={{
    marginVertical: 16,
    marginHorizontal: 20,
  }}
  optionStyle={{
    paddingVertical: 12,
  }}
  selectedOptionStyle={{
    backgroundColor: '#FF6B6B',
  }}
  textStyle={{
    fontSize: 16,
    fontWeight: '500',
  }}
  selectedTextStyle={{
    color: 'white',
    fontWeight: '700',
  }}
/>
```

## Accessibility Features

The component includes comprehensive accessibility support:

```tsx
<SegmentedControl
  options={[
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ]}
  selectedValue={level}
  onChange={setLevel}
  accessibilityLabel="Skill level selection"
  testID="skill-level-segmented-control"
/>
```

**Accessibility Features:**
- ARIA `tablist` role for container
- ARIA `tab` role for each option
- `selected` and `disabled` states
- Descriptive accessibility labels
- Full keyboard navigation support
- Screen reader announcements

## Responsive Design

The component automatically adapts to different screen sizes:

- **Mobile**: Optimized touch targets and spacing
- **Tablet**: Increased font sizes and padding
- **Sizing**: Flexible width with minimum constraints

## Theme Integration

Seamlessly integrates with Academy theme system:

```tsx
// Theme colors are automatically applied
theme.colors.interactive.primary      // Academy purple
theme.colors.text.primary            // Text colors
theme.colors.background.secondary     // Background colors
theme.spacing.md                      // Spacing values
theme.borderRadius.lg                 // Border radius
```

## Performance Considerations

- **Animation**: Uses native driver for smooth 60fps animations
- **Layout**: Automatic width calculation with efficient layout updates
- **Memory**: Minimal re-renders with stable component structure
- **Touch**: Optimized touch handling with proper hit areas

## Best Practices

### Do's ✅

- Use for 2-4 mutually exclusive options
- Provide clear, concise labels
- Use consistent sizing within the same screen
- Include accessibility labels for complex options
- Use primary variant for important selections

### Don'ts ❌

- Don't use for more than 4 options (consider FixedTabBar instead)
- Don't mix different sizes in the same context
- Avoid very long option labels (they'll truncate)
- Don't disable animations without good reason
- Avoid using for navigation between different screens

## Common Patterns

### Settings Screen Pattern

```tsx
const SettingsSection = () => {
  const [notifications, setNotifications] = useState('all');
  const [theme, setTheme] = useState('auto');
  
  return (
    <View>
      <Text>Notifications</Text>
      <SegmentedControl
        options={['All', 'Important', 'None']}
        selectedValue={notifications}
        onChange={setNotifications}
        variant="primary"
        size="md"
      />
      
      <Text>Theme</Text>
      <SegmentedControl
        options={[
          { value: 'light', label: 'Light', icon: 'sunny' },
          { value: 'dark', label: 'Dark', icon: 'moon' },
          { value: 'auto', label: 'Auto', icon: 'contrast' },
        ]}
        selectedValue={theme}
        onChange={setTheme}
        variant="secondary"
        size="sm"
      />
    </View>
  );
};
```

### Filter Pattern

```tsx
const FilterControls = () => {
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  
  return (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <SegmentedControl
        options={['All', 'Active', 'Completed']}
        selectedValue={status}
        onChange={setStatus}
        variant="compact"
        size="sm"
      />
      
      <SegmentedControl
        options={['Date', 'Name', 'Priority']}
        selectedValue={sortBy}
        onChange={setSortBy}
        variant="compact"
        size="sm"
      />
    </View>
  );
};
```

## Troubleshooting

### Common Issues

1. **Animation not working**
   - Ensure `animated={true}` is set
   - Check that layout calculations are complete
   - Verify no conflicting styles are applied

2. **Options not responding to touch**
   - Check for disabled state
   - Ensure proper `onChange` callback
   - Verify hit area isn't blocked by other components

3. **Styling issues**
   - Use style props instead of direct style modifications
   - Check theme integration for color inconsistencies
   - Ensure responsive design considerations

## Related Components

- **[FixedTabBar](./FixedTabBar.md)** - For 5+ options that fit in fixed space
- **[PillTabs](./PillTabs.md)** - For multi-select scenarios
- **[IconTabBar](./IconTabBar.md)** - For icon-focused navigation

---

*Part of the Academy Mobile Apps component library - see [Tab System Overview](./TAB_SYSTEM.md) for complete tab component guidance.*