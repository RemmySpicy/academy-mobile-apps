import React, { useCallback } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useController } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { FormFieldProps } from '../../types';
import { useTheme, createThemedStyles } from '../../theme/ThemeProvider';

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
  onValueChange?: (value: string | number) => void;
  handleChange?: (value: string | number) => void; // Legacy support
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
  const { theme } = useTheme();
  const styles = useThemedStyles();
  
  const getVariantStyles = () => {
    const variants = {
      primary: {
        border: theme.colors.interactive.primary,
        background: theme.colors.interactive.primary,
        dot: theme.colors.text.inverse,
      },
      secondary: {
        border: theme.colors.interactive.secondary,
        background: theme.colors.interactive.secondary,
        dot: theme.colors.text.inverse,
      },
      success: {
        border: theme.colors.status.success,
        background: theme.colors.status.success,
        dot: theme.colors.text.inverse,
      },
      warning: {
        border: theme.colors.status.warning,
        background: theme.colors.status.warning,
        dot: theme.colors.text.inverse,
      },
      danger: {
        border: theme.colors.status.error,
        background: theme.colors.status.error,
        dot: theme.colors.text.inverse,
      },
      info: {
        border: theme.colors.status.info,
        background: theme.colors.status.info,
        dot: theme.colors.text.inverse,
      },
    };
    
    return variants[variant];
  };

  const getSizeStyles = () => {
    const sizes = {
      small: {
        container: { width: 16, height: 16 },
        dot: { width: 6, height: 6 },
        text: theme.typography.caption.base.fontSize,
      },
      medium: {
        container: { width: 20, height: 20 },
        dot: { width: 8, height: 8 },
        text: theme.typography.body.base.fontSize,
      },
      large: {
        container: { width: 24, height: 24 },
        dot: { width: 10, height: 10 },
        text: theme.typography.body.lg.fontSize,
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
        borderColor: isSelected ? variantStyles.border : theme.colors.border.primary,
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
    <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }, styles.radioContainer]}
      onPress={onPress}
      disabled={disabled}
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
    </Pressable>
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
  onValueChange,
  handleChange, // Legacy support
  disabled = false,
  required = false,
  orientation = 'vertical',
  defaultValue,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const { field, fieldState } = useController({
    name,
    control,
    defaultValue: defaultValue || value || '',
  });

  const handleSelection = useCallback((selectedValue: string | number) => {
    if (disabled) return;
    
    field.onChange(selectedValue);
    
    // Call both new and legacy handlers
    onValueChange?.(selectedValue);
    handleChange?.(selectedValue);
  }, [disabled, field, onValueChange, handleChange]);

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
            <Ionicons name="warning-outline" size={16} color={theme.colors.status.error} />
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
    radioContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing[2],
      marginBottom: theme.spacing[1],
      minHeight: theme.safeArea.minTouchTarget.height,
    },
    radio: {
      borderWidth: 2,
      borderRadius: 999, // Circle
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing[2],
    },
    disabledRadio: {
      borderColor: theme.colors.border.primary,
      opacity: 0.6,
    },
    radioDot: {
      borderRadius: 999, // Circle
    },
    radioLabel: {
      ...theme.typography.body.base,
      color: theme.colors.text.primary,
      flex: 1,
      marginLeft: theme.spacing[1],
    },
    disabledLabel: {
      color: theme.colors.text.disabled,
    },
    groupLabel: {
      ...theme.typography.body.base,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[3],
    },
    required: {
      color: theme.colors.status.error,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    optionsContainer: {
      marginBottom: theme.spacing[2],
    },
    horizontalContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[4],
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

const MemoizedRadioButton = React.memo(RadioButton);
export { MemoizedRadioButton as RadioButton };