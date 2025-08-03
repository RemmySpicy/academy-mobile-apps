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
    loaderColor?: string
}

const Buttons = ({ 
    variant = "primary", 
    size = "md", 
    startIcon, 
    textClassName = "primary", 
    endIcon, 
    isLoading = false, 
    classNames, 
    title, 
    onPress, 
    disabled, 
    loaderColor = "white" 
}: Props) => {

    const variants = {
        primary: 'bg-theme',
        outline: 'bg-white border border-[#E2E8F0]',  // Updated border color
        outlineTheme: 'bg-white border border-[#E2E8F0]',  // Updated border color
        danger: 'bg-danger bg-opacity-10 text-danger',
        cancel: 'bg-[#FF8108] bg-opacity-10 text-cancel',
        normal: 'bg-[#FFFFFF] bg-opacity-10 text-normal border border-[#E2E8F0]',  // Updated border color
        gray: 'bg-input-border-gray text-secondary',
        faded: "bg-faded text-theme",
        orange: "bg-theme-orange text-theme-black",
        lightGray: "bg-gray-bg text-secondary",
        black: "bg-theme-black text-white"
    }

    const textVariant = {
        primary: "text-white",
        outline: "text-theme-black",
        outlineTheme: "text-theme",
        danger: 'text-white',
        cancel: 'text-white',
        normal: "text-[#90C649]",
        gray: 'text-secondary',
        faded: "text-theme",
        orange: "text-theme-black",
        lightGray: "text-secondary",
        black: "text-white"
    }

    const sizes = {
        md: 'px-4 h-12',
        sm: 'px-4 h-9',
    }

    return (
        <View>
            <TouchableOpacity 
                onPress={onPress} 
                disabled={disabled} 
                className={clsx("flex-row items-center justify-center w-full space-x-3 rounded-lg border border-gray-400 rounded-[3px]", variants[variant], sizes[size], classNames)}
            >
                {isLoading && <ActivityIndicator color={loaderColor} size={24} />}
                {!isLoading && startIcon}
                <Text className={clsx("font-sm", (startIcon || endIcon) && "mt-0.5", textVariant[variant], textClassName)}>{title}</Text>
                {endIcon}
            </TouchableOpacity>
        </View>
    );
}

export default Buttons;
