import React from 'react'
import { Iconify } from 'react-native-iconify'
import Button from '../button'

const AppleBtn = () => {
    return (
        <Button variant="outline" title="Continue with Apple" startIcon={<Iconify icon='logos:apple' />} />
    )
}

export default AppleBtn