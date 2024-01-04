import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ExperiencesInterface, ResponseFormatItem, UserInterface } from 'interface';
import { Button, Card, Col, Row, Form, Input, DatePicker, Checkbox, Popover } from 'antd';
import {
    EllipsisOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs';

import { delete_icon } from 'assets';

import { UserActions } from 'reducers/listReducer/userReducer';
import { RootState } from 'reducers/rootReducer';
import { AppActions } from 'reducers/listReducer/appReducer';
import { openSuccess } from 'components/Notifications';

import './style.scss'
const ModalConfirm = React.lazy(() => import('components/ModalConfirm'));
interface componentInterface{
    modify: boolean
}

const Experience = ({modify}: componentInterface) => {
    const dispatch = useDispatch()
    const [form] = Form.useForm()

    const [modifyStatus, setModifyStatus] = useState<string>('')
    const [itemSelected, setItemSelected] = useState<ExperiencesInterface>({})
    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false)
    const [isStillWorking, setIsStillWorking] = useState(false)
    const [dateEnd, setDateEnd] = useState<any>()
    const [formValues, setformValues] = useState({})

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

    const user_info: UserInterface = useSelector((state: RootState) => state.user.user_info)

    const createExperience = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.createExperience({ param, resolve, reject }));
        });
    };

    const deleteExperience = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.deleteExperience({ param, resolve, reject }));
        });
    };

    const updateExperience = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.updateExperience({ param, resolve, reject }));
        });
    };

    useEffect(() => {
        form.resetFields()
    }, [modifyStatus])

    const handleChangeWorkingTime = (e:any) => {
        setIsStillWorking(e.target.checked)
        if(e.target.checked) {
            setformValues({date_end: ''})
        }
    }

    const onSubmitForm = (values: any) => {
        const payload = { ...values, date_start: dayjs(values.date_start).format('YYYY-MM-DD'), date_end: !isStillWorking ? dayjs(values.date_end).format('YYYY-MM-DD') : null, user_id: user_info.id }
        if (modifyStatus === 'add') {
            createExperience(payload).then((res) => {
                if (res) {
                    openSuccess({notiMess: 'Action success.'})
                    setModifyStatus('')
                }
            })
        } else {
            updateExperience({ ...payload, id: itemSelected.id }).then((res) => {
                if (res) {
                    openSuccess({notiMess: 'Action success.'})
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

        if(exp.date_end === null) setIsStillWorking(true)
        setformValues({ ...exp, date_start: dayjs(exp.date_start), date_end: dayjs(exp.date_end) })
    }

    const onConfirm = () => {
        dispatch(AppActions.openLoading(true))
        deleteExperience({ id: itemSelected.id }).then((resDel) => {
            if (resDel) {
                openSuccess({notiMess: 'Action success'})
                setIsOpenModalConfirm(false)
            }
        })
    }

    const handleChangeDate = (e:any) => {
        setDateEnd(dayjs(e))
    }

    const handleAddExperience = () => {
        setModifyStatus('add')
    }

    const handleCloseForm = () => {
        setformValues({})
        setModifyStatus('')
        setIsStillWorking(false)
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
                        <Button onClick={() => handleCloseForm()} className="back">Cancel</Button>
                        <Button form="experience_form" key="submit" htmlType="submit" className="next">Save</Button>
                    </div>
                </div>
            )
        } else {
            if (user_info?.experiences!?.length === 0) {
                return (
                    <div className="card-content no-data">
                        <span className="card-text">No portfolio items have been added yet.</span>
                    </div>
                )
            } else {
                return (
                    <div className="list-item">
                        {user_info?.experiences! && user_info?.experiences!.length > 0 && user_info?.experiences!.map((exp, index) => {
                            const summary = (exp.summary!).replace(/\n/g, '<br>') || ''
                            return (
                                <div className="experience-item" key={index}>
                                    <div className="experience-item-header">
                                        <div className="title">{exp.title}</div>
                                        {modify && <div className="modify-experience">
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
                                        </div>}
                                    </div>
                                    <div className="experience-item-content">
                                        <div className="company-name">{exp.company}</div>
                                        <div className="working-process-time">
                                            <div className="from">{dayjs(exp.date_start).format("MMMM YYYY")} - </div>
                                            <div className="to">&nbsp;{!exp.date_end ? 'Present' : dayjs(exp.date_end).format("MMMM YYYY")}</div>
                                        </div>
                                        <div className="working-experience-desc"  dangerouslySetInnerHTML={{ __html: summary }}>                                            
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
            <Card size="small" title="Experience" className={`card-experience ${(!modify && (!user_info?.experiences || user_info?.experiences!.length === 0)) && 'none'}`} extra={modify && <Button onClick={() => handleAddExperience()}>Add Experience</Button>}>
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