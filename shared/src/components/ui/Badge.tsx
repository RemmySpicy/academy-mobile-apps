/**
 * Badge Component
 * 
 * Specialized component for status indicators, labels, and notifications.
 * Complements FilterChip by focusing on read-only status display.
 * 
 * Used for:
 * - Status indicators (Completed, Pending, Active, etc.)
 * - Notification counts
 * - Category labels
 * - Progress indicators
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export interface BadgeProps {
  /** Badge text content */
  children: React.ReactNode;
  
  /** Status-based variant */
  variant?: 
    | 'default'           // Neutral gray
    | 'success'           // Success/completed states
    | 'warning'           // Warning/pending states
    | 'error'             // Error/failed states
    | 'info'              // Info/active states
    | 'primary'           // Academy purple
    | 'secondary';        // Secondary theme
    
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  
  /** Shape variant */
  shape?: 'rounded' | 'pill' | 'square';
  
  /** Optional icon */
  icon?: keyof typeof Ionicons.glyphMap;
  
  /** Optional dot indicator */
  showDot?: boolean;
  dotColor?: string;
  
  /** Custom styling */
  style?: ViewStyle;
  textStyle?: TextStyle;
  
  /** Accessibility */
  testID?: string;
  accessibilityLabel?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  shape = 'rounded',
  icon,
  showDot = false,
  dotColor,
  style,
  textStyle,
  testID = 'badge',
  accessibilityLabel,
}) => {
  const { theme, screenDimensions } = useTheme();
  const styles = createStyles(theme, screenDimensions, variant, size, shape);

  const getIconSize = () => {
    switch (size) {
      case 'xs': return 10;
      case 'sm': return 12;
      case 'lg': return 18;
      default: return 14;
    }
  };

  const renderIcon = () => {
    if (!icon) return null;
    
    return (
      <Ionicons
        name={icon}
        size={getIconSize()}
        color={styles.text.color}
        style={styles.icon}
      />
    );
  };

  const renderDot = () => {
    if (!showDot) return null;
    
    return (
      <View style={[
        styles.dot,
        { backgroundColor: dotColor || theme.colors.interactive.primary }
      ]} />
    );
  };

  return (
    <View 
      style={[styles.container, style]}
      testID={testID}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel}
    >
      {renderDot()}
      {renderIcon()}
      <Text style={[styles.text, textStyle]}>
        {children}
      </Text>
    </View>
  );
};

const createStyles = (theme: any, screenDimensions: any, variant: string, size: string, shape: string) => {
  const isTablet = screenDimensions.isTablet;
  
  // Size-based dimensions
  const getSizeDimensions = () => {
    switch (size) {
      case 'xs':
        return {
          paddingHorizontal: theme.spacing.xs,
          paddingVertical: theme.spacing.xs / 2,
          fontSize: theme.fontSizes.caption * 0.8,
          minHeight: isTablet ? 18 : 16,
        };
      case 'sm':
        return {
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
          fontSize: theme.fontSizes.caption,
          minHeight: isTablet ? 22 : 20,
        };
      case 'lg':
        return {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          fontSize: theme.fontSizes.body,
          minHeight: isTablet ? 32 : 28,
        };
      default: // md
        return {
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
          fontSize: theme.fontSizes.small,
          minHeight: isTablet ? 26 : 24,
        };
    }
  };

  // Shape-based border radius
  const getShapeRadius = () => {
    switch (shape) {
      case 'pill':
        return theme.borderRadius.full;
      case 'square':
        return 0;
      default: // rounded
        return theme.borderRadius.sm;
    }
  };

  // Variant-specific colors
  const getVariantColors = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: theme.colors.status.successBackground,
          textColor: theme.colors.status.success,
          borderColor: theme.colors.status.success + '20',
        };
        
      case 'warning':
        return {
          backgroundColor: theme.colors.status.warningBackground,
          textColor: theme.colors.status.warning,
          borderColor: theme.colors.status.warning + '20',
        };
        
      case 'error':
        return {
          backgroundColor: theme.colors.status.errorBackground,
          textColor: theme.colors.status.error,
          borderColor: theme.colors.status.error + '20',
        };
        
      case 'info':
        return {
          backgroundColor: theme.colors.status.infoBackground,
          textColor: theme.colors.interactive.accent,
          borderColor: theme.colors.interactive.accent + '20',
        };
        
      case 'primary':
        return {
          backgroundColor: theme.colors.interactive.primary + '15',
          textColor: theme.colors.interactive.primary,
          borderColor: theme.colors.interactive.primary + '20',
        };
        
      case 'secondary':
        return {
          backgroundColor: theme.colors.interactive.secondary,
          textColor: theme.colors.text.primary,
          borderColor: theme.colors.interactive.secondaryBorder,
        };
        
      default: // default
        return {
          backgroundColor: theme.colors.background.tertiary,
          textColor: theme.colors.text.secondary,
          borderColor: theme.colors.border.secondary,
        };
    }
  };

  const sizeDimensions = getSizeDimensions();
  const variantColors = getVariantColors();
  const borderRadius = getShapeRadius();
  
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: variantColors.backgroundColor,
      borderWidth: theme.borderWidth.sm,
      borderColor: variantColors.borderColor,
      borderRadius: borderRadius,
      paddingHorizontal: sizeDimensions.paddingHorizontal,
      paddingVertical: sizeDimensions.paddingVertical,
      minHeight: sizeDimensions.minHeight,
      alignSelf: 'flex-start',
    },
    
    text: {
      fontSize: sizeDimensions.fontSize,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: variantColors.textColor,
      textAlign: 'center',
    },
    
    icon: {
      marginRight: theme.spacing.xs / 2,
    },
    
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: theme.spacing.xs / 2,
    },
  });
};

export default Badge;