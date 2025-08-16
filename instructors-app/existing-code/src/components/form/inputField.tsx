import { View, Text, TextInput, TouchableOpacity, KeyboardTypeOptions } from 'react-native'
import React, { useState } from 'react'
import { Iconify } from 'react-native-iconify'
import { clsx } from 'clsx'
import { styles } from '../../helper/globalStyle'
import { colors } from '../../helper/helpers'


interface Props {
    name: string,
    placeholder?: string,
    multiline?: boolean,
    numberOfLines?: number,
    handleShowPassword?: () => void
    secureTextEntry?: boolean,
    icon?: React.ReactNode,
    value: string | number,
    keyboardType?: KeyboardTypeOptions,
    maxLength?: number,
    className?: string,
    onChangeText: (value: string | number) => void
    disabled?: boolean
}


const InputField = ({
    name,
    placeholder,
    handleShowPassword,
    multiline = false,
    numberOfLines,
    secureTextEntry,
    icon,
    value,
    keyboardType = "default",
    maxLength,
    onChangeText,
    className,
    disabled = true
}: Props) => {

    const [isFocused, setIsFocused] = useState("")

    const handleChangeText = (text: string | number) => {
        onChangeText(text)
    };


    return (
        <View className="flex-row items-center w-full h-m">
            <TextInput
                secureTextEntry={secureTextEntry}
                style={[styles.input, isFocused === name ? styles.inputFocused : null]}
                onFocus={() => setIsFocused(name)}
                onBlur={() => setIsFocused("")}
                placeholder={placeholder}
                multiline={multiline}
                keyboardType={keyboardType}
                numberOfLines={numberOfLines}
                className={clsx('text-sm border h-12 rounded-lg px-4 font-sr flex-1 pb-1', className)}
                placeholderTextColor={colors.label}
                maxLength={maxLength}
                onChangeText={handleChangeText}
                value={value.toString()}
                editable={disabled}
            />

            {
                icon && (
                    <View className="absolute right-3 mt-1 text-gray-400">
                        {icon}
                    </View>
                )
            }

            {handleShowPassword && (
                <View className="absolute right-3 mt-1">
                    <TouchableOpacity
                        onPress={handleShowPassword}
                    >
                        {
                            secureTextEntry ?
                                <Iconify icon="ri:eye-off-line" size={20} color="gray" /> :
                                <Iconify icon="ri:eye-line" size={20} color="gray" />
                        }
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

export default InputField


