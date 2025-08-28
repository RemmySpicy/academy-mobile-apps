import React, { useState, useMemo, useCallback, useRef } from "react";
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
  
  /** Autocomplete hint for the system */
  autoComplete?: string;
  
  /** Text content type for autofill */
  textContentType?: string;
  
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
  secureTextEntry = false,
  showPasswordToggle = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = "default",
  autoCapitalize = 'none',
  autoComplete,
  textContentType,
  maxLength,
  editable = true,
  autoFocus = false,
  returnKeyType = "default",
  onSubmitEditing,
  onValueChange,
  disabled = false,
  required = false,
  error: propError,
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
  const inputRef = useRef<TextInput>(null);

  // Form integration or standalone state
  const formField = control && name ? useController({
    name,
    control,
    rules,
    defaultValue: defaultValue || "",
  }) : null;

  // Use form field values if available, otherwise use prop values
  const value = formField ? formField.field.value : propValue || "";
  const formError = formField?.fieldState.error;
  const error = formError || (propError ? { message: propError } : null);
  const invalid = formField?.fieldState.invalid || !!propError;

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

  const handleContainerPress = useCallback(() => {
    if (!disabled && editable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled, editable]);

  const togglePasswordVisibility = useCallback((event?: any) => {
    // Prevent event bubbling
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
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
        onPress={(event) => {
          event.stopPropagation(); // Prevent container press
          togglePasswordVisibility(event);
        }}
        style={({ pressed }) => [
          { opacity: pressed ? 0.8 : 1 }, 
          styles.iconButton
        ]}
        accessibilityRole="button"
        accessibilityLabel={isPasswordVisible ? "Hide password" : "Show password"}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
      <Pressable 
        onPress={handleContainerPress}
        style={[
          styles.inputContainer,
          ...getVariantStyles,
          getSizeStyles,
          style,
        ]}
        accessible={false} // Let the TextInput handle accessibility
      >
        {startIcon && (
          <View style={styles.leftIconContainer}>
            {startIcon}
          </View>
        )}

        <TextInput
          ref={inputRef}
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
          autoComplete={autoComplete as any}
          textContentType={textContentType as any}
          style={[
            styles.textInput,
            getSizeStyles,
            inputStyle,
            disabled && styles.textInputDisabled,
          ]}
          accessibilityLabel={accessibilityLabel || placeholder}
          accessibilityHint={accessibilityHint}
          accessibilityState={{
            disabled,
            selected: isFocused,
          }}
          testID={testID || name}
          pointerEvents={disabled ? 'none' : 'auto'}
        />

        {renderErrorIcon()}
        {renderPasswordToggle()}
        
        {endIcon && !showPasswordToggle && !invalid && (
          <View style={styles.rightIconContainer}>
            {endIcon}
          </View>
        )}
      </Pressable>

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

const useThemedStyles = createThemedStyles((theme) => StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    width: '100%',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  // Base input styles
  input: {
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.md,
    minHeight: 44,
  },

  inputFocused: {
    borderColor: theme.colors.interactive.primary,
    borderWidth: 1,
    ...themeUtils.createShadow('sm', theme.colors.interactive.primary),
  },

  inputError: {
    borderColor: theme.colors.status.error,
    borderWidth: 1,
    backgroundColor: theme.colors.status.errorBackground || `${theme.colors.status.error}08`,
    ...themeUtils.createShadow('sm', theme.colors.status.error),
  },

  inputDisabled: {
    backgroundColor: theme.colors.background.secondary,
    borderColor: theme.colors.border.primary,
    opacity: 0.6,
  },

  // Variant styles
  inputOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.border.secondary,
  },

  inputGhost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRadius: 0,
    borderBottomColor: theme.colors.border.primary,
  },

  inputPassword: {
    backgroundColor: theme.colors.background.secondary,
    borderColor: theme.colors.border.primary,
  },

  // Size styles
  sizeSmall: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    minHeight: 36,
  },

  sizeMedium: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    minHeight: 44,
  },

  sizeLarge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    minHeight: 52,
  },

  // Text input
  textInput: {
    flex: 1,
    fontSize: theme.fontSizes.base,
    fontWeight: theme.fontConfig.fontWeight.regular,
    color: theme.colors.text.primary,
    textAlignVertical: 'center',
    padding: 0, // Remove default padding to prevent touch issues
    margin: 0,  // Remove default margin to prevent touch issues
  },

  textInputDisabled: {
    color: theme.colors.text.disabled,
  },

  // Icon containers
  leftIconContainer: {
    flexDirection: 'column',
    marginLeft: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rightIconContainer: {
    flexDirection: 'column',
    marginLeft: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconButton: {
    flexDirection: 'column',
    marginLeft: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32,
    minHeight: 32,
  },

  errorIconContainer: {
    flexDirection: 'column',
    marginLeft: theme.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Error message
  errorContainer: {
    marginTop: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
  },

  errorText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.status.error,
  },

  // Required indicator
  requiredContainer: {
    position: 'absolute',
    top: -2,
    right: -2,
  },

  requiredText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.status.error,
    fontWeight: theme.fontConfig.fontWeight.bold,
  },
}));

export { CustomInput };