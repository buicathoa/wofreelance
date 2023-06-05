import React from 'react'
import './style.scss'
import { Alert } from 'antd'
import { AlertBannerComponentInterface } from '../../interface'

export const AlertBanner = ({title, description, type}: AlertBannerComponentInterface) => {

    const onClose = () => {

    }
    return (
        <Alert
            message={title}
            description={description}
            type={type ?? undefined}
            closable
            onClose={onClose}
            showIcon
        />
    )
}
