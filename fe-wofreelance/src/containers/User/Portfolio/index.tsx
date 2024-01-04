/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Col, Row, Form, Input, Radio, Tag } from 'antd';
import {
    CheckOutlined, PlusOutlined
} from '@ant-design/icons'

import { PortfolioInterface, ResponseFormatItem, SkillsetInterface, UserInterface } from 'interface';

import { RootState } from 'reducers/rootReducer';
import { AppActions } from 'reducers/listReducer/appReducer';

import { openError, openSuccess } from 'components/Notifications';

import { renderFileType } from 'utils/helper';

import { validImg } from '../../../constants';
import './style.scss'
import { UserActions } from 'reducers/listReducer/userReducer';

const ModalConfirm = React.lazy(() => import('components/ModalConfirm'));

interface recordSelectedInterface {
    skills: Array<SkillsetInterface>,
    files: any,
    portfolio: number | null
}

const Portfolio = () => {

    const [form] = Form.useForm()
    const { TextArea } = Input;
    const [modifyPortfolio, setModifyPortfolio] = useState('')
    const [formValues, setformValues] = useState<PortfolioInterface | { id?: number }>({})
    const [contentTypeSelected, setContentTypeSelected] = useState('image')
    const [recordSelected, setrecordSelected] = useState<recordSelectedInterface>({
        skills: [],
        files: [],
        portfolio: null
    })
    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false)

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
            setformValues({})
        } else {
            if (modifyPortfolio === 'edit') {
                //goi api get portfolio item
            } else {
                setrecordSelected({
                    files: [],
                    skills: [],
                    portfolio: null
                })
                setformValues({})
            }
        }
        setContentTypeSelected('image')
    }, [modifyPortfolio])

    useEffect(() => {
        form.resetFields()
    }, [formValues])

    const user_skills: Array<SkillsetInterface> = useSelector((state: RootState) => state.category.user_skills)
    const user_info: UserInterface = useSelector((state: RootState) => state.user.user_info)

    const uploadFiles = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(AppActions.uploadFiles({ param, resolve, reject }));
        });
    };

    const deletePortfolio = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.deletePortfolio({ param, resolve, reject }));
        });
    };

    const createPortfolio = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.createPortfolio({ param, resolve, reject }));
        });
    };

    const updatePortfolio = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.updatePortfolio({ param, resolve, reject }));
        });
    };

    const handleAddPortfolio = () => {
        setModifyPortfolio('add')
    }

    const handleCancel = () => {
        setModifyPortfolio('')
    }

    const onSubmitForm = (values: any) => {
        const payload = {
            ...values, portfolio_type: contentTypeSelected, files: recordSelected?.files, list_skills: recordSelected?.skills?.length > 0 ? recordSelected?.skills?.map((skill) => {
                return skill.id
            }) : []
        }
        dispatch(AppActions.openLoading(true))
        if (modifyPortfolio === 'add') {
            createPortfolio(payload).then(res => {
                setrecordSelected({
                    files: [],
                    skills: [],
                    portfolio: null
                })
                // openSuccess({ notiMess: res.message })
                setModifyPortfolio('')
                setformValues({})
            })
        } else {
            updatePortfolio({ ...payload, id: formValues.id }).then((res) => {
                setrecordSelected({
                    files: [],
                    skills: [],
                    portfolio: null
                })
                openSuccess({ notiMess: res.message })
                setModifyPortfolio('')
                setformValues({})
            })
        }


    }

    const onSubmitFile = async (e: any) => {
        const formData = new FormData()
        let file = e.target.files[0]
        if (recordSelected?.files.length === 3) {
            openError({ notiMess: "You are allowed to upload maximum three files at one Portfolio" })
        } else {
            const listFiles = [...recordSelected?.files]
            let recordSelectedClone = { ...recordSelected }
            formData.append("content_type", contentTypeSelected)
            formData.append("service_type", 'portfolios')
            formData.append("portfolios", file)
            uploadFiles(formData).then((res) => {
                listFiles.push(res.url![0])
                recordSelectedClone['files'] = listFiles
                setrecordSelected(recordSelectedClone)
            }).catch((err) => {
                openError(err.response.data.message)
            })
        }
    }

    const handleChangeContentType = (e: any) => {
        setContentTypeSelected(e.target.value)
        const recordSelectedClone = { ...recordSelected, files: [] }
        setrecordSelected(recordSelectedClone)
    }

    const handleSearchSkill = () => { }

    const handleSelectSkillset = (skill: SkillsetInterface) => {
        let skills = [...recordSelected?.skills]
        const skillIndex = skills.findIndex((a) => a.id === skill.id)
        let recordSelectedClone = { ...recordSelected }
        if (skillIndex === -1) {
            skills.push(skill)
            recordSelectedClone['skills'] = skills
        } else {
            skills = skills.filter((a) => a.id !== skill.id)
            recordSelectedClone['skills'] = skills
        }
        setrecordSelected(recordSelectedClone)
    }

    const handleCloseTag = (skill: SkillsetInterface) => {
        let recordSelectedClone = { ...recordSelected }
        const skillsFilter = recordSelected?.skills?.filter((a) => a.id !== skill.id)
        recordSelectedClone['skills'] = skillsFilter
        setrecordSelected(recordSelectedClone)
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
        let recordSelectedClone = { ...recordSelected }
        const listFiles = recordSelected?.files.filter((a: any) => JSON.stringify(file) !== JSON.stringify(a))
        recordSelectedClone['files'] = listFiles
        setrecordSelected(recordSelectedClone)
    }

    const handleEditPortfolio = (port: PortfolioInterface) => {
        let recordSelectedClone = { ...recordSelected }
        const portfolioItem: any = user_info?.portfolios!.length > 0 && user_info?.portfolios!.find((portf: PortfolioInterface) => portf.id === port.id)
        setformValues(portfolioItem)
        let listFileSelected = []
        if (portfolioItem.file !== '' || portfolioItem.file !== null) {
            listFileSelected = portfolioItem?.file?.split(',') ?? []
        }
        recordSelectedClone['skills'] = portfolioItem.skills
        recordSelectedClone['files'] = listFileSelected
        recordSelectedClone['portfolio'] = portfolioItem?.id
        setrecordSelected(recordSelectedClone)
        setModifyPortfolio('edit')
        setContentTypeSelected(port.portfolio_type)
    }

    const handleDeletePortfolio = (port: PortfolioInterface) => {
        const recordSelectedClone = {...recordSelected}
        recordSelectedClone['portfolio'] = port.id
        setrecordSelected(recordSelectedClone)
        setIsOpenModalConfirm(true)
    }

    const onConfirm = () => {
        deletePortfolio({ id: recordSelected?.portfolio }).then((res) => {
            setIsOpenModalConfirm(false)
            openSuccess({ notiMess: res.message })
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
                {modifyPortfolio === '' ? (
                    <div className="portfolio-showing">
                        <div className="portfolio-item">
                            <div className="portfolio-header">
                                <div className="button-add">+ Add Portfolio Item</div>
                                <div className="button-goback" onClick={handleBackToProfile}>Go back to Profile page</div>
                            </div>
                            <div className="portfolio-content">
                                <div className="list-portfolio">
                                    <Row>
                                        {user_info?.portfolios!?.length > 0 && user_info?.portfolios?.map((port: PortfolioInterface, idx: number) => {
                                            const fileEndpoint: any = port.file !== '' ? port.file?.split(',')[0].split('.').at(-1) : null
                                            const checkImg = fileEndpoint !== null ? validImg.includes(fileEndpoint) : false
                                            const file = port.file?.split(',')[0]
                                            return (
                                                <Col span={6} key={idx}>
                                                    <div className="portfolio-item">
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
                                            <div className="portfolio-item add-new-portfolio" onClick={() => handleAddPortfolio()}>
                                                <span>+ Add Portfolio Item</span>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="portfolio-modify">
                        <div className="portfolio-modify-header">
                            <span className="title">{modifyPortfolio === 'edit' ? 'Update Portfolio' : 'Create Portfolio'}</span>
                            <div className="portfolio-added">
                                <span>Added</span>
                                <span>{user_info?.portfolios!.length}</span>
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
                                    <Input placeholder='Title' className='form-input' showCount maxLength={60} />
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
                                {(contentTypeSelected === 'article' || contentTypeSelected === 'code') &&
                                    <Form.Item rules={validateSchema.summary} name="summary" label={<div className="title-summary"><span>{contentTypeSelected === 'article' ? 'Text Preview' : 'Code Sample'}</span></div>} className="custom-form-item">
                                        <TextArea
                                            className="form-input text-area"
                                            autoSize={{ minRows: 3, maxRows: 10 }}
                                            maxLength={1000}
                                            name="description"
                                            placeholder={contentTypeSelected === 'article' ? 'Text Preview' : 'Code Sample'}
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
                                        {recordSelected?.files.length > 0 && recordSelected?.files.map((file: any, index: number) => {
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
                                                    {user_skills && user_skills.length > 0 && user_skills?.map((skill: SkillsetInterface, index: number) => {
                                                        return (
                                                            <div className="skill-item-container" onClick={() => handleSelectSkillset(skill)} key={index}>
                                                                <div className="skill-item" key={index}>{skill.name}</div>
                                                                {recordSelected?.skills.findIndex(a => a.id === skill.id) !== -1 ? <CheckOutlined /> : <PlusOutlined />}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </Card>
                                        </div>
                                        <div className="portfolio-skills-selected">
                                            <div className="title">Selected skills <span className="extra">(Skills left: <span className="quantity">{recordSelected?.skills.length}</span>)</span></div>
                                            <div className="skill-selected">
                                                {recordSelected?.skills.length > 0 && recordSelected?.skills.map((skill: SkillsetInterface) => {
                                                    return (
                                                        <Tag color="success" key={skill.id} className="skill-selected-item" closable onClose={() => handleCloseTag(skill)}>{skill.name}</Tag>
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
                )}
                {/* {renderPortfolio()} */}
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