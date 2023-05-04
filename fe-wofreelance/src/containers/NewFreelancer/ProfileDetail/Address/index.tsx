import { useRef, useState } from 'react'
import { Form } from 'antd'
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";

import { located } from '../../../../assets'

import './style.scss'
const Address = () => {
    const inputRef:any = useRef();
    const [isSearchAutocomplete, setIsSearchAutocomplete] = useState(false)

    const handlePlaceChanged = () => { 
        const [ place ] = inputRef.current!.getPlaces();
        if(place) { 
            console.log(place.formatted_address)
            console.log(place.geometry.location.lat())
            console.log(place.geometry.location.lng())
        } 
    }

    return (
        <div className="located">
            <div className="located-logo">
                <img src={located} alt="" />
            </div>
            <div className="located-header">
                <div className="introduction">
                    Where are you located?
                </div>
                <div className="description">
                    Please use your real address as this will be used for identity verification. Only your city and country will be shown publicly.
                </div>
                {isSearchAutocomplete ?
                    <LoadScript googleMapsApiKey={'AIzaSyAgGMVDatT24pBHw-wGFHumgjJvhtxuZXk'} libraries={["places"]}>
                        <StandaloneSearchBox
                            onLoad={ref => inputRef.current = ref}
                            onPlacesChanged={handlePlaceChanged}
                        >
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Location"
                            />
                        </StandaloneSearchBox>
                    </LoadScript> : <Form.Item name="title" className="custom-form-item"
                    // rules={validateSchema.title}
                    >
                        <input placeholder="Enter your address" className='form-input' id='searchTextField' autoComplete="on" />
                    </Form.Item>
                }

            </div>
        </div>
    )
}

export default Address