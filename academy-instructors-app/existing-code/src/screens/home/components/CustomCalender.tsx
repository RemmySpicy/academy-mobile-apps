// import dayjs from "dayjs";
// import React, { useState } from "react";
// import { StyleSheet, View } from "react-native";
// import { Calendar } from "react-native-calendars";

// const CalendarComponent = () => {
//   const today = dayjs().format("YYYY-MM-DD");
//   const eventDays = [
//     "2025-05-06",
//     "2025-05-15",
//     "2025-05-24",
//     "2025-05-27",
//     "2025-05-30",
//   ];
//   const [selected, setSelected] = useState(today);

//   // Generate all dates for the current month with white background
//   const allDates = {};
//   const daysInMonth = dayjs().daysInMonth();

//   for (let i = 1; i <= daysInMonth; i++) {
//     const date = dayjs().date(i).format("YYYY-MM-DD");
//     allDates[date] = {
//       customStyles: {
//         container: {
//           backgroundColor: "white",
//           borderRadius: 30,
//           margin: 2,
//         },
//       },
//     };
//   }

//   // Create marked dates object
//   const markedDates = {
//     ...allDates,
//     // Selected date style
//     [selected]: {
//       selected: true,
//       customStyles: {
//         container: {
//           backgroundColor: "white",
//           borderRadius: 30,
//           //   margin: 2,
//           elevation: 4,
//           shadowColor: "#DCD5F4",
//           shadowOffset: { width: 0, height: 2 },
//           shadowOpacity: 0.8,
//           shadowRadius: 4,
//         },
//         text: {
//           //   color: "#6C5CE7",
//           fontWeight: "bold",
//         },
//       },
//     },
//     // Today's date style
//     [today]: {
//       customStyles: {
//         container: {
//           backgroundColor: "white",
//           borderRadius: 30,
//           margin: 2,
//           elevation: 4,
//           shadowColor: "#F4D5D6",
//           shadowOffset: { width: 0, height: 2 },
//           shadowOpacity: 0.8,
//           shadowRadius: 4,
//           borderWidth: 5,
//           borderColor: "#F4D5D6",
//         },
//         text: {
//           //   color: "#E84393",
//           //   fontWeight: "bold",
//         },
//       },
//     },
//   };

//   // Add light blue border to event days
//   eventDays.forEach((date) => {
//     markedDates[date] = {
//       ...markedDates[date],
//       customStyles: {
//         container: {
//           ...markedDates[date]?.customStyles?.container,
//           borderWidth: 5,
//           borderColor: "#ADD8E6", // Light blue
//         },
//       },
//     };
//   });

//   return (
//     <View style={styles.calendarWrapper}>
//       <Calendar
//         current={today}
//         onDayPress={(day) => setSelected(day.dateString)}
//         markedDates={markedDates}
//         markingType="custom"
//         theme={{
//           backgroundColor: "#EFEFEF",
//           calendarBackground: "#EFEFEF",
//           textSectionTitleColor: "#b6c1cd",
//           selectedDayBackgroundColor: "transparent",
//           //   selectedDayTextColor: "#6C5CE7",
//           todayBackgroundColor: "#F4D5D6",
//           //   dayTextColor: "#2d4150",
//           textDisabledColor: "#d9e1e8",
//           textDayColor: "#000",
//           textDayFontSize: 11,
//           textMonthFontSize: 14,
//           textDayHeaderFontSize: 14,
//           alignItems: "center",
//           "stylesheet.calendar.main": {
//             week: {
//               marginVertical: 0,
//               flexDirection: "row",
//               alignItems: "center",
//               justifyContent: "space-around",
//               padding: 8,
//               fontSize: 11,
//             },
//           },
//         }}
//         style={styles.calendar}
//         hideExtraDays={true}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   calendarWrapper: {
//     marginHorizontal: 16,
//     marginBottom: 24,
//     borderRadius: 30,
//     overflow: "hidden",
//     backgroundColor: "#EFEFEF",
//   },
//   calendar: {
//     borderRadius: 20,
//   },
// });

// export default CalendarComponent;

import dayjs from "dayjs";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

