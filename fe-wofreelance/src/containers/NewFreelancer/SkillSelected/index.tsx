import { Button, Card, Col, Input, Progress, Row, Tag } from 'antd'
import { freelancer_logo, facebook_icon_white } from '../../../assets'
import './style.scss'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAppDispatch, useAppSelector } from '../../../reducers/hook'
import { CategoryActions } from '../../../reducers/listReducer/categoryReducer'
import { RightOutlined, PlusOutlined, CheckOutlined } from '@ant-design/icons'
import { SkillselectedComponentInterface, ResponseFormatList, CategoryInterface, SkillsetInterface, ResponseFormatItem } from '../../../interface'
import { useDebounce } from '../../../utils/useDebounce'
import { UserActions } from '../../../reducers/listReducer/userReducer'
import { useNavigate } from 'react-router-dom'
import SkillSelection from '../../../components/SkillSelection'


const SkillSelected = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

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

    useEffect(() => {
        if (localStorage.getItem('access_token')) {
            getUserInfo({}).then(res => {
                if (res.data) {
                    setSkillsetSelected(res?.data?.list_skills)
                    const sum: any = res?.data?.list_skills?.reduce((accumulator:any, currentValue: SkillsetInterface) => {
                        return accumulator + currentValue.job_matching_count!
                    }, 0)
                    setMatchJobs(sum)
                    return
                } else {
                    navigate("/signin")
                }
            })
        } else {
            navigate("/signin")
        }
    }, [])

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

    const handleMoveNextStep = () => {
        updateUser({ list_skills: skillsetSelected }).then(res => {
            if (res.code === 200) {
                navigate('/new-freelancer/link-accounts')
            }
        })
    }

    return (
        <div className="new-freelancer-wrapper">
            <div className="new-freelancer-container">
                <div className="new-freelancer-header">
                    <img src={freelancer_logo} alt="" />
                    <span>Skills</span>
                </div>
                <div className="new-freelancer-progress">
                    <Progress
                        percent={0}
                        strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        }}
                    />
                </div>
                <SkillSelection
                    listCategory={listCategory}
                    skillsetSelected={skillsetSelected!}
                    setSkillsetSelected={setSkillsetSelected}
                    listSkills={listSkills}
                    setListSkills={setListSkills}
                    categorySelected={categorySelected}
                    setCategorySelected={setCategorySelected}
                    debouncedText={debouncedText}
                    // matchJobs={matchJobs}
                    // setMatchJobs={setMatchJobs}
                    setValueSearch={setValueSearch}
                />
            </div>
            <div className={`list-button skills`}>
                <Button onClick={handleMoveNextStep} className="next">Next</Button>
            </div>
        </div>
    )
}

export default SkillSelected
