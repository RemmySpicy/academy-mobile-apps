import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import Button from "../../components/elements/button";
import { useNavigation } from "@react-navigation/native";
import GoogleBtn from "../../components/elements/authscreen/googleBtn";
import AppleBtn from "../../components/elements/authscreen/appleBtn";
import FacebookBtn from "../../components/elements/authscreen/facebookBtn";
import CustomInput from "../../components/form/customInput";
import { useForm } from "react-hook-form";
import { LoginDataSchema } from "../../helper/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../auth/AuthContext";
import SelectOptions from "../home/components/reuseable/SelectOptions";

const { width, height } = Dimensions.get("window");

const SignInScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { logIn } = useAuth();
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginDataSchema),
  });
  const [showPassword, setShowPassword] = useState(true);
  const options = ["Swim Coordinator", "Swim Tutor"];
  // const onSubmit = async (data: any) => {
  //   setLoading(true);

  //   let success = await logIn(data);
  //   console.log("success", success);
  //   if (success) {
  //     navigation.replace("Dashboard");
  //   }
  //   setLoading(false);
  // };

  return (
    <View className="flex-1 px-4">
      <View className="items-center mt-20">
        <Image
          source={require("../../../assets/images/swimm.png")}
          style={{ width: 117, height: 105 }}
        />
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }} // Center content vertically
        style={{ backgroundColor: "white" }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View className="gap-2 mt-5">
          <Text
            className="font-se mt-10"
            style={{ fontSize: 32, color: "#121212" }}
          >
            Welcome
          </Text>
          <Text
            className="text font-sm"
            style={{ color: "#616161", fontSize: 16 }}
          >
            We’re so excited to see you
          </Text>
        </View>
        <View className="space-y-4">
          <View className="space-y-1 mt-5">
            <CustomInput
              control={control}
              name="email"
              placeholder="Enter your email address"
              keyboardType="email-address"
            />
          </View>
          <View className="space-y-1">
            <CustomInput
              control={control}
              name="password"
              placeholder="Enter your password"
              secureTextEntry={showPassword}
              handleShowPassword={() => setShowPassword(!showPassword)}
            />
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgetPasswordScreen")}
          >
            <View className="flex-row items-center justify-end space-x-2 ">
              <Text className="font-sm text-[#4F2EC9]" style={{ fontSize: 16 }}>
                Forgot Password?
              </Text>
            </View>
          </TouchableOpacity>

          {/* <View className="border border-[#D2D2D2] rounded-lg my-5 p-3">
            <View className="space-y-3">
              <Text className="text-[#1E1E1E] text-sm">Login As:</Text>
              <View className="flex-row items-center justify-between mt-2">
                <TouchableOpacity
                  style={{
                    width: width * 0.4,
                  }}
                >
                  <Text className="text-white text-center bg-black rounded-md py-2 px-4 text-sm">
                    Swim Coordinator
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: width * 0.4,
                  }}
                >
                  <Text className="text-black text-center border-black border rounded-md py-2 px-4 text-sm">
                    Swim Tutor
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View> */}
          <View className="mt-8">
            <SelectOptions title="Login As:" options={options} />
          </View>

          <View className="w-full">
            <Button
              onPress={() => navigation.replace("Dashboard")}
              variant="cancel"
              title={"Login"}
              isLoading={loading}
              disabled={loading}
              classNames="mt-5 mb-5"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignInScreen;
