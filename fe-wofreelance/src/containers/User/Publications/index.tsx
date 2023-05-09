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



const Publications = () => {
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
                        id="publications_form"
                        form={form}
                        layout="vertical"
                        name="publications_form"
                        onFinish={onSubmitForm}
                        initialValues={formValues}
                        scrollToFirstError
                        // validateMessages={validateMessages}
                        requiredMark={false}
                    >
                        <Row>
                            <Col span={12}>
                                <Form.Item name="title" label="Publication Title" className="custom-form-item">
                                    <Input placeholder='Publication Title' className='form-input' />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="Company" label="Publisher" className="custom-form-item">
                                    <Input placeholder='Publisher' className='form-input' />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item name="password" className="custom-form-item" label="Summary">
                                    <Input.TextArea rows={5} placeholder="Describe your qualifcation" className="form-textarea" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <div className="list-button user">
                        <Button onClick={() => setModifyStatus('')} className="back">Cancel</Button>
                        <Button form="publications_form" key="submit" htmlType="submit" className="next">Save</Button>
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
                        <div className="publication-item">
                            <div className="publication-item-header">
                                <div className="title">Frontend</div>
                                <div className="modify-publication">
                                    <Popover
                                        content={
                                            <ul className="publication-popover">
                                                <li>Edit</li>
                                                <li>Delete</li>
                                            </ul>
                                        }
                                        trigger="hover" placement='bottom'>
                                        <EllipsisOutlined />
                                    </Popover>
                                </div>
                            </div>
                            <div className="publication-item-content">
                                <div className="company-name">Basebs</div>
                                <div className="working-process-time">
                                    <div className="from">Jan 1995 - </div>
                                    <div className="to">Present</div>
                                </div>
                                <div className="working-publication-desc">
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
        <Card size="small" title="Publications" className="card-publication" extra={<Button onClick={() => setModifyStatus('add')}>Add Publications</Button>}>
            {renderCardContent()}
        </Card>
    )
}

export default Publications