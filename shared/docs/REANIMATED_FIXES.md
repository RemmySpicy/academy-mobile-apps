# Reanimated Layout Animation Fixes

## Issue

You were encountering this warning:
```
[Reanimated] Property [transform] may be overwritten by a layout animation. 
Please wrap your component with an animated view and apply the layout animation on the wrapper.
```

## Root Cause

The warning occurs when:
1. **Layout animations** (like `FadeInDown`) automatically apply `transform` properties
2. **Manual transform animations** (like tab icon scaling) also apply `transform` properties
3. These conflict and Reanimated warns about potential overwrites

## Solution

Created `AnimatedWrapper` component that prevents transform conflicts by:
- Applying layout animations to an outer container
- Keeping inner content separate from layout animations
- Preventing transform property conflicts

## Usage

### Before (Problematic)
```tsx
import Animated, { FadeInDown } from 'react-native-reanimated';

<Animated.View entering={FadeInDown.delay(200).springify()}>
  <MyComponent />
</Animated.View>
```

### After (Fixed)
```tsx
import { FadeInWrapper } from '@academy/mobile-shared';

<FadeInWrapper delay={200} springify={true}>
  <MyComponent />
</FadeInWrapper>
```

## Components Fixed

1. **CustomDropdown.tsx** - Fixed modal animation wrapper conflicts
2. **StudentsScreen.tsx** - Replaced all `Animated.View` with `FadeInWrapper`
3. **TabNavigator.tsx** - Added proper styling to animated tab icons

## Available Wrappers

- `AnimatedWrapper` - Generic wrapper for any layout animation
- `FadeInWrapper` - Convenience wrapper for common `FadeInDown` animations

## Props

```tsx
interface AnimatedWrapperProps {
  children: React.ReactNode;
  entering?: any;           // Any Reanimated entering animation
  exiting?: any;            // Any Reanimated exiting animation
  delay?: number;           // Animation delay in ms
  duration?: number;        // Animation duration in ms
  springify?: boolean;      // Use spring animation
  style?: AnimatedStyleProp<ViewStyle>;
}
```

## Next Steps

To completely eliminate the warning across all screens:

1. Replace all direct `Animated.View` usage with `AnimatedWrapper` or `FadeInWrapper`
2. Focus on these files that use `FadeInDown`:
   - `ProgressScreen.tsx`
   - `ProfileScreen.tsx` 
   - `CoursesScreen.tsx`
   - `PerformanceScreen.tsx`
   - `ClassroomScreen.tsx`
   - `AttendanceScreen.tsx`
   - `BookingsScreen.tsx`

## Example Migration

```tsx
// Old
<Animated.View entering={FadeInDown.delay(300).springify()}>
  <Content />
</Animated.View>

// New
<FadeInWrapper delay={300} springify={true}>
  <Content />
</FadeInWrapper>
```

This approach maintains the same visual animations while preventing Reanimated transform conflicts.