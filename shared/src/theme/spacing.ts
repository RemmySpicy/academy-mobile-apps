/**
 * Academy Mobile Apps Design System - Spacing
 * 
 * Consistent spacing system using a base unit for margins, padding, and layout.
 * Based on 4px base unit for precise alignment across all components.
 */

import { Platform } from 'react-native';

// Base spacing unit (4px)
const SPACING_UNIT = 4;

// Spacing scale
export const spacing = {
  // Numeric indices (existing system)
  0: 0,
  px: 1,
  0.5: SPACING_UNIT * 0.5, // 2px
  1: SPACING_UNIT * 1,     // 4px
  1.5: SPACING_UNIT * 1.5, // 6px
  2: SPACING_UNIT * 2,     // 8px
  2.5: SPACING_UNIT * 2.5, // 10px
  3: SPACING_UNIT * 3,     // 12px
  3.5: SPACING_UNIT * 3.5, // 14px
  4: SPACING_UNIT * 4,     // 16px
  5: SPACING_UNIT * 5,     // 20px
  6: SPACING_UNIT * 6,     // 24px
  7: SPACING_UNIT * 7,     // 28px
  8: SPACING_UNIT * 8,     // 32px
  9: SPACING_UNIT * 9,     // 36px
  10: SPACING_UNIT * 10,   // 40px
  11: SPACING_UNIT * 11,   // 44px
  12: SPACING_UNIT * 12,   // 48px
  14: SPACING_UNIT * 14,   // 56px
  16: SPACING_UNIT * 16,   // 64px
  20: SPACING_UNIT * 20,   // 80px
  24: SPACING_UNIT * 24,   // 96px
  28: SPACING_UNIT * 28,   // 112px
  32: SPACING_UNIT * 32,   // 128px
  36: SPACING_UNIT * 36,   // 144px
  40: SPACING_UNIT * 40,   // 160px
  44: SPACING_UNIT * 44,   // 176px
  48: SPACING_UNIT * 48,   // 192px
  52: SPACING_UNIT * 52,   // 208px
  56: SPACING_UNIT * 56,   // 224px
  60: SPACING_UNIT * 60,   // 240px
  64: SPACING_UNIT * 64,   // 256px
  72: SPACING_UNIT * 72,   // 288px
  80: SPACING_UNIT * 80,   // 320px
  96: SPACING_UNIT * 96,   // 384px

  // Semantic aliases for consistent API
  xs: SPACING_UNIT * 1,    // 4px  (spacing[1])
  sm: SPACING_UNIT * 2,    // 8px  (spacing[2])
  md: SPACING_UNIT * 4,    // 16px (spacing[4])
  lg: SPACING_UNIT * 6,    // 24px (spacing[6])
  xl: SPACING_UNIT * 8,    // 32px (spacing[8])
  '2xl': SPACING_UNIT * 12, // 48px (spacing[12])
  '3xl': SPACING_UNIT * 16, // 64px (spacing[16])
} as const;

// Component-specific spacing
export const componentSpacing = {
  // Form components
  form: {
    fieldGap: spacing[4],          // 16px between form fields
    labelGap: spacing[2],          // 8px between label and input
    sectionGap: spacing[6],        // 24px between form sections
    buttonGap: spacing[3],         // 12px between buttons
  },

  // Layout spacing
  layout: {
    screenPadding: spacing[4],     // 16px screen edge padding
    sectionGap: spacing[8],        // 32px between major sections
    cardGap: spacing[4],           // 16px between cards
    listGap: spacing[2],           // 8px between list items
  },

  // Modal and overlay spacing
  modal: {
    padding: spacing[6],           // 24px modal internal padding
    margin: spacing[4],            // 16px modal edge margin
    buttonGap: spacing[3],         // 12px between modal buttons
  },

  // Card spacing
  card: {
    padding: spacing[4],           // 16px card internal padding
    headerGap: spacing[3],         // 12px between header and content
    contentGap: spacing[4],        // 16px between content sections
  },

  // Button spacing
  button: {
    paddingX: spacing[4],          // 16px horizontal button padding
    paddingY: spacing[3],          // 12px vertical button padding
    iconGap: spacing[2],           // 8px between icon and text
    groupGap: spacing[3],          // 12px between button groups
  },

  // Navigation spacing
  navigation: {
    tabPadding: spacing[4],        // 16px tab padding
    tabGap: spacing[2],            // 8px between tabs
    headerPadding: spacing[4],     // 16px header padding
  },

  // List and table spacing
  list: {
    itemPadding: spacing[4],       // 16px list item padding
    itemGap: spacing[1],           // 4px between list items
    sectionGap: spacing[6],        // 24px between list sections
  },
} as const;

// Responsive spacing helpers
export const responsiveSpacing = {
  /**
   * Get responsive spacing based on screen size
   */
  getResponsiveSpacing: (
    base: number,
    small?: number,
    large?: number
  ): { base: number; small?: number; large?: number } => ({
    base,
    ...(small && { small }),
    ...(large && { large }),
  }),

  /**
   * Screen-size specific spacing adjustments
   */
  screen: {
    small: {
      padding: spacing[3],         // 12px on small screens
      margin: spacing[2],          // 8px margins on small screens
    },
    medium: {
      padding: spacing[4],         // 16px on medium screens
      margin: spacing[4],          // 16px margins on medium screens
    },
    large: {
      padding: spacing[6],         // 24px on large screens
      margin: spacing[6],          // 24px margins on large screens
    },
  },
} as const;

