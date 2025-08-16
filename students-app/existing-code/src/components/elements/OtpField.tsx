import { View, TextInput, Pressable, Text } from "react-native";
import React, { useState, useRef } from "react";
import { useController } from "react-hook-form";
import { styles } from "../../helper/globalStyle";
import { colors } from "../../helper/helpers";
import ErrorMessage from "../form/errorMessage";

interface Props {
  name: string;
  control: any;
  maximumLength: number;
  placeholder?: string;
  className?: string;
  setIsPinReady?: (value: boolean) => void;
}

const OtpField = ({
  name,
  control,
  maximumLength,
  placeholder,
  className,
  setIsPinReady,
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [otpValue, setOtpValue] = useState("");

  const textInputRef = useRef<TextInput | null>(null);

  const { field, fieldState } = useController({
    name, // The name prop is passed here for form control binding
    control,
  });

  const handleOtpChange = (text: string) => {
    field.onChange(text); // Updating the form value with the entered OTP
    setOtpValue(text); // Sync local OTP state
    if (text.length === maximumLength && setIsPinReady) {
      setIsPinReady(true); // Notify when the OTP is fully entered
    } else {
      setIsPinReady && setIsPinReady(false);
    }
  };

  // Generate an array to represent the OTP boxes
  const boxArray = new Array(maximumLength).fill(0);

  // Render each box as a placeholder for OTP digits
  const boxDigit = (_: number, index: number) => {
    const digit = otpValue[index] || ""; // Show the digit or empty if not yet entered
    const focused = isFocused && otpValue.length === index;

    return (
      <View
        ref={textInputRef}
        className={`${
          focused ? "border-[#FF8108]" : "border-gray-300"
        } border w-16 h-16 rounded-lg flex items-center justify-center`}
        key={index}
      >
        <Text className="font-sr text-lg">{digit}</Text>
      </View>
    );
    
  };

  const handleOnPress = () => {
    // Focus on the TextInput when the box area is pressed
    setIsFocused(true);
    textInputRef.current?.focus(); // Ensure the TextInput is focused
  };

  return (
    <View className="justify-center items-center justify-between">
      <Pressable onPress={handleOnPress} className="flex-row w-full justify-between">
        {boxArray.map(boxDigit)}
      </Pressable>

      <TextInput
        ref={textInputRef}
        style={{ opacity: 0, position: "absolute" }} // Hide the actual TextInput
        placeholder={placeholder}
        keyboardType="number-pad"
        maxLength={maximumLength}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={className}
        onChangeText={handleOtpChange} // Binding OTP input with form control
        value={field.value} // Syncing input value from form state
        placeholderTextColor={colors.label}
      />

      {fieldState.error && <ErrorMessage message={fieldState.error.message} />}
    </View>
  );
};

export default OtpField;
