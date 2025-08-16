// import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import { BottomSheetView } from "@gorhom/bottom-sheet";
// import { useCallback, useRef, useState } from "react";
// import {
//   Animated,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { ScrollView } from "react-native-gesture-handler";
// import MenuList from "./components/MenuList";
// import {
//   NotificationSettings,
//   PreferenceSupport,
//   ProfileSettings,
//   SessionManagement,
// } from "./components/ProfileSettings";

// import BottomSheet from "@gorhom/bottom-sheet";
// import { useAppSelector } from "../../redux/store";

// interface Props {
//   navigation: any;
// }
// const Profile = () => {
//   // const navigation = useNavigation();
//   const bottomSheetRef = useRef<BottomSheet>(null);
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const [openNotify, seyOpenNotify] = useState(false);
//   const { user } = useAppSelector((state) => state.auth);
//   console.log(user);

//   const handleBottomNav = () => {
//     bottomSheetRef.current?.expand();
//   };

//   const handleSheetChanges = useCallback(
//     (index: number) => {
//       Animated.timing(fadeAnim, {
//         toValue: index === -1 ? 0 : 1,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     },
//     [fadeAnim]
//   );
//   return (
//     <>
//       <View className="mt-10 mx-4">
//         <Text className="text-[24px] ">Menu</Text>
//         <View style={styles.card} className="mt-[34px]">
//           <View className="flex-row justify-between items-center">
//             <View className="flex-row items-center gap-2">
//               <Image
//                 source={require("../../../assets/user.png")}
//                 className="rounded-full"
//               />

//               <View>
//                 <Text className="font-semibold mb-[8px] text-[21px]">
//                   {user?.first_name} {user?.last_name}{" "}
//                 </Text>

//                 <View className="flex-row items-center">
//                   <Image
//                     source={require("../../../assets/award.png")}
//                     className="w-[20px] h-[20px]"
//                   />
//                   <View>
//                     <Text className="font-semibold text-[11px]">
//                       Fundamental Aquatic Skills
//                     </Text>
//                     <Text className="text-[9px] text-[#596367]">
//                       Introduction to Breaststroke
//                     </Text>
//                   </View>
//                 </View>
//                 <View className="flex-row items-center">
//                   <MaterialIcons name="star" size={19} color="#FFC107" FFC107 />
//                   <Text className="text-[10px] font-semibold">18 / 36</Text>
//                 </View>
//               </View>
//             </View>

//             <TouchableOpacity onPress={handleBottomNav} className="relative">
//               <AntDesign name="downcircleo" size={27} color="black" />

//               <View className="absolute bottom-3 left-4">
//                 <Text className="text-[9px] text-white bg-red-600 rounded-full p-1 w-5 h-5 flex justify-center items-center text-center">
//                   6+
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>

//       <ScrollView showsVerticalScrollIndicator={true}>
//         <MenuList />

//         <ProfileSettings />
//         <NotificationSettings />
//         <SessionManagement />
//         <PreferenceSupport />
//       </ScrollView>

//       <BottomSheet
//         ref={bottomSheetRef}
//         snapPoints={["30%"]}
//         onChange={handleSheetChanges}
//         enablePanDownToClose
//         index={-1}
//         backgroundStyle={{
//           backgroundColor: "rgb(243, 245, 249)",
//         }}
//         // style={styles.bottomCard}
//       >
//         <BottomSheetView style={{ flex: 1, padding: 16 }}>
//           <View style={{ flex: 1 }}>
//             <View
//               className="flex-1 items-center bg-white p-6 rounded-[12px] space-y-2"
//               style={{ borderRadius: 80 }}
//             >
//               <View className="w-full flex-row justify-between items-center">
//                 <View className="items-center flex-row gap-3">
//                   <Image
//                     source={require("../../../assets/user.png")}
//                     className="rounded-full w-[30px] h-[30px]"
//                   />
//                   <Text className="font-semibold text-[14px]">
//                     Benson Adeyemi Showole
//                   </Text>
//                 </View>
//                 <Ionicons name="checkmark-circle" size={24} color="#4F2EC9" />
//               </View>
//               <View className="w-full flex-row justify-between items-center">
//                 <View className="items-center flex-row gap-3">
//                   <Image
//                     source={require("../../../assets/boy.png")}
//                     className="rounded-full w-[30px] h-[30px]"
//                   />
//                   <Text className="font-semibold text-[14px]">
//                     David Micheal Ajayi
//                   </Text>
//                 </View>
//                 <View>
//                   <Text className="text-[9px] text-white bg-orange-500 rounded-full p-1 w-5 h-5">
//                     6+
//                   </Text>
//                 </View>
//               </View>
//               <View className="w-full flex-row pt-3 justify-between items-center">
//                 <View className="items-center flex-row gap-3">
//                   <View className="rounded-full w-8 h-8 border-gray-400 border">
//                     <Text className="text-center p-1">+</Text>
//                   </View>
//                   <Text className="font-semibold text-[14px]">
//                     Create a new profile
//                   </Text>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </BottomSheetView>
//       </BottomSheet>
//     </>
//   );
// };

