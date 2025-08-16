import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";

const SearchQuery = ({ searchQuery }: any) => {
  return (
    <>
      {searchQuery.map(({ data }: any, { index }: any) => (
        <ScrollView key={index}>
          <View
            style={styles.card}
            className="mx-6 flex-row justify-around items-center"
          >
            <View className="px-2">
              <Image
                source={require("../../../../assets/userEllipse.png")}
                alt="user"
                style={{ width: 50, height: 50 }}
              />
            </View>
            <View className="py-4 px-2 flex-1">
              <View className="flex flex-row justify-between items-center">
                <Text className="font-semibold text-[16px]">{data.name}</Text>
                <Text className="text-[#8F8F8F] text-[12px]">{data.level}</Text>
              </View>
              <View className="flex flex-row">
                <View className="bg-green-600 flex-1 h-2 rounded-l-full my-3"></View>
                <View className="bg-gray-300 w-[5%] h-2 rounded-r-full my-3"></View>
              </View>
              <View className="flex-row pb-2 justify-between items-center">
                <Text className="text-[10px]">Attended: {data.attended}</Text>
                <Text className="text-[10px]">Absence: {data.absence}</Text>
                <Text className="text-[10px]">Sessions: {data.remaining}</Text>
              </View>

              <View className="flex-row justify-between">
                <View
                  style={{ alignSelf: "flex-start" }}
                  className="bg-[#B4B4B4] px-2 py-1 rounded-[4px]"
                >
                  <Text className="text-[10px] text-center text-white">
                    School
                  </Text>
                </View>
                <View
                  style={{ alignSelf: "flex-start" }}
                  className="bg-[#34C759] px-2 py-1 rounded-[4px]"
                >
                  <Text className="text-[10px] text-center text-white">
                    {data.payment}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      ))}
    </>
  );
};

export default SearchQuery;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 4,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
});
