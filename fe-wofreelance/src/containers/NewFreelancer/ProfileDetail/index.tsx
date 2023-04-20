/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { ProfileDetailInterface, ResponseFormatItem, UserInterface } from '../../../interface'
import { useLocation, useNavigate } from 'react-router-dom'
import { UserOutlined, CameraOutlined } from '@ant-design/icons'
import { Button, Form, Input, Progress } from 'antd'
import { freelancer_logo, facebook_icon_white } from '../../../assets'
import './style.scss'
import { UserActions } from '../../../reducers/userReducer'
import { useDispatch, useSelector } from 'react-redux'
import finalPropsSelectorFactory from 'react-redux/es/connect/selectorFactory'
import { RootState } from '../../../reducers/rootReducer'
import { getBase64 } from '../../../utils/helper'
import { isFulfilled } from '@reduxjs/toolkit'

const ProfileDetail = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const [form] = Form.useForm()
  const [formValues, setformValues] = useState({})
  const [avatar, setAvatar] = useState('')
  const [base64Img, setBase64Img] = useState('')
  const [fileUploaded, setFileUploaded] = useState<any>()

  const getUserInfo = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(UserActions.getUserInfo({ param, resolve, reject }));
    });
  };

  const updateUser = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(UserActions.updateUser({ param, resolve, reject }));
    });
  };

  const user: UserInterface = useSelector((state: RootState) => state.user.user)

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

  useEffect(() => {
    form.resetFields()
  }, [formValues])

  useEffect(() => {
    if(user) {
      setformValues(user)
      setFileUploaded(user?.avatar)
    }
  }, [user])

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      getUserInfo({})
    } else {
      navigate("/signin")
    }
  }, [])

  console.log(formValues)


  const onSubmitForm = (values:any) => {
    const formData = new FormData()
    formData.append('avatar', fileUploaded)
    console.log('formDatahjhj', formData.get('avatar'))
    Object.keys(values).map((key, indexKey) => {
      formData.append(key, values[key])
    })
    updateUser(formData)
  }

  const handleMoveBackStep = () => {
    navigate('/new-freelancer/link-accounts')
  }

  const onSubmitFile = async(event: any) => {
    let file = event.target.files[0]
    const base64Imgs:any = await getBase64(file)
    setBase64Img(base64Imgs)
    setFileUploaded(file)
  }


  return (
    <div className="new-freelancer-wrapper">
      <div className="new-freelancer-container">
        <div className="new-freelancer-header">
          <img src={freelancer_logo} alt="" />
          <span>Skills</span>
        </div>
        <div className="new-freelancer-progress">
          <Progress
            percent={60}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        </div>
        <div className="new-freelancer-content profile-detail">
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
        </div>
      </div>
      <div className={`list-button link-accounts`}>
        <Button onClick={handleMoveBackStep} className="back">Back</Button>
        <Button className="next" form="profile_form_new_freelancer" key="submit" htmlType="submit">Next</Button>
      </div>
    </div>
  )
}

export default ProfileDetail
