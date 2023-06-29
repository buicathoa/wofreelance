/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Row, Form, Input, Radio, Tag, Tooltip } from 'antd';
import {
    CheckOutlined, PlusOutlined
} from '@ant-design/icons'

import { PortfolioInterface, ResponseFormatItem, SkillsetInterface, UserInterface } from '../../../interface';

import { RootState } from '../../../reducers/rootReducer';
import { AppActions } from '../../../reducers/listReducer/appReducer';

import { ModalConfirm } from '../../../components/ModalConfirm';
import { openError, openSuccess } from '../../../components/Notifications';
import { renderFileType } from '../../../utils/helper';
import { validImg } from '../../../constants';

import './style.scss'
import { PortfolioActions } from '../../../reducers/listReducer/portfolioReducer';

const Portfolio = () => {

    const [form] = Form.useForm()
    const { TextArea } = Input;
    const navigate = useNavigate()
    const [modifyPortfolio, setModifyPortfolio] = useState('')
    const [formValues, setformValues] = useState<PortfolioInterface | { id?: number }>({})
    const [contentTypeSelected, setContentTypeSelected] = useState('image')
    const [skillsSelected, setSkillsSelected] = useState<Array<SkillsetInterface>>([])
    const [listFilesSelected, setListFilesSelected] = useState<any>([])
    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false)
    const [recordSelectedId, setrecordSelectedId] = useState<number>()

    const dispatch = useDispatch()


    const validateMessages = {
        required: 'This field is required'
    }

    const validateSchema = {
        title: [
            {
                required: true
            }
        ],
        description: [
            {
                required: true
            }
        ],
        summary: [
            {
                required: true
            }
        ],
    }

    useEffect(() => {
        if (modifyPortfolio === '') {
            getPortfolios({})
        } else {
            if (modifyPortfolio === 'edit') {
                //goi api get portfolio item
            } else {
                setListFilesSelected([])
                setformValues({})
                setSkillsSelected([])
            }
        }
    }, [modifyPortfolio])

    useEffect(() => {
        form.resetFields()
    }, [formValues])

    const portfolios: Array<PortfolioInterface> = useSelector((state: RootState) => state.portfolio.portfolios)
    const user_skills: Array<SkillsetInterface> = useSelector((state: RootState) => state.category.user_skills)
    const user: UserInterface = useSelector((state: RootState) => state.user.user)

    const uploadFiles = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(AppActions.uploadFiles({ param, resolve, reject }));
        });
    };

    const deletePortfolio = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(PortfolioActions.deletePortfolio({ param, resolve, reject }));
        });
    };

    const getPortfolios = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(PortfolioActions.getPortfolios({ param, resolve, reject }));
        });
    };

    const createPortfolio = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(PortfolioActions.createPortfolio({ param, resolve, reject }));
        });
    };

    const updatePortfolio = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(PortfolioActions.updatePortfolio({ param, resolve, reject }));
        });
    };

    const handleAddPortfolio = () => {
        setModifyPortfolio('add')
    }

    console.log('haha', listFilesSelected)


    const handleCancel = () => {
        setModifyPortfolio('')
        getPortfolios({})
    }

    const onSubmitForm = (values: any) => {
        const payload = {
            ...values, portfolio_type: contentTypeSelected, files: listFilesSelected, list_skills: skillsSelected.length > 0 ? skillsSelected.map((skill) => {
                return skill.id
            }) : []
        }
        dispatch(AppActions.openLoading(true))
        if (modifyPortfolio === 'add') {
            createPortfolio(payload).then(res => {
                openSuccess(res.message)
                openSuccess('Create Port')
                setModifyPortfolio('')
                getPortfolios({})
                setformValues({})
            })
        } else {
            updatePortfolio({ ...payload, id: formValues.id }).then((res) => {
                openSuccess(res.message)
                setModifyPortfolio('')
                getPortfolios({})
                setformValues({})
            })
        }


    }

    const onSubmitFile = async (e: any) => {
        const formData = new FormData()
        let file = e.target.files[0]
        // debugger
        if (listFilesSelected.length === 3) {
            openError("You are allowed to upload maximum three files at one Portfolio")
        } else {
            const listFiles = [...listFilesSelected]
            formData.append("content_type", contentTypeSelected)
            formData.append("service_type", 'portfolios')
            formData.append("portfolios", file)
            uploadFiles(formData).then((res) => {
                listFiles.push(res.url![0])
                setListFilesSelected(listFiles)
            }).catch((err) => {
                openError(err.response.data.message)
            })
        }
    }

    const handleChangeContentType = (e: any) => {
        setContentTypeSelected(e.target.value)
        setListFilesSelected([])
    }

    const handleSearchSkill = () => { }

    const handleSelectSkillset = (skill: SkillsetInterface) => {
        const skills = [...skillsSelected]
        const skillIndex = skills.findIndex((a) => a.id === skill.id)
        if (skillIndex === -1) {
            skills.push(skill)
            setSkillsSelected(skills)
        } else {
            const list_skills = skills.filter((a) => a.id !== skill.id)
            setSkillsSelected(list_skills)
        }
    }

    const handleCloseTag = (skill: SkillsetInterface) => {
        const skillsFilter = skillsSelected.filter((a) => a.id !== skill.id)
        setSkillsSelected(skillsFilter)
    }

    const renderContentFile = () => {
        switch (contentTypeSelected) {
            case 'image':
                return `(Allowed formats: JPG, PNG, GIF. Maximum file size: 10MB)`
            case "article":
            case "others":
            case 'code':
                return `(Maximum file size: 20MB)`

            case 'video':
                return `(Allowed formats FLV, AVI, MP4, MOV. Maximum file size: 50MB.)`
            case 'audio':
                return `(Allowed formats MP3. Maximum file size: 20MB)`

        }
    }

    const handleRemoveFile = (file: any) => {
        const listFiles = listFilesSelected.filter((a: any) => JSON.stringify(file) !== JSON.stringify(a))
        setListFilesSelected(listFiles)
    }

    const handleEditPortfolio = (port: PortfolioInterface) => {
        const portfolioItem: any = portfolios.length > 0 && portfolios.find((portf) => portf.id === port.id)
        setformValues(portfolioItem)
        let listFileSelected = []
        if (portfolioItem.file !== '' || portfolioItem.file !== null) {
            listFileSelected = portfolioItem.file.split(',')
        }
        setSkillsSelected(portfolioItem.skills)
        setListFilesSelected(listFileSelected)
        setModifyPortfolio('edit')
        setContentTypeSelected(port.portfolio_type)
    }

    const handleDeletePortfolio = (port: PortfolioInterface) => {
        setrecordSelectedId(port.id)
        setIsOpenModalConfirm(true)
    }

    const onConfirm = () => {
        deletePortfolio({ id: recordSelectedId }).then((res) => {
            setIsOpenModalConfirm(false)
            getPortfolios({})
            openSuccess(res.message)
        })
    }

    const handleBackToProfile = () => {
        const url = new URL(window.location.href);
        url.search = '';
        window.location.href = url.toString();
    }

    return (
        <div className="portfolio-wrapper">
            <div className="portfolio-container">
                {modifyPortfolio === '' ? <div className="portfolio-showing">
                    <div className="portfolio-item">
                        <div className="portfolio-header">
                            <div className="button-add">+ Add Portfolio Item</div>
                            <div className="button-goback" onClick={handleBackToProfile}>Go back to Profile page</div>
                        </div>
                        <div className="portfolio-content">
                            <div className="list-portfolio">
                                <Row>
                                    {portfolios.length > 0 && portfolios.map((port, idx) => {
                                        const fileEndpoint: any = port.file !== '' ? port.file?.split(',')[0].split('.').at(-1) : null
                                        const checkImg = fileEndpoint !== null ? validImg.includes(fileEndpoint) : false
                                        const file = port.file?.split(',')[0]
                                        return (
                                            <Col span={6}>
                                                <div className="portfolio-item" key={idx}>
                                                    <div className="portfolio-item-header">
                                                        <img src={checkImg ? file : renderFileType(port.portfolio_type)} />
                                                    </div>
                                                    <div className="portfolio-item-title">
                                                        <span>{port.title}</span>
                                                    </div>
                                                    <div className="portfolio-overlay">
                                                        <div className="overlay-title">{port.title}</div>
                                                        <div className="overlay-description">{port.description}</div>
                                                    </div>
                                                </div>
                                                <div className="portfolio-modify">
                                                    <span onClick={() => handleEditPortfolio(port)}>Edit |</span>
                                                    <span onClick={() => handleDeletePortfolio(port)}> Delete</span>
                                                </div>
                                            </Col>
                                        )
                                    })}
                                    <Col span={6}>
                                        <div className="portfolio-item add-new-portfolio" onClick={handleAddPortfolio}>
                                            <span>+ Add Portfolio Item</span>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </div> :
                    <div className="portfolio-modify">
                        <div className="portfolio-modify-header">
                            <span className="title">{modifyPortfolio === 'edit' ? 'Update Portfolio' : 'Create Portfolio'}</span>
                            <div className="portfolio-added">
                                <span>Added</span>
                                <span>{portfolios.length}</span>
                            </div>
                        </div>
                        <div className="portfolio-modify-form">
                            <div className="portfolio-modify-form-title">
                                Add a Portfolio Item
                            </div>
                            <Form
                                id="portfolio_modify_form"
                                form={form}
                                layout="vertical"
                                name="portfolio_modify_form"
                                onFinish={onSubmitForm}
                                initialValues={formValues}
                                scrollToFirstError
                                validateMessages={validateMessages}
                                requiredMark={false}
                            >
                                <Radio.Group
                                    onChange={(e) => handleChangeContentType(e)}
                                    className="custom-radio-group-btn"
                                    value={contentTypeSelected}
                                >
                                    <div className="wrap">
                                        <Radio checked className="custom-radio" value={'image'}>
                                            Image
                                        </Radio>
                                    </div>
                                    <div className="wrap">
                                        <Radio className="custom-radio" value={'article'}>
                                            Article
                                        </Radio>
                                    </div>
                                    <div className="wrap">
                                        <Radio className="custom-radio" value={'code'}>
                                            Code
                                        </Radio>
                                    </div>
                                    <div className="wrap">
                                        <Radio className="custom-radio" value={'video'}>
                                            Video
                                        </Radio>
                                    </div>
                                    <div className="wrap">
                                        <Radio className="custom-radio" value={'audio'}>
                                            Audio
                                        </Radio>
                                    </div>
                                    <div className="wrap">
                                        <Radio className="custom-radio" value={'others'}>
                                            Others
                                        </Radio>
                                    </div>
                                </Radio.Group>
                                <Form.Item name="title" label="Title" className="custom-form-item" rules={validateSchema.title}>
                                    <Input placeholder='password' className='form-input' showCount maxLength={60} />
                                </Form.Item>
                                <Form.Item name="description" label="Description" className="custom-form-item" rules={validateSchema.description}>
                                    <TextArea
                                        className="form-input text-area"
                                        autoSize={{ minRows: 3, maxRows: 10 }}
                                        maxLength={1000}
                                        name="description"
                                        placeholder="Description"
                                        showCount
                                    />
                                </Form.Item>
                                {(contentTypeSelected === 'article' || contentTypeSelected === 'code') && <Form.Item rules={validateSchema.summary} name="summary" label={<div className="title-summary"><span>{contentTypeSelected === 'article' ? 'Text Preview' : 'Code Sample'}</span><span className="tooltip"><Tooltip placement='right' title={`Demonstrate your writing ${contentTypeSelected === 'code' ? 'coding skill' : 'skill'} by including a short passage from your article, such as the introduction.`}>?</Tooltip></span></div>} className="custom-form-item">
                                    <TextArea
                                        className="form-input text-area"
                                        autoSize={{ minRows: 3, maxRows: 10 }}
                                        maxLength={1000}
                                        name="description"
                                        placeholder="Description"
                                        showCount
                                    />
                                </Form.Item>}
                                <div className="upload-file">
                                    <div className="title">Upload file <span>{renderContentFile()}</span></div>
                                    <label htmlFor="upload_file">
                                        <div className="attached-file">
                                            + Upload
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
                                    <div className="files-selected">
                                        {listFilesSelected && listFilesSelected.length > 0 && listFilesSelected.map((file: any, index: number) => {
                                            const isImg = validImg.includes(file.split('.').at(-1))
                                            return (
                                                <div className="file-item" key={index} onClick={() => handleRemoveFile(file)}>
                                                    <img src={isImg ? file : renderFileType(contentTypeSelected)} />
                                                    <span className="title">{file.split('/').at(-1)}</span>
                                                    <span className="delete">x</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="portfolio-skills">
                                    <div className="title">Skills <span>(Search or select from the list)</span></div>
                                    <div className="portfolio-skills-content">
                                        <div className="portfolio-skills-list">
                                            <Card
                                                size="small"
                                                title={
                                                    <Input className="skill-seach-input" placeholder='Search skill...' onChange={handleSearchSkill} />
                                                }
                                            >
                                                <div className="skills-list">
                                                    {user_skills && user_skills.length > 0 && user_skills.map((skill: SkillsetInterface, index: number) => {
                                                        return (
                                                            <div className="skill-item-container" onClick={() => handleSelectSkillset(skill)}>
                                                                <div className="skill-item" key={index}>{skill.name}</div>
                                                                {skillsSelected.findIndex(a => a.id === skill.id) !== -1 ? <CheckOutlined /> : <PlusOutlined />}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </Card>
                                        </div>
                                        <div className="portfolio-skills-selected">
                                            <div className="title">Selected skills <span className="extra">(Skills left: <span className="quantity">{skillsSelected.length}</span>)</span></div>
                                            <div className="skill-selected">
                                                {skillsSelected && skillsSelected.length > 0 && skillsSelected.map((skill: SkillsetInterface) => {
                                                    return (
                                                        <Tag color="#f50" key={skill.id} className="skill-selected-item" closable onClose={() => handleCloseTag(skill)}>{skill.name}</Tag>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                            <div className="portfolio-buttons">
                                <Button className="next" form="portfolio_modify_form" key="submit" htmlType="submit">Save</Button>
                                <Button onClick={handleCancel} className="back">Cancel</Button>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <ModalConfirm
                title={'Confirm'}
                visible={isOpenModalConfirm}
                setVisible={setIsOpenModalConfirm}
                onConfirm={onConfirm}
            />
        </div>
    )
}

export default Portfolio