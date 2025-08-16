import React from "react";
import { Iconify } from "react-native-iconify";
import Button from "../button";
import { View } from "react-native";

const GoogleBtn = () => {
  return (
    <View className="w-full">
      <Button
        variant="outline"
        title="Continue with Google"
        startIcon={<Iconify icon="flat-color-icons:google" />}
      />
    </View>
  );
};

export default GoogleBtn;
