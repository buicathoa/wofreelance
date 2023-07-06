import { Button, Card, Col, Form, Input, Rate, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { ClockCircleFilled, FlagFilled, MailFilled, SmileFilled, EnvironmentFilled } from '@ant-design/icons'
import { AlertBanner } from '../../../../components/AlertBanner'

import './style.scss'
export const Details = () => {
    const [form] = Form.useForm()

    const [formValues, setformValues] = useState({})

    const validateMessages = {
        required: 'This field is required'
    }

    useEffect(() => {
        form.resetFields()
    }, [formValues])

    const onSubmitForm = () => { }

    return (
        <div className="detail-project-wrapper">
            <Row>
                <Col span={17}>
                    <div className="detail-project-left">
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
                            <div className="detail-project-info">
                                <div className="detail-project-header">
                                    <div className="title">Project Details</div>
                                    <div className="bidding-info">
                                        <div className="bidding-limit">$600 - $1500</div>
                                        <div className="bidding-time-remain">
                                            <ClockCircleFilled />
                                            <span className="bidding-remain-title">Bidding ends in 6 days, 23 hours</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="detail-project-description">
                                    I am looking for a skilled graphic designer to create a one-page keypad interface for my product. The purpose of the keypad interface is to navigate menu options. I have almost have the design in my mind. I want to show it to the Keypad vendor in a 3D looking way with Rubber buttons

                                    I have some ideas in mind for the design elements and styles, but I am open to suggestions from the designer.

                                    The primary colors that I want to use for the interface are bright colors.

                                    Ideal skills and experience for this project include:
                                    - Proficiency in graphic design software
                                    - Knowledge of user interface design principles
                                    - Creativity and ability to incorporate suggestions and ideas
                                    - Attention to detail in creating a visually appealing interface
                                    - Ability to work within given specifications and requirements
                                </div>
                                <div className="detail-project-skills">
                                    <div className="title">Skill Required</div>
                                    <div className="list-skills">
                                        <span>Graphic Design</span>
                                        <span>Photoshop</span>
                                        <span>Icon Design</span>
                                    </div>
                                </div>
                                <div className="detail-project-bottom">
                                    <span>Project ID: 335</span>
                                    <div className="report-project">
                                        <FlagFilled /> Report Project
                                    </div>
                                </div>
                                <div className="detail-project-alert">
                                    <AlertBanner title={"Beware of scams"} description='If you are being asked to pay a security deposit, or if you are being asked to chat on Telegram, WhatsApp, or another messaging platform, it is likely a scam. Report these projects or contact Support for assistance.' type='warning' />
                                </div>
                            </div>
                            <div className="detail-project-bidding">
                                <Card title="Place a Bid on this Project">
                                    <div className="alert-message">You will be able to edit your bid until the project is awarded to someone.</div>
                                    <div className="bidding-rate">
                                        <Form.Item name="email" className="custom-form-item" label="Hourly Rate">
                                            <Input placeholder='Hourly Rate' className='form-input' type="number" suffix="INR" prefix="$" />
                                        </Form.Item>
                                        <Form.Item name="email" className="custom-form-item" label="This project will be delivered in">
                                            <Input placeholder='This project will be delivered in' className='form-input' suffix="Hrs" prefix="$" />
                                        </Form.Item>
                                    </div>
                                    <div className="bidding-description">
                                        <Form.Item name="email" className="custom-form-item" label="Describe your proposal">
                                            <Input.TextArea placeholder='Describe your proposal' className='form-input text-area' />
                                        </Form.Item>
                                    </div>
                                    <div className="list-button">
                                        <Button className="back">Cancel</Button>
                                        <Button form="education_form" key="submit" htmlType="submit" className="next">Save Bid</Button>
                                    </div>
                                </Card>
                            </div>
                        </Form>
                    </div>
                </Col>
                <Col span={7}>
                    <div className="detail-project-right">
                        <div className="about-client">
                            <div className="title">About the Client</div>
                            <div className="client-direction"><EnvironmentFilled /> Ho Chi Minh City</div>
                            <div className="client-rated">
                                <Rate defaultValue={0} />
                                <span className="rated-number">0.0</span>
                            </div>
                            <div className="client-dated-joined">
                                <ClockCircleFilled /> Member since Jun 19, 2023
                            </div>
                            <div className="client-verification">
                                <div className="client-verification-item">
                                    <MailFilled /> Email verified
                                </div>
                                <div className="client-verification-item">
                                    <SmileFilled /> Profile completed
                                </div>
                            </div>
                        </div>
                        <Card title="How to write a winning bid">
                            <img src="https://www.f-cdn.com/assets/main/en/assets/project-view-page/icons-big/highlight.svg" alt="" />
                            <div className="winning-bid-description">
                                Your best chance of winning this project is writing a great bid proposal here!
                            </div>
                            <div className="winning-bid-idea">
                                <div className="winning-bid-idea-title">Great bids are ones that:</div>
                                <ul>
                                    <li>Are engaging and well written without spelling or grammatical errors</li>
                                    <li>Show a clear understanding of what is required for this specific project - personalize your response!</li>
                                    <li>Explain how your skills & experience relate to the project and your approach to working on it</li>
                                    <li>Ask questions to clarify any unclear details</li>
                                </ul>
                                <div className="winning-bid-idea-description">
                                    Most of all - don't spam or post cut-and-paste bids. You will be penalized or banned if you do so.
                                </div>
                            </div>
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    )
}
