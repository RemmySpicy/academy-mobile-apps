import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function StationProgress({ station }: any) {
  console.log(station);
  return (
    <View className="px-2">
      {station.lessons?.map((lesson: any, index: number) => (
        <View className="flex-row py-1 px-4 justify-between">
          <Text className="text-sm text-[#596367]" key={index}>
            {lesson.description}
          </Text>

          <View className="flex-row items-center gap-1">
            {/* <MaterialIcons name="star" size={19} color="yellow" /> */}
            <Text>{lesson.achievable_stars}⭐</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    // marginTop: 12,
    margin: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
});
