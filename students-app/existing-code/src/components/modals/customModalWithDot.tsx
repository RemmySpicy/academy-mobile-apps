import React from 'react'
import Modal from 'react-native-modal';
import { showItem } from '../../redux/utils';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { TouchableOpacity, View } from 'react-native';
import { Iconify } from 'react-native-iconify';
import { deviceHeight } from '../../helper/helpers';

const CustomModalWithDot = ({ children, showName }: { children: React.ReactNode, showName: string }) => {

    const show = useAppSelector(state => state.utils.show)
    const dispatch = useAppDispatch()

    return (
        <Modal
            isVisible={show === showName}
            onBackdropPress={() => dispatch(showItem(null))}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            style={{ margin: 0, bottom: 0, zIndex: 0 }}
            // onSwipeComplete={() => dispatch(showItem(null))}
            // swipeDirection={['down']}
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating={true}
            useNativeDriverForBackdrop={true}
        >

            <View className="w-full flex-1 bottom-0 absolute space-y-4" style={{ maxHeight: deviceHeight * 0.9 }}>
                <TouchableOpacity onPress={() => dispatch(showItem(null))} className='h-10 w-10 flex items-center justify-center rounded-full mx-auto bg-white'>
                    <Iconify icon='iconamoon:close-bold' size={24} />
                </TouchableOpacity>

                {children}
            </View>
        </Modal>
    )
}

export default CustomModalWithDot