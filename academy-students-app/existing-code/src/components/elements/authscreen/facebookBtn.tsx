import React from "react";
import { Iconify } from "react-native-iconify";
import Button from "../button";
import { View } from "react-native";

const FacebookBtn = () => {
  return (
    <View className="w-full">
      <Button
        variant="outline"
        title="Continue with Facebook"
        startIcon={<Iconify icon="logos:facebook" />}
      />
    </View>
  );
};

export default FacebookBtn;
