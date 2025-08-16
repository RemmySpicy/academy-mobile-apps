import React from "react";
import { PixelRatio, Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type QuickFilterItem = {
  label: string;
  count: number;
};
const QuickFilter = ({ quickFilter, filterName }: any) => {
  return (
    <View className="mt-4">
      <Text
        style={{
          fontSize: PixelRatio.getFontScale() * 12,
          color: "#1E1E1E",
        }}
      >
        {filterName}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 6 }}
        className="flex-row space-x-4"
      >
        {quickFilter?.map((item: QuickFilterItem, index: number) => (
          <Pressable
            key={index}
            className="items-center flex-row py-0.5 px-2 rounded-full border border-[#DCD5F4]"
            style={{
              backgroundColor: index === 0 ? "#DCD5F4" : "transparent",
              // marginRight: 2,
            }}
          >
            <Text
              className="text-center"
              style={{
                fontSize: PixelRatio.getFontScale() * 10,
                color: "#696969",
              }}
            >
              {item.label}
            </Text>
            <Text style={{ color: "#4F2EC9", fontWeight: "bold" }}>
              {item.count}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default QuickFilter;

const styles = StyleSheet.create({});
