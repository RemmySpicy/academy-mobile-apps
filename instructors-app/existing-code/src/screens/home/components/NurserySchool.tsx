import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

const NurserySchool = ({ studentII, setModalProfileVisible }: any) => {
  return (
    <View>
      {studentII.map(({ data, i }: any) => (
        <View
          key={Math.random() * studentII.length}
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
          <Pressable
            className="py-4 px-2 flex-1"
            onPress={() => setModalProfileVisible((visible: any) => !visible)}
          >
            <View className="flex flex-row justify-between items-center">
              <Text className="text-[16px]">Benson Showole</Text>
              <Text className="text-[#8F8F8F] text-[12px]">
                Level 2: Class 3
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex flex-row w-[85%]">
                <View className="bg-[#00DEA5] flex-1 h-2 rounded-l-full my-3" />
                <View className="bg-gray-300 w-[25%] h-2 rounded-r-full my-3" />
              </View>

              <Text className="text-[12px] text-[#444444]">30%</Text>
            </View>
            <View className="flex-row pb-2 justify-between items-center">
              <Text className="text-[10px]">Attended: 5</Text>
              <Text className="text-[10px]">Absence: 2</Text>
              <Text className="text-[10px]">Sessions: 1</Text>
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
                  Fully Paid
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
      ))}
    </View>
  );
};

export default NurserySchool;

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
