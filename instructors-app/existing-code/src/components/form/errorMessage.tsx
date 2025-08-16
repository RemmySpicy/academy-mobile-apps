import React from 'react'
import { Text } from 'react-native'


interface Props {
    message: string | undefined
}

const ErrorMessage = ({ message }: Props) => {
    return (
        <Text className='text-[10px] text-red-600 font-sr mb-1'>{message}</Text>
    )
}

export default ErrorMessage