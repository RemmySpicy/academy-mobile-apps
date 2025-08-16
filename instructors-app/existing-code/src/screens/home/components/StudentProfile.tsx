import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AwardIcon from "../../../../assets/award.svg";
import CameraIcon from "../../../../assets/camera.svg";
import ChartSquare from "../../../../assets/chart-square.svg";
import CheckMarker from "../../../../assets/CheckMarker.svg";
import Edit from "../../../../assets/edit.svg";
import Ten from "../../../../assets/ten.svg";
import Thirty from "../../../../assets/thirty.svg";
import Twenty from "../../../../assets/twenty.svg";
import CustomCalendar from "./CustomCalender";

export default function StudentProfile({
  modalProfileVisible,
  setModalProfileVisible,
}: any) {
  const { width } = useWindowDimensions();

  return (
    <Modal
      visible={modalProfileVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalProfileVisible(false)}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setModalProfileVisible(false)}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-[20px] font-semibold">Student Profile</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Section */}
          <View className="px-4 pt-2">
            <View className="flex-row justify-between items-center px-4 pt-4 pb-14 rounded-t-2xl w-full bg-[#D9D9D9]">
              <View className="flex-row top-11 left-2 z-50 items-end absolute">
                <Image
                  source={require("../../../../assets/userEllipse.png")}
                  style={styles.profileImage}
                />
                <TouchableOpacity className="bg-white p-1 absolute right-0 rounded-full">
                  <CameraIcon width={20} height={20} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity className="bg-white ml-auto top-12 p-1 rounded-full">
                <CameraIcon width={20} height={20} />
              </TouchableOpacity>
            </View>

            <View className="bg-[#EFEFEF] rounded-b-3xl px-4 pt-8 pb-4 flex-1">
              <View style={styles.nameContainer}>
                <Text className="text-[20px] font-semibold pb-1">
                  Benson Adeyemi
                </Text>
                <TouchableOpacity className="bg-white rounded-full p-1">
                  <Edit width={14} height={14} />
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center gap-1">
                <AwardIcon width={22} height={22} />
                <View>
                  <Text className="text-[12px] font-semibold">
                    Level 2: Fundamental Aquatic Skills
                  </Text>
                  <Text className="text-[10px] pb-2 text-[#444444]">
                    Class 3: Introduction to Breaststroke
                  </Text>
                </View>
              </View>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>18 / 46</Text>
              </View>
              <View className="border border-[#DCD5F4] flex-row items-center py-1.5 mx-auto w-full rounded-lg justify-center">
                <ChartSquare width={22} height={22} />
                <Text style={styles.profileActionText}>
                  See Performance metrics
                </Text>
              </View>
            </View>
          </View>

          {/* Mentors Section */}
          <View className="flex-row my-4 justify-between px-6">
            <View
              style={styles.mentorCard}
              className="shadow-sm space-y-2 rounded-md py-1 px-3 flex-row gap-1"
            >
              <Image
                source={require("../../../../assets/userEllipse.png")}
                style={styles.mentorImage}
              />
              <View>
                <Text className="text-[10px] text-[#696969]">Parent</Text>
                <Text style={styles.mentorName}>Remilekun Olayinka</Text>
              </View>
            </View>
            <View
              style={styles.mentorCard}
              className="shadow-sm space-y-2 rounded-md py-1 px-3 flex-row gap-1"
            >
              <Image
                source={require("../../../../assets/userEllipse.png")}
                style={styles.mentorImage}
              />
              <View>
                <Text className="text-[10px] text-[#696969]">Instructor</Text>
                <Text style={styles.mentorName}>Christiana Olopade</Text>
              </View>
            </View>
          </View>

          {/* Progress Summary */}
          <Text className="text-[16px] font-semibold px-4">
            Progress Summary
          </Text>
          <View style={styles.sectionContainer}>
            <View>
              <View className="mb-6">
                <View style={styles.termSelector}>
                  <Text className="font-extrabold" style={styles.termText}>
                    Dec 1 till Date (Current Term)
                  </Text>
                  <View className="flex-row gap-3 items-center">
                    <TouchableOpacity className="bg-white rounded-full p-1">
                      <Ionicons name="chevron-back" size={15} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-white rounded-full p-1">
                      <Ionicons name="chevron-forward" size={15} color="#000" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <Text className="pb-2 font-semibold">Overview</Text>
              <View style={styles.overviewGrid}>
                <View style={styles.overviewItem}>
                  <View style={[styles.overviewIcon]}>
                    <Image source={require("../../../../assets/swim.png")} />
                  </View>
                  <View>
                    <Text style={styles.overviewValue}>8</Text>
                    <Text style={styles.overviewLabel}>Improved Lessons</Text>
                  </View>
                </View>
                <View style={styles.overviewItem}>
                  <View style={[styles.overviewIcon]}>
                    <MaterialCommunityIcons
                      name="star"
                      size={16}
                      color="#FA8C16"
                    />
                  </View>
                  <View>
                    <Text style={styles.overviewValue}>15</Text>
                    <Text style={styles.overviewLabel}>Earned Stars</Text>
                  </View>
                </View>
                <View style={styles.overviewItem}>
                  <View style={[styles.overviewIcon]}>
                    <MaterialCommunityIcons
                      name="star"
                      size={16}
                      color="#FA8C16"
                    />
                  </View>
                  <View>
                    <Text style={styles.overviewValue}>6</Text>
                    <Text style={styles.overviewLabel}>New Achievements</Text>
                  </View>
                </View>
                <View style={styles.overviewItem}>
                  <View style={[styles.overviewIcon]}>
                    <Image source={require("../../../../assets/swim.png")} />
                  </View>
                  <View>
                    <Text style={styles.overviewValue}>18</Text>
                    <Text style={styles.overviewLabel}>Watermanship Point</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Timeline */}
            <View>
              <Text className="py-2 text-[16px]">Timeline</Text>
              <View className="bg-white p-2 rounded-lg">
                <View style={styles.timelineHeader}>
                  <Text style={styles.timelineHeaderText}>Activity</Text>
                  <View style={styles.timelineHeaderRight}>
                    <Text style={styles.timelineHeaderText}>Gain/Loss</Text>
                    <Text style={styles.timelineHeaderText}>Current</Text>
                  </View>
                </View>

                <View style={styles.timelineItem}>
                  <View className="flex-row flex-1 gap-2">
                    <View>
                      {/* <FontAwesome
                        name="check-circle"
                        size={24}
                        color="#722ED1"
                      /> */}
                      <CheckMarker width={24} height={24} />
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineTitle}>Level 1 Class 2</Text>
                      <Text style={styles.timelineSubtitle}>
                        Introduction to Freestyle
                      </Text>
                    </View>
                  </View>
                  <View style={styles.timelineItemRight}>
                    <View style={styles.diffIndicator}>
                      <Text style={[styles.diffText, { color: "#52C41A" }]}>
                        +1
                      </Text>
                    </View>
                    <View style={styles.currentRating}>
                      <MaterialCommunityIcons
                        name="star"
                        size={16}
                        color="#FA8C16"
                      />
                      <Text style={styles.currentRatingText}>3</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.timelineItem}>
                  <View className="flex-row flex-1 gap-2">
                    <View>
                      <CheckMarker width={24} height={24} />
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineTitle}>Performance</Text>
                      <Text style={styles.timelineSubtitle}>
                        Freestyle Right - 50m
                      </Text>
                    </View>
                  </View>
                  <View style={styles.timelineItemRight}>
                    <View style={styles.diffIndicator}>
                      <Text style={[styles.diffText, { color: "#F5222D" }]}>
                        -2
                      </Text>
                    </View>
                    <View style={styles.currentRating}>
                      <Image source={require("../../../../assets/swim.png")} />
                      <Text style={styles.currentRatingText}>21</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.timelineItem}>
                  <View className="flex-row flex-1 gap-2">
                    <CheckMarker width={24} height={24} />

                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineTitle}>Level 1 Class 2</Text>
                      <Text style={styles.timelineSubtitle}>
                        Introduction to Freestyle
                      </Text>
                    </View>
                  </View>
                  <View style={styles.timelineItemRight}>
                    <View style={styles.diffIndicator}>
                      <Text style={[styles.diffText, { color: "#52C41A" }]}>
                        +1
                      </Text>
                    </View>
                    <View style={styles.currentRating}>
                      <MaterialCommunityIcons
                        name="star"
                        size={16}
                        color="#FA8C16"
                      />
                      <Text style={styles.currentRatingText}>5</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Attendance */}
          <View className="px-6 py-4">
            <Text className="text-[#1E1E1E] pb-2 text-[16px] font-semibold">
              Attendance
            </Text>
            <View className="flex-row justify-between">
              <Text className="text-[12px]">Attendance: 5</Text>
              <Text className="text-[12px]">Remaining: 3</Text>
              <Text className="text-[12px]">Remaining: 3</Text>
            </View>
          </View>

          <View className="">
            <CustomCalendar />
          </View>

          {/* <View className="mx-4 mb-6">
            <Calendar
              onDayPress={({ day }: any) => {
                setSelected(day.dateString);
              }}
              markedDates={{
                [selected]: {
                  selected: true,
                  disableTouchEvent: true,
                  selectedDotColor: "orange",
                },
              }}
              theme={{
                backgroundColor: "#EFEFEF",
                calendarBackground: "#EFEFEF",
                textSectionTitleColor: "#b6c1cd",
                selectedDayBackgroundColor: "#6C5CE7",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#6C5CE7",
                dayTextColor: "#2d4150",
                textDisabledColor: "#d9e1e8",
                dotColor: "#6C5CE7",
                selectedDotColor: "#ffffff",
                arrowColor: "#6C5CE7",
                monthTextColor: "#2d4150",
                indicatorColor: "#6C5CE7",
                textDayFontWeight: "300",
                textMonthFontWeight: "bold",
                textDayHeaderFontWeight: "300",
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 14,
              }}
            />
          </View> */}

          <View className="m-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-[#1E1E1E] text-[16px]">Achievements</Text>
              <Text className="text-[#4F2EC9] text-[12px]">See more</Text>
            </View>

            <View className="border border-[#FAFAFA] rounded-lg flex-row justify-between my-4 space-x-2">
              <View className="text-center justify-center items-center">
                <Ten width={80} height={80} />
                <View>
                  <Text className="font-semibold text-center text-[12px]">
                    Perfect Lessons
                  </Text>
                  <Text className="text-[10px] text-center">Dec 10, 2022</Text>
                </View>
              </View>
              <View className="text-center justify-center items-center">
                <Thirty width={80} height={80} />
                <View>
                  <Text className="font-semibold text-center text-[12px]">
                    Perfect Lessons
                  </Text>
                  <Text className="text-[10px] text-center">Dec 10, 2022</Text>
                </View>
              </View>
              <View className="text-center justify-center items-center">
                <Twenty width={80} height={80} />
                <View>
                  <Text className="font-semibold text-center text-[12px]">
                    Perfect Lessons
                  </Text>
                  <Text className="text-[10px] text-center">Dec 10, 2022</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },

  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FF6B35",
  },

  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: "Roboto-Medium",
    color: "#000",
    marginLeft: 4,
  },

  profileActionText: {
    fontSize: 12,
    fontFamily: "Roboto-Regular",
    color: "#666",
    marginLeft: 6,
  },

  mentorCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mentorImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginBottom: 4,
  },
  mentorName: {
    fontSize: 12,
    fontFamily: "Roboto-Medium",
    color: "#696969",
    textAlign: "center",
  },
  sectionContainer: {
    backgroundColor: "#EFEFEF",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  termSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  termText: {
    fontSize: 14,
    fontFamily: "Roboto-Medium",
    color: "#000",
  },
  overviewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  overviewItem: {
    width: "48%",
    flexDirection: "row",
    // backgroundColor: "#FAFAFA",
    borderColor: "#B4B4B4",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 12,
  },
  overviewIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  overviewValue: {
    fontSize: 12,
    fontFamily: "Roboto-Bold",
    color: "#000",
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 10,
    fontFamily: "Roboto-Regular",
    color: "#666",
  },
  timelineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    borderColor: "#D2D2D2",
    borderBottomWidth: 1,
    paddingBottom: 2,
  },
  timelineHeaderText: {
    fontSize: 12,
    fontFamily: "Roboto-Regular",
    color: "#666",
    marginLeft: 12,
  },
  timelineHeaderRight: {
    flexDirection: "row",
    width: 120,
    justifyContent: "space-between",
  },
  timelineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  timelineDotText: {
    fontSize: 12,
    fontFamily: "Roboto-Bold",
    color: "#fff",
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontFamily: "Roboto-Medium",
    color: "#000",
  },
  timelineSubtitle: {
    fontSize: 12,
    fontFamily: "Roboto-Regular",
    color: "#666",
  },
  timelineItemRight: {
    flexDirection: "row",
    width: 120,
    justifyContent: "space-between",
    alignItems: "center",
  },
  diffIndicator: {
    width: 40,
    alignItems: "center",
  },
  diffText: {
    fontSize: 14,
    fontFamily: "Roboto-Medium",
  },
  currentRating: {
    flexDirection: "row",
    alignItems: "center",
    width: 40,
  },
  currentRatingText: {
    fontSize: 14,
    fontFamily: "Roboto-Medium",
    color: "#000",
    marginLeft: 4,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  calendarHeaderText: {
    fontSize: 12,
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
    backgroundColor: "#722ED1",
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
