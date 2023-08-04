/* eslint-disable react/no-danger-with-children */
import { Button, Card, Col, Form, Input, Rate, Row, Tooltip } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { InteractionFilled, IssuesCloseOutlined } from '@ant-design/icons'
import { AlertBanner } from '../../../../components/AlertBanner'

import './style.scss'
import { BiddingInterface, BiddingInterfaceResponse, PostInteface, ResponseFormatItem, UserInterface } from '../../../../interface'
import dayjs from 'dayjs'
import { PostActions } from '../../../../reducers/listReducer/postReducer'
import { useDispatch } from 'react-redux'
import { SocketContext } from '../../../../SocketProvider'
import { AppActions } from '../../../../reducers/listReducer/appReducer'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../reducers/rootReducer'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import { ModalConfirm } from '../../../../components/ModalConfirm'
import { openSuccess } from '../../../../components/Notifications'
import { PaginationDivide } from '../../../../components/Pagination'
import { ChatActions } from '../../../../reducers/listReducer/chatReducer'
interface componentInterface {
    postItem?: PostInteface,
    setModifyBid: React.Dispatch<React.SetStateAction<string>>,
    setActiveTab: React.Dispatch<React.SetStateAction<string>>,
    formValues: any,
    setformValues: React.Dispatch<React.SetStateAction<any>>,
    filterData: any,
    setfilterData: any
}

