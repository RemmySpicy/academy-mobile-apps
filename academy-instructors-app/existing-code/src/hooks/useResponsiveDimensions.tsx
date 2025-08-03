import { useState, useEffect } from "react";
import { Dimensions } from "react-native";

export const useResponsiveDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
      });
    });

    return () => subscription.remove();
  }, []);

  const isSmallDevice = dimensions.width < 375;
  const isMediumDevice = dimensions.width >= 375 && dimensions.width < 768;
  const isLargeDevice = dimensions.width >= 768;

  return {
    ...dimensions,
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
  };
};
