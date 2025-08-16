import React, { memo } from 'react'
import Modal from 'react-native-modal';
import { showItem } from '../../redux/utils';
import { useAppDispatch, useAppSelector } from '../../redux/store';

const CustomModal = ({ children, showName }: { children: React.ReactNode, showName: string }) => {

    const show = useAppSelector(state => state.utils.show)
    const dispatch = useAppDispatch()

    return (
        <Modal
            isVisible={show === showName}
            onBackdropPress={() => dispatch(showItem(null))}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            style={{ margin: 0, bottom: 0, zIndex: 100 }}
            // onSwipeComplete={() => dispatch(showItem(null))}
            // swipeDirection={['down']}
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating={true}
        >
            {children}
        </Modal>
    )
}

export default memo(CustomModal)