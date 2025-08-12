import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Animated, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useController } from 'react-hook-form';
import { FormFieldProps } from '../../types';

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
      <TouchableOpacity
        style={[
          styles.option, 
          isSelected && styles.selectedOption,
          item.disabled && styles.disabledOption
        ]}
        onPress={() => handleSelection(item.value, item)}
        disabled={item.disabled}
        activeOpacity={item.disabled ? 1 : 0.7}
      >
        <Text style={[
          styles.optionText, 
          isSelected && styles.selectedOptionText,
          item.disabled && styles.disabledOptionText
        ]}>
          {item.label}
        </Text>
        {isSelected && showCheckmarks && (
          <Ionicons name="ri:check-line" size={20} color="#3B82F6" />
        )}
      </TouchableOpacity>
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
      <TouchableOpacity
        style={[
          styles.dropdown,
          isOpen && styles.dropdownOpen,
          fieldState.error && styles.dropdownError,
          disabled && styles.dropdownDisabled,
        ]}
        onPress={() => !disabled && openModal()}
        disabled={disabled}
        activeOpacity={0.7}
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
          name={isOpen ? "ri:arrow-up-s-line" : "ri:arrow-down-s-line"}
          size={20}
          color={disabled ? "#9CA3AF" : "#6B7280"}
        />
      </TouchableOpacity>

      {fieldState.error && (
        <View style={styles.errorContainer}>
          <Ionicons name="ri:error-warning-line" size={16} color="#EF4444" />
          <Text style={styles.errorText}>{fieldState.error.message}</Text>
        </View>
      )}

      <Modal
        visible={isOpen}
        {...getModalAnimationProps()}
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <Animated.View style={modalContentStyle}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Option</Text>
              <TouchableOpacity
                onPress={closeModal}
                style={styles.closeButton}
                accessibilityLabel="Close dropdown"
                accessibilityRole="button"
              >
                <Ionicons name="ri:close-line" size={24} color="#6B7280" />
              </TouchableOpacity>
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
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  dropdownOpen: {
    borderColor: '#3B82F6',
    borderWidth: 2,
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  dropdownDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontWeight: '400',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginLeft: 6,
    flex: 1,
    fontWeight: '400',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
    maxHeight: '80%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  optionsList: {
    paddingVertical: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 48,
  },
  selectedOption: {
    backgroundColor: '#EFF6FF',
  },
  disabledOption: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
    fontWeight: '400',
  },
  selectedOptionText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  disabledOptionText: {
    color: '#9CA3AF',
  },
});

export default React.memo(CustomDropdown);