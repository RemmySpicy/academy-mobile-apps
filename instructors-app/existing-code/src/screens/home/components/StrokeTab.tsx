import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ScrollView } from "react-native-gesture-handler";

export default function StrokeTab({
  strokeTabs,
  handleStrokeTabChange,
  activeStrokeTab,
  setPerformanceTimes,
}: any) {
  return (
    <View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-row gap-4"
      >
        {strokeTabs.map((tab: any, index: number) => (
          <Pressable
            key={index}
            onPress={() => handleStrokeTabChange(tab)}
            className={`py-2 px-6 rounded-full ${
              activeStrokeTab === tab
                ? "font-semibold bg-[#4F2EC9]"
                : "bg-[#E6EBEC]"
            }`}
          >
            <Text
              className={`${
                activeStrokeTab === tab ? "text-white" : "text-[#596367]"
              } text-[10px]`}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View className="mb-4 my-6">
        <Pressable
          onPress={() => setPerformanceTimes((active: any) => !active)}
        >
          <View
            style={{ elevation: 1, shadowColor: "#000" }}
            className="flex flex-row items-center border-[1px] border-[#EFEFEF] rounded-lg p-2 shadow-lg bg-[#FEFEFE] justify-between"
          >
            <View className="flex-row gap-4 items-center">
              <View className="bg-[#EFEFEF] rounded-lg px-5 py-4">
                <Text className="text-sm text-[#444444]">17m</Text>
              </View>
              <View>
                <Text className="text-[21px]">00:26.30</Text>
                <Text className="text-[10px] font-semibold">+ 0.5%</Text>
                <Text className="text-[8px]">18 Dec 2025</Text>
              </View>
            </View>
            <AntDesign name="right" size={15} color="black" />
          </View>
        </Pressable>

        <Pressable
          onPress={() => setPerformanceTimes((active: any) => !active)}
        >
          <View
            style={{ elevation: 1, shadowColor: "#000" }}
            className="flex flex-row items-center my-4 border-[1px] border-[#EFEFEF] rounded-lg p-2 shadow-lg bg-[#FEFEFE] justify-between"
          >
            <View className="flex-row gap-4 items-center">
              <View className="bg-[#EFEFEF] rounded-lg px-5 py-4">
                <Text className="text-sm text-[#444444]">34m</Text>
              </View>
              <View>
                <Text className="text-[21px]">00:26.30</Text>
                <Text className="text-[10px] font-semibold">+ 0.5%</Text>
                <Text className="text-[8px]">18 Dec 2025</Text>
              </View>
            </View>
            <AntDesign name="right" size={15} color="black" />
          </View>
        </Pressable>

        <Pressable
          onPress={() => setPerformanceTimes((active: any) => !active)}
        >
          <View
            style={{ elevation: 1, shadowColor: "#000" }}
            className="flex flex-row items-center border-[1px] border-[#EFEFEF] rounded-lg p-2 shadow-lg bg-[#FEFEFE] justify-between"
          >
            <View className="flex-row gap-4 items-center">
              <View className="bg-[#EFEFEF] rounded-lg px-5 py-4">
                <Text className="text-sm text-[#444444]">51m</Text>
              </View>
              <View>
                <Text className="text-[21px]">00:26.30</Text>
                <Text className="text-[10px] font-semibold">+ 0.5%</Text>
                <Text className="text-[8px]">18 Dec 2025</Text>
              </View>
            </View>
            <AntDesign name="right" size={15} color="black" />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
