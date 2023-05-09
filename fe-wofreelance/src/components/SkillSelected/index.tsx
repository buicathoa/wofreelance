import { Card, Col, Row, Tag } from 'antd'
import { RightOutlined, PlusOutlined, CheckOutlined } from '@ant-design/icons'

import React, { useState } from 'react'
import { useDebounce } from '../../utils/useDebounce'
import { CategoryInterface, SkillsetInterface } from '../../interface'

const SkillSelected = ( listCategoy : Array<CategoryInterface>) => {
    const [valueSearch, setValueSearch] = useState<string>('')
    const [skillsetSelected, setSkillsetSelected] = useState<Array<SkillsetInterface> | undefined>([])
    const [matchJobs, setMatchJobs] = useState<number>(0)
    const [categorySelected, setCategorySelected] = useState<CategoryInterface>({})
    const [listSkills, setListSkills] = useState<Array<SkillsetInterface>>([])

    const debouncedText = useDebounce(valueSearch, 500);

    const handleClose = (skill: SkillsetInterface) => {
        const skills = skillsetSelected ? [...skillsetSelected] : []
        const skillsFilter = skills.filter(x => x.id !== skill.id)
        setSkillsetSelected && setSkillsetSelected(skillsFilter)
    }

    const handleSelectCategory = (cate: any) => {
        setCategorySelected(cate)
        const skills = cate.list_skills.sort((a: SkillsetInterface, b: SkillsetInterface) => {
            return b.job_matching_count! - a.job_matching_count!
        })
        setListSkills(skills)
    }

    const handleSelectSkillset = (skill: SkillsetInterface) => {
        if (skillsetSelected && skillsetSelected.length < 20 && skillsetSelected.findIndex((x) => x.id === skill.id) === -1) {
            const skills: SkillsetInterface[] = [...skillsetSelected, skill]
            const sum: number = skills.reduce((accumulator, currentValue: SkillsetInterface) => {
                return accumulator + currentValue.job_matching_count!
            }, 0)
            setMatchJobs(sum)
            setSkillsetSelected && setSkillsetSelected(skills)
        }

    }

    return (
        <div className="new-freelancer-main-content">
            <Row>
                <Col md={9} sm={24} xs={24} className="category-selection">
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
                <Col md={9} sm={12} xs={24} className="category-selection">
                    <Card title={debouncedText !== '' ? `Search results for "${debouncedText}"` : categorySelected.name ? categorySelected.name : 'No category selected'} className={`${listSkills?.length === 0 && 'empty-list'}`}>
                        {listSkills?.length > 0 ? listSkills?.map((skill: any, index: number) => {
                            return (
                                <div key={index} className="category-item" onClick={() => handleSelectSkillset(skill)}>
                                    <span className="title">{skill.name} {`(${skill.job_matching_count} jobs)`}</span>
                                    {skillsetSelected && skillsetSelected.findIndex(x => x.id === skill.id) === -1 ? <PlusOutlined /> : <CheckOutlined className="check-icon" />}
                                </div>
                            )
                        })
                            : <span className="empty-list">Select a category to start adding skills to your profile.</span>}
                    </Card>
                </Col>
                <Col md={6} sm={24} xs={24} className="skills-selected-result">
                    <div className="skills-selected-header">
                        {skillsetSelected ? skillsetSelected.length : 0} out of 20 skills selected
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
    )
}

export default SkillSelected
