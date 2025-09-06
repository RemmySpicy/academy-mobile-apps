# Academy Apps Theme System Documentation

This document provides the definitive guide to the Academy Apps design system and theme structure.

## 📱 Mobile-First Design System

The Academy Apps theme system is **mobile-first optimized** with enhanced support for:
- 📱 Mobile-specific breakpoints and device handling
- 🎨 High contrast colors for outdoor/sunlight visibility 
- 🤏 Touch gestures and haptic feedback constants
- 🔄 Platform-specific shadow optimization (iOS/Android)
- 📐 Dynamic safe area support for modern devices

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

// 🌞 NEW: High contrast variants for mobile outdoor visibility
theme.colors.interactive.primaryHighContrast  // Enhanced contrast
theme.colors.interactive.primarySunlight      // Maximum contrast for sunlight
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

// 🌞 NEW: High contrast variants for outdoor visibility
theme.colors.status.successHighContrast  // Enhanced green
theme.colors.status.warningHighContrast  // Enhanced orange
theme.colors.status.errorHighContrast    // Enhanced red
theme.colors.status.infoHighContrast     // Enhanced blue
```

## 📏 Spacing and Typography

### **Spacing Scale**
```typescript
theme.spacing.xs    // 4px
theme.spacing.sm    // 8px
theme.spacing.md    // 16px  ← STANDARD for screen horizontal padding
theme.spacing.lg    // 24px
theme.spacing.xl    // 32px
theme.spacing.xxl   // 48px
```

### 🎯 **Horizontal Padding Standards (Updated 2025)**

**✅ CONSISTENCY ACHIEVED** - All screen files now use standardized horizontal spacing

#### **Screen Edge Padding**
```typescript
// ✅ CORRECT - Standard screen edge padding
paddingHorizontal: theme.spacing.md,  // 16px

// ❌ WRONG - Avoid these patterns
paddingHorizontal: theme.spacing.lg,  // 24px (too large)
paddingHorizontal: 16,                // Hardcoded value
paddingHorizontal: 24,                // Hardcoded value
```

#### **Implementation Examples**
```typescript
// Screen container
const screenContainer = {
  paddingHorizontal: theme.spacing.md,  // 16px from edges
  paddingVertical: theme.spacing.lg,    // 24px top/bottom
}

// Card internal padding can vary based on need
const cardInternal = {
  padding: theme.spacing.md,           // 16px all around
  margin: theme.spacing.sm,            // 8px margin
}
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

## 📱 Mobile-First Features

### **Mobile Breakpoints**
```typescript
// 📱 Mobile-specific breakpoints (recommended)
theme.tokens.breakpoints.mobile.phone       // 375px - Standard phone
theme.tokens.breakpoints.mobile.phoneLarge  // 414px - Large phones
theme.tokens.breakpoints.mobile.tablet      // 768px - Tablet portrait
theme.tokens.breakpoints.mobile.foldable    // 673px - Foldable devices

// 🔄 Orientation support
theme.tokens.breakpoints.orientation.portrait   // Portrait mode
theme.tokens.breakpoints.orientation.landscape  // Landscape mode
```

### **Touch & Gesture Constants**
```typescript
// 🤏 Touch interactions
theme.safeArea.mobile.swipeThreshold     // 48px minimum swipe distance
theme.safeArea.mobile.panThreshold       // 8px minimum pan distance
theme.safeArea.mobile.longPressDelay     // 500ms long press
theme.safeArea.mobile.doubleTapDelay     // 300ms double tap window

// 📳 Haptic feedback types
theme.safeArea.haptic.light      // Light haptic feedback
theme.safeArea.haptic.medium     // Medium haptic feedback
theme.safeArea.haptic.success    // Success notification haptic
theme.safeArea.haptic.selection  // Selection change haptic
```

### **Dynamic Safe Areas**
```typescript
// 📐 Dynamic safe area support (with react-native-safe-area-context)
theme.safeArea.dynamic.top       // Dynamic top inset
theme.safeArea.dynamic.bottom    // Dynamic bottom inset
theme.safeArea.dynamic.left      // Dynamic left inset (landscape)
theme.safeArea.dynamic.right     // Dynamic right inset (landscape)

// 📱 Legacy static values (fallback)
theme.safeArea.notch.top         // 44px for devices with notch
theme.safeArea.notch.bottom      // 32px for home indicator
```

### **Mobile Animation Timings**
```typescript
// ⚡ Mobile-optimized animations
theme.tokens.animation.mobile.swipe       // 200ms - Quick swipe
theme.tokens.animation.mobile.transition  // 250ms - Screen transitions
theme.tokens.animation.mobile.modal       // 300ms - Modal animations
theme.tokens.animation.mobile.spring      // 500ms - Spring effects

// 🎯 Touch interaction timings
theme.tokens.mobile.touch.debounceMs      // 50ms - Rapid tap debounce
theme.tokens.mobile.touch.longPressMs    // 500ms - Long press threshold
theme.tokens.mobile.touch.doubleTapMs     // 300ms - Double tap window
```

