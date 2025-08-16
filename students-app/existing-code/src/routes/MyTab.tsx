import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import Booking from "../screens/home/Booking";
import HomePage from "../screens/home/HomePage";
import Profile from "../screens/home/Profile";
import Progression from "../screens/home/Progression";
import Teams from "../screens/home/Teams";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { getUserProfile } from "../redux/auth/features";

export default function MyTab() {
  const Tab = createBottomTabNavigator();
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  useEffect(() => {
      dispatch(getUserProfile())
  }, [])


  console.log('user: ', user)


  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let label;

          if (route.name === "HomePage") {
            iconName = "swimmer";
            label = "Home";
          } else if (route.name === "Booking") {
            iconName = "calendar";
            label = "Booking";
          } else if (route.name === "Progress") {
            iconName = "chart-line";
            label = "Progress";
          } else if (route.name === "Teams") {
            iconName = "users";
            label = "Teams";
          } else if (route.name === "Profile") {
            iconName = "user";
            label = "Profile";
          }

          return (
            <View style={[focused ? styles.active : styles.inActive]}>
              <FontAwesome5
                name={iconName}
                size={18}
                color={`${focused ? "black" : "white"}`}
              />
              {focused && (
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
              )}
            </View>
          );
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarLabel: () => null,
        tabBarStyle: {
          backgroundColor: "#1E1E1E",
          marginHorizontal: 24,
          marginBottom: 24,
          borderRadius: 100,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 10,
          paddingTop: 8,
          paddingBottom: 8,
          height: 66,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomePage" component={HomePage} />
      <Tab.Screen name="Booking" component={Booking} />
      <Tab.Screen name="Progress" component={Progression} />
      <Tab.Screen name="Teams" component={Teams} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  active: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
  },

  inActive: {
    flexDirection: "row",
    alignItems: "center",
  },
});
