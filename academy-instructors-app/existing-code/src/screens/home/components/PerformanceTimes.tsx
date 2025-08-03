import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Pressable,
  Modal,
  SafeAreaView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import PerformanceChart from "../../../components/charts/PerformanceChart";

const { width, height } = Dimensions.get("window");

const PerformanceTimes = ({
  performanceTimes,
  setPerformanceTimes,
  metricsData,
}: any) => {
  return (
    <Modal
      animationType="slide"
      visible={performanceTimes}
      transparent={true}
      onRequestClose={() => setPerformanceTimes(false)}
    >
      <SafeAreaView className="flex-1 bg-white">
        <View style={styles.cont} className="flex-row">
          <Pressable onPress={() => setPerformanceTimes(false)}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </Pressable>
          <View className="flex-col mx-auto">
            <Text style={styles.modalTitle}>50m Breaststroke</Text>
            <Text style={styles.modalSubtitle}>25m pool</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.performanceSection}>
            <View>
              <Text className="text-[#1E1E1E] font-semibold">BEST TIME</Text>
              <Text style={styles.bestTime}>00:26.30</Text>
              <Text style={styles.dateText}>04 Feb 2023</Text>
            </View>

            <View className="flex-row items-center gap-4">
              <View>
                <View className="w-5 h-5 bg-[#DCF9F1] rounded-full flex items-center justify-center">
                  <View className="w-3 h-3 bg-[#A8F0DD] rounded-full"></View>
                </View>
              </View>
              <View className="items-end ">
                <Text className="text-[21px] sm:text-[24px]">00:26.30</Text>
                <Text className="text-[#444444] text-[10px]">Club Record</Text>
              </View>
            </View>
          </View>

          <PerformanceChart />

          <View className="flex flex-row justify-between gap-2 mt-2">
            <View className="rounded-lg flex flex-row items-center bg-[#FEFEFE] border border-[#EFEFEF] py-3 pl-3 pr-14">
              <View className="flex flex-row gap-2 items-center">
                <View className="w-5 h-5 bg-[#DCF9F1] rounded-full flex items-center justify-center">
                  <View className="w-3 h-3 bg-[#A8F0DD] rounded-full"></View>
                </View>

                <View>
                  <Text className="text-[#444444] text-[14px]">00:26.30</Text>
                  <Text className="text-[#8F8F8F] text-[8px]">Your Goal</Text>
                </View>
              </View>
            </View>
            <View className="rounded-lg flex flex-row items-center bg-[#FEFEFE] border border-[#EFEFEF] p-3">
              <View className="flex flex-row gap-3 items-center">
                <View className="w-5 h-5 bg-[#DCF9F1] rounded-full flex items-center justify-center">
                  <View className="w-3 h-3 bg-[#A8F0DD] rounded-full"></View>
                </View>

                <View>
                  <Text className="text-[#444444] text-[14px]">00:26.30</Text>
                  <Text className="text-[#8F8F8F] text-[8px]">04 Feb 2021</Text>
                </View>

                <View>
                  <Text className="text-[#FF3B30] text-[14px]">+00:26.30</Text>
                  <Text className="text-[#8F8F8F] text-[8px]">
                    Goal Missed by
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="my-6">
            <Text className="font-semibold pb-2 text-[#444444]">All times</Text>

            {metricsData.map((data: any, i: number) => (
              <View key={i} style={[styles.card, { width: width * 0.9 }]}>
                <View style={styles.cardContent}>
                  <View style={styles.leftSection}>
                    <View style={styles.timeContainer}>
                      <Text style={styles.timeText}>{data.time}</Text>
                      {data.PB && (
                        <View style={styles.pbBadge}>
                          <Text style={styles.pbText}>PB</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.splitContainer}>
                      <Text style={styles.splitText}>{data.splitTime}</Text>
                    </View>
                    <Text style={styles.pointsText}>{data.points}</Text>
                  </View>

                  <View style={styles.rightSection}>
                    <Text style={styles.dateText}>{data.date}</Text>
                    <Text style={styles.heatText}>{data.heat}</Text>
                    <Text style={styles.meetText}>{data.meet}</Text>
                    <Text style={styles.locationText}>{data.location}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default PerformanceTimes;

const styles = StyleSheet.create({
  cont: {
    flexGrow: 1,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: width * 0.03,
    color: "#696969",
    textAlign: "center",
  },
  performanceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: height * 0.02,
  },

  bestTime: {
    // fontSize: width * 0.07,
    fontSize: 38,
    color: "#8A74DB",
    fontWeight: "bold",
  },
  dateText: {
    fontSize: width * 0.03,
    color: "#444444",
  },
  allTimesContainer: {
    marginTop: height * 0.03,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: height * 0.02,
    padding: width * 0.04,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftSection: {
    justifyContent: "center",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  timeText: {
    fontSize: width * 0.06,
    fontWeight: "600",
    color: "#8A74DB",
  },
  pbBadge: {
    backgroundColor: "#6FE7C6",
    borderRadius: 15,
    width: width * 0.08,
    height: width * 0.08,
    justifyContent: "center",
    alignItems: "center",
  },
  pbText: {
    color: "white",
    fontSize: width * 0.03,
    fontWeight: "bold",
  },

  heatText: {
    fontSize: 10,
    color: "#333",
    marginBottom: 4,
    fontWeight: "bold",
  },
  meetText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  locationText: {
    fontSize: 8,
    color: "#999",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  splitContainer: {
    backgroundColor: "#8A74DB",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  splitText: {
    color: "white",
    fontSize: 8,
    fontWeight: "500",
  },
  pointsText: {
    fontSize: 8,
    color: "#666",
  },
});
