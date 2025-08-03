import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/core";

const SuccessScreen = () => {
    const navigation = useNavigation<any>();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} className="px-4">
      <Image
        source={require("../../../assets/images/success.png")}
        style={{ width: 265, height: 168 }}
      />
      <Text className="font-se text-[30px] mt-5">
      Successful
      </Text>
      <Text className="text-center text-[#696969] mt-3">
      Your course has been booked successfully! Our team will reach out to you soon for further arrangements.
      </Text>
      <TouchableOpacity className="mt-10 flex-row ">
        <Text className="font-sr text-[17px] text-[#4F2EC9]">
        Set up your Schedules
        </Text>
        <Image
        source={require("../../../assets/images/arrow-right.png")}
        style={{ width: 24, height: 24 }}
        className="ml-10"
      />
      </TouchableOpacity>
      <TouchableOpacity className="mt-10 flex-row "  onPress={() => navigation.navigate("MyTab")}>
        <Text className="font-sr text-[17px] text-[#4F2EC9]">
        Proceed to Dashboard
        </Text>
        <Image
        source={require("../../../assets/images/arrow-right.png")}
        style={{ width: 24, height: 24 }}
        className="ml-10"
      />
      </TouchableOpacity>
    </View>
  );
};

export default SuccessScreen;