import React from 'react'
import ClassNames from 'classnames'
import './style.scss'
import { useAppSelector } from '../../reducers/hook'

const Loading = () => {
    const loading = useAppSelector((state) => state.app.isLoading)
    return (
        <div className={ClassNames('loading-content', !loading && 'hiden')}>
            <div className="wrap">
                <div className="loading">
                    <div className="bounceball"></div>
                    <div className="text">Interaction Center</div>
                </div>
            </div>
        </div>
    )
}

export default Loading
