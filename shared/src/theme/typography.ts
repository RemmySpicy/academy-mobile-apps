/**
 * Academy Mobile Apps Design System - Typography
 * 
 * Centralized typography system with consistent font sizes, weights, and line heights.
 * Responsive typography that adapts across different screen sizes.
 */

import { Platform, PixelRatio } from 'react-native';

// Base font configuration
export const fontConfig = {
  // Font families by platform
  fontFamily: {
    // San Francisco for iOS, Roboto for Android
    primary: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    
    // Monospace for code
    mono: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
    
    // Custom fonts (if loaded)
    display: Platform.select({
      ios: 'SF Pro Display',
      android: 'Roboto',
      default: 'System',
    }),
  },

  // Font weights
  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
} as const;

// Responsive font scaling
const scale = PixelRatio.getFontScale();

export const scaleFont = (size: number): number => {
  // Limit font scaling to prevent text from becoming too large or small
  const normalizedScale = Math.min(Math.max(scale, 0.85), 1.3);
  return Math.round(size * normalizedScale);
};

// Base typography scale
export const fontSizes = {
  xs: scaleFont(12),
  sm: scaleFont(14),
  base: scaleFont(16),
  lg: scaleFont(18),
  xl: scaleFont(20),
  '2xl': scaleFont(24),
  '3xl': scaleFont(30),
  '4xl': scaleFont(36),
  '5xl': scaleFont(48),
  '6xl': scaleFont(60),
  '7xl': scaleFont(72),
  '8xl': scaleFont(96),
  '9xl': scaleFont(128),
} as const;

// Line heights
export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

// Letter spacing
export const letterSpacing = {
  tighter: -0.05,
  tight: -0.025,
  normal: 0,
  wide: 0.025,
  wider: 0.05,
  widest: 0.1,
} as const;

