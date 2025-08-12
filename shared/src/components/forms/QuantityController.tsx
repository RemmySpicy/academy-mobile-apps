import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useController } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { FormFieldProps } from '../../types';

interface QuantityControllerProps extends FormFieldProps {
  initialValue?: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
  onChange?: (value: number) => void;
  label?: string;
  showLabel?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  orientation?: 'horizontal' | 'vertical';
}

const QuantityController: React.FC<QuantityControllerProps> = ({
  name,
  control,
  initialValue = 0,
  minValue = 0,
  maxValue = 999,
  step = 1,
  onChange,
  label,
  showLabel = true,
  disabled = false,
  required = false,
  variant = 'default',
  size = 'medium',
  orientation = 'horizontal',
}) => {
  const { field, fieldState } = useController({
    name,
    control,
    defaultValue: initialValue,
  });

  const currentValue = field.value || 0;

  const handleIncrease = useCallback(() => {
    if (disabled || currentValue >= maxValue) return;
    
    const newValue = Math.min(maxValue, currentValue + step);
    field.onChange(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
  }, [disabled, currentValue, maxValue, step, field, onChange]);

  const handleDecrease = useCallback(() => {
    if (disabled || currentValue <= minValue) return;
    
    const newValue = Math.max(minValue, currentValue - step);
    field.onChange(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
  }, [disabled, currentValue, minValue, step, field, onChange]);

  const getSizeStyles = () => {
    const sizes = {
      small: {
        button: { width: 32, height: 32 },
        text: { fontSize: 14 },
        icon: 16,
        value: { fontSize: 16, minWidth: 40 },
      },
      medium: {
        button: { width: 40, height: 40 },
        text: { fontSize: 16 },
        icon: 20,
        value: { fontSize: 18, minWidth: 50 },
      },
      large: {
        button: { width: 48, height: 48 },
        text: { fontSize: 18 },
        icon: 24,
        value: { fontSize: 20, minWidth: 60 },
      },
    };
    
    return sizes[size];
  };

  const getVariantStyles = () => {
    const variants = {
      default: {
        button: {
          backgroundColor: '#3B82F6',
          borderColor: '#3B82F6',
        },
        buttonDisabled: {
          backgroundColor: '#E5E7EB',
          borderColor: '#E5E7EB',
        },
        text: { color: '#FFFFFF' },
        textDisabled: { color: '#9CA3AF' },
      },
      outline: {
        button: {
          backgroundColor: 'transparent',
          borderColor: '#3B82F6',
        },
        buttonDisabled: {
          backgroundColor: 'transparent',
          borderColor: '#E5E7EB',
        },
        text: { color: '#3B82F6' },
        textDisabled: { color: '#9CA3AF' },
      },
      ghost: {
        button: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        },
        buttonDisabled: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        },
        text: { color: '#3B82F6' },
        textDisabled: { color: '#9CA3AF' },
      },
    };
    
    return variants[variant];
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const canDecrease = !disabled && currentValue > minValue;
  const canIncrease = !disabled && currentValue < maxValue;

  const getButtonStyle = (isDecrease: boolean) => {
    const canPerformAction = isDecrease ? canDecrease : canIncrease;
    
    return [
      styles.button,
      sizeStyles.button,
      variantStyles.button,
      !canPerformAction && [styles.buttonDisabled, variantStyles.buttonDisabled],
    ];
  };

  const getButtonTextStyle = (isDecrease: boolean) => {
    const canPerformAction = isDecrease ? canDecrease : canIncrease;
    
    return [
      styles.buttonText,
      sizeStyles.text,
      variantStyles.text,
      !canPerformAction && [styles.buttonTextDisabled, variantStyles.textDisabled],
    ];
  };

  const containerStyle = orientation === 'vertical' 
    ? styles.verticalContainer 
    : styles.horizontalContainer;

  return (
    <View style={styles.container}>
      {showLabel && label && (
        <Text style={[styles.label, disabled && styles.disabledLabel]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <View style={containerStyle}>
        <TouchableOpacity
          style={getButtonStyle(true)}
          onPress={handleDecrease}
          disabled={!canDecrease}
          activeOpacity={0.7}
          accessibilityLabel="Decrease quantity"
          accessibilityRole="button"
        >
          <Ionicons 
            name="ri:subtract-line" 
            size={sizeStyles.icon} 
            color={canDecrease ? variantStyles.text.color : variantStyles.textDisabled.color}
          />
        </TouchableOpacity>

        <View style={[styles.valueContainer, sizeStyles.value]}>
          <Text style={[
            styles.value, 
            sizeStyles.value,
            disabled && styles.disabledValue
          ]}>
            {currentValue}
          </Text>
        </View>

        <TouchableOpacity
          style={getButtonStyle(false)}
          onPress={handleIncrease}
          disabled={!canIncrease}
          activeOpacity={0.7}
          accessibilityLabel="Increase quantity"
          accessibilityRole="button"
        >
          <Ionicons 
            name="ri:add-line" 
            size={sizeStyles.icon} 
            color={canIncrease ? variantStyles.text.color : variantStyles.textDisabled.color}
          />
        </TouchableOpacity>
      </View>
      
      {fieldState.error && (
        <View style={styles.errorContainer}>
          <Ionicons name="ri:error-warning-line" size={16} color="#EF4444" />
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
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontWeight: '600',
  },
  buttonTextDisabled: {
    // Additional disabled text styling
  },
  valueContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingVertical: 8,
  },
  value: {
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  disabledValue: {
    color: '#9CA3AF',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  disabledLabel: {
    color: '#9CA3AF',
  },
  required: {
    color: '#EF4444',
    fontWeight: '500',
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

export default React.memo(QuantityController);