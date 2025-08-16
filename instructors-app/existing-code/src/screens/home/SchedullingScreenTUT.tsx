import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ScheduleInput from "./components/ScheduleInput";
import Schedules from "./components/Schedules";
import ScheduleType from "./components/ScheduleType";

const { width, height } = Dimensions.get("window");

const SchedullingScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleSheetChanges = useCallback(
    (index: number) => {
      Animated.timing(fadeAnim, {
        toValue: index === -1 ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
    [fadeAnim]
  );
  const handleBottomNav = () => {
    bottomSheetRef.current?.expand();
  };

  return (
    <View className="mt-10 mb-4 flex-1">
      <Schedules setModalVisible={setModalVisible} />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-row bg-white items-center px-6 py-2 justify-between">
          <Text className="text-[22px] font-semibold">Schedules</Text>
          <Image
            source={require("../../../assets/userEllipse.png")}
            alt="user"
          />
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          className="flex-1 bg-white pt-2 px-6"
        >
          <ScheduleInput />

          {/* Session Type ===> */}
          <ScheduleType />

          {/* lesson instructor */}
          <View className="py-2">
            <View className="px-4 py-2 border mb-4 border-[#efefef] rounded-lg">
              <Text className="text-[#696969] py-2 border-b border-[#efefef]">
                Lesson Instructors
              </Text>
              <Pressable
                // onTouchStart={handleBottomNav}
                className="flex-row items-center space-x-3 mt-4"
              >
                <Image
                  source={require("../../../assets/addUser.png")}
                  alt="user"
                />
                <Text className="text-xs text-[#696969]">
                  Add/Remove Participants
                </Text>
              </Pressable>
            </View>
            <View className="px-4 py-2 border border-[#efefef] rounded-lg">
              <Text className="text-[#696969] py-2 border-b border-[#efefef]">
                Participants
              </Text>
              <Pressable
                // onPress={handleBottomNav}
                className="flex-row items-center space-x-3 mt-4"
              >
                <Image
                  source={require("../../../assets/addUser.png")}
                  alt="user"
                />
                <Text className="text-xs text-[#696969]">
                  Add/Remove Participants
                </Text>
              </Pressable>
            </View>
          </View>

          {/* cancle and create button */}
          <View className="flex flex-row mb-2 space-x-4 justify-between">
            <Pressable
              className="border border-[#4F2EC9] p-3 w-[45%] rounded-full my-4"
              onTouchStart={() => setModalVisible(false)}
            >
              <Text className="text-black text-center">Cancel</Text>
            </Pressable>
            <Pressable
              className="bg-[#4F2EC9] p-3 w-[45%] rounded-full my-4"
              onTouchStart={() => setModalVisible(false)}
            >
              <Text className="text-white text-center">Create Schedule</Text>
            </Pressable>
          </View>
        </ScrollView>

        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={["40%"]}
          onChange={handleSheetChanges}
          enablePanDownToClose
          index={-1}
          backgroundStyle={styles.bottomSheet}
          activeOffsetY={[-20, 20]} // Helps distinguish between scroll and swipe
          failOffsetX={[-5, 5]}
        >
          <BottomSheetView style={styles.bottomSheetContainer}>
            <View className="px-4">
              <Text className="pb-2 text-[#696969]">All Participants</Text>
            </View>
            <View>
              <Text>Scheduled</Text>

              <View>
                <View className="flex-row px-4 items-center gap-3">
                  {/* <Image
                    source={require("../../../assets/user.png")}
                    alt="user"
                  /> */}
                  <Text>Remilekun Olayinka</Text>
                </View>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </Modal>
    </View>
  );
};

export default SchedullingScreen;

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: "rgb(243, 245, 249)",
    borderRadius: 30,
  },
  bottomSheetContainer: {
    flex: 1,
    padding: width * 0.04,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
});
