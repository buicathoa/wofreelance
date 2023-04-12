import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Button, Form, Input, Checkbox, Row, Col } from 'antd';
import { freelancer_logo, facebook_icon_white } from './../../../assets'
import { AppActions } from '../../../reducers/appReducer';
import '../style.scss'
import {LeftOutlined} from '@ant-design/icons'
import { useAppDispatch } from '../../../reducers/hook';
import { Link } from 'react-router-dom';

const Signup = () => {
    let location = useLocation()
    const checkboxRef = useRef<any>(null)
    const [form] = Form.useForm()
    const dispatch = useAppDispatch()
    const [componentType, setComponentType] = useState('')
    const [formValues, setformValues] = useState({})
    const [step, setStep] = useState(1)

    useEffect(() => {

    }, [location])

    const handleBackStep = () => {
        if(step > 1) {
            setStep(step -1)
        }
    }

    const renderMainContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="main-content">
                        <div className="auth-form">
                            <Form
                                id="signup_form"
                                form={form}
                                layout="vertical"
                                name="signup_form"
                                onFinish={onSubmitForm}
                                initialValues={formValues}
                                scrollToFirstError
                                // validateMessages={validateMessages}
                                requiredMark={false}
                            >
                                <div className="signup-form">
                                    <Form.Item name="username" className="custom-form-item">
                                        <Input placeholder='Username' className='form-input' />
                                    </Form.Item>
                                    <Form.Item name="password" className="custom-form-item">
                                        <Input.Password placeholder='Username' className='form-input' />
                                    </Form.Item>
                                    <Row className="agree-policy">
                                        <Col span={24}>
                                            <Form.Item name="agree" className="custom-form-item">
                                                <Checkbox className='form-checkbox'><span ref={checkboxRef}>I aggree to the Freelancer <Link to="#" className="important">User Agreement</Link> and <Link to="#" className="important">Privacy Policy</Link></span></Checkbox>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                            </Form>
                            <div className="form-buttons">
                                <Button form="signup_form" key="submit" htmlType="submit">Join Freelancer</Button>
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div className="sign-up">
                            Already had account? <Link to="/signin" className="important">Sign in</Link>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="main-content">
                        <div className="auth-form">
                            <Form
                                id="signup_form"
                                form={form}
                                layout="vertical"
                                name="signup_form"
                                onFinish={onSubmitForm}
                                initialValues={formValues}
                                scrollToFirstError
                                // validateMessages={validateMessages}
                                requiredMark={false}
                            >
                                <div className="signup-form">
                                    <Form.Item name="username" className="custom-form-item">
                                        <Input placeholder='Username' className='form-input' />
                                    </Form.Item>
                                </div>
                            </Form>
                            <div className="form-buttons">
                                <Button form="signup_form" key="submit" htmlType="submit">Next</Button>
                            </div>
                        </div>
                    </div>
                )
        }
    }

    const onSubmitForm = (values: any) => {
        if (!values?.agree) {
            checkboxRef.current.style.color = 'red'
        }
        if (step === 1) {
            setStep(2)
            setformValues(values)
        }
        // dispatch(AppActions.openLoading(true))
    }


    return (
        <div className="auth-wrapper">
            <div className="auth-component">
                <div className="auth-logo">
                    {step > 1 && <LeftOutlined onClick={handleBackStep}/>}
                    <img src={freelancer_logo} />
                </div>
                {step === 1 ? <div className="auth-description">Sign Up</div> : <div className="auth-description">Choose an username</div>}
                {step === 2 && <div className="note-username">Please note that a username cannot be changed once chosen</div>}
                {step === 1 && <div className="auth-login-social">
                    <img src={facebook_icon_white} />
                    <span>Continue with facebook</span>
                </div>}
                {step === 1 && <div className="auth-other-login">OR</div>}
                {renderMainContent()}
            </div>
        </div>
    )
}

export default Signup
