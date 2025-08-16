import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PixelRatio,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import People from "../../../../assets/people.svg";
import Search from "../../../../assets/search.svg";
import ClassroomGroupedCard from "./ClassroomGroupedCards";
import ClassroomProgressCard from "./ClassroomProgressCard";

const ClassroomGrading = ({ setGradingModalVisible }: any) => {
  const width = Dimensions.get("window").width;

  const [zeroStar, setZeroStar] = useState(false);
  const [oneStar, setOneStar] = useState(false);
  const [unGrouped, setUnGrouped] = useState(false);
  const [grouped, setGrouped] = useState(false);
  const groups = ["Progress", "Group"];
  const [activeGroup, setActiveGroup] = useState("Progress");

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
  const handleBackdropPress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const cards = [
    { label: "Classroom", count: 20 },
    { label: "Students", count: 12 },
    { label: "Instructors", count: 4 },
  ];
  return (
    <SafeAreaView pointerEvents="box-none" className="flex-1">
      <View className="flex-row bg-white items-center px-6 py-2 ">
        <Ionicons
          onPress={() => setGradingModalVisible(false)}
          name="arrow-back"
          size={20}
        />
        <Text className="text-[22px] font-semibold mx-auto">Grading</Text>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        className="flex-1 bg-white px-4"
      >
        <View className="bg-[#EFEFEF] rounded-xl p-4 mt-2 mb-4">
          <Text className="font-semibold">
            Lesson: Max distance without a noodle and kickboard
          </Text>
          <Text
            style={{
              fontSize: PixelRatio.getFontScale() * 12,
              paddingVertical: 6,
            }}
          >
            Views
          </Text>

          {/* Filter & Search Section */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 4,
              marginBottom: 4,
              width: "100%",
            }}
          >
            <Pressable
              onTouchStart={handleBottomNav}
              style={{
                backgroundColor: "#DCD5F4",
                borderRadius: 8,
                padding: 8,
                flexDirection: "row",
                alignItems: "center",
                flex: 0.5, // Takes 28% of the container width
                minWidth: 0, // Important for text truncation
              }}
            >
              <People width={15} height={15} />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: PixelRatio.getFontScale() * 10,
                  color: "#4F2EC9",
                  marginLeft: 4,
                  flexShrink: 1, // Allows text to shrink and truncate
                  fontWeight: 600,
                }}
              >
                Group: {activeGroup}
              </Text>
            </Pressable>

            <Pressable
              style={{
                borderWidth: 1,
                borderColor: "#DCD5F4",
                borderRadius: 8,
                padding: 8,
                flexDirection: "row",
                alignItems: "center",
                flex: 0.4, // Takes 40% of the container width
                minWidth: 0,
              }}
            >
              <Ionicons name="eye-outline" size={14} color="#696969" />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: PixelRatio.getFontScale() * 10,
                  color: "#696969",
                  marginLeft: 4,
                  flexShrink: 1,
                }}
              >
                All Lessons
              </Text>
            </Pressable>

            <Pressable
              style={{
                borderWidth: 1,
                borderColor: "#DCD5F4",
                borderRadius: 8,
                padding: 8,
                flexDirection: "row",
                alignItems: "center",
                flex: 0.35, // Takes 28% of the container width
                minWidth: 0,
              }}
              // onPress={() => setActiveSearch(true)}
            >
              <Search width={15} height={15} />
              <Text
                style={{
                  fontSize: PixelRatio.getFontScale() * 10,
                  color: "#696969",
                  marginLeft: 4,
                }}
              >
                Search
              </Text>
            </Pressable>
          </View>

          {/* Quick Filters */}
          <View>
            <Text
              style={{
                fontSize: PixelRatio.getFontScale() * 12,
                color: "#696969",
              }}
            >
              Quick Filter
            </Text>

            {/* Progress filter */}
            {activeGroup === "Progress" && (
              <View className="flex-row flex items-center space-x-2 mt-2">
                {[
                  { label: "All stars" },
                  { label: "0 Stars" },
                  { label: "1 Stars" },
                  { label: "2 Stars" },
                ].map((filter, index) => (
                  <Pressable
                    key={index}
                    className="flex-row items-center space-x-1 px-2 py-1 rounded-full border border-[#DCD5F4]"
                    style={{
                      backgroundColor: index === 0 ? "#DCD5F4" : "transparent",
                      // marginRight: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: PixelRatio.getFontScale() * 10,
                        color: "#696969",
                      }}
                    >
                      {filter.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Group filter */}
            {activeGroup === "Group" && (
              <View className="flex-row flex items-center space-x-2 mt-2">
                {[
                  { label: "Ungrouped:", num: "20" },
                  { label: "Group A:", num: "3" },
                  { label: "Group B:", num: "2" },
                  { label: "Group C:", num: "6" },
                ].map((filter, index) => (
                  <Pressable
                    key={index}
                    className="flex-row items-center space-x-1 px-2 py-1 rounded-full border border-[#DCD5F4]"
                    style={{
                      backgroundColor: index === 0 ? "#DCD5F4" : "transparent",
                      // marginRight: 10,
                    }}
                  >
                    <View className="flex-row items-center">
                      <Text
                        style={{
                          fontSize: PixelRatio.getFontScale() * 10,
                          color: "#696969",
                        }}
                      >
                        {filter.label}
                      </Text>
                      <Text className="font-semibold text-[12px] text-[#8A74DB]">
                        {filter.num}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>

        {activeGroup === "Progress" && (
          <ClassroomProgressCard
            cards={cards}
            zeroStar={zeroStar}
            setZeroStar={setZeroStar}
            oneStar={oneStar}
            setOneStar={setOneStar}
          />
        )}
        {activeGroup === "Group" && (
          <ClassroomGroupedCard
            cards={cards}
            grouped={grouped}
            setGrouped={setGrouped}
            unGrouped={unGrouped}
            setUnGrouped={setUnGrouped}
          />
        )}
      </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["25%"]}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        index={-1}
        backgroundStyle={styles.bottomSheet}
      >
        <BottomSheetView style={styles.bottomSheetContainer}>
          <View className="px-4">
            <Text className="pb-3 text-[#696969]">Group By:</Text>
            {groups.map((group, i) => (
              <Pressable
                key={i}
                onTouchStart={() => {
                  setActiveGroup(group);
                  if (group === "Payment") {
                    // handlePaymentBottomNav();
                  }
                  bottomSheetRef.current?.close();
                }}
                style={styles.smallCard}
                className="flex flex-row justify-between items-center"
              >
                <Text className="font-semibold">{group}</Text>
                {activeGroup === group && (
                  <Ionicons
                    name="checkmark-circle-sharp"
                    size={18}
                    color="#6C51D2"
                  />
                )}
              </Pressable>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default ClassroomGrading;

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: "rgb(243, 245, 249)",
    borderRadius: 30,
  },
  bottomSheetContainer: {
    flex: 1,
    // padding: width * 0.04,
    padding: 5,
  },
  smallCard: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
