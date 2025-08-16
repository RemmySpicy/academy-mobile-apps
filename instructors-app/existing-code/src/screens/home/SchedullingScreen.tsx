import BottomSheet, {
  BottomSheetHandle,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Add from "../../../assets/add.svg";
import Remove from "../../../assets/remove.svg";
import Search from "../../../assets/search.svg";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { debounce } from "../../redux/utils/debounce";
import ControlCard from "./components/reuseable/ControlCard";
import { HeaderComponent } from "./components/reuseable/HeaderComponent";
import ScheduleInput from "./components/ScheduleInput";
import Schedules from "./components/Schedules";
import ScheduleType from "./components/ScheduleType";
const { width, height } = Dimensions.get("window");
interface SheetOpen {
  setIsSheetOpen: (isOpen: boolean) => void;
}
const SchedullingScreen: React.FC<SheetOpen> = ({ setIsSheetOpen }) => {
  const [addParticipants, setAddParticipants] = useState([
    { id: 1, name: "Olayinka Gabriel" },
    { id: 2, name: "Taofek El Ramadan" },
  ]);

  const [removeParticipants, setRemoveParticipants] = useState([
    { id: 3, name: "Remilekun Olayinka" },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const schoolBottomSheetRef = useRef<BottomSheet>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [viewBottom, setViewBottom] = useState(false);

  const handleSheetChanges = useCallback(
    (index: number) => {
      Animated.timing(fadeAnim, {
        toValue: index === -1 ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setIsSheetOpen(index === -1 ? false : true);
      setViewBottom(index === -1 ? true : false);
    },
    [fadeAnim]
  );

  const isBottomSheetOpen = useAppSelector(
    (state) => state.utils.isBottomSheetOpen
  );

  console.log(isBottomSheetOpen);

  const handleAddParticipant = (participant) => {
    setRemoveParticipants([...removeParticipants, participant]);
    setAddParticipants(addParticipants.filter((p) => p.id !== participant.id));
  };

  const handleRemoveParticipant = (participant) => {
    setAddParticipants([...addParticipants, participant]);
    setRemoveParticipants(
      removeParticipants.filter((p) => p.id !== participant.id)
    );
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const CustomHandle = ({ props }: any) => (
    <Pressable onPress={closeBottomSheet}>
      <BottomSheetHandle
        {...props}
        style={{
          height: 24,
          width: "70%",
          alignSelf: "center",
        }}
        indicatorStyle={{
          backgroundColor: "#444444",
          width: "40%",
          height: 6,
        }}
      />
    </Pressable>
  );

  const handleBottomNav = () => {
    bottomSheetRef.current?.expand();
  };
  const handleSchoolBottomNav = () => {
    schoolBottomSheetRef.current?.expand();
  };

  const handleSchoolBottomNavDebounced = useCallback(
    debounce(() => {
      schoolBottomSheetRef.current?.expand();
    }, 1000),
    []
  );

  const queryFilter = [
    { label: "Next Session: ", num: "Feb 24" },
    { label: "Total students: ", num: "200" },
    { label: "Weeks: ", num: "48" },
  ];

  const quickFilter = [
    { label: "All students: ", num: "73" },
    { label: "Preschool 1 & 2:", count: 10 },
    { label: "Kindergarten:", count: 15 },
  ];

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / Dimensions.get("window").width);
    setActiveIndex(index);
  };

  return (
    <SafeAreaView className="mb-4 flex-1">
      <View className="mx-4">
        <HeaderComponent screenTitle="Schedules" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
        className="flex-1"
      >
        <ControlCard
          queryFilter={queryFilter}
          schoolName="Sachos Academy School, Magodo"
          dateSchedule="December 18 - 22:"
          dateSchedule2="This Week"
          moreInfo={true}
        />

        <Schedules
          handleBottomNav={handleBottomNav}
          handleSchoolBottomNav={handleSchoolBottomNav}
          handleScroll={handleScroll}
          handleSchoolBottomNavDebounced={handleSchoolBottomNavDebounced}
        />
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className=" bg-white mx-4">
            <HeaderComponent screenTitle="Schedules" />
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            className="flex-1 bg-white px-6"
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
                  onTouchStart={handleBottomNav}
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
                  onTouchStart={() => {
                    handleBottomNav();
                  }}
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
        </Modal>
      </ScrollView>

      {/* Add/Remove Participant Bottom Sheet*/}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["60%"]}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        index={-1}
        handleComponent={CustomHandle}
        backgroundStyle={{
          backgroundColor: "#FAFAFA",
          marginBottom: -insets.bottom,
          paddingBottom: insets.bottom,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          borderWidth: 1,
          borderColor: "#D2D2D2",
        }}
        handleStyle={{
          marginBottom: insets.bottom,
        }}
      >
        <BottomSheetView style={styles.bottomSheetContainer}>
          <View style={styles.searchContainer}>
            <Search width={20} height={20} />
            <TextInput
              placeholder="Search available students"
              style={styles.input}
              className="py-2"
              // onChangeText={(text) => setQueryText(text)}
              placeholderTextColor="#696969"
            />
          </View>

          <View>
            {/* Add Participant */}
            <Text className="pb-2 pt-4 px-2 text-[#696969]">
              Add Participant
            </Text>
            {addParticipants.map((participant) => (
              <View
                key={participant.id}
                className="flex-row justify-between mb-2 items-center shadow bg-white rounded-lg py-3 px-2"
              >
                <View className="flex-row items-center gap-3">
                  <Image
                    source={require("../../../assets/user.png")}
                    alt="user"
                    className="w-[40px] h-[40px] rounded-full"
                  />
                  <Text className="text-[#696969] text-[14px]">
                    {participant.name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleAddParticipant(participant)}
                  className="bg-[#D2D2D2] border-[#D2D2D2] rounded-full border p-1"
                >
                  <Add width={20} height={20} />
                </TouchableOpacity>
              </View>
            ))}

            {/* Remove Participant */}
            <Text className="pb-4 pt-2 px-2 text-[#696969]">
              Remove Participant
            </Text>
            {removeParticipants.map((participant) => (
              <View
                key={participant.id}
                className="flex-row justify-between mb-2 items-center shadow bg-white rounded-lg py-3 px-2"
              >
                <View className="flex-row items-center gap-3">
                  <Image
                    source={require("../../../assets/user.png")}
                    alt="user"
                    className="w-[40px] h-[40px] rounded-full"
                  />
                  <Text className="text-[#696969] text-[14px]">
                    {participant.name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveParticipant(participant)}
                  className="bg-[#D2D2D2] border-[#D2D2D2] rounded-full border p-1"
                >
                  <Remove width={20} height={20} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheet>

      {/* School Bottomsheet Navigation  */}
      <BottomSheet
        ref={schoolBottomSheetRef}
        snapPoints={["40%"]}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        index={-1}
        handleComponent={CustomHandle}
        backgroundStyle={{
          backgroundColor: "#FAFAFA",
          marginBottom: -insets.bottom,
          paddingBottom: insets.bottom,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          borderWidth: 1,
          borderColor: "#D2D2D2",
        }}
        handleStyle={{
          marginBottom: insets.bottom,
        }}
      >
        <BottomSheetView style={styles.bottomSheetContainer}>
          <View>
            {/* All Participant */}
            <Text className="pb-4 px-2 font-semibold text-[#696969]">
              All Participants
            </Text>

            <View>
              <Text className="pt-4 px-2 text-[14px] text-[#696969]">
                Scheduled
              </Text>
              <View className="flex-row justify-between my-1 items-center shadow shadow-black/25 shadow-offset-[0px]/[2px] shadow-opacity-25 shadow-radius-[3.84px] elevation-5 bg-white rounded-lg py-2 px-2">
                <View className="flex-row items-center gap-3">
                  <Image
                    source={require("../../../assets/user.png")}
                    alt="user"
                    className="w-[40px] h-[40px] rounded-full"
                  />
                  <Text className="text-[#696969] font-semibold text-[14px]">
                    Remilekun Olayinka
                  </Text>
                </View>
              </View>
              <View className="shadow shadow-black/25 shadow-offset-[0px]/[2px] shadow-opacity-25 shadow-radius-[3.84px] elevation-5 bg-white rounded-lg py-2 px-2">
                <View className="flex-row items-center gap-3">
                  <Image
                    source={require("../../../assets/user.png")}
                    alt="user"
                    className="w-[40px] h-[40px] rounded-full"
                  />
                  <Text className="text-[#696969] font-semibold text-[14px]">
                    Remilekun Olayinka
                  </Text>
                </View>
              </View>
            </View>

            {/* Maybe Participant */}
            <View className="mt-2">
              <Text className="pt-4 px-2 text-[14px] text-[#696969]">
                Maybe
              </Text>
              <View className="flex-row justify-between items-center shadow shadow-black/25 shadow-offset-[0px]/[2px] shadow-opacity-25 shadow-radius-[3.84px] elevation-5 bg-white rounded-lg py-3 px-2">
                <View className="flex-row items-center gap-3">
                  <Image
                    source={require("../../../assets/user.png")}
                    alt="user"
                    className="w-[40px] h-[40px] rounded-full"
                  />
                  <Text className="text-[#696969] font-semibold text-[14px]">
                    Taofek El Ramadan
                  </Text>
                </View>
              </View>
            </View>

            {/* Cancelled Participant */}
            <View className="mt-2">
              <Text className="pt-4 px-2 text-[14px] text-[#696969]">
                Cancelled
              </Text>
              <View className="flex-row justify-between items-center shadow shadow-black/25 shadow-offset-[0px]/[2px] shadow-opacity-25 shadow-radius-[3.84px] elevation-5 bg-white rounded-lg py-3 px-2">
                <View className="flex-row items-center gap-3">
                  <Image
                    source={require("../../../assets/user.png")}
                    alt="user"
                    className="w-[40px] h-[40px] rounded-full"
                  />
                  <Text className="text-[#696969] font-semibold text-[14px]">
                    Taofek El Ramadan
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {[...Array(3)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              activeIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Add(+) Button */}
      <Pressable
        className="bg-[#4F2EC9] z-10 absolute right-6 rounded-full h-16 w-16 flex items-center justify-center"
        style={{
          bottom: "15%",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          opacity: viewBottom ? 1 : 0,
          // display: isBottomSheetOpen ? "none" : "flex",
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white text-4xl">+</Text>
      </Pressable>

      {/* Add Swim */}
      {/* {addPerformanceTab && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={addPerformanceTab}
          onRequestClose={() => setAddPerformanceTab(false)}
        >
          <View className="flex-1 justify-between bg-white pt-2 px-6">
            <View>
              <View className="flex-row gap-24 items-center py-2">
                <Pressable
                  onPress={() => setAddPerformanceTab(false)}
                  className=""
                >
                  <AntDesign name="arrowleft" size={24} color="black" />
                </Pressable>

                <Text className="text-[20px] font-semibold">Add Swim</Text>
              </View>

              <View>
                <Text>log Info</Text>

                <View>
                  <View className="border border-[#D2D2D2] my-3 rounded-lg">
                    <View className="border-b border-[#D2D2D2] p-2">
                      <Pressable>
                        <Text className="text-[#696969]">Select Stroke</Text>

                        <View className="pt-2 flex flex-row justify-between">
                          <Text className="text-[#B4B4B4] text-sm">
                            Freestyle
                          </Text>
                          <Feather
                            name="chevron-down"
                            size={16}
                            color="black"
                          />
                        </View>
                      </Pressable>
                    </View>
                    <View className="border-b p-2 border-[#D2D2D2]">
                      <Pressable>
                        <View className="flex flex-row justify-between items-center">
                          <Text className="text-[#696969]">Distance</Text>
                          <View className="flex flex-row items-center space-x-2">
                            <Text className="text-[#696969] text-xs">
                              My Location
                            </Text>

                            <View className="flex items-center flex-row space-x-1">
                              <AntDesign
                                name="plus"
                                size={15}
                                color="#6C51D2"
                              />
                              <AntDesign
                                name="minus"
                                size={15}
                                color="#6C51D2"
                              />
                            </View>
                          </View>
                        </View>

                        <View className="pt-2 flex flex-row justify-between">
                          <Text className="text-[#B4B4B4] text-sm">16m</Text>
                        </View>
                      </Pressable>
                    </View>

                    <View className="border-b border-[#D2D2D2] p-2">
                      <Pressable>
                        <Text className="text-[#696969]">Time</Text>

                        <View className="pt-2 flex flex-row justify-between">
                          <Text className="text-[#B4B4B4] text-sm">
                            00:00:00
                          </Text>
                          <Feather
                            name="chevron-down"
                            size={16}
                            color="black"
                          />
                        </View>
                      </Pressable>
                    </View>
                    <View className="border-b border-[#D2D2D2] p-2">
                      <Pressable>
                        <View className="flex flex-row justify-between items-center">
                          <Text className="text-[#696969]">Score</Text>
                          <Text className="text-[#696969] text-xs">
                            Optional
                          </Text>
                        </View>

                        <Text className="text-[#B4B4B4] text-sm">16</Text>
                      </Pressable>
                    </View>
                    <View className="p-2">
                      <Pressable>
                        <View className="flex flex-row justify-between items-center">
                          <Text className="text-[#696969]">
                            Notes / Coach Feedback
                          </Text>
                          <Text className="text-[#696969] text-xs">
                            Optional
                          </Text>
                        </View>

                        <Text className="text-[#B4B4B4] text-sm">
                          Lorem ipsum
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View className="w-full py-2">
              <Pressable
                onPress={() => setPerformanceTimes(true)}
                className="bg-[#6C51D2] text-white py-4 px-6 rounded-full"
              >
                <Text className="text-sm text-center font-semibold text-white">
                  Add
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )} */}
    </SafeAreaView>
  );
};

export default SchedullingScreen;

const styles = StyleSheet.create({
  bottomSheet: {
    // backgroundColor: "rgb(243, 245, 249)",
    borderRadius: 30,
  },
  bottomSheetContainer: {
    flex: 1,
    padding: width * 0.04,
    backgroundColor: "#FAFAFA",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
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
  searchContainer: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DCD5F4",
    borderRadius: 80,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#EFEFEF",
    // marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 12,
    paddingVertical: 4,
    color: "#EFEFEF",
    borderRadius: 80,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
    paddingTop: 3,
  },
  paginationDot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#D3D3D3",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#000",
    width: 6,
    height: 6,
  },
});
