// QuantityController.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface QuantityControllerProps {
  initialValue: number;
  minValue: number;
  maxValue: number;
  onChange: (value: number) => void;
  label: string;
}

const QuantityController: React.FC<QuantityControllerProps> = ({
  initialValue,
  minValue,
  maxValue,
  onChange,
  label,
}) => {
  const [quantity, setQuantity] = useState(initialValue);
  const [totalCount, setTotalCount] = useState(initialValue);

  const handleIncrease = () => {
    if (quantity < maxValue) {
      setQuantity(quantity + 1);
      setTotalCount(totalCount + 1);
      onChange(quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > minValue) {
      setQuantity(quantity - 1);
      setTotalCount(totalCount - 1);
      onChange(quantity - 1);
    }
  };

  return (
    <View className="flex-row items-center">
      <TouchableOpacity onPress={handleDecrease}>
        <Text className="font-sr text-[14px] text-[#4F2EC9]">-</Text>
      </TouchableOpacity>
      <Text className="font-sr text-[14px] mx-4">{quantity}</Text>
      <TouchableOpacity onPress={handleIncrease}>
        <Text className="font-sr text-[14px] text-[#4F2EC9]">+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuantityController;