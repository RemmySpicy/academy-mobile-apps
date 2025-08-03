import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { Iconify } from "react-native-iconify";
import { useNavigation } from "@react-navigation/core";
import QuantityController from "../../components/form/quantityController";
import Button from "../../components/elements/button";

const BookingCheckoutScreen = () => {
  
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
            <Text className="font-sr text-[21px]">Booking Checkout</Text>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }} // Ensure content can grow
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }} // Add this line to allow ScrollView to take full height
          className="mb-10"
        >
          <View>
            <Text className="mt-5 font-sr text-[14px]">Participants:</Text>
            <View className="mt-5">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Image
                    source={require("../../../assets/images/avatar.png")}
                    style={{ width: 54, height: 53 }}
                  />
                  <Text className="font-sr text=[17px] ml-4">
                    Remilekun Olayinka
                  </Text>
                </View>
                <View>
                  <Image
                    source={require("../../../assets/images/trash.png")}
                    style={{ width: 21, height: 21 }}
                  />
                </View>
              </View>
              <View className="flex-row items-center justify-between mt-5">
                <View className="flex-row items-center">
                  <Image
                    source={require("../../../assets/images/avatar.png")}
                    style={{ width: 54, height: 53 }}
                  />
                  <Text className="font-sr text=[17px] ml-4">
                    Remilekun Olayinka
                  </Text>
                </View>
                <View>
                  <Image
                    source={require("../../../assets/images/trash.png")}
                    style={{ width: 21, height: 21 }}
                  />
                </View>
              </View>
              <View className="flex-row items-center mt-7 px-2">
                <Image
                  source={require("../../../assets/images/available.png")}
                  style={{ width: 28, height: 28 }}
                />
                <Text className="font-sr text=[17px] ml-4">
                  Add Participants
                </Text>
              </View>
              <View className="mt-10">
                <Text className="font-sr text-[14px]">Summary:</Text>
                <View className="mt-5">
                  <Text className="font-sr text-[12px] text-[#8F8F8F]">
                    Course name:
                  </Text>
                  <Text className="font-sr text-[14px]">
                    Learn to Swim: 3 - 18
                  </Text>
                </View>
                <View className="mt-5">
                  <Text className="font-sr text-[12px] text-[#8F8F8F]">
                    Number of Participants:
                  </Text>
                  <Text className="font-sr text-[14px]">2</Text>
                </View>
                <View className="mt-5">
                  <Text className="font-sr text-[12px] text-[#8F8F8F]">
                    Participants Skill Level:
                  </Text>
                  <Text className="font-sr text-[14px]">
                    Beginner | Comfortable In water
                  </Text>
                </View>
                <View className="mt-5">
                  <Text className="font-sr text-[12px] text-[#8F8F8F]">
                    Participants Health:
                  </Text>
                  <Text className="font-sr text-[14px]">
                    Medically Fit | Medically Fit
                  </Text>
                </View>
                <View className="mt-5">
                  <Text className="font-sr text-[12px] text-[#8F8F8F]">
                    Lesson type:
                  </Text>
                  <Text className="font-sr text-[14px]">
                    Private lesson, Elitesgen Facility
                  </Text>
                </View>
                <View className="mt-5">
                  <Text className="font-sr text-[12px] text-[#8F8F8F]">
                    Address:
                  </Text>
                  <Text className="font-sr text-[14px]">
                    Ayetutu Estate, Block 15, building Lekki Phase 2
                  </Text>
                </View>
                <View className="flex-row items-center mt-7 px-2 justify-end">
                  <Image
                    source={require("../../../assets/images/edit.png")}
                    style={{ width: 28, height: 28 }}
                  />
                  <Text className="font-sr text=[14px] ml-4 text-[#4F2EC9]">
                    Edit details
                  </Text>
                </View>
                <View>
                  <View>
                    <Text className="font-sr text-[14px]">Coupon:</Text>
                    <View className="mt-5">
                      <Text className="font-sr text-[14px]">
                        Referral Discounts
                      </Text>
                      <View className="flex-row items-center justify-between mt-5">
                        <QuantityController
                          initialValue={1}
                          minValue={1}
                          maxValue={10}
                          onChange={(value) =>
                            console.log("Quantity changed to:", value)
                          }
                          label="Count"
                        />

                        <TouchableOpacity
                          style={{
                            borderWidth: 1,
                            borderColor: "#D2D2D2",
                            backgroundColor: "transparent",
                            borderRadius: 26,
                            marginLeft: 10,
                          }}
                          className="px-6 py-2"
                        >
                          <Text>Apply</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#8F8F8F",
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 5,
                    borderRadius: 25,
                  }}
                  className="mt-5 px-2"
                >
                  <TextInput
                    style={{
                      flex: 1,
                      height: 40,
                      borderColor: "transparent",
                    }}
                    placeholder="Coupon Code"
                  />

                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderColor: "#4F2EC9",
                      backgroundColor: "transparent",
                      borderRadius: 26,
                      marginLeft: 10,
                    }}
                    className="px-6 py-2"
                  >
                    <Text>Apply</Text>
                  </TouchableOpacity>
                </View>
                <View className="mt-20">
                  <Text className="font-sr text-[14px]">
                  Payment invoice:
                  </Text>
                  <View className="flex-row justify-between mt-5">
                    <Text className="font-sr text-[14px]">
                    Training Fee *2
                    </Text>
                    <Text className="font-sr text-[17px]">
                     N 30,000
                    </Text>
                  </View>
                  <View className="flex-row justify-between mt-5">
                    <Text className="font-sr text-[14px]">
                    Pool Fee *2
                    </Text>
                    <Text className="font-sr text-[17px]">
                     N 15,000
                    </Text>
                  </View>
                  <View className="flex-row justify-between mt-5">
                    <Text className="font-sr text-[14px]">
                    Discounts
                    </Text>
                    <Text className="font-sr text-[17px]">
                    N -5,000
                    </Text>
                  </View>
                  <View className="flex-row justify-between mt-5">
                    <Text className="font-se text-[14px]">
                    Total Amount
                    </Text>
                    <Text className="font-se text-[21px]">
                     N 60,000
                    </Text>
                  </View>
                </View>
                <View className="mt-10">
                  <Text className="font-sr text-[14px]">By tapping ‘Continue with Payment’ you agree to our Terms and conditions.</Text>
                </View>
                <View>
              <Button
                onPress={() => navigation.navigate("ProcessPayment")}
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

export default BookingCheckoutScreen;

const styles = StyleSheet.create({});
