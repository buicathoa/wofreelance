import { DatePicker, Form, Input, InputNumber, Select } from 'antd'
import { useSelector } from 'react-redux'

import { international_located } from '../../../../assets'

import { RootState } from '../../../../reducers/rootReducer'
import { AddressGeneratedInterface, CountryInterface, LanguagesInterface, ResponseFormatItem } from '../../../../interface'
import { removeAccentsToLower } from '../../../../utils/helper'

import './style.scss'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { LocationActions } from '../../../../reducers/listReducer/locationReducer'
import { UserActions } from '../../../../reducers/listReducer/userReducer'
const Located = () => {
    const { Option } = Select


    const countries: Array<CountryInterface> = useSelector((state: RootState) => state.location.countries)

    const validateSchema = {
        country_id: [
            {
                required: true
            }
        ],
        zip_code: [
            {
                required: true
            }
        ],
        province: [
            {
                required: true
            }
        ],
        address_detail: [
            {
                required: true
            }
        ]
    }


    return (
        <div className="located">
            <div className="located-logo">
                <img src={international_located} alt="" />
            </div>
            <div className="located-header">
                <div className="introduction">
                    Where are you located?
                </div>
                <div className="description">
                    Please use your real address as this will be used for identity verification. Only your city and country will be shown publicly.
                </div>
                <Form.Item name="country_id" className="custom-form-item" rules={validateSchema.country_id}>
                    <Select
                        // mode="multiple"
                        className="form-select multiple textarea"
                        allowClear
                        virtual={false}
                        placeholder={'Select your languages'}
                        filterOption={(input, option: any) =>
                            removeAccentsToLower(option.children).indexOf(removeAccentsToLower(input)) >= 0
                        }
                        filterSort={(optionA, optionB) =>
                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                        }
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        disabled={true}
                    >
                        {countries.length > 0 && countries.map((country, index) => {
                            return (
                                <Select.Option key={index} value={country.id}>{country.country_official_name}</Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item name="zip_code" label="Zip code" className="custom-form-item" rules={validateSchema.zip_code}>
                    <Input type="number" min={0} placeholder='Which is your zip code?' className='form-input' />
                </Form.Item>
                <Form.Item name="province" label="City" className="custom-form-item" rules={validateSchema.province}>
                    <Input disabled placeholder='Which city do you live?' className='form-input' />
                </Form.Item>
                <Form.Item name="address_detail" label="Address detail" className="custom-form-item" rules={validateSchema.address_detail}>
                    <Input placeholder='What is your address detail?' className='form-input' />
                </Form.Item>
            </div>
        </div>
    )
}

export default Located