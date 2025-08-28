# Mobile-First Theme Migration Guide

This guide helps developers migrate to the enhanced mobile-first theme system while maintaining backward compatibility.

## 🎯 Migration Overview

The Academy Apps theme system has been enhanced with mobile-first optimizations while preserving all existing APIs. **No breaking changes** - all current code continues to work unchanged.

## ✅ What's Available Now

### 🌞 High Contrast Colors
```typescript
// NEW - For better outdoor visibility
theme.colors.interactive.primarySunlight      // Maximum contrast Academy purple
theme.colors.interactive.primaryHighContrast  // Enhanced contrast Academy purple

// NEW - High contrast status colors  
theme.colors.status.errorHighContrast    // Enhanced error visibility
theme.colors.status.successHighContrast  // Enhanced success visibility
theme.colors.status.warningHighContrast  // Enhanced warning visibility
theme.colors.status.infoHighContrast     // Enhanced info visibility

// OLD - Still works unchanged
theme.colors.interactive.primary  // Standard Academy purple
theme.colors.status.error         // Standard error color
```

### 📱 Mobile Breakpoints
```typescript
// NEW - Mobile-specific breakpoints (recommended)
theme.tokens.breakpoints.mobile.phone       // 375px - Standard phone
theme.tokens.breakpoints.mobile.phoneLarge  // 414px - Large phones
theme.tokens.breakpoints.mobile.tablet      // 768px - Tablet portrait
theme.tokens.breakpoints.mobile.foldable    // 673px - Foldable devices

// OLD - Web breakpoints (still supported)
theme.tokens.breakpoints.sm    // 576px
theme.tokens.breakpoints.md    // 768px
theme.tokens.breakpoints.lg    // 992px
theme.tokens.breakpoints.xl    // 1200px
```

### 🤏 Touch & Gesture Support
```typescript
// NEW - Touch interaction constants
theme.safeArea.mobile.swipeThreshold     // 48px minimum swipe distance
theme.safeArea.mobile.panThreshold       // 8px minimum pan distance
theme.safeArea.mobile.longPressDelay     // 500ms long press delay
theme.safeArea.mobile.doubleTapDelay     // 300ms double tap window

// NEW - Haptic feedback types
theme.safeArea.haptic.light      // Light haptic feedback
theme.safeArea.haptic.medium     // Medium haptic feedback
theme.safeArea.haptic.success    // Success notification haptic
theme.safeArea.haptic.selection  // Selection change haptic
```

### 📐 Dynamic Safe Areas
```typescript
// NEW - Dynamic safe area support (recommended with react-native-safe-area-context)
theme.safeArea.dynamic.top       // Runtime top inset
theme.safeArea.dynamic.bottom    // Runtime bottom inset
theme.safeArea.dynamic.left      // Runtime left inset (landscape)
theme.safeArea.dynamic.right     // Runtime right inset (landscape)

// OLD - Static values (still supported as fallback)
theme.safeArea.notch.top         // 44px static top
theme.safeArea.notch.bottom      // 32px static bottom
```

### ⚡ Mobile Animations
```typescript
// NEW - Mobile-optimized animation durations
theme.tokens.animation.mobile.swipe       // 200ms - Quick swipe animations
theme.tokens.animation.mobile.transition  // 250ms - Screen transitions
theme.tokens.animation.mobile.modal       // 300ms - Modal slide animations
theme.tokens.animation.mobile.spring      // 500ms - Spring effects

// NEW - Performance constants
theme.tokens.mobile.performance.throttleMs   // 16ms - 60fps throttling
theme.tokens.mobile.performance.debounceMs   // 100ms - Input debouncing
```

## 🚀 Migration Examples

### Example 1: Enhanced Outdoor Button
```typescript
// BEFORE - Standard button
const StandardButton = () => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity 
      style={{
        backgroundColor: theme.colors.interactive.primary, // Standard contrast
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
      }}
    >
      <Text style={{ color: theme.colors.text.inverse }}>
        Standard Button
      </Text>
    </TouchableOpacity>
  );
};

// AFTER - High contrast for outdoor use
const OutdoorButton = () => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity 
      style={{
        backgroundColor: theme.colors.interactive.primarySunlight, // 🌞 Maximum contrast
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

### Example 2: Dynamic Safe Area Implementation
```typescript
// BEFORE - Static safe area
const StaticSafeScreen = () => {
  const { theme } = useTheme();
  
  return (
    <View style={{
      paddingTop: theme.safeArea.notch.top,        // Static 44px
      paddingBottom: theme.safeArea.notch.bottom,  // Static 32px
      paddingHorizontal: theme.spacing.md,
    }}>
      {/* Content */}
    </View>
  );
};

// AFTER - Dynamic safe area (recommended)
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DynamicSafeScreen = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{
      paddingTop: insets.top || theme.safeArea.notch.top,        // 📐 Dynamic with fallback
      paddingBottom: insets.bottom || theme.safeArea.notch.bottom, // 📐 Dynamic with fallback  
      paddingHorizontal: theme.spacing.md,
    }}>
      {/* Content */}
    </View>
  );
};
```

### Example 3: Gesture-Aware Component
```typescript
// NEW - Adding gesture support
import { PanGestureHandler } from 'react-native-gesture-handler';
import { HapticFeedback } from 'react-native-haptic-feedback';

