import clsx from "clsx";
import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { setAlert } from "../../redux/utils";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Iconify } from "react-native-iconify";
import { colors } from "../../helper/helpers";
import Modal from 'react-native-modal';



const Alert = () => {
    const { alert } = useAppSelector((state) => state.utils);
    const dispatch = useAppDispatch();

    const getTypeStyle = () => {
        switch (alert?.type) {
            case "success":
                return "border bg-faded border-theme";
            case "error":
                return "border bg-faded-danger border-danger";
            default:
                return "border bg-faded-orange border-theme-orange";
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            dispatch(setAlert(null));
        }, 3000);

        return () => clearTimeout(timeoutId);
    }, [dispatch]);


    return (
            <View className="absolute z-50 top-16 w-full">
                <Animated.View entering={FadeInDown.duration(500)} className={clsx(`w-11/12 mx-auto p-4 rounded-lg flex-row space-x-3  items-center`, getTypeStyle())}>
                    {alert?.type === "success" && (
                        <Iconify icon="icon-park-outline:check-one" size={18} color={colors.theme} />
                    )}

                    {alert?.type === "error" && (
                        <Iconify icon="icon-park-outline:close-one" size={18} color={colors.danger} />
                    )}

                    {alert?.type === "warning" && (
                        <Iconify icon="icon-park-outline:caution" size={18} color={colors.theme_orange} />
                    )}

                    <Text className="font-sr text-sm mt-0.5 flex-1">{alert?.msg}</Text>
                </Animated.View>
            </View>
    );
};

export default Alert;
