import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  poolName: string;
  poolNumber: string;
  poolRate: string;
  className?: string;
  textClassName?: string;
}
export default function MetricPool({
  poolName,
  poolNumber,
  poolRate,
  className,
  textClassName,
}: Props) {
  return (
    <View>
      <View
        className={`rounded-lg w-[90px] my-3 bg-white h-[100px] flex justify-around shadow-inner shadow-black items-center space-y-1 border border-gray-400 ${className}`}
      >
        <Text
          className={`py-1 text-[10px] text-gray-500 text-center ${textClassName}`}
        >
          {poolName}
        </Text>
        <Text className="font-bold text-[16px]">{poolNumber}</Text>

        <Text
          className={`${
            poolRate.includes("-") ? "text-red-600" : "text-green-600"
          }  font-semibold my-1 text-sm`}
        >
          {poolRate}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
