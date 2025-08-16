// import {
//   Dimensions,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import React from "react";
// import { ScrollView } from "react-native-gesture-handler";
// import { Entypo } from "@expo/vector-icons";

// const ScheduleList = () => {
//   const { width } = Dimensions.get("window");

//   return (
//     <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
//       <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
//         {[...Array(5)].map((_, index) => (
//           <View key={index} className="bg-[#EFEFEF] my-2 p-4 rounded-lg">
//             <View className="flex-row justify-between items-center">
//               <Text className="font-semibold text-lg">Preschool 1 & 2</Text>
//               <TouchableOpacity
//                 className="px-2 py-1"
//                 onPress={() => console.log("Menu clicked")}
//               >
//                 <Entypo name="dots-three-vertical" size={15} color="black" />
//               </TouchableOpacity>
//             </View>
//             <View className="py-2">
//               <View className="flex-row items-center gap-1">
//                 <Entypo name="back-in-time" size={20} color="black" />
//                 <Text className="text-sm text-[#696969]">
//                   11:00pm - 11:40pm
//                 </Text>
//               </View>
//               <Text className="text-sm text-[#696969]">
//                 Group Session - Intermediate Level
//               </Text>
//               <View className="flex-row items-center space-x-3 mt-4">
//                 <Image
//                   source={require("../../../../assets/addUser.png")}
//                   alt="user"
//                 />
//                 <Text className="text-sm text-[#696969]">
//                   Add/Remove Participants
//                 </Text>
//               </View>
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//       <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
//         {[...Array(5)].map((_, index) => (
//           <View key={index} className="bg-[#EFEFEF] my-2 p-4 rounded-lg">
//             <View className="flex-row justify-between items-center">
//               <Text className="font-semibold text-lg">Preschool 1 & 2</Text>
//               <TouchableOpacity
//                 className="px-2 py-1"
//                 onPress={() => console.log("Menu clicked")}
//               >
//                 <Entypo name="dots-three-vertical" size={15} color="black" />
//               </TouchableOpacity>
//             </View>
//             <View className="py-2">
//               <View className="flex-row items-center gap-1">
//                 <Entypo name="back-in-time" size={20} color="black" />
//                 <Text className="text-sm text-[#696969]">
//                   11:00pm - 11:40pm
//                 </Text>
//               </View>
//               <Text className="text-sm text-[#696969]">
//                 Group Session - Intermediate Level
//               </Text>
//               <View className="flex-row items-center space-x-3 mt-4">
//                 <Image
//                   source={require("../../../../assets/addUser.png")}
//                   alt="user"
//                 />
//                 <Text className="text-sm text-[#696969]">
//                   Add/Remove Participants
//                 </Text>
//               </View>
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//       <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
//         {[...Array(5)].map((_, index) => (
//           <View key={index} className="bg-[#EFEFEF] my-2 p-4 rounded-lg">
//             <View className="flex-row justify-between items-center">
//               <Text className="font-semibold text-lg">Preschool 1 & 2</Text>
//               <TouchableOpacity
//                 className="px-2 py-1"
//                 onPress={() => console.log("Menu clicked")}
//               >
//                 <Entypo name="dots-three-vertical" size={15} color="black" />
//               </TouchableOpacity>
//             </View>
//             <View className="py-2">
//               <View className="flex-row items-center gap-1">
//                 <Entypo name="back-in-time" size={20} color="black" />
//                 <Text className="text-sm text-[#696969]">
//                   11:00pm - 11:40pm
//                 </Text>
//               </View>
//               <Text className="text-sm text-[#696969]">
//                 Group Session - Intermediate Level
//               </Text>
//               <View className="flex-row items-center space-x-3 mt-4">
//                 <Image
//                   source={require("../../../../assets/addUser.png")}
//                   alt="user"
//                 />
//                 <Text className="text-sm text-[#696969]">
//                   Add/Remove Participants
//                 </Text>
//               </View>
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//     </ScrollView>
//   );
// };

// export default ScheduleList;

// const styles = StyleSheet.create({});

import { Entypo } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Booking from "../../../../assets/booking.svg";
import Clock from "../../../../assets/clock.svg";
import Routing from "../../../../assets/routing.svg";

const { width } = Dimensions.get("window");
type ScheduleColumnProps = {
  dateLabel: string;
  handleSchoolBottomNav: () => void;
  handleBottomNav: () => void;
  handleSchoolBottomNavDebounced: () => void;
  // setOpenParticipant: (value: boolean) => void;
};
const schedules = [...Array(5)].map((_, index) => ({
  id: index.toString(),
  title: "Preschool 1 & 2 Noon",
  time: "11:00pm - 11:40pm",
  sessionType: "Kids • Group • Intermediate Level",
  bookingType: "3 Booked • 2 Open",
  image: require("../../../../assets/addUser.png"),
}));

