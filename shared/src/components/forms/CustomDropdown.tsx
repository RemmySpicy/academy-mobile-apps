import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, FlatList, Animated, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useController } from 'react-hook-form';
import { FormFieldProps } from '../../types';
import { useTheme, createThemedStyles } from '../../theme/ThemeProvider';
import { themeUtils } from '../../theme';

const { height: screenHeight } = Dimensions.get('window');

export interface DropdownOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface CustomDropdownProps extends FormFieldProps {
  options: DropdownOption[];
  onSelectionChange?: (value: string | number | string[] | number[]) => void;
  searchable?: boolean;
  multiple?: boolean;
  maxHeight?: number;
  closeOnSelect?: boolean;
  animationType?: 'fade' | 'slide' | 'none';
  showCheckmarks?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  name,
  control,
  placeholder = "Select an option",
  options,
  onSelectionChange,
  searchable = false,
  multiple = false,
  maxHeight = Math.min(300, screenHeight * 0.4),
  disabled = false,
  required = false,
  closeOnSelect = !multiple,
  animationType = 'slide',
  showCheckmarks = true,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [slideAnim] = useState(new Animated.Value(0));

  const { field, fieldState } = useController({
    name,
    control,
    defaultValue: multiple ? [] : '',
  });

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchText.trim()) {
      return options;
    }
    return options.filter(option =>
      option.label.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [options, searchable, searchText]);

  const handleSelection = useCallback((selectedValue: string | number, option: DropdownOption) => {
    if (option.disabled) return;
    
    if (multiple) {
      const currentValues = field.value || [];
      const newValues = currentValues.includes(selectedValue)
        ? currentValues.filter((v: any) => v !== selectedValue)
        : [...currentValues, selectedValue];
      
      field.onChange(newValues);
      if (onSelectionChange) {
        onSelectionChange(newValues);
      }
    } else {
      field.onChange(selectedValue);
      if (closeOnSelect) {
        closeModal();
      }
      if (onSelectionChange) {
        onSelectionChange(selectedValue);
      }
    }
  }, [field, multiple, onSelectionChange, closeOnSelect]);

  const getDisplayText = useCallback(() => {
    if (multiple) {
      const selectedOptions = options.filter(option =>
        field.value?.includes(option.value)
      );
      if (selectedOptions.length === 0) return placeholder;
      if (selectedOptions.length === 1) return selectedOptions[0].label;
      return `${selectedOptions.length} items selected`;
    } else {
      const selectedOption = options.find(option => option.value === field.value);
      return selectedOption ? selectedOption.label : placeholder;
    }
  }, [field.value, multiple, options, placeholder]);

  const openModal = useCallback(() => {
    setIsOpen(true);
    if (animationType === 'slide') {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [animationType, slideAnim]);

  const closeModal = useCallback(() => {
    if (animationType === 'slide') {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setIsOpen(false));
    } else {
      setIsOpen(false);
    }
    setSearchText('');
  }, [animationType, slideAnim]);

  const renderOption = useCallback(({ item }: { item: DropdownOption }) => {
    const isSelected = multiple
      ? field.value?.includes(item.value)
      : field.value === item.value;

    return (
      <Pressable 
        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, [
          styles.option, 
          isSelected && styles.selectedOption,
          item.disabled && styles.disabledOption
        ]]}
        onPress={() => handleSelection(item.value, item)}
        disabled={item.disabled}
      >
        <Text style={[
          styles.optionText, 
          isSelected && styles.selectedOptionText,
          item.disabled && styles.disabledOptionText
        ]}>
          {item.label}
        </Text>
        {isSelected && showCheckmarks && (
          <Ionicons name="checkmark-outline" size={20} color={theme.colors.interactive.primary} />
        )}
      </Pressable>
    );
  }, [field.value, multiple, handleSelection, showCheckmarks]);

  const getModalAnimationProps = () => {
    switch (animationType) {
      case 'slide':
        return {
          animationType: 'none' as const,
          transparent: true,
        };
      case 'fade':
        return {
          animationType: 'fade' as const,
          transparent: true,
        };
      default:
        return {
          animationType: 'none' as const,
          transparent: true,
        };
    }
  };

  const modalContentStyle = animationType === 'slide' 
    ? [
        styles.modalContent,
        {
          transform: [{
            translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [screenHeight, 0],
            }),
          }],
        },
      ]
    : styles.modalContent;

  return (
    <View style={styles.container}>
      <Pressable 
        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, [
          styles.dropdown,
          isOpen && styles.dropdownOpen,
          fieldState.error && styles.dropdownError,
          disabled && styles.dropdownDisabled,
        ]]}
        onPress={() => !disabled && openModal()}
        disabled={disabled}
        accessibilityLabel={placeholder}
        accessibilityHint="Double tap to open dropdown"
        accessibilityRole="button"
      >
        <Text
          style={[
            styles.dropdownText,
            !field.value && styles.placeholderText,
            disabled && styles.disabledText,
          ]}
          numberOfLines={1}
        >
          {getDisplayText()}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up-outline" : "chevron-down-outline"}
          size={20}
          color={disabled ? theme.colors.text.disabled : theme.colors.text.secondary}
        />
      </Pressable>

      {fieldState.error && (
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={16} color={theme.colors.status.error} />
          <Text style={styles.errorText}>{fieldState.error.message}</Text>
        </View>
      )}

      <Modal
        visible={isOpen}
        {...getModalAnimationProps()}
        onRequestClose={closeModal}
      >
        <Pressable style={({ pressed }) => [styles.modalOverlay]}
          onPress={closeModal}
        >
          <View style={styles.modalContainer}>
            <Animated.View style={modalContentStyle}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Option</Text>
                <Pressable 
                  onPress={closeModal}
                  style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, styles.closeButton]}
                  accessibilityLabel="Close dropdown"
                  accessibilityRole="button"
                >
                  <Ionicons name="close-outline" size={24} color={theme.colors.text.secondary} />
                </Pressable>
              </View>

              <FlatList
                data={filteredOptions}
                renderItem={renderOption}
                keyExtractor={(item) => item.value.toString()}
                style={[styles.optionsList, { maxHeight }]}
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                getItemLayout={(data, index) => ({
                  length: 48,
                  offset: 48 * index,
                  index,
                })}
              />
            </Animated.View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.componentSpacing.form.fieldGap,
    },
    dropdown: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: theme.safeArea.minTouchTarget.height,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing[4],
      backgroundColor: theme.colors.background.primary,
    },
    dropdownOpen: {
      borderColor: theme.colors.border.focused,
      borderWidth: 2,
      ...themeUtils.createShadow('sm', theme.colors.interactive.primary),
    },
    dropdownError: {
      borderColor: theme.colors.border.error,
      borderWidth: 2,
    },
    dropdownDisabled: {
      backgroundColor: theme.colors.background.secondary,
      borderColor: theme.colors.border.primary,
      opacity: 0.6,
    },
    dropdownText: {
      flex: 1,
      ...theme.typography.body.base,
      color: theme.colors.text.primary,
    },
    placeholderText: {
      color: theme.colors.text.tertiary,
    },
    disabledText: {
      color: theme.colors.text.disabled,
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing[1],
      paddingHorizontal: theme.spacing[1],
    },
    errorText: {
      ...theme.typography.caption.base,
      color: theme.colors.status.error,
      marginLeft: theme.spacing[1],
      flex: 1,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    modalContainer: {
      width: '100%',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.colors.background.primary,
      borderTopLeftRadius: theme.borderRadius.lg,
      borderTopRightRadius: theme.borderRadius.lg,
      width: '100%',
      maxHeight: '80%',
      ...theme.elevation.lg,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    modalTitle: {
      ...theme.typography.heading.h5,
      color: theme.colors.text.primary,
    },
    closeButton: {
      padding: theme.spacing[1],
      minWidth: theme.safeArea.minTouchTarget.width,
      minHeight: theme.safeArea.minTouchTarget.height,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionsList: {
      paddingVertical: theme.spacing[2],
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      minHeight: theme.safeArea.minTouchTarget.height,
    },
    selectedOption: {
      backgroundColor: theme.colors.background.secondary,
    },
    disabledOption: {
      opacity: 0.5,
    },
    optionText: {
      ...theme.typography.body.base,
      color: theme.colors.text.primary,
      flex: 1,
    },
    selectedOptionText: {
      color: theme.colors.interactive.primary,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    disabledOptionText: {
      color: theme.colors.text.disabled,
    },
  })
);

const MemoizedCustomDropdown = React.memo(CustomDropdown);
export { MemoizedCustomDropdown as CustomDropdown };