export const Proposal = ({ postItem, setModifyBid, setActiveTab, formValues, setformValues, filterData, setfilterData }: componentInterface) => {
    const [form] = Form.useForm()
    const socket: any = useContext(SocketContext)
    const dispatch = useDispatch()

    const [recordSelectedID, setrecordSelectedID] = useState<number>(0)
    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false)
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

    const bids: Array<BiddingInterface> = useSelector((state: RootState) => state.post.bids)
    const totalBids: number = useSelector((state: RootState) => state.post.totalBids)

    const user: UserInterface = useSelector((state: RootState) => state.user.user)

    const deleteBid = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(PostActions.deleteBid({ param, resolve, reject }));
        });
    };

    const getallBid = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(PostActions.getallBid({ param, resolve, reject }));
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

    const handleEditProposal = () => {
        setModifyBid('edit')
        setActiveTab('1')
        setformValues(bids[idxOwnBid])
    }

    const handleRemoveBidding = (bidding: BiddingInterface) => {
        setIsOpenModalConfirm(true)
        setrecordSelectedID(bidding.id)
    }

    const onConfirm = () => {
        dispatch(AppActions.openLoading(true))
        deleteBid({ id: recordSelectedID }).then(() => {
            openSuccess({ notiMess: 'Removing the bid successfully.' })
            setActiveTab('1')
            setIsOpenModalConfirm(false)
            setrecordSelectedID(0)
            setformValues({})
            setModifyBid('add')
        })
    }

    const renderProposal = () => {
        if (idxOwnBid !== -1) {
            return (
                <div className="own-proposal">
                    <span className="proposal-title">Your proposal</span>
                    <div className="proposal-item">
                        <div className="proposal-header">
                            <div className="proposal-left">
                                <div className="proposal-user-avatar">
                                    <img src={bids[idxOwnBid]?.user?.avatar_cropped} alt="" />
                                </div>
                                <div className="proposal-user-information">
                                    <div className="proposal-user-info">
                                        <div className="proposal-name_status">
                                            <div className="proposal-name">
                                                {bids[idxOwnBid]?.user?.first_name} {bids[idxOwnBid]?.user?.last_name} <Link className="proposal-username" to={`/u/${bids[idxOwnBid]?.user?.username}`}>@{bids[idxOwnBid]?.user?.username}</Link>
                                            </div>
                                            <div className={`user-status ${bids[idxOwnBid]?.user?.user_active ? 'active' : 'deactive'}`}></div>
                                        </div>
                                        <div className="summary-statistics">
                                            <Tooltip title="something..." placement='bottom'><div className="rating"><Rate disabled defaultValue={0} /><span className="number">4.9</span></div></Tooltip>
                                            <Tooltip title="something..." placement='bottom'><div className="reviews"><InteractionFilled /><span className="number">598</span></div></Tooltip>
                                            <Tooltip title="something..." placement='bottom'><div className="percent-success"><IssuesCloseOutlined /><span className="number">6</span></div></Tooltip>
                                            <div className="country">
                                                <img src={`http://flags.fmcdn.net/data/flags/mini/${(bids[idxOwnBid]?.user?.country?.country_name)?.toLowerCase()}.png`} /> <span>{bids[idxOwnBid]?.user?.country?.country_official_name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="proposal-user-title">
                                        {bids[idxOwnBid]?.user?.title}
                                    </div>
                                </div>

                            </div>
                            <div className="proposal-right">
                                <div className="amount-bid">{postItem?.budget?.currency?.short_name}{bids[idxOwnBid]?.hourly_rate}&nbsp;{postItem?.budget?.currency?.name}</div>
                                <div className="amount-time">in {bids[idxOwnBid]?.delivered_time} days</div>
                            </div>
                        </div>
                        <div className="proposal-summary">
                            <div className="proposal-summary-left" dangerouslySetInnerHTML={{ __html: ((bids[idxOwnBid]?.describe_proposal)?.replace(/\n/g, '<br>')) || '' }}></div>
                            <div className="proposal-summary-right">
                                <div className="time-response-message">Replies within a few hours</div>
                                <div className="proposal-button">
                                    <Button onClick={() => handleRemoveBidding(bids[idxOwnBid])}>Retract</Button>
                                    <Button onClick={() => handleEditProposal()}>Edit</Button>
                                </div>
                                {dayjs(bids[idxOwnBid]?.createdAt).diff(dayjs(bids[idxOwnBid]?.updatedAt)) ? <div className="proposal-status">Editted</div> : null}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    const handleAddInteractions = (bid: BiddingInterface) => {
        dispatch(ChatActions.addInteraction({user: bid.user, message_url: postItem?.post_url, message_title: postItem?.title, chat_window_status: 'open'}))
    }

    const handlePagingAction = (currentPageValue: number, viewInPageValue: number) => {
        console.log('hoho')
    }

    return (
        <div className="proposal-wrapper">
            {renderProposal()}
            {idxOwnBid !== -1 && <span className="proposal-title">Others proposal</span>}
            {bids
                ?.filter((bid) => bid.id !== bids[idxOwnBid]?.id)
                ?.map((bid, idx) => {
                    return (
                        <div className="proposal-item" key={idx}>
                            <div className="proposal-header">
                                <div className="proposal-left">
                                    <div className="proposal-user-avatar">
                                        <img src={bid?.user?.avatar_cropped} alt="" />
                                    </div>
                                    <div className="proposal-user-information">
                                        <div className="proposal-user-info">
                                            <div className="proposal-name_status">
                                                <div className="proposal-name">{bid?.user?.first_name} {bid?.user?.last_name} <Link className="proposal-username" to={`/u/${bid?.user?.username}`}>@{bid?.user?.username}</Link></div>
                                                <div className={`user-status ${bid?.user?.user_active ? 'active' : 'deactive'}`}></div>
                                            </div>
                                            <div className="summary-statistics">
                                                <Tooltip title="something..." placement='bottom'><div className="rating"><Rate disabled defaultValue={0} /><span className="number">4.9</span></div></Tooltip>
                                                <Tooltip title="something..." placement='bottom'><div className="reviews"><InteractionFilled /><span className="number">598</span></div></Tooltip>
                                                <Tooltip title="something..." placement='bottom'><div className="percent-success"><IssuesCloseOutlined /><span className="number">6</span></div></Tooltip>
                                                <div className="country">
                                                    <img src={`http://flags.fmcdn.net/data/flags/mini/${(bid?.user?.country?.country_name)?.toLowerCase()}.png`} /> <span>{bid?.user?.country?.country_official_name}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="proposal-user-title">
                                            {bid?.user?.title}
                                        </div>
                                    </div>
                                    <div className={`user-status ${bid?.user?.user_active ? 'active' : 'deactive'}`}></div>
                                </div>
                                <div className="proposal-right">
                                    <div className="amount-bid">{postItem?.budget?.currency?.short_name}{bid?.hourly_rate}&nbsp;{postItem?.budget?.currency?.name}</div>
                                    <div className="amount-time">in {bid?.delivered_time} days</div>
                                </div>
                            </div>
                            <div className="proposal-summary">
                                <div className="proposal-summary-left" dangerouslySetInnerHTML={{ __html: ((bid?.describe_proposal)?.replace(/\n/g, '<br>')) || '' }}></div>
                                <div className="proposal-summary-right">
                                    {
                                        user.id === postItem?.user.id ? (
                                            <div className="proposal-button">
                                                <div className="chat-button" onClick={() => handleAddInteractions(bid)}>
                                                    <Button>Chat</Button>
                                                    <div className={`user-status ${bid.user.user_active ? 'online' : 'offline'}`}></div>
                                                </div>
                                                <Button>Award</Button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="time-response-message">Replies within a few hours</div>
                                                <Link className="report-bid" to="#">Report bid</Link>
                                                {dayjs(bid.createdAt).diff(dayjs(bid.updatedAt)) ? <div className="proposal-status">Editted</div> : null}
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    )
                })}
            <ModalConfirm
                title={'Confirm'}
                content={'Are you sure to retract this bid'}
                visible={isOpenModalConfirm}
                setVisible={setIsOpenModalConfirm}
                onConfirm={onConfirm}
            />
            <PaginationDivide totalRecord={totalBids} handlePagingAction={handlePagingAction} />
        </div>
    )
}
