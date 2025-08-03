import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useAppSelector } from "../redux/store";
import AttendanceScreen from "../screens/home/AttendanceScreen";
import ClassroomScreen from "../screens/home/ClassroomScreen";
import PerformanceScreen from "../screens/home/PerformanceScreen";
import SchedullingScreen from "../screens/home/SchedullingScreen";
import StudentsScreen from "../screens/home/StudentsScreen";

export default function MyTab() {
  const isBottomSheetOpen = useAppSelector(
    (state) => state.utils.isBottomSheetOpen
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const Tab = createBottomTabNavigator();
  // const { user } = useAppSelector((state) => state.auth)
  // const dispatch = useAppDispatch()

  // useEffect(() => {
  //     dispatch(getUserProfile())
  // }, [])

  // console.log('user: ', user)

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let label;

          if (route.name === "ClassroomScreen") {
            iconName = "swimmer";
            label = "Classroom";
          } else if (route.name === "Schedulling") {
            iconName = "calendar";
            label = "Schedules";
          } else if (route.name === "Students") {
            iconName = "chart-line";
            label = "Students";
          } else if (route.name === "Attendance") {
            iconName = "users";
            label = "Attendance";
          } else if (route.name === "Performance") {
            iconName = "chart-bar";
            label = "Performance";
          }

          return (
            <View className="">
              <View style={[focused ? styles.active : styles.inActive]}>
                <FontAwesome5
                  name={iconName}
                  size={17}
                  color={`${focused ? "black" : "white"}`}
                />
              </View>
              {/* {focused && (
                <Text
                  style={{
                    color: "black",
                    marginLeft: 3,
                    fontWeight: "bold",
                    fontSize: 10,
                  }}
                >
                  {label}
                </Text>
              )} */}

              <Text
                style={{
                  color: "white",
                  marginLeft: 6,
                  fontWeight: "bold",
                  fontSize: 10,
                  paddingTop: 5,
                }}
              >
                {label}
              </Text>
            </View>
          );
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",

        tabBarLabel: () => null,
        tabBarStyle: {
          backgroundColor: "#1E1E1E",
          marginHorizontal: 12,
          marginBottom: 24,
          borderRadius: 100,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 8,
          height: 66,
          opacity: isSheetOpen ? 0 : 1,
          display: isSheetOpen ? "none" : "flex",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="ClassroomScreen" component={ClassroomScreen} />
      <Tab.Screen
        name="Schedulling"
        // component={SchedullingScreen}
        children={() => <SchedullingScreen setIsSheetOpen={setIsSheetOpen} />}
      />
      <Tab.Screen name="Students" component={StudentsScreen} />
      <Tab.Screen name="Attendance" component={AttendanceScreen} />
      <Tab.Screen name="Performance" component={PerformanceScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  active: {
    backgroundColor: "white",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 40,
    alignItems: "center",
  },

  inActive: {
    paddingVertical: 6,
    alignItems: "center",
  },
});