const ScheduleColumn = ({
  dateLabel,
  handleSchoolBottomNav,
  // setOpenParticipant,
  handleBottomNav,
  handleSchoolBottomNavDebounced,
}: ScheduleColumnProps) => {
  return (
    <View>
      <View className="flex-row items-center my-4 justify-between mx-4">
        <View className="bg-[#4F2EC9] rounded-full py-2 px-6 text-center">
          <Text className="text-[12px] text-white">{dateLabel}</Text>
        </View>
        <View className="flex-row items-center space-x-3">
          <Text className="text-2xl text-[#696969]">+</Text>
          <TouchableOpacity className="rounded-full bg-white px-2 py-1">
            <Entypo name="dots-three-horizontal" size={15} color="#696969" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={schedules}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.scheduleItem}>
            <View style={styles.header}>
              <Text style={styles.title}>{item.title}</Text>
              <TouchableOpacity>
                <Entypo name="dots-three-vertical" size={15} color="black" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: width * 0.26,
              }}
              className="bg-[#067A580D] rounded-full py-[2px] px-[8px] mt-1 border border-[#067A5833] flex-row items-center space-x-2"
            >
              <View className="bg-[#067A58] rounded-full h-1.5 w-1.5" />
              <Text className="text-[10px] font-semibold text-[#067A58]">
                Every Tuesday
              </Text>
            </View>
            <View style={styles.content}>
              <View className="flex-row pb-3 space-x-2 justify-between">
                <TouchableOpacity
                  onPress={() => {
                    handleBottomNav();
                  }}
                  className="bg-[#067A580D] rounded-full py-[2px] px-[8px] border-[1px] border-[#067A5833] flex-row items-center space-x-2"
                >
                  <View className="bg-[#067A58] rounded-full h-1.5 w-1.5" />
                  <Text className="text-[10px] font-semibold text-[#067A58]">
                    Scheduled
                  </Text>
                  <Text className="text-[10px] bg-white rounded-full px-1.5 py-[1px]">
                    3
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    handleBottomNav();
                  }}
                  className="bg-[#C73A3A0D] rounded-full py-[2px] px-[8px] border-[1px] border-[#C73A3A0D] flex-row items-center space-x-2"
                >
                  <View className="bg-[#C73A3A] rounded-full h-1.5 w-1.5" />
                  <Text className="text-[10px] font-semibold text-[#C73A3A]">
                    Cancelled
                  </Text>
                  <Text className="text-[10px] bg-white rounded-full px-1.5 py-[1px]">
                    3
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    handleBottomNav();
                  }}
                  className="rounded-full py-[2px] px-[8px] border-[1px] border-[#E7E7E7] flex-row items-center space-x-2"
                >
                  <View className="bg-[#868686] rounded-full h-1.5 w-1.5" />
                  <Text className="text-[10px] font-semibold text-[#B9B9B9]">
                    On Hold
                  </Text>
                  <Text className="text-[10px] bg-white rounded-full px-1.5 py-[1px]">
                    3
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.row}>
                <Clock width={20} height={20} />
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <View style={styles.row}>
                <Routing width={20} height={20} />
                <Text style={styles.description}>{item.sessionType}</Text>
              </View>
              <View className="flex-row gap-1">
                <Booking width={20} height={20} />
                <Text style={styles.description}>{item.bookingType}</Text>
              </View>
              <Pressable
                onPressOut={() => {
                  handleSchoolBottomNavDebounced();
                }}
                style={styles.row}
              >
                <Image source={item.image} style={styles.userImage} />
                <Text style={styles.description}>Add/Remove Participants</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const dateLabels = ["Tuesday 20th - Today", "Wednesday 21st", "Friday 22nd"];

const ScheduleList = ({
  handleSchoolBottomNav,
  handleScroll,
  flatListRef,
  handleBottomNav,
  handleSchoolBottomNavDebounced,
}: // setOpenParticipant,
any) => {
  return (
    <FlatList
      ref={flatListRef}
      data={dateLabels}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      pagingEnabled
      onScroll={handleScroll}
      scrollEventThrottle={16}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalScroll}
      renderItem={({ item }) => (
        <ScheduleColumn
          handleSchoolBottomNav={handleSchoolBottomNav}
          dateLabel={item}
          handleSchoolBottomNavDebounced={handleSchoolBottomNavDebounced}
          handleBottomNav={handleBottomNav}
          // setOpenParticipant={setOpenParticipant}
        />
      )}
    />
  );
};

export default ScheduleList;

const styles = StyleSheet.create({
  horizontalScroll: {
    padding: 10,
  },
  scheduleItem: {
    backgroundColor: "#EFEFEF",
    paddingHorizontal: 16,
    paddingTop: 10,
    borderRadius: 10,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    width: width * 0.9,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 5,
  },
  time: {
    fontSize: 14,
    color: "#696969",
  },
  description: {
    fontSize: 14,
    color: "#696969",
  },
  userImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
});
