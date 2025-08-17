import React, { useState, useMemo, useCallback } from "react";
import { View, Text, TextInput, Pressable, KeyboardTypeOptions, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useController, Control, FieldValues, RegisterOptions } from "react-hook-form";
import { FormFieldProps } from "../../types";
import { useTheme, createThemedStyles } from "../../theme/ThemeProvider";
import { themeUtils } from "../../theme";


type InputVariant = 'standard' | 'outline' | 'ghost' | 'password';
type InputSize = 'small' | 'medium' | 'large';

/**
 * Props interface for CustomInput component
 * @interface CustomInputProps
 */
interface CustomInputProps extends Omit<FormFieldProps, 'control' | 'rules' | 'name'> {
  /** Form field name - optional for standalone usage (when not using with React Hook Form) */
  name?: string;
  
  /** React Hook Form control object */
  control?: Control<FieldValues>;
  
  /** React Hook Form validation rules */
  rules?: RegisterOptions;
  
  /** Visual variant of the input */
  variant?: InputVariant;
  
  /** Size of the input */
  size?: InputSize;
  
  // Core input props
  /** Current input value (for controlled usage) */
  value?: string;
  
  /** Default input value (for uncontrolled usage) */
  defaultValue?: string;
  
  /** Callback fired when the input text changes */
  onChangeText?: (text: string) => void;
  
  /** Callback fired when the input loses focus */
  onBlur?: () => void;
  
  // Icon props (standardized naming)
  /** Icon displayed at the start (left) of the input */
  startIcon?: React.ReactNode;
  
  /** Icon displayed at the end (right) of the input */
  endIcon?: React.ReactNode;
  
  /** Legacy: Icon displayed at the left of the input */
  leftIcon?: React.ReactNode;
  
  /** Legacy: Icon displayed at the right of the input */
  rightIcon?: React.ReactNode;
  
  // Input behavior
  /** Whether to obscure the text (for passwords) */
  secureTextEntry?: boolean;
  
  /** Whether to show a toggle button for password visibility */
  showPasswordToggle?: boolean;
  
  /** Whether the input accepts multiple lines */
  multiline?: boolean;
  
  /** Number of lines for multiline inputs */
  numberOfLines?: number;
  
  /** Keyboard type to display */
  keyboardType?: KeyboardTypeOptions;
  
  /** Auto-capitalization behavior */
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  
  /** Maximum number of characters allowed */
  maxLength?: number;
  
  /** Whether the input is editable */
  editable?: boolean;
  
  /** Whether to automatically focus the input */
  autoFocus?: boolean;
  
  /** Type of return key to display */
  returnKeyType?: "done" | "go" | "next" | "search" | "send" | "default";
  
  /** Callback fired when the return key is pressed */
  onSubmitEditing?: () => void;
  
  /** Additional callback fired when the input value changes */
  onValueChange?: (value: string) => void;
  
  // Custom styling
  /** Container style override */
  style?: ViewStyle;
  
  /** TextInput style override */
  inputStyle?: TextStyle;
  
  /** Outer container style override */
  containerStyle?: ViewStyle;
  
  // Accessibility
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  
  /** Accessibility hint providing additional context */
  accessibilityHint?: string;
  
  /** Test identifier for testing frameworks */
  testID?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  name,
  placeholder,
  control,
  variant = 'standard',
  size = 'medium',
  value: propValue,
  defaultValue,
  onChangeText: propOnChangeText,
  onBlur: propOnBlur,
  startIcon,
  endIcon,
  leftIcon,
  rightIcon,
  secureTextEntry = false,
  showPasswordToggle = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = "default",
  autoCapitalize = 'none',
  maxLength,
  editable = true,
  autoFocus = false,
  returnKeyType = "default",
  onSubmitEditing,
  onValueChange,
  disabled = false,
  required = false,
  rules,
  style,
  inputStyle,
  containerStyle,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  // Form integration or standalone state
  const formField = control && name ? useController({
    name,
    control,
    rules,
    defaultValue: defaultValue || "",
  }) : null;

  // Use form field values if available, otherwise use prop values
  const value = formField ? formField.field.value : propValue || "";
  const error = formField?.fieldState.error;
  const invalid = formField?.fieldState.invalid || false;

  const handleChangeText = useCallback((text: string) => {
    if (formField) {
      formField.field.onChange(text);
    }
    propOnChangeText?.(text);
    onValueChange?.(text);
  }, [formField, propOnChangeText, onValueChange]);