### **Platform-Optimized Shadows**
```typescript
// 🍎 iOS: Softer, more natural shadows
// 🤖 Android: Elevation-focused with optimized opacity
// 🌐 Web: Standard box-shadow support

theme.elevation.sm   // Platform-optimized small shadow
theme.elevation.base // Platform-optimized standard shadow
theme.elevation.lg   // Platform-optimized large shadow
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

// 🌞 High contrast variants adapt for both modes:
theme.colors.interactive.primaryHighContrast  // Light: darker, Dark: lighter
theme.colors.interactive.primarySunlight      // Maximum contrast for both modes
```

### **Enhanced Dark Mode Backgrounds (2025 Update)**

Dark mode now uses softer, less harsh background colors for improved eye comfort:

```typescript
// 🌙 Dark mode backgrounds - optimized for comfort
theme.colors.background.primary    // #212121 (13% brightness - softer than pure black)
theme.colors.background.secondary  // #2C2C2C (17% brightness - elevated surfaces)
theme.colors.background.tertiary   // #383838 (22% brightness - highest elevation)
theme.colors.background.elevated   // #292929 (16% brightness - cards, modals)
```

**Key Improvements:**
- **Reduced Eye Strain**: Moved away from harsh near-black colors (`#1A1A1A`) to warmer, softer dark tones
- **Better Contrast**: Improved contrast ratios between UI elements and backgrounds
- **Elevated Hierarchy**: Clear visual hierarchy between different background levels
- **Comfort-First**: Optimized for extended viewing sessions

## 📱 Mobile-First Usage Examples

### **High Contrast for Outdoor Use**
```typescript
// 🌞 Use high contrast variants for better outdoor visibility
const OutdoorButton = () => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity 
      style={{
        backgroundColor: theme.colors.interactive.primarySunlight, // Maximum contrast
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
      }}
    >
      <Text style={{ color: theme.colors.text.inverse }}>
        Outdoor Visible Button
      </Text>
    </TouchableOpacity>
  );
};
```

### **Dynamic Safe Area Usage**
```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SafeAreaScreen = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets(); // Dynamic insets
  
  return (
    <View style={{
      paddingTop: insets.top || theme.safeArea.notch.top,        // Dynamic or fallback
      paddingBottom: insets.bottom || theme.safeArea.notch.bottom, // Dynamic or fallback
      paddingHorizontal: theme.spacing.md,
    }}>
      {/* Content */}
    </View>
  );
};
```

### **Gesture-Aware Components**
```typescript
const SwipeableCard = () => {
  const { theme } = useTheme();
  
  const handleSwipe = (gestureState) => {
    if (Math.abs(gestureState.dx) > theme.safeArea.mobile.swipeThreshold) {
      // Trigger swipe action
      HapticFeedback.trigger(theme.safeArea.haptic.light);
    }
  };
  
  return (
    <PanGestureHandler onGestureEvent={handleSwipe}>
      <View style={{
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        ...theme.elevation.base, // Platform-optimized shadow
      }}>
        {/* Swipeable content */}
      </View>
    </PanGestureHandler>
  );
};
```

### **Responsive Mobile Layout**
```typescript
const ResponsiveLayout = () => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  
  const isTablet = width >= theme.tokens.breakpoints.mobile.tablet;
  
  return (
    <View style={{
      paddingHorizontal: isTablet ? theme.spacing.xl : theme.spacing.md,
      gap: isTablet ? theme.spacing.lg : theme.spacing.md,
    }}>
      {/* Responsive content */}
    </View>
  );
};
```

## 🔄 Migration Guide

### **Legacy to Mobile-First Migration**
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

// 📱 NEW - Mobile-first additions (optional upgrades):
theme.colors.interactive.primary    → theme.colors.interactive.primarySunlight (for outdoor use)
static safe area constants          → dynamic safe area with useSafeAreaInsets()
generic breakpoints                 → theme.tokens.breakpoints.mobile.*
hardcoded animation timings         → theme.tokens.animation.mobile.*
```

### **Performance Optimizations**
```typescript
// 🚀 Use mobile performance constants
const optimizedComponent = {
  // Throttle rapid updates to 60fps
  throttleMs: theme.tokens.mobile.performance.throttleMs,
  
  // Debounce user input
  debounceMs: theme.tokens.mobile.performance.debounceMs,
  
  // Platform-optimized scroll behavior
  decelerationRate: theme.safeArea.mobile.scroll.decelerationRate,
};
```

## 📚 Related Files

- **Theme Definition**: `/shared/src/theme/index.ts`
- **Color Palette**: `/shared/src/theme/colors.ts`
- **Usage Examples**: 
  - `/academy-instructors-app/src/navigation/TabNavigator.tsx`
  - `/academy-students-app/src/shared/navigation/TabNavigator.tsx`
- **Theme Provider**: `/shared/src/theme/ThemeProvider.tsx`

---

## 🎯 Mobile-First Best Practices

1. **📱 Use mobile breakpoints** instead of web breakpoints when possible
2. **🌞 Consider high contrast variants** for outdoor visibility
3. **🤏 Include gesture support** with proper thresholds and haptic feedback
4. **📐 Use dynamic safe areas** for modern devices with varied insets
5. **⚡ Leverage platform-optimized** shadows and animations
6. **🎯 Always use semantic theme colors** - never hardcode values

**🔥 CRITICAL**: Always use `theme.colors.interactive.primary` for Academy purple, never hardcode colors or use non-existent theme paths!

**📱 NEW**: Consider using `primarySunlight` for outdoor mobile apps and dynamic safe areas for modern device support!