import React, { useEffect } from 'react'
import './style.scss'
import { useDispatch, useSelector } from 'react-redux';
import { ResponseFormatItem, UserInterface } from '../../interface';
import { UserActions } from '../../reducers/userReducer';
import { RootState } from '../../reducers/rootReducer';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LayoutBottomProfile from '../../components/LayoutBottom/LayoutBottomProfile';
import { Button, Card, Col, Rate, Row, Empty } from 'antd';
import {
    DollarCircleOutlined, DingtalkOutlined, ClockCircleOutlined, FlagOutlined, LikeOutlined,
    UserAddOutlined, UserOutlined, MailOutlined, FacebookOutlined
} from '@ant-design/icons'
import moment from 'moment'
import { Link } from 'react-router-dom';
import { certifications, portfolio, rating_empty } from '../../assets';
import Experience from './Experience';
import Education from './Education';
import Publications from './Publications';



const UserProfile = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user: UserInterface = useSelector((state: RootState) => state.user.user)
    console.log('userne', user)
    return (
        <div className="user-profile-wrapper">
            <LayoutBottomProfile />
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
                                                <div className="content money">Joined {moment(user?.createdAt).format("MMMM DD YYYY")}</div>
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
                            <Card size="small" title="Portfolio Items" className="col-left-card" extra={<Link to="#">Manage</Link>}>
                                <div className="card-content no-data">
                                    <div className="card-image">
                                        <img src={portfolio} alt="" />
                                    </div>
                                    <span className="card-text">No portfolio items have been added yet.</span>
                                </div>
                            </Card>
                            <Card size="small" title="Reviews" className="col-left-card">
                                <div className="card-content no-data">
                                    <div className="card-image rating">
                                        <img src={rating_empty} alt="" />
                                    </div>
                                    <span className="card-text">No reviews to see here!.</span>
                                </div>
                            </Card>
                            <Experience />
                            <Education />
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

                        <Card size="small" title="Top Skills" className="col-right-card" extra={<span>Edit Skills</span>}>
                            {user?.list_skills!.length === 0 ? <div className="empty-data">
                                <Empty
                                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                    imageStyle={{ height: 60 }}
                                />
                            </div> : <div className="list-skills">
                                {user?.list_skills?.map((skill, index) => {
                                    return (
                                        <div className="card-item border" key={index}>{skill.name}</div>
                                    )
                                })}
                            </div>}
                        </Card>

                        <Card size="small" title="Browse Similar Freelancers" className="col-right-card">
                            <div className="card-item border">Javascript</div>
                            <div className="card-item border">Software Architecture</div>
                            <div className="card-item border">HTML</div>
                        </Card>

                        <Card size="small" title="Browse Similar Showcases" className="col-right-card">
                            <div className="card-item border">Javascript</div>
                            <div className="card-item border">Software Architecture</div>
                            <div className="card-item border">HTML</div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default UserProfile