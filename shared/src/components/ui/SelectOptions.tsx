/**
 * SelectOptions Component
 * 
 * A multi-select option grid component with Academy theming.
 * Supports single or multiple selection modes with responsive layout.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../theme';

export interface SelectOption {
  /** Unique identifier for the option */
  id: string;
  /** Display label for the option */
  label: string;
  /** Optional value (defaults to id if not provided) */
  value?: string;
  /** Whether this option is disabled */
  disabled?: boolean;
}

export interface SelectOptionsProps {
  /** Title text displayed above the options */
  title: string;
  /** Array of options to display */
  options: SelectOption[] | string[];
  /** Selected value(s) - string for single select, array for multi-select */
  value?: string | string[];
  /** Callback when selection changes */
  onSelectionChange?: (selected: string | string[]) => void;
  /** Enable multiple selection */
  multiSelect?: boolean;
  /** Number of columns in the grid (auto-calculated if not provided) */
  columns?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Custom container styles */
  style?: ViewStyle;
  /** Custom title styles */
  titleStyle?: TextStyle;
  /** Custom option styles */
  optionStyle?: ViewStyle;
  /** Custom selected option styles */
  selectedOptionStyle?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
  /** Minimum width for each option */
  minOptionWidth?: number;
}

export const SelectOptions: React.FC<SelectOptionsProps> = ({
  title,
  options,
  value,
  onSelectionChange,
  multiSelect = false,
  columns,
  disabled = false,
  style,
  titleStyle,
  optionStyle,
  selectedOptionStyle,
  testID = "select-options",
  minOptionWidth = 120,
}) => {
  const { theme, screenDimensions } = useTheme();
  
  // Normalize options to SelectOption format
  const normalizedOptions: SelectOption[] = options.map((option, index) => 
    typeof option === 'string' 
      ? { id: option, label: option, value: option }
      : option
  );

  // Internal state for uncontrolled component
  const [internalValue, setInternalValue] = useState<string | string[]>(() => {
    if (value !== undefined) return value;
    return multiSelect ? [] : (normalizedOptions[0]?.value || normalizedOptions[0]?.id || '');
  });

  const currentValue = value !== undefined ? value : internalValue;

  // Calculate optimal number of columns based on screen width
  const calculateColumns = useCallback(() => {
    if (columns) return columns;
    
    const availableWidth = screenDimensions.width - (theme.spacing.lg * 2); // Account for container padding
    const optionWidth = minOptionWidth + theme.spacing.md; // Option width + gap
    return Math.max(2, Math.floor(availableWidth / optionWidth));
  }, [columns, screenDimensions.width, minOptionWidth, theme.spacing]);

  const numColumns = calculateColumns();
  const styles = createStyles(theme, screenDimensions, numColumns);

  const isSelected = useCallback((optionValue: string): boolean => {
    if (multiSelect) {
      return Array.isArray(currentValue) && currentValue.includes(optionValue);
    }
    return currentValue === optionValue;
  }, [currentValue, multiSelect]);

  const handleOptionPress = useCallback((optionValue: string) => {
    if (disabled) return;

    let newValue: string | string[];

    if (multiSelect) {
      const currentArray = Array.isArray(currentValue) ? currentValue : [];
      if (currentArray.includes(optionValue)) {
        newValue = currentArray.filter(v => v !== optionValue);
      } else {
        newValue = [...currentArray, optionValue];
      }
    } else {
      newValue = optionValue;
    }

    if (value === undefined) {
      setInternalValue(newValue);
    }
    onSelectionChange?.(newValue);
  }, [disabled, multiSelect, currentValue, value, onSelectionChange]);

  return (
    <View 
      style={[styles.container, style]}
      testID={testID}
    >
      <Text 
        style={[styles.title, titleStyle]}
        testID={`${testID}-title`}
      >
        {title}
      </Text>
      
      <View style={styles.optionsGrid}>
        {normalizedOptions.map((option) => {
          const selected = isSelected(option.value || option.id);
          const isDisabled = disabled || option.disabled;
          
          return (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                styles.option,
                {
                  backgroundColor: selected 
                    ? theme.colors.interactive.primary
                    : theme.colors.background.primary,
                  borderColor: selected 
                    ? theme.colors.interactive.primary
                    : theme.colors.border.primary,
                  opacity: isDisabled ? 0.5 : 1,
                },
                selected && selectedOptionStyle,
                optionStyle,
                pressed && !isDisabled && styles.optionPressed,
              ]}
              onPress={() => handleOptionPress(option.value || option.id)}
              disabled={isDisabled}
              testID={`${testID}-option-${option.id}`}
              accessibilityRole="button"
              accessibilityState={{ 
                selected: selected,
                disabled: isDisabled,
              }}
              accessibilityLabel={option.label}
              hitSlop={{
                top: theme.spacing.sm,
                bottom: theme.spacing.sm,
                left: theme.spacing.sm,
                right: theme.spacing.sm,
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color: selected 
                      ? theme.colors.text.inverse
                      : theme.colors.text.primary,
                  },
                ]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const createStyles = (theme: any, screenDimensions: any, numColumns: number) => {
  const isTablet = screenDimensions.isTablet;
  const optionWidthPercentage = (100 / numColumns) - 2; // Account for gap
  const optionWidth = `${optionWidthPercentage}%`;
  
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.primary,
      padding: theme.spacing.md,
      marginVertical: theme.spacing.sm,
    },
    
    title: {
      fontSize: isTablet ? theme.fontSizes.body * 1.1 : theme.fontSizes.body,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    
    optionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
    },
    
    option: {
      width: optionWidthPercentage + '%' as any,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      borderWidth: theme.borderWidth.sm,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: theme.safeArea.minTouchTarget.height,
      marginVertical: theme.spacing.xs,
    },
    
    optionPressed: {
      transform: [{ scale: 0.96 }],
      opacity: 0.8,
    },
    
    optionText: {
      fontSize: isTablet ? theme.fontSizes.body : theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.medium,
      textAlign: 'center',
      lineHeight: isTablet ? 22 : 18,
    },
  });
};

export default SelectOptions;