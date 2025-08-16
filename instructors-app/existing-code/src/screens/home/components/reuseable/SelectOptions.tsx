import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const SelectOptions = ({ title, options }: any) => {
  const [selectedOption, setSelectedOption] = useState(options?.[0] || "");
  return (
    <View className="rounded-lg border border-gray-300 my-2 p-3">
      <Text className="text-[14px] font-semibold mb-2">{title}</Text>
      <View className="flex-wrap flex-row justify-between">
        {options?.map((select: string) => (
          <Pressable
            key={select}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[
              {
                width: "48%",
                paddingVertical: 11,
                marginVertical: 8,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: selectedOption === select ? 0 : 1,
                borderColor: "gray",
                backgroundColor: selectedOption === select ? "black" : "white",
              },
            ]}
            onTouchStart={() => setSelectedOption(select)}
          >
            <Text
              className="text-[14px]"
              style={{ color: selectedOption === select ? "white" : "black" }}
            >
              {select}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default SelectOptions;

const styles = StyleSheet.create({});
