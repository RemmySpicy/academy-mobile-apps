import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import StrokeTab from "./StrokeTab";
import TimesTab from "./TimesTab";

const Performance = ({
  openPerformance,
  setOpenPerformance,
  activeTab,
  handleTabChange,
  timesTabs,
  strokeTabs,
  setPerformanceTimes,
  activeStrokeTab,
  handleStrokeTabChange,
  handleTimesTabChange,
  activeTimesTab,
}: any) => {
  return (
    <ScrollView className="flex-1 bg-white pt-2 px-6">
      {/* <View className="flex-row gap-24 items-center py-2"> */}
      <View className="flex-row justify-center items-center py-2">
        {/* <Pressable onPress={() => setOpenPerformance(false)} className="">
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable> */}

        <Text className="text-[20px] font-semibold">Performance</Text>
      </View>

      <View className="bg-[#efefef] rounded-[20px] px-4 pb-4 my-4">
        <View className="py-2 flex-row items-center justify-between">
          <Text>Oluwaseun Darasimi</Text>
          <View className="rounded-full bg-white p-2">
            <Feather name="users" size={18} color="black" />
          </View>
        </View>

        <View>
          <Text className="text-[10px] text-[#696969]">Metric View</Text>
          <View className="flex-row bg-[#FAFAFA] items-center w-fit justify-center rounded-full mt-2 mb-4">
            <Pressable
              onPress={() => handleTabChange("Times")}
              className={`${
                activeTab === "Times" ? "bg-black" : "bg-[#FAFAFA]"
              } rounded-full p-1 w-[50%]`}
            >
              <Text
                className={`${
                  activeTab === "Times" && "text-white"
                } text-[12px] text-center`}
              >
                Times
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleTabChange("Stroke")}
              className={`
                      ${activeTab === "Stroke" ? "bg-black" : "bg-[#FAFAFA]"}
                      w-[50%] rounded-full p-1`}
            >
              <Text
                className={`
                      ${activeTab === "Stroke" && "text-white"}
                      text-center text-[12px]`}
              >
                Stroke
              </Text>
            </Pressable>
          </View>
        </View>

        <View>
          <Text className="text-[10px] text-[#696969]">Pool Size</Text>
          <View className="flex-row items-center space-x-2 pt-2">
            <View className="p-2 rounded-full bg-[#DCD5F4]">
              <View className="flex-row space-x-2 items-center">
                <Text className="text-center text-[#696969] text-[10px]">
                  My Location:
                </Text>
                <Text className="text-xs text-[#8A74DB] font-semibold">
                  17m
                </Text>
              </View>
            </View>
            <View className="border border-[#DCD5F4] rounded-full py-1 px-2">
              <Text className="text-xs font-semibold text-[#8A74DB]">25m</Text>
            </View>
            <View className="border border-[#DCD5F4] rounded-full py-1 px-2">
              <Text className="text-xs font-semibold text-[#8A74DB]">50m</Text>
            </View>
          </View>
        </View>
      </View>

      {activeTab === "Stroke" ? (
        <StrokeTab
          strokeTabs={strokeTabs}
          handleStrokeTabChange={handleStrokeTabChange}
          activeStrokeTab={activeStrokeTab}
          setPerformanceTimes={setPerformanceTimes}
        />
      ) : (
        <TimesTab
          timesTabs={timesTabs}
          activeTimesTab={activeTimesTab}
          handleTimesTabChange={handleTimesTabChange}
        />
      )}
    </ScrollView>
  );
};

export default Performance;

const styles = StyleSheet.create({});
