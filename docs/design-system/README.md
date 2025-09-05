# Academy Design System

A comprehensive design system for the Academy Mobile Apps with consistent colors, typography, spacing, and component patterns. Built with accessibility, maintainability, and developer experience in mind.

## 🎨 Overview

The Academy Design System provides:

- **🌈 Theme System** - Light, Dark, and System modes with seamless switching
- **🎯 Academy Branding** - Consistent purple (#4F2EC9) brand colors across all themes
- **📝 Typography Scale** - Consistent text styles with accessibility considerations
- **📏 Spacing System** - Harmonious spacing based on 4px grid system
- **🧩 Component Library** - 45+ Academy-themed components
- **♿ Accessibility First** - WCAG 2.1 AA compliant design tokens

## 🚀 Quick Start

### 1. Setup Theme Provider

Wrap your app with the `ThemeProvider`:

```tsx
import { ThemeProvider } from '@academy/mobile-shared';

export default function App() {
  return (
    <ThemeProvider>
      <YourAppContent />
    </ThemeProvider>
  );
}
```

### 2. Using Theme in Components

```tsx
import { useTheme } from '@academy/mobile-shared';
import { StyleSheet } from 'react-native';

function MyComponent() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        Academy App
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16, // Or use theme.spacing.lg
    borderRadius: 12, // Or use theme.borderRadius.lg
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
});
```

### 3. Theme Switching

```tsx
import { useTheme } from '@academy/mobile-shared';

function ThemeToggle() {
  const { theme, themeMode, setThemeMode } = useTheme();

  return (
    <View>
      <TouchableOpacity onPress={() => setThemeMode('light')}>
        <Text>Light Mode</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setThemeMode('dark')}>
        <Text>Dark Mode</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setThemeMode('system')}>
        <Text>System Mode</Text>
      </TouchableOpacity>
    </View>
  );
}
```

## 🌈 Color System

### Theme Modes

The design system supports three distinct themes:

#### Light Theme
- **Use Case**: Default daytime usage
- **Background**: Clean whites and light grays
- **Text**: Dark colors for maximum readability
- **Accent**: Vibrant Academy brand colors

#### Dark Theme  
- **Use Case**: Low-light environments
- **Background**: Dark grays (#1F2937, #374151)
- **Text**: Light colors with good contrast
- **Accent**: Academy purple maintained across themes

#### Night Theme
- **Use Case**: Late night usage, OLED screens
- **Background**: Pure blacks (#000000) for OLED efficiency
- **Text**: Muted colors to reduce eye strain
- **Accent**: Reduced intensity while maintaining Academy branding

### Academy Color Tokens

```tsx
import { useTheme } from '@academy/mobile-shared';

const { theme } = useTheme();

// Academy Brand Colors (consistent across all themes)
theme.colors.interactive.primary      // #4F2EC9 Academy purple
theme.colors.interactive.teal         // #52E2BB Academy teal
theme.colors.interactive.orange       // #FEAE24 Academy orange
theme.colors.interactive.themeBlack   // #121212 Academy black

// Text colors (adapt to theme)
theme.colors.text.primary             // Main text
theme.colors.text.secondary           // Secondary text
theme.colors.text.tertiary            // Muted text
theme.colors.text.disabled            // Disabled text

// Background colors (adapt to theme)
theme.colors.background.primary       // Main backgrounds
theme.colors.background.secondary     // Card backgrounds
theme.colors.border.primary           // Default borders

// Status colors
theme.colors.status.success           // Green success states
theme.colors.status.warning           // Orange warning states  
theme.colors.status.error             // Red error states
theme.colors.status.info              // Blue info states
```

### Using Colors

```tsx
// ✅ Good - Using Academy theme tokens
const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.interactive.primary, // Academy purple
    borderColor: theme.colors.border.primary,
  },
  text: {
    color: theme.colors.text.primary,
  },
});

// ❌ Bad - Using hardcoded colors
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4F2EC9', // Hardcoded, won't adapt to themes
    borderColor: '#E5E7EB',
  },
  text: {
    color: '#000000',
  },
});
```

## 📝 Typography

### Academy Typography Scale

The typography system provides consistent text styles:

```tsx
import { useTheme } from '@academy/mobile-shared';

const { theme } = useTheme();

// Headings
theme.fontSizes.h1          // 32px
theme.fontSizes.h2          // 28px  
theme.fontSizes.h3          // 24px
theme.fontSizes.h4          // 20px

// Body text
theme.fontSizes.body        // 16px (default)
theme.fontSizes.bodyLarge   // 18px
theme.fontSizes.bodySmall   // 14px
theme.fontSizes.caption     // 12px

// Font weights
theme.fontConfig.fontWeight.light     // '300'
theme.fontConfig.fontWeight.regular   // '400'
theme.fontConfig.fontWeight.medium    // '500'
theme.fontConfig.fontWeight.semibold  // '600'
theme.fontConfig.fontWeight.bold      // '700'
```

### Usage Examples

```tsx
// ✅ Good - Using Academy typography tokens
const styles = StyleSheet.create({
  title: {
    fontSize: theme.fontSizes.h2,
    fontWeight: theme.fontConfig.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  body: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.regular,
    color: theme.colors.text.secondary,
  },
});

// ❌ Bad - Hardcoded typography
const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
});
```

## 📏 Spacing System

Based on a 4px grid system for consistent alignment:

```tsx
import { useTheme } from '@academy/mobile-shared';

const { theme } = useTheme();

// Spacing tokens
theme.spacing.xs      // 4px
theme.spacing.sm      // 8px
theme.spacing.md      // 16px
theme.spacing.lg      // 24px
theme.spacing.xl      // 32px
theme.spacing.xxl     // 48px

// Border radius
theme.borderRadius.sm  // 4px
theme.borderRadius.md  // 8px
theme.borderRadius.lg  // 12px
theme.borderRadius.xl  // 16px
```

### Usage Examples

```tsx
// ✅ Good - Using Academy spacing tokens
const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,        // 24px
    marginBottom: theme.spacing.md,   // 16px
    borderRadius: theme.borderRadius.lg, // 12px
  },
  button: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
});

// ❌ Bad - Hardcoded spacing
const styles = StyleSheet.create({
  container: {
    padding: 24,
    marginBottom: 16,
    borderRadius: 12,
  },
});
```

## 🎨 Component Theming

### Using Academy Components

All Academy components automatically use the theme system:

```tsx
import { 
  CustomButton, 
  CustomInput, 
  Header, 
  StudentCard 
} from '@academy/mobile-shared';

// Components automatically use Academy theming
<CustomButton 
  variant="primary"    // Academy purple styling
  title="Submit" 
/>

<CustomInput 
  variant="primary"    // Academy purple focus states
  placeholder="Email" 
/>

<Header 
  variant="instructor" // Academy instructor theming
  title="Students" 
/>
```

### Creating Custom Themed Components

```tsx
import { useTheme } from '@academy/mobile-shared';

function CustomCard({ children, variant = 'default' }) {
  const { theme } = useTheme();
  
  const cardStyles = StyleSheet.create({
    default: {
      backgroundColor: theme.colors.background.secondary,
      borderColor: theme.colors.border.primary,
      borderWidth: 1,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
    },
    academy: {
      backgroundColor: theme.colors.background.secondary,
      borderColor: theme.colors.interactive.primary, // Academy purple border
      borderWidth: 2,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
    },
  });

  return (
    <View style={cardStyles[variant]}>
      {children}
    </View>
  );
}
```

## 🔧 Advanced Usage

### Theme-Aware Conditional Styling

```tsx
import { useTheme } from '@academy/mobile-shared';

function AdaptiveComponent() {
  const { theme, themeMode } = useTheme();
  
  const isDark = theme.isDark;
  
  return (
    <View style={[
      styles.container,
      {
        backgroundColor: theme.colors.background.primary,
        // Add extra shadow in light mode
        ...(isDark ? {} : {
          shadowColor: theme.colors.interactive.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }),
      }
    ]}>
      <Text style={{ color: theme.colors.text.primary }}>
        Academy Content
      </Text>
    </View>
  );
}
```

### Performance Optimization

```tsx
import { useTheme } from '@academy/mobile-shared';
import { useMemo } from 'react';

function OptimizedComponent() {
  const { theme } = useTheme();
  
  // Memoize styles to prevent recreation on every render
  const styles = useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.primary,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
    },
    text: {
      color: theme.colors.text.primary,
      fontSize: theme.fontSizes.body,
    },
  }), [theme]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Academy App</Text>
    </View>
  );
}
```

## ♿ Accessibility

### Color Contrast

All Academy color combinations meet WCAG 2.1 AA standards:

- Academy purple (#4F2EC9) on white backgrounds: ✅ 4.5:1+
- Text colors on Academy backgrounds: ✅ 4.5:1+
- All theme variations maintain proper contrast ratios

### Academy Accessibility Features

```tsx
// Academy components include built-in accessibility
<CustomButton
  title="Submit"
  variant="primary"
  accessibilityLabel="Submit form"
  accessibilityHint="Submits the student enrollment form"
/>

<CustomInput
  placeholder="Student Name"
  accessibilityLabel="Student name input field"
  accessibilityRole="text"
/>
```

## 🎯 Best Practices

### Do's ✅

- Use Academy theme tokens (`theme.colors.interactive.primary`)
- Use Academy typography tokens (`theme.fontSizes.body`)
- Use Academy spacing tokens (`theme.spacing.lg`)
- Test components in all three theme modes (light, dark, night)
- Use Academy components when available (`CustomButton`, `CustomInput`)
- Maintain Academy brand consistency across instructor and student apps

### Don'ts ❌

- Hardcode Academy purple (`'#4F2EC9'`)
- Hardcode font sizes (`fontSize: 16`)
- Hardcode spacing (`margin: 10`)
- Create inline styles without theme tokens
- Forget to test theme switching functionality
- Break Academy brand consistency

### Migration from Hardcoded Styles

```tsx
// Before ❌ - Hardcoded Academy styling
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4F2EC9', // Hardcoded Academy purple
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#4F2EC9',
    padding: 12,
    borderRadius: 6,
  },
});

// After ✅ - Academy theme system
function ThemedComponent() {
  const { theme } = useTheme();
  
  const styles = useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.primary,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
    },
    title: {
      fontSize: theme.fontSizes.h4,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.interactive.primary, // Academy purple, theme-aware
      marginBottom: theme.spacing.sm,
    },
  }), [theme]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Academy Title</Text>
      <CustomButton 
        variant="primary" 
        title="Academy Button" 
      />
    </View>
  );
}
```

## 📚 Related Documentation

- **[Academy Theme System](../THEME_SYSTEM.md)** - Complete theming reference
- **[Form Components](../components/forms/README.md)** - Academy form component usage
- **[Enhanced Components](../components/ENHANCED_COMPONENTS.md)** - Academy-specific features
- **[Multi-Program Context](../architecture/MULTI_PROGRAM_CONTEXT.md)** - Program theming integration

## 🔄 Academy Theme Migration Checklist

When converting components to use the Academy theme system:

- [ ] Replace hardcoded Academy purple with `theme.colors.interactive.primary`
- [ ] Replace hardcoded fonts with Academy typography tokens  
- [ ] Replace hardcoded spacing with Academy spacing tokens
- [ ] Test component in light, dark, and night themes
- [ ] Verify Academy brand consistency is maintained
- [ ] Ensure accessibility contrast ratios are preserved
- [ ] Update component documentation with Academy examples
- [ ] Use Academy components (`CustomButton`, etc.) when available

The Academy Design System ensures consistent, accessible, and maintainable styling across both instructor and student mobile applications while maintaining the distinctive Academy brand identity.