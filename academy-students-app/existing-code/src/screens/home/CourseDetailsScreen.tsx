import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from "react-native";
import React from "react";
import { Iconify } from "react-native-iconify";
import Button from "../../components/elements/button";
import { useNavigation } from "@react-navigation/core";

const cardData = [
  {
    id: 1,
    backgroundImage: require("../../../assets/images/Vector1.png"), // Update with your image paths
    sideImage: require("../../../assets/images/woman.png"),
    title: "Learn to Swim: 3 - 30 Years",
    description:
      "A transformative world of swimming that offers an enriching experience for beginners of all ages. Designed to help conquer fear of water, teach fundamental swimming skills, and foster a lifelong love for swimming.",
    backgroundColor: "#DCF9F1", // Light orange with transparency
  },
  {
    id: 2,
    backgroundImage: require("../../../assets/images/Vector1.png"),
    sideImage: require("../../../assets/images/swimming-club.png"),
    title: "Swimming Club: 5-30 Years",
    description:
      "Our club is a journey of skill refinement, camaraderie, teamwork, and achieving personal bests. Designed for competitive athletes and enthusiasts passionate about the art and science of swimming.",
    backgroundColor: "#DCD5F4", // Light blue with transparency
  },
  {
    id: 3,
    backgroundImage: require("../../../assets/images/Vector1.png"),
    sideImage: require("../../../assets/images/adult-swimming.png"),
    title: "Adult Swimming: 30 years +",
    description:
      "A world of skill development and fitness for adults who are looking to conquer their fear of water or experienced swimmers aiming to refine their techniques.",
    backgroundColor: "#DCF1F9", // Light green with transparency
  },
  {
    id: 4,
    backgroundImage: require("../../../assets/images/Vector1.png"),
    sideImage: require("../../../assets/images/aqua-babies.png"),
    title: "Aqua Babies: 12 - 36 months",
    description:
      "An exciting introduction to the world of swimming and safety skills specially designed for infants and toddlers, to embark on a delightful aquatic adventure that fosters comfort and confidence in the water.",
    backgroundColor: "#D8F5C5", // Light yellow with transparency
  },
];

