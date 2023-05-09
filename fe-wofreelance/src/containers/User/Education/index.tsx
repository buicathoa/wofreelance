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



const Education = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [form] = Form.useForm()

    const [modifyStatus, setModifyStatus] = useState<string>('')
    const [listExp, setListExp] = useState([])
    const [formValues, setformValues] = useState({})

    const onSubmitForm = (values: any) => {

    }

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
                                <Form.Item name="title" label="Professional Certificate or Award" className="custom-form-item">
                                    <Input placeholder='Professional Certificate or Award' className='form-input' />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="Company" label="Conferring Organization" className="custom-form-item">
                                    <Input placeholder='Conferring Organization' className='form-input' />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item name="password" className="custom-form-item" label="Summary">
                                    <Input.TextArea rows={5} placeholder="Describe your qualifcation" className="form-textarea" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="username" className="custom-form-item" label="Start year">
                                    <DatePicker placeholder='Select year' picker="year" className='form-date' />
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
                        <span className="card-text">No qualifications have been added..</span>
                    </div>
                )
            } else {
                return (
                    <div className="list-experiences">
                        <div className="education-item">
                            <div className="education-item-header">
                                <div className="title">Frontend</div>
                                <div className="modify-education">
                                    <Popover
                                        content={
                                            <ul className="education-popover">
                                                <li>Edit</li>
                                                <li>Delete</li>
                                            </ul>
                                        }
                                        trigger="hover" placement='bottom'>
                                        <EllipsisOutlined />
                                    </Popover>
                                </div>
                            </div>
                            <div className="education-item-content">
                                <div className="company-name">Basebs</div>
                                <div className="working-process-time">
                                    <div className="from">Jan 1995 - </div>
                                    <div className="to">Present</div>
                                </div>
                                <div className="working-education-desc">
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
        <Card size="small" title="Education" className="card-education" extra={<Button onClick={() => setModifyStatus('add')}>Add Education</Button>}>
            {renderCardContent()}
            {/* <div className="card-content no-data">
                <span className="card-text">No portfolio items have been added yet.</span>
            </div> */}
        </Card>
    )
}

export default Education