import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const HeaderComponent = ({ screenTitle }: any) => {
  return (
    <View className={`flex-row flex items-center my-4 mx-2 justify-between`}>
      <Text className="text-[22px] font-semibold">{screenTitle}</Text>
      <Image
        source={require("../../../../../assets/userEllipse.png")}
        alt="user"
        className="w-[47px] h-[47px]"
      />
    </View>
  );
};

const styles = StyleSheet.create({});

interface headerWithNot {
  bell: Boolean;
}
const HeaderWithNotification = ({
  screenTitle2,
  notificationHandler,
  handleBack,
  bell,
}: any) => {
  return (
    <View className={`flex-row flex items-center my-4 mx-2 justify-between`}>
      <TouchableOpacity onPress={handleBack}>
        <Ionicons name="arrow-back" size={20} />
      </TouchableOpacity>

      <Text className="text-[22px] font-semibold">{screenTitle2}</Text>

      {bell && (
        <TouchableOpacity onPress={() => notificationHandler(true)}>
          <Ionicons name="notifications-outline" size={20} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export { HeaderComponent, HeaderWithNotification };