const SwipeableCard = () => {
  const { theme } = useTheme();
  
  const handleSwipe = (gestureState) => {
    if (Math.abs(gestureState.dx) > theme.safeArea.mobile.swipeThreshold) {
      // Trigger swipe action
      HapticFeedback.trigger(theme.safeArea.haptic.light); // 🤏 Haptic feedback
    }
  };
  
  return (
    <PanGestureHandler onGestureEvent={handleSwipe}>
      <View style={{
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        ...theme.elevation.base, // 🔄 Platform-optimized shadow
      }}>
        {/* Swipeable content */}
      </View>
    </PanGestureHandler>
  );
};
```

### Example 4: Responsive Mobile Layout
```typescript
// NEW - Mobile-first responsive design
const ResponsiveLayout = () => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  
  const isTablet = width >= theme.tokens.breakpoints.mobile.tablet; // 📱 Mobile breakpoint
  const isPhone = width < theme.tokens.breakpoints.mobile.phone;
  
  return (
    <View style={{
      paddingHorizontal: isTablet 
        ? theme.spacing.xl    // 32px for tablets
        : theme.spacing.md,   // 16px for phones
      gap: isTablet 
        ? theme.spacing.lg    // 24px gap for tablets
        : theme.spacing.md,   // 16px gap for phones
    }}>
      {/* Responsive content */}
    </View>
  );
};
```

## 📋 Migration Checklist

### Phase 1: Immediate Benefits (No Code Changes)
- [ ] ✅ **Platform-optimized shadows** - Already applied automatically
- [ ] ✅ **Enhanced color contrast** - Available for new implementations
- [ ] ✅ **Mobile breakpoints** - Ready for responsive designs

### Phase 2: Optional Upgrades (Gradual Migration)
- [ ] 🌞 **Upgrade critical buttons** to use `primarySunlight` for outdoor visibility
- [ ] 📐 **Add dynamic safe area** support using `useSafeAreaInsets`
- [ ] 🤏 **Include haptic feedback** for better user experience
- [ ] 📱 **Use mobile breakpoints** instead of web breakpoints
- [ ] ⚡ **Add gesture support** for swipeable components

### Phase 3: Advanced Features (New Components)
- [ ] 🎯 **Implement gesture recognition** with proper thresholds
- [ ] 🔄 **Add loading states** with mobile-optimized animations
- [ ] 📊 **Performance optimization** using throttling/debouncing constants

## 🛠️ Implementation Patterns

### Pattern 1: Conditional High Contrast
```typescript
// Use high contrast conditionally (e.g., outdoor mode setting)
const useOutdoorColors = () => {
  const { theme } = useTheme();
  const isOutdoorMode = useOutdoorMode(); // Your outdoor mode setting
  
  return {
    primary: isOutdoorMode 
      ? theme.colors.interactive.primarySunlight 
      : theme.colors.interactive.primary,
    error: isOutdoorMode 
      ? theme.colors.status.errorHighContrast 
      : theme.colors.status.error,
  };
};
```

### Pattern 2: Safe Area Helper Hook
```typescript
// Custom hook for safe area with fallbacks
const useSafeArea = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  
  return {
    top: insets.top || theme.safeArea.notch.top,
    bottom: insets.bottom || theme.safeArea.notch.bottom,
    left: insets.left || theme.safeArea.dynamic.left,
    right: insets.right || theme.safeArea.dynamic.right,
  };
};
```

### Pattern 3: Mobile-First Responsive Hook
```typescript
// Mobile-first responsive helper
const useMobileLayout = () => {
  const { theme } = useTheme();
  const { width, height } = useWindowDimensions();
  
  return {
    isPhone: width < theme.tokens.breakpoints.mobile.phone,
    isLargePhone: width >= theme.tokens.breakpoints.mobile.phone && width < theme.tokens.breakpoints.mobile.tablet,
    isTablet: width >= theme.tokens.breakpoints.mobile.tablet,
    isFoldable: width === theme.tokens.breakpoints.mobile.foldable,
    isLandscape: width > height,
    isPortrait: width <= height,
  };
};
```

## 🎯 Best Practices

### 1. **Gradual Migration Strategy**
- Start with new components using mobile-first features
- Gradually upgrade existing high-traffic components
- Keep backward compatibility for legacy code

### 2. **High Contrast Usage**
- Use `primarySunlight` for outdoor/sports apps
- Use `primaryHighContrast` for accessibility improvements
- Test on actual devices in bright sunlight

### 3. **Dynamic Safe Areas**
- Always provide static fallbacks for safety
- Test on devices with different notch configurations
- Consider landscape mode requirements

### 4. **Performance Optimization**
- Use throttling constants for scroll handlers
- Implement debouncing for user input
- Optimize animations for 60fps target

## 📚 Resources

- **[Full Theme Documentation](./THEME_SYSTEM.md)** - Complete theme system reference
- **[Component Examples](./components/README.md)** - Updated component documentation
- **[React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context)** - Dynamic safe area support
- **[React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)** - Advanced gesture support

## ❓ FAQ

### Q: Do I need to update existing code?
**A:** No! All existing code continues to work. The mobile-first features are additive enhancements.

### Q: When should I use high contrast variants?
**A:** Use them for outdoor apps, accessibility improvements, or when users report visibility issues in bright conditions.

### Q: How do I test dynamic safe areas?
**A:** Test on devices with notches, in landscape mode, and with the SafeAreaProvider properly configured.

### Q: Are the new features compatible with older devices?
**A:** Yes, all features gracefully degrade with fallback values for older devices.

---

**🚀 Ready to enhance your mobile experience?** Start with high contrast colors for immediate improvements, then gradually add dynamic safe areas and gesture support for a fully mobile-first experience!