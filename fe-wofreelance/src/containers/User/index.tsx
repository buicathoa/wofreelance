import React, { useCallback, useEffect, useRef, useState } from 'react'
import './style.scss'
import { useDispatch, useSelector } from 'react-redux';
import { ResponseFormatItem, SkillsetInterface, UserInterface } from '../../interface';
import { UserActions } from '../../reducers/listReducer/userReducer';
import { RootState } from '../../reducers/rootReducer';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LayoutBottomProfile from '../../components/LayoutBottom/LayoutBottomProfile';
import { Button, Card, Col, Rate, Row, Empty, Form, Input, InputNumber, Popover, Spin } from 'antd';
import {
    DollarCircleOutlined, DingtalkOutlined, ClockCircleOutlined, FlagOutlined, LikeOutlined,
    UserAddOutlined, UserOutlined, MailOutlined, FacebookOutlined, LoadingOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom';
import { certifications, portfolio, rating_empty } from '../../assets';
import Experience from './Experience';
import Education from './Education';
import Skills from './Skills';
import { CategoryActions } from '../../reducers/listReducer/categoryReducer';
import { ExperienceActions } from '../../reducers/listReducer/experienceReducer';
import Qualifications from './Qualifications';
import { CameraOutlined } from '@ant-design/icons'
import ReactCrop, { makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { getBase64 } from '../../utils/helper';
import { openSuccess } from '../../components/Notifications';

const UserProfile = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const navUserRef = useRef(null)
    const [form] = Form.useForm()
    const portfolioRef = useRef(null)
    const reviewsRef = useRef(null)
    const resumeRef = useRef(null)
    const cropRef = useRef<any>(null)

    const [isOpenSkillsModal, setIsOpenSkillsModal] = useState(false)
    const [isDisplayNavUser, setIsDisplayNavUser] = useState(false)
    const [isEditProfile, setIsEditProfile] = useState(false)
    const [formValues, setformValues] = useState({})
    const [fileUploaded, setFileUploaded] = useState<any>()
    const [imgPayload, setImgPayload] = useState<any>()
    const [base64Img, setBase64Img] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const [isModifyCrop, setIsModifyCrop] = useState(false)
    const [isOpenModifyAvt, setIsOpenModifyAvt] = useState(false)
    const [crop, setCrop] = useState<any>({
        unit: 'px',
        x: 10,
        y: 10,
        width: 120,
        height: 120,
        aspect: 1,
        maxWidth: 0,
        maxHeight: 0
    })

    const validateMessages = {
        required: 'This field is required'
    }

    const validateSchema = {
        username: [
            {
                required: true
            }
        ],
        password: [
            {
                required: true
            }
        ]
    }

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

    const updateUser = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.updateUser({ param, resolve, reject }));
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

    const handleMoveToDiv = (ref: any) => {
        const yCoordinate = ref.current.getBoundingClientRect().top + window.pageYOffset;
        const yOffset = -70;
        window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
    }

    const handleEditProfile = () => {
        setIsEditProfile(true)
        const defaultFormValues = { hourly_rate: user?.hourly_rate, title: user?.title, describe: user?.describe }
        setformValues(defaultFormValues)
    }

    const onSubmitForm = () => { }

    const onImageLoaded = (image: any) => {
        cropRef.current = image
        const cropSize = { ...crop, maxWidth: 120, maxHeight: 120, x: (image.width - 120) / 2, y: (image.height - 120) / 2, unit: 'px' }
        setCrop(cropSize);
    }

    const onComplete = (crop: any) => {
        getCroppedImg(cropRef.current, crop).then((croppedImage: any) => {
            setImgPayload(croppedImage)
        });
    };

    const onCropChange = (cropPx: any, cropPercent: any) => {
        const cropSize = { ...crop, ...cropPx, maxWidth: 120, maxHeight: 120, x: (cropRef.current.width - 120) / 2, y: (cropRef.current.height - 120) / 2 }
        setCrop(isModifyCrop ? { ...cropSize, x: cropPx.x, y: cropPx.y, width: cropPx.width, height: cropPx.height } : cropSize)
        setIsModifyCrop(true)
    }

    const getCroppedImg = (imageSrc: any, crop: any) => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement("canvas");
            const scaleX = imageSrc.naturalWidth / imageSrc.width;
            const scaleY = imageSrc.naturalHeight / imageSrc.height;
            canvas.width = crop.width * 2;
            canvas.height = crop.height * 2;
            const ctx: any = canvas.getContext("2d");
            // ctx.scale(2, 2);
            const img = new Image();
            img.src = imageSrc.src
            img.crossOrigin = "anonymous";
            img.onload = () => {
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(
                    img,
                    crop.x * scaleX,
                    crop.y * scaleY,
                    crop.width * scaleX,
                    crop.height * scaleY,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        resolve({ blob, url });
                    }
                }, "image/jpeg");
            }
        });
    }

    const onSubmitFile = async (e: any) => {
        let file = e.target.files[0]
        const base64Imgs: any = await getBase64(file)
        setBase64Img(base64Imgs)
        setFileUploaded(e.target.files[0])
    }

    const handleSetProfilePicture = () => {
        const formData = new FormData()
        formData.append('avatar', imgPayload.blob, imgPayload.url)
        if (fileUploaded) {
            formData.append('avatar', fileUploaded)
        }
        setIsLoading(true)
        setIsModifyCrop(false)
        updateUser(formData).then((user) => {
            openSuccess('Change avatar success.')
            setBase64Img('')
            setIsLoading(false)
            setIsOpenModifyAvt(false)
        })
    }

    console.log('avatar_cropped', user.avatar_cropped)

    console.log('imgPayload?.url', imgPayload?.url)

    console.log('base64Img', base64Img)

    console.log('isModifyCrop', isModifyCrop)

    const renderAvt = () => {
        if (isModifyCrop) {
            return imgPayload?.url
        } else {
            if (base64Img !== '') {
                return base64Img
            } else {
                return user?.avatar_cropped
            }
        }
    }

    const antIcon = <LoadingOutlined style={{ fontSize: '1rem', color: '#1c9292' }} spin />

    return (
        <div className="user-profile-wrapper" >
            <LayoutBottomProfile />
            <nav className={`nav-user ${isDisplayNavUser ? 'display' : 'none'}`}>
                <div className="nav-container">
                    <div className="main-information">
                        <div className="avatar">
                            <img src={user.avatar_cropped} alt="" />
                        </div>
                        <div className="name-reviews">
                            <div className="name">{user?.first_name} {user?.last_name}</div>
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
                            <div className="main-content-left">
                                <div className="user-info-wrapper">
                                    <Row>
                                        <Col span={8} className="left-left">
                                            <div className="avatar"
                                            >
                                                <img src={renderAvt()} alt="" />
                                                {isEditProfile &&
                                                    <Popover
                                                        content={
                                                            <div className="change-image-modal">
                                                                <div className="change-image-modal-content">
                                                                    <div className="title">Edit Profile Picture</div>
                                                                    <div className="description">Max. of 10MB. Recommended size: 840px x 840px</div>
                                                                    {/* <ReactCrop
                                                                        src={base64Img !== '' ? base64Img : user.avatar!}
                                                                        crop={crop}
                                                                        onImageLoaded={onImageLoaded}
                                                                        onComplete={onComplete}
                                                                        onChange={onCropChange}
                                                                        ref={cropRef}
                                                                        maxWidth={crop.maxWidth}
                                                                        maxHeight={crop.maxHeight}
                                                                    /> */}
                                                                    {!isLoading ? <ReactCrop
                                                                        src={base64Img !== '' ? base64Img : user.avatar!}
                                                                        crop={crop}
                                                                        onImageLoaded={onImageLoaded}
                                                                        onComplete={onComplete}
                                                                        onChange={onCropChange}
                                                                        ref={cropRef}
                                                                        maxWidth={crop.maxWidth}
                                                                        maxHeight={crop.maxHeight}
                                                                    /> :
                                                                        <Spin spinning={isLoading} indicator={antIcon}>
                                                                            <div className="div-loading">
                                                                                <span>Proccessing your photo...</span>
                                                                            </div>
                                                                        </Spin>}
                                                                </div>
                                                                <div className={`modify-avatar-button ${isLoading && 'none'}`}>
                                                                    <div className="set-as-default" onClick={handleSetProfilePicture}>Set as Profile picture </div>
                                                                    <div className="change-picture-container">
                                                                        <label htmlFor="upload_avatar">
                                                                            <div className="change-picture">Change Picture</div>
                                                                        </label>
                                                                        <input
                                                                            className="input-file"
                                                                            type="file"
                                                                            name="file"
                                                                            id="upload_avatar"
                                                                            onChange={(e) => onSubmitFile(e)}
                                                                            accept={'/*'}
                                                                            onClick={(event: any) => {
                                                                                event.target.value = ''
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                        open={isOpenModifyAvt}
                                                        trigger="click" placement='right'
                                                        onOpenChange={() => setIsOpenModifyAvt(true)}
                                                        >
                                                        <CameraOutlined className="camera-icon" />
                                                    </Popover>
                                                }
                                            </div>
                                            {isEditProfile ?
                                                <Form.Item name="hourly_rate" className="custom-form-item hourly_rate" rules={validateSchema.username} label="Hourly Rate">
                                                    <InputNumber type='number' placeholder='Hourly Rate' addonAfter="USD per hour" addonBefore="$" />
                                                </Form.Item> :
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
                                                </div>}
                                        </Col>
                                        <Col span={16} className="left-right">
                                            <div className="user-info-right-header">
                                                <div className="user-profile-name">{user?.first_name} {user?.last_name} <span className="email">{user?.email}</span></div>
                                                <div className={`edit-profile-button ${isEditProfile && 'none'}`} onClick={handleEditProfile}>
                                                    <span>Edit Profile</span>
                                                </div>
                                            </div>

                                            <div className="user-info-right-content">
                                                {isEditProfile ? <Form.Item name="title" className="custom-form-item" rules={validateSchema.username} label="Professional Headline">
                                                    <Input placeholder='Professional Headline' className='form-input' />
                                                </Form.Item> : <div className="position">{user?.title}</div>}
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
                                                {isEditProfile ? <Form.Item name="describe" label="Summary" className="custom-form-item" rules={validateSchema.username}>
                                                    <Input.TextArea rows={4} placeholder='Summary' className='form-textarea' />
                                                </Form.Item> : <div className="personal-describe">{user?.describe}</div>}
                                            </div>

                                            <div className={`list-button ${!isEditProfile && 'none'}`}>
                                                <Button onClick={() => setIsEditProfile(false)} className="back">Cancel</Button>
                                                <Button form="edit_profile" key="submit" htmlType="submit" className="next">Save</Button>
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
                            </div>
                        </Form>
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