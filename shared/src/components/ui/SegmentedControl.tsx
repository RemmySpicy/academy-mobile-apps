/**
 * SegmentedControl Component
 * 
 * A segmented control for toggling between multiple options, similar to iOS UISegmentedControl.
 * Provides animated selection indicator and Academy theming.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  ViewStyle,
  TextStyle,
  LayoutChangeEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';

/** Variant styles for SegmentedControl */
export type SegmentedControlVariant = 'default' | 'primary' | 'secondary' | 'compact';

/** Size variants for SegmentedControl */
export type SegmentedControlSize = 'sm' | 'md' | 'lg';

/** Option configuration for SegmentedControl */
export interface SegmentedControlOption {
  /** Unique identifier */
  value: string;
  /** Display label */
  label: string;
  /** Optional icon */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Whether this option is disabled */
  disabled?: boolean;
}

export interface SegmentedControlProps {
  /** Array of options */
  options: SegmentedControlOption[] | string[];
  /** Currently selected value */
  selectedValue: string;
  /** Callback when selection changes */
  onChange: (value: string) => void;
  
  // Variants
  /** Visual variant */
  variant?: SegmentedControlVariant;
  /** Size variant */
  size?: SegmentedControlSize;
  
  // Behavior
  /** Whether to animate selection changes */
  animated?: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Whether to show icons only (no labels) */
  iconOnly?: boolean;
  
  // Styling
  /** Container style override */
  style?: ViewStyle;
  /** Option button style override */
  optionStyle?: ViewStyle;
  /** Selected option style override */
  selectedOptionStyle?: ViewStyle;
  /** Option text style override */
  textStyle?: TextStyle;
  /** Selected text style override */
  selectedTextStyle?: TextStyle;
  
  // Accessibility
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Test ID for testing */
  testID?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selectedValue,
  onChange,
  variant = 'default',
  size = 'md',
  animated = true,
  animationDuration = 200,
  iconOnly = false,
  style,
  optionStyle,
  selectedOptionStyle,
  textStyle,
  selectedTextStyle,
  accessibilityLabel,
  testID = 'segmented-control',
}) => {
  const { theme, screenDimensions } = useTheme();
  const styles = createStyles(theme, screenDimensions);
  const variantStyles = getVariantStyles(theme, variant, size);
  
  // Animation values
  const animatedValue = useRef(new Animated.Value(0)).current;
  const segmentWidths = useRef<number[]>([]).current;
  const segmentPositions = useRef<number[]>([]).current;

  // Normalize options to consistent format
  const normalizedOptions: SegmentedControlOption[] = options.map(option => 
    typeof option === 'string' 
      ? { value: option, label: option } 
      : option
  );

  // Find selected index
  const selectedIndex = normalizedOptions.findIndex(option => option.value === selectedValue);

  // Animate to selected position
  useEffect(() => {
    if (animated && selectedIndex >= 0 && segmentPositions[selectedIndex] !== undefined) {
      Animated.timing(animatedValue, {
        toValue: segmentPositions[selectedIndex],
        duration: animationDuration,
        useNativeDriver: false,
      }).start();
    }
  }, [selectedIndex, animatedValue, animated, animationDuration]);

  const handleOptionPress = (option: SegmentedControlOption) => {
    if (option.disabled) return;
    onChange(option.value);
  };

  const handleLayout = (event: LayoutChangeEvent, index: number) => {
    const { width, x } = event.nativeEvent.layout;
    segmentWidths[index] = width;
    segmentPositions[index] = x;
    
    // Initialize animation position for first render
    if (selectedIndex === index && !animated) {
      animatedValue.setValue(x);
    }
  };

  const renderOption = (option: SegmentedControlOption, index: number) => {
    const isSelected = option.value === selectedValue;
    const isDisabled = option.disabled;

    return (
      <Pressable
        key={option.value}
        style={[
          styles.option,
          styles[size],
          variantStyles.option,
          isDisabled && styles.disabledOption,
          optionStyle,
          isSelected && selectedOptionStyle,
        ]}
        onPress={() => handleOptionPress(option)}
        onLayout={(event) => handleLayout(event, index)}
        disabled={isDisabled}
        testID={`${testID}-option-${option.value}`}
        accessibilityRole="button"
        accessibilityLabel={option.label}
        accessibilityState={{
          selected: isSelected,
          disabled: isDisabled,
        }}
      >
        {/* Icon */}
        {option.icon && (
          <Ionicons
            name={option.icon}
            size={variantStyles.iconSize}
            color={isSelected ? variantStyles.selectedTextColor : variantStyles.textColor}
            style={[
              styles.optionIcon,
              !iconOnly && styles.optionIconWithText,
            ]}
          />
        )}
        
        {/* Label */}
        {!iconOnly && (
          <Text
            style={[
              styles.optionText,
              styles[`${size}Text`],
              { color: isSelected ? variantStyles.selectedTextColor : variantStyles.textColor },
              isDisabled && styles.disabledText,
              textStyle,
              isSelected && selectedTextStyle,
            ]}
            numberOfLines={1}
          >
            {option.label}
          </Text>
        )}
      </Pressable>
    );
  };

  return (
    <View
      style={[styles.container, variantStyles.container, style]}
      testID={testID}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
    >
      {/* Animated Selection Indicator */}
      {animated && selectedIndex >= 0 && (
        <Animated.View
          style={[
            styles.selectionIndicator,
            styles[`${size}Indicator`],
            variantStyles.selectionIndicator,
            {
              left: animatedValue,
              width: segmentWidths[selectedIndex] || 0,
            },
          ]}
        />
      )}
      
      {/* Options */}
      {normalizedOptions.map(renderOption)}
    </View>
  );
};

