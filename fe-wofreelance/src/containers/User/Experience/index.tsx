import React, { useEffect, useState } from 'react'
import './style.scss'
import { useDispatch, useSelector } from 'react-redux';
import { ExperiencesInterface, ResponseFormatItem, UserInterface } from '../../../interface';
import { UserActions } from '../../../reducers/listReducer/userReducer';
import { RootState } from '../../../reducers/rootReducer';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LayoutBottomProfile from '../../../components/LayoutBottom/LayoutBottomProfile';
import { Button, Card, Col, Rate, Row, Form, Input, DatePicker, Checkbox, Popover } from 'antd';
import {
    EllipsisOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom';
import { delete_icon } from '../../../assets';
import dayjs from 'dayjs';

import { ModalConfirm } from '../../../components/ModalConfirm';
import { AppActions } from '../../../reducers/listReducer/appReducer';
import { ExperienceActions } from '../../../reducers/listReducer/experienceReducer';


const Experience = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [form] = Form.useForm()

    const [modifyStatus, setModifyStatus] = useState<string>('')
    const [formValues, setformValues] = useState({})
    const [itemSelected, setItemSelected] = useState<ExperiencesInterface>({})
    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false)
    const [isStillWorking, setIsStillWorking] = useState(false)
    const [dateEnd, setDateEnd] = useState<any>()

    const validateMessages = {
        required: 'This field is required'
    }

    const validateSchema = {
        title: [
            {
                required: true
            }
        ],
        company: [
            {
                required: true
            }
        ],
        date_start: [
            {
                required: true
            }
        ],
        date_end: [
            {
                required: true
            }
        ],
        summary: [
            {
                required: true
            }
        ]
    }

    const experiences: Array<ExperiencesInterface> = useSelector((state: RootState) => state.experience.experiences)
    const user: UserInterface = useSelector((state: RootState) => state.user.user)


    const createExperience = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(ExperienceActions.createExperience({ param, resolve, reject }));
        });
    };

    const deleteExperience = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(ExperienceActions.deleteExperience({ param, resolve, reject }));
        });
    };

    const updateExperience = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(ExperienceActions.updateExperience({ param, resolve, reject }));
        });
    };

    const getUserInfo = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.getUserInfo({ param, resolve, reject }));
        });
    };

    // useEffect(() => {
    //     form.resetFields()
    // }, [formValues])

    const handleChangeWorkingTime = (e:any) => {
        setIsStillWorking(e.target.checked)
        if(e.target.checked) {
            form.setFieldsValue({date_end: ''})
        }
    }

    const onSubmitForm = (values: any) => {
        const payload = { ...values, date_start: dayjs(values.date_start).format('YYYY-MM-DD'), date_end: !isStillWorking ? dayjs(values.date_end).format('YYYY-MM-DD') : null, user_id: user.id }
        if (modifyStatus === 'add') {
            createExperience(payload).then((res) => {
                if (res) {
                    setModifyStatus('')
                }
            })
        } else {
            updateExperience({ ...payload, id: itemSelected.id }).then((res) => {
                if (res) {
                    setModifyStatus('')
                }
            })
        }
    }

    const handleDeleteExperience = (exp: ExperiencesInterface) => {
        setItemSelected(exp)
        setIsOpenModalConfirm(true)
    }

    const handleEditExperience = (exp: ExperiencesInterface) => {
        setModifyStatus('edit')
        setItemSelected(exp)
        if(exp.date_end === null) {
            setIsStillWorking(true)
            setDateEnd(null)
        } else {
            setIsStillWorking(false)
            setDateEnd(dayjs(exp.date_end))
        }
        form.setFieldsValue({ ...exp, date_start: dayjs(exp.date_start), date_end: dayjs(exp.date_end) })
    }

    const onConfirm = () => {
        dispatch(AppActions.openLoading(true))
        deleteExperience({ id: itemSelected.id }).then((resDel) => {
            if (resDel) {
                setIsOpenModalConfirm(false)
            }
        })
    }

    const handleChangeDate = (e:any) => {
        setDateEnd(dayjs(e))
    }

    const handleAddExperience = () => {
        form.setFieldsValue({})
        setModifyStatus('add')
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
                        // initialValues={formValues}
                        scrollToFirstError
                        validateMessages={validateMessages}
                        requiredMark={false}
                    >
                        <Row>
                            <Col span={12}>
                                <Form.Item name="title" label="Title" className="custom-form-item" rules={validateSchema.title}>
                                    <Input placeholder='title' className='form-input' />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="company" label="Company" className="custom-form-item" rules={validateSchema.company}>
                                    <Input placeholder='Company' className='form-input' />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <span className="title">Start</span>
                                <Form.Item className="custom-form-item" name="date_start" rules={validateSchema.date_start}>
                                    <DatePicker
                                        placeholder='Select date start'
                                        className='form-date'
                                        format="DD/MM/YYYY"
                                        getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <span className="title">End</span>
                                <Form.Item className="custom-form-item">
                                    <DatePicker
                                        placeholder='Select date end'
                                        className='form-date'
                                        format="DD/MM/YYYY"
                                        disabled={isStillWorking}
                                        value={dateEnd !== null ? dateEnd : null}
                                        onChange={handleChangeDate}
                                        getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item className="custom-form-item">
                                    <Checkbox className='form-checkbox' onChange={handleChangeWorkingTime} checked={isStillWorking}> I'm currently working here </Checkbox>
                                </Form.Item>
                                <Form.Item name="summary" className="custom-form-item" label="Summary" rules={validateSchema.summary}>
                                    <Input.TextArea rows={5} placeholder="Describe your working experience" className="form-input textarea" />
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
            if (experiences?.length === 0) {
                return (
                    <div className="card-content no-data">
                        <span className="card-text">No portfolio items have been added yet.</span>
                    </div>
                )
            } else {
                return (
                    <div className="list-item">
                        {experiences && experiences.length > 0 && experiences.map((exp, index) => {
                            return (
                                <div className="experience-item" key={index}>
                                    <div className="experience-item-header">
                                        <div className="title">{exp.title}</div>
                                        <div className="modify-experience">
                                            <Popover
                                                content={
                                                    <ul className="experience-popover">
                                                        <li onClick={() => handleEditExperience(exp)}>Edit</li>
                                                        <li onClick={() => handleDeleteExperience(exp)}>Delete</li>
                                                    </ul>
                                                }
                                                trigger="hover" placement='bottom'>
                                                <EllipsisOutlined />
                                            </Popover>
                                        </div>
                                    </div>
                                    <div className="experience-item-content">
                                        <div className="company-name">{exp.company}</div>
                                        <div className="working-process-time">
                                            <div className="from">{dayjs(exp.date_start).format("MMMM YYYY")} - </div>
                                            <div className="to">&nbsp;{!exp.date_end ? 'Present' : dayjs(exp.date_end).format("MMMM YYYY")}</div>
                                        </div>
                                        <div className="working-experience-desc">
                                            {exp.summary}
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
        <>
            <Card size="small" title="Experience" className="card-experience" extra={<Button onClick={() => handleAddExperience()}>Add Experience</Button>}>
                {renderCardContent()}
            </Card>
            <ModalConfirm
                title={'Confirm'}
                icon={delete_icon}
                content={'Are you sure to delete this item'}
                visible={isOpenModalConfirm}
                setVisible={setIsOpenModalConfirm}
                onConfirm={onConfirm}
            />
        </>
    )
}

export default Experience