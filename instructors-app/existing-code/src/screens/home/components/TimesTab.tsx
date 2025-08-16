import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";

export default function TimesTab({
  timesTabs,
  activeTimesTab,
  handleTimesTabChange,
}: any) {
  return (
    <View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-row gap-4"
      >
        {timesTabs.map((tab: any, index: number) => (
          <Pressable
            key={index}
            onPress={() => handleTimesTabChange(tab)}
            className={`py-2 px-6 rounded-full ${
              activeTimesTab === tab
                ? "font-semibold bg-[#4F2EC9]"
                : "bg-[#E6EBEC]"
            }`}
          >
            <Text
              className={`${
                activeTimesTab === tab ? "text-white" : "text-[#596367]"
              } text-[10px]`}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View className="justify-center flex-1 mt-16 text-center items-center">
        <Image
          source={require("../../../../assets/empty.png")}
          alt="user"
          className=""
          style={{ width: 150, height: 150 }}
        />
        <View>
          <Text className="text-[21px] font-semibold text-center pt-2 pb-1 text-[#1E1E1E]">
            No Results Found
          </Text>
          <Text className="text-[#8F8F8F] text-center text-xs">
            We do not have any result for the keyword you searched.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