// Typography variants
export const typography = {
  // Display text (large headings, hero text)
  display: {
    '4xl': {
      fontSize: fontSizes['9xl'],
      lineHeight: fontSizes['9xl'] * lineHeights.none,
      fontWeight: fontConfig.fontWeight.extrabold,
      letterSpacing: letterSpacing.tight,
      fontFamily: fontConfig.fontFamily.display,
    },
    '3xl': {
      fontSize: fontSizes['8xl'],
      lineHeight: fontSizes['8xl'] * lineHeights.none,
      fontWeight: fontConfig.fontWeight.extrabold,
      letterSpacing: letterSpacing.tight,
      fontFamily: fontConfig.fontFamily.display,
    },
    '2xl': {
      fontSize: fontSizes['7xl'],
      lineHeight: fontSizes['7xl'] * lineHeights.tight,
      fontWeight: fontConfig.fontWeight.bold,
      letterSpacing: letterSpacing.tight,
      fontFamily: fontConfig.fontFamily.display,
    },
    xl: {
      fontSize: fontSizes['6xl'],
      lineHeight: fontSizes['6xl'] * lineHeights.tight,
      fontWeight: fontConfig.fontWeight.bold,
      letterSpacing: letterSpacing.tight,
      fontFamily: fontConfig.fontFamily.display,
    },
    lg: {
      fontSize: fontSizes['5xl'],
      lineHeight: fontSizes['5xl'] * lineHeights.tight,
      fontWeight: fontConfig.fontWeight.bold,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontConfig.fontFamily.display,
    },
  },

  // Headings
  heading: {
    h1: {
      fontSize: fontSizes['4xl'],
      lineHeight: fontSizes['4xl'] * lineHeights.tight,
      fontWeight: fontConfig.fontWeight.bold,
      letterSpacing: letterSpacing.tight,
      fontFamily: fontConfig.fontFamily.primary,
    },
    h2: {
      fontSize: fontSizes['3xl'],
      lineHeight: fontSizes['3xl'] * lineHeights.tight,
      fontWeight: fontConfig.fontWeight.bold,
      letterSpacing: letterSpacing.tight,
      fontFamily: fontConfig.fontFamily.primary,
    },
    h3: {
      fontSize: fontSizes['2xl'],
      lineHeight: fontSizes['2xl'] * lineHeights.tight,
      fontWeight: fontConfig.fontWeight.semibold,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontConfig.fontFamily.primary,
    },
    h4: {
      fontSize: fontSizes.xl,
      lineHeight: fontSizes.xl * lineHeights.snug,
      fontWeight: fontConfig.fontWeight.semibold,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontConfig.fontFamily.primary,
    },
    h5: {
      fontSize: fontSizes.lg,
      lineHeight: fontSizes.lg * lineHeights.snug,
      fontWeight: fontConfig.fontWeight.medium,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontConfig.fontFamily.primary,
    },
    h6: {
      fontSize: fontSizes.base,
      lineHeight: fontSizes.base * lineHeights.snug,
      fontWeight: fontConfig.fontWeight.medium,
      letterSpacing: letterSpacing.wide,
      fontFamily: fontConfig.fontFamily.primary,
    },
  },

  // Body text
  body: {
    xl: {
      fontSize: fontSizes.xl,
      lineHeight: fontSizes.xl * lineHeights.relaxed,
      fontWeight: fontConfig.fontWeight.regular,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontConfig.fontFamily.primary,
    },
    lg: {
      fontSize: fontSizes.lg,
      lineHeight: fontSizes.lg * lineHeights.relaxed,
      fontWeight: fontConfig.fontWeight.regular,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontConfig.fontFamily.primary,
    },
    base: {
      fontSize: fontSizes.base,
      lineHeight: fontSizes.base * lineHeights.normal,
      fontWeight: fontConfig.fontWeight.regular,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontConfig.fontFamily.primary,
    },
    sm: {
      fontSize: fontSizes.sm,
      lineHeight: fontSizes.sm * lineHeights.normal,
      fontWeight: fontConfig.fontWeight.regular,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontConfig.fontFamily.primary,
    },
    xs: {
      fontSize: fontSizes.xs,
      lineHeight: fontSizes.xs * lineHeights.normal,
      fontWeight: fontConfig.fontWeight.regular,
      letterSpacing: letterSpacing.wide,
      fontFamily: fontConfig.fontFamily.primary,
    },
  },

  // Labels and UI text
  label: {
    lg: {
      fontSize: fontSizes.sm,
      lineHeight: fontSizes.sm * lineHeights.snug,
      fontWeight: fontConfig.fontWeight.medium,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontConfig.fontFamily.primary,
    },
    base: {
      fontSize: fontSizes.xs,
      lineHeight: fontSizes.xs * lineHeights.snug,
      fontWeight: fontConfig.fontWeight.medium,
      letterSpacing: letterSpacing.wide,
      fontFamily: fontConfig.fontFamily.primary,
    },
    sm: {
      fontSize: fontSizes.xs,
      lineHeight: fontSizes.xs * lineHeights.tight,
      fontWeight: fontConfig.fontWeight.medium,
      letterSpacing: letterSpacing.wider,
      fontFamily: fontConfig.fontFamily.primary,
    },
  },

  // Buttons
  button: {
    lg: {
      fontSize: fontSizes.base,
      lineHeight: fontSizes.base * lineHeights.tight,
      fontWeight: fontConfig.fontWeight.semibold,
      letterSpacing: letterSpacing.wide,
      fontFamily: fontConfig.fontFamily.primary,
    },
    base: {
      fontSize: fontSizes.sm,
      lineHeight: fontSizes.sm * lineHeights.tight,
      fontWeight: fontConfig.fontWeight.semibold,
      letterSpacing: letterSpacing.wide,
      fontFamily: fontConfig.fontFamily.primary,
    },
    sm: {
      fontSize: fontSizes.xs,
      lineHeight: fontSizes.xs * lineHeights.tight,
      fontWeight: fontConfig.fontWeight.semibold,
      letterSpacing: letterSpacing.wider,
      fontFamily: fontConfig.fontFamily.primary,
    },
  },

  // Captions and annotations
  caption: {
    lg: {
      fontSize: fontSizes.sm,
      lineHeight: fontSizes.sm * lineHeights.snug,
      fontWeight: fontConfig.fontWeight.regular,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontConfig.fontFamily.primary,
    },
    base: {
      fontSize: fontSizes.xs,
      lineHeight: fontSizes.xs * lineHeights.snug,
      fontWeight: fontConfig.fontWeight.regular,
      letterSpacing: letterSpacing.wide,
      fontFamily: fontConfig.fontFamily.primary,
    },
  },

  // Code and monospace
  code: {
    lg: {
      fontSize: fontSizes.base,
      lineHeight: fontSizes.base * lineHeights.normal,
      fontWeight: fontConfig.fontWeight.regular,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontConfig.fontFamily.mono,
    },
    base: {
      fontSize: fontSizes.sm,
      lineHeight: fontSizes.sm * lineHeights.normal,
      fontWeight: fontConfig.fontWeight.regular,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontConfig.fontFamily.mono,
    },
    sm: {
      fontSize: fontSizes.xs,
      lineHeight: fontSizes.xs * lineHeights.normal,
      fontWeight: fontConfig.fontWeight.regular,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontConfig.fontFamily.mono,
    },
  },
} as const;

