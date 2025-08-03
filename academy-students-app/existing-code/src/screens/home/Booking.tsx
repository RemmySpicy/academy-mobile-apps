import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from "react-native";
// import React from "react";
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

export default function Booking() {
  const navigation = useNavigation<any>();
  return (
    <View className="flex-1">
      <View className="h-12 bg-white w-full" />
      <View className="px-4 flex-1">
        <View className="mt-5">
          <Text className="font-sd text-[36px]">Booking & Scheduling</Text>
          <Text className="font-sr text-[25px]" style={{ color: "#696969" }}>
            Sessions Now
          </Text>
        </View>
        <View className="flex-row justify-between">
          <View
            style={{
              backgroundColor: "#EFEFEF",
              padding: 10,
              borderRadius: 8,
              marginTop: 20,
              alignSelf: "flex-start",
            }}
          >
            <Text
              className="font-se"
              style={{ fontSize: 16, color: "#121212" }}
            >
              Today
            </Text>
          </View>
          <View className="flex-row justify-between mt-3">
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text className="mr-2 font-sd text-[36px]">24</Text>
              <View className="flex-column ">
                <Text className="font-se text-[17px]">Wed</Text>
                <Text className="font-sr text-[10px]">April 2024</Text>
              </View>
            </View>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mt-10">
            <Text className="font-sr text-[21px] text-[#1E1E1E]">
              Active Course
            </Text>
            <View className="flex items-center mt-5">
              <Image
                source={require("../../../assets/images/course.png")} // Update the path to your image
                style={{ width: 249, height: 170 }} // Set the desired width and height
              />
              <Text className="font-sr text-[21px] w-[221px] text-center">
                Enroll for a course to get started...
              </Text>
            </View>
          </View>
          <View className="mt-10 flex-1">
            <View className="flex-row justify-between">
              <Text className="font-sr text-[23px] text-[#1E1E1E]">
                Our Courses
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("SeeAllScreen")}
                className="flex-row items-center"
              >
                <Text className="font-sr text-[14px] text-[#8A74DB] mt-2">
                  See all
                </Text>
                <Image
                  source={require("../../../assets/images/arrow-right.png")}
                  style={{ width: 24, height: 24, marginLeft: 4 }}
                  className="mt-2"
                />
              </TouchableOpacity>
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
                            onPress={() =>
                              navigation.navigate("CourseDetailsScreen")
                            }
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
}

const styles = StyleSheet.create({});
