import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Col, Rate, Row, Empty, Form, Input, InputNumber, Popover, Select } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    DollarCircleOutlined, EnvironmentFilled, ClockCircleFilled, FlagFilled,
    UserAddOutlined, UserOutlined, MailOutlined, FacebookOutlined, PoundCircleFilled, LikeFilled
} from '@ant-design/icons'
import { CameraOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom';

import { UserActions } from '../../reducers/listReducer/userReducer';
import { RootState } from '../../reducers/rootReducer';
import { CategoryActions } from '../../reducers/listReducer/categoryReducer';
import { ExperienceActions } from '../../reducers/listReducer/experienceReducer';

import { CountryInterface, ResponseFormatItem, SkillsetInterface, UserInterface } from '../../interface';
import LayoutBottomProfile from '../../components/LayoutBottom/LayoutBottomProfile';
import { certifications, portfolio, rating_empty } from '../../assets';
import Experience from './Experience';
import Education from './Education';
import Skills from './Skills';
import Qualifications from './Qualifications';
import { Avatar } from './Avatar';

import './style.scss'
import { openWarning } from '../../components/Notifications';
import { AppActions } from '../../reducers/listReducer/appReducer';
import { EducationActions } from '../../reducers/listReducer/educationReducer';
import { removeAccentsToLower } from '../../utils/helper';
import { LocationActions } from '../../reducers/listReducer/locationReducer';
import { SocketContext } from '../../SocketContext';
import { io } from "socket.io-client";
const UserProfile = () => {
    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const portfolioRef = useRef(null)
    const reviewsRef = useRef(null)
    const resumeRef = useRef(null)
    const socket = useContext(SocketContext)

    const [isOpenSkillsModal, setIsOpenSkillsModal] = useState(false)
    const [isDisplayNavUser, setIsDisplayNavUser] = useState(false)
    const [isEditProfile, setIsEditProfile] = useState(false)
    const [formValues, setformValues] = useState({})
    const [isOpenModifyAvt, setIsOpenModifyAvt] = useState(false)
    const [fileUploaded, setFileUploaded] = useState<any>({})
    const [userStatus, setUserStatus] = useState<any>({})

    const validateMessages = {
        required: 'This field is required'
    }

    const validateSchema = {
        hourly_rate: [
            {
                required: true
            }
        ],
        title: [
            {
                required: true
            }
        ],
        describe: [
            {
                required: true
            }
        ],
        country_id: [
            {
                required: true
            }
        ]
    }

    const user: UserInterface = useSelector((state: RootState) => state.user.user)
    const user_info: UserInterface = useSelector((state: RootState) => state.user.user_info)
    console.log('user_info', user_info)
    const user_skills: Array<SkillsetInterface> = useSelector((state: RootState) => state.category.user_skills)
    const countries: Array<CountryInterface> = useSelector((state: RootState) => state.location.countries)

    const getAllExperience = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(ExperienceActions.getAllExperience({ param, resolve, reject }));
        });
    };

    const getAllSkillsetForUser = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(CategoryActions.getAllSkillsetForUser({ param, resolve, reject }));
        });
    };

    const updateUser = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.updateUser({ param, resolve, reject }));
        });
    };

    const getAllCountries = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(LocationActions.getAllCountries({ param, resolve, reject }));
        });
    };

    useEffect(() => {
        form.resetFields()
    }, [formValues])

    useEffect(() => {
        Promise.all([
            getAllExperience({ user_id: user_info.id }),
            getAllSkillsetForUser({ user_id: user_info.id })
        ])

        const handleScroll = () => {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.body.clientHeight;
            // debugger
            if (scrollTop > documentHeight - windowHeight - 635) {
                setIsDisplayNavUser(true)
            } else {
                setIsDisplayNavUser(false)
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [])

    useEffect(() => {
        if (Object.values(user_info).length > 0) {
            socket.emit('user_status', user_info.id)
            socket.on("user_status_result", (data) => {
                debugger
                const userInfo = data.find((x:any) => x.user_id === user_info.id)
                setUserStatus(userInfo)
            });

            setFileUploaded({
                ...fileUploaded, preview: user_info?.avatar_cropped
            })
        }
    }, [user_info])

    const handleMoveToDiv = (ref: any) => {
        const yCoordinate = ref.current.getBoundingClientRect().top + window.pageYOffset;
        const yOffset = -70;
        window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
    }

    const handleEditProfile = () => {
        setIsEditProfile(true)
        const defaultFormValues = { hourly_rate: user_info?.hourly_rate, title: user_info?.title, describe: user_info?.describe, country_id: user_info?.country?.id }
        setformValues(defaultFormValues)
        getAllCountries({})
    }

    const onSubmitForm = (values: any) => {
        dispatch(AppActions.openLoading(true))
        updateUser(values).then((res) => {
            if (res) {
                setIsEditProfile(false)
            }
        })
    }

    const handleChangeHourlyRate = (event: any) => {
        const number = parseInt(event.target.value)
        if (number < 0) {
            openWarning('Negative number is not allowed.')
        } else if (number === 0) {
            openWarning('Negative number must be larger than 0.')
        } else {
            return
        }
    }

    const handleOpenAvatarPopover = () => {
        setIsOpenModifyAvt(true)
        setFileUploaded({ ...fileUploaded, base64: user_info?.avatar })
    }


    return (
        <div className="user-profile-wrapper" >
            <LayoutBottomProfile />
            <nav className={`nav-user ${isDisplayNavUser ? 'display' : 'none'}`}>
                <div className="nav-container">
                    <div className="main-information">
                        <div className="avatar">
                            <img src={fileUploaded?.preview} alt="" />
                        </div>
                        <div className="name-reviews">
                            <div className="name">{user_info?.first_name} {user_info?.last_name}</div>
                            <div className="reviews">
                                <Rate defaultValue={0} style={{ fontSize: 12 }} />
                                <span className="rating-budget-number"> 0.0 (0 reviews)</span>
                            </div>
                        </div>
                    </div>
                    <div className="user-fast-navigation">
                        <ul>
                            <li className="active">About Me</li>
                            <li onClick={() => handleMoveToDiv(portfolioRef)}>Portfolio</li>
                            <li onClick={() => handleMoveToDiv(reviewsRef)}>Reviews</li>
                            <li onClick={() => handleMoveToDiv(resumeRef)}>Resume</li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="background-image">
                <img src={"https://res.cloudinary.com/dqzprqtqg/image/upload/v1683209655/hihi_j5fvip.jpg"} alt="" />
            </div>
            <div className="user-profile-content">
                <Row>
                    <Col span={17} className="content-left">
                        <div className="switch-view-profile"    >
                            <Button>View Client Profile</Button>
                        </div>

                        <div className="main-content-left">
                            <Form
                                id="edit_profile"
                                form={form}
                                layout="vertical"
                                name="edit_profile"
                                onFinish={onSubmitForm}
                                initialValues={formValues}
                                scrollToFirstError
                                validateMessages={validateMessages}
                                requiredMark={false}
                            >
                                <div className={`user-info-wrapper ${isEditProfile && 'edit'}`}>
                                    <Row>
                                        <Col span={8} className="left-left">
                                            <div className="avatar"
                                            >
                                                <img src={fileUploaded?.preview} alt="" />
                                                {isEditProfile &&
                                                    <Popover
                                                        content={
                                                            <Avatar isOpenModifyAvt={isOpenModifyAvt} setIsOpenModifyAvt={setIsOpenModifyAvt}
                                                                fileUploaded={fileUploaded} setFileUploaded={setFileUploaded}
                                                            />}
                                                        open={isOpenModifyAvt}
                                                        placement='right'
                                                        trigger={'click'}
                                                        overlayClassName="popover-avatar"
                                                    // onOpenChange={() => setIsOpenModifyAvt(true)}
                                                    >
                                                        <CameraOutlined className="camera-icon" onClick={handleOpenAvatarPopover} />
                                                    </Popover>
                                                }
                                            </div>
                                            {isEditProfile ?
                                                <>
                                                    <Form.Item name="hourly_rate" className="custom-form-item hourly_rate" rules={validateSchema.hourly_rate} label="Hourly Rate">
                                                        <Input type='number' placeholder='Hourly Rate' min={1} suffix="USD per hour" className='form-input currency' onChange={handleChangeHourlyRate} />
                                                    </Form.Item>
                                                    {/* <Form.Item name="country_id" label="Country" className="custom-form-item" rules={validateSchema.country_id}>
                                                        <Select
                                                            className="form-select multiple textarea"
                                                            allowClear
                                                            virtual={false}
                                                            placeholder={'Select your country'}
                                                            filterOption={(input, option: any) =>
                                                                removeAccentsToLower(option.children).indexOf(removeAccentsToLower(input)) >= 0
                                                            }
                                                            filterSort={(optionA, optionB) =>
                                                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                                            }
                                                            getPopupContainer={(triggerNode) => triggerNode.parentNode}

                                                            showSearch
                                                        >
                                                            {countries?.length > 0 && countries.map((country: any, index) => {
                                                                return (
                                                                    <Select.Option key={index} value={country.id}>{country.country_official_name}</Select.Option>
                                                                )
                                                            })}
                                                        </Select>
                                                    </Form.Item> */}
                                                </> :
                                                <div className="general-info-left">
                                                    <div className="general-info-left-item">
                                                        <div className="icon-active" style={{background: userStatus?.status === 'online' ? '#5dc26a' : 'rgb(247, 71, 32)'}}></div>
                                                        <div className="content status"><span style={{color: userStatus?.status === 'online' ? '#5dc26a' : 'rgb(247, 71, 32)'}}>I'm {userStatus?.status}!</span></div>
                                                    </div>
                                                    <div className="general-info-left-item">
                                                        <PoundCircleFilled className="money" />
                                                        {user_info?.hourly_rate && <div className="content money">${user_info?.hourly_rate} USD / hour</div>}
                                                    </div>
                                                    <div className="general-info-left-item">
                                                        <EnvironmentFilled className='country' />
                                                        <span className="country content"><img src={`http://flags.fmcdn.net/data/flags/mini/${(user_info?.country?.country_name)?.toLowerCase()}.png`} /> {user_info?.country?.country_official_name}</span>
                                                    </div>
                                                    <div className="general-info-left-item">
                                                        <ClockCircleFilled />
                                                        <div className="content">It's currently {user_info?.current_time && user_info?.current_time!.split(',')[1].trim()} here</div>
                                                    </div>
                                                    <div className="general-info-left-item">
                                                        <FlagFilled />
                                                        <div className="content">Joined {dayjs(user_info?.createdAt).format("MMMM DD YYYY")}</div>
                                                    </div>
                                                    <div className="general-info-left-item">
                                                        <LikeFilled />
                                                        <div className="content">0 Recommendations</div>
                                                    </div>
                                                </div>}
                                        </Col>
                                        <Col span={16} className="left-right">
                                            <div className="user-info-right-header">
                                                <div className="user-profile-name">{user_info?.first_name} {user_info?.last_name} <span className="email">{user_info?.email}</span></div>
                                                <div className={`edit-profile-button ${isEditProfile && 'none'}`} onClick={handleEditProfile}>
                                                    <span>Edit Profile</span>
                                                </div>
                                            </div>

                                            <div className="user-info-right-content">
                                                {isEditProfile ? <Form.Item name="title" className="custom-form-item" rules={validateSchema.title} label="Professional Headline">
                                                    <Input placeholder='Professional Headline' className='form-input' />
                                                </Form.Item> : <div className="position">{user_info?.title}</div>}
                                                {!isEditProfile && <div className="rating-budget">
                                                    <div className="rating">
                                                        <Rate defaultValue={0} />
                                                        <span className="rating-budget-number"> 0.0 (0 reviews)</span>
                                                    </div>
                                                    <div className="amount-money">
                                                        <DollarCircleOutlined />
                                                        <span className="rating-budget-number">0.0</span>
                                                    </div>
                                                </div>}
                                                {!isEditProfile && <div className="job-history-overview">
                                                    <div className="overview-item">
                                                        <div className="quantity">N/A</div>
                                                        <div className="overview-description">Jobs Completed</div>
                                                    </div>
                                                    <div className="overview-item">
                                                        <div className="quantity">N/A</div>
                                                        <div className="overview-description">On Budget</div>
                                                    </div>
                                                    <div className="overview-item">
                                                        <div className="quantity">N/A</div>
                                                        <div className="overview-description">On Time</div>
                                                    </div>
                                                    <div className="overview-item">
                                                        <div className="quantity">N/A</div>
                                                        <div className="overview-description">Repeat Hire Rate</div>
                                                    </div>
                                                </div>}
                                                {isEditProfile ? <Form.Item name="describe" label="Summary" className="custom-form-item" rules={validateSchema.describe}>
                                                    <Input.TextArea rows={4} placeholder='Summary' className='form-input textarea' />
                                                </Form.Item> : <div className="personal-describe">{user_info?.describe}</div>}
                                            </div>

                                            <div className={`list-button ${!isEditProfile && 'none'}`}>
                                                <Button onClick={() => setIsEditProfile(false)} className="back">Cancel</Button>
                                                <Button form="edit_profile" key="submit" htmlType="submit" className="next">Save</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Form>
                            <Card size="small" title="Portfolio Items" ref={portfolioRef} className="col-left-card" extra={<Link to="#">Manage</Link>}>
                                <div className="card-content no-data">
                                    <div className="card-image">
                                        <img src={portfolio} alt="" />
                                    </div>
                                    <span className="card-text">No portfolio items have been added yet.</span>
                                </div>
                            </Card>
                            <Card size="small" title="Reviews" ref={reviewsRef} className="col-left-card">
                                <div className="card-content no-data">
                                    <div className="card-image rating">
                                        <img src={rating_empty} alt="" />
                                    </div>
                                    <span className="card-text">No reviews to see here!.</span>
                                </div>
                            </Card>
                            <Experience />
                            <Education />
                            <Qualifications />
                        </div>

                    </Col>
                    <Col span={7} className="content-right">
                        <Card size="small" title="Verifications" className="col-right-card">
                            <div className="card-item">
                                <div className="card-item-left">
                                    <UserAddOutlined />
                                    <span>Preferred Freelancer</span>
                                </div>
                                <Link to="#">
                                    <div className="card-item-right">
                                        Join
                                    </div>
                                </Link>
                            </div>
                            <div className="card-item">
                                <div className="card-item-left">
                                    <UserOutlined />
                                    <span>Identity Verified</span>
                                </div>
                            </div>
                            <div className="card-item">
                                <div className="card-item-left">
                                    <MailOutlined />
                                    <span>Email Verified</span>
                                </div>
                                <Link to="#">
                                    <div className="card-item-right">
                                        Verify
                                    </div>
                                </Link>
                            </div>
                            <div className="card-item">
                                <div className="card-item-left">
                                    <FacebookOutlined />
                                    <span>Facebook Verified</span>
                                </div>
                                <Link to="#">
                                    <div className="card-item-right">
                                        Verify
                                    </div>
                                </Link>
                            </div>
                        </Card>

                        <Card size="small" title="Certifications" className="col-right-card">
                            <div className="card-content">
                                <div className="card-image">
                                    <img src={certifications} alt="" />
                                </div>
                                <span className="card-text">You don't have any certifications yet.</span>
                                <Button>Get Certified</Button>
                            </div>
                        </Card>

                        <Card size="small" title="Top Skills" className="col-right-card" extra={<span onClick={() => setIsOpenSkillsModal(true)}>Edit Skills</span>}>
                            {user_skills?.length === 0 ? <div className="empty-data">
                                <Empty
                                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                    imageStyle={{ height: 60 }}
                                />
                            </div> : <div className="list-skills">
                                {user_skills?.map((skill, index) => {
                                    return (
                                        <div className="card-item border" key={index}>{skill.name}</div>
                                    )
                                })}
                            </div>}
                        </Card>
                    </Col>
                </Row>
            </div>
            <Skills isOpen={isOpenSkillsModal} setIsOpen={setIsOpenSkillsModal} />
        </div>
    )
}

export default UserProfile