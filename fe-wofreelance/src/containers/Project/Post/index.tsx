import React, { useEffect, useState } from 'react'
import { freelancer_logo } from '../../../assets'
import './style.scss'
import { Alert, AutoComplete, Button, Col, DatePicker, Form, Input, Row, Select } from 'antd'
import { removeAccentsToLower, renderFileIcon } from '../../../utils/helper'
import { DefaultOptionType } from 'antd/es/select'

import { GoldTwoTone, IdcardTwoTone, UploadOutlined, ClockCircleTwoTone, DollarTwoTone, SmileTwoTone } from '@ant-design/icons'
import { AlertBanner } from '../../../components/AlertBanner'
import { useDispatch } from 'react-redux'
import { AppActions } from '../../../reducers/listReducer/appReducer'
import { BudgetInterface, CurrencyInterface, ResponseFormatList } from '../../../interface'
import { useSelector } from 'react-redux'
import { RootState } from '../../../reducers/rootReducer'
import { CategoryActions } from '../../../reducers/listReducer/categoryReducer'
import { PostActions } from '../../../reducers/listReducer/postReducer'
export const Post = () => {
    const dispatch = useDispatch()
    const [form] = Form.useForm()

    const [step, setStep] = useState(1)

    const [formValues, setformValues] = useState<any>({})
    const [listSkills, setlistSkills] = useState<Array<DefaultOptionType>>([])
    const [listPrice, setListPrice] = useState({ name: 'Standard', from: 15, to: 25 })
    const [budgetOption, setBudgetOption] = useState([])

    const [paidTypeSelected, setPaidTypeSelected] = useState('')
    const [currencySelected, setCurrencySelected] = useState(1)
    const [budgetSelected, setBudgetSelected] = useState<any>()
    const [postPurposeSelected, setPostPurposeSelected] = useState('')
    const [projectTypeSelected, setProjectTypeSelected] = useState('')
    const [listSkillSelected, setListSkillsSelected] = useState([])
    const [isComplete, setIsComplete] = useState(false)
    const [listFilesSelected, setListFilesSelected] = useState([])

    const postPurpose = [
        { icon: <IdcardTwoTone />, title: 'Post a project', description: 'Receive free quotes, best for when you have a specific idea, the project is not visual in nature or the project is complex.', is_recommend: true, value: 'project' },
        { icon: <GoldTwoTone />, title: 'Start a contests', description: 'Crowdsource ideas. Post a prize and get competing entries which you can iterate on with feedback. Great for visual designs.', is_recommend: false, value: 'contest' }
    ]

    const paidTypes = [
        { icon: <ClockCircleTwoTone />, title: 'Pay by the hour', description: 'Hire based on an hourly rate and pay for hours billed. Best for ongoing work.', value: 'hourly' },
        { icon: <DollarTwoTone />, title: 'Pay fixed price', description: 'Agree on a price and release payment when the job is done. Best for one-off tasks.', value: 'fixed' }
    ]

    const projectType = [
        { icon: <IdcardTwoTone />, title: 'Standard project', description: 'Free to post, your project will go live instantly and start receiving bids within seconds.', is_recommend: true, value: 'standard' },
        { icon: <SmileTwoTone />, title: 'Recruiter project', description: "You'll get connected to one of our expert staff right away to help find the perfect freelancer.", is_recommend: false, value: 'recruiter' }
    ]

    const currencies: Array<CurrencyInterface> = useSelector((state: RootState) => state.app.currencies)
    const budgets: Array<BudgetInterface> = useSelector((state: RootState) => state.app.budgets)

    const getCurrencies = (param: any): Promise<ResponseFormatList> => {
        return new Promise((resolve, reject) => {
            dispatch(AppActions.getCurrencies({ param, resolve, reject }));
        });
    };

    const getBudgets = (param: any): Promise<ResponseFormatList> => {
        return new Promise((resolve, reject) => {
            dispatch(AppActions.getBudgets({ param, resolve, reject }));
        });
    };

    const getAllSkillsets = (param: any): Promise<ResponseFormatList> => {
        return new Promise((resolve, reject) => {
            dispatch(CategoryActions.getAllSkillsets({ param, resolve, reject }));
        });
    };

    const createPost = (param: any): Promise<ResponseFormatList> => {
        return new Promise((resolve, reject) => {
            dispatch(PostActions.createPost({ param, resolve, reject }));
        });
    };

    const onSubmitForm = (values: any) => {
        const formData = new FormData()
        switch (step) {
            case 1:
                setStep(2)
                break;
            case 2:                
                setStep(3)
                break;
            case 5:
                Object.keys(values).forEach((key) => {
                    formData.append(key, values[key])
                })
                formData.append('post_type', postPurposeSelected)
                formData.append('project_paid_type', paidTypeSelected)
                formData.append('project_budget', budgetSelected)
                if (listFilesSelected.length > 0) {
                    listFilesSelected.forEach(element => {
                        formData.append('files', element)
                    });
                }
                if (listSkillSelected.length > 0) {
                    const skills = listSkillSelected.map((skill: any) => {
                        return skill.value
                    })
                    formData.append('list_skills', JSON.stringify(skills))
                }
                // debugger
                createPost(formData)
                break;
        }
    }

    const handleChangeForm = (changedValues: any, allValues: any) => {
        const valueform = { ...formValues, ...changedValues }
        setformValues(valueform)
    }

    const validateMessages = {
        required: 'This field is required'
    }

    const validateSchema = {
        title: [
            {
                required: true
            }
        ],
        project_detail: [
            {
                required: true
            }
        ]
    }

    const onSubmitFile = (e: any) => {
        let files: any = [...listFilesSelected, e.target.files[0]]
        setListFilesSelected(files)
    }

    const handleSearch = (text: string) => {
        let timeout
        if (timeout) {
            clearTimeout(timeout)
            timeout = null
        }
        const getSkillsApi = () => {
            getAllSkillsets({}).then((res: any) => {
                const recordFound = res?.data?.filter((skill: any) => (skill.name).toLowerCase().includes(text.toLowerCase()))
                    .map((skill: any) => {
                        return { text: skill.name, value: skill.id }
                    })
                setlistSkills(recordFound)
            })
        }


        if (text !== '') {
            timeout = setTimeout(getSkillsApi, 300)
        } else {
            setlistSkills([])
        }
    }

    const handleSelectPostPurpose = (item: any, currentStep: number) => {
        if (step <= currentStep) {
            setStep(4)
        }
        setIsComplete(false)
        setPostPurposeSelected(item.value)
    }

    const handleSelectPaidType = (item: any) => {
        setPaidTypeSelected(item.value)
        getBudgets({ currency_id: currencySelected, project_type: item.value }).then((res: any) => {
            if (res) {
                if (step === 4 || step === 5) {
                    setBudgetSelected(res.data[0].id)
                }
            }
        })
        setStep(5)
        setIsComplete(true)
    }

    const handleChangeCurrency = (event: any) => {
        setCurrencySelected(event)
        getBudgets({ currency_id: event, project_type: paidTypeSelected }).then((res: any) => {
            if (res) {
                setBudgetSelected(res.data[0].id)
            }
        })
    }

    const handleChangeBudgets = (event: any) => {
        setBudgetSelected(event)
    }

    const handleChangeSkills = (skills: any) => {
        // console.log(skills)
        setListSkillsSelected(skills)
    }

    const handleRemoveFile = (file: any) => {
        const files = listFilesSelected.filter((a: File) => file.name !== a.name)
        setListFilesSelected(files)
    }

    return (
        <div className="post-wrapper">
            <div className="post-header">
                <div className="post-header-content">
                    <div className="post-header-logo">
                        <img src="https://www.f-cdn.com/assets/main/en/assets/freelancer-logo-light.svg" alt="" />
                    </div>
                    <div className="post-header-content">
                        <div className="title">
                            Tell us what you need done
                        </div>
                        <div className="content">
                            Contact skilled freelancers within minutes. View profiles, ratings, portfolios and chat with them. Pay the freelancer only when you are 100% satisfied with their work.
                        </div>
                    </div>
                </div>
            </div>
            <div className="post-main-content">
                <div className="post-main-content-container">
                    <Form
                        id="post_project"
                        form={form}
                        layout="vertical"
                        name="post_project"
                        onFinish={onSubmitForm}
                        initialValues={formValues}
                        onValuesChange={handleChangeForm}
                        scrollToFirstError
                        validateMessages={validateMessages}
                        requiredMark={false}
                    >
                        {1 <= step && (
                            <div className="step-item">
                                <Form.Item name="title" className="custom-form-item" rules={validateSchema.title}>
                                    <Input placeholder='Choose a name for a project' className='form-input project-name' />
                                </Form.Item>
                                <div className="description-step-1">
                                    <div className="description-left">
                                        <img src="https://www.f-cdn.com/assets/main/en/assets/post-job-page/tips-and-updates.svg" alt="" />
                                    </div>
                                    <div className="description-right">
                                        <span className="description-title-right">
                                            Hint: It helps to be specific!
                                        </span>
                                        <div className="description-right-bottom">
                                            <span>Describe what you need and what it's for. For example:</span>
                                            <ul>
                                                <li>Website for a French bakery</li>
                                                <li>Mobile app for fitness startup</li>
                                                <li>Photographers needed for my wedding</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <Form.Item name="project_detail" className="custom-form-item" rules={validateSchema.project_detail} label='Project detail'>
                                    <Input.TextArea placeholder='Choose a name for a project' className='form-input textarea' rows={4} maxLength={1000} showCount={false} />
                                </Form.Item>
                                <div className="attached-file-wrapper">
                                    <div className="attached-file-left">
                                        <label htmlFor="upload_file">
                                            <div className="upload-button">
                                                <UploadOutlined />Attach Files
                                            </div>
                                            <div className="attached-file-right">
                                                Drag & drop any images or documents that might be helpful in explaining your brief here (Max file size: 25 MB).
                                            </div>
                                        </label>
                                        <input
                                            className="input-file"
                                            type="file"
                                            name="file"
                                            id="upload_file"
                                            onChange={(e) => onSubmitFile(e)}
                                            accept={'/*'}
                                            onClick={(event: any) => {
                                                event.target.value = ''
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="files-list">
                                    {listFilesSelected.length > 0 && listFilesSelected.map((file: any, index) => {
                                        return (
                                            <div className="file-item" key={index}>
                                                <div className="file-item-left">
                                                    <img src={renderFileIcon(file.name.split('.').at(-1))} />
                                                    <span className="file-name">{file.name}</span>
                                                </div>
                                                <div className="file-item-mid">{(file.size / 1024).toFixed(2)} KB</div>
                                                <div className="file-item-right" onClick={() => handleRemoveFile(file)}>X</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {2 <= step && (
                            <div className="step-item">
                                <div className="title">What skills are required?</div>
                                <div className="description">
                                    Enter up to 5 skills that best describe your project. Freelancers will use these skills to find projects they are most interested and experienced in.
                                </div>
                                <Form.Item className="custom-form-item">
                                    <Select
                                        showSearch
                                        className='form-select multiple'
                                        value={listSkillSelected.length > 0 ? listSkillSelected.map((d: any) => {
                                            return d.value
                                        }) : []}
                                        placeholder={"Select skills"}
                                        defaultActiveFirstOption={false}
                                        showArrow={false}
                                        filterOption={false}
                                        onSearch={handleSearch}
                                        onChange={handleChangeSkills}
                                        notFoundContent={null}
                                        mode='multiple'
                                        labelInValue
                                        options={(listSkills || []).map((d) => ({
                                            value: d.value,
                                            label: d.text,
                                        }))}
                                    />
                                </Form.Item>
                            </div>
                        )}

                        {3 <= step && (
                            <div className="step-item">
                                <div className="title">How would you like to get it done?</div>
                                <AlertBanner title={""} description="Based on the description you have written, we recommend posting a project. Work with a freelancer 1-on-1 and only pay them when you're happy with the completed work." type="warning" />
                                <div className="selection-type">
                                    <Row>
                                        {postPurpose.map((proj, idProj) => {
                                            return (
                                                <Col xl={12} md={12} xs={24} className={`selection-item-wrapper ${postPurposeSelected === proj.value && 'active'}`} onClick={() => handleSelectPostPurpose(proj, 3)}>
                                                    <div className="selection-item" key={idProj}>
                                                        <div className="selection-item-icon">
                                                            {proj.icon}
                                                        </div>
                                                        <div className="selection-item-right">
                                                            <div className="selection-item-title">{proj.title}</div>
                                                            <div className="selection-item-description">{proj.description}</div>
                                                        </div>
                                                        <div className="recommend-selection">
                                                            {proj.is_recommend && <span>Recommend</span>}
                                                        </div>
                                                    </div>
                                                </Col>
                                            )
                                        })}
                                    </Row>
                                </div>
                            </div>
                        )}

                        {postPurposeSelected === 'project' ? <>
                            {4 <= step && (
                                <div className="step-item">
                                    <div className="title">How do you want to pay?</div>
                                    <div className="selection-type">
                                        <Row>
                                            {paidTypes.map((item, index) => {
                                                return (
                                                    <Col xl={12} md={12} xs={24} className={`selection-item-wrapper ${paidTypeSelected === item.value && 'active'}`} onClick={() => handleSelectPaidType(item)}>
                                                        <div className="selection-item" key={index}>
                                                            <div className="selection-item-icon">
                                                                {item.icon}
                                                            </div>
                                                            <div className="selection-item-right">
                                                                <div className="selection-item-title">{item.title}</div>
                                                                <div className="selection-item-description">{item.description}</div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                )
                                            })}
                                        </Row>
                                    </div>
                                </div>
                            )}

                            {5 <= step && (
                                <div className="step-item">
                                    <div className="title">What is your estimated budget??</div>
                                    <div className="selection-type budget">
                                        <Row>
                                            <Col xl={8} md={8} xs={24}>
                                                <Form.Item className="custom-form-item">
                                                    <Select
                                                        className="form-select multiple textarea"
                                                        virtual={false}
                                                        placeholder={'Select your country'}
                                                        showSearch
                                                        value={currencySelected}
                                                        onChange={handleChangeCurrency}
                                                    >
                                                        {currencies.map((cur: CurrencyInterface, index) => {
                                                            return (
                                                                <Select.Option key={index} value={cur.id}>{cur.name}</Select.Option>
                                                            )
                                                        })}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col xl={16} md={16} xs={24}>
                                                <Form.Item className="custom-form-item">
                                                    <Select
                                                        className="form-select multiple textarea"
                                                        virtual={false}
                                                        placeholder={'Select your country'}
                                                        showSearch
                                                        value={budgetSelected}
                                                        onChange={handleChangeBudgets}
                                                    >
                                                        {budgets.map((budget: BudgetInterface, index) => {
                                                            return (
                                                                <Select.Option key={index} value={budget.id}>{`${budget.name + ` (${budget.currency.short_name + ' ' + budget.minimum + " - " + budget.maximum + ' ' + budget.currency.name})`}`}</Select.Option>
                                                            )
                                                        })}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            )}
                        </> : <>

                        </>}

                        {isComplete &&
                            (<div className="step-item">
                                <div className="title">Are these details correct?</div>
                                <div className="detail-container">
                                    <div className="detail-left">
                                        <IdcardTwoTone />
                                        <div className="detail-left-title">PROJECT</div>
                                        <div className="detail-left-budget">£10 – 15 GBP per hour</div>
                                    </div>
                                    <div className="detail-right">
                                        <div className="detail-right-title">{formValues.title}</div>
                                        <div className="detail-right-description">{formValues.project_detail}</div>
                                        <div className="detail-right-tags">
                                            {listSkillSelected.length > 0 && listSkillSelected.map((skill: any, index) => {
                                                return (
                                                    <span key={index}>{skill.label}</span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>)}

                    </Form>
                    <div className={`post-main-content-button ${(step === 3 || step === 4) && 'none'}`}>
                        <Button form="post_project" key="submit" htmlType="submit">{isComplete ? 'Yes, post my project' : 'Next'}</Button>
                        <span className="enter">Press ENTER</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
