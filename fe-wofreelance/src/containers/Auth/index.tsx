import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Form, Input, Checkbox, Row, Col } from 'antd';
import { Link } from 'react-router-dom';

import { freelancer_logo, facebook_icon_white } from 'assets'

import { AppActions } from 'reducers/listReducer/appReducer';
import { useAppDispatch } from 'reducers/hook';
import { UserActions } from 'reducers/listReducer/userReducer';

import { ResponseFormatItem } from 'interface';
import { openError } from 'components/Notifications';
import { getCookie } from 'utils/helper';
import './style.scss'

const Auth = () => {
  let location = useLocation()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()
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

  const signin = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(UserActions.signin({ param, resolve, reject }));
    });
  };

  useEffect(() => {
    const login_type: any = getCookie('login_type')
    if (login_type === 'facebook') {
      const user_info: any = getCookie('user_info')
      setformValues({ email: JSON.parse(user_info).email })
    }
  }, [])



  const onSubmitForm = (values: any) => {
    dispatch(AppActions.openLoading(true))
    signin({...values, status: 'sign_up'}).then((res: any) => {
      if (res.code === 200) {
        localStorage.setItem('access_token', res.data.token)
        navigate('/dashboard')
      } else {
        openError(res.err.response.data.message)
      }
    })
  }

  const handleLoginWithFacebook = () => {
    window.open(`http://localhost:1203/v1/user/auth/facebook/callback${location.search}`, '_self')
  }

  return (
    <div className="auth-wrapper">
        <div className="auth-component">
          <div className="auth-logo">
            <img src={freelancer_logo} alt=""/>
          </div>
          <div className="auth-description">
            Welcome back!
          </div>
          <div className="auth-login-social" onClick={handleLoginWithFacebook}>
            <img src={facebook_icon_white} alt=""/>
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
        </div> 
    </div>
  )
}

export default Auth
