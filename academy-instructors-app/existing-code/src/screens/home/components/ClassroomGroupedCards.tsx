import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View
} from "react-native";
import ForwardArrow from "../../../../assets/forwardArrow.svg";
import ToggleCard from "./reuseable/ToggleCard";

const ClassroomGroupedCard = ({
  grouped,
  cards,
  setUnGrouped,
  unGrouped,
  setGrouped,
}: any) => {
  const width = Dimensions.get("window").width;

  return (
    <View>
      <View>
        <ToggleCard
          title="Ungrouped"
          count={10}
          initialExpanded={unGrouped}
          onToggle={setUnGrouped}
          widthPercentage={0.33}
        />

        {unGrouped &&
          cards.map(({ card, i }: any) => (
            <View
              key={i}
              className="rounded-xl border-[1px] border-[#D2D2D2] shadow-md mb-4"
            >
              <View className="flex-row items-center space-x-3 p-3">
                <Image
                  source={require("../../../../assets/userEllipse.png")}
                  alt="user"
                  className="w-[47px] h-[47px]"
                />
                <View className="flex-1 flex-row justify-between items-center">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text>Remilekun Olayinka</Text>
                      <View className="flex-row items-center space-x-1 mt-1">
                        <Ionicons name="star" size={10} color="#FFC107" />
                        <Text className="text-[10px] text-[#4F2EC9]">
                          Current: L2S2 - Introduction to Butterfly
                        </Text>
                      </View>
                    </View>

                    <View className="bg-[#DCF9F1] flex-row items-center rounded-full p-1">
                      <Text className="text-[8px] text-[#696969] font-semibold">
                        Move to
                      </Text>
                      <ForwardArrow width={10} height={10} />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}
      </View>

      <View>
        <ToggleCard
          title="0 stars"
          count={10}
          initialExpanded={grouped}
          onToggle={setGrouped}
          widthPercentage={0.33}
        />

        {grouped &&
          cards.map(({ card }: any, { i }: any) => (
            <View
              key={i}
              className="rounded-xl border-[1px] border-[#D2D2D2] shadow-md mb-4"
            >
              <View className="flex-row items-center space-x-3 p-3">
                <Image
                  source={require("../../../../assets/userEllipse.png")}
                  alt="user"
                  className="w-[47px] h-[47px]"
                />
                <View className="flex-1 flex-row justify-between items-center">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text>Remilekun Olayinka</Text>
                      <View className="flex-row items-center space-x-1 mt-1">
                        <Ionicons name="star" size={10} color="#FFC107" />
                        <Text className="text-[10px] text-[#4F2EC9]">
                          Current: L2S2 - Introduction to Butterfly
                        </Text>
                      </View>
                    </View>

                    <View className="bg-[#DCF9F1] flex-row items-center rounded-full p-1">
                      <Text className="text-[8px] text-[#696969] font-semibold">
                        Move to
                      </Text>
                      <ForwardArrow width={10} height={10} />
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

export default ClassroomGroupedCard;

const styles = StyleSheet.create({});
