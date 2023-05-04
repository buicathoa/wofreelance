/* eslint-disable no-fallthrough */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Progress } from 'antd'
import moment from 'moment'
import axios from 'axios'

import PhotoandName from './PhotoandName'
import HeadlineAndSummary from './HeadlineAndSummary'
import LanguagesAndBirthday from './LanguagesAndBirthday'
import EmailVerification from '../EmailVerification'

import { freelancer_logo } from '../../../assets'

import { ResponseFormatItem, UserInterface } from '../../../interface'

import { UserActions } from '../../../reducers/userReducer'
import { RootState } from '../../../reducers/rootReducer'

import { BASE_URL } from '../../../constants'
import './style.scss'

const ProfileDetail = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const [form] = Form.useForm()
  const [formValues, setformValues] = useState({})
  const [fileUploaded, setFileUploaded] = useState<any>()
  const [percent, setPercent] = useState(30)

  const getUserInfo = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(UserActions.getUserInfo({ param, resolve, reject }));
    });
  };

  const updateUser = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(UserActions.updateUser({ param, resolve, reject }));
    });
  };

  const getAllLanguages = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(UserActions.getAllLanguages({ param, resolve, reject }));
    });
  };

  const user: UserInterface = useSelector((state: RootState) => state.user.user)

  const validateMessages = {
    required: 'This field is required'
  }


  useEffect(() => {
    form.resetFields()
  }, [formValues])

  useEffect(() => {
    if (user) {
      const endpoint = location.pathname?.split('/').at(-1)
      if (endpoint === 'languages-birthday') {
        getAllLanguages({})
      }
      setformValues({
        ...user, birthdate: user.birthdate ? moment(user.birthdate) : moment(), languages:
          user?.languages?.map((lang) => {
            return lang.id
          })
      })
      setFileUploaded(user?.avatar)
    }
  }, [user])

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      const endpoint = location.pathname?.split('/').at(-1)
      switch (endpoint) {
        case 'photo-name':
          setPercent(40)
          break
        case 'headline-summary':
          setPercent(60)
          break
        case 'languages-birthday':
          setPercent(80)
          break
        case 'email-verification':
          setPercent(100)
          break
      }
      getUserInfo({})
    } else {
      navigate("/signin")
    }
  }, [location])


  const onSubmitForm = (values: any) => {
    const formData = new FormData()
    Object.keys(values).map((key) => {
      formData.append(key, values[key])
    })
    switch (percent) {
      case 40:
        formData.append('avatar', fileUploaded)
        updateUser(formData).then((res) => {
          if (res?.data) {
            setPercent(40)
            navigate('/new-freelancer/profile-detail/headline-summary')
          }
        })
        break

      case 60:
        updateUser(formData).then((res) => {
          if (res?.data) {
            setPercent(50)
            navigate('/new-freelancer/profile-detail/languages-birthday')
          }
        })
        break
      case 80:
        updateUser(formData).then((res: any) => {
          if (!res?.data?.is_verified_account) {
            axios.get(`${BASE_URL}/user/email-verification?username=${res?.data?.username}&first_name=${res?.data?.first_name}`)
          }
          setPercent(60)
          navigate('/new-freelancer/email-verification')
        })
    }
  }

  const handleMoveBackStep = () => {
    switch (percent) {
      case 40:
        navigate('/new-freelancer/link-accounts')
        break;
      case 60:
        navigate('/new-freelancer/profile-detail/photo-name')
        setPercent(30)
        break;
      case 80:
        navigate('/new-freelancer/profile-detail/headline-summary')
        setPercent(40)
        break;
      case 100:
        navigate('/new-freelancer/profile-detail/languages-birthday')
        setPercent(50)
        break;
    }
  }



  return (
    <div className="new-freelancer-wrapper">
      <div className="new-freelancer-container">
        <div className="new-freelancer-header">
          <img src={freelancer_logo} alt="" />
          <span>Profile details</span>
        </div>
        <div className="new-freelancer-progress">
          <Progress
            percent={percent}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        </div>
        <div className="new-freelancer-content profile-detail">
          <div className="profile-detail-wrapper">
            <Form
              id="profile_form_new_freelancer"
              form={form}
              layout="vertical"
              name="profile_form_new_freelancer"
              onFinish={onSubmitForm}
              initialValues={formValues}
              scrollToFirstError
              validateMessages={validateMessages}
              requiredMark={false}
            >
              {percent === 40 &&
                <PhotoandName fileUploaded={fileUploaded} setFileUploaded={setFileUploaded}
                  formValues={formValues} setformValues={setformValues}
                />}
              {percent === 60 && <HeadlineAndSummary />}
              {percent === 80 && <LanguagesAndBirthday />}
              {percent === 100 && <EmailVerification />}
            </Form>

          </div>
        </div>
      </div>
      <div className={`list-button link-accounts`}>
        <Button onClick={handleMoveBackStep} className="back">Back</Button>
        <Button className="next" form="profile_form_new_freelancer" key="submit" htmlType="submit">Next</Button>
      </div>
    </div>
  )
}

export default ProfileDetail
