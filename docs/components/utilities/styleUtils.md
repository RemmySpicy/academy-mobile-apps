# Style Utilities

Dynamic style generation utilities for Academy components with theme integration and variant support.

## 🎨 Overview

Style utilities provide consistent, reusable style generation functions that integrate with the Academy theme system. These utilities enable dynamic styling based on component variants, sizes, and states.

## 🚀 Quick Start

```typescript
import { 
  getContainerStyles,
  getActionButtonStyles,
  getDayBoxStyles,
  createControlCardStyles
} from '@academy/mobile-shared';
```

## 🔧 Core Functions

### getContainerStyles(theme, size, layout, variant)

Generate container styles based on component properties.

```typescript
function getContainerStyles(
  theme: any,
  size: ControlCardSize,
  layout: ControlCardLayout,
  variant: ControlCardVariant
): object
```

**Types:**
```typescript
type ControlCardSize = 'compact' | 'normal' | 'expanded';
type ControlCardLayout = 'default' | 'minimal' | 'detailed' | 'dashboard';
type ControlCardVariant = 'elevated' | 'outlined' | 'filled' | 'ghost';
```

**Example:**
```typescript
import { useTheme } from '@academy/mobile-shared';

function CustomCard() {
  const { theme } = useTheme();
  const containerStyles = getContainerStyles(theme, 'normal', 'default', 'elevated');
  
  return <View style={containerStyles}>...</View>;
}
```

### getActionButtonStyles(theme, variant, disabled)

Generate action button styles with variant support.

```typescript
function getActionButtonStyles(
  theme: any,
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary',
  disabled: boolean = false
): object
```

**Examples:**
```typescript
// Primary button (default)
const primaryStyles = getActionButtonStyles(theme, 'primary', false);

// Disabled secondary button
const disabledStyles = getActionButtonStyles(theme, 'secondary', true);

// Outline button
const outlineStyles = getActionButtonStyles(theme, 'outline', false);
```

### getActionButtonTextStyles(theme, variant, disabled)

Generate corresponding text styles for action buttons.

```typescript
function getActionButtonTextStyles(
  theme: any,
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary',
  disabled: boolean = false
): object
```

**Example:**
```typescript
const buttonStyles = getActionButtonStyles(theme, 'primary', false);
const textStyles = getActionButtonTextStyles(theme, 'primary', false);

return (
  <TouchableOpacity style={buttonStyles}>
    <Text style={textStyles}>Button Text</Text>
  </TouchableOpacity>
);
```

### getDayBoxStyles(theme, size, isActive, isMarked)

Generate calendar day box styles with state support.

```typescript
function getDayBoxStyles(
  theme: any,
  size: ControlCardSize,
  isActive: boolean = false,
  isMarked: boolean = false
): object
```

**Example:**
```typescript
function CalendarDay({ date, isToday, hasEvents }) {
  const { theme } = useTheme();
  const dayStyles = getDayBoxStyles(theme, 'normal', isToday, hasEvents);
  
  return (
    <View style={dayStyles}>
      <Text>{new Date(date).getDate()}</Text>
    </View>
  );
}
```

## 🏗️ Layout & Size Functions

### getContentPadding(theme, size)

Get appropriate content padding for component size.

```typescript
function getContentPadding(theme: any, size: ControlCardSize): number
```

### getHeaderStyles(theme, layout)

Generate header styles based on layout variant.

```typescript
function getHeaderStyles(theme: any, layout: ControlCardLayout): object
```

### getTitleStyles(theme, size)

Generate title text styles based on component size.

```typescript
function getTitleStyles(theme: any, size: ControlCardSize): object
```

**Example:**
```typescript
function ComponentHeader({ title, size, layout }) {
  const { theme } = useTheme();
  const headerStyles = getHeaderStyles(theme, layout);
  const titleStyles = getTitleStyles(theme, size);
  const padding = getContentPadding(theme, size);
  
  return (
    <View style={[headerStyles, { padding }]}>
      <Text style={titleStyles}>{title}</Text>
    </View>
  );
}
```

## 🎛️ Complete StyleSheet Generation

### createControlCardStyles(theme, size, layout, variant)

Generate a complete StyleSheet for ControlCard components.

```typescript
function createControlCardStyles(
  theme: any,
  size: ControlCardSize,
  layout: ControlCardLayout,
  variant: ControlCardVariant
): StyleSheet
```

**Example:**
```typescript
import { StyleSheet } from 'react-native';
import { createControlCardStyles } from '@academy/mobile-shared';

function MyControlCard(props) {
  const { theme } = useTheme();
  const { size, layout, variant } = props;
  
  const styles = createControlCardStyles(theme, size, layout, variant);
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Title</Text>
        </View>
      </View>
    </View>
  );
}
```

## 🎯 Common Usage Patterns

### Dynamic Button Styling

```typescript
import { getActionButtonStyles, getActionButtonTextStyles } from '@academy/mobile-shared';

function DynamicButton({ variant, disabled, children, onPress }) {
  const { theme } = useTheme();
  
  const buttonStyles = getActionButtonStyles(theme, variant, disabled);
  const textStyles = getActionButtonTextStyles(theme, variant, disabled);
  
  return (
    <TouchableOpacity 
      style={buttonStyles} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={textStyles}>{children}</Text>
    </TouchableOpacity>
  );
}

// Usage
<DynamicButton variant="primary" disabled={false}>Save</DynamicButton>
<DynamicButton variant="outline" disabled={false}>Cancel</DynamicButton>
```

### Responsive Container

