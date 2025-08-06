import React, { useState, useMemo } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardTypeOptions, 
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Iconify } from "react-native-iconify";
import { useController, Control, FieldValues, RegisterOptions } from "react-hook-form";
import { FormFieldProps } from "../../types";
import { useTheme, createThemedStyles } from "../../theme/ThemeProvider";

type InputVariant = 'standard' | 'outline' | 'ghost' | 'password';
type InputSize = 'small' | 'medium' | 'large';

interface CustomInputProps extends Omit<FormFieldProps, 'control' | 'rules'> {
  control?: Control<FieldValues>;
  rules?: RegisterOptions;
  variant?: InputVariant;
  size?: InputSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  defaultValue?: string;
  editable?: boolean;
  autoFocus?: boolean;
  returnKeyType?: "done" | "go" | "next" | "search" | "send" | "default";
  onSubmitEditing?: () => void;
  onValueChange?: (value: string) => void;
  
  // Custom styling
  style?: ViewStyle;
  inputStyle?: TextStyle;
  containerStyle?: ViewStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  name,
  placeholder,
  control,
  variant = 'standard',
  size = 'medium',
  leftIcon,
  rightIcon,
  secureTextEntry = false,
  showPasswordToggle = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = "default",
  maxLength,
  defaultValue,
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

  const {
    field: { onChange, onBlur, value },
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
    rules,
    defaultValue: defaultValue || "",
  });

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

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur();
  };

  const handleChangeText = (text: string) => {
    onChange(text);
    onValueChange?.(text);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const renderPasswordToggle = () => {
    if (!showPasswordToggle || !secureTextEntry) return null;

    return (
      <TouchableOpacity
        onPress={togglePasswordVisibility}
        style={styles.iconButton}
        accessibilityRole="button"
        accessibilityLabel={isPasswordVisible ? "Hide password" : "Show password"}
      >
        <Iconify
          icon={isPasswordVisible ? "ri:eye-off-line" : "ri:eye-line"}
          size={20}
          color={theme.colors.text.tertiary}
        />
      </TouchableOpacity>
    );
  };

  const renderErrorIcon = () => {
    if (!invalid) return null;

    return (
      <View style={styles.errorIconContainer}>
        <Iconify
          icon="ri:error-warning-line"
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
        style
      ]}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
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
          testID={testID}
        />

        {renderErrorIcon()}
        {renderPasswordToggle()}
        
        {rightIcon && !showPasswordToggle && !invalid && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
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
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.md,
      minHeight: theme.safeArea.minTouchTarget.height,
    },

    inputFocused: {
      borderColor: theme.colors.border.focused,
      borderWidth: 2,
      ...theme.elevation.sm,
      shadowColor: theme.colors.interactive.primary,
    },

    inputError: {
      borderColor: theme.colors.border.error,
      borderWidth: 1,
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

export default CustomInput;