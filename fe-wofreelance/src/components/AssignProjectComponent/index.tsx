/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
import { useContext, useEffect, useState } from 'react'
import { Button, Col, Form, Input, InputNumber, Modal, Radio, Rate, Row } from 'antd'
import { saveAs } from "file-saver";

import { useSelector } from 'react-redux'

import './style.scss'
import { BiddingInterface, PostInteface, ResponseFormatItem } from '../../interface';
import { RootState } from '../../reducers/rootReducer';
import { PostActions } from '../../reducers/listReducer/postReducer';
import { useDispatch } from 'react-redux';
import { SocketContext } from '../../SocketProvider';

interface AssignProjectComponent {
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    recordSelected?: number,
    post?: PostInteface
}

export const AssignProjectComponent = ({ visible, setVisible, recordSelected, post }: AssignProjectComponent) => {
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const socket: any = useContext(SocketContext)

    const [amountPaidSelected, setAmountPaidSelected] = useState('hours_per_week')
    const [valueAfterChange, setValueAfterChange] = useState<any>({})

    const bidFound: any = useSelector((state: RootState) => state.post.bids?.find(bid => bid.id === recordSelected))
    // console.log('bidFound', bidFound)
    // console.log('post', post)

    const validateMessages = {
        required: 'This field is required'
    }

    const validateSchema = {
        hours_per_week: [
            {
                required: true
            }
        ],
        budget: [
            {
                required: true
            }
        ],
        delivered_time: [
            {
                required: true
            }
        ]
    }

    const createAwardBid = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(PostActions.createAwardBid({ param, resolve, reject }));
        });
    };

    useEffect(() => {
        if (bidFound?.id) {
            setValueAfterChange(bidFound)
        }
    }, [bidFound])

    useEffect(() => {
        form.resetFields()
    }, [bidFound])

    const onConfirmCancel = () => {
        setVisible(false)
    }

    const handleChangeAmountPaid = (e: any) => {
        setAmountPaidSelected(e.target.value)
    }

    const onSubmitForm = (values: any) => {
        // console.log(bidFound)
        // debugger
        let payload = {}
        if (bidFound?.project_paid_type === 'fixed') {
            payload = { bidding_id: bidFound?.id, project_paid_type: bidFound?.project_paid_type, ...values, post_id: post?.id }
        } else {
            const weeklyLimit = amountPaidSelected === 'hours_per_week' ? valueAfterChange?.weekly_limit : (valueAfterChange?.max_weekly_bill ?? 40) / valueAfterChange?.hourly_rate
            payload = { bidding_id: bidFound?.id, project_paid_type: bidFound?.project_paid_type, hourly_rate: bidFound?.hourly_rate, weekly_limit: weeklyLimit, post_id: post?.id }
        }

        createAwardBid(payload).then((res) => {
            socket.emit('award_bid', { bidding_id: bidFound?.id, post_id: post?.id, status: 'create', isOwner: true, previous_bidding_id: res?.data?.previous_bidding_id })
            setVisible(false)
        })
    }

    const handleChangeForm = (changed: any, all: any) => {
        // console.log('changed', changed)
        // console.log('all', all)
        setValueAfterChange({ ...bidFound, ...all })
    }

    console.log('valuesAfterChange', valueAfterChange)

    return (
        <>
            <Modal
                className="modal-assign-project"
                visible={visible}
                onCancel={() => onConfirmCancel()}
                footer={null}
            >
                <Form
                    id="assign_project"
                    form={form}
                    layout="vertical"
                    name="assign_project"
                    onFinish={onSubmitForm}
                    initialValues={bidFound}
                    scrollToFirstError
                    validateMessages={validateMessages}
                    requiredMark={false}
                    onValuesChange={handleChangeForm}
                >
                    <div className="assign-project">
                        <span className="assign-project-title header-text">
                            {bidFound?.project_paid_type === 'hourly' ? 'Set up your Hourly Project' : 'Set up your Milestone Payments'}
                        </span>
                        <span className="assign-project-description">Review your billing details to award this project.</span>
                    </div>
                    {bidFound?.project_paid_type === 'hourly' ? <div className="project-paid-type hourly-paid">
                        <div className="assign-project">
                            <span className="assign-project-title">Weekly limit<span className="tooltip-icon">i</span></span>
                            <span className="assign-project-description">You can either set up a maximum number of hours or a maximum weekly bill.</span>
                        </div>
                        <div className="assign-project amount-paid-project custom-form-item">
                            <Radio.Group
                                onChange={(e) => handleChangeAmountPaid(e)}
                                className="custom-radio-group-btn"
                                value={amountPaidSelected}
                            >
                                <div className="wrap">
                                    <Radio checked className="custom-radio" value={'hours_per_week'}>
                                        Max number of hours
                                    </Radio>
                                </div>
                                <div className="wrap">
                                    <Radio className="custom-radio" value={'weekly_paid'}>
                                        Max weekly bill
                                    </Radio>
                                </div>
                            </Radio.Group>
                        </div>
                        <Form.Item name={amountPaidSelected === 'hours_per_week' ? 'weekly_limit' : 'max_weekly_bill'} label={amountPaidSelected === 'hours_per_week' ? 'Maximum hours/week' : 'Maximum Weekly Bill'} className="assign-project correspond-amount-paid custom-form-item has-suffix" rules={validateSchema.hours_per_week}>
                            <InputNumber defaultValue={amountPaidSelected === 'hours_per_week' ? bidFound?.weekly_limit : 40} addonAfter={amountPaidSelected === 'hours_per_week' ? 'Hours' : post?.budget?.currency?.name} value={40} className='form-input' />
                        </Form.Item>
                        <div className="assign-project statistics">
                            <span className='assign-project-title'>Hourly Rate<span className="tooltip-icon">i</span></span>
                            <span className="assign-project-description">{`${post?.budget?.currency?.short_name}${bidFound?.hourly_rate} ${post?.budget?.currency?.name}`}</span>
                        </div>
                        <div className="assign-project statistics">
                            <span className='assign-project-title'>{amountPaidSelected === 'hours_per_week' ? 'Maximium Weekly Bill' : 'Hours per week'}<span className="tooltip-icon">i</span></span>
                            <span className="assign-project-description">
                                {amountPaidSelected === 'hours_per_week' ? `${post?.budget?.currency?.short_name}${valueAfterChange?.hourly_rate * valueAfterChange?.weekly_limit} ${post?.budget?.currency?.name}` : `${Math.round((valueAfterChange?.max_weekly_bill ?? 40) / valueAfterChange?.hourly_rate * 100) / 100} hours`}
                            </span>
                        </div>
                        <div className="assign-project assign-project-description">
                            You will NOT be charged right now, a payment method needs to be set up so that you are prepared to pay your freelancer when they deliver their work.
                        </div>
                    </div> : <div className="project-paid-type fixed-paid">
                        <div className="fixed-paid-flex">
                            <Form.Item name="bidding_amount" label="Project Budget" className="fixed-paid-flex  custom-form-item" rules={validateSchema.budget}>
                                <Input placeholder='Project Budget' className='form-input' type="number" prefix="$" />
                            </Form.Item>
                            <Form.Item name="delivered_time" label="This project is expected to be delivered in" className="fixed-paid-flex  custom-form-item" rules={validateSchema.delivered_time}>
                                <Input placeholder='This project is expected to be delivered in' className='form-input' type="number" suffix="Days" />
                            </Form.Item>
                        </div>
                        <div className="fixed-paid-summary">
                            <div className="total-amount">Total: {post?.budget?.currency?.short_name}{bidFound?.bidding_amount} {post?.budget?.currency?.name}</div>
                        </div>
                    </div>}
                    <div className="assign-project-footer">
                        <Button className="paid" form="assign_project" key="submit" htmlType="submit">Award</Button>
                    </div>
                </Form>
            </Modal>
        </>
    )
}
