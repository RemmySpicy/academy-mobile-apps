import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Switch,
  ScrollView,
} from "react-native";
import React from "react";
import { Iconify } from "react-native-iconify";
import { useNavigation } from "@react-navigation/core";
import Button from "../../components/elements/button";

const ProcessPayment = () => {
  const navigation = useNavigation<any>();
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
            <Text className="font-sr text-[21px]">Process Payment</Text>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }} // Ensure content can grow
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }} // Add this line to allow ScrollView to take full height
          className="mb-10"
        >
          <View className="mt-10">
            <Text className="font-sr text-[14px]">Payment option</Text>
            <View className="flex-row justify-between mt-5">
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "white", // Change to your desired color
                  padding: 10,
                  borderColor: "#1E1E1E",
                  borderRadius: 5,
                  marginRight: 5, // Space between buttons
                  alignItems: "center", // Center text horizontally
                  justifyContent: "center", // Center text vertically
                  borderWidth: 1, // Add border width
                }}
                onPress={() => {
                  /* Handle first button press */
                }}
              >
                <Text className="text-black font-sr">Full Payment</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#1E1E1E", // Change to your desired color
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
                <Text className="text-white font-sr">Part Payment</Text>
              </TouchableOpacity>
            </View>
            <View className="mt-5">
              <View className="flex-row justify-between mt-5">
                <Text className="font-sr text-[14px]">Charges</Text>
                <Text className="font-sr text-[17px]">N 0.00</Text>
              </View>
              <View className="flex-row justify-between mt-5">
                <Text className="font-sr text-[14px]">Total Amount</Text>
                <Text className="font-sr text-[17px]">N 60,000.00</Text>
              </View>
              <View className="flex-row justify-between mt-5">
                <Text className="font-sr text-[14px]">Previously paid</Text>
                <Text className="font-sr text-[17px]">N 0.00</Text>
              </View>
              <View className="flex-row justify-between mt-5 items-center">
                <Text className="font-sr text-[14px]">Amount to Pay</Text>
                <Text className="font-se text-[36px]">N 30,000.00</Text>
              </View>
            </View>
            <View className="mt-10">
              <Text className="font-sr text-[14px]">Choose payment method</Text>
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
                  <Text className="text-white font-sr">Debit card</Text>
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
                  onPress={() => {}}
                >
                  <Text className="text-black font-sr">Bank Transfer</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center mt-7 px-2">
                <Image
                  source={require("../../../assets/images/available.png")}
                  style={{ width: 28, height: 28 }}
                />
                <Text className="font-sr text=[17px] ml-4">New Card</Text>
              </View>

              <View className="mt-10">
                <Text className="font-sr text-[14px]">Enter Card Details</Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#8F8F8F",
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 5,
                    borderRadius: 10,
                  }}
                  className="mt-5 px-2"
                >
                  <TextInput
                    style={{
                      flex: 1,
                      height: 40,
                      borderColor: "transparent",
                    }}
                    placeholder="0423453637153834"
                  />

                  <Image
                    source={require("../../../assets/images/logos_mastercard.png")}
                    style={{ width: 35, height: 27 }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                  className="mt-5"
                >
                  <TextInput
                    style={{
                      width: "47%",
                      height: 40,
                      borderColor: "gray",
                      borderWidth: 1,
                      padding: 10,
                      borderRadius: 5,
                    }}
                    placeholder="MM/YY"
                  />
                  <TextInput
                    style={{
                      width: "47%",
                      height: 40,
                      borderColor: "gray",
                      borderWidth: 1,
                      padding: 10,
                      borderRadius: 5,
                    }}
                    placeholder="CVV"
                  />
                </View>
                <View className="mt-5 flex-row justify-between">
                  <Text className="font-sr text-[14px]">
                    Save card data for future use
                  </Text>
                  <Switch
                    style={{ marginLeft: 10 }}
                    trackColor={{ false: "#767577", true: "#4F2EC9" }}
                    thumbColor="white"
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => console.log("toggle changed")}
                    value={true}
                  />
                </View>
                <View>
                  <Button
                    onPress={() => navigation.navigate("SuccessScreen")}
                    variant="cancel"
                    title={"Proceed to Checkout"}
                    classNames="mt-5 mb-5"
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ProcessPayment;

const styles = StyleSheet.create({});
