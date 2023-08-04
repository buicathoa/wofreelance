import { Col, Row, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import './style.scss'
import { Details } from './Details'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { PostActions } from '../../../reducers/listReducer/postReducer'
import { BiddingInterface, PostInteface, ResponseFormatItem, UserInterface } from '../../../interface'
import dayjs from 'dayjs'
import { Proposal } from './Proposal'
import { useSelector } from 'react-redux'
import { RootState } from '../../../reducers/rootReducer'

interface filterData {
    post_id?: number,
    page: number,
    limit: number,
    search_list: Array<any>,
    sorts: Array<any>
}

export const ProjectDetail = () => {
    const { TabPane } = Tabs
    const dispatch = useDispatch()
    const { post_detail } = useParams()
    const [postItem, setPostItem] = useState<PostInteface>()
    const [biddingEnd, setBiddingEnd] = useState<string>('')
    const [activeTab, setActiveTab] = useState<string>('1')
    const [modifyBid, setModifyBid] = useState<string>('add')
    const [formValues, setformValues] = useState({})
    const [filterData, setfilterData] = useState<filterData>({
        page: 1,
        limit: 10,
        search_list: [],
        sorts: []
    })

    const user: UserInterface = useSelector((state: RootState) => state.user.user)

    const getallBid = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(PostActions.getallBid({ param, resolve, reject }));
        });
    };

    const getPostDetail = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(PostActions.getPostDetail({ param, resolve, reject }));
        });
    };

    useEffect(() => {
        if (user?.id && activeTab === '1') {
            getPostDetail({
                route: post_detail
            }).then((res) => {
                setPostItem(res.data)
                const moment = dayjs()
                const next7Days = dayjs(res.data.bidding_time_end)
                const hours = next7Days.diff(moment, "hours");
                const hourRemain = hours / 24;
                const minutesRemain = hours % 24
                let responseString = ''
                if (hourRemain === 0 && minutesRemain === 0) {
                    responseString = 'Bidding time is over'
                } else {
                    responseString = `BIDDINGS ENDS IN ${Math.floor(hourRemain)} DAYS, ${Math.floor(minutesRemain)} HOURS`
                }
                setBiddingEnd(responseString)

                const dataFilter = {
                    ...filterData, post_id: res.data.id, sorts: [
                        {
                            name_field: 'createdAt',
                            sort_type: 'DESC'
                        }
                    ]
                }
                setfilterData(dataFilter)
                getallBid(dataFilter)
            })
        }
    }, [user])

    const onChangeTab = (key: string) => {
        setActiveTab(key)
    }

    return (
        <div className="project-detail-wrapper">
            <div className="project-detail-container">
                <div className="project-detail-header-infomation">
                    <Row>
                        <Col span={17}>
                            <div className="project-detail-header-infomation-left">
                                <div className="title">{postItem?.title}</div>
                                <div className="post-status open">{postItem?.post_status}</div>
                            </div>
                        </Col>
                        <Col span={7}>
                            <div className="bids-header-info">
                                <span>Bids</span>
                                <span>6</span>
                            </div>
                            <div className="bids-header-info">
                                <span>Average bid</span>
                                <span>₹1,067 INR</span>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="project-detail-tabs">
                    <Tabs
                        className="overview_activities-tab activities custom-tab"
                        defaultActiveKey="1"
                        activeKey={activeTab}
                        onChange={onChangeTab}
                    >
                        <TabPane tab={<div>Details</div>} key="1">
                            <Details
                                postItem={postItem}
                                biddingEnd={biddingEnd}
                                setActiveTab={setActiveTab}
                                modifyBid={modifyBid}
                                setModifyBid={setModifyBid}
                                formValues={formValues}
                                setformValues={setformValues} />
                        </TabPane>
                        <TabPane tab={<div>Proposals</div>} key="2">
                            <Proposal
                                postItem={postItem}
                                setModifyBid={setModifyBid}
                                setActiveTab={setActiveTab}
                                formValues={formValues}
                                setformValues={setformValues} 
                                filterData={filterData}
                                setfilterData={setfilterData}/>
                        </TabPane>
                    </Tabs>
                </div>
                <div className="project-detail-content">
                </div>
            </div>
        </div>
    )
}
