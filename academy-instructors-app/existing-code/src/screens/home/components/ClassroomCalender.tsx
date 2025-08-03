import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const { width } = Dimensions.get("window");
const DAY_SIZE = (width - 40) / 7;

const ClassroomCalender = () => {
  // Use current date
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [highlightedDates, setHighlightedDates] = useState({});

  // Generate highlighted dates for the current month
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);

    // Generate some dates to highlight (every 3rd day is purple, 11th is red)
    const newHighlightedDates = {};

    for (let i = 1; i <= daysInMonth; i++) {
      if (i % 3 === 1) {
        newHighlightedDates[i.toString()] = "purple";
      } else if (i === 11) {
        newHighlightedDates[i.toString()] = "red";
      }
    }

    setHighlightedDates(newHighlightedDates);
  }, [currentMonth]);

  const getDaysInMonth = useCallback((year, month) => {
    return new Date(year, month + 1, 0).getDate();
  }, []);

  const getFirstDayOfMonth = useCallback((year, month) => {
    // Get day of week (0-6, where 0 is Sunday)
    const day = new Date(year, month, 1).getDay();
    // Convert to 0-6 where 0 is Monday
    return day === 0 ? 6 : day - 1;
  }, []);

  const formatMonthYear = useCallback((date) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }, []);

  // Get the suffix for the date (st, nd, rd, th)
  const getSuffix = useCallback((day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }, []);

  // Format the header title
  const headerTitle = useMemo(() => {
    const today = new Date();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[currentMonth.getMonth()];
    const date = today.getDate();
    const suffix = getSuffix(date);

    return `${month} ${date}${suffix} till date (Current Term)`;
  }, [currentMonth, getSuffix]);

  const renderDays = useCallback(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];

    // Add empty spaces for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayContainer} />);
    }

    // Get current date to highlight today
    const today = new Date();
    const isCurrentMonth =
      today.getMonth() === month && today.getFullYear() === year;
    const currentDate = today.getDate();

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = i.toString();
      const isHighlighted = highlightedDates[dateString];
      const isToday = isCurrentMonth && i === currentDate;

      days.push(
        <View key={`day-${i}`} style={styles.dayContainer}>
          <View
            style={[
              styles.day,
              isHighlighted && {
                backgroundColor:
                  isHighlighted === "purple" ? "#e6e1ff" : "#ffcccb",
              },
              isToday && styles.today,
            ]}
          >
            <Text style={[styles.dayText, isToday && styles.todayText]}>
              {i}
            </Text>
          </View>
        </View>
      );
    }

    return days;
  }, [currentMonth, highlightedDates, getDaysInMonth, getFirstDayOfMonth]);

  const goToPreviousMonth = useCallback(() => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  }, [currentMonth]);

  const goToNextMonth = useCallback(() => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  }, [currentMonth]);

  return (
    <View style={styles.container}>
      <View style={styles.daysHeader}>
        {DAYS.map((day) => (
          <View key={day} style={styles.dayHeaderContainer}>
            <Text style={styles.dayHeaderText}>{day}</Text>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.daysContainer}>
        {renderDays()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  arrowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  arrow: {
    padding: 2,
  },
  daysHeader: {
    flexDirection: "row",
    marginBottom: 10,
  },
  dayHeaderContainer: {
    width: DAY_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  dayHeaderText: {
    fontSize: 12,
    color: "#666",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayContainer: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  day: {
    width: DAY_SIZE - 20,
    height: DAY_SIZE - 20,
    borderRadius: (DAY_SIZE - 8) / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  dayText: {
    fontSize: 12,
    color: "black",
  },
  today: {
    borderWidth: 2,
    borderColor: "#007bff",
  },
  todayText: {
    fontWeight: "bold",
  },
});

export default ClassroomCalender;
