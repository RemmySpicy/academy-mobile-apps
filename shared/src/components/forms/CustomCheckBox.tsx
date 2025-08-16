import React, { useState, useCallback } from 'react';
import { View, Pressable, Text, StyleSheet, Animated, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useController } from 'react-hook-form';
import { FormFieldProps } from '../../types';
import { useTheme, createThemedStyles } from '../../theme/ThemeProvider';

type CheckboxVariant = 
  | 'primary'    // Academy purple
  | 'success'    // Green
  | 'warning'    // Orange/Yellow
  | 'info'       // Blue
  | 'secondary'; // Gray

type CheckboxSize = 'sm' | 'md' | 'lg';

/**
 * Props interface for CustomCheckBox component
 * @interface CustomCheckBoxProps
 */
interface CustomCheckBoxProps extends Omit<FormFieldProps, 'placeholder' | 'name'> {
  /** Form field name - optional for standalone usage (when not using with React Hook Form) */
  name?: string;
  
  /** Visual variant of the checkbox */
  variant?: CheckboxVariant;
  
  /** Size of the checkbox */
  size?: CheckboxSize;
  
  /** Text label displayed next to the checkbox */
  label?: string;
  
  /** Additional description text displayed below the label */
  description?: string;
  
  // Controlled or uncontrolled state
  /** Current checked state (for controlled usage) */
  value?: boolean;
  
  /** Default checked state (for uncontrolled usage) */
  defaultValue?: boolean;
  
  /** Callback fired when the checkbox state changes */
  onValueChange?: (value: boolean) => void;
  
  // Visual options
  /** Whether the checkbox is in an indeterminate state */
  indeterminate?: boolean;
  
  /** Custom icon to display (will be used for both checked and unchecked if no specific icons provided) */
  icon?: React.ReactNode;
  
  /** Custom icon to display when checked */
  checkedIcon?: React.ReactNode;
  
  /** Custom icon to display when unchecked */
  uncheckedIcon?: React.ReactNode;
  
  /** Custom icon to display when in indeterminate state */
  indeterminateIcon?: React.ReactNode;
  
  // Styling
  /** Container style override */
  style?: ViewStyle;
  
  /** Checkbox (square) style override */
  checkboxStyle?: ViewStyle;
  
  /** Label text style override */
  labelStyle?: any;
  
  // Accessibility
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  
  /** Accessibility hint providing additional context */
  accessibilityHint?: string;
  
  /** Test identifier for testing frameworks */
  testID?: string;
  
  // Animation
  /** Whether to animate state changes */
  animated?: boolean;
  
  /** Duration of animations in milliseconds */
  animationDuration?: number;
}

