import React, { useState, useRef, useCallback } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useController } from "react-hook-form";
import { Iconify } from "react-native-iconify";
import { FormFieldProps } from "../../types";

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
        accessibilityLabel="Hidden OTP input"
      />

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
    alignItems: 'center',
    marginBottom: 16,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 300,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
  },
  focusedBox: {
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filledBox: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  errorBox: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  disabledBox: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  otpText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  secureText: {
    fontSize: 24,
    lineHeight: 32,
  },
  disabledText: {
    color: '#9CA3AF',
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
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginLeft: 6,
    fontWeight: '400',
  },
});

export default React.memo(OtpField);