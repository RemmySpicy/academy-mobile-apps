/**
 * Style utilities for ControlCard and other components
 */

import { StyleSheet } from 'react-native';

export type ControlCardSize = 'compact' | 'normal' | 'expanded';
export type ControlCardLayout = 'default' | 'minimal' | 'detailed' | 'dashboard';
export type ControlCardVariant = 'elevated' | 'outlined' | 'filled' | 'ghost';

/**
 * Get container styles based on size, layout, and variant
 * @param theme - Theme object
 * @param size - Component size variant
 * @param layout - Component layout variant
 * @param variant - Component visual variant
 * @returns Style object for container
 */
export const getContainerStyles = (
  theme: any,
  size: ControlCardSize,
  layout: ControlCardLayout,
  variant: ControlCardVariant
) => ({
  marginHorizontal: size === 'compact' ? theme.spacing.sm : theme.spacing.lg,
  marginVertical: theme.spacing.xs,
  borderRadius: theme.borderRadius.lg,
  backgroundColor: variant === 'ghost' ? 'transparent' : theme.colors.background.secondary,
  borderWidth: variant === 'outlined' ? 1 : 0,
  borderColor: variant === 'outlined' ? theme.colors.border.primary : 'transparent',
  shadowColor: variant === 'elevated' ? theme.colors.shadow?.default || theme.colors.text.primary : 'transparent',
  shadowOffset: { width: 0, height: variant === 'elevated' ? 2 : 0 },
  shadowOpacity: variant === 'elevated' ? 0.1 : 0,
  shadowRadius: variant === 'elevated' ? 4 : 0,
  elevation: variant === 'elevated' ? 2 : 0,
});

/**
 * Get content padding based on size
 * @param theme - Theme object
 * @param size - Component size variant
 * @returns Padding value
 */
export const getContentPadding = (theme: any, size: ControlCardSize) => {
  return size === 'compact' ? theme.spacing.sm : theme.spacing.md;
};

/**
 * Get header styles based on layout
 * @param theme - Theme object
 * @param layout - Component layout variant
 * @returns Style object for header
 */
export const getHeaderStyles = (theme: any, layout: ControlCardLayout) => ({
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
  alignItems: layout === 'minimal' ? 'center' as const : 'flex-start' as const,
  marginBottom: theme.spacing.sm,
});

/**
 * Get title styles based on size
 * @param theme - Theme object
 * @param size - Component size variant
 * @returns Style object for title
 */
export const getTitleStyles = (theme: any, size: ControlCardSize) => ({
  fontSize: size === 'compact' ? theme.fontSizes.body : theme.fontSizes.heading6,
  color: theme.colors.text.primary,
  fontWeight: theme.fontConfig.fontWeight.semiBold,
});

/**
 * Get action button styles based on variant
 * @param theme - Theme object
 * @param variant - Button variant
 * @param disabled - Whether button is disabled
 * @returns Style object for action button
 */
export const getActionButtonStyles = (
  theme: any,
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary',
  disabled: boolean = false
) => {
  const baseStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  };

  let variantStyles = {};
  switch (variant) {
    case 'secondary':
      variantStyles = {
        backgroundColor: theme.colors.background.primary,
        borderWidth: 1,
        borderColor: theme.colors.border.primary,
      };
      break;
    case 'outline':
      variantStyles = {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.interactive.primary,
      };
      break;
    case 'ghost':
      variantStyles = {
        backgroundColor: 'transparent',
      };
      break;
    default: // primary
      variantStyles = {
        backgroundColor: theme.colors.interactive.primary,
      };
  }

  return {
    ...baseStyle,
    ...variantStyles,
    ...(disabled && { opacity: 0.5 }),
  };
};

/**
 * Get action button text styles based on variant
 * @param theme - Theme object
 * @param variant - Button variant
 * @param disabled - Whether button is disabled
 * @returns Style object for action button text
 */
export const getActionButtonTextStyles = (
  theme: any,
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary',
  disabled: boolean = false
) => {
  const baseStyle = {
    fontSize: theme.fontSizes.small,
    fontWeight: theme.fontConfig.fontWeight.medium,
  };

  let colorStyle = {};
  switch (variant) {
    case 'secondary':
      colorStyle = { color: theme.colors.text.primary };
      break;
    case 'outline':
    case 'ghost':
      colorStyle = { color: theme.colors.interactive.primary };
      break;
    default: // primary
      colorStyle = { color: theme.colors.text.inverse };
  }

  return {
    ...baseStyle,
    ...colorStyle,
    ...(disabled && { opacity: 0.5 }),
  };
};

/**
 * Get day box styles for calendar
 * @param theme - Theme object
 * @param size - Component size variant
 * @param isActive - Whether the day is active/selected
 * @param isMarked - Whether the day is marked
 * @returns Style object for day box
 */
export const getDayBoxStyles = (
  theme: any,
  size: ControlCardSize,
  isActive: boolean = false,
  isMarked: boolean = false
) => {
  const baseStyles = {
    width: size === 'compact' ? 35 : 40,
    height: size === 'compact' ? 50 : 60,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  const activeStyles = isActive ? {
    backgroundColor: theme.colors.interactive.primary,
  } : {};

  const markedStyles = isMarked && !isActive ? {
    shadowColor: theme.colors.status.warning,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  } : {};

  return {
    ...baseStyles,
    ...activeStyles,
    ...markedStyles,
  };
};

/**
 * Create a complete StyleSheet for ControlCard with utilities
 * @param theme - Theme object
 * @param size - Component size variant
 * @param layout - Component layout variant
 * @param variant - Component visual variant
 * @returns Complete StyleSheet object
 */
export const createControlCardStyles = (
  theme: any,
  size: ControlCardSize,
  layout: ControlCardLayout,
  variant: ControlCardVariant
) => StyleSheet.create({
  container: getContainerStyles(theme, size, layout, variant),
  content: {
    padding: getContentPadding(theme, size),
  },
  header: getHeaderStyles(theme, layout),
  titleContainer: {
    flex: 1,
  },
  title: getTitleStyles(theme, size),
  subtitle: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  description: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    lineHeight: theme.fontSizes.small * 1.4,
  },
  headerActions: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: theme.spacing.sm,
  },
});