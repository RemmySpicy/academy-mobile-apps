# ToggleCard Component

A comprehensive expandable/collapsible card component with Academy theming, supporting multiple variants, sizes, and customization options.

## Overview

The ToggleCard component is designed for progressive disclosure of content, commonly used throughout the Academy Apps for organizing grouped information, student lists, attendance tracking, and session management.

## Features

- **Multiple Variants**: Status-based color schemes (default, primary, success, warning, error, info)
- **Size Options**: Small, medium, and large sizing for different contexts
- **Style Variants**: Filled, outlined, ghost, and elevated appearances
- **Icon Styles**: Arrow, chevron, plus/minus, or custom icons
- **Responsive Design**: Tablet-aware with appropriate scaling
- **Accessibility**: Full ARIA support and screen reader compatibility
- **Academy Theming**: Integrated with Academy design system
- **TypeScript**: Full type safety and intellisense support

## Basic Usage

```tsx
import { ToggleCard } from '@academy/mobile-shared';

// Simple usage
<ToggleCard
  title="Swimming Session Details"
  count={5}
  onToggle={(expanded) => console.log('Expanded:', expanded)}
/>
```

## Variant Examples

### Status Variants

```tsx
// Default appearance
<ToggleCard title="General Information" variant="default" />

// Academy purple theme
<ToggleCard title="Important Notice" variant="primary" />

// Success state (for completed/present items)
<ToggleCard title="Mark Present" variant="success" count={12} />

// Warning state (for pending/unmarked items)
<ToggleCard title="Unmarked List" variant="warning" count={3} />

// Error state (for issues/absent items)
<ToggleCard title="Mark Absent" variant="error" count={1} />

// Info state (for informational content)
<ToggleCard title="Additional Details" variant="info" />
```

### Size Variants

```tsx
// Small - compact mobile lists
<ToggleCard title="Quick Actions" size="sm" />

// Medium - default size
<ToggleCard title="Session Details" size="md" />

// Large - prominent section headers
<ToggleCard title="Class Overview" size="lg" />
```

### Style Variants

```tsx
// Filled (default) - solid background
<ToggleCard title="Filled Style" styleVariant="filled" />

// Outlined - border only
<ToggleCard title="Outlined Style" styleVariant="outlined" />

// Ghost - minimal appearance
<ToggleCard title="Ghost Style" styleVariant="ghost" />

// Elevated - with shadow
<ToggleCard title="Elevated Style" styleVariant="elevated" />
```

### Icon Variants

```tsx
// Arrow icons (default)
<ToggleCard title="Arrow Icons" iconStyle="arrow" />

// Chevron icons (modern style)
<ToggleCard title="Chevron Icons" iconStyle="chevron" />

// Plus/minus icons
<ToggleCard title="Plus/Minus Icons" iconStyle="plus" />

// Custom icons
<ToggleCard 
  title="Custom Icons" 
  iconStyle="custom"
  customIcon={{
    expanded: <CustomExpandedIcon />,
    collapsed: <CustomCollapsedIcon />
  }}
/>
```

## Props Interface

```tsx
interface ToggleCardProps {
  // Content
  title: string;
  count?: number;
  initialExpanded?: boolean;
  onToggle?: (isExpanded: boolean) => void;
  
  // Variants
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  styleVariant?: 'filled' | 'outlined' | 'ghost' | 'elevated';
  iconStyle?: 'arrow' | 'chevron' | 'plus' | 'custom';
  
  // Dimensions
  widthPercentage?: number; // 0-1 for percentage of screen width
  
  // Custom Overrides (take precedence over variants)
  backgroundColor?: string;
  countBackgroundColor?: string;
  iconColor?: string;
  textColor?: string;
  borderColor?: string;
  
  // State
  disabled?: boolean;
  
  // Accessibility & Testing
  testID?: string;
  
  // Style Overrides
  style?: ViewStyle;
  titleStyle?: TextStyle;
  countStyle?: TextStyle;
  
  // Custom Icons
  customIcon?: {
    expanded: React.ReactNode;
    collapsed: React.ReactNode;
  };
}
```

