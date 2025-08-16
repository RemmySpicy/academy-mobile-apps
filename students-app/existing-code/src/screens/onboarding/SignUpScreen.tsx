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
  StyleSheet,
} from "react-native";
import Button from "../../components/elements/button";
import { useNavigation } from "@react-navigation/native";
import GoogleBtn from "../../components/elements/authscreen/googleBtn";
import AppleBtn from "../../components/elements/authscreen/appleBtn";
import FacebookBtn from "../../components/elements/authscreen/facebookBtn";
import CustomInput from "../../components/form/customInput";
import { useForm } from "react-hook-form";
import { LoginDataSchema, RegisterDataSchema } from "../../helper/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import OtpField from "../../components/elements/OtpField";
import { useAuth } from "../../auth/AuthContext";

const { width, height } = Dimensions.get("window");

const { width: screenWidth } = Dimensions.get("window");

const SignUpScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(RegisterDataSchema),
  });
  const [showPassword, setShowPassword] = useState(true);

  const [currentStep, setCurrentStep] = useState(1); // Step state
  const totalSteps = 2; // Total number of steps


  const onSubmit = async (data: any) => {
    setLoading(true);
    data.user_type = "parent"; // Add user_type to form data
    let success = await register(data);
    if (success) {
      navigation.replace("SignInScreen");
    }
    setLoading(false);
  };

  // Function to handle the "Continue" button click
  // const handleContinue = () => {
  //   if (currentStep < totalSteps) {
  //     setCurrentStep(currentStep + 1);
  //   } else {
  //     // Handle form submission if on the last step
  //     handleSubmit((data) => {
  //       console.log(data); // Handle form data
  //     })();
  //   }
  // };

  return (
    <View className="flex-1 px-4">
      <View className="h-6" />
      <View className="items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="self-start"
        >
          <Image
            source={require("../../../assets/images/ion.png")}
            style={{ width: 26, height: 26 }}
            className="mt-8"
          />
        </TouchableOpacity>
      </View>
      {/* <View style={styles.stepContainer}>
        <Text
          style={[styles.stepText, { textAlign: "right" }]}
          className="mt-5"
        >
          Step {currentStep}/{totalSteps}
        </Text>

        <View style={styles.stepIndicatorContainer} className="mt-5">
          <View
            style={[
              styles.stepIndicator,
              currentStep >= 1 && styles.activeStep,
            ]}
          />
          <View
            style={[
              styles.stepIndicator,
              currentStep >= 2 && styles.activeStep,
            ]}
          />
        </View>
      </View> */}

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }} // Center content vertically
        style={{ backgroundColor: "white" }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
      
          <>
            <View className="gap-2 mt-5">
              <Text
                className="font-se mt-5"
                style={{ fontSize: 32, color: "#121212" }}
              >
                Welcome!
              </Text>
              <Text
                className="text font-sm"
                style={{ color: "#616161", fontSize: 16 }}
              >
                Lets get to know you
              </Text>
            </View>
            <View className="space-y-4">
              <View
                style={{
                  backgroundColor: "#EFEFEF",
                  padding: 10,
                  borderRadius: 8,
                  marginTop: 20,
                  alignSelf: "flex-start", // Add this line
                }}
              >
                <Text
                  className="font-se"
                  style={{ fontSize: 16, color: "#121212" }}
                >
                  PERSONAL INFORMATION
                </Text>
              </View>
              <View className="space-y-1 mt-10">
                <CustomInput
                  control={control}
                  name="first_name"
                  placeholder="Enter your first name"
                  keyboardType="email-address"
                />
              </View>
              <View className="space-y-1">
                <CustomInput
                  control={control}
                  name="last_name"
                  placeholder="Enter your last name"
                  keyboardType="email-address"
                />
              </View>
              <View className="space-y-1">
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
                  name="phone_number"
                  placeholder="Enter your phone number"
                  keyboardType="email-address"
                />
              </View>
              <View className="space-y-1">
                <CustomInput
                  control={control}
                  name="gender"
                  placeholder="Choose your gender"
                  keyboardType="email-address"
                />
              </View>
              <View className="space-y-1">
                <CustomInput
                  control={control}
                  name="date_of_birth"
                  placeholder="Date of birth"
                  keyboardType="email-address"
                />
              </View>
              <View className="space-y-1">
                <CustomInput
                  control={control}
                  name="parent_email"
                  placeholder="Parent's email"
                  keyboardType="email-address"
                />
              </View>
              <View className="space-y-1">
                <CustomInput
                  control={control}
                  name="password"
                  placeholder="Password"
                  secureTextEntry={showPassword}
                  handleShowPassword={() => setShowPassword(!showPassword)}
                />
              </View>
              <View className="space-y-1">
                <CustomInput
                  control={control}
                  name="confirm_password"
                  placeholder="Confirm Password"
                  secureTextEntry={showPassword}
                  handleShowPassword={() => setShowPassword(!showPassword)}
                />
              </View>
            </View>
          </>
      

        {/* {currentStep === 2 && (
          <>
            <View className="gap-2 mt-10">
              <View>
                <Text
                  className="font-se"
                  style={{ fontSize: 32, color: "#121212" }}
                >
                  Verify your phone number
                </Text>
                <Text
                  className="text font-sm mt-5 "
                  style={{ color: "#616161", fontSize: 16, lineHeight: 25 }}
                >
                  Enter the code we just sent to your phone number to verify
                  your account
                </Text>
                <View className="flex-row mt-5">
                  <Text
                    className="font-sm"
                    style={{ fontSize: 16, color: "#0F0F0F" }}
                  >
                    Didn’t receive the code?
                  </Text>
                  <TouchableOpacity>
                    <Text
                      className="font-sm text-[#4F2EC9]"
                      style={{ fontSize: 16 }}
                    >
                      Resend code
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.otpContainer} className="mt-10 mb-5">
              <OtpField name="otp" control={control} maximumLength={5} />
            </View>
          </>
        )} */}
        <View className="w-full">
          <Button
            variant="cancel"
            title={"Submit"}
            classNames=" mt-5 mb-10"
            onPress={handleSubmit(onSubmit)}
            isLoading={loading}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    marginVertical: 10,
  },
  stepText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#121212",
    marginBottom: 5,
  },
  stepIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
   
  },
  stepIndicator: {
    flex: 1, // Each indicator segment takes equal space
    height: 5,
    backgroundColor: "lightgray",
    borderRadius: 2,
    marginHorizontal: 5, // Adds space between indicators
  },
  activeStep: {
    backgroundColor: "black",
  },
  otpContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SignUpScreen;