// Accessibility helpers
export const accessibilityText = {
  // Minimum touch target size
  minTouchTarget: {
    minWidth: 44,
    minHeight: 44,
  },

  // Screen reader optimized styles
  screenReaderOnly: {
    position: 'absolute' as const,
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden' as const,
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap' as const,
    borderWidth: 0,
  },

  // High contrast mode support
  highContrast: {
    forcedColorAdjust: 'none' as const,
  },
} as const;

// Responsive typography utilities
export const responsiveText = {
  /**
   * Get responsive font size based on screen size
   */
  getResponsiveSize: (baseSize: number, factor: number = 1.2): number => {
    // Adjust based on device characteristics
    const screenScale = PixelRatio.get();
    const fontScale = PixelRatio.getFontScale();
    
    return Math.round(baseSize * factor * Math.min(screenScale, fontScale));
  },

  /**
   * Create responsive typography style
   */
  createResponsiveStyle: (baseStyle: any, smallerStyle?: any, largerStyle?: any) => {
    return {
      ...baseStyle,
      // Add responsive overrides here if needed
      ...(smallerStyle && { '@media (max-width: 375px)': smallerStyle }),
      ...(largerStyle && { '@media (min-width: 768px)': largerStyle }),
    };
  },
} as const;

// Typography utilities
export const typographyUtils = {
  /**
   * Calculate optimal line height for given font size
   */
  calculateLineHeight: (fontSize: number, ratio: number = 1.5): number => {
    return Math.round(fontSize * ratio);
  },

  /**
   * Get text style for specific use case
   */
  getTextStyle: (
    variant: keyof typeof typography,
    size: string,
    customProps?: any
  ) => {
    const baseStyle = (typography[variant] as any)?.[size] || typography.body.base;
    return {
      ...baseStyle,
      ...customProps,
    };
  },

  /**
   * Ensure text meets accessibility standards
   */
  applyAccessibilityStyle: (style: any, isImportant: boolean = false) => {
    return {
      ...style,
      ...(isImportant && {
        // Ensure minimum font size for accessibility
        fontSize: Math.max(style.fontSize || fontSizes.sm, fontSizes.sm),
        // Ensure adequate line height
        lineHeight: Math.max(
          style.lineHeight || style.fontSize * lineHeights.normal,
          (style.fontSize || fontSizes.sm) * lineHeights.normal
        ),
      }),
    };
  },
} as const;

export type Typography = typeof typography;
export type FontConfig = typeof fontConfig;
export type FontSizes = typeof fontSizes;