## Common Use Cases

### Attendance Management

```tsx
// Present students
<ToggleCard
  title="Mark Present"
  variant="success"
  count={presentStudents.length}
  onToggle={(expanded) => setShowPresentList(expanded)}
/>

// Absent students
<ToggleCard
  title="Mark Absent"
  variant="error"
  count={absentStudents.length}
  onToggle={(expanded) => setShowAbsentList(expanded)}
/>

// Unmarked students
<ToggleCard
  title="Unmarked List"
  variant="warning"
  count={unmarkedStudents.length}
  onToggle={(expanded) => setShowUnmarkedList(expanded)}
/>
```

### Class Groupings

```tsx
// Class sections with star ratings
<ToggleCard
  title="2 Stars"
  variant="warning"
  count={twoStarStudents.length}
  backgroundColor="#FFF3CD"
  onToggle={(expanded) => setShowTwoStars(expanded)}
/>

<ToggleCard
  title="3 Stars"
  variant="success"
  count={threeStarStudents.length}
  onToggle={(expanded) => setShowThreeStars(expanded)}
/>
```

### Session Management

```tsx
// Compact session toggles
<ToggleCard
  title="Morning Sessions"
  size="sm"
  styleVariant="outlined"
  count={morningSessions.length}
  widthPercentage={0.3}
/>

<ToggleCard
  title="Afternoon Sessions"
  size="sm"
  styleVariant="outlined"
  count={afternoonSessions.length}
  widthPercentage={0.3}
/>
```

## Responsive Behavior

The ToggleCard automatically adapts to different screen sizes:

- **Mobile**: Optimized touch targets and spacing
- **Tablet**: Increased font sizes and constrained max width
- **Width Percentage**: Responsive width based on screen dimensions

## Accessibility Features

- **ARIA Roles**: `button` role with proper state
- **Screen Reader**: Descriptive labels including count and state
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Clear focus indicators
- **State Announcements**: Expanded/collapsed state changes

## Theming Integration

The component fully integrates with the Academy theme system:

```tsx
// Uses theme colors automatically
theme.colors.interactive.primary      // Academy purple
theme.colors.status.success          // Success green
theme.colors.status.warning          // Warning orange
theme.colors.status.error            // Error red
theme.colors.status.info             // Info blue

// Spacing follows theme system
theme.spacing.sm, theme.spacing.md, theme.spacing.lg

// Typography uses theme fonts
theme.fontSizes.sm, theme.fontSizes.body, theme.fontSizes.lg
```

## Migration from Legacy

If migrating from the legacy ToggleCard:

```tsx
// Legacy (existing-code)
<ToggleCard
  title="Session"
  count={5}
  widthPercentage={0.28}
  backgroundColor="#EFEFEF"
  countBackgroundColor="#D2D2D2"
/>

// Modern (recommended)
<ToggleCard
  title="Session"
  count={5}
  widthPercentage={0.28}
  variant="default"
  size="md"
/>
```

## Best Practices

1. **Use semantic variants** for meaningful color coding
2. **Choose appropriate sizes** based on content hierarchy
3. **Maintain consistent widthPercentage** within the same context
4. **Provide meaningful onToggle callbacks** for state management
5. **Use count badges** to show quantity of items
6. **Test accessibility** with screen readers
7. **Consider tablet users** with responsive design

## Performance Notes

- Icons are rendered conditionally to optimize performance
- Styles are memoized using StyleSheet.create
- Variant styles are computed once per render
- Responsive calculations are cached

## Dependencies

- `@expo/vector-icons` (AntDesign, Ionicons)
- Academy theme system
- React Native core components

---

*Part of the Academy Mobile Apps component library - see [Component Overview](../README.md) for more components.*