import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, KeyboardTypeOptions } from "react-native";
import { Iconify } from "react-native-iconify";
import { clsx } from "clsx";
import { useController } from "react-hook-form";
import ErrorMessage from "./errorMessage";
import { colors } from "../../helper/helpers";
import { styles } from "../../helper/globalStyle";

interface Props {
  name: string;
  placeholder: string;
  control?: any;
  label?: string;
  icon?: React.ReactNode;
  secureTextEntry?: boolean;
  handleShowPassword?: () => void;
  multiline?: boolean;
  className?: string;
  numberOfLines?: number;
  keyboardType?: KeyboardTypeOptions;
  handleOnChange?: (value: string | number) => void;
  maxLength?: number;
  defaultValue?: string;
  editable?: boolean;
  placeholderTextColor?: string;
}

const CustomInput = ({
  name,
  placeholder,
  control,
  handleOnChange,
  icon,
  secureTextEntry,
  handleShowPassword,
  multiline = false,
  className,
  numberOfLines,
  keyboardType = "default",
  maxLength,
  defaultValue,
  editable = true,
}: Props) => {
  const [isFocused, setIsFocused] = useState("");

  const { field, fieldState } = useController({
    name,
    control,
    defaultValue: defaultValue || "",
  });

  const handleChangeText = (text: string | number) => {
    field.onChange(text);
    if (handleOnChange) {
      handleOnChange(text);
    }
  };

  return (
    <View className="space-y-2">
      <View className="flex-row items-center w-full">
        <TextInput
          secureTextEntry={secureTextEntry}
          style={[
            styles.input,
            isFocused === name ? styles.inputFocused : null,
          ]}
          onFocus={() => setIsFocused(name)}
          onBlur={() => setIsFocused("")}
          placeholder={placeholder}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          className={clsx(
            "text-sm border h-12 rounded-lg px-4 pb-1 font-sr flex-1",
            className
          )}
          placeholderTextColor={colors.label}
          maxLength={maxLength}
          onChangeText={handleChangeText}
          value={field.value}
          editable={editable}
        />

        {icon && (
          <View className="absolute right-3 mt-1 text-gray-400">{icon}</View>
        )}

        {handleShowPassword && (
          <View className="absolute right-3 mt-1">
            <TouchableOpacity onPress={handleShowPassword}>
              {secureTextEntry ? (
                <Iconify icon="ri:eye-off-line" size={20} color="gray" />
              ) : (
                <Iconify icon="ri:eye-line" size={20} color="gray" />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View>
        {fieldState.error && (
          <ErrorMessage message={fieldState.error.message} />
        )}
      </View>
    </View>
  );
};

export default CustomInput;
