/**
 * SearchInput Component
 * 
 * Base search input component with Academy theming and debounced search functionality.
 * Part of the unified search system.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  TextInputProps 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export interface SearchInputProps extends Omit<TextInputProps, 'style' | 'onChangeText'> {
  /** Current search value */
  value?: string;
  /** Callback when search value changes */
  onChangeText?: (text: string) => void;
  /** Callback for debounced search */
  onDebouncedSearch?: (text: string) => void;
  /** Debounce delay in milliseconds */
  debounceDelay?: number;
  /** Search icon name */
  searchIcon?: keyof typeof Ionicons.glyphMap;
  /** Show clear button when text is present */
  showClearButton?: boolean;
  /** Callback when clear button is pressed */
  onClear?: () => void;
  /** Container styles */
  containerStyle?: ViewStyle;
  /** Input styles */
  inputStyle?: TextStyle;
  /** Placeholder text */
  placeholder?: string;
  /** Focus state */
  autoFocus?: boolean;
  /** Test ID for testing */
  testID?: string;
  /** Custom left icon component */
  leftIcon?: React.ReactNode;
  /** Custom right icon component */
  rightIcon?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state */
  loading?: boolean;
  /** Loading icon */
  loadingIcon?: keyof typeof Ionicons.glyphMap;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  onDebouncedSearch,
  debounceDelay = 300,
  searchIcon = "search-outline",
  showClearButton = true,
  onClear,
  containerStyle,
  inputStyle,
  placeholder = "Search...",
  autoFocus = false,
  testID = "search-input",
  leftIcon,
  rightIcon,
  disabled = false,
  size = 'md',
  loading = false,
  loadingIcon = "hourglass-outline",
  ...textInputProps
}) => {
  const { theme, screenDimensions } = useTheme();
  const [internalValue, setInternalValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const inputRef = useRef<TextInput>(null);
  
  const styles = createStyles(theme, screenDimensions, isFocused, size);
  const currentValue = value !== undefined ? value : internalValue;

  // Handle debounced search
  useEffect(() => {
    if (onDebouncedSearch && debounceDelay > 0) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        onDebouncedSearch(currentValue);
      }, debounceDelay);
      
      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }
  }, [currentValue, onDebouncedSearch, debounceDelay]);

  const handleChangeText = (text: string) => {
    if (value === undefined) {
      setInternalValue(text);
    }
    onChangeText?.(text);
  };

  const handleClear = () => {
    const newValue = '';
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChangeText?.(newValue);
    onClear?.();
  };

  const handleSearchIconPress = () => {
    inputRef.current?.focus();
  };

  const getIconSize = () => {
    const base = screenDimensions.isTablet ? theme.iconSize.md : theme.iconSize.sm;
    switch (size) {
      case 'sm': return Math.max(base - 4, 12);
      case 'lg': return base + 4;
      default: return base;
    }
  };
  
  const iconSize = getIconSize();

  return (
    <Pressable 
      style={[styles.container, containerStyle]}
      onPress={handleSearchIconPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="search"
      accessibilityLabel={placeholder}
      accessibilityState={{ disabled }}
    >
      {/* Left Icon */}
      <View style={styles.leftIconContainer}>
        {leftIcon || (
          loading ? (
            <Ionicons
              name={loadingIcon}
              size={iconSize}
              color={theme.colors.icon.secondary}
            />
          ) : (
            <Ionicons
              name={searchIcon}
              size={iconSize}
              color={theme.colors.icon.secondary}
            />
          )
        )}
      </View>

      {/* Text Input */}
      <TextInput
        ref={inputRef}
        {...textInputProps}
        value={currentValue}
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.tertiary}
        style={[styles.input, inputStyle]}
        autoFocus={autoFocus}
        editable={!disabled}
        selectTextOnFocus={!disabled}
        testID={`${testID}-input`}
        accessibilityRole="search"
        accessibilityLabel={placeholder}
        accessibilityState={{ disabled }}
      />

      {/* Right Icon / Clear Button */}
      <View style={styles.rightIconContainer}>
        {currentValue.length > 0 && showClearButton ? (
          <Pressable
            onPress={handleClear}
            style={styles.clearButton}
            disabled={disabled}
            testID={`${testID}-clear`}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            hitSlop={{
              top: theme.spacing.sm,
              bottom: theme.spacing.sm,
              left: theme.spacing.sm,
              right: theme.spacing.sm,
            }}
          >
            <Ionicons
              name="close-circle"
              size={iconSize}
              color={theme.colors.icon.tertiary}
            />
          </Pressable>
        ) : rightIcon ? (
          rightIcon
        ) : null}
      </View>
    </Pressable>
  );
};

const createStyles = (theme: any, screenDimensions: any, isFocused: boolean, size: 'sm' | 'md' | 'lg') => {
  const isTablet = screenDimensions.isTablet;
  
  // Size-based dimensions
  const getSizeDimensions = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
          fontSize: isTablet ? theme.fontSizes.caption : theme.fontSizes.caption * 0.9,
          minHeight: theme.safeArea.minTouchTarget.height * 0.8,
          borderRadius: theme.borderRadius.md,
        };
      case 'lg':
        return {
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          fontSize: isTablet ? theme.fontSizes.body : theme.fontSizes.small,
          minHeight: theme.safeArea.minTouchTarget.height * 1.2,
          borderRadius: theme.borderRadius.xl,
        };
      default: // md
        return {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          fontSize: isTablet ? theme.fontSizes.body : theme.fontSizes.caption,
          minHeight: theme.safeArea.minTouchTarget.height,
          borderRadius: theme.borderRadius.lg,
        };
    }
  };

  const sizeDimensions = getSizeDimensions();
  
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background.primary,
      borderWidth: theme.borderWidth.sm,
      borderColor: isFocused 
        ? theme.colors.border.focused 
        : theme.colors.border.primary,
      borderRadius: sizeDimensions.borderRadius,
      paddingHorizontal: sizeDimensions.paddingHorizontal,
      paddingVertical: sizeDimensions.paddingVertical,
      minHeight: sizeDimensions.minHeight,
      ...theme.elevation.sm,
    },
    
    leftIconContainer: {
      marginRight: theme.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    input: {
      flex: 1,
      fontSize: sizeDimensions.fontSize,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.regular,
      paddingVertical: theme.spacing.xs,
      // Remove default TextInput styling
      borderWidth: 0,
    },
    
    rightIconContainer: {
      marginLeft: theme.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    clearButton: {
      padding: theme.spacing.xs / 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

export default SearchInput;