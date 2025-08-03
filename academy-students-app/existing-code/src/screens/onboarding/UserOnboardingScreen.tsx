import React from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import Button from "../../components/elements/button";
import { useNavigation } from "@react-navigation/native";
import GoogleBtn from "../../components/elements/authscreen/googleBtn";
import AppleBtn from "../../components/elements/authscreen/appleBtn";
import FacebookBtn from "../../components/elements/authscreen/facebookBtn";

const { width, height } = Dimensions.get("window");

const UserOnboardingScreen: React.FC<{
  visible: boolean;
  navigation: any;
  onClose: () => void;
}> = ({ visible, onClose, navigation }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1 }}>
        <View className="items-center mt-20"></View>
        <View
          className="flex-1 bg-stone-200 mt-60 items-center px-6"
          style={{ borderRadius: 30 }}
        >
          <View className="items-center mt-5">
            <Image
              source={require("../../../assets/images/indicator.png")}
              style={{ width: 100, height: 5 }}
            />
          </View>
          <View className="w-full mt-10">
            <Button
              onPress={() => {
                onClose();
                navigation.navigate("SignInScreen");
              }}
              variant="cancel"
              title={"Login"}
            />
          </View>
          <View className="w-full mt-5">
            <Button
              onPress={() => navigation.navigate("SignUpScreen")}
              variant="normal"
              title={"Sign up"}
            />
          </View>
          <View className="flex-row space-x-4 items-center mt-5">
            <View className="h-0.5 border-t flex-1 border-[#696969]"></View>
            <Text
              className="text-lg font-sr"
              style={{ fontSize: 12, color: "black" }}
            >
              or
            </Text>
            <View className="h-0.5 border-t flex-1 border-[#696969]"></View>
          </View>
          <View className="mt-5 w-full">
            <GoogleBtn />
          </View>
          <View className="mt-5 w-full">
            <AppleBtn />
          </View>
          <View className="mt-5 w-full">
            <FacebookBtn />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UserOnboardingScreen;
