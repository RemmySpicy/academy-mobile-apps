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
    placeholder?: string;
    control: any;
    label?: string;
    icon?: React.ReactNode;
    secureTextEntry?: boolean;
    handleShowPassword?: () => void;
    multiline?: boolean;
    className?: string;
    numberOfLines?: number;
    keyboardType?: KeyboardTypeOptions;
    handleOnChange?: (value: string | number) => void;
    maxLength?: number;
    height?: number;
}


const CustomInputs = ({
    name,
    placeholder,
    control,
    handleOnChange,
    icon,
    secureTextEntry,
    handleShowPassword,
    multiline = false,
    className,
    numberOfLines,
    keyboardType,
    maxLength,
    height,
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
                    secureTextEntry={secureTextEntry}
                    style={[
                        styles.input, 
                        isFocused === name ? styles.inputFocused : null,
                        height ? { height: height } : null
                    ]}
                    onFocus={() => setIsFocused(name)}
                    onBlur={() => setIsFocused("")}
                    placeholder={placeholder}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    keyboardType={keyboardType}
                    className={clsx(
                        'text-sm border rounded-lg px-4 pb-1 font-sr flex-1',
                        className
                    )}
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

            <View>
                {fieldState.error && <ErrorMessage message={fieldState.error.message} />}
            </View>
        </View>
    )
}

export default CustomInputs


