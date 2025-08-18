# Academy Apps Theme System Documentation

This document provides the definitive guide to the Academy Apps design system and theme structure.

## 🎨 Theme Structure Overview

The Academy Apps use a comprehensive theme system located in `/shared/src/theme/` with the following structure:

```
shared/src/theme/
├── colors.ts      # Complete color palette and mappings
├── typography.ts  # Font sizes, weights, line heights
├── spacing.ts     # Spacing scale, border radius, elevation
├── index.ts       # Main theme exports and interfaces
└── ThemeProvider.tsx  # React context provider
```

## 🔥 CRITICAL: Correct Theme Variable Usage

### ✅ **Academy Purple - CORRECT USAGE**

```typescript
// ✅ CORRECT - This is the Academy brand purple (#4F2EC9)
theme.colors.interactive.primary

// ❌ WRONG - These DO NOT exist in the theme structure
theme.colors.primary.main          // ← Does not exist
theme.colors.academy.purple[500]   // ← Not exposed in theme
```

### 🎯 **Main Color Categories**

#### **Interactive Colors (Primary UI Elements)**
```typescript
theme.colors.interactive.primary        // Academy purple #4F2EC9
theme.colors.interactive.primaryHover   // Hover state
theme.colors.interactive.secondary      // White buttons
theme.colors.interactive.destructive    // Red/danger buttons
theme.colors.interactive.orange         // Academy orange
```

#### **Text Colors**
```typescript
theme.colors.text.primary    // Main text #171717
theme.colors.text.secondary  // Secondary text #525252  
theme.colors.text.tertiary   // Muted text #737373
theme.colors.text.disabled   // Disabled text #A3A3A3
theme.colors.text.inverse    // White text #FFFFFF
```

#### **Background Colors**
```typescript
theme.colors.background.primary    // Main background #FFFFFF
theme.colors.background.secondary  // Card/elevated background #FAFAFA
theme.colors.background.tertiary   // Subtle background #F5F5F5
```

#### **Border Colors**
```typescript
theme.colors.border.primary   // Default borders #E5E5E5
theme.colors.border.focused   // Focus state (Academy purple)
theme.colors.border.error     // Error state borders
```

#### **Status Colors**
```typescript
theme.colors.status.success   // Green #059669
theme.colors.status.warning   // Orange #D97706
theme.colors.status.error     // Red #DC2626
theme.colors.status.info      // Blue #2563EB
```

## 📏 Spacing and Typography

### **Spacing Scale**
```typescript
theme.spacing.xs    // 4px
theme.spacing.sm    // 8px
theme.spacing.md    // 16px
theme.spacing.lg    // 24px
theme.spacing.xl    // 32px
theme.spacing.xxl   // 48px
```

### **Typography**
```typescript
theme.fontSizes.xs     // 12px
theme.fontSizes.sm     // 14px
theme.fontSizes.body   // 16px
theme.fontSizes.lg     // 18px
theme.fontSizes.xl     // 24px

theme.fontConfig.fontWeight.normal      // '400'
theme.fontConfig.fontWeight.medium      // '500'
theme.fontConfig.fontWeight.semibold    // '600'
theme.fontConfig.fontWeight.bold        // '700'
```

### **Border Radius**
```typescript
theme.borderRadius.sm    // 4px
theme.borderRadius.md    // 8px
theme.borderRadius.lg    // 12px
theme.borderRadius.xl    // 16px
theme.borderRadius.full  // 9999px (fully rounded)
```

## 🛠️ Implementation Patterns

### **Dynamic Styling Pattern**
Use this pattern for components that need theme-aware styling:

```typescript
import { useTheme } from '@academy/mobile-shared';

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
  text: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  button: {
    backgroundColor: theme.colors.interactive.primary, // Academy purple
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  buttonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontConfig.fontWeight.semibold,
  },
});

export const MyComponent: React.FC = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Academy Button</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### **Simple Styling Pattern**
For simpler components, you can use inline theme references:

```typescript
import { useTheme } from '@academy/mobile-shared';

