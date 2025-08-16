import { Picker } from "@react-native-picker/picker";
import { Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import MetricPool from "./MetricPool";
import AntDesign from "@expo/vector-icons/AntDesign";

export const MetricPoolRender = ({
  courseActionMetrics,
}: {
  courseActionMetrics: [];
}) => {
  const actionMetrics = useMemo(() => {
    return courseActionMetrics?.flatMap((data) => data);
  }, [courseActionMetrics]);

  return (
    // <View
    //   style={{
    //     shadowColor: "black",
    //     shadowOpacity: 0.25,
    //     shadowRadius: 10,
    //     shadowOffset: { width: 0, height: 6 },
    //     elevation: 8,
    //   }}
    //   className="bg-[#EFEFEF] mt-6 mb-4 rounded-lg px-[13px] py-2"
    // >
    //   <Text className="font-semibold text-[17px] h-fit px-4 text-[#596367]">
    //     Metrics: Pool Name
    //   </Text>

    //   <View className="flex-row gap-4 px-4">
    //     {actionMetrics?.flatMap((metric: any, index: number) => (
    //       <View key={index}>
    //         <MetricPool
    //           poolName={metric?.skill}
    //           poolNumber={metric?.count}
    //           poolRate={`${metric?.swolf}%`}
    //         />
    //       </View>
    //     ))}
    //   </View>
    // </View>

    <View
      style={{
        shadowColor: "black",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
      }}
      className="bg-[#EFEFEF] mt-4 mb-2 rounded-lg px-[13px] py-2"
    >
      <Text className="font-semibold text-[17px] px-4 text-[#596367]">
        Metrics: Pool Name
      </Text>

      <View className="flex-row justify-between px-4">
        {actionMetrics?.flatMap((metric: any, index: number) => (
          <View key={index}>
            <MetricPool
              poolName={metric?.skill}
              poolNumber={metric?.count}
              poolRate={`${metric?.swolf}%`}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export const MetricsTime = ({
  courseTimeMetrics,
}: {
  courseTimeMetrics: [];
}) => {
  const timeMetrics = useMemo(() => {
    return courseTimeMetrics?.flatMap((data) => data);
  }, [courseTimeMetrics]);
  return (
    <View
      style={{
        shadowColor: "black",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
      }}
      className="bg-[#EFEFEF] mt-4 mb-2 rounded-lg px-[13px] py-2"
    >
      <Text className="font-semibold text-[17px] px-4 text-[#596367]">
        Best Times:
      </Text>

      <View className="flex-row justify-between px-4">
        {timeMetrics?.flatMap((metric: any, index: number) => (
          <View key={index}>
            <MetricPool
              poolName={metric?.skill}
              poolNumber={metric?.time}
              poolRate={`${metric?.improvement}%`}
            />
          </View>
        ))}

        {/* <View>
          <MetricPool
            poolName="Breaststroke: 25m"
            poolNumber="42:19"
            poolRate="-10%"
          />
        </View>
        <View>
          <MetricPool
            poolName="Backstroke: 25m"
            poolNumber="51:22"
            poolRate="10%"
          />
        </View> */}
      </View>
    </View>
  );
};

export const ScoreStatistics = () => {
  const [selectedDate, setSelectedDate] = useState("7 Days");

  return (
    <View
      style={{
        shadowColor: "black",
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 6 },
        elevation: 4,
      }}
      className="bg-[#EFEFEF] mt-8 mb-2 rounded-lg px-[3px] py-2 "
    >
      <View className="flex-row justify-between px-4">
        <View>
          <Text className="text-gray-600">Score Statistics</Text>
          <Text className="text-[12px] text-gray-400">weekly figures</Text>
        </View>

        <View
          className="bg-white rounded-xl my-0 py-0"
          style={{
            width: 120,
            overflow: "hidden",
            shadowOffset: { width: 0, height: 6 },
            elevation: 8,
          }}
        >
          <Picker
            selectedValue={selectedDate}
            // className="text-[12px]"
            style={{ height: 50, fontSize: 10 }}
            onValueChange={(itemValue, itemIndex) => setSelectedDate(itemValue)}
          >
            <Picker.Item
              label="7 Days"
              style={{ fontSize: 13 }}
              value="7 Days"
            />
            <Picker.Item
              label="30 Days"
              style={{ fontSize: 13 }}
              value="30 Days"
            />
            <Picker.Item
              label="60 Days"
              style={{ fontSize: 13 }}
              value="60 Days"
            />
          </Picker>
        </View>
      </View>
      <View className="flex-row px-4 justify-between mt-6 mb-3">
        <View className="justify-center bg-white rounded-lg p-2 w-[85px]">
          <Text className="text-center text-lg">4</Text>
          <Text className="text-center">Days</Text>
        </View>
        <View className="justify-center bg-[#C8F3CD] rounded-lg p-2 w-[85px]">
          <View className="flex-row space-x-1 items-center">
            <AntDesign name="arrowup" size={15} color="green" />
            <View>
              <Text className="text-green-700 text-[17px]">45%</Text>
              <Text className="text-green-700 text-[12px]">Progress</Text>
            </View>
          </View>
        </View>
        <View className="justify-center bg-[#FFE8E8] rounded-lg p-2 w-[85px]">
          <View className="flex-row space-x-1 items-center">
            <AntDesign name="arrowdown" size={15} color="red" />
            <View>
              <Text className="text-[17px] text-red-700">45%</Text>
              <Text className="text-[12px] text-red-700">Progress</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="flex-row space-x-[15px] px-2">
        <View className="mt-4 space-y-5">
          <Text className="text-gray-600">XO</Text>
          <Text className="text-[12px] text-gray-400">M</Text>
          <Text className="text-[12px] text-gray-400">U</Text>
          <Text className="text-[12px] text-gray-400">V</Text>
          <Text className="text-[12px] text-gray-400">Z</Text>
        </View>
        <View
          style={{
            shadowColor: "black",
            shadowOpacity: 0.25,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 8 },
            elevation: 8,
            height: 170,
            width: 5,
          }}
          className="bg-[#EFEFEF] mt-4 mb-2 rounded-lg px-[7px] pr-5 py-2"
        >
          <View className="bg-[#4F2EC9] mt-auto h-[80%] w-3 rounded-lg"></View>
        </View>

        <View
          style={{
            shadowColor: "black",
            shadowOpacity: 0.25,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 8 },
            elevation: 8,
            height: 170,
            width: 5,
          }}
          className="bg-[#EFEFEF] mt-4 mb-2 rounded-lg px-[7px] pr-5 py-2"
        >
          <View className="bg-[#4F2EC9] mt-auto h-[5%] w-3 rounded-lg"></View>
        </View>

        <View
          style={{
            shadowColor: "black",
            shadowOpacity: 0.25,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 8 },
            elevation: 8,
            height: 170,
            width: 5,
          }}
          className="bg-[#EFEFEF] mt-4 mb-2 rounded-lg px-[7px] pr-5 py-2"
        >
          <View className="bg-[#4F2EC9] mt-auto h-[70%] w-3 rounded-lg"></View>
        </View>

        <View
          style={{
            shadowColor: "black",
            shadowOpacity: 0.25,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 8 },
            elevation: 8,
            height: 170,
            width: 5,
          }}
          className="bg-[#EFEFEF] mt-4 mb-2 rounded-lg px-[7px] pr-5 py-2"
        >
          <View className="bg-[#4F2EC9] mt-auto h-[2%] w-3 rounded-lg"></View>
        </View>

        <View
          style={{
            shadowColor: "black",
            shadowOpacity: 0.25,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 8 },
            elevation: 8,
            height: 170,
            width: 5,
          }}
          className="bg-[#EFEFEF] mt-4 mb-2 rounded-lg px-[7px] pr-5 py-2"
        >
          <View className="bg-[#4F2EC9] mt-auto h-[90%] w-3 rounded-lg"></View>
        </View>
        <View
          style={{
            shadowColor: "black",
            shadowOpacity: 0.25,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 8 },
            elevation: 8,
            height: 170,
            width: 5,
          }}
          className="bg-[#EFEFEF] mt-4 mb-2 rounded-lg px-[7px] pr-5 py-2"
        >
          <View className="bg-[#4F2EC9] mt-auto h-[80%] w-3 rounded-lg"></View>
        </View>
        <View
          style={{
            shadowColor: "black",
            shadowOpacity: 0.25,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 8 },
            elevation: 8,
            height: 170,
            width: 5,
          }}
          className="bg-[#EFEFEF] mt-4 mb-2 rounded-lg px-[7px] pr-5 py-2"
        >
          <View className="bg-[#4F2EC9] mt-auto h-[5%] w-3 rounded-lg"></View>
        </View>
      </View>
      <View className="flex-row pb-2 pt-1">
        <Text className="text-[12px] pl-12 pr-6 text-gray-400">Sn</Text>
        <Text className="text-[12px] pr-7 text-gray-400">Mn</Text>
        <Text className="text-[12px] pr-7 text-gray-400">Te</Text>
        <Text className="text-[12px] pr-7 text-gray-400">Wd</Text>
        <Text className="text-[12px] pr-7 text-gray-400">Tr</Text>
        <Text className="text-[12px] pr-7 text-gray-400">Fr</Text>
        <Text className="text-[12px] pr-7 text-gray-400">Sa</Text>
      </View>
    </View>
  );
};
