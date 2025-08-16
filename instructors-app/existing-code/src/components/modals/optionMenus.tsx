import { Button, Pressable, Text, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import { Iconify } from 'react-native-iconify';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from 'react-native-popup-menu';
import { showItem } from '../../redux/utils';
import { colors } from '../../helper/helpers';
import { useAppDispatch } from '../../redux/store';



const OptionMenus = () => {

    const dispatch = useAppDispatch()

    return (
        <Menu>
            <MenuTrigger
                customStyles={{
                    triggerTouchable: {
                        activeOpacity: 0,
                        underlayColor: colors.gray_bg,
                    },
                    triggerWrapper: {
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                    },
                }}
            >
                <View className="bg-transparent">
                    <Iconify icon='mi:options-vertical' size={18} />
                </View>
            </MenuTrigger>


            <MenuOptions
                customStyles={{
                    optionsContainer: {
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        width: 160,
                        borderRadius: 4,
                        shadowColor: colors.label
                    }
                }}
            >
                <View className="">
                    <MenuOption
                        customStyles={{
                            OptionTouchableComponent: TouchableOpacity,
                        }}
                    >
                        <View className="flex-row items-center space-x-2 p-1">
                            <Iconify icon='ic:round-edit' size={14} />
                            <Text className="font-sr">Edits</Text>
                        </View>
                    </MenuOption>

                    <MenuOption
                        customStyles={{
                            OptionTouchableComponent: TouchableOpacity,
                        }}
                        onSelect={() => dispatch(showItem("deleteRoutes"))}>
                        <View className="flex-row items-center space-x-2 p-1">
                            <Iconify icon='material-symbols:delete' color={colors.danger} size={14} />
                            <Text className="font-sr text-danger">Delete</Text>
                        </View>
                    </MenuOption>
                </View>
            </MenuOptions>
        </Menu >
    )
}

export default OptionMenus