const CalendarComponent = () => {
  const today = dayjs().format("YYYY-MM-DD");
  const eventDays = [
    "2025-05-06",
    "2025-05-15",
    "2025-05-24",
    "2025-05-27",
    "2025-05-30",
  ];
  const [selected, setSelected] = useState(today);

  // Generate all dates for the current month with white background
  const allDates = {};
  const daysInMonth = dayjs().daysInMonth();

  for (let i = 1; i <= daysInMonth; i++) {
    const date = dayjs().date(i).format("YYYY-MM-DD");
    allDates[date] = {
      customStyles: {
        container: {
          backgroundColor: "white",
          borderRadius: 30,
          width: 32,
          height: 32,
          justifyContent: "center",
          alignItems: "center",
          margin: 2,
        },
        text: {
          textAlign: "center",
        },
      },
    };
  }

  // Create marked dates object
  const markedDates = {
    ...allDates,
    // Selected date style
    [selected]: {
      selected: true,
      customStyles: {
        container: {
          backgroundColor: "white",
          borderRadius: 30,
          width: 32,
          height: 32,
          justifyContent: "center",
          alignItems: "center",
          elevation: 4,
          shadowColor: "#DCD5F4",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 4,
        },
        text: {
          fontWeight: "bold",
          textAlign: "center",
        },
      },
    },
    // Today's date style
    [today]: {
      customStyles: {
        container: {
          backgroundColor: "white",
          borderRadius: 30,
          width: 32,
          height: 32,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 5.5,
          borderColor: "#F4D5D6",
        },
        text: {
          textAlign: "center",
          color: "#000",
          textColor: "#000",
        },
      },
    },
  };

  // Add light blue border to event days
  eventDays.forEach((date) => {
    markedDates[date] = {
      ...markedDates[date],
      customStyles: {
        container: {
          ...markedDates[date]?.customStyles?.container,
          borderWidth: 5.5,
          borderColor: "#ADD8E6",
        },
        text: {
          textAlign: "center",
        },
      },
    };
  });

  return (
    <View style={styles.calendarWrapper}>
      {/* <Text className="font-semibold px-4 pt-4">
        Dec 3rd till date (Current Term)
      </Text> */}
      <Calendar
        current={today}
        onDayPress={(day) => setSelected(day.dateString)}
        markedDates={markedDates}
        markingType="custom"
        hideArrows={false}
        renderArrow={(direction) => (
          <View style={styles.arrowContainer}>
            {direction === "left" && <Text style={styles.arrow}>›</Text>}
            {direction === "right" && <Text style={styles.arrow}>‹</Text>}
          </View>
        )}
        theme={{
          backgroundColor: "#EFEFEF",
          calendarBackground: "#EFEFEF",
          textSectionTitleColor: "#000", // Black for day names
          selectedDayBackgroundColor: "transparent",
          // textDisabledColor: "#d9e1e8",
          // textDayColor: "#000",
          textDayFontSize: 12,
          textMonthFontSize: 0, // Hide month text
          textDayHeaderFontSize: 12,
          "stylesheet.calendar.header": {
            header: {
              flexDirection: "row-reverse", // Arrows on right
              justifyContent: "flex-start", // Arrows together
              paddingLeft: 10,
              paddingRight: 10,
              marginTop: 6,
              alignItems: "center",
            },
            monthText: {
              display: "none", // Hide month and year
            },
            arrow: {
              padding: 0,
              margin: 0,
            },
          },
          "stylesheet.calendar.main": {
            week: {
              marginVertical: 0,
              flexDirection: "row",
              justifyContent: "space-around",
              padding: 8,
            },
            dayContainer: {
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            },
          },
          "stylesheet.day.basic": {
            base: {
              width: 32,
              height: 32,
              alignItems: "center",
              justifyContent: "center",
            },
            text: {
              textAlign: "center",
              fontSize: 12,
            },
          },
        }}
        style={styles.calendar}
        hideExtraDays={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarWrapper: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#EFEFEF",
  },
  calendar: {
    borderRadius: 20,
    paddingBottom: 20,
  },
  arrowContainer: {
    flexDirection: "row",
    marginLeft: 10,
  },
  arrow: {
    fontSize: 20,
    color: "#000",
    paddingHorizontal: 5,
  },
});

export default CalendarComponent;
