import React, { Component, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button, Form, Input, Checkbox, Row, Col, Empty } from 'antd';
import { freelancer_logo, facebook_icon_white } from './../../assets'
import { AppActions } from '../../reducers/listReducer/appReducer';
import './style.scss'
import { useAppDispatch } from '../../reducers/hook';
import { Link } from 'react-router-dom';
import { BiddingInterface, ResponseFormatItem, SkillsetInterface, UserInterface } from '../../interface';
import { UserActions } from '../../reducers/listReducer/userReducer';
import { openError } from '../../components/Notifications';
import axios from 'axios';
import { getCookie } from '../../utils/helper';
import { DownOutlined } from '@ant-design/icons'
import { io } from "socket.io-client";
import { SocketContext } from '../../SocketProvider';
import { PostActions } from '../../reducers/listReducer/postReducer';
import { TableData } from '../../components/TableData';
import { useSelector } from 'react-redux';
import { RootState } from '../../reducers/rootReducer';
import DetailBidInsightsModal from './DetailBidInsightsModal';
// import { SocketContext, socket } from '../../SocketContext';


const BidInsights = () => {

  const dispatch = useAppDispatch()
  const [visibleAwardBid, setVisibleAwardBid] = useState<boolean>(false)
  const [awardBidRecord, setAwardBidRecord] = useState<any>({})
  const [recordsShow, setRecordsShow] = useState<Array<number>>([])

  const user: UserInterface = useSelector((state: RootState) => state.user.user)

  const titleHeader = [
    { label: 'Project', key: 'post_title' },
    { label: 'Project type', key: 'project_paid_type' },
    { label: 'Status', key: 'bidding_status' },
    { label: 'Client information', key: 'client_info' },
    { label: 'Bidding amount', key: 'bidding_amount' },
    { label: 'Delivery time (date)', key: 'delivered_time' },
    { label: 'Hourly earn', key: 'hourly_rate' },
    { label: 'Weekly limit (hours)', key: 'weekly_limit' },
    { label: '', key: 'actions' }
  ]

  const getAllPersonalBiddings = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(PostActions.getAllPersonalBiddings({ param, resolve, reject }));
    });
  };

  const personalBids: any = useSelector((state: RootState) => state.post.personalBids)

  useEffect(() => {
    getAllPersonalBiddings({})
  }, [])

  const handleSelectRecord = (data: any) => {
    let recordShowClone = [...recordsShow]
    const idxRecordShow = recordShowClone?.findIndex((record) => record === data.id)
    if (idxRecordShow === -1) {
      recordShowClone.push(data.id)
    } else {
      recordShowClone = recordShowClone?.filter((record) => record !== data.id)
    }
    setRecordsShow(recordShowClone)
  }

  const handleShowAward = (award: any) => {
    console.log(award)
    setVisibleAwardBid(true)
    setAwardBidRecord(award)
  }

  console.log('personalBids', personalBids)

  const renderTableBody = () => {
    return personalBids?.map((data: any, idxData: number) => {
      return (
        <>
          <tr key={idxData}>
            {titleHeader?.map((header, idxHeader) => {
              if (header?.key === 'post_title') {
                return (
                  <td key={idxHeader}><Link to={`/${data?.post_url}`}>{data[header?.key]}</Link></td>
                )
              } else if (header?.key === 'client_info') {
                return (
                  <td key={idxHeader}><img src={`http://flags.fmcdn.net/data/flags/mini/${(data?.client_info?.country_name)?.toLowerCase()}.png`} /></td>
                )
              } else if (header?.key === 'actions') {
                return (
                  <td className={`action-button arrow-${recordsShow?.includes(data.id) ? 'hide' : 'show'}`} onClick={() => handleSelectRecord(data)} key={idxHeader}><DownOutlined /></td>
                )
              }
              else {
                return (
                  <td key={idxHeader}>{data[header?.key]}</td>
                )
              }
            })}
          </tr>
          {data?.award && <tr className="award-bid">
            {titleHeader?.map((header, idx) => {
              if (header?.key === 'actions') {
                return <td key={idx}>
                  <div className="award-bid-buttons">
                    <Button onClick={() => handleShowAward(data)}>View detail</Button>
                  </div>
                </td>
              } else if(header?.key === 'post_title') {
                return <td key={idx}>AWARD OF THE BID</td>
              } else {
                return (
                  <td key={idx}>{data?.award[header?.key]}</td>
                )
              }
            })}
          </tr>}
          {recordsShow?.includes(data.id) &&
            <tr>
              <td colSpan={8}>
                <Row className="table-detail-post">
                  <Col span={14}>
                    <div className="detail-post-left">
                      <div className="detail-post-item detail-post-name">
                        <div className="detail-post-label">PROJECT NAME</div>
                        <div className="detail-post-url"><Link to={`/${data?.post_url}`}>{data?.post_title}</Link></div>
                      </div>
                      <div className="detail-post-item detail-post-description">
                        <div className="detail-post-label">PROJECT DESCRIPTION</div>
                        <div className="detail-post-description" dangerouslySetInnerHTML={{ __html: data?.post?.project_detail }}></div>
                      </div>
                      <div className="detail-post-item">
                        <div className="detail-post-label">REQUIRED SKILLS</div>
                        <div className="detail-post-skills">
                          {data?.post?.list_skills?.map((skill: SkillsetInterface, idx: number) => {
                            return (
                              <div className="detail-post-skill-item" key={idx}>{skill?.name}</div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col span={10}>
                    <div className="detail-post-item">
                      <div className="detail-post-label">YOUR BID</div>
                      <div className="detail-post-description" dangerouslySetInnerHTML={{ __html: data?.describe_proposal }}></div>
                    </div>
                  </Col>
                </Row>
              </td>
            </tr>
          }
        </>
      )
    })
  }


  return (
    <div className="bid-insights-wrapper">
      <TableData titleHeader={titleHeader} tableData={personalBids} renderTableBody={renderTableBody} />
      <DetailBidInsightsModal visible={visibleAwardBid} setVisible={setVisibleAwardBid} recordSelected={{ ...awardBidRecord?.award, post_id: awardBidRecord?.post?.id, bidding_id: awardBidRecord?.id }} setrecordSelected={setAwardBidRecord} isOwner={false} />
    </div>
  )
}

export default BidInsights
