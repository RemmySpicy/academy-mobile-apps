import { Text, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import React from 'react';
import clsx from 'clsx';

interface Props {
    variant?: "primary" | "outline" | "outlineTheme" | "danger" | "gray" | "faded" | "orange" | "lightGray" | "black" | "cancel" | "normal",
    size?: "md" | "sm",
    startIcon?: React.ReactNode,
    endIcon?: React.ReactNode,
    textClassName?: "primary" | "outline" | "outlineTheme" | "danger" | "gray" | "faded" | "orange" | "lightGray" | "black" | "cancel" | "normal",
    isLoading?: boolean,
    classNames?: string,
    title: string,
    onPress?: () => void,
    disabled?: boolean,
    loaderColor?: string,
    shadow?: boolean,
    shadowColor?: string,
    shadowOpacity?: number,
    shadowOffset?: { width: number, height: number },
    shadowRadius?: number,
}

const Button = ({ variant = "primary", size = "md", startIcon, textClassName = "primary", endIcon, isLoading = false, classNames, title, onPress, disabled, loaderColor = "white", shadow = false, shadowColor = '#000', shadowOpacity = 0.2, shadowOffset = { width: 0, height: 2 }, shadowRadius = 4 }: Props) => {

    const variants = {
        primary: 'bg-theme',
        outline: 'bg-[#F5F5F5] ',
        outlineTheme: 'bg-white border border-theme',
        danger: 'bg-danger bg-opacity-10 text-danger',
        cancel: 'bg-[#4F2EC9] bg-opacity-10 text-cancel',
        normal: 'bg-[#F5F5F5] bg-opacity-10 text-normal',
        gray: 'bg-input-border-gray text-secondary',
        faded: "bg-faded text-theme",
        orange: "bg-theme-orange text-theme-black",
        lightGray: "bg-gray-bg text-secondary",
        black: "bg-theme-black text-white"
    };

    const textVariant = {
        primary: "text-white",
        outline: "text-theme-black",
        outlineTheme: "text-theme",
        danger: 'text-white',
        cancel: 'text-white',
        normal: 'text-[#4F2EC9]',
        gray: 'text-secondary',
        faded: "text-theme",
        orange: "text-theme-black",
        lightGray: "text-secondary",
        black: "text-white"
    };

    const sizes = {
        md: 'px-4 h-12',
        sm: 'px-4 h-9',
    };

    return (
        <View style={shadow ? {
            shadowColor,
            shadowOffset,
            shadowOpacity,
            shadowRadius,
            elevation: shadowRadius, 
        } : undefined}>
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled}
                className={clsx("flex-row items-center justify-center w-full rounded-[25px]", variants[variant], sizes[size], classNames)}
            >
                {isLoading && <ActivityIndicator color={loaderColor} size={24} />}
                
                {/* Start Icon at Far Left */}
                {!isLoading && (
                    <View className="absolute left-4">
                        {startIcon}
                    </View>
                )}
                
                {/* Centered Text */}
                <Text className={clsx("font-sm", textVariant[variant], textClassName)}>
                    {title}
                </Text>
                
                {/* End Icon */}
                {endIcon && <View className="absolute right-4">{endIcon}</View>}
            </TouchableOpacity>
        </View>
    );
};

export default Button;
