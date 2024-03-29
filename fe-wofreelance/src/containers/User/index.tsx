import React, { Suspense, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Col, Rate, Row, Empty, Form, Input, Popover, Carousel, Skeleton } from 'antd';
import { useLocation } from 'react-router-dom';
import {
    DollarCircleOutlined, EnvironmentFilled, ClockCircleFilled, FlagFilled,
    UserAddOutlined, UserOutlined, MailOutlined, FacebookOutlined, PoundCircleFilled, LikeFilled, LeftOutlined, RightOutlined
} from '@ant-design/icons'
import { CameraOutlined, FolderOpenOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom';

import { UserActions } from 'reducers/listReducer/userReducer';
import { RootState } from 'reducers/rootReducer';
import _ from 'lodash'
import { PortfolioInterface, ResponseFormatItem, UserInterface } from 'interface';
import { certifications, portfolio, rating_empty } from 'assets';

import { openWarning } from 'components/Notifications';

import { AppActions } from 'reducers/listReducer/appReducer';
import { LocationActions } from 'reducers/listReducer/locationReducer';

import { validImg } from './../../constants';

import './style.scss'

const LayoutBottomProfile = React.lazy(() => import('components/LayoutBottom/LayoutBottomProfile'));
const ModalPortfolio = React.lazy(() => import('containers/User/ModalPortfolio'));
const Skills = React.lazy(() => import('containers/User/Skills'));
const Portfolio = React.lazy(() => import('containers/User/Portfolio'));
const Avatar = React.lazy(() => import('containers/User/Avatar'));
const Education = React.lazy(() => import('containers/User/Education'));
const Qualifications = React.lazy(() => import('containers/User/Qualifications'));
const Experience = React.lazy(() => import('containers/User/Experience'));


const UserProfile = () => {
    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const portfolioRef = useRef(null)
    const reviewsRef = useRef(null)
    const resumeRef = useRef(null)
    const location = useLocation()

    const [isOpenSkillsModal, setIsOpenSkillsModal] = useState(false)
    const [isDisplayNavUser, setIsDisplayNavUser] = useState(false)
    const [isEditProfile, setIsEditProfile] = useState(false)
    const [formValues, setformValues] = useState({})
    const [isOpenModifyAvt, setIsOpenModifyAvt] = useState(false)
    const [fileUploaded, setFileUploaded] = useState<any>({})
    const [componentRoute, setComponentRoute] = useState('')

    const [portfolioAction, setPortfolioAction] = useState({
        visible: false,
        selected: {}
    })

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

    const getUserInfo = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
          dispatch(UserActions.getUserInfo({ param, resolve, reject }));
        });
      };

    useEffect(() => {
        form.resetFields()
    }, [formValues])

    useEffect(() => {
        if (location.search !== '') {
            const queryString = (location.search).split('=')[1]
            console.log('queryString', queryString)
            setComponentRoute(queryString)
        } else {
            const handleScroll = () => {
                const scrollTop = window.scrollY;
                if (scrollTop > 80) {
                    setIsDisplayNavUser(true)
                } else {
                    setIsDisplayNavUser(false)
                }
            };

            window.addEventListener("scroll", handleScroll);

            return () => window.removeEventListener("scroll", handleScroll);
        }
    }, [location])

    useEffect(() => {
        const username = location.pathname.split('/').at(-1)
        if(username && !_.isEmpty(user)) {
            getUserInfo({ username: username, isOwner: true }).then((res) => {
                setFileUploaded({ ...fileUploaded, preview: res?.data?.avatar_cropped })
            })
        } 
    }, [user])


    const handleMoveToDiv = (ref: any) => {
        const yCoordinate = ref.current.getBoundingClientRect().top + window.pageYOffset;
        const yOffset = -70;
        window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
    }

    const handleEditProfile = () => {
        setIsEditProfile(true)
        const defaultFormValues = { hourly_rate: user_info?.hourly_rate, title: user_info?.title, description: user_info?.description, country_id: user_info?.country?.id }
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
            openWarning({ notiMess: 'Negative number is not allowed.' })
        } else if (number === 0) {
            openWarning({ notiMess: 'Negative number must be larger than 0.' })
        } else {
            return
        }
    }

    const handleOpenAvatarPopover = () => {
        setIsOpenModifyAvt(!isOpenModifyAvt)
    }

    const handleOpenPort = (port: PortfolioInterface) => {
        const portfolioClone = { ...portfolioAction }
        portfolioClone['visible'] = true
        portfolioClone['selected'] = port
        setPortfolioAction(portfolioClone)
    }

    console.log('user_info', user_info)

    const renderUserPage = () => {
        switch (componentRoute) {
            case 'portfolio':
                return (
                    <Suspense fallback={<div>Loading...</div>}>
                        <Portfolio />
                    </Suspense>
                )
            default:
                return <Suspense fallback={<div>Loading...</div>}>
                    <LayoutBottomProfile />
                    <nav className={`nav-user ${isDisplayNavUser ? 'display' : 'none'}`}>
                        <div className="nav-container">
                            <div className="main-information">
                                <div className="avatar">
                                    {_.isEmpty(fileUploaded) ? <Skeleton.Image active/> : <img src={fileUploaded?.preview} alt="" />}
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
                        <LayoutBottomProfile />
                    </nav>
                    <div className="background-image">
                        <img src={"https://e0.365dm.com/23/12/2048x1152/skysports-cole-palmer-alfie-gilchrist_6408048.jpg?20231230200535"} alt="" />
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
                                                        {_.isEmpty(fileUploaded) ? <Skeleton.Image active/> : <img src={fileUploaded?.preview} alt="" />}
                                                        {isEditProfile &&
                                                            <Popover
                                                                content={
                                                                    <Suspense fallback={<p>Loading...</p>}>
                                                                        <Avatar setIsOpenModifyAvt={setIsOpenModifyAvt}
                                                                            fileUploaded={fileUploaded} setFileUploaded={setFileUploaded}
                                                                        />
                                                                    </Suspense>
                                                                }
                                                                open={isOpenModifyAvt}
                                                                placement='right'
                                                                trigger={'click'}
                                                                overlayClassName="popover-avatar"
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
                                                        </> :
                                                        (_.isEmpty(user_info) ? <Skeleton paragraph={{rows: 4}}/> : <div className="general-info-left">
                                                            <div className="general-info-left-item">
                                                                <div className="icon-active" style={{ background: user_info?.user_active ? '#5dc26a' : 'rgb(247, 71, 32)' }}></div>
                                                                <div className="content status"><span style={{ color: user_info?.user_active ? '#5dc26a' : 'rgb(247, 71, 32)' }}>I'm {user_info?.user_active ? 'Online' : 'Offline'}!</span></div>
                                                            </div>
                                                            <div className="general-info-left-item">
                                                                <PoundCircleFilled className="money" />
                                                                {user_info?.hourly_rate && <div className="content money">${user_info?.hourly_rate} USD / hour</div>}
                                                            </div>
                                                            <div className="general-info-left-item">
                                                                <EnvironmentFilled className='country' />
                                                                <span className="country content"><img alt='' src={`http://flags.fmcdn.net/data/flags/mini/${(user_info?.country?.country_name)?.toLowerCase()}.png`} /> {user_info?.country?.country_official_name}</span>
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
                                                        </div> )
                                                        }
                                                </Col>
                                                <Col span={16} className="left-right">
                                                    <div className="user-info-right-header">
                                                        <div className="user-profile-name">{user_info?.first_name} {user_info?.last_name} <span className="email">{user_info?.email}</span></div>
                                                        {user.username === user_info.username && <Button className={`edit-profile-button ${isEditProfile && 'none'}`} onClick={handleEditProfile}>
                                                            Edit Profile
                                                        </Button>}
                                                    </div>

                                                    <div className="user-info-right-content">
                                                        {isEditProfile ? <Form.Item name="title" className="custom-form-item" rules={validateSchema.title} label="Professional Headline">
                                                            <Input placeholder='Professional Headline' className='form-input' />
                                                        </Form.Item> : <div className="position">{user_info?.title}</div>}
                                                        {!isEditProfile &&
                                                            <>
                                                                <div className="rating-budget">
                                                                    <div className="rating">
                                                                        <Rate defaultValue={0} />
                                                                        <span className="rating-budget-number"> 0.0 (0 reviews)</span>
                                                                    </div>
                                                                    <div className="amount-money">
                                                                        <DollarCircleOutlined />
                                                                        <span className="rating-budget-number">0.0</span>
                                                                    </div>
                                                                </div>
                                                                <div className="job-history-overview">
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
                                                                </div>
                                                            </>
                                                        }
                                                        {isEditProfile ? <Form.Item name="description" label="Summary" className="custom-form-item" rules={validateSchema.describe}>
                                                            <Input.TextArea rows={4} placeholder='Summary' className='form-input textarea' />
                                                        </Form.Item> : <div className="personal-describe" dangerouslySetInnerHTML={{ __html: ((user_info.description!)?.replace(/\n/g, '<br>')) || '' }} />}
                                                    </div>

                                                    <div className={`list-button ${!isEditProfile && 'none'}`}>
                                                        <Button onClick={() => setIsEditProfile(false)} className="back">Cancel</Button>
                                                        <Button form="edit_profile" key="submit" htmlType="submit" className="next">Save</Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Form>
                                    <Card size="small" title="Portfolio Items" ref={portfolioRef} className="col-left-card" extra={user.username === user_info.username && <Link to={`?page=portfolio`}>Manage</Link>}>
                                        {user_info?.portfolios?.length === 0 ? <div className="card-content no-data">
                                            <div className="card-image">
                                                <img src={portfolio} alt="" />
                                            </div>
                                            <span className="card-text">No portfolio items have been added yet.</span>
                                        </div> : <Row className="portfolio-wrapper-user">
                                            {_.isEmpty(user_info) ? <Skeleton active/> : user_info?.portfolios?.map((port, idx) => {
                                                const fileEndpoint: any = port.file !== '' ? port.file?.split(',')[0].split('.').at(-1) : null
                                                const isImg = fileEndpoint ? validImg.includes(fileEndpoint) : false
                                                const file = port.file?.split(',')[0]
                                                if (port?.portfolio_type === 'image' && port?.file!?.split(',').length > 0) {
                                                    return (
                                                        <Col span={8} key={idx}>
                                                            <Carousel arrows nextArrow={<RightOutlined />} prevArrow={<LeftOutlined />}>
                                                                {port?.file!.split(',').map((a) => {
                                                                    return (
                                                                        <img src={a} alt="" onClick={() => handleOpenPort(port)} />
                                                                    )
                                                                })}
                                                            </Carousel>
                                                            <div className='portfolio-title'>
                                                                {port.title}
                                                            </div>
                                                        </Col>
                                                    )

                                                } else {
                                                    return (
                                                        <Col span={8} key={idx} onClick={() => handleOpenPort(port)}>
                                                            <div className="portfolio-item">
                                                                {isImg ? <div className="portfolio-item-image">
                                                                    <img src={file} alt="" />
                                                                </div> : <div className="file-format"><FolderOpenOutlined /></div>}
                                                            </div>
                                                            <div className='portfolio-title'>
                                                                {port.title}
                                                            </div>
                                                        </Col>
                                                    )
                                                }
                                            })}
                                        </Row>}
                                    </Card>
                                    <Card size="small" title="Reviews" ref={reviewsRef} className="col-left-card">
                                        <div className="card-content no-data">
                                            <div className="card-image rating">
                                                <img src={rating_empty} alt="" />
                                            </div>
                                            <span className="card-text">No reviews to see here!.</span>
                                        </div>
                                    </Card>
                                    <React.Suspense fallback={<p>...Loading</p>}>
                                        <Experience modify={user.username === user_info.username ? true : false} />
                                    </React.Suspense>
                                    <React.Suspense fallback={<p>...Loading</p>}>
                                        <Education modify={user.username === user_info.username ? true : false} />
                                    </React.Suspense>
                                    <React.Suspense fallback={<p>...Loading</p>}>
                                        <Qualifications modify={user.username === user_info.username ? true : false} />
                                    </React.Suspense>
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

                                <Card size="small" title="Top Skills" className="col-right-card" extra={<span onClick={() => setIsOpenSkillsModal(true)}>{user.username === user_info.username ? 'Edit Skills' : ""}</span>}>
                                    {user_info?.list_skills?.length === 0 ? <div className="empty-data">
                                        <Empty
                                            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                            imageStyle={{ height: 60 }}
                                        />
                                    </div> : <div className="list-skills">
                                        {user_info?.list_skills?.map((skill, index) => {
                                            return (
                                                <div className="card-item border" key={index}>{skill.name}</div>
                                            )
                                        })}
                                    </div>}
                                </Card>
                            </Col>
                        </Row>
                    </div>
                    <Suspense fallback={<p>Loading...</p>}>
                        <Skills isOpen={isOpenSkillsModal} setIsOpen={setIsOpenSkillsModal} />
                    </Suspense>
                    {!_.isEmpty(portfolioAction?.selected) && <Suspense fallback={<p>Loading...</p>}>
                        <ModalPortfolio
                            portfolioAction={portfolioAction}
                            setPortfolioAction={setPortfolioAction}
                        />
                    </Suspense>}
                </Suspense>
        }
    }


    return (
        <div className="user-profile-wrapper" >
            {renderUserPage()}
        </div>
    )
}

export default UserProfile