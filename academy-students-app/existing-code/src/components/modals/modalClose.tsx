import React from 'react'
import { useDispatch } from 'react-redux'
import { showItem } from '../../redux/utils'
import { Iconify } from 'react-native-iconify'
import { TouchableOpacity } from 'react-native'

const ModalClose = () => {

    const dispatch = useDispatch()

    return (
        <TouchableOpacity onPress={() => dispatch(showItem(null))}>
            <Iconify icon='iconamoon:close-duotone' size={32} />
        </TouchableOpacity>
    )
}

export default ModalClose