import { View, Text, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

import React from "react";
import { showItem } from "../../../redux/utils";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { useAuth } from "../../../auth/AuthContext";
import { useNavigation } from '@react-navigation/native';


export const ProfileSettings = () => {
  const { logOut } = useAuth();
  const navigation = useNavigation<any>()

  const handleLogout = async () => {
    await logOut!();
    navigation.navigate('SignInScreen');
  };

  return (
    <View className="m-4">
      <View className="flex-row gap-2 items-center">
        <Image
          source={require("../../../../assets/user-square.png")}
          className="w-[32px] h-[32px]"
        />
        <Text className="text-[18px]">Profile Information</Text>
      </View>

      <View className="p-4 space-y-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-[#596367]">Profile Information</Text>
          <AntDesign name="right" size={20} color="#adafb0" />
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-[#596367]">Account Settings</Text>
          <AntDesign name="right" size={20} color="#adafb0" />
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-[#596367]">Change Password</Text>
          <AntDesign name="right" size={20} color="#adafb0" />
        </View>
        <TouchableOpacity onPress={handleLogout} className="flex-row justify-between items-center">
          <Text className="text-red-500">Logout</Text>
          <AntDesign name="logout" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const NotificationSettings = () => {
  return (
    <View className="mx-4">
      <View className="flex-row gap-2 items-center">
        <Ionicons name="notifications-outline" size={30} color="black" />
        <Text className="text-[18px]">Notification</Text>
      </View>

      <View className="p-4 space-y-2">
        <View className="flex-row justify-between items-center">
          <Text className="text-[#596367]">Notification</Text>
          <Entypo name="switch" size={30} color="#adafb0" />
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-[#596367]">App notification</Text>
          <Entypo name="switch" size={30} color="#4F2EC9" />
        </View>
      </View>
    </View>
  );
};

export const SessionManagement = () => {
  return (
    <View className="mx-4 my-4">
      <View className="flex-row gap-2 items-center">
        <Image
          source={require("../../../../assets/clipboard.png")}
          className="w-[32px] h-[32px] "
        />
        <Text className="text-[18px]">Session Management</Text>
      </View>

      <View className="p-4 space-y-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-[#596367]">Sessions History</Text>
          <AntDesign name="right" size={20} color="#adafb0" />
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-[#596367]">Booking Management</Text>
          <AntDesign name="right" size={20} color="#adafb0" />
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-[#596367]">Payment Information</Text>
          <AntDesign name="right" size={20} color="#adafb0" />
        </View>
      </View>
    </View>
  );
};
export const PreferenceSupport = () => {
  const dispatch = useAppDispatch();
  const { show } = useAppSelector((state) => state.utils);
  return (
    <View className="mx-4">
      <View className="flex-row gap-2 items-center">
        <Image
          source={require("../../../../assets/like-tag.png")}
          className="w-[32px] h-[32px]"
        />
        <Text className="text-[18px]">Preferences and Support</Text>
      </View>

      <View className="p-4 space-y-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-[#596367]">Preferences</Text>
          <AntDesign name="right" size={20} color="#adafb0" />
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-[#596367]">Help and Support</Text>
          <AntDesign name="right" size={20} color="#adafb0" />
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-[#596367]">Privacy Settings</Text>
          <AntDesign name="right" size={20} color="#adafb0" />
        </View>
       
      </View>
  
    </View>
  );
};
