import { View, Text, ActivityIndicator, Alert } from "react-native";
import  { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../auth/AuthContext";
import { colors } from "../helper/helpers";
import OnboardingScreen from "../screens/onboarding/OnboardingScreen";
import UserOnboardingScreen from "../screens/onboarding/UserOnboardingScreen";
import SignInScreen from "../screens/onboarding/SignInScreen";
import SignUpScreen from "../screens/onboarding/SignUpScreen";
import HomePage from "../screens/home/HomePage";
import MyTab from "./MyTab";
import SeeAllScreen from "../screens/home/SeeAllScreen";
import CourseDetailsScreen from "../screens/home/CourseDetailsScreen";
import BookingsScreen from "../screens/home/BookingsScreen";
import BookingCheckoutScreen from "../screens/home/BookingCheckoutScreen";
import ProcessPayment from "../screens/home/ProcessPayment";
import SuccessScreen from "../screens/home/SuccessScreen";
import Course from "../screens/MenuScreens/Course";

const Stack = createNativeStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "white",
  },
};

const RootNavigation = () => {
  const { authState } = useAuth();

  if (authState === null) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator color={colors.theme} size={24} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={MyTheme}>
      <StatusBar style="auto" />

      <Stack.Navigator
        initialRouteName={
          authState?.isAuthenticated ? "Dashboard" : "OnboardingScreen"
        }
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* //Auth Screen */}
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
        <Stack.Screen name="UserOnboardingScreen">
          {(props: any) => (
            <UserOnboardingScreen
              {...props}
              visible={true}
              onClose={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="SeeAllScreen" component={SeeAllScreen} />
        <Stack.Screen
          name="CourseDetailsScreen"
          component={CourseDetailsScreen}
        />
        <Stack.Screen name="ProcessPayment" component={ProcessPayment} />
        <Stack.Screen name="BookingsScreen" component={BookingsScreen} />
        <Stack.Screen
          name="BookingCheckoutScreen"
          component={BookingCheckoutScreen}
        />
        <Stack.Screen name="SuccessScreen" component={SuccessScreen} />

        <Stack.Screen name="Dashboard" component={MyTab} />

      
        <Stack.Screen name="Courses" component={Course} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
