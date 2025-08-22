/**
 * FormDropdown Component
 * 
 * A traditional dropdown/picker component for forms with modal bottom sheet.
 * Integrates with React Hook Form and provides Academy theming.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, ViewStyle, TextStyle, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { BottomSheet } from './BottomSheet';

export interface DropdownOption {
  /** Unique identifier for the option */
  id: string;
  /** Display label for the option */
  label: string;
  /** Optional value (defaults to id if not provided) */
  value?: string;
  /** Whether this option is disabled */
  disabled?: boolean;
  /** Optional icon name from Ionicons */
  icon?: string;
}

export interface FormDropdownProps {
  /** Label text displayed above the dropdown */
  label: string;
  /** Array of options to display */
  options: DropdownOption[] | string[];
  /** Selected value */
  value?: string;
  /** Callback when selection changes */
  onSelectionChange?: (selected: string) => void;
  /** Placeholder text when no selection */
  placeholder?: string;
  /** Error message to display */
  error?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Required field indicator */
  required?: boolean;
  /** Enable search/filter functionality */
  searchable?: boolean;
  /** Custom container styles */
  style?: ViewStyle;
  /** Custom dropdown trigger styles */
  triggerStyle?: ViewStyle;
  /** Custom label styles */
  labelStyle?: TextStyle;
  /** Test ID for testing */
  testID?: string;
}

export const FormDropdown: React.FC<FormDropdownProps> = ({
  label,
  options,
  value,
  onSelectionChange,
  placeholder = "Select an option",
  error,
  disabled = false,
  required = false,
  searchable = false,
  style,
  triggerStyle,
  labelStyle,
  testID = "form-dropdown",
}) => {
  const { theme } = useTheme();
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Normalize options to DropdownOption format
  const normalizedOptions: DropdownOption[] = options.map((option, index) => 
    typeof option === 'string' 
      ? { id: option, label: option, value: option }
      : option
  );

  // Filter options based on search query
  const filteredOptions = searchQuery
    ? normalizedOptions.filter(option => 
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : normalizedOptions;

  const selectedOption = normalizedOptions.find(option => 
    (option.value || option.id) === value
  );

  const styles = createStyles(theme, !!error);

  const handleOptionPress = useCallback((optionValue: string) => {
    onSelectionChange?.(optionValue);
    setIsBottomSheetVisible(false);
    setSearchQuery('');
  }, [onSelectionChange]);

  const handleBottomSheetClose = () => {
    setIsBottomSheetVisible(false);
    setSearchQuery('');
  };

  const renderOption = ({ item }: { item: DropdownOption }) => (
    <Pressable
      style={({ pressed }) => [
        styles.option,
        {
          backgroundColor: pressed ? theme.colors.background.secondary : 'transparent',
          opacity: item.disabled ? 0.5 : 1,
        }
      ]}
      onPress={() => handleOptionPress(item.value || item.id)}
      disabled={item.disabled}
      testID={`${testID}-option-${item.id}`}
    >
      <View style={styles.optionContent}>
        {item.icon && (
          <Ionicons 
            name={item.icon as any} 
            size={20} 
            color={theme.colors.text.primary} 
            style={styles.optionIcon}
          />
        )}
        <Text style={styles.optionText}>{item.label}</Text>
        {(item.value || item.id) === value && (
          <Ionicons 
            name="checkmark" 
            size={20} 
            color={theme.colors.interactive.primary}
          />
        )}
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, style]} testID={testID}>
      {/* Label */}
      <View style={styles.labelContainer}>
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>

      {/* Dropdown Trigger */}
      <Pressable
        style={[styles.trigger, triggerStyle, disabled && styles.triggerDisabled]}
        onPress={() => !disabled && setIsBottomSheetVisible(true)}
        disabled={disabled}
        testID={`${testID}-trigger`}
      >
        <Text 
          style={[
            styles.triggerText, 
            !selectedOption && styles.placeholderText
          ]}
          numberOfLines={1}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons 
          name="chevron-down" 
          size={20} 
          color={disabled ? theme.colors.text.disabled : theme.colors.text.secondary}
        />
      </Pressable>

      {/* Error Message */}
      {error && (
        <Text style={styles.errorText} testID={`${testID}-error`}>
          {error}
        </Text>
      )}

      {/* Bottom Sheet */}
      <BottomSheet
        visible={isBottomSheetVisible}
        onClose={handleBottomSheetClose}
        title={label}
        snapPoints={['medium', 'large']}
        initialSnapPoint="medium"
        scrollable={true}
        showDragHandle={true}
        testID={testID}
      >
        <View style={styles.bottomSheetContent}>
          {/* Search Input (if searchable) */}
          {searchable && (
            <View style={styles.searchContainer}>
              <Ionicons 
                name="search" 
                size={20} 
                color={theme.colors.text.secondary} 
                style={styles.searchIcon}
              />
              <TextInput 
                style={styles.searchInput}
                onChangeText={setSearchQuery}
                value={searchQuery}
                placeholder="Search options..."
                placeholderTextColor={theme.colors.text.secondary}
              />
            </View>
          )}

          {/* Options List */}
          <FlatList
            data={filteredOptions}
            renderItem={renderOption}
            keyExtractor={(item) => item.id}
            style={styles.optionsList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

const createStyles = (theme: any, hasError: boolean) => {
  return StyleSheet.create({
    container: {
      marginVertical: theme.spacing.sm,
    },
    
    labelContainer: {
      marginBottom: theme.spacing.xs,
    },
    
    label: {
      fontSize: theme.fontSizes.body,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.primary,
    },
    
    required: {
      color: theme.colors.status.error,
    },
    
    trigger: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.background.primary,
      borderWidth: theme.borderWidth.sm,
      borderColor: hasError ? theme.colors.status.error : theme.colors.border.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      minHeight: theme.safeArea.minTouchTarget.height,
    },
    
    triggerDisabled: {
      backgroundColor: theme.colors.background.disabled,
      opacity: 0.6,
    },
    
    triggerText: {
      flex: 1,
      fontSize: theme.fontSizes.body,
      color: theme.colors.text.primary,
      marginRight: theme.spacing.sm,
    },
    
    placeholderText: {
      color: theme.colors.text.secondary,
    },
    
    errorText: {
      marginTop: theme.spacing.xs,
      fontSize: theme.fontSizes.caption,
      color: theme.colors.status.error,
    },
    
    bottomSheetContent: {
      flex: 1,
    },
    
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
    },
    
    searchIcon: {
      marginRight: theme.spacing.sm,
    },
    
    searchInput: {
      flex: 1,
      padding: theme.spacing.md,
      fontSize: theme.fontSizes.body,
      color: theme.colors.text.primary,
    },
    
    optionsList: {
      flex: 1,
    },
    
    option: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: theme.borderWidth.xs,
      borderBottomColor: theme.colors.border.secondary,
    },
    
    optionContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    optionIcon: {
      marginRight: theme.spacing.sm,
    },
    
    optionText: {
      flex: 1,
      fontSize: theme.fontSizes.body,
      color: theme.colors.text.primary,
    },
  });
};

export default FormDropdown;