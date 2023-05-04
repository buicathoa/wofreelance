import { DatePicker, Form, Select } from 'antd'
import { useSelector } from 'react-redux'

import { language_birthday } from '../../../../assets'

import { RootState } from '../../../../reducers/rootReducer'
import { LanguagesInterface } from '../../../../interface'
import { removeAccentsToLower } from '../../../../utils/helper'

import './style.scss'
const LanguagesAndBirthday = () => {
    const { Option } = Select

    const languages: LanguagesInterface[] = useSelector((state: RootState) => state.user.languages)
    console.log('languages', languages)
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
        <div className="language_birthday">
            <div className="language_birthday-logo">
                <img src={language_birthday} alt="" />
            </div>
            <div className="language_birthday-header">
                <div className="introduction">
                    What languages do you speak?
                </div>
                <div className="description">
                    We will use this to help match you with employers who are fluent in these languages.
                </div>
                <Form.Item name="languages" className="custom-form-item" rules={validateSchema.title}>
                    <Select
                        mode="multiple"
                        className="form-select multiple textarea"
                        allowClear
                        virtual={false}
                        placeholder={'Select your languages'}
                        filterOption={(input, option:any) =>
                            removeAccentsToLower(option.children).indexOf(removeAccentsToLower(input)) >= 0
                        }
                        filterSort={(optionA, optionB) =>
                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                        }
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    >
                        {languages.length > 0 && languages.map((lang, index) => {
                            return (
                                <Option key={index} value={lang.id}>{lang.english_name}</Option>
                            )
                        })}
                    </Select>
                </Form.Item>
            </div>
            <div className="language_birthday-form">
                <div className="language_birthday-form-item">
                    <span className="title">When were you born?</span>
                    <Form.Item name="birthdate" label="You need to be at least 16 years old to use the website. This information will be used for verification and will be kept confidential." className="custom-form-item" rules={validateSchema.title}>
                        <DatePicker
                            className="form-date"
                            format="DD/MM/YYYY"
                        />
                    </Form.Item>
                </div>
            </div>
        </div>
    )
}

export default LanguagesAndBirthday