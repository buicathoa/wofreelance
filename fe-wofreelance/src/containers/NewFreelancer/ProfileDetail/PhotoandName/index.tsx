/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Form, Input } from 'antd'
import { UserOutlined, CameraOutlined } from '@ant-design/icons'

import { PhotoandNameComponentInterface, UserInterface } from '../../../../interface'
import { RootState } from '../../../../reducers/rootReducer'
import { getBase64 } from '../../../../utils/helper'
import './style.scss'

const PhotoandName = ({fileUploaded, setFileUploaded, formValues, setformValues}: PhotoandNameComponentInterface) => {

    const [base64Img, setBase64Img] = useState('')

    const user: UserInterface = useSelector((state: RootState) => state.user.user)


    const validateSchema = {
        first_name: [
            {
                required: true
            }
        ],
        last_name: [
            {
                required: true
            }
        ]
    }

    const onSubmitFile = async (event: any) => {
        let file = event.target.files[0]
        const base64Imgs: any = await getBase64(file)
        setBase64Img(base64Imgs)
        setFileUploaded && setFileUploaded(file)
    }

    return (
        <div className="photo-name-wrapper">
            <div className="photo-name-avatar">
                <div className="avatar-frame">
                    {(base64Img || user?.avatar) ? <img src={base64Img || user?.avatar} alt="" /> : <UserOutlined />}
                    <label htmlFor="upload_avatar">
                        <CameraOutlined className="camera-icon" />
                    </label>
                    <input
                        className="input-file"
                        type="file"
                        name="file"
                        id="upload_avatar"
                        onChange={(e) => onSubmitFile(e)}
                        accept={'/*'}
                        onClick={(event: any) => {
                            event.target.value = ''
                        }}
                    />
                </div>
            </div>
            <div className="photo-name-form">
                <div className="profile-form-header">
                    <div className="title">What is your name?</div>
                    <div className="description">Please use your real name as this will be required for identity verification.</div>
                </div>
            </div>
            <Form.Item name="first_name" label="First name" className="custom-form-item" rules={validateSchema.first_name}>
                <Input placeholder='First name' className='form-input' />
            </Form.Item>
            <Form.Item name="last_name" label="Last name" className="custom-form-item" rules={validateSchema.last_name}>
                <Input placeholder='Last name' className='form-input' />
            </Form.Item>
        </div>
    )
}

export default PhotoandName
