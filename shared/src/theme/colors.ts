/**
 * Academy Mobile Apps Design System - Colors
 * 
 * Centralized color palette with semantic naming and accessibility compliance.
 * All colors are WCAG 2.1 AA compliant for contrast ratios.
 */

// Base Color Palette
export const baseColors = {
  // Primary Brand Colors
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1', // Main brand color
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
    950: '#1E1B4B',
  },

  // Secondary Colors
  secondary: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },

  // Semantic Colors
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
    950: '#022C22',
  },

  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
    950: '#451A03',
  },

  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FDA4A4',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
    950: '#450A0A',
  },

  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    950: '#172554',
  },

  // Neutral Grays
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },

  // Academy Brand Colors (from existing design)
  academy: {
    // Primary brand purple
    purple: {
      50: '#F8F5FF',
      100: '#EFEBFF',
      200: '#DDD4FF',
      300: '#C4B5FF',
      400: '#A489FF',
      500: '#4F2EC9', // Main Academy theme color
      600: '#4227B3',
      700: '#371F97',
      800: '#2C1A7B',
      900: '#251664',
      950: '#1A0F44',
    },
    
    // Secondary colors from existing design
    orange: {
      50: '#FFFBF0',
      100: '#FFF3DF',
      200: '#FFE4B8',
      300: '#FFD089',
      400: '#FFB54D',
      500: '#FEAE24', // Academy orange
      600: '#F09006',
      700: '#C87102',
      800: '#A15E08',
      900: '#854E0B',
      950: '#4A2805',
    },
    
    // Academy Teal - Secondary brand color
    teal: {
      50: '#F0FCFA',
      100: '#CCFBF1',
      200: '#99F6E4',
      300: '#5EEAD4',
      400: '#52E2BB', // Your new Academy teal color
      500: '#14B8A6',
      600: '#0D9488',
      700: '#0F766E',
      800: '#115E59',
      900: '#134E4A',
      950: '#042F2E',
    },
    
    // Faded colors for backgrounds
    faded: {
      50: '#F8FDFD',
      100: '#EAF4F4', // Main faded color
      200: '#D1E7E7',
      300: '#A3CFCF',
      400: '#6FB0B0',
      500: '#4A9393',
      600: '#3C7A7A',
      700: '#346363',
      800: '#2F5252',
      900: '#2C4747',
      950: '#1A2A2A',
    },
    
    // Merchant colors for specific features
    merchant: {
      green: '#2A8385',
      lime: '#BFDE72',
    },
    
    // Additional theme colors
    pageTitle: '#435712',
    themeBlack: '#121212',
    themePurple: '#7B21A5',
  },
} as const;

