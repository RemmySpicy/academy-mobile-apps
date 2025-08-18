/**
 * Academy Mobile Apps Design System
 * 
 * Complete design system with colors, typography, spacing, and theme management.
 * Provides consistent styling across all components with support for light/dark modes.
 */

import { Platform } from 'react-native';

// Direct exports to avoid property descriptor conflicts
export {
  baseColors,
  semanticColors,
  darkColors,
  colorUtils,
  lightColorScheme,
  darkColorScheme,
} from './colors';

export type {
  ColorScheme,
  BaseColors,
  SemanticColors,
} from './colors';

export {
  fontConfig,
  scaleFont,
  fontSizes,
  lineHeights,
  letterSpacing,
  typography,
  accessibilityText,
  responsiveText,
  typographyUtils,
} from './typography';

export type {
  Typography,
  FontConfig,
  FontSizes,
} from './typography';

export {
  spacing,
  componentSpacing,
  responsiveSpacing,
  borderRadius,
  borderWidth,
  elevation,
  safeArea,
  spacingUtils,
} from './spacing';

export type {
  Spacing,
  ComponentSpacing,
  BorderRadius,
  BorderWidth,
  Elevation,
} from './spacing';

// Internal imports for theme utilities
import { baseColors, colorUtils } from './colors';
import { accessibilityText, typographyUtils } from './typography';
import { spacingUtils, borderRadius, elevation } from './spacing';

// Import theme objects and types from ThemeProvider to avoid circular dependency
import { lightTheme, darkTheme, type Theme, type ThemeMode } from './ThemeProvider';

// Re-export theme objects
export { lightTheme, darkTheme, type Theme, type ThemeMode };

// Icon sizes for consistent UI (re-exported from themes)
export const iconSize = lightTheme.iconSize;

// Theme utilities
export const themeUtils = {
  /**
   * Get theme based on mode preference
   */
  getTheme: (isDark: boolean): Theme => (isDark ? darkTheme : lightTheme),

  /**
   * Create custom theme with overrides
   */
  createTheme: (overrides: Partial<Theme>, baseTheme: Theme = lightTheme): Theme => ({
    ...baseTheme,
    ...overrides,
    colors: {
      ...baseTheme.colors,
      ...(overrides.colors || {}),
    },
  }),

  /**
   * Get color with opacity
   */
  withOpacity: colorUtils.withOpacity,

  /**
   * Get contrasting text color
   */
  getContrastText: colorUtils.getContrastText,

  /**
   * Create shadow style from elevation
   */
  createShadow: (elevationLevel: keyof typeof elevation, color: string = '#000000') => {
    const elevationStyle = elevation[elevationLevel];
    if (Platform.OS === 'web') {
      return elevationStyle; // boxShadow already includes color
    }
    return {
      ...elevationStyle,
      shadowColor: color,
    };
  },

  /**
   * Get responsive spacing
   */
  getSpacing: spacingUtils.get,

  /**
   * Create typography style
   */
  getTypographyStyle: typographyUtils.getTextStyle,

  /**
   * Apply accessibility styles
   */
  applyA11yStyles: typographyUtils.applyAccessibilityStyle,
};

