import { default as React } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ScheduleList from "./ScheduleList";
const { width } = Dimensions.get("window");

const Schedules = ({
  handleScroll,
  handleSchoolBottomNav,
  handleBottomNav,
  handleSchoolBottomNavDebounced,
}: any) => {
  const flatListRef = React.useRef<FlatList>(null);
  return (
    <>
      <View className="flex-1">
        <ScheduleList
          handleSchoolBottomNav={handleSchoolBottomNav}
          handleScroll={handleScroll}
          handleBottomNav={handleBottomNav}
          flatListRef={flatListRef}
          handleSchoolBottomNavDebounced={handleSchoolBottomNavDebounced}
        />
      </View>
    </>
  );
};

export default Schedules;

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
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
  bottomSheetContainer: {
    flex: 1,
    padding: width * 0.04,
  },
  searchContainer: {
    // flex: 1, // Takes most of the available space
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DCD5F4",
    borderRadius: 80,
    paddingVertical: 6,
    paddingHorizontal: 12,
    // marginRight: 8, // Space between search and done button
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
});
