/**
 * FilterChip Component
 * 
 * Individual filter chip component for the search system.
 * Supports selection states, counts, and custom icons.
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
  count?: number;
  /** Optional icon */
  icon?: keyof typeof Ionicons.glyphMap | React.ReactNode;
  /** Callback when chip is pressed */
  onPress?: (value: string) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Custom variant styles */
  variant?: 'default' | 'primary' | 'secondary' | 'outline';
  /** Custom container styles */
  style?: ViewStyle;
  /** Custom text styles */
  textStyle?: TextStyle;
  /** Custom count styles */
  countStyle?: TextStyle;
  /** Test ID for testing */
  testID?: string;
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
  style,
  textStyle,
  countStyle,
  testID = "filter-chip",
}) => {
  const { theme, screenDimensions } = useTheme();
  const styles = createStyles(theme, screenDimensions, variant, selected);

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress(value);
    }
  };

  const iconSize = screenDimensions.isTablet ? theme.iconSize.sm : theme.iconSize.xs;

  const renderIcon = () => {
    if (!icon) return null;
    
    if (React.isValidElement(icon)) {
      return <View style={styles.iconContainer}>{icon}</View>;
    }
    
    return (
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={iconSize}
          color={selected ? theme.colors.text.inverse : theme.colors.icon.primary}
        />
      </View>
    );
  };

  const renderCount = () => {
    if (count === undefined) return null;
    
    return (
      <View style={[styles.countContainer, countStyle]}>
        <Text style={styles.countText}>{count}</Text>
      </View>
    );
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ 
        selected: selected,
        disabled: disabled,
      }}
      accessibilityLabel={`${label}${count !== undefined ? `, ${count} items` : ''}`}
      hitSlop={{
        top: theme.spacing.xs,
        bottom: theme.spacing.xs,
        left: theme.spacing.xs,
        right: theme.spacing.xs,
      }}
    >
      {renderIcon()}
      
      <Text 
        style={[styles.text, textStyle]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
      
      {renderCount()}
    </Pressable>
  );
};

const createStyles = (theme: any, screenDimensions: any, variant: string, selected: boolean) => {
  const isTablet = screenDimensions.isTablet;
  
  // Get variant-specific colors
  const getVariantStyles = () => {
    const baseStyle = {
      backgroundColor: theme.colors.background.secondary,
      borderColor: theme.colors.border.primary,
      textColor: theme.colors.text.primary,
    };

    if (selected) {
      switch (variant) {
        case 'primary':
          return {
            backgroundColor: theme.colors.interactive.primary,
            borderColor: theme.colors.interactive.primary,
            textColor: theme.colors.text.inverse,
          };
        case 'secondary':
          return {
            backgroundColor: theme.colors.interactive.secondary,
            borderColor: theme.colors.interactive.secondaryBorder,
            textColor: theme.colors.text.primary,
          };
        case 'outline':
          return {
            backgroundColor: 'transparent',
            borderColor: theme.colors.interactive.primary,
            textColor: theme.colors.interactive.primary,
          };
        default:
          return {
            backgroundColor: theme.colors.interactive.faded,
            borderColor: theme.colors.interactive.primary,
            textColor: theme.colors.interactive.primary,
          };
      }
    }

    return baseStyle;
  };

  const variantStyles = getVariantStyles();
  
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: variantStyles.backgroundColor,
      borderWidth: theme.borderWidth.sm,
      borderColor: variantStyles.borderColor,
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.xs,
      minHeight: isTablet ? theme.safeArea.minTouchTarget.height * 0.8 : 32,
    },
    
    pressed: {
      opacity: 0.8,
      transform: [{ scale: 0.96 }],
    },
    
    disabled: {
      opacity: 0.5,
    },
    
    iconContainer: {
      marginRight: theme.spacing.xs,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    text: {
      fontSize: isTablet ? theme.fontSizes.caption * 1.1 : theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: variantStyles.textColor,
      flexShrink: 1,
    },
    
    countContainer: {
      backgroundColor: selected 
        ? theme.colors.background.primary 
        : theme.colors.interactive.primaryDisabled,
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      marginLeft: theme.spacing.xs,
      minWidth: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    countText: {
      fontSize: isTablet ? theme.fontSizes.caption : theme.fontSizes.caption * 0.9,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: selected ? theme.colors.text.primary : theme.colors.text.secondary,
      textAlign: 'center',
    },
  });
};

export default FilterChip;