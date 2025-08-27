/**
 * useComponentStyles Hook
 * 
 * A comprehensive hook that provides consistent styling patterns for Academy Apps components.
 * Fixes mobile display issues by providing a unified styling approach that works across all platforms.
 * 
 * PRODUCTION-READY: This hook addresses the core mobile compatibility issues identified in the
 * Academy Apps shared components.
 */

import { useMemo } from 'react';
import { StyleSheet, ViewStyle, TextStyle, ImageStyle, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

type Style = ViewStyle | TextStyle | ImageStyle;
type StylesObject = Record<string, Style>;

interface ResponsiveStyleConfig<T extends StylesObject> {
  base: T;
  phone?: Partial<T>;
  tablet?: Partial<T>;
  desktop?: Partial<T>;
  portrait?: Partial<T>;
  landscape?: Partial<T>;
}

/**
 * Enhanced styling hook that fixes mobile display issues
 * 
 * ADDRESSES CORE ISSUES:
 * 1. Inconsistent styling patterns across components
 * 2. Hardcoded screen dimensions in ThemeProvider
 * 3. StyleSheet.create() vs inline styles compatibility
 * 
 * FEATURES:
 * - Uses real device dimensions from useTheme().screenDimensions
 * - Provides consistent styling API across all components
 * - Handles responsive breakpoints automatically
 * - Compatible with both StyleSheet and inline style approaches
 * - Mobile-first design principles
 */
export function useComponentStyles<T extends StylesObject>(
  stylesCreator: (theme: any, screenDimensions: any) => T | ResponsiveStyleConfig<T>,
  dependencies: any[] = []
): T {
  const { theme, screenDimensions } = useTheme();

  return useMemo(() => {
    const createdStyles = stylesCreator(theme, screenDimensions);
    
    // If the styles creator returns a responsive config, process it
    if (isResponsiveConfig(createdStyles)) {
      return processResponsiveStyles(createdStyles, screenDimensions);
    }
    
    // For backward compatibility, if it's a regular StyleSheet or object, return as-is
    // This ensures existing components continue working while new ones can use responsive features
    return createdStyles as T;
  }, [theme, screenDimensions, ...dependencies]);
}

/**
 * Hook specifically for creating StyleSheet-based styles with mobile compatibility
 * 
 * FIXES: Mobile StyleSheet.create() rendering issues observed in CustomButton
 * ENSURES: Consistent styling approach across web and mobile platforms
 */
export function useStyleSheet<T extends StylesObject>(
  stylesCreator: (theme: any, screenDimensions: any) => Record<keyof T, Style>,
  dependencies: any[] = []
): T {
  const { theme, screenDimensions } = useTheme();

  return useMemo(() => {
    try {
      const rawStyles = stylesCreator(theme, screenDimensions);
      
      // On mobile, StyleSheet.create() sometimes fails to apply styles properly
      // This approach ensures compatibility across platforms
      if (Platform.OS !== 'web') {
        // For mobile, return styles directly to avoid StyleSheet processing issues
        // while maintaining the same structure as StyleSheet.create()
        return rawStyles as T;
      }
      
      // On web, use StyleSheet.create() for optimization
      return StyleSheet.create(rawStyles) as T;
    } catch (error) {
      console.warn('useStyleSheet: Failed to create styles, falling back to direct object:', error);
      // Fallback: return styles directly without StyleSheet.create()
      return stylesCreator(theme, screenDimensions) as T;
    }
  }, [theme, screenDimensions, ...dependencies]);
}

/**
 * Hook for responsive styling based on screen dimensions
 * 
 * ADDRESSES: Components that need different styles based on screen size
 * PROVIDES: Automatic responsive styling without manual breakpoint checking
 */
export function useResponsiveStyles<T extends StylesObject>(
  config: ResponsiveStyleConfig<T>
): T {
  const { screenDimensions } = useTheme();

  return useMemo(() => {
    return processResponsiveStyles(config, screenDimensions);
  }, [config, screenDimensions]);
}

/**
 * Utility hook for conditional styling based on device type
 * 
 * SIMPLIFIES: Component code by providing device-specific styles
 */
export function useDeviceStyles<T>(styles: {
  phone?: T;
  tablet?: T;
  desktop?: T;
  default: T;
}): T {
  const { screenDimensions } = useTheme();

  return useMemo(() => {
    if (screenDimensions.isPhone && styles.phone) return styles.phone;
    if (screenDimensions.isTablet && styles.tablet) return styles.tablet;
    if (screenDimensions.isDesktop && styles.desktop) return styles.desktop;
    return styles.default;
  }, [styles, screenDimensions]);
}

// Helper function to check if the styles creator returned a responsive config
function isResponsiveConfig<T extends StylesObject>(
  styles: T | ResponsiveStyleConfig<T>
): styles is ResponsiveStyleConfig<T> {
  return typeof styles === 'object' && 'base' in styles && styles.base !== undefined;
}

// Process responsive styles based on screen dimensions
function processResponsiveStyles<T extends StylesObject>(
  config: ResponsiveStyleConfig<T>,
  screenDimensions: any
): T {
  let processedStyles = { ...config.base };

  // Apply device-specific overrides
  if (screenDimensions.isPhone && config.phone) {
    processedStyles = { ...processedStyles, ...config.phone };
  }
  if (screenDimensions.isTablet && config.tablet) {
    processedStyles = { ...processedStyles, ...config.tablet };
  }
  if (screenDimensions.isDesktop && config.desktop) {
    processedStyles = { ...processedStyles, ...config.desktop };
  }

  // Apply orientation-specific overrides
  if (screenDimensions.isPortrait && config.portrait) {
    processedStyles = { ...processedStyles, ...config.portrait };
  }
  if (screenDimensions.isLandscape && config.landscape) {
    processedStyles = { ...processedStyles, ...config.landscape };
  }

  return processedStyles as T;
}

/**
 * Legacy compatibility hook - maps to useComponentStyles
 * 
 * MAINTAINS: Backward compatibility with existing createThemedStyles usage
 */
export function createThemedStyles<T extends StylesObject>(
  stylesCreator: (theme: any) => T
) {
  return function useThemedStyles(): T {
    const { theme } = useTheme();
    return useMemo(() => stylesCreator(theme), [theme]);
  };
}

/**
 * Debug hook for troubleshooting mobile styling issues
 * 
 * PROVIDES: Detailed logging of styling decisions for debugging
 */
export function useStyleDebug(componentName: string, enabled: boolean = __DEV__) {
  const { theme, screenDimensions } = useTheme();

  useMemo(() => {
    if (!enabled || Platform.OS === 'web') return;

    console.log(`🎨 ${componentName} Style Debug:`, {
      screenWidth: screenDimensions.width,
      screenHeight: screenDimensions.height,
      isPhone: screenDimensions.isPhone,
      isTablet: screenDimensions.isTablet,
      isPortrait: screenDimensions.isPortrait,
      themeMode: theme.isDark ? 'dark' : 'light',
      primaryColor: theme.colors.interactive.primary,
    });
  }, [componentName, enabled, theme, screenDimensions]);
}

export default useComponentStyles;