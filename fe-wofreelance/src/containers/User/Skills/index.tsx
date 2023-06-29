import { Modal } from 'antd'
import React, { useState, useEffect } from 'react'
import SkillSelection from '../../../components/SkillSelection'
import { CategoryInterface, ResponseFormatItem, ResponseFormatList, SkillComponentInterface, SkillsetInterface } from '../../../interface'
import { useDebounce } from '../../../utils/useDebounce'
import { useDispatch } from 'react-redux'
import { UserActions } from '../../../reducers/listReducer/userReducer'
import { CategoryActions } from '../../../reducers/listReducer/categoryReducer'

import './style.scss'
const Skills = ({isOpen, setIsOpen}: SkillComponentInterface) => {
    const dispatch = useDispatch()
    const [skillsetSelected, setSkillsetSelected] = useState<Array<SkillsetInterface> | undefined>([])
    const [categorySelected, setCategorySelected] = useState<CategoryInterface>({})
    const [listCategory, setListCategory] = useState<Array<CategoryInterface>>([])
    const [listSkills, setListSkills] = useState<Array<SkillsetInterface>>([])

    const [matchJobs, setMatchJobs] = useState<number>(0)
    const [valueSearch, setValueSearch] = useState<string>('')

    const debouncedText = useDebounce(valueSearch, 500);

    const getUserInfo = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.getUserInfo({ param, resolve, reject }));
        });
    };

    const getAllSkillsetForNewFreelance = (param: any): Promise<ResponseFormatList> => {
        return new Promise((resolve, reject) => {
            dispatch(CategoryActions.getAllSkillsetForNewFreelance({ param, resolve, reject }));
        });
    };

    const updateUser = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.updateUser({ param, resolve, reject }));
        });
    };

    const createDeleteSkillsetForUser = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(CategoryActions.createDeleteSkillsetForUser({ param, resolve, reject }));
        });
    };

    useEffect(() => {
        if(isOpen){
            getUserInfo({}).then(res => {
                if (res.data) {
                    setSkillsetSelected(res?.data?.list_skills)
                    const sum: any = res?.data?.list_skills?.reduce((accumulator:any, currentValue: SkillsetInterface) => {
                        return accumulator + currentValue.job_matching_count!
                    }, 0)
                    setMatchJobs(sum)
                    return
                }
            })
        }
    }, [isOpen])

    useEffect(() => {
        if (debouncedText === '') {
            getAllSkillsetForNewFreelance({}).then((res) => {
                if (res.data) {
                    setListCategory(res?.data)
                    if (categorySelected) {
                        const skills: any = categorySelected?.list_skills?.sort((a: SkillsetInterface, b: SkillsetInterface) => {
                            return b.job_matching_count! - a.job_matching_count!
                        })
                        setListSkills(skills)
                    }
                }
            })
        } else {
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

    const handleOk = () => {
        createDeleteSkillsetForUser({ list_skills: skillsetSelected }).then(res => {
            setIsOpen(false)
        })
    }

    const handleCancel = () => {
        setIsOpen(false)
    }

    return (
        <Modal open={isOpen} onOk={handleOk} onCancel={handleCancel} className="skill-modal">
            <SkillSelection
                listCategory={listCategory}
                skillsetSelected={skillsetSelected!}
                setSkillsetSelected={setSkillsetSelected}
                listSkills={listSkills}
                setListSkills={setListSkills}
                categorySelected={categorySelected}
                setCategorySelected={setCategorySelected}
                debouncedText={debouncedText}
                matchJobs={matchJobs}
                setMatchJobs={setMatchJobs}
                setValueSearch={setValueSearch}
            />
        </Modal>
    )
}

export default Skills