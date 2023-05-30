import React, { useEffect, useState } from 'react'
import './style.scss'
import { useDispatch, useSelector } from 'react-redux';
import { QualificationInterface, ResponseFormatItem, UserInterface } from '../../../interface';
import { UserActions } from '../../../reducers/listReducer/userReducer';
import { RootState } from '../../../reducers/rootReducer';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LayoutBottomProfile from '../../../components/LayoutBottom/LayoutBottomProfile';
import { Button, Card, Col, Rate, Row, Form, Input, DatePicker, Checkbox, Popover } from 'antd';
import {
    EllipsisOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom';
import { certifications } from '../../../assets';
import { QualifycationActions } from '../../../reducers/listReducer/qualificationReducer';
import dayjs from 'dayjs';



const Qualifications = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [form] = Form.useForm()

    const [modifyStatus, setModifyStatus] = useState<string>('')
    const [recordSelected, setrecordSelected] = useState({})
    const [formValues, setformValues] = useState<QualificationInterface>({})

    const qualifications: Array<QualificationInterface> = useSelector((state: RootState) => state.qualification.qualifications)

    const getAllQualification = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(QualifycationActions.getAllQualification({ param, resolve, reject }));
        });
    };

    const createQualification = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(QualifycationActions.createQualification({ param, resolve, reject }));
        });
    };

    const updateQualification = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(QualifycationActions.updateQualification({ param, resolve, reject }));
        });
    };

    useEffect(() => {
        getAllQualification({})
    }, [])

    useEffect(() => {
        form.resetFields()
    }, [formValues])

    const onSubmitForm = (values: any) => {
        if (modifyStatus === 'add') {
            createQualification(values).then((res) => {
                if(res) {
                    setModifyStatus('')
                    setformValues({})
                }
            })
        } else {
            updateQualification({...values, id: formValues.id, start_year: dayjs(values.start_year).format('YYYY')}).then((res) => {
                if(res) {
                    setModifyStatus('')
                    setformValues({})
                }
            })
        }
    }

    const handleAddQualifications = () => {
        setModifyStatus('add')
        setformValues({})
    }

    const handleEditQualification = (qual:QualificationInterface) => {
        console.log(dayjs(qual.start_year))
        setformValues({...qual, start_year: dayjs(qual?.start_year)})
        setModifyStatus('edit')
   }

    const renderCardContent = () => {
        if (modifyStatus === 'add' || modifyStatus === 'edit') {
            return (
                <div className="modify-form">
                    <Form
                        id="qualifications_form"
                        form={form}
                        layout="vertical"
                        name="qualifications_form"
                        onFinish={onSubmitForm}
                        initialValues={formValues}
                        scrollToFirstError
                        // validateMessages={validateMessages}
                        requiredMark={false}
                    >
                        <Row>
                            <Col span={12}>
                                <Form.Item name="certificate_name" label="Professional Certificate or Award" className="custom-form-item">
                                    <Input placeholder='Professional Certificate or Award' className='form-input' />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="organization_name" label="Conferring Organization" className="custom-form-item">
                                    <Input placeholder='Conferring Organization' className='form-input' />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item name="summary" className="custom-form-item" label="Summary">
                                    <Input.TextArea rows={5} placeholder="Describe your qualifcation" className="form-input textarea" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="start_year" className="custom-form-item" label="Start year">
                                    <DatePicker placeholder='Select year' picker="year" className='form-date' format="YYYY"/>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <div className="list-button user">
                        <Button onClick={() => setModifyStatus('')} className="back">Cancel</Button>
                        <Button form="qualifications_form" key="submit" htmlType="submit" className="next">Save</Button>
                    </div>
                </div>
            )
        } else {
            if (qualifications.length === 0) {
                return (
                    <div className="card-content no-data">
                        <span className="card-text">No qualifications have been added..</span>
                    </div>
                )
            } else {
                return (
                    <div className="list-item">
                        {qualifications && qualifications.length > 0 && qualifications.map((qual:QualificationInterface, index) => {
                            return (
                                <div className="qualification-item">
                                    <div className="qualification-item-header">
                                        <div className="title">{qual.certificate_name}</div>
                                        <div className="modify-qualification">
                                            <Popover
                                                content={
                                                    <ul className="qualification-popover">
                                                        <li onClick={() => handleEditQualification(qual)}>Edit</li>
                                                        <li>Delete</li>
                                                    </ul>
                                                }
                                                trigger="hover" placement='bottom'>
                                                <EllipsisOutlined />
                                            </Popover>
                                        </div>
                                    </div>
                                    <div className="qualification-item-content">
                                        <div className="company-name">{qual.organization_name}</div>
                                        <div className="working-process-time">
                                            <div className="from">{dayjs(qual.start_year).format('YYYY')} </div>
                                        </div>
                                        <div className="working-qualification-desc">
                                            {qual.summary}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
            }
        }
    }

    return (
        <Card size="small" title="Qualifications" className="card-qualification" extra={<Button onClick={() => handleAddQualifications()}>Add Qualification</Button>}>
            {renderCardContent()}
            {/* <div className="card-content no-data">
                <span className="card-text">No portfolio items have been added yet.</span>
            </div> */}
        </Card>
    )
}

export default Qualifications