const CourseDetailsScreen = () => {
  const navigation = useNavigation<any>();
  return (
    <View className="flex-1">
      <View className="h-12 bg-white w-full" />
      <View className="px-4 flex-1">
        <View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="self-start"
          >
            <Iconify icon="majesticons:arrow-left" size={28} />
          </TouchableOpacity>
        </View>
        <Text className="font-se text-[30px] mt-3">Course Details</Text>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }} // Ensure content can grow
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }} // Add this line to allow ScrollView to take full height
          className="mb-10"
        >
          <View className="mt-10">
            <Text className="font-sr text-[21px]">
              Learn to Swim: 3 - 30 Years
            </Text>
            <View className="mt-5">
              <Text className="font-sr text-[17px]">Overview:</Text>
              <Text className="mt-3 font-sr text-[12px]">
                A transformative world of swimming that offers an enriching
                experience for beginners of all ages. Designed to help conquer
                fear of water, teach fundamental swimming skills, and foster a
                lifelong love for swimming.
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                className="mt-5"
              >
                <View className="flex-row items-center">
                  <Image
                    source={require("../../../assets/images/ph_student-thin.png")} // Update with your image path
                    style={{ width: 18, height: 18, marginRight: 4 }} // Adjust size and margin as needed
                  />
                  <Text className="font-sr text-[12px]">30 Active</Text>
                </View>
                <View className="flex-row align-center">
                  <Text className="font-sr text-[12px]">Next Batch: May 5</Text>
                </View>
              </View>
            </View>
            <View className="flex items-center mt-5">
              <Image
                source={require("../../../assets/images/bggswim.png")} // Update with your image path
                style={{
                  width: "100%",
                  height: 253,
                  marginRight: 4,
                  borderRadius: 8,
                }}
              />
            </View>
            <View className="mt-5">
              <Text className="font-sr text-[17px]">What You’ll Learn:</Text>
              <View className="mt-2 px-4 gap-1 mt-1">
                <Text className="font-sr text-[14px]">
                  • Freestyle, Breaststroke, Elementary Backstroke
                </Text>
                <Text className="font-sr text-[14px]">
                  • Breathing Techniques
                </Text>
                <Text className="font-sr text-[14px]">
                  • Body Positioning & Form
                </Text>
              </View>
            </View>
            <View className="mt-5">
              <Text className="font-sr text-[17px]">Course Features:</Text>
              <View className="mt-2 px-4 gap-1 mt-1">
                <Text className="font-sr text-[14px]">• Video Tutorials</Text>
                <Text className="px-4 mb-2 font-sr text-[12px]">
                  Step-by-step instructions from swimming experts.
                </Text>
                <Text className="font-sr text-[14px]">
                  • Personalized Feedback
                </Text>
                <Text className="px-4 mb-2 font-sr text-[12px]">
                  Track your progress and receive tips tailored to your level.
                </Text>
                <Text className="font-sr text-[14px]">• Drills & Workouts</Text>
                <Text className="px-4 mb-2 font-sr text-[12px]">
                  Practice with drills designed to perfect your form and speed.
                </Text>
              </View>
            </View>
            <View className="mt-5">
              <Text className="font-sr text-[17px]">Course Features:</Text>
              <View className="mt-2 px-4 gap-1 mt-1">
                <Text className="font-sr text-[14px]">• Course Length</Text>
                <Text className="px-4 mb-2 font-sr text-[12px]">
                  8x Lessons.
                </Text>
                <Text className="font-sr text-[14px]">• Class Duration</Text>
                <Text className="px-4 mb-2 font-sr text-[12px]">1 Hour.</Text>
                <Text className="font-sr text-[14px]">• Location</Text>
                <Text className="px-4 mb-2 font-sr text-[12px]">
                  Our Facilities / Your Preferred Location
                </Text>
                <Text className="font-sr text-[14px]">• Pricing</Text>
                <Text className="px-4 mb-2 font-sr text-[12px]">
                  N25,000 - N60,000
                </Text>
              </View>
            </View>
            <View className="mt-5">
              <Text className="font-sr text-[17px]">Perks:</Text>
              <View className="mt-2 px-4 gap-1 mt-1">
                <Text className="font-sr text-[14px]">
                  • Pool Usage Discount
                </Text>
                <Text className="font-sr text-[14px]">• Referral Discount</Text>
                <Text className="font-sr text-[14px]">• Family Discount</Text>
              </View>
            </View>
            <View className="flex items-center mt-5">
              <Button
                onPress={() => navigation.navigate("BookingsScreen")}
                variant="black"
                title={"Proceed with Booking"}
                classNames="mt-5 mb-5 w-[50%]"
              />
            </View>
            <View className="mt-5">
              <FlatList
                data={cardData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View
                    style={{
                      width: "100%",
                      marginBottom: 20,
                      borderRadius: 10,
                      overflow: "hidden",
                      backgroundColor: item.backgroundColor,
                      position: "relative",
                    }}
                  >
                    <Image
                      source={require("../../../assets/images/Vector1.png")}
                      style={{
                        width: 400,
                        height: 106,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        borderRadius: 10,
                        marginTop: 60,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      {/* Image touching the top, bottom, and left wall */}
                      <Image
                        source={item.sideImage}
                        style={{
                          width: 127,
                          height: "100%", // Ensures the image stretches vertically
                          resizeMode: "cover", // Maintains aspect ratio while filling the space
                        }}
                      />

                      <View
                        style={{
                          flex: 1,
                          padding: 10, // Adds spacing around the text
                          justifyContent: "space-between", // Ensures elements are spaced appropriately
                        }}
                      >
                        <Text
                          className="font-sd text-[17px] text-[#1E1E1E]"
                          style={{ marginBottom: 8 }}
                        >
                          {item.title}
                        </Text>

                        <Text className="font-sr text-[10px] text-[#8F8F8F]">
                          {item.description}
                        </Text>

                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                          className="mt-5"
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              source={require("../../../assets/images/ph_student-thin.png")} // Update with your image path
                              style={{ width: 16, height: 16, marginRight: 4 }} // Adjust size and margin as needed
                            />
                            <Text className="font-sr text-[10px]">Enroll</Text>
                          </View>
                          <TouchableOpacity
                            //    onPress={() => navigation.navigate("CourseDetailsScreen")}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              source={require("../../../assets/images/ph_student-thin.png")} // Update with your image path
                              style={{ width: 16, height: 16, marginRight: 4 }} // Adjust size and margin as needed
                            />
                            <Text className="font-sr text-[10px]">
                              Learn More
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default CourseDetailsScreen;

const styles = StyleSheet.create({});