const CustomCheckBox: React.FC<CustomCheckBoxProps> = ({
  name,
  control,
  rules,
  variant = 'primary',
  size = 'md',
  label,
  description,
  value,
  defaultValue = false,
  onValueChange,
  indeterminate = false,
  icon,
  checkedIcon,
  uncheckedIcon,
  indeterminateIcon,
  disabled = false,
  required = false,
  style,
  checkboxStyle,
  labelStyle,
  accessibilityLabel,
  accessibilityHint,
  testID,
  animated = true,
  animationDuration = 200,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();

  // Animation value for smooth transitions
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  // Form integration or standalone state
  const formField = control && name ? useController({
    name,
    control,
    rules,
    defaultValue,
  }) : null;

  const [internalValue, setInternalValue] = useState(value ?? defaultValue);

  const isChecked = formField ? formField.field.value : (value ?? internalValue);
  const hasError = formField?.fieldState.error;

  // Handle value changes
  const handleToggle = useCallback(() => {
    if (disabled) return;

    const newValue = !isChecked;
    
    if (formField) {
      formField.field.onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
    
    onValueChange?.(newValue);

    // Animate the change
    if (animated) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: newValue ? 1 : 0,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: newValue ? 1 : 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [disabled, isChecked, formField, onValueChange, animated, scaleAnim, opacityAnim, animationDuration]);

  // Update animation when value changes externally
  React.useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: isChecked ? 1 : 0,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: isChecked ? 1 : 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isChecked, animated, scaleAnim, opacityAnim, animationDuration]);

  const getCheckboxStyles = () => {
    const baseStyles = [
      styles.checkbox,
      styles[size],
      styles[variant],
    ];

    if (isChecked) {
      baseStyles.push(styles[`${variant}Checked`]);
    }

    if (indeterminate) {
      baseStyles.push(styles.indeterminate);
    }

    if (hasError) {
      baseStyles.push(styles.error);
    }

    if (disabled) {
      baseStyles.push(styles.disabled);
    }

    return baseStyles;
  };

  const renderCheckIcon = () => {
    if (indeterminate) {
      return indeterminateIcon || (
        <Ionicons
          name="remove-outline"
          size={size === 'sm' ? 12 : size === 'md' ? 14 : 16}
          color={theme.colors.text.inverse}
        />
      );
    }

    if (isChecked) {
      return checkedIcon || icon || (
        <Animated.View
          style={{
            opacity: animated ? opacityAnim : 1,
            transform: animated ? [{ scale: scaleAnim }] : [{ scale: 1 }],
          }}
        >
          <Ionicons
            name="checkmark-outline"
            size={size === 'sm' ? 12 : size === 'md' ? 14 : 16}
            color={theme.colors.text.inverse}
          />
        </Animated.View>
      );
    }

    return uncheckedIcon || null;
  };

  const renderLabel = () => {
    if (!label) return null;

    return (
      <View style={styles.labelContainer}>
        <Text 
          style={[
            styles.label,
            styles[`${size}Label`],
            hasError && styles.labelError,
            disabled && styles.labelDisabled,
            labelStyle,
          ]}
        >
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
        
        {description && (
          <Text style={[styles.description, disabled && styles.descriptionDisabled]}>
            {description}
          </Text>
        )}
      </View>
    );
  };

  const renderError = () => {
    if (!hasError || !formField) return null;

    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={14} color={theme.colors.status.error} />
        <Text style={styles.errorText} accessibilityRole="alert">
          {formField.fieldState.error.message}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <Pressable onPress={handleToggle}
        disabled={disabled}
        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, styles.touchable]}
        accessibilityRole="checkbox"
        accessibilityLabel={accessibilityLabel || label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{
          checked: indeterminate ? 'mixed' : isChecked,
          disabled,
        }}
        testID={testID}
        >
        <View style={[...getCheckboxStyles(), checkboxStyle]}>
          {renderCheckIcon()}
        </View>
        
        {renderLabel()}
      </Pressable>
      
      {renderError()}
    </View>
  );
};

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.componentSpacing.form.fieldGap,
    },

    touchable: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      minHeight: theme.safeArea.minTouchTarget.height,
    },

    // Base checkbox styles
    checkbox: {
      borderWidth: theme.borderWidth.md,
      borderRadius: theme.borderRadius.sm,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background.primary,
      borderColor: theme.colors.border.primary,
    },

    // Size variants
    sm: {
      width: theme.spacing[4],
      height: theme.spacing[4],
    },

    md: {
      width: theme.spacing[5],
      height: theme.spacing[5],
    },

    lg: {
      width: theme.spacing[6],
      height: theme.spacing[6],
    },

    // Variant styles (unchecked state)
    primary: {
      borderColor: theme.colors.border.primary,
    },

    success: {
      borderColor: theme.colors.border.primary,
    },

    warning: {
      borderColor: theme.colors.border.primary,
    },

    info: {
      borderColor: theme.colors.border.primary,
    },

    secondary: {
      borderColor: theme.colors.border.primary,
    },

    // Checked state styles
    primaryChecked: {
      backgroundColor: theme.colors.interactive.primary,
      borderColor: theme.colors.interactive.primary,
    },

    successChecked: {
      backgroundColor: theme.colors.status.success,
      borderColor: theme.colors.status.success,
    },

    warningChecked: {
      backgroundColor: theme.colors.status.warning,
      borderColor: theme.colors.status.warning,
    },

    infoChecked: {
      backgroundColor: theme.colors.status.info,
      borderColor: theme.colors.status.info,
    },

    secondaryChecked: {
      backgroundColor: theme.colors.text.secondary,
      borderColor: theme.colors.text.secondary,
    },

    // States
    indeterminate: {
      backgroundColor: theme.colors.interactive.primary,
      borderColor: theme.colors.interactive.primary,
    },

    error: {
      borderColor: theme.colors.border.error,
      borderWidth: theme.borderWidth.lg,
    },

    disabled: {
      backgroundColor: theme.colors.background.secondary,
      borderColor: theme.colors.border.primary,
      opacity: 0.6,
    },

    // Label styles
    labelContainer: {
      flex: 1,
      marginLeft: theme.spacing[3],
      justifyContent: 'center',
    },

    label: {
      ...theme.typography.body.base,
      color: theme.colors.text.primary,
      lineHeight: theme.typography.body.base.lineHeight,
    },

    smLabel: {
      ...theme.typography.body.sm,
    },

    mdLabel: {
      ...theme.typography.body.base,
    },

    lgLabel: {
      ...theme.typography.body.lg,
    },

    description: {
      ...theme.typography.caption.base,
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing[0.5],
    },

    required: {
      color: theme.colors.status.error,
      fontWeight: theme.fontConfig.fontWeight.bold,
    },

    labelError: {
      color: theme.colors.status.error,
    },

    labelDisabled: {
      color: theme.colors.text.disabled,
    },

    descriptionDisabled: {
      color: theme.colors.text.disabled,
    },

    // Error message
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing[1],
      paddingLeft: theme.spacing[6], // Align with checkbox + margin
    },

    errorText: {
      ...theme.typography.caption.base,
      color: theme.colors.status.error,
      marginLeft: theme.spacing[1],
    },
  })
);

export { CustomCheckBox };