// Border radius (follows spacing system)
export const borderRadius = {
  none: 0,
  sm: spacing[1],      // 4px
  base: spacing[2],    // 8px
  md: spacing[3],      // 12px
  lg: spacing[4],      // 16px
  xl: spacing[6],      // 24px
  '2xl': spacing[8],   // 32px
  '3xl': spacing[12],  // 48px
  full: 9999,          // Fully rounded
} as const;

// Border width scale
export const borderWidth = {
  none: 0,
  xs: 0.5,
  sm: 1,
  base: 1.5,
  md: 2,
  lg: 3,
  xl: 4,
  '2xl': 6,
} as const;

// Shadow and elevation spacing
/**
 * Create platform-appropriate shadow styles
 */
const createElevationStyle = (
  offsetHeight: number,
  opacity: number,
  radius: number,
  elevation: number,
  color: string = '#000000'
) => {
  if (Platform.OS === 'web') {
    return {
      boxShadow: `0px ${offsetHeight}px ${radius}px rgba(0, 0, 0, ${opacity})`,
    };
  }
  
  return {
    shadowOffset: { width: 0, height: offsetHeight },
    shadowOpacity: opacity,
    shadowRadius: radius,
    shadowColor: color,
    elevation,
  };
};

export const elevation = {
  none: createElevationStyle(0, 0, 0, 0),
  sm: createElevationStyle(spacing[0.5], 0.05, spacing[0.5], 1),
  base: createElevationStyle(spacing[1], 0.1, spacing[1], 2),
  md: createElevationStyle(spacing[2], 0.1, spacing[2], 4),
  lg: createElevationStyle(spacing[3], 0.1, spacing[3], 8),
  xl: createElevationStyle(spacing[4], 0.15, spacing[4], 12),
  '2xl': createElevationStyle(spacing[6], 0.2, spacing[6], 16),
} as const;

// Safe area and device-specific spacing
export const safeArea = {
  // Minimum touch target sizes (accessibility)
  minTouchTarget: {
    width: spacing[11],    // 44px minimum width
    height: spacing[11],   // 44px minimum height
  },

  // Status bar and navigation safe areas
  statusBar: {
    height: spacing[6],    // 24px typical status bar height
  },

  // Keyboard avoidance
  keyboard: {
    padding: spacing[4],   // 16px padding when keyboard is visible
  },

  // Notch and safe area handling
  notch: {
    top: spacing[11],      // 44px for devices with notch
    bottom: spacing[8],    // 32px for home indicator
  },
} as const;

// Spacing utilities
export const spacingUtils = {
  /**
   * Create margin utilities
   */
  margin: {
    all: (value: keyof typeof spacing) => ({
      margin: spacing[value],
    }),
    horizontal: (value: keyof typeof spacing) => ({
      marginHorizontal: spacing[value],
    }),
    vertical: (value: keyof typeof spacing) => ({
      marginVertical: spacing[value],
    }),
    top: (value: keyof typeof spacing) => ({
      marginTop: spacing[value],
    }),
    right: (value: keyof typeof spacing) => ({
      marginRight: spacing[value],
    }),
    bottom: (value: keyof typeof spacing) => ({
      marginBottom: spacing[value],
    }),
    left: (value: keyof typeof spacing) => ({
      marginLeft: spacing[value],
    }),
  },

  /**
   * Create padding utilities
   */
  padding: {
    all: (value: keyof typeof spacing) => ({
      padding: spacing[value],
    }),
    horizontal: (value: keyof typeof spacing) => ({
      paddingHorizontal: spacing[value],
    }),
    vertical: (value: keyof typeof spacing) => ({
      paddingVertical: spacing[value],
    }),
    top: (value: keyof typeof spacing) => ({
      paddingTop: spacing[value],
    }),
    right: (value: keyof typeof spacing) => ({
      paddingRight: spacing[value],
    }),
    bottom: (value: keyof typeof spacing) => ({
      paddingBottom: spacing[value],
    }),
    left: (value: keyof typeof spacing) => ({
      paddingLeft: spacing[value],
    }),
  },

  /**
   * Get spacing value
   */
  get: (value: keyof typeof spacing): number => spacing[value],

  /**
   * Create gap styles (for flexbox layouts)
   */
  gap: (value: keyof typeof spacing) => ({
    gap: spacing[value],
  }),

  /**
   * Create responsive spacing
   */
  responsive: (base: keyof typeof spacing, breakpoints?: {
    sm?: keyof typeof spacing;
    md?: keyof typeof spacing;
    lg?: keyof typeof spacing;
  }) => ({
    base: spacing[base],
    ...(breakpoints?.sm && { sm: spacing[breakpoints.sm] }),
    ...(breakpoints?.md && { md: spacing[breakpoints.md] }),
    ...(breakpoints?.lg && { lg: spacing[breakpoints.lg] }),
  }),
} as const;

export type Spacing = typeof spacing;
export type ComponentSpacing = typeof componentSpacing;
export type BorderRadius = typeof borderRadius;
export type BorderWidth = typeof borderWidth;
export type Elevation = typeof elevation;