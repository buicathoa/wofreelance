import React, { useEffect, useRef, useState } from 'react'
import './style.scss'
import { useDispatch, useSelector } from 'react-redux';
import { ResponseFormatItem, SkillsetInterface, UserInterface } from '../../interface';
import { UserActions } from '../../reducers/listReducer/userReducer';
import { RootState } from '../../reducers/rootReducer';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LayoutBottomProfile from '../../components/LayoutBottom/LayoutBottomProfile';
import { Button, Card, Col, Rate, Row, Empty } from 'antd';
import {
    DollarCircleOutlined, DingtalkOutlined, ClockCircleOutlined, FlagOutlined, LikeOutlined,
    UserAddOutlined, UserOutlined, MailOutlined, FacebookOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom';
import { certifications, portfolio, rating_empty } from '../../assets';
import Experience from './Experience';
import Education from './Education';
import Publications from './Publications';
import Skills from './Skills';
import { CategoryActions } from '../../reducers/listReducer/categoryReducer';
import { ExperienceActions } from '../../reducers/listReducer/experienceReducer';
import Qualifications from './Qualifications';


const UserProfile = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const navUserRef = useRef(null)
    const portfolioRef = useRef(null)
    const reviewsRef = useRef(null)
    const resumeRef = useRef(null)


    const [isOpenSkillsModal, setIsOpenSkillsModal] = useState(false)
    const [isDisplayNavUser, setIsDisplayNavUser] = useState(false)

    const user: UserInterface = useSelector((state: RootState) => state.user.user)
    const user_skills: Array<SkillsetInterface> = useSelector((state: RootState) => state.category.user_skills)
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

    useEffect(() => {
        Promise.all([
            getAllExperience({ user_id: user.id }),
            getAllSkillsetForUser({ user_id: user.id })
        ])

        const handleScroll = () => {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.body.clientHeight;
            if (scrollTop > documentHeight - windowHeight - 750) {
                setIsDisplayNavUser(true)
            } else {
                setIsDisplayNavUser(false)
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [])

    const handleMoveToDiv = (ref:any) => {
        const yCoordinate = ref.current.getBoundingClientRect().top + window.pageYOffset;
        const yOffset = -70;
        window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
    }


    return (
        <div className="user-profile-wrapper" >
            <LayoutBottomProfile />
            <nav className={`nav-user ${isDisplayNavUser ? 'display' : 'none'}`}>
                <div className="nav-container">
                    <div className="main-information">
                        <div className="avatar">
                            <img src={user?.avatar} alt="" />
                        </div>
                        <div className="name-reviews">
                            <div className="name">{user?.first_name} {user?.last_name}</div>
                            <div className="reviews">
                                <Rate defaultValue={0} style={{fontSize: 12}}/>
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
                        <div className="switch-view-profile">
                            <Button>View Client Profile</Button>
                        </div>
                        <div className="main-content-left">
                            <div className="user-info-wrapper">
                                <Row>
                                    <Col span={8} className="left-left">
                                        <div className="avatar">
                                            <img src={user?.avatar} alt="" />
                                        </div>
                                        <div className="general-info-left">
                                            <div className="general-info-left-item">
                                                <div className="icon-active"></div>
                                                <div className="content status">I'm Online!</div>
                                            </div>
                                            <div className="general-info-left-item">
                                                <DollarCircleOutlined />
                                                <div className="content money">$7 USD / hour</div>
                                            </div>
                                            <div className="general-info-left-item">
                                                <DingtalkOutlined />
                                                <div className="content money">Ho Chi Minh, <span className="country">Vietnam</span></div>
                                            </div>
                                            <div className="general-info-left-item">
                                                <ClockCircleOutlined />
                                                <div className="content money">It's currently 2:08 PM here</div>
                                            </div>
                                            <div className="general-info-left-item">
                                                <FlagOutlined />
                                                <div className="content money">Joined {dayjs(user?.createdAt).format("MMMM DD YYYY")}</div>
                                            </div>
                                            <div className="general-info-left-item">
                                                <LikeOutlined />
                                                <div className="content money">0 Recommendations</div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={16} className="left-right">
                                        <div className="user-info-right-header">
                                            <div className="user-profile-name">{user?.first_name} {user?.last_name} <span className="email">{user?.email}</span></div>
                                            <div className="edit-profile-button">
                                                <span>Edit Profile</span>
                                            </div>
                                        </div>
                                        <div className="user-info-right-content">
                                            <div className="position">{user?.title}</div>
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
                                            <div className="personal-describe">{user?.describe}</div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
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
                            <Publications />
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