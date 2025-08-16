import { useWindow, useWindowDimensions } from 'react-native';
import { useMemo } from 'react';

/**
 * Modern hook for screen dimensions with responsive breakpoints
 * Replaces deprecated Dimensions.get() usage
 */
export function useScreenDimensions() {
  const { width, height, scale, fontScale } = useWindowDimensions();

  const breakpoints = useMemo(() => ({
    // Mobile breakpoints
    isXSmall: width < 360,
    isSmall: width >= 360 && width < 768,
    isMedium: width >= 768 && width < 1024,
    isLarge: width >= 1024 && width < 1440,
    isXLarge: width >= 1440,
    
    // Orientation
    isPortrait: height > width,
    isLandscape: width > height,
    
    // Device type approximations
    isPhone: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    
    // Common aspect ratios
    aspectRatio: width / height,
    isWideScreen: (width / height) > 1.5,
  }), [width, height]);

  return {
    width,
    height,
    scale,
    fontScale,
    ...breakpoints,
  };
}

/**
 * Hook for getting responsive values based on screen size
 */
export function useResponsiveValue<T>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  default: T;
}) {
  const { isXSmall, isSmall, isMedium, isLarge, isXLarge } = useScreenDimensions();

  return useMemo(() => {
    if (isXSmall && values.xs !== undefined) return values.xs;
    if (isSmall && values.sm !== undefined) return values.sm;
    if (isMedium && values.md !== undefined) return values.md;
    if (isLarge && values.lg !== undefined) return values.lg;
    if (isXLarge && values.xl !== undefined) return values.xl;
    return values.default;
  }, [isXSmall, isSmall, isMedium, isLarge, isXLarge, values]);
}

export default useScreenDimensions;