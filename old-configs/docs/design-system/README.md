# Academy Design System

A comprehensive design system for the Academy Mobile Apps with consistent colors, typography, spacing, and component patterns. Built with accessibility, maintainability, and developer experience in mind.

## 🎨 Overview

The Academy Design System provides:

- **🌈 Theme System** - Light, Dark, and Night modes with seamless switching
- **🎯 Semantic Colors** - Meaningful color tokens that adapt to different themes
- **📝 Typography Scale** - Consistent text styles with accessibility considerations
- **📏 Spacing System** - Harmonious spacing based on 4px grid system
- **🧩 Component Library** - Themed components that work across all apps
- **♿ Accessibility First** - WCAG 2.1 AA compliant design tokens

## 🚀 Quick Start

### 1. Setup Theme Provider

Wrap your app with the `ThemeProvider`:

```tsx
import { ThemeProvider } from '@shared';

export default function App() {
  return (
    <ThemeProvider 
      initialTheme="system" 
      enableSystemTheme={true}
      persistTheme={true}
    >
      <YourAppContent />
    </ThemeProvider>
  );
}
```

### 2. Using Theme in Components

```tsx
import { useTheme, createThemedStyles } from '@shared';

function MyComponent() {
  const { theme } = useTheme();
  const styles = useThemedStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
    </View>
  );
}

const useThemedStyles = createThemedStyles((theme) => 
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.primary,
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.md,
    },
    title: {
      ...theme.typography.heading.h2,
      color: theme.colors.text.primary,
    },
  })
);
```

### 3. Theme Switching

```tsx
import { useThemeMode } from '@shared';

function ThemeToggle() {
  const { mode, setMode, toggle, isDark, isNight } = useThemeMode();

  return (
    <View>
      <Button title="Light" onPress={() => setMode('light')} />
      <Button title="Dark" onPress={() => setMode('dark')} />
      <Button title="Night" onPress={() => setMode('night')} />
      <Button title="System" onPress={() => setMode('system')} />
      <Button title="Toggle" onPress={toggle} />
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
- **Accent**: Vibrant brand colors

#### Dark Theme  
- **Use Case**: Low-light environments
- **Background**: Dark grays (#1F2937, #374151)
- **Text**: Light colors with good contrast
- **Accent**: Softer, less intense colors

#### Night Theme
- **Use Case**: Late night usage, OLED screens
- **Background**: Pure blacks (#000000) for OLED efficiency
- **Text**: Muted colors to reduce eye strain
- **Accent**: Reduced blue light emission

### Semantic Color Tokens

```tsx
// Text colors
theme.colors.text.primary    // Main text
theme.colors.text.secondary  // Secondary text
theme.colors.text.tertiary   // Muted text
theme.colors.text.disabled   // Disabled text
theme.colors.text.inverse    // Text on dark backgrounds

// Interactive colors  
theme.colors.interactive.primary       // Primary buttons
theme.colors.interactive.primaryHover  // Hover states
theme.colors.interactive.secondary     // Secondary buttons
theme.colors.interactive.destructive   // Delete/danger actions

// Status colors
theme.colors.status.success  // Success states
theme.colors.status.warning  // Warning states  
theme.colors.status.error    // Error states
theme.colors.status.info     // Info states

// Background colors
theme.colors.background.primary    // Main backgrounds
theme.colors.background.secondary  // Secondary backgrounds
theme.colors.background.elevated   // Cards, modals
theme.colors.background.overlay    // Modal backdrops
```

### Using Colors

```tsx
// ✅ Good - Using semantic tokens
backgroundColor: theme.colors.background.primary,
color: theme.colors.text.primary,
borderColor: theme.colors.border.focused,

// ❌ Bad - Using hardcoded colors
backgroundColor: '#FFFFFF',
color: '#000000', 
borderColor: '#3B82F6',
```

## 📝 Typography

### Type Scale

The typography system provides consistent text styles:

```tsx
// Display text (heroes, large headings)
theme.typography.display.lg
theme.typography.display.xl

