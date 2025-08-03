// src/screens/home/SeeAll.tsx
import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Iconify } from "react-native-iconify";

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

const SeeAllScreen = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState("All");

  const filteredData = cardData.filter((item) => {
    if (selectedTab === "All") return true;
    if (selectedTab === "Training") return item.title.includes("Training");
    if (selectedTab === "Workshop") return item.title.includes("Workshop");
    return false;
  });

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
        <Text className="font-sd text-[36px] mt-3">Courses</Text>
        <View className="flex-row justify-around mt-5">
          <TouchableOpacity onPress={() => setSelectedTab("All")}>
            <Text
              className={`font-sr text-[14px] ${
                selectedTab === "All" ? "font-bold" : ""
              }`}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedTab("Training")}>
            <Text
              className={`font-sr text-[14px] ${
                selectedTab === "Training" ? "font-bold" : ""
              }`}
            >
              Training
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedTab("Workshop")}>
            <Text
              className={`font-sr text-[14px] ${
                selectedTab === "Workshop" ? "font-bold" : ""
              }`}
            >
              Workshop
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conditional rendering for the Training tab */}
        {selectedTab === "Training" && (
          <Text className="font-sd text-[20px] mt-5">Training works</Text>
        )}

        <View className="mt-10">
          <FlatList
            data={filteredData}
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
                        <Text className="font-sr text-[10px]">Learn More</Text>
                      </View>
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
    </View>
  );
};

export default SeeAllScreen;
