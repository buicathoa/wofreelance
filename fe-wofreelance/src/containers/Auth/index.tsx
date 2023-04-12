import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Button, Form, Input, Checkbox, Row, Col } from 'antd';
import {freelancer_logo, facebook_icon_white} from './../../assets'
import { AppActions } from '../../reducers/appReducer';
import './style.scss'
import { useAppDispatch } from '../../reducers/hook';
import { Link } from 'react-router-dom';

const Auth = () => {
  let location = useLocation()
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()
  const [formValues, setformValues] = useState({})


  const onSubmitForm = () => {
    dispatch(AppActions.openLoading(true))
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-component">
        <div className="auth-logo">
          <img src={freelancer_logo} />
        </div>
        <div className="auth-description">
          Welcome back!
        </div>
        <div className="auth-login-social">
          <img src={facebook_icon_white} />
          <span>Login with Facebook</span>
        </div>
        <div className="auth-other-login">OR</div>
        <div className="auth-form">
          <Form
            id="add_edit_approved_response_form"
            form={form}
            layout="vertical"
            name="add_edit_approved_response_form"
            onFinish={onSubmitForm}
            initialValues={formValues}
            scrollToFirstError
            // validateMessages={validateMessages}
            requiredMark={false}
          >
            <Form.Item name="username" className="custom-form-item">
              <Input placeholder='Username' className='form-input' />
            </Form.Item>
            <Form.Item name="password" className="custom-form-item">
              <Input.Password placeholder='Username' className='form-input' />
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
