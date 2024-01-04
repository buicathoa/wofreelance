import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { Button, Card, Col, Row, Form, Input, DatePicker, Popover, Select } from 'antd';
import {
    EllipsisOutlined
} from '@ant-design/icons'

import { CountryInterface, EducationInterface, ResponseFormatItem, UserEducationInterface, UserInterface } from '../../../interface';
import { UserActions } from 'reducers/listReducer/userReducer';
import { RootState } from 'reducers/rootReducer';
import { AppActions } from 'reducers/listReducer/appReducer';
import { LocationActions } from 'reducers/listReducer/locationReducer';

import { removeAccentsToLower } from 'utils/helper';

import './style.scss'
const ModalConfirm = React.lazy(() => import('components/ModalConfirm'));
interface EducationInterfaceComponent {
    modify: boolean
}

const Education = ({ modify }: EducationInterfaceComponent) => {
    const dispatch = useDispatch()
    const [form] = Form.useForm()

    const [modifyStatus, setModifyStatus] = useState<string>('')
    const [formValues, setformValues] = useState({})
    const [recordSelected, setrecordSelected] = useState<EducationInterface>({})
    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false)

    const user_info: UserInterface = useSelector((state: RootState) => state.user.user_info)
    const countries: Array<CountryInterface> = useSelector((state: RootState) => state.location.countries)
    const educations: Array<EducationInterface> = useSelector((state: RootState) => state.user.educations)

    const validateMessages = {
        required: 'This field is required'
    }

    const validateSchema = {
        country_id: [
            {
                required: true
            }
        ],
        education_id: [
            {
                required: true
            }
        ],
        degree: [
            {
                required: true
            }
        ],
        start_year: [
            {
                required: true
            }
        ],
        end_year: [
            {
                required: true
            }
        ]
    }

    useEffect(() => {
        form.resetFields()
    }, [formValues])

    const getAllCountries = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(LocationActions.getAllCountries({ param, resolve, reject }));
        });
    };

    const getAllEducation = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.getAllEducation({ param, resolve, reject }));
        });
    };

    const deleteEducation = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.deleteEducation({ param, resolve, reject }));
        });
    };

    const createEducation = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.createEducation({ param, resolve, reject }));
        });
    };

    const updateEducation = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.updateEducation({ param, resolve, reject }));
        });
    };

    const handleSelectCountry = (e: any) => {
        getAllEducation({ country_id: e })
    }

    const onSubmitForm = (values: any) => {
        dispatch(AppActions.openLoading(true))
        if (modifyStatus === 'add') {
            createEducation(values).then((res) => {
                setModifyStatus('')
                setformValues({})
            })
        } else {
            updateEducation({ ...values, id: recordSelected.id }).then((res) => {
                setModifyStatus('')
                setformValues({})
            })
        }
    }

    const handleModifyEducation = (action: string) => {
        if(action === 'add') {
            setformValues({})
            setrecordSelected({})
        }
        setModifyStatus(action)
        getAllCountries({})
    }

    const handleEditEducation = async (edu: UserEducationInterface) => {
        setModifyStatus('edit')
        setrecordSelected(edu)
        console.log('edu', edu)
        getAllCountries({country_id: edu.country_id}).then((resCountry) => {
            if (resCountry) {
                getAllEducation({ country_id: edu.country_id }).then((resEdu) => {
                    if (resEdu) {
                        setformValues({ ...edu, start_year: dayjs(edu.start_year), end_year: dayjs(edu.end_year) })
                    }
                })
            }
        })
    }

    const handleDeleteEducation = (edu: EducationInterface) => {
        setrecordSelected(edu)
        setIsOpenModalConfirm(true)
    }

    const onConfirm = () => {
        dispatch(AppActions.openLoading(true))
        deleteEducation({ id: recordSelected.id }).then((res) => {
            if (res) {
                setrecordSelected({})
                setIsOpenModalConfirm(false)
            }
        })
    }

    const handleCloseForm = () => {
        setModifyStatus('')
    }

    const renderCardContent = () => {
        if (modifyStatus === 'add' || modifyStatus === 'edit') {
            return (
                <div className="modify-form">
                    <Form
                        id="education_form"
                        form={form}
                        layout="vertical"
                        name="education_form"
                        onFinish={onSubmitForm}
                        initialValues={formValues}
                        scrollToFirstError
                        validateMessages={validateMessages}
                        requiredMark={false}
                    >
                        <Row>
                            <Col span={12}>
                                <Form.Item name="country_id" label="Country" className="custom-form-item" rules={validateSchema.country_id}>
                                    <Select
                                        className="form-select multiple textarea"
                                        allowClear
                                        virtual={false}
                                        placeholder={'Select your country'}
                                        filterOption={(input, option: any) =>
                                            removeAccentsToLower(option.children).indexOf(removeAccentsToLower(input)) >= 0
                                        }
                                        filterSort={(optionA, optionB) =>
                                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                        }
                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}

                                        onChange={handleSelectCountry}
                                        showSearch
                                    >
                                        {countries?.length > 0 && countries.map((country: any, index) => {
                                            return (
                                                <Select.Option key={index} value={country.id}>{country.country_official_name}</Select.Option>
                                            )
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="education_id" label="University / College" className="custom-form-item" rules={validateSchema.education_id}>
                                    <Select
                                        className="form-select multiple textarea"
                                        allowClear
                                        virtual={false}
                                        placeholder={'Select your university / college'}
                                        filterOption={(input, option: any) =>
                                            removeAccentsToLower(option.children).indexOf(removeAccentsToLower(input)) >= 0
                                        }
                                        filterSort={(optionA, optionB) =>
                                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                        }
                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                        showSearch
                                    >
                                        {educations?.length > 0 && educations?.map((country: any, index) => {
                                            return (
                                                <Select.Option key={index} value={country.id}>{country.university_name}</Select.Option>
                                            )
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item name="degree" className="custom-form-item" label="Degree" rules={validateSchema.degree}>
                                    <Input placeholder="Your degree" className="form-input" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="start_year" className="custom-form-item" label="Start year" rules={validateSchema.start_year}>
                                    <DatePicker placeholder='Select year' picker="year" className='form-date' format="YYYY" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="end_year" className="custom-form-item" label="End year" rules={validateSchema.end_year}>
                                    <DatePicker placeholder='Select year' picker="year" className='form-date' format="YYYY" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <div className="list-button user">
                        <Button onClick={() => handleCloseForm()} className="back">Cancel</Button>
                        <Button form="education_form" key="submit" htmlType="submit" className="next">Save</Button>
                    </div>
                </div>
            )
        } else {
            if (!user_info?.educations || user_info?.educations!.length === 0) {
                return (
                    <div className="card-content no-data">
                        <span className="card-text">No Education have been added..</span>
                    </div>
                )
            } else {
                return (
                    <div className="list-item">
                        {user_info?.educations && user_info?.educations!?.length > 0 && user_info?.educations!.map((edu, index) => {
                            return (
                                <div className="education-item" key={index}>
                                    <div className="education-item-header">
                                        <div className="title">{edu.degree}</div>
                                        {modify && <div className="modify-education">
                                            <Popover
                                                content={
                                                    <ul className="education-popover">
                                                        <li onClick={() => handleEditEducation(edu)}>Edit</li>
                                                        <li onClick={() => handleDeleteEducation(edu)}>Delete</li>
                                                    </ul>
                                                }
                                                trigger="hover" placement='bottom'>
                                                <EllipsisOutlined />
                                            </Popover>
                                        </div>}
                                    </div>
                                    <div className="education-item-content">
                                        <div className="company-name">{edu?.university_name} - {edu?.country}</div>
                                        <div className="working-process-time">
                                            <div className="from">{dayjs(edu.start_year).format("MMMM YYYY")} - </div>
                                            <div className="to">&nbsp;{!edu.end_year ? 'Present' : dayjs(edu.end_year).format("MMMM YYYY")}</div>
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
        <Card size="small" title="Education" className={`card-education ${(!modify && (!user_info?.educations || user_info?.educations?.length === 0)) && 'none'}`} extra={<Button onClick={() => handleModifyEducation('add')}>Add education</Button>}>
            {renderCardContent()}
            <ModalConfirm
                title={'Confirm'}
                // icon={delete_icon}
                content={'Are you sure to delete this item'}
                visible={isOpenModalConfirm}
                setVisible={setIsOpenModalConfirm}
                onConfirm={onConfirm}
            />
        </Card>
    )
}

export default Education