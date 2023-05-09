import React, { useEffect, useState } from 'react'
import './style.scss'
import { useDispatch, useSelector } from 'react-redux';
import { ResponseFormatItem, UserInterface } from '../../../interface';
import { UserActions } from '../../../reducers/userReducer';
import { RootState } from '../../../reducers/rootReducer';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LayoutBottomProfile from '../../../components/LayoutBottom/LayoutBottomProfile';
import { Button, Card, Col, Rate, Row, Form, Input, DatePicker, Checkbox, Popover } from 'antd';
import {
    EllipsisOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom';
import { certifications } from '../../../assets';



const Experience = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [form] = Form.useForm()

    const [modifyStatus, setModifyStatus] = useState<string>('')
    const [listExp, setListExp] = useState([1])
    const [formValues, setformValues] = useState({})

    const onSubmitForm = (values: any) => {

    }

    console.log('modifyStatus', modifyStatus)

    const renderCardContent = () => {
        if (modifyStatus === 'add' || modifyStatus === 'edit') {
            return (
                <div className="modify-form">
                    <Form
                        id="experience_form"
                        form={form}
                        layout="vertical"
                        name="experience_form"
                        onFinish={onSubmitForm}
                        initialValues={formValues}
                        scrollToFirstError
                        // validateMessages={validateMessages}
                        requiredMark={false}
                    >
                        <Row>
                            <Col span={12}>
                                <Form.Item name="title" label="Title" className="custom-form-item">
                                    <Input placeholder='title' className='form-input' />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="Company" label="Company" className="custom-form-item">
                                    <Input placeholder='Company' className='form-input' />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <span className="title">Start</span>
                                <Row>

                                    <Col span={10}>
                                        <Form.Item name="username" className="custom-form-item">
                                            <DatePicker placeholder='Select month' picker="month" className='form-date' />
                                        </Form.Item>
                                    </Col>
                                    <Col span={10}>
                                        <Form.Item name="username" className="custom-form-item">
                                            <DatePicker placeholder='Select year' picker="year" className='form-date' />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <span className="title">End</span>
                                <Row>
                                    <Col span={10}>
                                        <Form.Item name="username" className="custom-form-item">
                                            <DatePicker placeholder='Select month' picker="month" className='form-date' />
                                        </Form.Item>
                                    </Col>
                                    <Col span={10}>
                                        <Form.Item name="username" className="custom-form-item">
                                            <DatePicker placeholder='Select year' picker="year" className='form-date' />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item name="password" className="custom-form-item">
                                    <Checkbox className='form-checkbox'> I'm currently working here </Checkbox>
                                </Form.Item>
                                <Form.Item name="password" className="custom-form-item" label="Summary">
                                    <Input.TextArea rows={5} placeholder="Describe your working experience" className="form-textarea" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <div className="list-button user">
                        <Button onClick={() => setModifyStatus('')} className="back">Cancel</Button>
                        <Button form="experience_form" key="submit" htmlType="submit" className="next">Save</Button>
                    </div>
                </div>
            )
        } else {
            if (listExp.length === 0) {
                return (
                    <div className="card-content no-data">
                        <span className="card-text">No portfolio items have been added yet.</span>
                    </div>
                )
            } else {
                return (
                    <div className="list-experiences">
                        <div className="experience-item">
                            <div className="experience-item-header">
                                <div className="title">Frontend</div>
                                <div className="modify-experience">
                                    <Popover
                                        content={
                                            <ul className="experience-popover">
                                                <li>Edit</li>
                                                <li>Delete</li>
                                            </ul>
                                        }
                                        trigger="hover" placement='bottom'>
                                        <EllipsisOutlined />
                                    </Popover>
                                </div>
                            </div>
                            <div className="experience-item-content">
                                <div className="company-name">Basebs</div>
                                <div className="working-process-time">
                                    <div className="from">Jan 1995 - </div>
                                    <div className="to">Present</div>
                                </div>
                                <div className="working-experience-desc">
                                    I have so much greate memories during the time i was working here.
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        }
    }

    return (
        <Card size="small" title="Experience" className="card-experience" extra={<Button onClick={() => setModifyStatus('add')}>Add Experience</Button>}>
            {renderCardContent()}
            {/* <div className="card-content no-data">
                <span className="card-text">No portfolio items have been added yet.</span>
            </div> */}
        </Card>
    )
}

export default Experience