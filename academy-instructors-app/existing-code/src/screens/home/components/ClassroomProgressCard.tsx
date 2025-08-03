import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View
} from "react-native";
import ToggleCard from "./reuseable/ToggleCard";

const ClassroomProgressCard = ({
  zeroStar,
  cards,
  setZeroStar,
  oneStar,
  setOneStar,
}: any) => {
  const width = Dimensions.get("window").width;

  return (
    <View>
      {/* Zero stars */}
      <View>
        <ToggleCard
          title="0 stars"
          count={10}
          initialExpanded={zeroStar}
          onToggle={setZeroStar}
          widthPercentage={0.33}
        />

        {zeroStar &&
          cards.map(({ card, i }: any) => (
            <View
              key={i}
              className="rounded-xl border-[1px] bg-[#FEFEFE] border-[#D2D2D2] shadow-md mb-4"
            >
              <View className="flex-row items-center space-x-3 p-3">
                <Image
                  source={require("../../../../assets/userEllipse.png")}
                  alt="user"
                  className="w-[47px] h-[47px]"
                />
                <View className="flex-1 flex-row justify-between items-center">
                  <View>
                    <Text>Remilekun Olayinka</Text>
                    <View className="flex-row items-center space-x-2 mt-1">
                      <Ionicons name="star" size={18} color="#FFC107" />
                      <Ionicons name="star" size={18} color="#FFC107" />
                      <Ionicons name="star-outline" size={18} color="#FFC107" />
                    </View>
                  </View>

                  <View className="bg-[#DCF9F1] rounded-full px-2 py-1 flex-row items-center space-x-1">
                    <Text className="text-[8px]">Confirm</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
      </View>

      {/* 1 stars */}
      <View>
        <ToggleCard
          title="1 stars"
          count={10}
          initialExpanded={oneStar}
          onToggle={setOneStar}
          widthPercentage={0.33}
        />

        {oneStar &&
          cards.map(({ card, i }: any) => (
            <View
              key={i}
              className="rounded-xl border-[1px] bg-[#FEFEFE] border-[#D2D2D2] shadow-md mb-4"
            >
              <View className="flex-row items-center space-x-3 p-3">
                <Image
                  source={require("../../../../assets/userEllipse.png")}
                  alt="user"
                  className="w-[47px] h-[47px]"
                />
                <View className="flex-1 flex-row justify-between items-center">
                  <View>
                    <Text>Remilekun Olayinka</Text>
                    <View className="flex-row items-center space-x-2 mt-1">
                      <Ionicons name="star" size={18} color="#FFC107" />
                      <Ionicons name="star" size={18} color="#FFC107" />
                      <Ionicons name="star-outline" size={18} color="#FFC107" />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}
      </View>
    </View>
  );
};

export default ClassroomProgressCard;

const styles = StyleSheet.create({});