// Headings
theme.typography.heading.h1  // 36px, bold
theme.typography.heading.h2  // 30px, bold  
theme.typography.heading.h3  // 24px, semibold
theme.typography.heading.h4  // 20px, semibold
theme.typography.heading.h5  // 18px, medium
theme.typography.heading.h6  // 16px, medium

// Body text
theme.typography.body.xl     // 20px, regular
theme.typography.body.lg     // 18px, regular
theme.typography.body.base   // 16px, regular (default)
theme.typography.body.sm     // 14px, regular
theme.typography.body.xs     // 12px, regular

// UI text
theme.typography.button.lg   // Button text large
theme.typography.button.base // Button text default
theme.typography.label.lg    // Form labels
theme.typography.caption.base // Captions, metadata
```

### Font Weights

```tsx
theme.fontConfig.fontWeight.light     // 300
theme.fontConfig.fontWeight.regular   // 400
theme.fontConfig.fontWeight.medium    // 500
theme.fontConfig.fontWeight.semibold  // 600
theme.fontConfig.fontWeight.bold      // 700
```

### Usage Examples

```tsx
// ✅ Good - Using typography tokens
<Text style={theme.typography.heading.h2}>Page Title</Text>
<Text style={theme.typography.body.base}>Body content</Text>

// ✅ Good - Combining with colors
<Text style={[
  theme.typography.heading.h3,
  { color: theme.colors.text.primary }
]}>
  Section Header
</Text>

// ❌ Bad - Hardcoded font properties
<Text style={{ fontSize: 18, fontWeight: '600' }}>Title</Text>
```

## 📏 Spacing System

Based on a 4px grid system for consistent alignment:

```tsx
theme.spacing[0]   // 0px
theme.spacing[1]   // 4px
theme.spacing[2]   // 8px
theme.spacing[3]   // 12px
theme.spacing[4]   // 16px
theme.spacing[6]   // 24px
theme.spacing[8]   // 32px
theme.spacing[12]  // 48px
theme.spacing[16]  // 64px
theme.spacing[20]  // 80px
```

### Component Spacing

Pre-defined spacing for common component patterns:

```tsx
// Form spacing
theme.componentSpacing.form.fieldGap    // 16px between form fields
theme.componentSpacing.form.labelGap    // 8px between label and input
theme.componentSpacing.form.sectionGap  // 24px between form sections

// Layout spacing  
theme.componentSpacing.layout.screenPadding  // 16px screen edges
theme.componentSpacing.layout.sectionGap     // 32px between sections
theme.componentSpacing.layout.cardGap        // 16px between cards

// Button spacing
theme.componentSpacing.button.paddingX  // 16px horizontal padding
theme.componentSpacing.button.paddingY  // 12px vertical padding
```

### Usage Examples

```tsx
// ✅ Good - Using spacing tokens
marginBottom: theme.spacing[4],
padding: theme.spacing[6],
gap: theme.spacing[2],

// ✅ Good - Using component spacing
padding: theme.componentSpacing.layout.screenPadding,
marginBottom: theme.componentSpacing.form.fieldGap,

// ❌ Bad - Hardcoded spacing
marginBottom: 16,
padding: 24,
```

## 🎨 Component Theming

### Pre-built Component Themes

The design system includes pre-configured component themes:

```tsx
import { componentThemes } from '@shared';

// Button themes
const primaryButtonStyle = componentThemes.button.primary(theme);
const secondaryButtonStyle = componentThemes.button.secondary(theme);

// Input themes  
const inputStyle = componentThemes.input.default(theme);
const focusedInputStyle = componentThemes.input.focused(theme);

