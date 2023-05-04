import React, { Component, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Form, Input, Checkbox, Row, Col } from 'antd';
import { freelancer_logo, facebook_icon_white } from './../../assets'
import { AppActions } from '../../reducers/appReducer';
import './style.scss'
import { useAppDispatch } from '../../reducers/hook';
import { Link } from 'react-router-dom';
import { ResponseFormatItem, UserInterface } from '../../interface';
import { UserActions } from '../../reducers/userReducer';
import { openError } from '../../components/Notifications';
import axios from 'axios';
import { getCookie } from '../../utils/helper';
import { LeftOutlined } from '@ant-design/icons'

const Auth = () => {
  let location = useLocation()
  // const history = useHistory()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()
  const [formValues, setformValues] = useState({})
  const [loginType, setLoginType] = useState('')
  const [userFbInfo, setUserFbInfo] = useState<UserInterface>({})
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

  const signin = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(UserActions.signin({ param, resolve, reject }));
    });
  };

  const getUserInfo = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(UserActions.getUserInfo({ param, resolve, reject }));
    });
  };

  useEffect(() => {
    const login_type: any = getCookie('login_type')
    if (login_type === 'facebook') {
      setLoginType(login_type)
      const user_info: any = getCookie('user_info')
      setUserFbInfo(JSON.parse(user_info))
      setformValues({ email: JSON.parse(user_info).email })
    }
  }, [])

  console.log('loginType', loginType)


  const onSubmitForm = (values: any) => {
    dispatch(AppActions.openLoading(true))
    signin(values).then((res: any) => {
      if (res.code === 200) {
        localStorage.setItem('access_token', res.data.token)
        navigate('/')
      } else {
        openError(res.err.response.data.message)
      }
    })
  }

  const handleLoginWithFacebook = () => {
    window.open('http://localhost:1203/v1/user/auth/facebook/callback', '_self')
    // signinFacebook({})
  }

  return (
    <div className="auth-wrapper">
      {loginType !== 'facebook' ?
        <div className="auth-component">
          <div className="auth-logo">
            <img src={freelancer_logo} />
          </div>
          <div className="auth-description">
            Welcome back!
          </div>
          <div className="auth-login-social" onClick={handleLoginWithFacebook}>
            <img src={facebook_icon_white} />
            <span>Login with Facebook</span>
          </div>
          <div className="content-divider">OR</div>
          <div className="auth-form">
            <Form
              id="add_edit_approved_response_form"
              form={form}
              layout="vertical"
              name="add_edit_approved_response_form"
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
              <Row className="forgot-password">
                <Col span={12}>
                  <Form.Item name="password" className="custom-form-item">
                    <Checkbox className='form-checkbox'> Remember me </Checkbox>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Link to="/forgot-password">Forget password</Link>
                </Col>
              </Row>
            </Form>
            <div className="form-buttons">
              <Button form="add_edit_approved_response_form" key="submit" htmlType="submit">Log in</Button>
            </div>
          </div>
          <div className="divider"></div>
          <div className="sign-up">
            Do you have account? <Link to="/signup" className="important">Sign Up</Link>
          </div>
        </div> :
        <div className="auth-facebook-component">
          <div className="auth-facebook-header">
            <LeftOutlined />
            <img src={freelancer_logo} alt="" />
          </div>
          <div className="auth-facebook-title">Link to existing Freelancer account</div>
          <div className="auth-facebook-avatar">
            <img src={userFbInfo.avatar} alt="" />
          </div>
          <div className="auth-facebook-title">Welcome {userFbInfo.first_name}</div>
          <div className="auth-facebook-description">
            Your email address is already associated with a Freelancer account. Enter your password below to link accounts.
          </div>
          <div className="auth-form">
            <Form
              id="add_edit_approved_response_form"
              form={form}
              layout="vertical"
              name="add_edit_approved_response_form"
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
              <Row className="forgot-password facebook">
                <Col span={12}>
                  <Link to="/forgot-password">Forget password</Link>
                </Col>
              </Row>
            </Form>
          </div>
          <div className="form-buttons">
            <Button form="add_edit_approved_response_form" key="submit" htmlType="submit">Log in</Button>
          </div>
        </div>
      }
    </div>
  )
}

export default Auth
