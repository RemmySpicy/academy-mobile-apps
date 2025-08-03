import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ClassroomStar from "../../../../assets/classroomStar.svg";
import ClockDark from "../../../../assets/clockDark.svg";
import Grad from "../../../../assets/grad.svg";
import Location from "../../../../assets/location.svg";
import { useResponsiveDimensions } from "../../../hooks/useResponsiveDimensions";
import ControlCard from "../components/reuseable/ControlCard";

interface card {
  year: string;
  firstRating: string;
  secondRating: string;
  location: string;
  time: string;
  image: any;
  quickFilter?: string[];
}

const ClassroomCards = ({ setModalVisible }: any) => {
  const { width } = useResponsiveDimensions();
  const [activeGroup, setActiveGroup] = useState("All Groups");
  const [activeSearch, setActiveSearch] = useState("");

  const cards: card[] = [
    {
      year: "Year 1",
      firstRating: "Lowest",
      secondRating: "Highest",
      location: "Caleb British School, Lekki",
      time: "12:00PM - 12:30PM",
      image: require("../../../../assets/classroomBoy.png"),
    },
    {
      year: "Year 2",
      firstRating: "Lowest",
      secondRating: "Highest",
      location: "Caleb British School, Lekki",
      time: "12:00PM - 12:30PM",
      image: require("../../../../assets/classroomBoy.png"),
    },
    {
      year: "Year 3",
      firstRating: "Lowest",
      secondRating: "Highest",
      location: "Caleb British School, Lekki",
      time: "12:00PM - 12:30PM",
      image: require("../../../../assets/classroomBoy.png"),
    },
    {
      year: "Year 4",
      firstRating: "Lowest",
      secondRating: "Highest",
      location: "Caleb British School, Lekki",
      time: "12:00PM - 12:30PM",
      image: require("../../../../assets/classroomBoy.png"),
    },
  ];
  const quickFilter = [
    { label: "All Classrooms", count: "" },
    { label: "Honeyland, Magodo", count: "" },
    { label: "Caleb British, Lekki", count: "" },
  ];

  const queryFilter = [
    { label: "Group: Locations: ", num: "" },
    { label: "", num: "" },
    { label: "", num: "" },
  ];
  return (
    <View className="flex-grow">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        style={{ flexGrow: 1 }}
      >
        <ControlCard
          filterName={"Filter by location"}
          quickFilter={quickFilter}
          // queryFilter={queryFilter}
          viewName="Views"
          groupName="Locations"
          allNames="All Locations"
          dateSchedule="December 18 - 22:"
          dateSchedule2="This Week"
        />
        <View className="mt-4 mx-3">
          {cards.map((card, i) => (
            <Pressable
              key={i}
              onPress={() => {
                setModalVisible(true);
              }}
              style={styles.card}
            >
              <View className="flex-row space-x-2 px-2 py-3 items-center">
                <Image
                  source={require("../../../../assets/classroomBoy.png")}
                  alt="user"
                  className="w-[70px] h-[70px]"
                />

                <View className="flex-row justify-between">
                  <View>
                    <Text className="font-semibold mb-2">Year 1</Text>
                    <View className="flex-row items-center space-x-2">
                      <View className="flex-row items-center space-x-2">
                        <ClassroomStar width={18} height={18} />
                        <Text className="text-[#6C51D2] text-[8px]">
                          Lowest:
                        </Text>
                      </View>
                      <Text className="text-[11px]">
                        L2S2 - Introduction to Butterfly
                      </Text>
                    </View>
                    <View className="flex-row items-center space-x-2">
                      <View className="flex-row items-center space-x-2">
                        <ClassroomStar width={18} height={18} />
                        <Text className="text-[#6C51D2] text-[8px]">
                          Highest:
                        </Text>
                      </View>
                      <Text className="text-[11px]">
                        L2S2 - Introduction to Butterfly
                      </Text>
                    </View>
                  </View>
                  <View className="ml-auto">
                    <Grad width={30} height={30} />
                  </View>
                </View>
              </View>
              <View className="flex-row justify-between p-2 mt-2 bg-[#F3F7FF] items-center">
                <View className="flex-row items-center space-x-1">
                  <ClockDark width={15} height={15} />
                  <Text className="text-[10px] font-semibold text-[#696969]">
                    12:00PM - 12:30PM
                  </Text>
                </View>
                <View className="flex-row items-center space-x-1">
                  <Location width={15} height={15} />
                  <Text className="text-[10px] font-semibold text-[#696969]">
                    Caleb British School, Lekki
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ClassroomCards;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
    marginHorizontal: 5,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  calendarHeaderText: {
    fontSize: 11,
    fontFamily: "Roboto-Regular",
    color: "#666",
    width: 30,
    textAlign: "center",
  },
  calendarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  calendarDay: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarDayActive: {
    backgroundColor: "#6C51D2",
  },
  calendarDayText: {
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    color: "#000",
  },
  calendarDayActiveText: {
    color: "#fff",
  },
});
