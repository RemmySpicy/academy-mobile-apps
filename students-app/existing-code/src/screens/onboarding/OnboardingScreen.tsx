import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppleBtn from "../../components/elements/authscreen/appleBtn";
import FacebookBtn from "../../components/elements/authscreen/facebookBtn";
import GoogleBtn from "../../components/elements/authscreen/googleBtn";
import Button from "../../components/elements/button";

const { width, height } = Dimensions.get("window");

const onboardingData = [
  {
    key: "1",
    title: "Smart Performance",
    description:
      "Discover top swimming instructors, book sessions, and track your progress effortlessly.",
    image: require("../../../assets/images/swim.png"), // Replace with your background image
  },
  {
    key: "2",
    title: "Book Sessions",
    description:
      "Book swimming sessions with your preferred instructors hassle-free. Choose from flexible scheduling options to fit your lifestyle.",
    image: require("../../../assets/images/boy.png"), // Replace with your background image
  },
  {
    key: "3",
    title: "Progress Tracking",
    description:
      "Monitor your swim distances, times, and technique improvements. Set goals and celebrate your achievements along the way.",
    image: require("../../../assets/images/system.png"), // Replace with your background image
  },
  {
    key: "4",
    title: "Get Started",
    description:
      "Dive into the world of swimming with Elitesgen Academy App! Start discovering instructors, booking sessions, and achieving your swimming goals today.",
    image: require("../../../assets/images/glass.png"), // Replace with your background image
  },
];

const OnboardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    bottomSheetRef.current?.expand();
  };

  const handleSheetChanges = useCallback(
    (index: number) => {
      Animated.timing(fadeAnim, {
        toValue: index === -1 ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
    [fadeAnim]
  );

  const renderItem = ({ item }: { item: any }) => (
    <ImageBackground
      source={item.image}
      style={{ width, height }}
      imageStyle={{ resizeMode: "cover" }}
      className="justify-between"
    >
      {/* Logo at the top */}
      <View className="items-center mt-20">
        <Image
          source={require("../../../assets/images/swimm.png")}
          style={{ width: 117, height: 105 }}
        />
      </View>

      {/* Title and description at the bottom above the button */}
      <View className="items-center mb-32 px-6">
        <Text className="text-white text-3xl font-bold mb-2 text-center">
          {item.title}
        </Text>
        <Text className="text-white text-base text-center">
          {item.description}
        </Text>
      </View>
    </ImageBackground>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={onboardingData}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          onScroll={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x /
                e.nativeEvent.layoutMeasurement.width
            );
            setCurrentIndex(index);
          }}
        />

        {/* Button and Indicator */}
        <View className="absolute bottom-10 w-full items-center px-4">
          <TouchableOpacity
            className="bg-[#4F2EC9] w-full py-2 px-6 mb-4 items-center"
            style={{ borderRadius: 25 }}
            onPress={handleNext}
          >
            <Text className="text-white text-lg">Get started</Text>
          </TouchableOpacity>

          {/* Indicator */}
          <View className="flex-row">
            {onboardingData.map((_, index) => (
              <View
                key={index}
                className={`h-2 w-2 rounded-full mx-1 ${
                  currentIndex === index ? "bg-[#4F2EC9]" : "bg-gray-300"
                }`}
              />
            ))}
          </View>
        </View>

        <Animated.Text
          style={{
            opacity: fadeAnim,
            textAlign: "center",
            fontSize: 14,
            fontWeight: "bold",
            position: "absolute",
            width: "100%",
            bottom: "50%",
            marginBottom: 20,
            zIndex: 1000,
            color: "#FAFAFA",
            lineHeight: 23,
          }}
          className="px-4 font-sr"
        >
          <Text>
            By tapping ‘Login’ / ‘Sign up’, you agree to our Terms of Service.
            Learn how we process your data in our Privacy Policy and Cookies
            Policy.
          </Text>
        </Animated.Text>

        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={["50%"]}
          onChange={handleSheetChanges}
          enablePanDownToClose
          index={-1}
          backgroundStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <BottomSheetView style={{ flex: 1, padding: 16 }}>
            <View style={{ flex: 1 }}>
              <View
                className="flex-1 items-center px-4"
                style={{ borderRadius: 30 }}
              >
                <View className="w-full">
                  <Button
                    onPress={() => navigation.navigate("SignInScreen")}
                    variant="cancel"
                    title={"Login"}
                  />
                </View>
                <View className="w-full mt-5">
                  <Button
                    onPress={() => navigation.navigate("SignUpScreen")}
                    variant="normal"
                    title={"Sign up"}
                    shadow
                    shadowColor="#000000"
                    shadowOpacity={0.5}
                    shadowOffset={{ width: 0, height: 4 }}
                    shadowRadius={4}
                  />
                </View>
                <View className="flex-row space-x-4 items-center mt-5">
                  <View className="h-0.5 border-t flex-1 border-[#696969]"></View>
                  <Text
                    className="text-lg font-sr"
                    style={{ fontSize: 12, color: "black" }}
                  >
                    or
                  </Text>
                  <View className="h-0.5 border-t flex-1 border-[#696969]"></View>
                </View>
                <View className="mt-5 w-full">
                  <GoogleBtn />
                </View>
                <View className="mt-5 w-full">
                  <AppleBtn />
                </View>
                <View className="mt-5 w-full">
                  <FacebookBtn />
                </View>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default OnboardingScreen;
