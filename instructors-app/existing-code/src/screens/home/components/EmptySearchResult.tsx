import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";

const EmptySearchResult = () => {
  return (
    <ScrollView>
      <View className="justify-center flex-1 text-center items-center">
        <Image
          source={require("../../../../assets/empty.png")}
          alt="user"
          className=""
          style={{ width: 150, height: 150 }}
        />
        <View>
          <Text className="text-[21px] font-semibold text-center pt-2 pb-1 text-[#1E1E1E]">
            No Results Found
          </Text>
          <Text className="text-[#8F8F8F] text-center text-xs">
            We do not have any result for the keyword you searched.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default EmptySearchResult;

const styles = StyleSheet.create({});
