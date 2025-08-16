import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useController } from 'react-hook-form'
import ErrorMessage from './errorMessage';


interface Props {
  name: string;
  label?: string;
  value: string | number;
  control?: any;
  handleChange?: (data: string | number) => void
  disabled?: boolean
}

const RadioButton = ({ name, control, value, handleChange, disabled }: Props) => {

  const { field, fieldState } = useController({
    name,
    control,
  });

  const onChange = () => {
    field.onChange(value);

    if (handleChange) {
      handleChange(value!)
    }
  }



  return (
    <View className='space-y-2 items-end'>
      <TouchableOpacity onPress={() => disabled ? null : onChange()}>
        <View className={`w-5 border-2 h-5 rounded-full flex-row items-center justify-center ${value === field.value ? "border-theme" : "border-gray-400"}`}>
          <View className={`w-2.5 h-2.5 rounded-full ${value === field.value ? "bg-theme" : "bg-transparent"}`} />
        </View>
      </TouchableOpacity>

      <View>
        {fieldState.error && <ErrorMessage message={fieldState.error.message} />}
      </View>
    </View>
  )
}

export default RadioButton