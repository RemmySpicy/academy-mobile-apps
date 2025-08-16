import { useFonts } from "expo-font";

const useLoadFonts = () => {
  const [fontsLoaded, fontError] = useFonts({
    thin_200: require("../../assets/fonts/NunitoSans_10pt-Light.ttf"),
    light_300: require("../../assets/fonts/NunitoSans_10pt-Light.ttf"),
    regular_400: require("../../assets/fonts/NunitoSans_10pt-Regular.ttf"),
    medium_500: require("../../assets/fonts/NunitoSans_10pt-Medium.ttf"),
    semibold_600: require("../../assets/fonts/NunitoSans_10pt-SemiBold.ttf"),
    bold_700: require("../../assets/fonts/NunitoSans_10pt-Bold.ttf"),
  });

  return { fontsLoaded, fontError };
};

export default useLoadFonts;