// Component-specific theme helpers
export const componentThemes = {
  // Button theme variants
  button: {
    primary: (theme: Theme) => ({
      backgroundColor: theme.colors.interactive.primary,
      borderColor: theme.colors.interactive.primary,
      color: theme.colors.text.inverse,
      ...theme.typography.button.base,
      paddingHorizontal: theme.componentSpacing.button.paddingX,
      paddingVertical: theme.componentSpacing.button.paddingY,
      borderRadius: theme.borderRadius.md,
      ...themeUtils.createShadow('sm'),
    }),

    secondary: (theme: Theme) => ({
      backgroundColor: theme.colors.interactive.secondary,
      borderColor: theme.colors.interactive.secondaryBorder,
      borderWidth: 1,
      color: theme.colors.text.primary,
      ...theme.typography.button.base,
      paddingHorizontal: theme.componentSpacing.button.paddingX,
      paddingVertical: theme.componentSpacing.button.paddingY,
      borderRadius: theme.borderRadius.md,
    }),

    tertiary: (theme: Theme) => ({
      backgroundColor: theme.colors.interactive.tertiary,
      borderColor: 'transparent',
      color: theme.colors.interactive.primary,
      ...theme.typography.button.base,
      paddingHorizontal: theme.componentSpacing.button.paddingX,
      paddingVertical: theme.componentSpacing.button.paddingY,
      borderRadius: theme.borderRadius.md,
    }),

    destructive: (theme: Theme) => ({
      backgroundColor: theme.colors.interactive.destructive,
      borderColor: theme.colors.interactive.destructive,
      color: theme.colors.text.inverse,
      ...theme.typography.button.base,
      paddingHorizontal: theme.componentSpacing.button.paddingX,
      paddingVertical: theme.componentSpacing.button.paddingY,
      borderRadius: theme.borderRadius.md,
      ...themeUtils.createShadow('sm'),
    }),
  },

  // Input theme variants
  input: {
    default: (theme: Theme) => ({
      backgroundColor: theme.colors.background.primary,
      borderColor: theme.colors.border.primary,
      borderWidth: 1,
      color: theme.colors.text.primary,
      placeholderTextColor: theme.colors.text.tertiary,
      ...theme.typography.body.base,
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      borderRadius: theme.borderRadius.md,
      minHeight: theme.safeArea.minTouchTarget.height,
    }),

    focused: (theme: Theme) => ({
      borderColor: theme.colors.border.focused,
      borderWidth: 2,
      ...themeUtils.createShadow('sm', theme.colors.interactive.primary),
    }),

    error: (theme: Theme) => ({
      borderColor: theme.colors.border.error,
      borderWidth: 1,
    }),

    disabled: (theme: Theme) => ({
      backgroundColor: theme.colors.background.secondary,
      color: theme.colors.text.disabled,
      borderColor: theme.colors.border.primary,
    }),
  },

  // Card theme
  card: {
    default: (theme: Theme) => ({
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.lg,
      padding: theme.componentSpacing.card.padding,
      ...themeUtils.createShadow('base'),
    }),

    outlined: (theme: Theme) => ({
      backgroundColor: theme.colors.background.primary,
      borderColor: theme.colors.border.primary,
      borderWidth: 1,
      borderRadius: theme.borderRadius.lg,
      padding: theme.componentSpacing.card.padding,
    }),

    elevated: (theme: Theme) => ({
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.lg,
      padding: theme.componentSpacing.card.padding,
      ...themeUtils.createShadow('lg'),
    }),
  },

  // Modal theme
  modal: {
    backdrop: (theme: Theme) => ({
      backgroundColor: theme.colors.background.overlay,
    }),

    container: (theme: Theme) => ({
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.xl,
      padding: theme.componentSpacing.modal.padding,
      margin: theme.componentSpacing.modal.margin,
      ...themeUtils.createShadow('2xl'),
    }),
  },

  // Alert/Notification theme
  alert: {
    info: (theme: Theme) => ({
      backgroundColor: theme.colors.status.infoBackground,
      borderColor: theme.colors.status.infoBorder,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.status.info,
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.md,
    }),

    success: (theme: Theme) => ({
      backgroundColor: theme.colors.status.successBackground,
      borderColor: theme.colors.status.successBorder,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.status.success,
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.md,
    }),

    warning: (theme: Theme) => ({
      backgroundColor: theme.colors.status.warningBackground,
      borderColor: theme.colors.status.warningBorder,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.status.warning,
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.md,
    }),

    error: (theme: Theme) => ({
      backgroundColor: theme.colors.status.errorBackground,
      borderColor: theme.colors.status.errorBorder,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.status.error,
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.md,
    }),
  },
};

// Design tokens for easy reference
export const tokens = {
  // Commonly used values
  common: {
    borderWidth: 1,
    focusBorderWidth: 2,
    borderRadius: borderRadius.md,
    iconSize: 20,
    minTouchTarget: 44,
  },

  // Animation durations
  animation: {
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 500,
  },

  // Z-index layers
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    toast: 1080,
  },

  // Breakpoints (for responsive design)
  breakpoints: {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  },
} as const;

// Re-export ThemeProvider and hooks for convenience
export { 
  ThemeProvider, 
  useTheme, 
  useThemeColors, 
  useThemeSpacing, 
  useThemeTypography,
  useThemeMode,
  withTheme,
  createThemedStyles,
  ThemeModeSelector,
  themeHelpers,
  type ThemeContextValue,
  type ThemeProviderProps,
  type ExtendedThemeMode,
} from './ThemeProvider';

// Export theme types
export type ComponentThemes = typeof componentThemes;
export type Tokens = typeof tokens;

// Theme Provider and Hooks are exported directly from './ThemeProvider'
// Import them directly from there to avoid circular dependency

// Default export
export { lightTheme as defaultTheme };