```typescript
import { getContainerStyles } from '@academy/mobile-shared';

function ResponsiveContainer({ children, variant, responsive }) {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  
  // Determine size based on screen width
  const size = screenWidth < 400 ? 'compact' : 
               screenWidth > 800 ? 'expanded' : 'normal';
               
  const containerStyles = getContainerStyles(theme, size, 'default', variant);
  
  return (
    <View style={containerStyles}>
      {children}
    </View>
  );
}
```

### Calendar with State Styling

```typescript
import { getDayBoxStyles } from '@academy/mobile-shared';

function CalendarGrid({ dates, selectedDate, markedDates }) {
  const { theme } = useTheme();
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <View style={styles.grid}>
      {dates.map(date => {
        const isToday = date === today;
        const isSelected = date === selectedDate;
        const isMarked = markedDates.includes(date);
        const isActive = isToday || isSelected;
        
        const dayStyles = getDayBoxStyles(theme, 'normal', isActive, isMarked);
        
        return (
          <TouchableOpacity key={date} style={dayStyles}>
            <Text>{new Date(date).getDate()}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
```

## 🎨 Theme Integration

All style utilities automatically integrate with the Academy theme system:

```typescript
// Theme properties used by utilities
theme.colors.interactive.primary     // Academy purple #4F2EC9
theme.colors.background.primary      // Main background
theme.colors.background.secondary    // Card backgrounds  
theme.colors.text.primary           // Main text
theme.colors.text.inverse           // Inverse text (on primary)
theme.colors.status.success         // Success states
theme.colors.status.warning         // Warning states
theme.colors.status.error           // Error states
theme.spacing.xs                    // 4px
theme.spacing.sm                    // 8px
theme.spacing.md                    // 16px
theme.spacing.lg                    // 24px
theme.borderRadius.md               // Medium border radius
theme.borderRadius.lg               // Large border radius
theme.fontSizes.body                // Body text size
theme.fontSizes.heading6            // Small heading
theme.fontConfig.fontWeight.medium  // Medium font weight
```

## 🔧 Extending Style Utilities

### Custom Utility Function

```typescript
import { useTheme } from '@academy/mobile-shared';

export const getCustomCardStyles = (
  theme: any, 
  variant: 'success' | 'warning' | 'error',
  elevated: boolean = false
) => ({
  backgroundColor: theme.colors.background.primary,
  borderLeftWidth: 4,
  borderLeftColor: theme.colors.status[variant],
  padding: theme.spacing.md,
  borderRadius: theme.borderRadius.md,
  ...(elevated && {
    shadowColor: theme.colors.shadow?.default || theme.colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  }),
});

// Usage
function StatusCard({ message, variant }) {
  const { theme } = useTheme();
  const styles = getCustomCardStyles(theme, variant, true);
  
  return (
    <View style={styles}>
      <Text>{message}</Text>
    </View>
  );
}
```

### Combining Utilities

```typescript
import { 
  getContainerStyles, 
  getActionButtonStyles,
  getHeaderStyles 
} from '@academy/mobile-shared';

function ComplexComponent({ size, layout, variant }) {
  const { theme } = useTheme();
  
  const containerStyles = getContainerStyles(theme, size, layout, variant);
  const headerStyles = getHeaderStyles(theme, layout);
  const buttonStyles = getActionButtonStyles(theme, 'primary', false);
  
  const combinedStyles = StyleSheet.create({
    container: containerStyles,
    header: headerStyles,
    button: buttonStyles,
    customContent: {
      // Additional custom styles
      marginTop: theme.spacing.md,
      padding: theme.spacing.sm,
    },
  });
  
  return (
    <View style={combinedStyles.container}>
      <View style={combinedStyles.header}>
        <Text>Header</Text>
      </View>
      <View style={combinedStyles.customContent}>
        <TouchableOpacity style={combinedStyles.button}>
          <Text>Action</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
```

## 📱 Performance Considerations

- **Memoization**: Consider using `useMemo` for expensive style calculations
- **StyleSheet.create()**: Utilities return style objects; wrap with `StyleSheet.create()` when needed
- **Theme stability**: Utilities assume theme object is stable across renders

```typescript
// Performance optimized usage
function OptimizedComponent({ size, variant }) {
  const { theme } = useTheme();
  
  const styles = useMemo(() => StyleSheet.create({
    container: getContainerStyles(theme, size, 'default', variant),
    button: getActionButtonStyles(theme, 'primary', false),
  }), [theme, size, variant]);
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Text>Action</Text>
      </TouchableOpacity>
    </View>
  );
}
```

## 📋 Type Definitions

```typescript
// Size variants
export type ControlCardSize = 'compact' | 'normal' | 'expanded';

// Layout variants  
export type ControlCardLayout = 'default' | 'minimal' | 'detailed' | 'dashboard';

// Visual variants
export type ControlCardVariant = 'elevated' | 'outlined' | 'filled' | 'ghost';

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

// Function signatures
export function getContainerStyles(
  theme: any,
  size: ControlCardSize,
  layout: ControlCardLayout,
  variant: ControlCardVariant
): object;

export function getActionButtonStyles(
  theme: any,
  variant: ButtonVariant,
  disabled: boolean
): object;

export function getDayBoxStyles(
  theme: any,
  size: ControlCardSize,
  isActive: boolean,
  isMarked: boolean
): object;

export function createControlCardStyles(
  theme: any,
  size: ControlCardSize,
  layout: ControlCardLayout,
  variant: ControlCardVariant
): StyleSheet;
```

## 🔗 Related

- **[Date Utilities](./dateUtils.md)** - Date manipulation functions
- **[ControlCard](../controls/ControlCard.md)** - Main component using these utilities
- **[Academy Theme System](../../THEME_SYSTEM.md)** - Complete theming reference

---

Style utilities provide a powerful foundation for consistent, theme-aware styling across Academy components while maintaining flexibility and performance.