import React, { useState, useRef, useCallback } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useController } from "react-hook-form";
import { Ionicons } from '@expo/vector-icons';
import { FormFieldProps } from "../../types";
import { useTheme, createThemedStyles } from "../../theme/ThemeProvider";
import { themeUtils } from "../../theme";

interface OtpFieldProps extends FormFieldProps {
  length?: number;
  onComplete?: (otp: string) => void;
  autoFocus?: boolean;
  secureTextEntry?: boolean;
  cellStyle?: object;
  focusedCellStyle?: object;
  filledCellStyle?: object;
}

const OtpField: React.FC<OtpFieldProps> = ({
  name,
  control,
  length = 6,
  placeholder,
  onComplete,
  autoFocus = true,
  secureTextEntry = false,
  disabled = false,
  required = false,
  cellStyle,
  focusedCellStyle,
  filledCellStyle,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const [isFocused, setIsFocused] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const textInputRef = useRef<TextInput | null>(null);

  const { field, fieldState } = useController({
    name,
    control,
    defaultValue: "",
  });

  const handleOtpChange = useCallback((text: string) => {
    // Remove any non-numeric characters and limit to specified length
    const numericText = text.replace(/[^0-9]/g, '').slice(0, length);
    
    field.onChange(numericText);
    setOtpValue(numericText);
    
    // Call onComplete when OTP is fully entered
    if (numericText.length === length && onComplete) {
      onComplete(numericText);
    }
  }, [field, length, onComplete]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handlePress = useCallback(() => {
    if (!disabled) {
      textInputRef.current?.focus();
    }
  }, [disabled]);

  // Generate an array to represent the OTP boxes
  const boxArray = new Array(length).fill(0);

  // Render each box as a placeholder for OTP digits
  const renderBox = useCallback((_: number, index: number) => {
    const digit = otpValue[index] || "";
    const isFocusedBox = isFocused && otpValue.length === index;
    const isFilledBox = digit !== "";

    return (
      <View
        key={index}
        style={[
          styles.otpBox,
          cellStyle,
          isFocusedBox && styles.focusedBox,
          isFocusedBox && focusedCellStyle,
          isFilledBox && styles.filledBox,
          isFilledBox && filledCellStyle,
          fieldState.error && styles.errorBox,
          disabled && styles.disabledBox,
        ]}
      >
        <Text style={[
          styles.otpText,
          secureTextEntry && digit && styles.secureText,
          disabled && styles.disabledText,
        ]}>
          {secureTextEntry && digit ? "•" : digit}
        </Text>
      </View>
    );
  }, [
    otpValue, 
    isFocused, 
    fieldState.error, 
    disabled, 
    secureTextEntry,
    cellStyle,
    focusedCellStyle,
    filledCellStyle
  ]);

  return (
    <View style={styles.container}>
      <Pressable 
        onPress={handlePress} 
        style={styles.otpContainer}
        disabled={disabled}
        accessibilityLabel={`OTP input field with ${length} digits`}
        accessibilityHint="Enter your one-time password"
        accessibilityRole="none"
      >
        {boxArray.map(renderBox)}
      </Pressable>

      <TextInput
        ref={textInputRef}
        style={styles.hiddenInput}
        placeholder={placeholder}
        keyboardType="number-pad"
        maxLength={length}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChangeText={handleOtpChange}
        value={field.value}
        autoFocus={autoFocus}
        editable={!disabled}
        selectTextOnFocus
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        autoCorrect={false}
        autoCapitalize="none"
        blurOnSubmit={false}
        accessibilityLabel="Hidden OTP input"
      />

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
      alignItems: 'center',
      marginBottom: theme.componentSpacing.form.fieldGap,
    },
    otpContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      maxWidth: 300,
    },
    otpBox: {
      width: theme.safeArea.minTouchTarget.width,
      height: 56,
      borderWidth: 2,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background.primary,
      marginHorizontal: theme.spacing[1],
    },
    focusedBox: {
      borderColor: theme.colors.border.focused,
      ...themeUtils.createShadow('sm', theme.colors.interactive.primary),
    },
    filledBox: {
      borderColor: theme.colors.status.success,
      backgroundColor: theme.colors.status.successBackground,
    },
    errorBox: {
      borderColor: theme.colors.border.error,
      backgroundColor: theme.colors.status.errorBackground,
    },
    disabledBox: {
      backgroundColor: theme.colors.background.secondary,
      borderColor: theme.colors.border.primary,
      opacity: 0.6,
    },
    otpText: {
      fontSize: theme.typography.heading.h5.fontSize,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      textAlign: 'center',
    },
    secureText: {
      fontSize: theme.typography.heading.h4.fontSize,
      lineHeight: 32,
    },
    disabledText: {
      color: theme.colors.text.disabled,
    },
    hiddenInput: {
      position: 'absolute',
      opacity: 0,
      width: 1,
      height: 1,
      zIndex: -1,
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing[2],
      paddingHorizontal: theme.spacing[1],
    },
    errorText: {
      ...theme.typography.caption.base,
      color: theme.colors.status.error,
      marginLeft: theme.spacing[1],
    },
  })
);

const MemoizedOtpField = React.memo(OtpField);
export { MemoizedOtpField as OtpField };