  const handleBlur = useCallback(() => {
    if (formField) {
      formField.field.onBlur();
    }
    propOnBlur?.();
    setIsFocused(false);
  }, [formField, propOnBlur]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible(prev => !prev);
  }, []);

  const styles = useThemedStyles();

  // Get variant-specific styles
  const getVariantStyles = useMemo(() => {
    const baseStyle = styles.input;
    const focusedStyle = isFocused ? styles.inputFocused : {};
    const errorStyle = invalid ? styles.inputError : {};
    const disabledStyle = disabled ? styles.inputDisabled : {};

    switch (variant) {
      case 'outline':
        return [baseStyle, styles.inputOutline, focusedStyle, errorStyle, disabledStyle];
      case 'ghost':
        return [baseStyle, styles.inputGhost, focusedStyle, errorStyle, disabledStyle];
      case 'password':
        return [baseStyle, styles.inputPassword, focusedStyle, errorStyle, disabledStyle];
      default:
        return [baseStyle, focusedStyle, errorStyle, disabledStyle];
    }
  }, [variant, isFocused, invalid, disabled, styles]);

  // Get size-specific styles
  const getSizeStyles = useMemo(() => {
    switch (size) {
      case 'small':
        return styles.sizeSmall;
      case 'large':
        return styles.sizeLarge;
      default:
        return styles.sizeMedium;
    }
  }, [size, styles]);

  const renderPasswordToggle = () => {
    if (!showPasswordToggle || !secureTextEntry) return null;

    return (
      <Pressable 
        onPress={togglePasswordVisibility}
        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, styles.iconButton]}
        accessibilityRole="button"
        accessibilityLabel={isPasswordVisible ? "Hide password" : "Show password"}
      >
        <Ionicons
          name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
          size={20}
          color={theme.colors.text.tertiary}
        />
      </Pressable>
    );
  };

  const renderErrorIcon = () => {
    if (!invalid) return null;

    return (
      <View style={styles.errorIconContainer}>
        <Ionicons
          name="warning-outline"
          size={16}
          color={theme.colors.status.error}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[
        styles.inputContainer,
        ...getVariantStyles,
        getSizeStyles,
        style,
      ]}>
        {(startIcon || leftIcon) && (
          <View style={styles.leftIconContainer}>
            {startIcon || leftIcon}
          </View>
        )}

        <TextInput
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.tertiary}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          maxLength={maxLength}
          editable={editable && !disabled}
          autoFocus={autoFocus}
          returnKeyType={returnKeyType}
          blurOnSubmit={!multiline}
          keyboardAppearance={theme.isDark ? 'dark' : 'light'}
          autoCorrect={false}
          autoCapitalize={autoCapitalize}
          style={[
            styles.textInput,
            getSizeStyles,
            inputStyle,
            disabled && styles.textInputDisabled,
            { pointerEvents: disabled ? 'none' : 'auto' },
          ]}
          accessibilityLabel={accessibilityLabel || placeholder}
          accessibilityHint={accessibilityHint}
          accessibilityState={{
            disabled,
            selected: isFocused,
          }}
          testID={testID || name}
        />

        {renderErrorIcon()}
        {renderPasswordToggle()}
        
        {(endIcon || rightIcon) && !showPasswordToggle && !invalid && (
          <View style={styles.rightIconContainer}>
            {endIcon || rightIcon}
          </View>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText} accessibilityRole="alert">
            {error.message}
          </Text>
        </View>
      )}

      {required && (
        <View style={styles.requiredContainer}>
          <Text style={styles.requiredText}>*</Text>
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

    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    // Base input styles
    input: {
      backgroundColor: theme.colors.background.primary,
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.md,
      minHeight: theme.safeArea.minTouchTarget.height,
    },

    inputFocused: {
      borderColor: theme.colors.border.focused,
      borderWidth: theme.borderWidth.md,
      ...themeUtils.createShadow('sm', theme.colors.interactive.primary),
    },

    inputError: {
      borderColor: theme.colors.border.error,
      borderWidth: theme.borderWidth.sm,
    },

    inputDisabled: {
      backgroundColor: theme.colors.background.secondary,
      borderColor: theme.colors.border.primary,
      opacity: 0.6,
    },

    // Variant styles
    inputOutline: {
      backgroundColor: 'transparent',
      borderWidth: theme.borderWidth.md,
      borderColor: theme.colors.border.secondary,
    },

    inputGhost: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderBottomWidth: theme.borderWidth.sm,
      borderRadius: 0,
      borderBottomColor: theme.colors.border.primary,
    },

    inputPassword: {
      backgroundColor: theme.colors.background.secondary,
      borderColor: theme.colors.border.primary,
    },

    // Size styles
    sizeSmall: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      minHeight: 36,
    },

    sizeMedium: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      minHeight: theme.safeArea.minTouchTarget.height,
    },

    sizeLarge: {
      paddingHorizontal: theme.spacing[5],
      paddingVertical: theme.spacing[4],
      minHeight: 52,
    },

    // Text input
    textInput: {
      flex: 1,
      ...theme.typography.body.base,
      color: theme.colors.text.primary,
      textAlignVertical: 'center',
    },

    textInputDisabled: {
      color: theme.colors.text.disabled,
    },

    // Icon containers
    leftIconContainer: {
      marginRight: theme.spacing[3],
      alignItems: 'center',
      justifyContent: 'center',
    },

    rightIconContainer: {
      marginLeft: theme.spacing[3],
      alignItems: 'center',
      justifyContent: 'center',
    },

    iconButton: {
      marginLeft: theme.spacing[3],
      padding: theme.spacing[1],
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: theme.safeArea.minTouchTarget.width,
      minHeight: theme.safeArea.minTouchTarget.height,
    },

    errorIconContainer: {
      marginLeft: theme.spacing[2],
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Error message
    errorContainer: {
      marginTop: theme.spacing[1],
      paddingHorizontal: theme.spacing[1],
    },

    errorText: {
      ...theme.typography.caption.base,
      color: theme.colors.status.error,
    },

    // Required indicator
    requiredContainer: {
      position: 'absolute',
      top: -2,
      right: -2,
    },

    requiredText: {
      ...theme.typography.caption.base,
      color: theme.colors.status.error,
      fontWeight: theme.fontConfig.fontWeight.bold,
    },
  })
);

export { CustomInput };