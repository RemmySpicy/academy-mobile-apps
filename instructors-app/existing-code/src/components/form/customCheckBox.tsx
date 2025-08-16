import { View, TouchableOpacity } from 'react-native'
import React, { FC, useState } from 'react'


interface Props {
  onPress?: (value: boolean) => void,
  value?: boolean,
  disabled?: boolean,
  variant?: "theme" | "mute" | "green" | "blue" | "purple" | "yellow"
}

const CustomCheckBox: FC<Props> = ({ onPress, value, disabled, variant = "theme" }) => {

  const [valuel, setValuel] = useState(value ?? false)

  const variants = {
    theme: 'bg-[#FF8108]',
    mute: 'bg-mute',
    green: "bg-theme-green",
    blue: "bg-theme-blue",
    purple: "bg-theme-purple",
    yellow: "bg-secondary"
  }

  const borderVariants = {
    theme: 'border-[#90C649]',
    mute: 'border-mute',
    green: "border-theme-green",
    blue: "border-theme-blue",
    purple: "border-theme-purple",
    yellow: "border-secondary"
  }

  const handleChange = () => {
    setValuel(!valuel)
    if (onPress) {
      onPress(!valuel)
    }
  }


  return (
    <TouchableOpacity onPress={() => (disabled ? null : handleChange())}>
      <View className={`w-5 border-2 h-5 rounded-md flex-row items-center justify-center ${valuel ? borderVariants[variant] : "border-gray-400"}`}>
        <View className={`w-2.5 h-2.5 rounded-md ${valuel ? variants[variant] : "bg-transparent"}`} />
      </View>
    </TouchableOpacity>
  )
}

export default CustomCheckBox