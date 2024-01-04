import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
    EllipsisOutlined
} from '@ant-design/icons'
import { Button, Card, Col, Row, Form, Input, DatePicker, Popover } from 'antd';
import dayjs from 'dayjs';

import { delete_icon } from 'assets';
import { QualificationInterface, ResponseFormatItem, UserInterface } from 'interface';

import { RootState } from 'reducers/rootReducer';
import { AppActions } from 'reducers/listReducer/appReducer';
import { UserActions } from 'reducers/listReducer/userReducer';

import './style.scss'
interface QualificationsInteface {
    modify: boolean
}

const ModalConfirm = React.lazy(() => import('components/ModalConfirm'));

const Qualifications = ({modify}: QualificationsInteface) => {
    const dispatch = useDispatch()
    const [form] = Form.useForm()

    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false)
    const [modifyStatus, setModifyStatus] = useState<string>('')
    const [recordSelected, setrecordSelected] = useState<QualificationInterface>({})
    const [formValues, setformValues] = useState<QualificationInterface>({})
    const user_info: UserInterface = useSelector((state: RootState) => state.user.user_info)

    const createQualification = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.createQualification({ param, resolve, reject }));
        });
    };

    const updateQualification = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.updateQualification({ param, resolve, reject }));
        });
    };

    const deleteQualification = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.deleteQualification({ param, resolve, reject }));
        });
    };


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
        setformValues({...qual, start_year: dayjs(qual?.start_year)})
        setModifyStatus('edit')
   }

   const handleDeleteQualification = (record: QualificationInterface) => {
        setrecordSelected(record)
        setIsOpenModalConfirm(true)
   }

   const onConfirm = () => {
    dispatch(AppActions.openLoading(true))
    deleteQualification({ id: recordSelected.id }).then((resDel) => {
        if (resDel) {
            setIsOpenModalConfirm(false)
        }
    })
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
            if (user_info?.qualifications!?.length === 0) {
                return (
                    <div className="card-content no-data">
                        <span className="card-text">No qualifications have been added..</span>
                    </div>
                )
            } else {
                return (
                    <div className="list-item">
                        {user_info?.qualifications && user_info?.qualifications.length > 0 && user_info?.qualifications.map((qual:QualificationInterface, index) => {
                            const summary = (qual.summary!).replace(/\n/g, '<br>') || ''
                            return (
                                <div className="qualification-item">
                                    <div className="qualification-item-header">
                                        <div className="title">{qual.certificate_name}</div>
                                        {modify && <div className="modify-qualification">
                                            <Popover
                                                content={
                                                    <ul className="qualification-popover">
                                                        <li onClick={() => handleEditQualification(qual)}>Edit</li>
                                                        <li onClick={() => handleDeleteQualification(qual)}>Delete</li>
                                                    </ul>
                                                }
                                                trigger="hover" placement='bottom'>
                                                <EllipsisOutlined />
                                            </Popover>
                                        </div>}
                                    </div>
                                    <div className="qualification-item-content">
                                        <div className="company-name">{qual.organization_name}</div>
                                        <div className="working-process-time">
                                            <div className="from">{dayjs(qual.start_year).format('YYYY')} </div>
                                        </div>
                                        <div className="working-qualification-desc" dangerouslySetInnerHTML={{ __html: summary }}></div>
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
        <Card size="small" title="Qualifications" className={`card-qualification ${(!modify && user_info?.qualifications!.length === 0) && 'none'}`} extra={modify && <Button onClick={() => handleAddQualifications()}>Add Qualification</Button>}>
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

export default Qualifications