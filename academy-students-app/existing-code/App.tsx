import { useState, useEffect } from "react";

import { View, Text, StyleSheet, Image, TextInput } from "react-native";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useFonts } from "expo-font";
import { AuthProvider } from "./src/auth/AuthContext";
import { Provider } from "react-redux";
import { MenuProvider } from "react-native-popup-menu";
import { store, useAppSelector } from "./src/redux/store";
import RootNavigation from "./src/routes/rootNavigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Alert from "./src/components/elements/alert";

export default function App() {
  (Text as any).defaultProps = (Text as any).defaultProps || {};
  (Text as any).defaultProps.allowFontScaling = false;
  (Text as any).defaultProps = (Text as any).defaultProps || {};
  (Text as any).defaultProps.allowFontScaling = false;
  (TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
  (TextInput as any).defaultProps.allowFontScaling = false;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AuthProvider>
          <AuthLayout />
        </AuthProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    // Wait for 3 seconds before hiding the splash screen
    const timer = setTimeout(() => {
      onFinish(); // Callback to hide the splash screen
    }, 4000); // 3 seconds delay

    // Cleanup the timer
    return () => clearTimeout(timer);
  }, []);
  return (
    <View style={styles.splashContainer}>
      <Animated.View style={[styles.logoContainer]}>
        <Image source={require("./assets/splash.png")} style={styles.logo} />
      </Animated.View>
    </View>
  );
};

export const AuthLayout = () => {
  const { alert } = useAppSelector((state) => state.utils);

  // State to manage splash screen visibility
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  // Load fonts
  const [fontsLoaded, fontError] = useFonts({
    thin_200: require("./assets/fonts/NunitoSans_10pt-Light.ttf"),
    light_300: require("./assets/fonts/NunitoSans_10pt-Light.ttf"),
    regular_400: require("./assets/fonts/NunitoSans_10pt-Regular.ttf"),
    medium_500: require("./assets/fonts/NunitoSans_10pt-Medium.ttf"),
    semibold_600: require("./assets/fonts/NunitoSans_10pt-SemiBold.ttf"),
    bold_700: require("./assets/fonts/NunitoSans_10pt-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Do nothing here, as the splash will now wait for the 6 seconds in total.
    }
  }, [fontsLoaded, fontError]);

  // Hide splash screen callback
  const handleSplashFinish = () => {
    setIsSplashVisible(false);
  };

  // Show splash screen while fonts are loading
  if (isSplashVisible) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Main app content after splash screen
  return (
    <Provider store={store}>
      <MenuProvider>
        <RootNavigation />
      </MenuProvider>
      {alert && <Alert />}
    </Provider>
  );
};

// Styles for Splash Screen
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 126,
    height: 108,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    color: "#ffffff", // Adjust text color to contrast with background
  },
});
