import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  ScrollView,
 
} from "react-native";
import React, { useState } from "react";
import { Iconify } from "react-native-iconify";
import { useNavigation } from "@react-navigation/core";
import { serviceType } from "../../helper/helpers";
import CustomDropDownSelect from "../../components/form/customDropDownSelect";
import { useForm, Controller } from "react-hook-form";
import CustomInputs from "../../components/form/customInputs";
import Button from "../../components/elements/button";
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
];

const BookingsScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(
    null
  );
  const { control } = useForm();

  const handleServiceTypeChange = (value: string) => {
    setSelectedServiceType(value);
  };
  return (
    <View className="flex-1">
      <View className="h-12 bg-white w-full" />
      <View className="px-4 flex-1">
        <View className="flex-row items-center mt-3">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="self-start"
          >
            <Iconify icon="majesticons:arrow-left" size={28} />
          </TouchableOpacity>
          <View className="flex-1 items-center ">
            <Text className="font-sr text-[21px]">Participation Details</Text>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }} // Ensure content can grow
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }} // Add this line to allow ScrollView to take full height
          className="mb-10"
        >
          <View className="mt-5">
            <Text className="font-sr text-[17px] mb-3">Selected Course</Text>
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
                    </View>
                  </View>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            />

            <View>
              <Text className="font-sr text-[17px]">Participant Details</Text>
              <View className="mt-5">
                <CustomDropDownSelect
                  name="service_type"
                  control={control}
                  placeholder={"Select Course Participant"}
                  options={serviceType}
                  onValueChange={handleServiceTypeChange}
                />
              </View>
              <View className="mt-5">
                <CustomDropDownSelect
                  name="service_type"
                  control={control}
                  placeholder={"Participant Skill Level"}
                  options={serviceType}
                  onValueChange={handleServiceTypeChange}
                />
              </View>
              <View className="mt-5">
                <CustomInputs
                  control={control}
                  name="full_name"
                  placeholder="Participant Medical Condition"
                  height={120}
                  multiline={true}
                  numberOfLines={4}
                />
              </View>
            </View>
            <View className="mt-5">
              <Text className="font-sr text-[14px]">
                Select location preference
              </Text>
              <View className="flex-row justify-between mt-5">
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "#1E1E1E", // Change to your desired color
                    padding: 10,
                    borderRadius: 5,
                    marginRight: 5, // Space between buttons
                    alignItems: "center", // Center text horizontally
                    justifyContent: "center", // Center text vertically
                  }}
                  onPress={() => {
                    /* Handle first button press */
                  }}
                >
                  <Text className="text-white">Elitesgen Facility</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "white", // Change to your desired color
                    padding: 10,
                    borderRadius: 5,
                    marginLeft: 5, // Space between buttons
                    alignItems: "center", // Center text horizontally
                    justifyContent: "center", // Center text vertically
                    borderWidth: 1, // Add border width
                    borderColor: "#1E1E1E", // Change to your desired border color
                  }}
                  onPress={() => {
                    /* Handle second button press */
                  }}
                >
                  <Text>Outside Elitesgen Facility</Text>
                </TouchableOpacity>
              </View>
              <View className="mt-5">
                <CustomDropDownSelect
                  name="service_type"
                  control={control}
                  placeholder={"Select Course Participant"}
                  options={serviceType}
                  onValueChange={handleServiceTypeChange}
                />
              </View>
              <View className="mt-5">
                <CustomDropDownSelect
                  name="service_type"
                  control={control}
                  placeholder={"Participant Skill Level"}
                  options={serviceType}
                  onValueChange={handleServiceTypeChange}
                />
              </View>
            </View>
            <View className="mt-5">
              <Text className="font-sr text-[14px]">Select session type</Text>
              <View className="flex-row justify-between mt-5">
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "#1E1E1E", // Change to your desired color
                    padding: 10,
                    borderRadius: 5,
                    marginRight: 5, // Space between buttons
                    alignItems: "center", // Center text horizontally
                    justifyContent: "center", // Center text vertically
                  }}
                  onPress={() => {
                    /* Handle first button press */
                  }}
                >
                  <Text className="text-white">Private Lessons</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                    padding: 10,
                    borderRadius: 5,
                    marginLeft: 5, 
                    alignItems: "center", 
                    justifyContent: "center", 
                    borderWidth: 1, 
                    borderColor: "#1E1E1E", 
                  }}
                  onPress={() => {
                  
                  }}
                >
                  <Text>Group Lessons</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Button
                onPress={() => navigation.navigate("BookingCheckoutScreen")}
                variant="cancel"
                title={"Proceed to Checkout"}
                classNames="mt-5 mb-5"
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default BookingsScreen;
