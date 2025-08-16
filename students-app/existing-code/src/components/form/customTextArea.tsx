import { View, Text, TextInput, TouchableOpacity, KeyboardTypeOptions } from 'react-native'
import React, { useState } from 'react'
import { Iconify } from 'react-native-iconify'
import { clsx } from 'clsx'
import { useController } from 'react-hook-form'
import ErrorMessage from './errorMessage'
import { styles } from '../../helper/globalStyle'
import { colors } from '../../helper/helpers'

interface Props {
    name: string;
    placeholder: string;
    control?: any;
    label?: string;
    icon?: React.ReactNode;
    className?: string;
    numberOfLines?: number;
    keyboardType?: KeyboardTypeOptions;
    handleOnChange?: (value: string | number) => void;
    maxLength?: number
}


const CustomTextArea = ({
    name,
    placeholder,
    control,
    handleOnChange,
    icon,
    className,
    numberOfLines,
    keyboardType,
    maxLength
}: Props) => {

    const [isFocused, setIsFocused] = useState("")

    const { field, fieldState } = useController({
        name,
        control,
    });


    const handleChangeText = (text: string | number) => {
        if (typeof text === 'string') {
            field.onChange(text);
        } else {
            field.onChange(text)
        }
        if (handleOnChange) {
            handleOnChange(text);
        }
    };


    return (
        <View className='space-y-2'>
            <View className="flex-row items-center w-full">
                <TextInput
                    style={[styles.input, isFocused === name ? styles.inputFocused : null]}
                    onFocus={() => setIsFocused(name)}
                    onBlur={() => setIsFocused("")}
                    placeholder={placeholder}
                    multiline={true}
                    numberOfLines={numberOfLines}
                    textAlignVertical='top'
                    keyboardType={keyboardType}
                    className={clsx('text-sm border rounded-lg h-24 px-4 py-2 font-sr flex-1', className)}
                    placeholderTextColor={colors.label}
                    maxLength={maxLength}
                    onChangeText={handleChangeText}
                    value={field.value}
                />

                {
                    icon && (
                        <View className="absolute right-3 mt-1 text-gray-400">
                            {icon}
                        </View>
                    )
                }
            </View>

            <View>
                {fieldState.error && <ErrorMessage message={fieldState.error.message} />}
            </View>
        </View>
    )
}

export default CustomTextArea


