import { Button, Card, Col, Input, Progress, Row, Tag } from 'antd'
import { freelancer_logo, facebook_icon_white } from '../../../assets'
import './style.scss'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAppDispatch, useAppSelector } from '../../../reducers/hook'
import { CategoryActions } from '../../../reducers/categoryReducer'
import { RightOutlined, PlusOutlined, CheckOutlined } from '@ant-design/icons'
import { SkillselectedComponentInterface, ResponseFormatList, CategoryInterface, SkillsetInterface } from '../../../interface'
import { useDebounce } from '../../../utils/useDebounce'

const SkillSelected = ({setPercent, skillsetSelected, setSkillsetSelected}: SkillselectedComponentInterface) => {
    const dispatch = useAppDispatch()

    const [categorySelected, setCategorySelected] = useState<CategoryInterface>({})
    const [listCategoy, setListCategoy] = useState<Array<CategoryInterface>>([])
    const [listSkills, setListSkills] = useState<Array<SkillsetInterface>>([])

    const [matchJobs, setMatchJobs] = useState<number>(0)
    const [valueSearch, setValueSearch] = useState<string>('')
    const debouncedText = useDebounce(valueSearch, 500);

    const getAllSkillsetForNewFreelance = (param: any): Promise<ResponseFormatList> => {
        return new Promise((resolve, reject) => {
            dispatch(CategoryActions.getAllSkillsetForNewFreelance({ param, resolve, reject }));
        });
    };

    useEffect(() => {
        if (debouncedText === '') {
            setPercent(20)
            getAllSkillsetForNewFreelance({}).then((res) => {
                if (res.data) {
                    setListCategoy(res?.data)
                    if (categorySelected) {
                        const skills: any = categorySelected?.list_skills?.sort((a: SkillsetInterface, b: SkillsetInterface) => {
                            return b.job_matching_count! - a.job_matching_count!
                        })
                        setListSkills(skills)
                    }
                }
            })
        }
    }, [debouncedText])

    useEffect(() => {
        if (debouncedText !== '') {
            getAllSkillsetForNewFreelance({ skill: debouncedText }).then((res) => {
                if (res.data) {
                    let skills: SkillsetInterface[] = []
                    res.data?.map((cate) => {
                        cate.list_skills?.map((skill: SkillsetInterface) => {
                            skills.push(skill)
                        })
                    })
                    setListSkills(skills)
                }
            })
        }
    }, [debouncedText])

    const handleSelectCategory = (cate: any) => {
        setCategorySelected(cate)
        const skills = cate.list_skills.sort((a: SkillsetInterface, b: SkillsetInterface) => {
            return b.job_matching_count! - a.job_matching_count!
        })
        setListSkills(skills)
    }

    const handleSelectSkillset = (skill: SkillsetInterface) => {
        if (skillsetSelected.length < 20 && skillsetSelected.findIndex((x) => x.id === skill.id) === -1) {
            const skills: SkillsetInterface[] = [...skillsetSelected, skill]
            const sum: number = skills.reduce((accumulator, currentValue: SkillsetInterface) => {
                return accumulator + currentValue.job_matching_count!
            }, 0)
            setMatchJobs(sum)
            setSkillsetSelected(skills)
        }

    }

    const handleClose = (skill: SkillsetInterface) => {
        const skills = [...skillsetSelected]
        const skillsFilter = skills.filter(x => x.id !== skill.id)
        setSkillsetSelected(skillsFilter)
    }

    const handleSearchSkills = (event: any) => {
        setValueSearch(event.target.value)
    }

    return (
        <div className="new-freelancer-content">
            <div className="new-freelancer-content-header">
                <div className="title">Tell us your top skills</div>
                <div className="description">This helps us recommend jobs for you.</div>
                <Input placeholder='Search a skill' className="form-input" onChange={handleSearchSkills} />
            </div>
            <div className="content-divider">OR</div>
            <div className="new-freelancer-main-content">
                <Row>
                    <Col md={8} sm={24} xs={24} className="category-selection">
                        <Card title="Select a category">
                            {listCategoy?.map((cate: any, index: number) => {
                                return (
                                    <div key={index} className="category-item" onClick={() => handleSelectCategory(cate)}>
                                        <span className="title">{cate.name}</span>
                                        <RightOutlined />
                                    </div>
                                )
                            })}
                        </Card>
                    </Col>
                    <Col md={8} sm={12} xs={24} className="category-selection">
                        <Card title={debouncedText !== '' ? `Search results for "${debouncedText}"` : categorySelected.name ? categorySelected.name : 'No category selected'} className={`${listSkills?.length === 0 && 'empty-list'}`}>
                            {listSkills?.length > 0 ? listSkills?.map((skill: any, index: number) => {
                                return (
                                    <div key={index} className="category-item" onClick={() => handleSelectSkillset(skill)}>
                                        <span className="title">{skill.name} {`(${skill.job_matching_count} jobs)`}</span>
                                        {skillsetSelected.findIndex(x => x.id === skill.id) === -1 ? <PlusOutlined /> : <CheckOutlined className="check-icon" />}
                                    </div>
                                )
                            })
                                : <span className="empty-list">Select a category to start adding skills to your profile.</span>}
                        </Card>
                    </Col>
                    <Col md={8} sm={24} xs={24} className="skills-selected-result">
                        <div className="skills-selected-header">
                            {skillsetSelected.length} out of 20 skills selected
                        </div>
                        <div className="skill-selected-body">
                            <div className="lists-job-matching-quantity">{matchJobs} jobs matching your skills</div>
                            <div className="list-job-matching">
                                {skillsetSelected?.map((skill: SkillsetInterface, index) => {
                                    return (
                                        <Tag
                                            key={index}
                                            closable
                                            onClose={(e) => {
                                                e.preventDefault();
                                                handleClose(skill);
                                            }}
                                        >
                                            {skill.name}
                                        </Tag>
                                    )
                                })}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default SkillSelected
