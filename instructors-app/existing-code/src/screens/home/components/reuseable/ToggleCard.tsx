import React, { useState } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";

interface ToggleCardProps {
  title: string;
  count?: number;
  initialExpanded?: boolean;
  onToggle?: (isExpanded: boolean) => void;
  widthPercentage?: number;
  backgroundColor?: string;
  countBackgroundColor?: string;
  iconColor?: string;
}

const ToggleCard: React.FC<ToggleCardProps> = ({
  title,
  count,
  initialExpanded = false,
  onToggle,
  widthPercentage = 0.28,
  backgroundColor = "#EFEFEF",
  countBackgroundColor = "#D2D2D2",
  iconColor = "black",
}) => {
  const { width } = useWindowDimensions();
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const handlePress = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle?.(newState);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{
        width: width * widthPercentage,
        backgroundColor,
      }}
      className="flex-row justify-between rounded-md py-2 px-2 mb-1 items-center"
    >
      {isExpanded ? (
        <AntDesign name="down" size={14} color={iconColor} />
      ) : (
        <AntDesign name="right" size={14} color={iconColor} />
      )}
      <Text>{title}</Text>
      {count !== undefined && (
        <Text
          style={{ backgroundColor: countBackgroundColor }}
          className="rounded-full px-1"
        >
          {count}
        </Text>
      )}
    </Pressable>
  );
};

export default ToggleCard;
