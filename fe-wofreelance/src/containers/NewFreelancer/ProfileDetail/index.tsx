import React, { useEffect, useState } from 'react'
import { ProfileDetailInterface } from '../../../interface'
import { useLocation } from 'react-router-dom'
import { UserOutlined, CameraOutlined } from '@ant-design/icons'
import { Form, Input } from 'antd'

const ProfileDetail = ({ setPercent }: ProfileDetailInterface) => {

  const location = useLocation()
  const [form] = Form.useForm()
  const [formValues, setformValues] = useState({})

  const validateMessages = {
    required: 'This field is required'
  }

  const validateSchema = {
    username: [
      {
        required: true
      }
    ],
    password: [
      {
        required: true
      }
    ]
  }

  useEffect(() => {
    const endpoint = location.pathname.split('/').at(-1)
    if (endpoint === 'profile-detail') {
      setPercent(40)
    }
  }, [location])

  const onSubmitForm = () => {

  }

  return (
    <div className="profile-detail-wrapper">
      <div className="profile-detail-avatar">
        <div className="avatar-frame">
          <UserOutlined />
        </div>
        <CameraOutlined />
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
          <Form.Item name="email" className="custom-form-item" rules={validateSchema.username}>
            <Input placeholder='Email' className='form-input' />
          </Form.Item>
          <Form.Item name="password" className="custom-form-item" rules={validateSchema.password}>
            <Input.Password placeholder='Password' className='form-input' />
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default ProfileDetail
