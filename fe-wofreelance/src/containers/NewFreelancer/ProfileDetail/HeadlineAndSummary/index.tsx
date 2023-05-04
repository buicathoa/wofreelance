import { Form, Input } from 'antd'
import { headline_summary } from '../../../../assets'

import './style.scss'

const HeadlineAndSummary = () => {

  const validateSchema = {
    title: [
      {
        required: true
      }
    ],
    describe: [
      {
        required: true
      }
    ]
  }

  return (
    <div className="headline-summary">
      <div className="headline-summary-logo">
        <img src={headline_summary} alt="" />
      </div>
      <div className="headline-summary-header">
        <div className="introduction">
          Tell us a bit about yourself
        </div>
        <div className="description">
          Fill out your profile for clients to better understand your services.
        </div>
      </div>
      <div className="headline-summary-form">
        <div className="headline-summary-form-item">
          <span className="title">What do you do?</span>
          <Form.Item name="title" label="Write a one line description about yourself." className="custom-form-item" rules={validateSchema.title}>
            <Input placeholder='Write a one line description about yourself.' className='form-input' />
          </Form.Item>
        </div>
        <div className="headline-summary-form-item">
          <Form.Item name="describe" label="Describe yourself" className="custom-form-item title" rules={validateSchema.describe}>
            <Input.TextArea rows={4} placeholder='Describe yourself' className='form-textarea' />
          </Form.Item>
        </div>
      </div>
    </div>
  )
}

export default HeadlineAndSummary
