import React, { useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useController } from 'react-hook-form';
import { Iconify } from 'react-native-iconify';
import { FormFieldProps } from '../../types';

type RadioButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
type RadioButtonSize = 'small' | 'medium' | 'large';

interface RadioButtonOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface RadioButtonProps extends FormFieldProps {
  options?: RadioButtonOption[];
  value?: string | number;
  label?: string;
  variant?: RadioButtonVariant;
  size?: RadioButtonSize;
  handleChange?: (value: string | number) => void;
  orientation?: 'horizontal' | 'vertical';
  defaultValue?: string | number;
}

// Single Radio Button Component
export const SingleRadioButton: React.FC<Omit<RadioButtonProps, 'options'> & { 
  isSelected: boolean; 
  onPress: () => void;
}> = ({
  label,
  value,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  isSelected,
  onPress,
}) => {
  const getVariantStyles = () => {
    const variants = {
      primary: {
        border: '#3B82F6',
        background: '#3B82F6',
        dot: '#FFFFFF',
      },
      secondary: {
        border: '#64748B',
        background: '#64748B',
        dot: '#FFFFFF',
      },
      success: {
        border: '#10B981',
        background: '#10B981',
        dot: '#FFFFFF',
      },
      warning: {
        border: '#F59E0B',
        background: '#F59E0B',
        dot: '#FFFFFF',
      },
      danger: {
        border: '#EF4444',
        background: '#EF4444',
        dot: '#FFFFFF',
      },
      info: {
        border: '#06B6D4',
        background: '#06B6D4',
        dot: '#FFFFFF',
      },
    };
    
    return variants[variant];
  };

  const getSizeStyles = () => {
    const sizes = {
      small: {
        container: { width: 16, height: 16 },
        dot: { width: 6, height: 6 },
        text: 14,
      },
      medium: {
        container: { width: 20, height: 20 },
        dot: { width: 8, height: 8 },
        text: 16,
      },
      large: {
        container: { width: 24, height: 24 },
        dot: { width: 10, height: 10 },
        text: 18,
      },
    };
    
    return sizes[size];
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const getRadioStyle = () => {
    return [
      styles.radio,
      {
        ...sizeStyles.container,
        borderColor: isSelected ? variantStyles.border : '#D1D5DB',
      },
      disabled && styles.disabledRadio,
    ];
  };

  const getDotStyle = () => {
    return [
      styles.radioDot,
      {
        ...sizeStyles.dot,
        backgroundColor: isSelected ? variantStyles.background : 'transparent',
      },
    ];
  };

  return (
    <TouchableOpacity
      style={styles.radioContainer}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="radio"
      accessibilityState={{
        selected: isSelected,
        disabled: disabled,
      }}
      accessibilityLabel={label || `Radio button ${isSelected ? 'selected' : 'unselected'}`}
    >
      <View style={getRadioStyle()}>
        {isSelected && <View style={getDotStyle()} />}
      </View>
      
      {label && (
        <Text
          style={[
            styles.radioLabel,
            { fontSize: sizeStyles.text },
            disabled && styles.disabledLabel,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// Radio Button Group Component
const RadioButton: React.FC<RadioButtonProps> = ({
  name,
  control,
  options = [],
  value,
  label,
  variant = 'primary',
  size = 'medium',
  handleChange,
  disabled = false,
  required = false,
  orientation = 'vertical',
  defaultValue,
}) => {
  const { field, fieldState } = useController({
    name,
    control,
    defaultValue: defaultValue || value || '',
  });

  const handleSelection = useCallback((selectedValue: string | number) => {
    if (disabled) return;
    
    field.onChange(selectedValue);
    
    if (handleChange) {
      handleChange(selectedValue);
    }
  }, [disabled, field, handleChange]);

  // If used as a single radio button (no options provided)
  if (options.length === 0 && value !== undefined) {
    const isSelected = field.value === value;
    
    return (
      <View style={styles.container}>
        <SingleRadioButton
          label={label}
          value={value}
          variant={variant}
          size={size}
          disabled={disabled}
          isSelected={isSelected}
          onPress={() => handleSelection(value)}
        />
        
        {fieldState.error && (
          <View style={styles.errorContainer}>
            <Iconify icon="ri:error-warning-line" size={16} color="#EF4444" />
            <Text style={styles.errorText}>{fieldState.error.message}</Text>
          </View>
        )}
      </View>
    );
  }

  // Radio button group
  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.groupLabel, disabled && styles.disabledLabel]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <View style={[
        styles.optionsContainer,
        orientation === 'horizontal' && styles.horizontalContainer
      ]}>
        {options.map((option, index) => (
          <SingleRadioButton
            key={`${option.value}-${index}`}
            label={option.label}
            value={option.value}
            variant={variant}
            size={size}
            disabled={disabled || option.disabled}
            isSelected={field.value === option.value}
            onPress={() => handleSelection(option.value)}
          />
        ))}
      </View>
      
      {fieldState.error && (
        <View style={styles.errorContainer}>
          <Iconify icon="ri:error-warning-line" size={16} color="#EF4444" />
          <Text style={styles.errorText}>{fieldState.error.message}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 4,
  },
  radio: {
    borderWidth: 2,
    borderRadius: 999, // Circle
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  disabledRadio: {
    borderColor: '#E5E7EB',
    opacity: 0.6,
  },
  radioDot: {
    borderRadius: 999, // Circle
  },
  radioLabel: {
    color: '#111827',
    fontWeight: '400',
    flex: 1,
    marginLeft: 4,
  },
  disabledLabel: {
    color: '#9CA3AF',
  },
  groupLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 12,
  },
  required: {
    color: '#EF4444',
    fontWeight: '500',
  },
  optionsContainer: {
    marginBottom: 8,
  },
  horizontalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
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
});

export default React.memo(RadioButton);