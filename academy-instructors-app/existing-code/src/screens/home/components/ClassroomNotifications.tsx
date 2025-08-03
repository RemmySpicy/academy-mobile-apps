import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const ClassroomNotifications = ({ setNotificationModal }: any) => {
  const { width, height } = Dimensions.get("window");
  return (
    <SafeAreaView className="bg-white px-4 py-2 h-full w-full">
      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => setNotificationModal(false)}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="mx-auto">
          <Text className="font-semibold text-lg">Notification</Text>
        </View>
      </View>

      <ScrollView>
        <View>
          <Text className="text-[#1E1E1E] font-semibold py-2">Unread</Text>
          <View className="my-3">
            <View className="flex-row justify-between">
              <View className="flex-row space-x-2">
                <View className="bg-[#D2D2D2] p-1 rounded-full">
                  <Ionicons
                    name="notifications"
                    className=""
                    size={14}
                    color="#00DEA5"
                  />
                </View>
                <Text className="text-[#1E1E1E] text-[16px] pb-1">
                  Reminder!
                </Text>
              </View>

              <View className="flex-row items-center space-x-2">
                <Text className="text-[#444444]">2 hrs ago</Text>
                <View className="w-2 h-2 bg-[#8A74DB] rounded-full"></View>
              </View>
            </View>
            <View className="">
              <Text
                className="text-[#8F8F8F] text-[11px]"
                style={{
                  paddingLeft: width * 0.08,
                }}
              >
                First Name Last Name has progressed to Swimming Club: Level 2
                Class 2 with Tutor First Name Last Name on DD/MM/YY.
              </Text>
              <View className="bg-[#EFEFEF] flex-row justify-end self-end w-fit rounded-full my-4 border border-[#D2D2D2] px-2 py-1">
                <Text className="text-[#6C51D2] text-[10px]">Mark as read</Text>
              </View>
            </View>
          </View>
          <View className="3">
            <View className="flex-row justify-between">
              <View className="flex-row space-x-2">
                <View className="bg-[#D2D2D2] p-1 rounded-full">
                  <Ionicons
                    name="notifications"
                    className=""
                    size={14}
                    color="#00DEA5"
                  />
                </View>
                <Text className="text-[#1E1E1E] text-[16px] pb-1">
                  Reminder!
                </Text>
              </View>

              <View className="flex-row items-center space-x-2">
                <Text className="text-[#444444]">Yesterday</Text>
                <View className="w-2 h-2 bg-[#8A74DB] rounded-full"></View>
              </View>
            </View>
            <View className="">
              <Text
                className="text-[#8F8F8F] text-[11px]"
                style={{
                  paddingLeft: width * 0.08,
                }}
              >
                First Name Last Name has progressed to Swimming Club: Level 2
                Class 2 with Tutor First Name Last Name on DD/MM/YY.
              </Text>
              <View className="bg-[#EFEFEF] flex-row justify-end self-end w-fit rounded-full my-4 border border-[#D2D2D2] px-2 py-1">
                <Text className="text-[#6C51D2] text-[10px]">Mark as read</Text>
              </View>
            </View>
          </View>
        </View>
        <View>
          <Text className="text-[#1E1E1E] font-semibold py-2">Read</Text>
          <View className="my-3">
            <View className="flex-row justify-between">
              <View className="flex-row space-x-2">
                <View className="bg-[#D2D2D2] p-1 rounded-full">
                  <Ionicons
                    name="notifications"
                    className=""
                    size={14}
                    color="#00DEA5"
                  />
                </View>
                <Text className="text-[#1E1E1E] text-[16px] pb-1">
                  Reminder!
                </Text>
              </View>

              <View className="flex-row items-center space-x-2">
                <Text className="text-[#444444]">2 hrs ago</Text>
                <View className="w-2 h-2 bg-[#8A74DB] rounded-full"></View>
              </View>
            </View>
            <View className="">
              <Text
                className="text-[#8F8F8F] text-[11px]"
                style={{
                  paddingLeft: width * 0.08,
                }}
              >
                First Name Last Name has progressed to Swimming Club: Level 2
                Class 2 with Tutor First Name Last Name on DD/MM/YY.
              </Text>
              <View className="bg-[#EFEFEF] flex-row justify-end self-end w-fit rounded-full my-4 border border-[#D2D2D2] px-2 py-1">
                <Text className="text-[#6C51D2] text-[10px]">
                  Mark as unread
                </Text>
              </View>
            </View>
          </View>
          <View className="3">
            <View className="flex-row justify-between">
              <View className="flex-row space-x-2">
                <View className="bg-[#D2D2D2] p-1 rounded-full">
                  <Ionicons
                    name="notifications"
                    className=""
                    size={14}
                    color="#00DEA5"
                  />
                </View>
                <Text className="text-[#1E1E1E] text-[16px] pb-1">
                  Reminder!
                </Text>
              </View>

              <View className="flex-row items-center space-x-2">
                <Text className="text-[#444444]">Yesterday</Text>
                <View className="w-2 h-2 bg-[#8A74DB] rounded-full"></View>
              </View>
            </View>
            <View className="">
              <Text
                className="text-[#8F8F8F] text-[11px]"
                style={{
                  paddingLeft: width * 0.08,
                }}
              >
                First Name Last Name has progressed to Swimming Club: Level 2
                Class 2 with Tutor First Name Last Name on DD/MM/YY.
              </Text>
              <View className="bg-[#EFEFEF] flex-row justify-end self-end w-fit rounded-full my-4 border border-[#D2D2D2] px-2 py-1">
                <Text className="text-[#6C51D2] text-[10px]">
                  Mark as unread
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClassroomNotifications;

const styles = StyleSheet.create({});
