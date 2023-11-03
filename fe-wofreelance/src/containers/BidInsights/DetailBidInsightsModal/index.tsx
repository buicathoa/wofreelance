import React, { Component, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button, Form, Input, Checkbox, Row, Col, Empty, Modal, InputNumber } from 'antd';
import './style.scss'
import { Link } from 'react-router-dom';
import axios from 'axios';

import { DownOutlined } from '@ant-design/icons'
import { io } from "socket.io-client";
import { useAppDispatch } from '../../../reducers/hook';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reducers/rootReducer';
import { PostActions } from '../../../reducers/listReducer/postReducer';
import { BiddingInterface, ResponseFormatItem } from '../../../interface';
import { SocketContext } from '../../../SocketProvider';
import { ModalConfirm } from '../../../components/ModalConfirm';
import { AppActions } from '../../../reducers/listReducer/appReducer';
import { modalNotifications } from '../../../components/modalNotifications';
import _ from 'lodash';
// import { SocketContext, socket } from '../../SocketContext';


interface DetailBidInsightsModalInterface {
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  recordSelected: any,
  setrecordSelected: any,
  isOwner: boolean
}

const DetailBidInsightsModal = ({ visible, setVisible, recordSelected, setrecordSelected, isOwner }: DetailBidInsightsModalInterface) => {

  const socket: any = useContext(SocketContext)
  const [form] = Form.useForm()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const [visibleAwardBid, setVisibleAwardBid] = useState<boolean>(false)
  const [awardBidRecord, setAwardBidRecord] = useState<any>({})
  const [recordsShow, setRecordsShow] = useState<Array<number>>([])
  const [formValues, setformValues] = useState<any>({})
  const [isChangeAward, setIsChangeAward] = useState(false)
  const [visibleModalConfirm, setVisibleModalConfirm] = useState(false)
  const [isAward, setIsAward] = useState(false)

  const validateMessages = {
    required: 'This field is required'
  }

  const personalBids: any = useSelector((state: RootState) => state.post.personalBids)
  const bids: any = useSelector((state: RootState) => state.post.bids)


  const validateSchema = {
    bidding_amount: [
      {
        required: recordSelected?.project_paid_type === 'fixed' ? true : false
      }
    ],
    delivered_time: [
      {
        required: recordSelected?.project_paid_type === 'fixed' ? true : false
      }
    ],
    hourly_rate: [
      {
        required: recordSelected?.project_paid_type === 'hourly' ? true : false
      }
    ],
    weekly_limit: [
      {
        required: recordSelected?.project_paid_type === 'hourly' ? true : false
      }
    ],
  }

  const updateAwardBid = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(PostActions.updateAwardBid({ param, resolve, reject }));
    });
  };

  const deleteAwardBid = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(PostActions.deleteAwardBid({ param, resolve, reject }));
    });
  };

  const acceptAwardBid = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(PostActions.acceptAwardBid({ param, resolve, reject }));
    });
  };

  useEffect(() => {
    form.resetFields()
  }, [formValues])

  useEffect(() => {
    if (recordSelected) {
      let bid: BiddingInterface | any = {};
      let award = false
      if (location?.pathname?.includes('insights/bids')) {
        bid = personalBids?.find((item: BiddingInterface) => item.id === recordSelected?.bidding_id)
      } else if (location?.pathname?.includes('posts')) {
        bid = bids?.find((item: BiddingInterface) => item.id === recordSelected?.bidding_id)
      }
      if (!_.isEmpty(bid)) {
        award = bid?.bidding_status === 'awarded' ? true : false
      }
      setIsAward(award)
      setformValues(recordSelected)
    }
  }, [recordSelected])

  const onSubmitForm = (values: any) => {
    if (isOwner) {
      updateAwardBid({ ...values, project_paid_type: formValues?.project_paid_type, id: formValues?.id }).then(() => {
        socket.emit('award_bid', { bidding_id: recordSelected?.bidding_id, post_id: formValues?.post_id, status: 'update', isOwner: isOwner })
        setVisible(false)
      })
    } else {
      const payload = {
        bidding_id: recordSelected?.bidding_id,
        awardbid_id: recordSelected?.id
      }
      acceptAwardBid(payload).then(() => {
        socket.emit('award_bid', { bidding_id: recordSelected?.bidding_id, post_id: formValues?.post_id, status: 'awarded', isOwner: isOwner })
        setVisible(false)
        if (isOwner) {
          return modalNotifications({ notiMess: 'Congratulations!', description: 'Your project has been assigned' })
        } else {
          return modalNotifications({ notiMess: 'Congratulations!', description: 'Now you are in the project' })
        }
      })
    }
  }

  const onConfirmCancel = () => {
    setVisible(false)
    setrecordSelected({})
  }

  const handleDenyandDeleteBidAward = () => {
    setVisibleModalConfirm(true)
  }

  const onConfirm = () => {
    dispatch(AppActions.openLoading(true))
    deleteAwardBid({ bidding_id: recordSelected?.bidding_id }).then(() => {
      socket.emit('award_bid', { bidding_id: recordSelected?.bidding_id, post_id: formValues?.post_id, status: 'removed', isOwner: isOwner })
      setVisibleModalConfirm(false)
      setVisible(false)
    })
  }

  return (
    <>
      <Modal
        className="modal-detail-bidaward-container"
        visible={visible}
        onCancel={() => onConfirmCancel()}
        footer={null}
        title={isOwner ? "You award" : "Your bid was awarded"}
      >
        <Form
          id="detail_bid_insights"
          form={form}
          layout="vertical"
          name="detail_bid_insights"
          onFinish={onSubmitForm}
          initialValues={formValues}
          scrollToFirstError
          validateMessages={validateMessages}
          requiredMark={false}
        >
          <Row>
            <Col span={12}>
              <Form.Item name="bidding_amount" label="Bidding Amount" className="custom-form-item has-suffix" rules={validateSchema.bidding_amount}>
                <InputNumber type="number" placeholder='Bidding Amount' className='form-input' addonBefore={recordSelected?.currency_short_name} addonAfter={recordSelected?.currency_name} disabled={recordSelected?.project_paid_type === 'fixed' && (isChangeAward || isOwner) ? false : true} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="delivered_time" label="Delivered in" className="custom-form-item has-suffix" rules={validateSchema.bidding_amount}>
                <InputNumber placeholder='Delivered in' className='form-input' addonAfter="Days" disabled={recordSelected?.project_paid_type === 'fixed' && (isChangeAward || isOwner) ? false : true} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="hourly_rate" label="Hourly rate" className="custom-form-item has-suffix" rules={validateSchema.bidding_amount}>
                <InputNumber placeholder='Hourly rate' className='form-input' addonBefore={recordSelected?.currency_short_name} addonAfter={recordSelected?.currency_name} disabled={recordSelected?.project_paid_type === 'hourly' && (isChangeAward || isOwner) ? false : true} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="weekly_limit" label="Weekly limit" className="custom-form-item has-suffix" rules={validateSchema.bidding_amount}>
                <InputNumber placeholder='Weekly limit' className='form-input' addonAfter="Hours" disabled={recordSelected?.project_paid_type === 'hourly' && (isChangeAward || isOwner) ? false : true} />
              </Form.Item>
            </Col>
          </Row>
          {/* {!isOwner && <Form.Item className="custom-form-item" valuePropName="checked">
            <Checkbox className='form-checkbox' onChange={handleChangeAward}>Change Award</Checkbox>
          </Form.Item>} */}
        </Form>
        {isAward ?
          (<div className="form-footer">
            <Button className="detail-bid-modal-footer" onClick={onConfirmCancel}>Cancel</Button>
          </div>)
          :
          (<div className="form-footer">
            <Button className="detail-bid-modal-footer" onClick={onConfirmCancel}>Cancel</Button>
            <Button className="detail-bid-modal-footer" onClick={handleDenyandDeleteBidAward}>{isOwner ? 'Delete' : 'Deny'}</Button>
            <Button className="detail-bid-modal-footer" form="detail_bid_insights" key="submit" htmlType="submit">{isOwner ? 'Update' : 'Accept'}</Button>
          </div>)
        }
      </Modal>
      <ModalConfirm
        title={'Confirm'}
        content={isOwner ? 'Do you really want to remove this award ?' : 'Do you really want to reject this award ?'}
        visible={visibleModalConfirm}
        setVisible={setVisibleModalConfirm}
        onConfirm={onConfirm}
      />
    </>
  )
}

export default DetailBidInsightsModal
