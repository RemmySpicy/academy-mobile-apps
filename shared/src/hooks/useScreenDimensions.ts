import { useWindowDimensions, Dimensions } from 'react-native';
import { useMemo, useState, useEffect } from 'react';

/**
 * Enhanced hook for screen dimensions with responsive breakpoints
 * Combines modern useWindowDimensions with legacy Dimensions support
 * Replaces deprecated Dimensions.get() usage while maintaining compatibility
 */
export function useScreenDimensions() {
  const { width, height, scale, fontScale } = useWindowDimensions();

  const breakpoints = useMemo(() => ({
    // Modern breakpoints
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
    isTablet: width >= 768 && width < 1200,
    isDesktop: width >= 1200,
    
    // Common aspect ratios
    aspectRatio: width / height,
    isWideScreen: (width / height) > 1.5,
    isUltraWide: (width / height) > 2.0,
    
    // Responsive sizing helpers
    responsiveWidth: (percentage: number) => (width * percentage) / 100,
    responsiveHeight: (percentage: number) => (height * percentage) / 100,
    responsiveSize: (size: number) => Math.min(width, height) * (size / 100),
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
 * Alias for useScreenDimensions for backward compatibility
 * @deprecated Use useScreenDimensions instead
 */
export const useResponsiveDimensions = useScreenDimensions;

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