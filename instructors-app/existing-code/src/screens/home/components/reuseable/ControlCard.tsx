import { Entypo, Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import FilterComponent from "../FilterComponent";
import QuickFilter from "./QuickFilter";
import { SearchComp } from "./SearchComp";

type Props = {
  schoolName?: string;
  dateSchedule?: string;
  markedDates?: string[];
  dateSchedule2?: string;
  queryFilter?: { label: string; num: string }[];
  viewAll?: () => void;
  viewName?: string;
  groupName?: string;
  allNames?: string;
  quickFilter?: { label: string; count: string }[];
  filterName?: string;
  moreInfo?: boolean;
};

const getWeekDates = (baseDate: string) => {
  const startOfWeek = dayjs(baseDate).startOf("week").add(1, "day");
  return Array.from({ length: 7 }).map((_, i) =>
    startOfWeek.add(i, "day").format("YYYY-MM-DD")
  );
};

const ControlCard = ({
  schoolName,
  dateSchedule,
  dateSchedule2,
  markedDates = [],
  queryFilter,
  quickFilter,
  viewName,
  groupName,
  allNames,
  filterName,
  moreInfo,
}: Props) => {
  const today = dayjs().format("YYYY-MM-DD");
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(today);
  const weekDates = getWeekDates(today);
  const [activeSearch, setActiveSearch] = useState(false);
  const [queryText, setQueryText] = useState<string>("");

  const toggleSearch = () => {
    setActiveSearch(!activeSearch);
  };
  const generateMarked = () => {
    let marked: any = {};
    weekDates.forEach((date) => {
      marked[date] = {
        customStyles: {
          container: {
            backgroundColor: date === today ? "#6C51D2" : "white",
            shadowColor:
              markedDates.includes(date) && date !== today
                ? "orange"
                : "transparent",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 4,
            elevation: markedDates.includes(date) ? 5 : 0,
            borderRadius: 20,
          },
          text: {
            color: date === today ? "#fff" : "#333",
            fontWeight: date === today ? "bold" : "normal",
          },
        },
      };
    });
    return marked;
  };

  return (
    <>
      <View style={styles.container}>
        {/* Header */}
        {schoolName && (
          <View className="items-center" style={styles.header}>
            <Text style={styles.schoolName}>{schoolName}</Text>
            {moreInfo == true && (
              <TouchableOpacity style={styles.moreBtn}>
                <Entypo name="dots-three-horizontal" size={15} color="black" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Week Range */}
        {queryFilter && (
          <View className="flex-row items-center justify-between my-2">
            {queryFilter?.map((item, index) => (
              <TouchableOpacity key={index} className="">
                <View className="flex-row items-center justify-between">
                  <Text className="text-[10px] text-[#696969]">
                    {item.label}
                  </Text>
                  <Text className="text-xs text-[#4F2EC9] font-semibold">
                    {item.num}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Views Section */}
        {viewName && (
          <View>
            <Text
              style={{
                fontSize: PixelRatio.getFontScale() * 12,
                paddingBottom: 6,
              }}
            >
              {viewName}
            </Text>

            {/* Filter & Search Section */}
            {activeSearch ? (
              <SearchComp
                setQueryText={setQueryText}
                toggleSearch={toggleSearch}
              />
            ) : (
              <FilterComponent
                groupName={groupName}
                allNames={allNames}
                setActiveSearch={setActiveSearch}
              />
              // ""
            )}
          </View>
        )}

        {/* Week Label */}
        {!activeSearch && dateSchedule && (
          <>
            <View style={styles.row}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Text style={styles.dateSchedule}>{dateSchedule}</Text>
                <Text className="text-[10px]">{dateSchedule2}</Text>
              </View>
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.viewAllText}>View all</Text>
                <Ionicons name="arrow-forward" size={14} color="#4F2EC9" />
              </TouchableOpacity>
            </View>

            {/* Mini Week View */}
            <FlatList
              horizontal
              data={weekDates}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.weekRow}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => {
                const isToday = item === today;
                const isMarked = markedDates.includes(item);
                return (
                  <TouchableOpacity onPress={() => setSelected(item)}>
                    <View
                      className=""
                      style={[
                        styles.dayBox,
                        isToday && { backgroundColor: "#6C51D2" },
                        isMarked && !isToday && styles.shadowBox,
                      ]}
                    >
                      <View style={[!isToday && styles.offShadowBox]}>
                        <Text
                          style={[styles.dayNum, isToday && styles.todayText]}
                        >
                          {dayjs(item).date()}
                        </Text>
                      </View>
                      <Text
                        style={[
                          isToday ? styles.activeDayLabel : styles.dayLabel,
                        ]}
                      >
                        {dayjs(item).format("ddd").toUpperCase()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </>
        )}

        {/* Quick Filter */}
        {quickFilter && (
          <QuickFilter filterName={filterName} quickFilter={quickFilter} />
        )}

        {/* Full Calendar Modal */}
      </View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={18} color="#000" />
            </TouchableOpacity>
          </View>
          <Calendar
            onDayPress={({ day }: any) => setSelected(day.dateString)}
            markedDates={{
              [selected]: {
                selected: true,
                selectedColor: "#6C51D2",
                disableTouchEvent: true,
              },
              ...markedDates.reduce(
                (acc, date) => ({
                  ...acc,
                  [date]: {
                    customStyles: {
                      container: {
                        shadowColor: "orange",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.4,
                        shadowRadius: 4,
                        elevation: 5,
                        backgroundColor: "#fff",
                        borderRadius: 10,
                      },
                    },
                  },
                }),
                {}
              ),
            }}
            markingType="custom"
            theme={{
              backgroundColor: "#EFEFEF",
              calendarBackground: "#EFEFEF",
              arrowColor: "#6C51D2",
              todayTextColor: "#6C51D2",
              textDayFontWeight: "500",
              textMonthFontWeight: "bold",
            }}
          />
        </View>
      </Modal>
    </>
  );
};

export default ControlCard;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 18,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#EFEFEF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  schoolName: {
    fontSize: 14,
    color: "#1E1E1E",
  },
  moreBtn: {
    backgroundColor: "#fff",
    height: 24,
    width: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  dateSchedule: {
    fontSize: 12,
    fontWeight: "500",
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    color: "#8A74DB",
    fontSize: 12,
    marginRight: 4,
  },
  weekRow: {
    marginTop: 12,
    justifyContent: "space-between",
  },
  dayBox: {
    width: 40,
    height: 60,
    marginRight: 12,
    borderRadius: 80,
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  shadowBox: {
    shadowColor: "orange",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  offShadowBox: {
    backgroundColor: "#DCD5F4",
    padding: 7,
    borderRadius: 80,
  },
  dayNum: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    backgroundColor: "#fff",
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 20,
  },
  dayLabel: {
    fontSize: 10,
    color: "#999",
  },
  activeDayLabel: {
    fontSize: 10,
    paddingTop: 6,
    color: "#fff",
  },
  todayText: {
    color: "#000",
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#EFEFEF",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
});
