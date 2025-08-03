import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { FC, memo, useState } from "react";
import { Iconify } from "react-native-iconify";
import { colors } from "../../helper/helpers";
import Modal from "react-native-modal";
import { useController } from "react-hook-form";
import ErrorMessage from "./errorMessage";
import { styles } from "../../helper/globalStyle";

interface Props {
  name: string;
  control: any;
  options: { label: string | number; value: string | number }[];
  onValueChange?: (value: any) => void; // Updated to onValueChange
  defaultValue?: string | number;
  placeholder: string;
}

const CustomDropDownSelect: FC<Props> = ({
  name,
  control,
  options,
  onValueChange, // Updated to onValueChange
  defaultValue,
  placeholder,
}) => {
  const [value, setValue] = useState<string | number>(defaultValue || "");

  const { field, fieldState } = useController({
    name,
    control,
  });

  const [isFocused, setIsFocused] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const handleSelect = (selectedOption: {
    value: string | number;
    label: string | number;
  }) => {
    field.onChange(selectedOption.value);
    setValue(selectedOption.label);
    if (onValueChange) {
      onValueChange(selectedOption.value); // Use onValueChange instead of handleOnChange
    }
    handleHide();
  };

  const handleShow = () => {
    setIsVisible(true);
    setIsFocused(name);
  };

  const handleHide = () => {
    setIsVisible(false);
    setIsFocused("");
  };

  return (
    <View className="space-y-1.5">
      <TouchableOpacity
        onPress={handleShow}
        className={`border border-input-border-gray rounded-lg h-12 px-3 font-sr justify-between flex-row items-center ${
          isFocused === name ? styles.inputFocused : null
        }`}
      >
        <Text className={`font-sr ${!value && "text-gray-400 capitalize"}`}>
          {value || placeholder}
        </Text>
        <Iconify
          icon="iconamoon:arrow-down-2-duotone"
          size={20}
          color={colors.label}
        />
      </TouchableOpacity>

      <Modal
        isVisible={isVisible}
        onBackdropPress={handleHide}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={{ margin: 0, bottom: 0 }}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating={true}
      >
        <View className="w-full bg-white bottom-0 absolute rounded-t-2xl px-4 py-6 max-h-[50vh] space-y-4">
          <Text className="font-sm">Select Option</Text>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="h-2" />}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                className="h-12 bg-gray-bg rounded-lg px-3 justify-center items-center"
              >
                <Text className="font-sr text-xs">{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      <View>
        {fieldState.error && (
          <ErrorMessage message={fieldState.error.message} />
        )}
      </View>
    </View>
  );
};

export default memo(CustomDropDownSelect);
