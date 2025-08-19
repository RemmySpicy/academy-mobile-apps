/**
 * Enhanced FilterChip Component
 * 
 * Unified chip component supporting multiple patterns:
 * - Standard filter chips
 * - Label + count chips (QuickFilter pattern)
 * - Badge-style count indicators (FilterBar pattern)
 * - Status badges
 * 
 * Maintains consistency with Academy design system while supporting
 * the unique styles found in extracted components.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export interface FilterChipProps {
  /** Filter label */
  label: string;
  /** Filter value/id */
  value: string;
  /** Whether the chip is selected */
  selected?: boolean;
  /** Optional count to display */
  count?: number | string;
  /** Optional icon */
  icon?: keyof typeof Ionicons.glyphMap | React.ReactNode;
  /** Callback when chip is pressed */
  onPress?: (value: string) => void;
  /** Disabled state */
  disabled?: boolean;
  
  /** Design variant */
  variant?: 
    | 'default'           // Standard filter chip
    | 'primary'           // Academy purple theme
    | 'secondary'         // Secondary theme
    | 'outline'           // Outline only
    | 'badge'             // For status indicators
    | 'quickFilter'       // Label + count side by side
    | 'filterBar';        // Advanced FilterBar style
  
  /** Count display style */
  countStyle?: 'badge' | 'inline' | 'separate';
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Custom styling */
  style?: ViewStyle;
  textStyle?: TextStyle;
  countTextStyle?: TextStyle;
  
  /** Accessibility */
  testID?: string;
  accessibilityLabel?: string;
  
  /** Advanced FilterBar features */
  customColor?: string;
  showDot?: boolean;
  dotColor?: string;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  value,
  selected = false,
  count,
  icon,
  onPress,
  disabled = false,
  variant = 'default',
  countStyle = 'badge',
  size = 'md',
  style,
  textStyle,
  countTextStyle,
  testID = "filter-chip",
  accessibilityLabel,
  customColor,
  showDot = false,
  dotColor,
}) => {
  const { theme, screenDimensions } = useTheme();
  const styles = createStyles(theme, screenDimensions, variant, selected, size);

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress(value);
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return screenDimensions.isTablet ? 14 : 12;
      case 'lg': return screenDimensions.isTablet ? 20 : 18;
      default: return screenDimensions.isTablet ? 16 : 14;
    }
  };

  const renderIcon = () => {
    if (!icon) return null;
    
    if (React.isValidElement(icon)) {
      return <View style={styles.iconContainer}>{icon}</View>;
    }
    
    return (
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={getIconSize()}
          color={selected ? theme.colors.text.inverse : theme.colors.icon.primary}
        />
      </View>
    );
  };

  const renderCount = () => {
    if (count === undefined && count !== 0) return null;
    
    if (countStyle === 'inline' || variant === 'quickFilter') {
      // QuickFilter pattern: label and count side by side
      return (
        <Text style={[styles.countInline, countTextStyle]}>
          {count}
        </Text>
      );
    }
    
    if (countStyle === 'separate') {
      // Separate count display
      return (
        <Text style={[styles.countSeparate, countTextStyle]}>
          {count}
        </Text>
      );
    }
    
    // Default badge style (FilterBar pattern)
    return (
      <View style={[styles.countBadge, countTextStyle]}>
        <Text style={styles.countBadgeText}>{count}</Text>
      </View>
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

  const containerStyle = [
    styles.container,
    customColor && { borderColor: customColor },
    disabled && styles.disabled,
    style,
  ];

  const labelStyle = [
    styles.text,
    customColor && selected && { color: customColor },
    textStyle,
  ];

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        ...containerStyle,
        pressed && !disabled && styles.pressed,
      ]}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ 
        selected: selected,
        disabled: disabled,
      }}
      accessibilityLabel={accessibilityLabel || `${label}${count !== undefined ? `, ${count} items` : ''}`}
      hitSlop={{
        top: theme.spacing.xs,
        bottom: theme.spacing.xs,
        left: theme.spacing.xs,
        right: theme.spacing.xs,
      }}
    >
      {renderDot()}
      {renderIcon()}
      
      <Text 
        style={labelStyle}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
      
      {renderCount()}
    </Pressable>
  );
};