// Helper function to get variant-based styles
const getVariantStyles = (
  theme: any,
  variant: SegmentedControlVariant,
  size: SegmentedControlSize
) => {
  const baseStyles = {
    container: {
      backgroundColor: theme.colors.background.secondary,
      borderColor: theme.colors.border.primary,
    },
    option: {},
    selectionIndicator: {
      backgroundColor: theme.colors.interactive.primary,
    },
    textColor: theme.colors.text.secondary,
    selectedTextColor: theme.colors.text.inverse,
    iconSize: size === 'sm' ? 16 : size === 'md' ? 18 : 20,
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyles,
        container: {
          backgroundColor: theme.colors.interactive.primary + '15',
          borderColor: theme.colors.interactive.primary,
        },
        selectionIndicator: {
          backgroundColor: theme.colors.interactive.primary,
        },
        textColor: theme.colors.interactive.primary,
        selectedTextColor: theme.colors.text.inverse,
      };
    
    case 'secondary':
      return {
        ...baseStyles,
        container: {
          backgroundColor: theme.colors.background.tertiary,
          borderColor: theme.colors.border.secondary,
        },
        selectionIndicator: {
          backgroundColor: theme.colors.text.primary,
        },
        textColor: theme.colors.text.tertiary,
        selectedTextColor: theme.colors.text.inverse,
      };
    
    case 'compact':
      return {
        ...baseStyles,
        container: {
          backgroundColor: 'transparent',
          borderColor: theme.colors.border.primary,
          borderWidth: 1,
        },
        selectionIndicator: {
          backgroundColor: theme.colors.background.primary,
          borderWidth: 1,
          borderColor: theme.colors.border.primary,
        },
        textColor: theme.colors.text.primary,
        selectedTextColor: theme.colors.text.primary,
      };
    
    case 'default':
    default:
      return baseStyles;
  }
};

const createStyles = (theme: any, screenDimensions: any) => {
  const isTablet = screenDimensions.isTablet;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background.secondary,
      padding: theme.spacing.xs / 2,
      position: 'relative',
      overflow: 'hidden',
    },

    option: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      minHeight: theme.safeArea.minTouchTarget.height,
      zIndex: 1,
    },

    // Size variants
    sm: {
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: theme.spacing.xs,
      minHeight: 32,
    },

    md: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      minHeight: 40,
    },

    lg: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      minHeight: 48,
    },

    disabledOption: {
      opacity: 0.5,
    },

    selectionIndicator: {
      position: 'absolute',
      top: theme.spacing.xs / 2,
      bottom: theme.spacing.xs / 2,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.interactive.primary,
      zIndex: 0,
    },

    // Selection indicator size variants
    smIndicator: {
      borderRadius: theme.borderRadius.sm,
    },

    mdIndicator: {
      borderRadius: theme.borderRadius.md,
    },

    lgIndicator: {
      borderRadius: theme.borderRadius.lg,
    },

    optionIcon: {
      marginRight: 0,
    },

    optionIconWithText: {
      marginRight: theme.spacing.xs,
    },

    optionText: {
      fontSize: theme.fontSizes.body,
      fontWeight: theme.fontConfig.fontWeight.medium,
      textAlign: 'center',
      ...(isTablet && {
        fontSize: theme.fontSizes.body * 1.1,
      }),
    },

    // Text size variants
    smText: {
      fontSize: theme.fontSizes.sm,
      ...(isTablet && {
        fontSize: theme.fontSizes.sm * 1.1,
      }),
    },

    mdText: {
      fontSize: theme.fontSizes.body,
      ...(isTablet && {
        fontSize: theme.fontSizes.body * 1.1,
      }),
    },

    lgText: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      ...(isTablet && {
        fontSize: theme.fontSizes.lg * 1.1,
      }),
    },

    disabledText: {
      color: theme.colors.text.disabled,
    },
  });
};

export default SegmentedControl;