import { View, Text, ActivityIndicator, Alert } from "react-native";
import { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../auth/AuthContext";
import { colors } from "../helper/helpers";
import OnboardingScreen from "../screens/onboarding/OnboardingScreen";
import SignInScreen from "../screens/onboarding/SignInScreen";
import HomePage from "../screens/home/ClassroomScreen";
import MyTab from "./MyTab";

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
          authState?.isAuthenticated ? "Dashboard" : "SignInScreen"
        }
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* //Auth Screen */}
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />

        <Stack.Screen name="SignInScreen" component={SignInScreen} />

        <Stack.Screen name="Dashboard" component={MyTab} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