// Semantic Color Mappings
export const semanticColors = {
  // Text Colors
  text: {
    primary: baseColors.neutral[900],
    secondary: baseColors.neutral[600],
    tertiary: baseColors.neutral[500],
    disabled: baseColors.neutral[400],
    inverse: baseColors.neutral[0],
    link: baseColors.primary[600],
    linkHover: baseColors.primary[700],
  },

  // Background Colors
  background: {
    primary: baseColors.neutral[0],
    secondary: baseColors.neutral[50],
    tertiary: baseColors.neutral[100],
    elevated: baseColors.neutral[0],
    overlay: 'rgba(0, 0, 0, 0.5)',
    backdrop: 'rgba(0, 0, 0, 0.3)',
  },

  // Border Colors
  border: {
    primary: baseColors.neutral[200],
    secondary: baseColors.neutral[300],
    focused: baseColors.primary[500],
    error: baseColors.error[500],
    success: baseColors.success[500],
    warning: baseColors.warning[500],
    teal: baseColors.academy.teal[400],        // Academy teal border
  },

  // Interactive Colors (Academy Brand)
  interactive: {
    primary: baseColors.academy.purple[500],    // #4F2EC9
    primaryHover: baseColors.academy.purple[600],
    primaryPressed: baseColors.academy.purple[700],
    primaryDisabled: baseColors.neutral[300],
    
    secondary: baseColors.neutral[0],           // #FFFFFF
    secondaryHover: baseColors.neutral[50],     // #FAFAFA
    secondaryPressed: baseColors.neutral[100],  // #F5F5F5
    secondaryBorder: baseColors.neutral[300],   // #D4D4D4
    
    tertiary: 'transparent',
    tertiaryHover: baseColors.academy.faded[100], // #EAF4F4
    tertiaryPressed: baseColors.academy.faded[200],
    
    // Academy specific variants
    faded: baseColors.academy.faded[100],       // #EAF4F4
    fadedHover: baseColors.academy.faded[200],
    
    orange: baseColors.academy.orange[500],     // #FEAE24
    orangeHover: baseColors.academy.orange[600],
    
    teal: baseColors.academy.teal[400],         // #52E2BB - Academy secondary brand
    tealHover: baseColors.academy.teal[500],
    tealPressed: baseColors.academy.teal[600],
    
    destructive: baseColors.error[500],         // #EF4444
    destructiveHover: baseColors.error[600],
    destructivePressed: baseColors.error[700],
    
    // Existing color mappings for compatibility
    themeBlack: baseColors.academy.themeBlack,  // #121212
    danger: '#EE4A52',                          // Existing danger color
    cancel: baseColors.academy.purple[500],     // Same as primary
    gray: '#F5F5F5',                           // Light gray background
    lightGray: '#F9F9F9',                      // Even lighter gray
  },

  // Status Colors - Enhanced for better contrast
  status: {
    success: baseColors.success[600],             // Stronger for better contrast
    successBackground: baseColors.success[50],
    successBorder: baseColors.success[300],       // More visible border
    
    warning: baseColors.warning[600],             // Stronger for better contrast
    warningBackground: baseColors.warning[50],
    warningBorder: baseColors.warning[300],       // More visible border
    
    error: baseColors.error[600],                 // Stronger for better contrast
    errorBackground: baseColors.error[50],
    errorBorder: baseColors.error[300],           // More visible border
    
    info: baseColors.info[600],                   // Stronger for better contrast  
    infoBackground: baseColors.info[50],
    infoBorder: baseColors.info[300],             // More visible border
  },

  // Overlay Colors
  overlay: {
    light: 'rgba(0, 0, 0, 0.3)',
    medium: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.7)',
    heavy: 'rgba(0, 0, 0, 0.8)',
  },

  // Shadow Colors
  shadow: {
    default: 'rgba(0, 0, 0, 0.1)',
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    heavy: 'rgba(0, 0, 0, 0.25)',
    colored: 'rgba(99, 102, 241, 0.1)',
  },
} as const;

