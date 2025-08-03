import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import { PixelRatio, Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AwardIcon from "../../../../assets/award.svg";
import Swim from "../../../../assets/swim.svg";
import { useResponsiveDimensions } from "../../../hooks/useResponsiveDimensions";
import ControlCard from "../components/reuseable/ControlCard";
type Station = "section1" | "section2" | "section3";

const MyClassroom = ({ setGradingModalVisible, setModalVisible }: any) => {
  const { width } = useResponsiveDimensions();
  const option = [
    { label: "Group A - 3", count: "group-a" },
    { label: "Group B - 2", count: "group-b" },
    { label: "Group C - 4", count: "group-c" },
    { label: "+", count: "add-group" },
  ];
  const queryFilter = [
    { label: "Total student: ", num: "32" },
    { label: "My student: ", num: "12" },
    { label: "Instructor: ", num: "4" },
  ];
  const quickFilter = [
    { label: "All Lessons: ", count: "20" },
    { label: "0 Stars: ", count: "3" },
    { label: "1 Stars: ", count: "2" },
    { label: "2 Stars: ", count: "4" },
  ];

  const tabs = [
    { label: "section 1", value: "section1" },
    { label: "section 2", value: "section2" },
    { label: "section 3", value: "section3" },
  ];

  const [activeGroup, setActiveGroup] = useState("group-b");
  const [activeTab, setActiveTab] = useState<Station>("section1");
  const [openTab, setOpenTab] = useState(false);

  return (
    <ScrollView keyboardShouldPersistTaps="handled" className="flex-1 bg-white">
      <ControlCard
        filterName={"Quick Filter"}
        schoolName="Year 1 - Honeyland, Magodo"
        allNames="All location"
        quickFilter={quickFilter}
        queryFilter={queryFilter}
        viewName="Views"
        groupName="Locations"
        moreInfo={true}
      />

      <View className="px-2 flex-row justify-between items-center mx-4 my-2">
        {option.map((option, i) => (
          <Pressable key={i} onPress={() => setActiveGroup(option.count)}>
            <Text
              className={` ${
                option.count === activeGroup
                  ? "bg-[#4F2EC9] text-white"
                  : "bg-[#E6EBEC]"
              } rounded-full px-4 py-1.5`}
              style={{
                fontSize: PixelRatio.getFontScale() * 11,
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.card} className="px-2 mx-5 pt-3">
        <Text className="text-[#444444] text-[10px] font-semibold">
          Current Lessons:
        </Text>

        <View className="flex-row items-center space-x-1 mb-2">
          <AwardIcon width={20} height={20} />
          <View className="shadow-md py-2">
            <Text className="font-semibold">
              Level 2: Fundamental Aquatic Skills
            </Text>
            <Text className="text-[10px] font-semibold">
              Class 3: Introduction to Breaststroke
            </Text>
          </View>
        </View>

        {openTab && (
          <View>
            <View className="flex-row justify-around items-center mb-2">
              {tabs.map((tab, i) => (
                <Pressable
                  key={i}
                  onPress={() => setActiveTab(tab.value)}
                  className={`${
                    activeTab === tab.value ? "border-b" : "opacity-50"
                  } px-1 py-1 mb-1 font-semibold text-[#444444]`}
                >
                  <Text
                    style={{
                      fontSize: PixelRatio.getFontScale() * 10,
                    }}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {activeTab === "section1" && (
              <View>
                <View className="p-2">
                  <Text className="text-[#444444] pb-2">
                    Frog Kick In Motion
                  </Text>
                  <Text className="text-[#444444] pb-2 font-semibold">
                    Warm Up
                  </Text>

                  <View>
                    <Text className="text-[#444444]">
                      4 x 25 Kick (No Board)
                    </Text>
                    <Text className="text-[#444444]">1 x 25 Free</Text>
                    <Text className="text-[#444444]">1 x 25 Breast</Text>
                    <Text className="text-[#444444]">1 x 25 Back</Text>
                  </View>
                  <Text className="text-[#444444] font-semibold pt-2">
                    Main Set
                  </Text>
                </View>

                <View style={styles.miniCard} className="p-3">
                  <Text className="font-semibold">
                    Max distance without a noodle and kickboard
                  </Text>

                  <View className="flex-row space-x-3 items-center mt-2">
                    <Pressable
                      onPress={() => setGradingModalVisible(true)}
                      className="flex-row items-center space-x-1 rounded-full border border-[#B4B4B4] py-1 px-3 mb-2"
                    >
                      <Ionicons name="star-outline" size={16} color="#FFC107" />
                      <Text className="text-[12px] text-[#4F2EC9]">1</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => setGradingModalVisible(true)}
                      className="flex-row items-center space-x-1 rounded-full border border-[#B4B4B4] py-1 px-3 mb-2"
                    >
                      <Ionicons name="star" size={16} color="#FFC107" />
                      <Text className="text-[12px] text-[#4F2EC9]">2</Text>
                    </Pressable>
                    <View className="flex-row items-center space-x-1 rounded-full border border-[#B4B4B4] py-1 px-3 mb-2">
                      <View className="flex-row items-center space-x-1 ">
                        <Ionicons name="star" size={16} color="#FFC107" />
                        <Ionicons name="star" size={16} color="#FFC107" />
                      </View>
                      <Text className="text-[12px] text-[#4F2EC9]">4</Text>
                    </View>
                    <View className="flex-row items-center space-x-1 rounded-full border border-[#B4B4B4] py-1 px-3 mb-2">
                      <View className="flex-row items-center space-x-1 ">
                        <Ionicons name="star" size={16} color="#FFC107" />
                        <Ionicons name="star" size={16} color="#FFC107" />
                      </View>
                      <Text className="text-[12px] text-[#4F2EC9]">2</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.miniCard} className="p-3">
                  <Text className="font-semibold">
                    Max distance without a noodle and kickboard
                  </Text>

                  <View className="flex-row space-x-3 items-center mt-2">
                    <View className="flex-row items-center space-x-1 rounded-full border border-[#B4B4B4] py-1 px-3 mb-2">
                      <Ionicons name="star-outline" size={16} color="#FFC107" />
                      <Text className="text-[12px] text-[#4F2EC9]">1</Text>
                    </View>

                    <View className="flex-row items-center space-x-1 rounded-full border border-[#B4B4B4] py-1 px-3 mb-2">
                      <Ionicons name="star" size={16} color="#FFC107" />
                      <Text className="text-[12px] text-[#4F2EC9]">2</Text>
                    </View>
                    <Pressable
                      onPress={() => setGradingModalVisible(true)}
                      className="flex-row items-center space-x-1 rounded-full border border-[#B4B4B4] py-1 px-3 mb-2"
                    >
                      <View className="flex-row items-center space-x-1 ">
                        <Ionicons name="star" size={16} color="#FFC107" />
                        <Ionicons name="star" size={16} color="#FFC107" />
                      </View>
                      <Text className="text-[12px] text-[#4F2EC9]">4</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setGradingModalVisible(true)}
                      className="flex-row items-center space-x-1 rounded-full border border-[#B4B4B4] py-1 px-3 mb-2"
                    >
                      <View className="flex-row items-center space-x-1 ">
                        <Ionicons name="star" size={16} color="#FFC107" />
                        <Ionicons name="star" size={16} color="#FFC107" />
                      </View>
                      <Text className="text-[12px] text-[#4F2EC9]">2</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        <Pressable
          onPress={() => setOpenTab((openTab) => !openTab)}
          className="mx-auto border-t border-[#D6D6D6] py-2 mt-2 w-full flex justify-center items-center"
        >
          {openTab ? (
            <AntDesign name="up" size={14} color="black" />
          ) : (
            <AntDesign name="down" size={14} color="black" />
          )}
        </Pressable>
      </View>

      <View style={styles.card} className="px-2 mx-5 pt-3">
        <Text className="text-[#444444] text-[10px] font-semibold">
          Current Lessons:
        </Text>

        <View className="flex-row items-center space-x-1 mb-2">
          <AwardIcon width={20} height={20} />
          <View className="shadow-md py-2">
            <Text className="font-semibold">
              Level 2: Fundamental Aquatic Skills
            </Text>
            <Text className="text-[10px] font-semibold">
              Class 3: Introduction to Breaststroke
            </Text>
          </View>
        </View>

        {/* {openTab && (
          <View>
            <View className="flex-row justify-around items-center mb-2">
              {tabs.map((tab, i) => (
                <Pressable
                  key={i}
                  onPress={() => setActiveTab(tab.value)}
                  className={`${
                    activeTab === tab.value ? "border-b" : "opacity-50"
                  } px-1 py-1 mb-1 font-semibold text-[#444444]`}
                >
                  <Text
                    style={{
                      fontSize: PixelRatio.getFontScale() * 10,
                    }}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {activeTab === "section1" && (
              <View>
                <View className="p-2">
                  <Text className="text-[#444444]">Frog Kick In Motion</Text>
                  <Text className="text-[#444444] font-semibold">Warm Up</Text>

                  <View>
                    <Text className="text-[#444444]">
                      4 x 25 Kick (No Board)
                    </Text>
                    <Text className="text-[#444444]">1 x 25 Free</Text>
                    <Text className="text-[#444444]">1 x 25 Breast</Text>
                    <Text className="text-[#444444]">1 x 25 Back</Text>
                  </View>
                  <Text className="text-[#444444] font-semibold">Main Set</Text>
                </View>

                <View style={styles.miniCard} className="p-3">
                  <Text className="font-semibold">
                    Max distance without a noodle and kickboard
                  </Text>

                  <View className="flex-row space-x-3 items-center mt-2">
                    <Pressable
                      onPress={() => setGradingModalVisible(true)}
                      className="flex-row items-center space-x-1 rounded-full border border-[#B4B4B4] py-1 px-3 mb-2"
                    >
                      <Ionicons name="star-outline" size={16} color="#FFC107" />
                      <Text className="text-[12px] text-[#4F2EC9]">1</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => setGradingModalVisible(true)}
                      className="flex-row items-center space-x-1 rounded-full border border-[#B4B4B4] py-1 px-3 mb-2"
                    >
                      <Ionicons name="star" size={16} color="#FFC107" />
                      <Text className="text-[12px] text-[#4F2EC9]">2</Text>
                    </Pressable>
                    <View className="flex-row items-center space-x-1 rounded-full border border-[#B4B4B4] py-1 px-3 mb-2">
                      <View className="flex-row items-center space-x-1 ">
                        <Ionicons name="star" size={16} color="#FFC107" />
                        <Ionicons name="star" size={16} color="#FFC107" />
                      </View>
                      <Text className="text-[12px] text-[#4F2EC9]">4</Text>
                    </View>
                    <View className="flex-row items-center space-x-1 rounded-full border border-[#B4B4B4] py-1 px-3 mb-2">
                      <View className="flex-row items-center space-x-1 ">
                        <Ionicons name="star" size={16} color="#FFC107" />
                        <Ionicons name="star" size={16} color="#FFC107" />
                      </View>
                      <Text className="text-[12px] text-[#4F2EC9]">2</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.miniCard} className="p-3">
                  <Text className="font-semibold">
                    Max distance without a noodle and kickboard
                  </Text>

                  <View className="flex-row space-x-3 items-center mt-2">
                    <View className="flex-row items-center space-x-1 rounded-full border border-[#B4B4B4] py-1 px-3 mb-2">
                      <Ionicons name="star-outline" size={16} color="#FFC107" />
                      <Text className="text-[12px] text-[#4F2EC9]">1</Text>
                    </View>

                    <View className="flex-row items-center space-x-1 rounded-full border border-[#B4B4B4] py-1 px-3 mb-2">
                      <Ionicons name="star" size={16} color="#FFC107" />
                      <Text className="text-[12px] text-[#4F2EC9]">2</Text>
                    </View>
                    <Pressable
                      onPress={() => setGradingModalVisible(true)}
                      className="flex-row items-center space-x-1 rounded-full border border-[#B4B4B4] py-1 px-3 mb-2"
                    >
                      <View className="flex-row items-center space-x-1 ">
                        <Ionicons name="star" size={16} color="#FFC107" />
                        <Ionicons name="star" size={16} color="#FFC107" />
                      </View>
                      <Text className="text-[12px] text-[#4F2EC9]">4</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setGradingModalVisible(true)}
                      className="flex-row items-center space-x-1 rounded-full border border-[#B4B4B4] py-1 px-3 mb-2"
                    >
                      <View className="flex-row items-center space-x-1 ">
                        <Ionicons name="star" size={16} color="#FFC107" />
                        <Ionicons name="star" size={16} color="#FFC107" />
                      </View>
                      <Text className="text-[12px] text-[#4F2EC9]">2</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          </View>
        )} */}

        <Pressable
          onPress={() => setOpenTab((openTab) => !openTab)}
          className="mx-auto border-t border-[#D6D6D6] py-2 mt-2 w-full flex justify-center items-center"
        >
          {openTab ? (
            <AntDesign name="up" size={14} color="black" />
          ) : (
            <AntDesign name="down" size={14} color="black" />
          )}
        </Pressable>
      </View>

      {/* OLD CARD */}
      {/* <View style={styles.card} className="px-3 pt-1 mx-5 mb-8">
        <Text className="text-[#444444] text-[10px] font-semibold">
          Current Lessons:
        </Text>

        <View className="mb-2">
          <View className="flex-row items-center space-x-1 pt-2">
            <Text className="">Class 3: </Text>
            <Text className="font-semibold">Introduction to Frog Kick</Text>
          </View>
          <View className="flex-row items-center space-x-6">
            <View className="flex-row items-center space-x-1">
              <Swim width={20} height={20} />
              <Text className="text-[12px]">0/14</Text>
            </View>
            <View className="flex-row items-center space-x-1">
              <AntDesign name="star" size={14} color="#FFC107" />
              <Text className="text-[12px]">0/30</Text>
            </View>
          </View>
        </View>

        <Pressable
          //   onPress={() => setOpenTab((openTab) => !openTab)}
          className="mx-auto border-t border-[#D6D6D6] py-2 mt-2 w-full flex justify-center items-center"
        >
          {openTab ? (
            <AntDesign name="up" size={14} color="black" />
          ) : (
            <AntDesign name="down" size={14} color="black" />
          )}
        </Pressable>
      </View> */}
    </ScrollView>
  );
};

export default MyClassroom;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    // padding: 16,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  miniCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    // padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
});