export const SimpleComponent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background.primary }}>
      <Text style={{ 
        color: theme.colors.text.primary,
        fontSize: theme.fontSizes.body 
      }}>
        Simple Text
      </Text>
      <ActivityIndicator 
        color={theme.colors.interactive.primary} // Academy purple
        size="large" 
      />
    </View>
  );
};
```

## 🚨 Common Mistakes to Avoid

### **❌ WRONG Theme References**
```typescript
// These DO NOT exist:
theme.colors.primary.main
theme.colors.academy.purple[500]
theme.colors.brand.primary
theme.colors.main
theme.primary

// Hardcoded colors:
color: "#4F2EC9"
backgroundColor: "#FFFFFF"
fontSize: 16
padding: 24
```

### **✅ CORRECT Theme References**
```typescript
// Use these instead:
theme.colors.interactive.primary      // Academy purple
theme.colors.background.primary       // White background
theme.fontSizes.body        // 16px font size
theme.spacing.lg                      // 24px padding
```

## 🎨 Color Mapping Reference

### **Base Colors → Theme Mapping**
The theme system maps base colors to semantic names:

```typescript
// Base definition (in colors.ts):
baseColors.academy.purple[500] = "#4F2EC9"

// Exposed in theme as:
theme.colors.interactive.primary = "#4F2EC9"

// NOT exposed as:
theme.colors.academy.purple[500] // ← This doesn't exist in theme
```

### **Academy Brand Colors Available**
```typescript
theme.colors.interactive.primary   // Academy purple #4F2EC9
theme.colors.interactive.orange    // Academy orange #FEAE24
```

## 📱 App-Specific Usage

### **TabNavigator Example**
```typescript
// ✅ CORRECT - Both apps use this pattern
tabBarActiveTintColor: theme.colors.interactive.primary,
tabBarInactiveTintColor: theme.colors.text.tertiary,
```

### **Button Components**
```typescript
// ✅ CORRECT - Primary Academy button
<TouchableOpacity 
  style={{ backgroundColor: theme.colors.interactive.primary }}
>
  <Text style={{ color: theme.colors.text.inverse }}>
    Academy Button
  </Text>
</TouchableOpacity>
```

### **Loading Indicators**
```typescript
// ✅ CORRECT - Academy purple loading spinner
<ActivityIndicator 
  color={theme.colors.interactive.primary} 
  size="large" 
/>
```

## 🌙 Dark Mode Support

The theme system automatically handles dark mode. All theme variables change appropriately:

```typescript
// Light mode: theme.colors.text.primary = "#171717" (dark text)
// Dark mode:  theme.colors.text.primary = "#FAFAFA" (light text)

// Academy purple stays consistent in both modes:
theme.colors.interactive.primary = "#4F2EC9" (light mode)
theme.colors.interactive.primary = "#A489FF" (dark mode - adjusted for better contrast)
```

## 🔄 Migration Guide

If you find code using old patterns, migrate like this:

```typescript
// OLD - Replace these:
color: "#4F2EC9"                    → theme.colors.interactive.primary
backgroundColor: "#FFFFFF"          → theme.colors.background.primary
fontSize: 16                        → theme.fontSizes.body
padding: 24                         → theme.spacing.lg
borderRadius: 8                     → theme.borderRadius.md

// OLD - Non-existent theme references:
theme.colors.primary.main           → theme.colors.interactive.primary
theme.colors.academy.purple[500]    → theme.colors.interactive.primary
```

## 📚 Related Files

- **Theme Definition**: `/shared/src/theme/index.ts`
- **Color Palette**: `/shared/src/theme/colors.ts`
- **Usage Examples**: 
  - `/academy-instructors-app/src/navigation/TabNavigator.tsx`
  - `/academy-students-app/src/shared/navigation/TabNavigator.tsx`
- **Theme Provider**: `/shared/src/theme/ThemeProvider.tsx`

---

**🎯 REMEMBER**: Always use `theme.colors.interactive.primary` for Academy purple, never hardcode colors or use non-existent theme paths!