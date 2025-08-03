import Ionicons from "@expo/vector-icons/Ionicons";
import BottomSheet, {
  BottomSheetView
} from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptySearchResult from "./components/EmptySearchResult";
import NurserySchool from "./components/NurserySchool";
import PreSchool from "./components/PreSchool";
import SearchQuery from "./components/SearchQuery";
import StudentCard from "./components/StudentCard";
import StudentProfile from "./components/StudentProfile";
import { HeaderComponent } from "./components/reuseable/HeaderComponent";
import { StacticSearchComp } from "./components/reuseable/SearchComp";
import ToggleCard from "./components/reuseable/ToggleCard";

interface students {
  id: number;
  name: string;
  attendance: string;
  payment: string;
  session: number;
  absence: number;
  attended: number;
  image: string;
}
const { width, height } = Dimensions.get("window");
const StudentsScreen = () => {
  const [preSchool, setPreSchool] = useState(false);
  const [nurserySchool, setNurserySchool] = useState(true);
  const [activeSearch, setActiveSearch] = useState(false);
  const [modalProfileVisible, setModalProfileVisible] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const paymentBottomSheetRef = useRef<BottomSheet>(null);
  const classroomBottomSheetRef = useRef<BottomSheet>(null);

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

  const handlePaymentBottomNav = () => {
    paymentBottomSheetRef.current?.expand();
  };

  const handleClassroomBottomNav = () => {
    classroomBottomSheetRef.current?.expand();
  };

  const students = [
    {
      id: 1,
      name: "Benson Showole",
      level: "Level 2: Class 3",
      attendance: "30%",
      payment: "Fully Paid",
      mode: "School",
      remaining: 1,
      absence: 2,
      attended: 5,
      image: require("../../../assets/userEllipse.png"),
    },
    {
      id: 2,
      name: "Benson Showole",
      level: "Level 2: Class 3",
      attendance: "30%",
      payment: "Fully Paid",
      mode: "Private",
      remaining: 1,
      absence: 2,
      attended: 5,
      image: require("../../../assets/userEllipse.png"),
    },

    {
      id: 1,
      name: "Benson Showole",
      level: "Level 2: Class 3",
      attendance: "30%",
      payment: "Fully Paid",
      mode: "Group",
      remaining: 1,
      absence: 2,
      attended: 5,
      image: require("../../../assets/userEllipse.png"),
    },
  ];

  const studentII = [
    {
      id: 1,
      name: "Benson Showole",
      level: "Level 2: Class 3",
      attendance: "30%",
      payment: "UnPaid",
      mode: "School",
      remaining: 1,
      absence: 2,
      attended: 5,
      image: require("../../../assets/userEllipse.png"),
    },
    {
      id: 2,
      name: "Benson Showole",
      level: "Level 2: Class 3",
      attendance: "30%",
      payment: "Unpaid",
      mode: "Private",
      remaining: 1,
      absence: 2,
      attended: 5,
      image: require("../../../assets/userEllipse.png"),
    },

    {
      id: 1,
      name: "Benson Showole",
      level: "Level 2: Class 3",
      attendance: "30%",
      payment: "Unpaid",
      mode: "Group",
      remaining: 1,
      absence: 2,
      attended: 5,
      image: require("../../../assets/userEllipse.png"),
    },
  ];
  const toggleSearch = () => {
    setActiveSearch(!activeSearch);
  };

  const [searchQuery, setSearchQuery] = useState<typeof students>([]);
  const [queryText, setQueryText] = useState<string>("");

  const handleSearch = () => {
    // Filter students based on search query
    const filteredStudents = students.filter((student) =>
      student.name.toLowerCase().includes(queryText.toLowerCase())
    );
    setSearchQuery(filteredStudents);
  };

  useEffect(() => {
    handleSearch();
  }, [queryText]);

  // filter
  const groups = ["No Groups", "Classroom", "Payment", "Tutor"];
  const payment = ["Unpaid", "Partially Paid", "Fully Paid"];
  const classroom = [
    "All Classes",
    "Preschool 1 & 2 (11am - 12pm)",
    "Nursery 1 & 2  (12pm - 1pm)",
    "Afternoon Private Class (1pm - 2pm)",
    "Afternoon Group Class (3pm - 4:30pm)",
    "Year 4",
    "Year 5",
  ];
  const [activeGroup, setActiveGroup] = useState("Classroom");
  const [activePaymentGroup, setActivePaymentGroup] = useState("Unpaid");
  const [activeClassroomGroup, setActiveClassroomGroup] =
    useState("All Classes");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="mx-4">
        <HeaderComponent screenTitle="Students" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="mb-4 mx-4">
          {/* search bar */}
          {activeSearch ? (
            <StacticSearchComp
              setQueryText={setQueryText}
              toggleSearch={toggleSearch}
            />
          ) : (
            <StudentCard
              activeGroup={activeGroup}
              setActiveSearch={setActiveSearch}
              activePaymentGroup={activePaymentGroup}
              setPreSchool={setPreSchool}
              preSchool={preSchool}
              handleBottomNav={handleBottomNav}
              setModalProfileVisible={setModalProfileVisible}
            />
          )}
        </View>

        {activeSearch !== true && preSchool && (
          <PreSchool
            setModalProfileVisible={setModalProfileVisible}
            students={students}
          />
        )}

        {activeSearch !== true && (
          <View className="mx-4 mb-4">
            <ToggleCard
              title="Nursery 1&2"
              count={10}
              initialExpanded={nurserySchool}
              onToggle={setNurserySchool}
              widthPercentage={0.4}
            />
          </View>
        )}

        {activeSearch !== true && nurserySchool && (
          <NurserySchool
            studentII={studentII}
            setModalProfileVisible={setModalProfileVisible}
          />
        )}

        {queryText.length > 1 && <SearchQuery searchQuery={searchQuery} />}

        {activeSearch && queryText.length < 1 && <EmptySearchResult />}
      </ScrollView>

      {modalProfileVisible && (
        <View style={{ position: "absolute", zIndex: 999, elevation: 10 }}>
          <StudentProfile setModalProfileVisible={setModalProfileVisible} />
        </View>
      )}

      {/* Bottom Sheet for Group Selection */}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["20%", "40%"]}
        onChange={handleSheetChanges}
        enablePanDownToClose
        index={-1}
        backgroundStyle={styles.bottomSheet}
        handleIndicatorStyle={{
          backgroundColor: "#444444",
          width: 80,
          height: 6,
          borderRadius: 4,
          alignSelf: "center",
        }}
      >
        <BottomSheetView style={styles.bottomSheetContainer}>
          <View className="px-4">
            <Text className="pb-3 text-[#696969]">Group By:</Text>
            {groups.map((group, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setActiveGroup(group);
                  if (group === "Payment") {
                    handlePaymentBottomNav();
                  }
                  bottomSheetRef.current?.close();

                  if (group === "Classroom") {
                    handleClassroomBottomNav();
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
              </TouchableOpacity>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheet>

      {/* Bottom Sheet for Payment Selection */}
      <BottomSheet
        ref={paymentBottomSheetRef}
        snapPoints={["20%", "30%"]}
        onChange={handleSheetChanges}
        enablePanDownToClose
        index={-1}
        backgroundStyle={styles.bottomSheet}
        handleIndicatorStyle={{
          backgroundColor: "#444444",
          width: 80,
          height: 6,
          borderRadius: 4,
          alignSelf: "center",
        }}
      >
        <BottomSheetView style={styles.bottomSheetContainer}>
          <View className="px-4">
            <Text className="pb-6 text-[#696969]">Select Payment Status</Text>
            {payment.map((group, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setActivePaymentGroup(group);
                  paymentBottomSheetRef.current?.close();
                }}
                style={styles.smallCard}
                className="flex flex-row justify-between items-center"
              >
                <Text className="font-semibold">{group}</Text>
                {activePaymentGroup === group && (
                  <Ionicons
                    name="checkmark-circle-sharp"
                    size={18}
                    color="#6C51D2"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheet>

      {/* Bottom Sheet for Classroom Selection */}
      <BottomSheet
        ref={classroomBottomSheetRef}
        snapPoints={["20%", "40%"]}
        onChange={handleSheetChanges}
        enablePanDownToClose
        index={-1}
        backgroundStyle={styles.bottomSheet}
        handleIndicatorStyle={{
          backgroundColor: "#444444",
          width: 80,
          height: 6,
          borderRadius: 4,
          alignSelf: "center",
        }}
      >
        <BottomSheetView style={styles.bottomSheetContainer}>
          <View className="px-4">
            <Text className="pb-6 text-[#696969]">
              Select Schedule / Classroom
            </Text>
            {classroom.map((group, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setActiveClassroomGroup(group);
                  classroomBottomSheetRef.current?.close();
                }}
                style={styles.smallCard}
                className="flex flex-row justify-between items-center"
              >
                <Text className="font-semibold">{group}</Text>
                {activeClassroomGroup === group && (
                  <Ionicons
                    name="checkmark-circle-sharp"
                    size={18}
                    color="#6C51D2"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheet>
      {/* </View> */}
    </SafeAreaView>
  );
};

export default StudentsScreen;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 4,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
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

  bottomSheet: {
    backgroundColor: "rgb(243, 245, 249)",
    borderRadius: 30,
  },
  bottomSheetContainer: {
    flex: 1,
    padding: width * 0.04,
  },
});
