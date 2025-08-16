import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResponsiveDimensions } from "../../hooks/useResponsiveDimensions";
import Performance from "./components/Performance";
import PerformanceTimes from "./components/PerformanceTimes";

const PerformanceScreen = () => {
  const [openPerformance, setOpenPerformance] = useState(false);
  const [activeStrokeTab, setActiveStrokeTab] = useState("Single Arm Free");
  const [activeTab, setActiveTab] = useState("Stroke");
  const [activeTimesTab, setActiveTimesTab] = useState("Free");
  const [addPerformanceTab, setAddPerformanceTab] = useState(false);
  const [performanceTimes, setPerformanceTimes] = useState(false);
  const metricsData = [
    {
      time: "00:26.30",
      PB: "PB",
      splitTime: "-00.16",
      points: "4B4 FINA POINTs",
      date: "04 Feb 2025",
      heat: "Heat 12",
      meet: "East Lothian Meet",
      location: "Bathgate",
    },
    {
      time: "00:26.30",
      splitTime: "-00.16",
      points: "4B4 FINA POINTs",
      date: "04 Feb 2025",
      heat: "Heat 12",
      meet: "East Lothian Meet",
      location: "Bathgate",
    },
    {
      time: "00:26.30",
      splitTime: "-00.16",
      points: "4B4 FINA POINTs",
      date: "04 Feb 2025",
      heat: "Heat 12",
      meet: "East Lothian Meet",
      location: "Bathgate",
    },
  ];

  const strokeTabs = ["Single Arm Free", "Fly", "Back", "IM"];
  const timesTabs = ["Free", "Breast", "Back", "Fly", "IM"];

  const handleStrokeTabChange = (tabs: string) => {
    setActiveStrokeTab(tabs);
  };
  const handleTimesTabChange = (tabs: string) => {
    setActiveTimesTab(tabs);
  };
  const handleTabChange = (tabs: string) => {
    setActiveTab(tabs);
  };

  const { width } = useResponsiveDimensions();
  return (
    <SafeAreaView className="flex-1 ">
      <Performance
        strokeTabs={strokeTabs}
        timesTabs={timesTabs}
        activeTimesTab={activeTimesTab}
        handleTimesTabChange={handleTimesTabChange}
        handleTabChange={handleTabChange}
        handleStrokeTabChange={handleStrokeTabChange}
        activeStrokeTab={activeStrokeTab}
        activeTab={activeTab}
        setOpenPerformance={setOpenPerformance}
        setPerformanceTimes={setPerformanceTimes}
      />
      {performanceTimes && (
        <PerformanceTimes
          performanceTimes={performanceTimes}
          setPerformanceTimes={setPerformanceTimes}
          metricsData={metricsData}
        />
      )}
    </SafeAreaView>
  );
};

export default PerformanceScreen;

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
    padding: 16,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftSection: {
    flex: 1,
    justifyContent: "center",
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "center",
    paddingVertical: 5,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  timeText: {
    fontSize: 21,
    fontWeight: "600",
    color: "#8A74DB",
    marginRight: 8,
  },
  pbBadge: {
    backgroundColor: "#6FE7C6",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  pbText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
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
  dateText: {
    fontSize: 8,
    color: "#333",
    marginBottom: 4,
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
});
