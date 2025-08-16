import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ControlCard from "./components/reuseable/ControlCard";
import { HeaderComponent } from "./components/reuseable/HeaderComponent";
import ToggleCard from "./components/reuseable/ToggleCard";

interface Student {
  id: number;
  name: string;
  avatar: any;
}
const AttendanceScreen = () => {
  const [unmarkedStudents, setUnmarkedStudents] = useState([
    {
      id: 1,
      name: "Remilekun Olayinka",
      avatar: require("../../../assets/userEllipse.png"),
    },
    {
      id: 2,
      name: "Remilekun Olayinka",
      avatar: require("../../../assets/userEllipse.png"),
    },
    {
      id: 3,
      name: "Remilekun Olayinka",
      avatar: require("../../../assets/userEllipse.png"),
    },
    {
      id: 4,
      name: "Remilekun Olayinka",
      avatar: require("../../../assets/userEllipse.png"),
    },
    {
      id: 5,
      name: "Remilekun Olayinka",
      avatar: require("../../../assets/userEllipse.png"),
    },
    {
      id: 6,
      name: "Remilekun Olayinka",
      avatar: require("../../../assets/userEllipse.png"),
    },
    {
      id: 7,
      name: "Remilekun Olayinka",
      avatar: require("../../../assets/userEllipse.png"),
    },
  ]);

  const [presentStudents, setPresentStudents] = useState<Student[]>([]);
  const [absentStudents, setAbsentStudents] = useState<Student[]>([]);

  const markAsPresent = (student: Student) => {
    setUnmarkedStudents((prev) => prev.filter((s) => s.id !== student.id));
    setPresentStudents((prev) => [...prev, student]);
  };

  const markAsAbsent = (student: Student) => {
    setUnmarkedStudents((prev) => prev.filter((s) => s.id !== student.id));
    setAbsentStudents((prev) => [...prev, student]);
  };

  const unmarkStudent = (student: Student, from: string) => {
    if (from === "present") {
      setPresentStudents((prev) => prev.filter((s) => s.id !== student.id));
    } else {
      setAbsentStudents((prev) => prev.filter((s) => s.id !== student.id));
    }
    setUnmarkedStudents((prev) => [...prev, student]);
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [unMarkList, setUnMarkList] = useState(true);
  const [markPresent, setMarkPresent] = useState(true);
  const [markAbsent, setMarkAbsent] = useState(false);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 3 + i);
    return date;
  });

  const quickFilter = [
    { label: "Preschool 1 & 2", count: "" },
    { label: "Nursery 1 & 2", count: "" },
    { label: "Caleb British, Lekki", count: "" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View className="mx-4">
        <HeaderComponent screenTitle="Attendance" />
      </View>

      <ScrollView>
        <ControlCard
          schoolName="Sachos Academy School, Magodo"
          filterName={"Quick Filter"}
          quickFilter={quickFilter}
          moreInfo={true}
          viewName="Views"
          groupName="Classrooms"
          allNames="All Locations"
          dateSchedule="December 18 - 22:"
          dateSchedule2="This Week"
        />

        <View className="mx-4 mt-2">
          <ToggleCard
            title="Unmarked List"
            count={unmarkedStudents.length}
            widthPercentage={0.42}
            initialExpanded={unMarkList}
            onToggle={setUnMarkList}
          />
          {unMarkList &&
            unmarkedStudents.map((student) => (
              <View key={student.id} style={styles.studentItem}>
                <View style={styles.studentInfo}>
                  <Image
                    source={
                      typeof student.avatar === "string"
                        ? { uri: student.avatar }
                        : student.avatar
                    }
                    style={styles.studentAvatar}
                  />
                  <Text style={styles.studentName}>{student.name}</Text>
                </View>
                <View className="flex-row items-center space-x-1">
                  <TouchableOpacity
                    onPress={() => markAsPresent(student)}
                    className="bg-[#4F2EC9] rounded-sm px-2 py-1"
                  >
                    <Text className="text-[10px] text-[#FAFAFA]">Present</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => markAsAbsent(student)}
                    className="bg-[#444444] rounded-sm px-2 py-1"
                  >
                    <Text className="text-[10px] text-[#FAFAFA]">Absent</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
        </View>

        <View className="mx-4 my-2">
          <ToggleCard
            title="Mark Present"
            count={presentStudents.length}
            widthPercentage={0.42}
            initialExpanded={markPresent}
            onToggle={setMarkPresent}
          />

          {markPresent &&
            presentStudents.map((student) => (
              <View key={student.id} style={styles.studentItem}>
                <View style={styles.studentInfo}>
                  <Image
                    source={
                      typeof student.avatar === "string"
                        ? { uri: student.avatar }
                        : student.avatar
                    }
                    style={styles.studentAvatar}
                  />
                  <Text style={styles.studentName}>{student.name}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => unmarkStudent(student, "present")}
                  className="bg-[#B4B4B4] rounded-sm px-2 py-1"
                >
                  <Text className="text-[10px] text-[#FAFAFA]">Unmark</Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>

        <View className="mx-4">
          <ToggleCard
            title="Mark Absent"
            count={absentStudents.length}
            widthPercentage={0.42}
            initialExpanded={markAbsent}
            onToggle={setMarkAbsent}
          />
          {markAbsent &&
            absentStudents.map((student) => (
              <View key={student.id} style={styles.studentItem}>
                <View style={styles.studentInfo}>
                  <Image
                    source={
                      typeof student.avatar === "string"
                        ? { uri: student.avatar }
                        : student.avatar
                    }
                    style={styles.studentAvatar}
                  />
                  <Text style={styles.studentName}>{student.name}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => unmarkStudent(student, "absent")}
                  className="bg-[#8F8F8F] rounded-sm px-2 py-1"
                >
                  <Text className="text-[10px] text-[#FAFAFA]">Unmark</Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AttendanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1e293b",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  schoolInfo: {
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  schoolName: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 4,
  },
  viewsText: {
    fontSize: 14,
    color: "#94a3b8",
  },
  dateScroller: {
    // paddingHorizontal: 6,
    marginBottom: 4,
  },
  dateButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: "#fff",
    minWidth: 60,
  },
  selectedDate: {
    backgroundColor: "#6366f1",
  },
  dateDay: {
    // fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  dateNumber: {
    // fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  selectedDateText: {
    color: "#fff",
  },
  selectedDateNum: {
    color: "#000",
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginRight: 8,
  },
  listCount: {
    fontSize: 14,
    color: "#64748b",
  },
  studentList: {
    paddingHorizontal: 20,
  },
  studentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  studentName: {
    fontSize: 14,
    color: "#1e293b",
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  presentButton: {
    backgroundColor: "#22c55e",
  },
  absentButton: {
    backgroundColor: "#ef4444",
  },
});
