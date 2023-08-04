/* eslint-disable react/no-danger-with-children */
import { Button, Card, Col, Form, Input, Rate, Row } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { ClockCircleFilled, FlagFilled, MailFilled, SmileFilled, EnvironmentFilled } from '@ant-design/icons'
import { AlertBanner } from '../../../../components/AlertBanner'

import './style.scss'
import { BiddingInterface, PostInteface, ResponseFormatItem, UserInterface } from '../../../../interface'
import dayjs from 'dayjs'
import { PostActions } from '../../../../reducers/listReducer/postReducer'
import { useDispatch } from 'react-redux'
import { SocketContext } from '../../../../SocketProvider'
import { AppActions } from '../../../../reducers/listReducer/appReducer'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../reducers/rootReducer'
import _, { set } from 'lodash'
interface componentInterface {
    postItem?: PostInteface,
    biddingEnd: string,
    setActiveTab: React.Dispatch<React.SetStateAction<string>>,
    modifyBid: string,
    setModifyBid: React.Dispatch<React.SetStateAction<string>>,
    formValues: any,
    setformValues: React.Dispatch<React.SetStateAction<any>>
}

export const Details = ({ postItem, biddingEnd, setActiveTab, modifyBid, setModifyBid, formValues, setformValues }: componentInterface) => {
    const [form] = Form.useForm()
    const socket: any = useContext(SocketContext)
    const dispatch = useDispatch()

    const [idxOwnBid, setIdxOwnBid] = useState<number>(-1)

    const validateMessages = {
        required: 'This field is required'
    }

    const validateSchema = {
        delivered_time: [
            {
                required: true
            }
        ],
        bidding_amount: [
            {
                required: true
            }
        ],
        hourly_rate: [
            {
                required: true
            }
        ]
        , describe_proposal: [
            {
                required: true
            }
        ]
    }

    const user: UserInterface = useSelector((state: RootState) => state.user.user)
    const user_info: UserInterface = useSelector((state: RootState) => state.user.user_info)
    const bids: Array<BiddingInterface> = useSelector((state: RootState) => state.post.bids)
    const totalBids: number = useSelector((state: RootState) => state.post.totalBids)
    const biddingPost = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(PostActions.biddingPost({ param, resolve, reject }));
        });
    };

    const updateBid = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(PostActions.updateBid({ param, resolve, reject }));
        });
    };

    useEffect(() => {
        form.resetFields()
    }, [formValues])

    useEffect(() => {
        if (bids.length > 0) {
            const idxBid = bids.findIndex((bid) => bid.user.id === user.id)
            setIdxOwnBid(idxBid)
        }
    }, [bids])

    const onSubmitForm = (values: any) => {
        dispatch(AppActions.openLoading(true))
        if (modifyBid === 'edit') {
            updateBid({ ...values, id: formValues!.id }).then(() => {
                setActiveTab('2')
            })
        } else {
            biddingPost({ ...values, post_id: postItem!?.id, user_id: postItem?.user?.id }).then((res) => {
                socket.emit("project_bidding", {
                    user_id: postItem?.user?.id,
                    post_id: postItem!?.id,
                    url: postItem?.post_url,
                    describe_proposal: values?.describe_proposal
                })
                setIdxOwnBid(totalBids + 1)
                setActiveTab('2')
            })
        }
    }

    const handleCloseBidding = () => {
        setModifyBid('')
    }

    return (
        <div className="detail-project-wrapper">
            <Row>
                <Col span={17}>
                    <div className="detail-project-left">
                        <Form
                            id="bidding_form"
                            form={form}
                            layout="vertical"
                            name="bidding_form"
                            onFinish={onSubmitForm}
                            initialValues={formValues}
                            scrollToFirstError
                            validateMessages={validateMessages}
                            requiredMark={false}
                        >
                            <div className="detail-project-info">
                                <div className="detail-project-header">
                                    <div className="title">Project Details</div>
                                    <div className="bidding-info">
                                        <div className="bidding-limit">{postItem?.budget?.currency?.short_name} {postItem?.budget?.minimum} - {postItem?.budget?.maximum} {postItem?.budget?.currency?.name}</div>
                                        <div className="bidding-time-remain">
                                            <ClockCircleFilled />
                                            <span className="bidding-remain-title">{biddingEnd}</span>
                                        </div>
                                    </div>
                                </div>
                                {postItem?.project_detail && <div className="detail-project-description" dangerouslySetInnerHTML={{ __html: postItem!.project_detail }} />}
                                <div className="detail-project-skills">
                                    <div className="title">Skill Required</div>
                                    <div className="list-skills">
                                        {postItem?.list_skills.map((skill, idx) => {
                                            return (
                                                <span key={idx}>{skill.name}</span>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="detail-project-bottom">
                                    <span>Project ID: {postItem?.id}</span>
                                    <div className="report-project">
                                        <FlagFilled /> Report Project
                                    </div>
                                </div>
                                <div className="detail-project-alert">
                                    <AlertBanner title={"Beware of scams"} description='If you are being asked to pay a security deposit, or if you are being asked to chat on Telegram, WhatsApp, or another messaging platform, it is likely a scam. Report these projects or contact Support for assistance.' type='warning' />
                                </div>
                                <div className="attachments"></div>
                            </div>
                            {((postItem?.user?.username !== user?.username && bids.findIndex((bid) => bid.user.id === user.id) === -1) || modifyBid === 'edit') && <div className="detail-project-bidding">
                                <Card title="Place a Bid on this Project">
                                    <div className="alert-message">You will be able to edit your bid until the project is awarded to someone.</div>
                                    {postItem?.project_paid_type === 'hourly' ?
                                        <>
                                            <div className="bidding-rate">
                                                <Form.Item name="hourly_rate" rules={validateSchema.hourly_rate} className="custom-form-item" label="Hourly Rate">
                                                    <Input placeholder='Hourly Rate' className='form-input' type="number" suffix={postItem?.budget?.currency?.name} prefix={postItem?.budget?.currency?.short_name} />
                                                </Form.Item>
                                                <Form.Item name="delivered_time" rules={validateSchema.delivered_time} className="custom-form-item" label="This project will be delivered in">
                                                    <Input placeholder='This project will be delivered in' className='form-input' suffix="Hrs" prefix={postItem?.budget?.currency?.short_name} />
                                                </Form.Item>
                                            </div>
                                        </> : <>
                                            <div className="bidding-rate">
                                                <Form.Item name="bidding_amount" rules={validateSchema.bidding_amount} className="custom-form-item" label="Bid amount">
                                                    <Input placeholder='Bid amount' className='form-input' type="number" suffix={postItem?.budget?.currency?.name} prefix={postItem?.budget?.currency?.short_name} />
                                                </Form.Item>
                                                <Form.Item name="delivered_time" rules={validateSchema.delivered_time} className="custom-form-item" label="Delivery time">
                                                    <Input placeholder='Delivery time' className='form-input' suffix="Days" prefix="$" />
                                                </Form.Item>
                                            </div>

                                        </>}
                                    <div className="bidding-description">
                                        <Form.Item name="describe_proposal" rules={validateSchema.describe_proposal} className="custom-form-item" label="Describe your proposal">
                                            <Input.TextArea placeholder='Describe your proposal' className='form-input text-area' />
                                        </Form.Item>
                                    </div>
                                    <div className="list-button">
                                        {modifyBid === 'edit' && <Button className="back" onClick={handleCloseBidding}>Cancel</Button>}
                                        <Button form="bidding_form" key="submit" htmlType="submit" className="next">Save Bid</Button>
                                    </div>
                                </Card>
                            </div>}
                        </Form>
                    </div>
                </Col>
                <Col span={7}>
                    <div className="detail-project-right">
                        <div className="about-client">
                            <div className="title">About the Client</div>
                            <div className="client-info">
                                <img className="avatar" src={postItem?.user?.avatar_cropped} />
                                <div>{postItem?.user?.username}</div>
                            </div>
                            <div className="client-direction"><img src={`http://flags.fmcdn.net/data/flags/mini/${(postItem?.user?.country?.country_name)?.toLowerCase()}.png`} /> {postItem?.user?.country?.country_official_name}</div>
                            <div className="client-rated">
                                <Rate disabled defaultValue={3} className="rating" />
                                <span className="rated-number">0.0</span>
                            </div>
                            <div className="client-dated-joined">
                                <ClockCircleFilled /> Member since {dayjs(postItem?.user?.createdAt).format('MMM DD, YYYY')}
                            </div>
                            <div className="client-verification">
                                <div className="client-verification-item">
                                    <MailFilled /> Email verified
                                </div>
                                <div className="client-verification-item">
                                    <SmileFilled /> Profile completed
                                </div>
                            </div>
                        </div>
                        <Card title="How to write a winning bid">
                            <img src="https://www.f-cdn.com/assets/main/en/assets/project-view-page/icons-big/highlight.svg" alt="" />
                            <div className="winning-bid-description">
                                Your best chance of winning this project is writing a great bid proposal here!
                            </div>
                            <div className="winning-bid-idea">
                                <div className="winning-bid-idea-title">Great bids are ones that:</div>
                                <ul>
                                    <li>Are engaging and well written without spelling or grammatical errors</li>
                                    <li>Show a clear understanding of what is required for this specific project - personalize your response!</li>
                                    <li>Explain how your skills & experience relate to the project and your approach to working on it</li>
                                    <li>Ask questions to clarify any unclear details</li>
                                </ul>
                                <div className="winning-bid-idea-description">
                                    Most of all - don't spam or post cut-and-paste bids. You will be penalized or banned if you do so.
                                </div>
                            </div>
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    )
}
