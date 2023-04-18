import React, { useEffect, useRef, useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { Button, Form, Input, Checkbox, Row, Col } from 'antd';
import { freelancer_logo, facebook_icon_white, hire_account, work_account } from '../../../assets'
import { AppActions } from '../../../reducers/appReducer';
import '../style.scss'
import { LeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { useAppDispatch } from '../../../reducers/hook';
import {  } from 'react-router-dom';
import { UserActions } from '../../../reducers/userReducer';
import { ResponseFormatItem, SignupFormInterface } from '../../../interface';
import { openError, openWarning } from '../../../components/Notifications';

const Signup = () => {
    let location = useLocation()
    let navigate = useNavigate()
    const account_type = [
        { img: work_account, content: 'I want to work', value: 'working' },
        { img: hire_account, content: 'I want to hire', value: 'hiring' }
    ]
    const checkboxRef = useRef<any>(null)
    const [form] = Form.useForm()
    const dispatch = useAppDispatch()
    const [componentType, setComponentType] = useState('')
    const [formValues, setformValues] = useState<SignupFormInterface>({})
    const [step, setStep] = useState(1)

    const checkExistUser = (param:any):Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
          dispatch(UserActions.checkExistUser({ param, resolve, reject }));
        });
      };

      const registerAccount = (param:any):Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
          dispatch(UserActions.registerAccount({ param, resolve, reject }));
        });
      };

      const signin = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
          dispatch(UserActions.signin({ param, resolve, reject }));
        });
      };

    useEffect(() => {

    }, [location])

    const handleBackStep = () => {
        if (step > 1) {
            setStep(step - 1)
        }
    }

    const handleSelectAccountType = (account: any) => {
        dispatch(AppActions.openLoading(true))
        registerAccount({...formValues, service_role: account.name, role_id: 3, account_type: 'normal', is_verified_account: true}).then((res) => {
            if(res.data) {
                signin({email: formValues.email, password: formValues.password}).then((response) => {
                    if(response.code === 200) {
                        localStorage.setItem("access_token", response.data!.token)
                        navigate("/new-freelancer/skills")
                    }
                })
            }
        })
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
                                    <Form.Item name="email" className="custom-form-item">
                                        <Input placeholder='email' className='form-input' />
                                    </Form.Item>
                                    <Form.Item name="password" className="custom-form-item">
                                        <Input.Password placeholder='password' className='form-input' />
                                    </Form.Item>
                                    <Row className="agree-policy">
                                        <Col span={24}>
                                            <Form.Item name="agree" className="custom-form-item" valuePropName="checked">
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
                                        <Input placeholder='username' className='form-input' />
                                    </Form.Item>
                                </div>
                            </Form>
                            <div className="form-buttons">
                                <Button form="signup_form" key="submit" htmlType="submit">Next</Button>
                            </div>
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className="main-content">
                        <div className="account-type-container">
                            {account_type.map((account, index) => {
                                return (
                                    <div className="account-type-item" key={index} onClick={() => handleSelectAccountType(account)}>
                                        <img src={account.img} alt="" />
                                        <div className="content">
                                            {account.content}
                                        </div>
                                        <ArrowRightOutlined />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
        }
    }

    const renderSubHeader = () => {
        switch (step) {
            case 1:
                return (
                    <div className="auth-container">
                        <div className="auth-description">Sign Up</div>
                        <div className="auth-login-social">
                            <img src={facebook_icon_white} />
                            <span>Continue with facebook</span>
                        </div>
                        <div className="content-divider">OR</div>
                    </div>
                )
            case 2:
                return (
                    <div className="auth-container">
                        <div className="auth-description">Choose an username</div>
                        <div className="notice">Please note that a username cannot be changed once chosen</div>
                    </div>
                )
            case 3:
                return (
                    <div className="auth-container">
                        <div className="auth-description">Select account type</div>
                        <div className="notice">Don't worry, this can be change later.</div>
                    </div>
                )
        }
    }

    const onSubmitForm = (values: any) => {
        if (step === 1) {
            if (values?.agree) {
                checkExistUser(values).then(res => {
                    if(res.code !== 200) {
                        openWarning(res?.message!)
                    } else {
                        setformValues(values)
                        setStep(2)
                    }
                })
            } else {
                checkboxRef.current.style.color = 'red'
            }
        } else if (step === 2) {
            checkExistUser(values).then(res => {
                if(res.code === 201) {
                    openWarning(values.username ? 'Username already existed' : 'Email already existed')
                } else {
                    const newData = Object.assign(formValues, values)
                    setformValues(newData)
                    setStep(3)
                }
            })
        }
    }


    return (
        <div className="auth-wrapper">
            <div className="auth-component">
                <div className="auth-logo">
                    {step > 1 && <LeftOutlined onClick={handleBackStep} />}
                    <img src={freelancer_logo} />
                </div>
                {renderSubHeader()}
                {renderMainContent()}
            </div>
        </div>
    )
}

export default Signup
