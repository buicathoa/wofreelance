/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { UserOutlined, CameraOutlined } from '@ant-design/icons'
import { ResponseFormatItem, UserInterface } from '../../../../interface'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../reducers/rootReducer'
import { getBase64 } from '../../../../utils/helper'
import { Button, Form, Input, Progress } from 'antd'
import { UserActions } from '../../../../reducers/userReducer'
import './style.scss'

const PhotoandName = () => {
    const dispatch = useDispatch()

    const [fileUploaded, setFileUploaded] = useState<any>()
    const [base64Img, setBase64Img] = useState('')
    const [formValues, setformValues] = useState({})

    const user: UserInterface = useSelector((state: RootState) => state.user.user)

    useEffect(() => {
        if(user){
            setformValues(user)
        }
    }, [user])

    const [form] = Form.useForm()

    const updateUser = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.updateUser({ param, resolve, reject }));
        });
    };

    useEffect(() => {
        form.resetFields()
    }, [formValues])

    const validateMessages = {
        required: 'This field is required'
    }

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
        setFileUploaded(file)
    }

    const onSubmitForm = (values: any) => {
        const formData = new FormData()
        formData.append('avatar', fileUploaded)
        console.log('formDatahjhj', formData.get('avatar'))
        Object.keys(values).map((key, indexKey) => {
            formData.append(key, values[key])
        })
        updateUser(formData)
    }

    return (
        <div className="profile-detail-wrapper">
            <div className="profile-detail-avatar">
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
            <div className="profile-detail-form">
                <div className="profile-form-header">
                    <div className="title">What is your name?</div>
                    <div className="description">Please use your real name as this will be required for identity verification.</div>
                </div>
                <Form
                    id="profile_form_new_freelancer"
                    form={form}
                    layout="vertical"
                    name="profile_form_new_freelancer"
                    onFinish={onSubmitForm}
                    initialValues={formValues}
                    scrollToFirstError
                    validateMessages={validateMessages}
                    requiredMark={false}
                >
                    <Form.Item name="first_name" label="First name" className="custom-form-item" rules={validateSchema.first_name}>
                        <Input placeholder='First name' className='form-input' />
                    </Form.Item>
                    <Form.Item name="last_name" label="Last name" className="custom-form-item" rules={validateSchema.last_name}>
                        <Input placeholder='Last name' className='form-input' />
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default PhotoandName
