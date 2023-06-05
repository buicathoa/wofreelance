import React, { useState } from 'react'
import { freelancer_logo } from '../../../assets'
import './style.scss'
import { Alert, AutoComplete, Button, Col, Form, Input, Row, Select } from 'antd'
import { removeAccentsToLower } from '../../../utils/helper'
import { DefaultOptionType } from 'antd/es/select'

import { GoldTwoTone, IdcardTwoTone, UploadOutlined, ClockCircleTwoTone, DollarTwoTone } from '@ant-design/icons'
import { AlertBanner } from '../../../components/AlertBanner'
export const Post = () => {

    const [form] = Form.useForm()

    const [step, setStep] = useState(1)

    const [formValues, setformValues] = useState({})
    const [listSkills, setlistSkills] = useState<Array<DefaultOptionType>>([])
    const [listPrice, setListPrice] = useState({name: 'Standard', from: 15, to: 25})
    const [paidTypeSelected, setPaidTypeSelected] = useState('')
    const [currencySelected, setCurrencySelected] = useState('USD')
    const [budgetOption, setBudgetOption] = useState([])
    const [budgetSelected, setBudgetSelected] = useState('')

    const projectTypes = [
        { icon: <IdcardTwoTone />, title: 'Post a project', description: 'Receive free quotes, best for when you have a specific idea, the project is not visual in nature or the project is complex.', is_recommend: true, value: 'project' },
        { icon: <GoldTwoTone />, title: 'Start a contests', description: 'Crowdsource ideas. Post a prize and get competing entries which you can iterate on with feedback. Great for visual designs.', is_recommend: false, value: 'contest' }
    ]

    const paidTypes = [
        { icon: <ClockCircleTwoTone />, title: 'Pay by the hour', description: 'Hire based on an hourly rate and pay for hours billed. Best for ongoing work.', value: 'by_hour' },
        { icon: <DollarTwoTone />, title: 'Pay fixed price', description: 'Agree on a price and release payment when the job is done. Best for one-off tasks.', value: 'fixed_price' }
    ]

    const listCurrency = ['USD', 'NZD', 'AUD', 'GBP', 'HKD', 'SGD', 'EUR', 'CAD', 'INR']

    const onSubmitForm = (values: any) => {
        let newData;
        switch (step) {
            case 1:
                setformValues(values)
                setStep(2)
                break;
            case 2:
                setStep(3)
                break;
        }
    }

    const validateMessages = {
        required: 'This field is required'
    }

    const validateSchema = {
        username: [
            {
                required: true
            }
        ],
        password: [
            {
                required: true
            }
        ]
    }

    const onSubmitFile = (e: any) => { }

    const onSelect = () => { }

    const handleSearch = (text: string) => { }

    const handleSelectProjectType = (item: any) => {
        setStep(4)
    }

    const handleSelectPaidType = (item: any) => {
        setPaidTypeSelected(item.value)
        let options:any = []
        if(item.value === 'fixed_price') {
            options = [
                {bid_from: 10, bid_to: 30, name: 'Micro Project', value: 'micro'},
                {bid_from: 10, bid_to: 30, name: 'Simple Project', value: 'simple'},
                {bid_from: 10, bid_to: 30, name: 'Very small Project', value: 'very_small'},
                {bid_from: 10, bid_to: 30, name: 'Small Project', value: 'small'},
                {bid_from: 10, bid_to: 30, name: 'Mediumn Project', value: 'medium'},
                {bid_from: 10, bid_to: 30, name: 'Large Project', value: 'large'},
                {bid_from: 10, bid_to: 30, name: 'Larger Project', value: 'larger'},
                {bid_from: 10, bid_to: 30, name: 'Very large Project', value: 'very_large'},
                {bid_from: 10, bid_to: 30, name: 'Huge Project', value: 'huge'},
                {bid_from: 10, bid_to: 30, name: 'Major Project', value: 'major'},
                {bid_from: null, bid_to: null, name: "Customize budge", value: 'customize'}
            ]
            if(step === 4) { //chưa chọn droplist bên dưới
                setCurrencySelected('USD')
                setBudgetSelected('micro')
            }
        }
        setBudgetOption(options)
        setStep(5)
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
                        scrollToFirstError
                        validateMessages={validateMessages}
                        requiredMark={false}
                    >
                        {1 <= step && (
                            <div className="step-item">
                                <Form.Item name="title" className="custom-form-item" rules={validateSchema.username}>
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
                                <Form.Item name="project_detail" className="custom-form-item" rules={validateSchema.username} label='Project detail'>
                                    <Input.TextArea placeholder='Choose a name for a project' className='form-input textarea' rows={4} maxLength={1000} showCount={false} />
                                </Form.Item>
                                <div className="attached-file-wrapper">
                                    <div className="attached-file-left">
                                        <label htmlFor="upload_file">
                                            <div className="upload-button">
                                                <Button className="attach-file"><UploadOutlined />Attach Files</Button>
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
                            </div>
                        )}

                        {2 <= step && (
                            <div className="step-item">
                                <div className="title">What skills are required?</div>
                                <div className="description">
                                    Enter up to 5 skills that best describe your project. Freelancers will use these skills to find projects they are most interested and experienced in.
                                </div>
                                <Form.Item rules={validateSchema.username}>
                                    <AutoComplete
                                        options={listSkills}
                                        onSelect={onSelect}
                                        onSearch={(text) => handleSearch(text)}
                                        placeholder="input here"
                                        className="form-select frame-search-auto-complete"
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
                                        {projectTypes.map((proj, idProj) => {
                                            return (
                                                <Col xl={12} md={12} xs={24} className="selection-item-wrapper" onClick={() => handleSelectProjectType(proj)}>
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
                                            <Form.Item className="custom-form-item" rules={validateSchema.username}>
                                                <Select
                                                    className="form-select multiple textarea"
                                                    allowClear
                                                    virtual={false}
                                                    placeholder={'Select your country'}
                                                    showSearch
                                                    value={currencySelected}
                                                >
                                                    {listCurrency.map((cur: any, index) => {
                                                        return (
                                                            <Select.Option key={index} value={cur}>{cur}</Select.Option>
                                                        )
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xl={16} md={16} xs={24}>
                                            <Form.Item className="custom-form-item" rules={validateSchema.username}>
                                                <Select
                                                    className="form-select multiple textarea"
                                                    allowClear
                                                    virtual={false}
                                                    placeholder={'Select your country'}
                                                    showSearch
                                                    labelInValue
                                                    value={budgetSelected}
                                                    onSelect={(event:any) => {
                                                        // debugger
                                                        setBudgetSelected(event.value.value)
                                                    }}
                                                >
                                                    {budgetOption.map((budget: any, index) => {
                                                        return (
                                                            <Select.Option key={index} value={budget}>{`${budget.name + ("$" + budget.bid_from + "-" + budget.bid_to + currencySelected)}`}</Select.Option>
                                                            // <Select.Option key={index} value={budget.value}>{budget.label}</Select.Option>
                                                        )
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        )}
                    </Form>
                    <div className={`post-main-content-button ${(step === 3 || step === 4) && 'none'}`}>
                        <Button form="post_project" key="submit" htmlType="submit">Next</Button>
                        <span className="enter">Press ENTER</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
