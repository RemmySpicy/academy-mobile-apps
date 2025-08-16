import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
interface Props {
  title?: string;
  rating?: string;
  starRating?: string;
  heading: string;
  starClass?: string;
  starClass1?: string;
  starClass2?: string;
  iconName1?: string;
  iconName2?: string;
  iconName3?: string;
  iconColor1?: string;
  iconColor2?: string;
  iconColor3?: string;
  marginBottom?: string;
}
export default function Stations({
  title,
  rating,
  heading,
  starRating,
  iconName1,
  iconName2,
  iconName3,
  iconColor1,
  iconColor2,
  iconColor3,
  marginBottom,
}: Props) {
  return (
    <View className="px-2">
      <View className="flex-row py-1 px-4 justify-between">
        <Text className="text-sm text-[#596367]">{title}</Text>
        <View className="flex-row items-center gap-1">
          <MaterialIcons name="star" size={19} color={starRating || "white"} />
          <Text>{rating}</Text>
        </View>
      </View>
      <View style={styles.card} className={`space-y-1 mb-${marginBottom}`}>
        <Text className="font-semibold pt-2 px-1 text-[15px] ">{heading}</Text>
        <View className="flex-row gap-1 items-center">
          <MaterialIcons name={iconName1} size={19} color={iconColor1} />
          <MaterialIcons name={iconName2} size={19} color={iconColor2} />
          <MaterialIcons name={iconName3} size={19} color={iconColor3} />
        </View>
      </View>
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
