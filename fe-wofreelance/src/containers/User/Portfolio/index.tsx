import React, { useEffect, useState } from 'react'
import './style.scss'
import { useDispatch, useSelector } from 'react-redux';
import { ExperiencesInterface, ResponseFormatItem, SkillsetInterface, UserInterface } from '../../../interface';
import { UserActions } from '../../../reducers/listReducer/userReducer';
import { RootState } from '../../../reducers/rootReducer';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LayoutBottomProfile from '../../../components/LayoutBottom/LayoutBottomProfile';
import { Button, Card, Col, Rate, Row, Form, Input, DatePicker, Checkbox, Popover, Radio, Tag, Tooltip, Spin } from 'antd';
import {
    CheckOutlined, PlusOutlined, LoadingOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom';
import { delete_icon } from '../../../assets';
import dayjs from 'dayjs';

import { ModalConfirm } from '../../../components/ModalConfirm';
import { AppActions } from '../../../reducers/listReducer/appReducer';
import { ExperienceActions } from '../../../reducers/listReducer/experienceReducer';
import { CategoryActions } from '../../../reducers/listReducer/categoryReducer';
import { openWarning } from '../../../components/Notifications';
import { getBase64, renderFileType } from '../../../utils/helper';

interface componentInterface {
    modify: boolean
}

const Portfolio = () => {
    const [form] = Form.useForm()
    const { TextArea } = Input;
    const [modifyPortfolio, setModifyPortfolio] = useState('')
    const [formValues, setformValues] = useState({})
    const [contentTypeSelected, setContentTypeSelected] = useState('image')
    const [skillsSelected, setSkillsSelected] = useState<Array<SkillsetInterface>>([])
    const [listFilesSelected, setListFilesSelected] = useState<any>([])

    const dispatch = useDispatch()

    const { id } = useParams()

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

    useEffect(() => {
        form.resetFields()
    }, [formValues])

    const experiences: Array<ExperiencesInterface> = useSelector((state: RootState) => state.experience.experiences)
    const user: UserInterface = useSelector((state: RootState) => state.user.user)
    const user_info: UserInterface = useSelector((state: RootState) => state.user.user_info)
    const user_skills: Array<SkillsetInterface> = useSelector((state: RootState) => state.category.user_skills)


    const getAllSkillsetForUser = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(CategoryActions.getAllSkillsetForUser({ param, resolve, reject }));
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

    const handleAddPortfolio = () => {
        setModifyPortfolio('add')
    }


    const handleCancel = () => { }

    const onSubmitForm = (values: any) => {
        const formData = new FormData()
        Object.keys(values).map((key) => {
            formData.append(key, values[key])
        })
        if (listFilesSelected.length > 0) {
            listFilesSelected.forEach((element:any) => {
                formData.append('portfolios', element)
            });
        }
        if (skillsSelected.length > 0) {
            skillsSelected.forEach((skill:any) => {
                formData.append('skillset_id', skill.id)
            });
        }
        if(modifyPortfolio === 'add'){
            //handle add => goi api
        } else {
            //handle edit, truyen them id => goi api
        }
        
        
    }

    const onSubmitFile = async (e: any) => {
        let file = e.target.files[0]
        const fileType = (file.type).split('/')[1]
        const fileSize = (file.size) / 1048576
        const listFiles = [...listFilesSelected]
        if (contentTypeSelected === 'image') {
            if (fileType === 'jpeg' || fileType === 'png' || fileType === 'gif') {
                if (fileSize > 10) {
                    openWarning('Your file is too large')
                } else {
                    const base64Ing: any = await getBase64(file)
                    listFiles.push(Object.assign({ file }, { content_type: contentTypeSelected, preview: base64Ing }))
                    setListFilesSelected(listFiles)
                }
            } else {
                openWarning("This format is not allowed")
            }
        } else if (contentTypeSelected === "article" || contentTypeSelected === "others" || contentTypeSelected === "code") {
            if (fileSize > 20) {
                openWarning('Your file is too large')
            } else {
                const base64Ing: any = await getBase64(file)
                listFiles.push(Object.assign({ file }, { content_type: contentTypeSelected, preview: (fileType === 'jpeg' || fileType === 'png' || fileType === 'gif') ? base64Ing : null }))
                setListFilesSelected(listFiles)
            }
        } else if (contentTypeSelected === "video") {
            if (fileType === 'mp4' || fileType === 'flv' || fileType === 'avi' || fileType === 'mov') {
                if (fileSize > 50) {
                    openWarning('Your file is too large')
                } else {
                    listFiles.push(Object.assign({ file }, { content_type: contentTypeSelected, preview: null }))
                    setListFilesSelected(listFiles)
                }
            } else {
                openWarning("This format is not allowed")
            }
        } else if (contentTypeSelected === "audio") {
            if (fileType === 'mp3') {
                if (fileSize > 20) {
                    openWarning('Your file is too large')
                } else {
                    listFiles.push(Object.assign({ file }, { content_type: contentTypeSelected, preview: null }))
                    setListFilesSelected(listFiles)
                }
            } else {
                openWarning("This format is not allowed")
            }
        } else {
            openWarning('This format is not allowed')
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

    return (
        <div className="portfolio-wrapper">
            <div className="portfolio-container">
                {modifyPortfolio === '' ? <div className="portfolio-showing">
                    <div className="portfolio-header">
                        <div className="button-add">+ Add Portfolio Item</div>
                        <div className="button-goback">Go back to Profile page</div>
                    </div>
                    <div className="portfolio-content">
                        <div className="list-portfolio">
                            <div className="portfolio-item add-new-portfolio" onClick={handleAddPortfolio}>
                                <span>+ Add Portfolio Item</span>
                            </div>
                        </div>
                    </div>
                </div> :
                    <div className="portfolio-modify">
                        <div className="portfolio-modify-header">
                            <span className="title">Portfolio Item Upload</span>
                            <div className="portfolio-added">
                                <span>Added</span>
                                <span>3</span>
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
                                // validateMessages={validateMessages}
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
                                <Form.Item name="title" label="Title" className="custom-form-item">
                                    <Input placeholder='password' className='form-input' showCount maxLength={60} />
                                </Form.Item>
                                <Form.Item name="description" label="Description" className="custom-form-item">
                                    <TextArea
                                        className="form-input text-area"
                                        autoSize={{ minRows: 3, maxRows: 10 }}
                                        maxLength={1000}
                                        name="description"
                                        placeholder="Description"
                                        showCount
                                    />
                                </Form.Item>
                                {(contentTypeSelected === 'article' || contentTypeSelected === 'code') && <Form.Item name="summary" label={<div className="title-summary"><span>{contentTypeSelected === 'article' ? 'Text Preview' : 'Code Sample'}</span><span className="tooltip"><Tooltip placement='right' title={`Demonstrate your writing ${contentTypeSelected === 'code' ? 'coding skill' : 'skill'} by including a short passage from your article, such as the introduction.`}>?</Tooltip></span></div>} className="custom-form-item">
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
                                            return (
                                                <div className="file-item" key={index} onClick={() => handleRemoveFile(file)}>
                                                    <img src={contentTypeSelected === 'image' || file.preview !== null ? file.preview : renderFileType(contentTypeSelected)} />
                                                    <span className="title">{file.name}</span>
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
        </div>
    )
}

export default Portfolio