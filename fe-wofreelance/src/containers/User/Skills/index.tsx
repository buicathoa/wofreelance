import { Modal } from 'antd'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import SkillSelection from 'components/SkillSelection'
import { CategoryInterface, ResponseFormatItem, ResponseFormatList, SkillComponentInterface, SkillsetInterface, UserInterface } from 'interface'
import { useDebounce } from 'utils/useDebounce'
import { UserActions } from 'reducers/listReducer/userReducer'
import { CategoryActions } from 'reducers/listReducer/categoryReducer'

import './style.scss'
import { useSelector } from 'react-redux'
import { RootState } from 'reducers/rootReducer'
const Skills = ({isOpen, setIsOpen}: SkillComponentInterface) => {
    const dispatch = useDispatch()
    const [skillsetSelected, setSkillsetSelected] = useState<Array<SkillsetInterface> | undefined>([])
    const [categorySelected, setCategorySelected] = useState<CategoryInterface>({})
    const [listCategory, setListCategory] = useState<Array<CategoryInterface>>([])
    const [listSkills, setListSkills] = useState<Array<SkillsetInterface>>([])

    const [valueSearch, setValueSearch] = useState<string>('')

    const debouncedText = useDebounce(valueSearch, 500);
    const user: UserInterface = useSelector((state: RootState) => state.user.user)

    const getAllSkillsetForNewFreelance = (param: any): Promise<ResponseFormatList> => {
        return new Promise((resolve, reject) => {
            dispatch(CategoryActions.getAllSkillsetForNewFreelance({ param, resolve, reject }));
        });
    };

    const createDeleteSkillsetForUser = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.createDeleteSkillsetForUser({ param, resolve, reject }));
        });
    };

    useEffect(() => {
        if(isOpen) {
            if (debouncedText === '') {
                getAllSkillsetForNewFreelance({}).then((res) => {
                    if (res.data) {
                        let totalMatches = 0;
                        const skillsetSelectedClone = user?.list_skills?.map((skill) => {
                            const currentRecord: any = res?.data?.findIndex((x) => x.id === skill.category_id)
                            if(currentRecord !== -1) {
                                const skillFound = res.data![currentRecord].list_skills.find((x: SkillsetInterface) => x.id === skill.id)
                                return skillFound
                            }
                        })
                        console.log('totalMatches', totalMatches)
                        setListCategory(res?.data)
                        setSkillsetSelected(skillsetSelectedClone)
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
        }
    }, [debouncedText, isOpen])

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
                setValueSearch={setValueSearch}
            />
        </Modal>
    )
}

export default React.memo(Skills)