// Card themes
const cardStyle = componentThemes.card.default(theme);
const elevatedCardStyle = componentThemes.card.elevated(theme);
```

### Creating Custom Component Themes

```tsx
const useCustomButtonStyles = createThemedStyles((theme) => ({
  button: {
    ...componentThemes.button.primary(theme),
    borderRadius: theme.borderRadius.lg,
    ...theme.elevation.md,
  },
  
  text: {
    ...theme.typography.button.base,
    color: theme.colors.text.inverse,
  },
}));
```

## 🔧 Advanced Usage

### Responsive Theming

```tsx
const useResponsiveStyles = createThemedStyles((theme) => ({
  container: {
    padding: theme.spacing[4],
    // Add responsive overrides
    ...(theme.breakpoints.md && {
      padding: theme.spacing[6],
    }),
  },
}));
```

### Theme Utilities

```tsx
import { themeUtils } from '@shared';

// Add opacity to colors
const transparentBlue = themeUtils.withOpacity(theme.colors.interactive.primary, 0.5);

// Get contrasting text color
const textColor = themeUtils.getContrastText(backgroundColor);

// Create shadows
const shadowStyle = themeUtils.createShadow('md', theme.colors.interactive.primary);
```

### Performance Optimization

```tsx
// ✅ Good - Memoized styles
const useOptimizedStyles = createThemedStyles((theme) => 
  StyleSheet.create({
    // styles here are automatically memoized
  })
);

// ✅ Good - Selective theme subscriptions
const colors = useThemeColors(); // Only re-renders on color changes
const spacing = useThemeSpacing(); // Only re-renders on spacing changes

// ❌ Bad - Full theme subscription
const { theme } = useTheme(); // Re-renders on any theme change
```

## ♿ Accessibility

### Color Contrast

All color combinations meet WCAG 2.1 AA standards:

```tsx
// Colors are automatically tested for contrast
theme.colors.text.primary on theme.colors.background.primary ✅ 4.5:1+
theme.colors.text.secondary on theme.colors.background.primary ✅ 4.5:1+
```

### Touch Targets

Minimum touch target sizes are enforced:

```tsx
theme.safeArea.minTouchTarget.width   // 44px minimum
theme.safeArea.minTouchTarget.height  // 44px minimum
```

### Typography Accessibility

```tsx
// Minimum font sizes for readability
theme.typography.body.xs  // 12px minimum
theme.typography.body.sm  // 14px recommended for body text

// Adequate line heights for readability
lineHeight: fontSize * 1.5  // Automatic in typography tokens
```

## 🎯 Best Practices

### Do's ✅

- Use semantic color tokens (`theme.colors.text.primary`)
- Use typography tokens (`theme.typography.heading.h2`)
- Use spacing tokens (`theme.spacing[4]`)
- Create themed styles with `createThemedStyles`
- Use component-specific spacing (`theme.componentSpacing.form.fieldGap`)
- Test your components in all three theme modes

### Don'ts ❌

- Hardcode colors (`'#FF0000'`)
- Hardcode font sizes (`fontSize: 16`)
- Hardcode spacing (`margin: 10`)
- Create inline styles that don't use theme
- Assume colors work in all themes
- Forget to test accessibility contrast

### Migration from Hardcoded Styles

```tsx
// Before ❌
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
});

// After ✅
const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.elevated,
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.md,
      ...theme.elevation.sm,
    },
    title: {
      ...theme.typography.heading.h4,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[2],
    },
  })
);
```

## 📚 Related Documentation

- **[Colors](./COLORS.md)** - Complete color system documentation
- **[Typography](./TYPOGRAPHY.md)** - Typography scale and usage
- **[Spacing](./SPACING.md)** - Spacing system and layout patterns
- **[Components](../components/)** - Individual component documentation
- **[Migration Guide](./MIGRATION.md)** - Migrating from hardcoded styles

## 🔄 Theme Migration Checklist

When converting components to use the theme system:

- [ ] Replace hardcoded colors with semantic tokens
- [ ] Replace hardcoded fonts with typography tokens  
- [ ] Replace hardcoded spacing with spacing tokens
- [ ] Use `createThemedStyles` for component styles
- [ ] Test component in light, dark, and night themes
- [ ] Verify accessibility contrast ratios
- [ ] Update component documentation
- [ ] Add theme prop types if needed

The Academy Design System ensures consistent, accessible, and maintainable styling across all mobile applications while providing excellent developer experience and user experience.