// Dark Mode Colors - Academy Brand Enhanced
export const darkColors = {
  text: {
    primary: baseColors.neutral[50],
    secondary: baseColors.neutral[300],
    tertiary: baseColors.neutral[400],
    disabled: baseColors.neutral[600],
    inverse: baseColors.neutral[900],
    link: baseColors.academy.purple[400], // Softer purple for links
    linkHover: baseColors.academy.purple[300],
  },

  background: {
    primary: '#1A1A1A',                   // Warmer dark background
    secondary: '#2A2A2A',                 // Elevated surfaces
    tertiary: '#333333',                  // Even more elevated
    elevated: '#242424',                  // Cards, modals
    overlay: 'rgba(0, 0, 0, 0.85)',      // Enhanced modal overlays for dark mode
    backdrop: 'rgba(0, 0, 0, 0.7)',      // Enhanced backdrop for dark mode
  },

  border: {
    primary: baseColors.neutral[700],
    secondary: baseColors.neutral[600],
    focused: baseColors.academy.purple[400], // Academy purple for focus
    error: baseColors.error[400],
    success: baseColors.success[400],
    warning: baseColors.warning[400],
  },

  interactive: {
    primary: baseColors.academy.purple[400],      // Academy purple for dark mode
    primaryHover: baseColors.academy.purple[300],
    primaryPressed: baseColors.academy.purple[500],
    primaryDisabled: baseColors.neutral[700],
    
    secondary: baseColors.neutral[800],
    secondaryHover: baseColors.neutral[700],
    secondaryPressed: baseColors.neutral[600],
    secondaryBorder: baseColors.neutral[600],
    
    tertiary: 'transparent',
    tertiaryHover: baseColors.neutral[800],
    tertiaryPressed: baseColors.neutral[700],
    
    // Academy-specific colors for dark mode
    faded: baseColors.academy.faded[800],         // Darker faded for dark mode
    fadedHover: baseColors.academy.faded[700],
    
    orange: baseColors.academy.orange[400],       // Softer orange for dark mode
    orangeHover: baseColors.academy.orange[300],
    
    destructive: baseColors.error[400],
    destructiveHover: baseColors.error[300],
    destructivePressed: baseColors.error[500],
    
    // Compatibility colors for dark mode
    themeBlack: baseColors.neutral[100],          // Light text on dark backgrounds
    danger: baseColors.error[400],                // Softer danger color
    cancel: baseColors.academy.purple[400],       // Academy purple
    gray: baseColors.neutral[800],                // Dark gray background
    lightGray: baseColors.neutral[900],           // Even darker gray
  },

  status: {
    success: baseColors.success[400],
    successBackground: 'rgba(16, 185, 129, 0.15)',  // Enhanced transparency for dark mode
    successBorder: baseColors.success[600],
    
    warning: baseColors.warning[400],
    warningBackground: 'rgba(245, 158, 11, 0.15)',  // Enhanced transparency for dark mode
    warningBorder: baseColors.warning[600],
    
    error: baseColors.error[400],
    errorBackground: 'rgba(239, 68, 68, 0.15)',     // Enhanced transparency for dark mode
    errorBorder: baseColors.error[600],
    
    info: baseColors.info[400],
    infoBackground: 'rgba(59, 130, 246, 0.15)',     // Enhanced transparency for dark mode
    infoBorder: baseColors.info[600],
  },

  // Overlay Colors
  overlay: {
    light: 'rgba(0, 0, 0, 0.5)',
    medium: 'rgba(0, 0, 0, 0.7)',
    dark: 'rgba(0, 0, 0, 0.85)',
    heavy: 'rgba(0, 0, 0, 0.9)',
  },

  shadow: {
    default: 'rgba(0, 0, 0, 0.4)',        // Default shadow for dark mode
    light: 'rgba(0, 0, 0, 0.3)',         // Enhanced shadows for dark mode
    medium: 'rgba(0, 0, 0, 0.4)',
    heavy: 'rgba(0, 0, 0, 0.6)',
    colored: 'rgba(79, 46, 201, 0.3)',   // Academy purple shadow
  },
} as const;

// Color Utilities
export const colorUtils = {
  /**
   * Add opacity to a hex color
   */
  withOpacity: (color: string, opacity: number): string => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },

  /**
   * Get contrasting text color for a background
   */
  getContrastText: (backgroundColor: string): string => {
    // Simple luminance calculation
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? semanticColors.text.primary : semanticColors.text.inverse;
  },

  /**
   * Check if color meets WCAG contrast requirements
   */
  hasGoodContrast: (foreground: string, background: string): boolean => {
    // Simplified contrast check - in practice, use a proper contrast calculation
    const fgLum = colorUtils.getLuminance(foreground);
    const bgLum = colorUtils.getLuminance(background);
    const contrast = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);
    return contrast >= 4.5; // WCAG AA standard
  },

  /**
   * Calculate relative luminance
   */
  getLuminance: (color: string): number => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const sRGB = [r, g, b].map(c => 
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );

    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  },
};

// Export color schemes
export const lightColorScheme = semanticColors;
export const darkColorScheme = darkColors;

export type ColorScheme = typeof lightColorScheme;
export type BaseColors = typeof baseColors;
export type SemanticColors = typeof semanticColors;