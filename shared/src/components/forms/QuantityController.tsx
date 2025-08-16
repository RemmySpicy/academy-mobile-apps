import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useController } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { FormFieldProps } from '../../types';
import { useTheme, createThemedStyles } from '../../theme/ThemeProvider';

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
  const { theme } = useTheme();
  const styles = useThemedStyles();
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
        button: { 
          width: theme.safeArea.minTouchTarget.width * 0.8, 
          height: theme.safeArea.minTouchTarget.height * 0.8 
        },
        text: { fontSize: theme.typography.caption.base.fontSize },
        icon: 16,
        value: { 
          ...theme.typography.body.sm, 
          minWidth: theme.safeArea.minTouchTarget.width * 0.9 
        },
      },
      medium: {
        button: { 
          width: theme.safeArea.minTouchTarget.width, 
          height: theme.safeArea.minTouchTarget.height 
        },
        text: { fontSize: theme.typography.body.base.fontSize },
        icon: 20,
        value: { 
          ...theme.typography.body.base, 
          minWidth: theme.safeArea.minTouchTarget.width * 1.1 
        },
      },
      large: {
        button: { 
          width: theme.safeArea.minTouchTarget.width * 1.2, 
          height: theme.safeArea.minTouchTarget.height * 1.2 
        },
        text: { fontSize: theme.typography.body.lg.fontSize },
        icon: 24,
        value: { 
          ...theme.typography.body.lg, 
          minWidth: theme.safeArea.minTouchTarget.width * 1.3 
        },
      },
    };
    
    return sizes[size];
  };

  const getVariantStyles = () => {
    const variants = {
      default: {
        button: {
          backgroundColor: theme.colors.interactive.primary,
          borderColor: theme.colors.interactive.primary,
        },
        buttonDisabled: {
          backgroundColor: theme.colors.background.secondary,
          borderColor: theme.colors.border.primary,
        },
        text: { color: theme.colors.text.inverted },
        textDisabled: { color: theme.colors.text.disabled },
      },
      outline: {
        button: {
          backgroundColor: 'transparent',
          borderColor: theme.colors.interactive.primary,
        },
        buttonDisabled: {
          backgroundColor: 'transparent',
          borderColor: theme.colors.border.primary,
        },
        text: { color: theme.colors.interactive.primary },
        textDisabled: { color: theme.colors.text.disabled },
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
        text: { color: theme.colors.interactive.primary },
        textDisabled: { color: theme.colors.text.disabled },
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
        <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }, getButtonStyle(true)]}
          onPress={handleDecrease}
          disabled={!canDecrease}
          accessibilityLabel="Decrease quantity"
          accessibilityRole="button"
        >
          <Ionicons 
            name="remove-outline" 
            size={sizeStyles.icon} 
            color={canDecrease ? variantStyles.text.color : variantStyles.textDisabled.color}
          />
        </Pressable>

        <View style={[styles.valueContainer, sizeStyles.value]}>
          <Text style={[
            styles.value, 
            sizeStyles.value,
            disabled && styles.disabledValue
          ]}>
            {currentValue}
          </Text>
        </View>

        <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }, getButtonStyle(false)]}
          onPress={handleIncrease}
          disabled={!canIncrease}
          accessibilityLabel="Increase quantity"
          accessibilityRole="button"
        >
          <Ionicons 
            name="add-outline" 
            size={sizeStyles.icon} 
            color={canIncrease ? variantStyles.text.color : variantStyles.textDisabled.color}
          />
        </Pressable>
      </View>
      
      {fieldState.error && (
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={16} color={theme.colors.status.error} />
          <Text style={styles.errorText}>{fieldState.error.message}</Text>
        </View>
      )}
    </View>
  );
};

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.componentSpacing.form.fieldGap,
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
      borderRadius: theme.borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.elevation.xs,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },
    buttonTextDisabled: {
      // Additional disabled text styling handled by variants
    },
    valueContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2],
    },
    value: {
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      textAlign: 'center',
    },
    disabledValue: {
      color: theme.colors.text.disabled,
    },
    label: {
      ...theme.typography.body.base,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[2],
    },
    disabledLabel: {
      color: theme.colors.text.disabled,
    },
    required: {
      color: theme.colors.status.error,
      fontWeight: theme.fontConfig.fontWeight.medium,
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
  })
);

const MemoizedQuantityController = React.memo(QuantityController);
export { MemoizedQuantityController as QuantityController };