// export default Profile;

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 16,
//     marginVertical: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 4,
//   },

//   bottomCard: {
//     borderTopLeftRadius: 40,
//     borderTopRightRadius: 40,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 4,
//   },
// });

// -------------------------------------------------------------------------

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import MenuList from "./components/MenuList";
import {
  NotificationSettings,
  PreferenceSupport,
  ProfileSettings,
  SessionManagement,
} from "./components/ProfileSettings";

import BottomSheet from "@gorhom/bottom-sheet";
import { useAppSelector } from "../../redux/store";

// Get screen dimensions
const { width, height } = Dimensions.get("window");

const Profile = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [openNotify, seyOpenNotify] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const handleBottomNav = () => {
    bottomSheetRef.current?.expand();
  };

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

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.menuTitle}>Menu</Text>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            {/* Profile Section */}
            <View style={styles.profileRow}>
              <Image
                source={require("../../../assets/user.png")}
                style={styles.profileImage}
              />
              <View>
                <Text style={styles.userName}>
                  {user?.first_name} {user?.last_name}
                </Text>

                {/* Awards Section */}
                <View style={styles.awardRow}>
                  <Image
                    source={require("../../../assets/award.png")}
                    style={styles.awardIcon}
                  />
                  <View>
                    <Text style={styles.awardText}>
                      Fundamental Aquatic Skills
                    </Text>
                    <Text style={styles.subAwardText}>
                      Introduction to Breaststroke
                    </Text>
                  </View>
                </View>

                {/* Rating Section */}
                <View style={styles.ratingRow}>
                  <MaterialIcons name="star" size={19} color="#FFC107" />
                  <Text style={styles.ratingText}>18 / 36</Text>
                </View>
              </View>
            </View>

            {/* Notification Button */}
            <TouchableOpacity
              onPress={handleBottomNav}
              style={styles.notificationButton}
            >
              <AntDesign name="downcircleo" size={27} color="black" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>6+</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={true}>
        <MenuList />
        <ProfileSettings />
        <NotificationSettings />
        <SessionManagement />
        <PreferenceSupport />
      </ScrollView>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["30%"]}
        onChange={handleSheetChanges}
        enablePanDownToClose
        index={-1}
        backgroundStyle={styles.bottomSheet}
      >
        <BottomSheetView style={styles.bottomSheetContainer}>
          <View style={styles.profileOption}>
            <View className="flex flex-row items-center space-x-4">
              <Image
                source={require("../../../assets/user.png")}
                style={styles.optionImage}
              />
              <Text style={styles.optionText}>Benson Adeyemi Showole</Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="#4F2EC9" />
          </View>

          <View className="flex flex-row items-center space-x-4">
            <View>
              <Image
                source={require("../../../assets/boy.png")}
                style={styles.optionImage}
              />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>6+</Text>
              </View>
            </View>
            <Text style={styles.optionText}>David Micheal Ajayi</Text>
          </View>

          <View className="flex flex-row items-center space-x-4">
            <View style={styles.addIcon}>
              <Text style={styles.addIconText}>+</Text>
            </View>
            <Text style={styles.optionText}>Create a new profile</Text>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    marginTop: height * 0.05,
    marginHorizontal: width * 0.04,
  },
  menuTitle: {
    fontSize: width * 0.06,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: width * 0.04,
    marginVertical: height * 0.015,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.02,
  },
  profileImage: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
  },
  userName: {
    fontSize: width * 0.05,
    fontWeight: "600",
    marginBottom: height * 0.01,
  },
  awardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  awardIcon: {
    width: width * 0.06,
    height: width * 0.06,
  },
  awardText: {
    fontSize: width * 0.035,
    fontWeight: "600",
  },
  subAwardText: {
    fontSize: width * 0.03,
    color: "#596367",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: width * 0.03,
    fontWeight: "600",
  },
  notificationButton: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    bottom: 3,
    left: 12,
    backgroundColor: "red",
    borderRadius: 20,
    width: width * 0.05,
    height: width * 0.05,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationText: {
    fontSize: width * 0.025,
    color: "white",
  },
  bottomSheet: {
    backgroundColor: "rgb(243, 245, 249)",
  },
  bottomSheetContainer: {
    flex: 1,
    padding: width * 0.04,
  },
  profileOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionImage: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    marginVertical: height * 0.004,
  },
  optionText: {
    fontSize: width * 0.04,
    fontWeight: "600",
  },
  newProfileOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  addIcon: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: height * 0.004,
  },
  addIconText: {
    fontSize: width * 0.05,
  },
});