const createStyles = (theme: any, screenDimensions: any, variant: string, selected: boolean, size: string) => {
  const isTablet = screenDimensions.isTablet;
  
  // Size-based dimensions
  const getSizeDimensions = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
          fontSize: theme.fontSizes.caption,
          minHeight: isTablet ? 28 : 24,
        };
      case 'lg':
        return {
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          fontSize: theme.fontSizes.body,
          minHeight: isTablet ? 44 : 40,
        };
      default: // md
        return {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          fontSize: theme.fontSizes.small,
          minHeight: isTablet ? 36 : 32,
        };
    }
  };

  // Variant-specific colors and styles
  const getVariantStyles = () => {
    const baseStyle = {
      backgroundColor: theme.colors.background.secondary,
      borderColor: theme.colors.border.primary,
      textColor: theme.colors.text.primary,
      borderRadius: theme.borderRadius.full,
    };

    if (selected) {
      switch (variant) {
        case 'primary':
        case 'filterBar':
          return {
            backgroundColor: theme.colors.interactive.primary,
            borderColor: theme.colors.interactive.primary,
            textColor: theme.colors.text.inverse,
            borderRadius: theme.borderRadius.full,
          };
          
        case 'secondary':
          return {
            backgroundColor: theme.colors.interactive.secondary,
            borderColor: theme.colors.interactive.secondaryBorder,
            textColor: theme.colors.text.primary,
            borderRadius: theme.borderRadius.full,
          };
          
        case 'outline':
          return {
            backgroundColor: 'transparent',
            borderColor: theme.colors.interactive.primary,
            textColor: theme.colors.interactive.primary,
            borderRadius: theme.borderRadius.full,
          };
          
        case 'badge':
          return {
            backgroundColor: theme.colors.interactive.primary,
            borderColor: theme.colors.interactive.primary,
            textColor: theme.colors.text.inverse,
            borderRadius: theme.borderRadius.md, // Less rounded for badges
          };
          
        case 'quickFilter':
          return {
            backgroundColor: theme.colors.interactive.faded || '#DCD5F4',
            borderColor: theme.colors.interactive.primary,
            textColor: theme.colors.text.primary,
            borderRadius: theme.borderRadius.full,
          };
          
        default:
          return {
            backgroundColor: theme.colors.interactive.faded,
            borderColor: theme.colors.interactive.primary,
            textColor: theme.colors.interactive.primary,
            borderRadius: theme.borderRadius.full,
          };
      }
    }

    // Unselected state modifications by variant
    switch (variant) {
      case 'badge':
        return {
          ...baseStyle,
          borderRadius: theme.borderRadius.md,
          backgroundColor: theme.colors.background.tertiary,
        };
        
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderColor: theme.colors.border.secondary,
        };
        
      default:
        return baseStyle;
    }
  };

  const variantStyles = getVariantStyles();
  const sizeDimensions = getSizeDimensions();
  
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: variantStyles.backgroundColor,
      borderWidth: theme.borderWidth.sm,
      borderColor: variantStyles.borderColor,
      borderRadius: variantStyles.borderRadius,
      paddingHorizontal: sizeDimensions.paddingHorizontal,
      paddingVertical: sizeDimensions.paddingVertical,
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.xs,
      minHeight: sizeDimensions.minHeight,
    },
    
    pressed: {
      opacity: 0.8,
      transform: [{ scale: 0.96 }],
    },
    
    disabled: {
      opacity: 0.5,
    },
    
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: theme.spacing.xs,
    },
    
    iconContainer: {
      marginRight: theme.spacing.xs,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    text: {
      fontSize: sizeDimensions.fontSize,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: variantStyles.textColor,
      flexShrink: 1,
    },
    
    // Count styles - Badge (FilterBar pattern)
    countBadge: {
      backgroundColor: selected 
        ? 'rgba(255, 255, 255, 0.2)' 
        : theme.colors.background.tertiary,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      marginLeft: theme.spacing.xs,
      minWidth: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    countBadgeText: {
      fontSize: isTablet ? theme.fontSizes.caption : theme.fontSizes.caption * 0.9,
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: selected ? theme.colors.text.inverse : theme.colors.text.secondary,
      textAlign: 'center',
    },
    
    // Count styles - Inline (QuickFilter pattern)
    countInline: {
      fontSize: sizeDimensions.fontSize,
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.interactive.primary,
      marginLeft: theme.spacing.xs,
    },
    
    // Count styles - Separate
    countSeparate: {
      fontSize: sizeDimensions.fontSize * 0.8,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.tertiary,
      marginLeft: theme.spacing.xs,
    },
  });
};

export default FilterChip;