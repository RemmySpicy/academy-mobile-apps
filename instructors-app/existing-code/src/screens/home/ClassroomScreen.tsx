import { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ClassroomCards from "./components/ClassroomCards";
import ClassroomGrading from "./components/ClassroomGrading";
import ClassroomNotifications from "./components/ClassroomNotifications";
import MyClassroom from "./components/MyClassroom";
import {
  HeaderComponent,
  HeaderWithNotification,
} from "./components/reuseable/HeaderComponent";


const ClassroomScreen = ({}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [gradingModalVisible, setGradingModalVisible] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);

  // const option = [
  //   { label: "Group A-3", count: "group-a" },
  //   { label: "Group B-2", count: "group-b" },
  //   { label: "Group C-4", count: "group-c" },
  //   { label: "+", count: "add-group" },
  // ];
  // const [activeGroup, setActiveGroup] = useState("group-b");
  // const [zeroStar, setZeroStar] = useState(false);
  // const [oneStar, setOneStar] = useState(false);

  // const cards = [
  //   { label: "Classroom", count: 20 },
  //   { label: "Students", count: 12 },
  //   { label: "Instructors", count: 4 },
  // ];
  const cards = [
    {
      year: "Year 1",
      firstRating: "Lowest",
      secondRating: "Highest",
      location: "Caleb British School, Lekki",
      time: "12:00PM - 12:30PM",
      image: require("../../../assets/classroomBoy.png"),
    },
    {
      year: "Year 2",
      firstRating: "Lowest",
      secondRating: "Highest",
      location: "Caleb British School, Lekki",
      time: "12:00PM - 12:30PM",
      image: require("../../../assets/classroomBoy.png"),
    },
    {
      year: "Year 3",
      firstRating: "Lowest",
      secondRating: "Highest",
      location: "Caleb British School, Lekki",
      time: "12:00PM - 12:30PM",
      image: require("../../../assets/classroomBoy.png"),
    },
    {
      year: "Year 4",
      firstRating: "Lowest",
      secondRating: "Highest",
      location: "Caleb British School, Lekki",
      time: "12:00PM - 12:30PM",
      image: require("../../../assets/classroomBoy.png"),
    },
  ];
  const quickFilter = [
    { label: "All Classrooms", count: "" },
    { label: "Honeyland, Magodo", count: "" },
    { label: "Caleb British, Lekki", count: "" },
  ];

  return (
    <SafeAreaView pointerEvents="box-none" className="flex-1">
      <View className="mx-2">
        <HeaderComponent screenTitle="Classroom" />
      </View>
      <ClassroomCards setModalVisible={setModalVisible} />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="bg-white px-2 ">
          <HeaderWithNotification
            notificationHandler={setNotificationModal}
            screenTitle2="My Classroom"
            bell={true}
            handleBack={() => setModalVisible(false)}
          />
        </View>

        <MyClassroom setGradingModalVisible={setGradingModalVisible} />

        <Modal
          visible={gradingModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setGradingModalVisible(false)}
        >
          <ClassroomGrading setGradingModalVisible={setGradingModalVisible} />
        </Modal>

        <Modal
          visible={notificationModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setNotificationModal(false)}
        >
          <ClassroomNotifications setNotificationModal={setNotificationModal} />
        </Modal>
      </Modal>
    </SafeAreaView>
  );
};

export default ClassroomScreen;

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
