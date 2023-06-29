/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
import { useEffect, useState } from 'react'
import { Col, Modal, Rate, Row } from 'antd'
import { saveAs } from "file-saver";

import { ModalPortfolioInterface, SkillsetInterface, UserInterface } from '../../../interface'
import { validImg } from '../../../constants'
import { useSelector } from 'react-redux'
import { RootState } from '../../../reducers/rootReducer'
import { renderFileIcon } from '../../../utils/helper'

import './style.scss'
export const ModalPortfolio = ({ visible, setVisible, portfolioItem }: ModalPortfolioInterface) => {

    const [portfolioFileImg, setPortfolioFileImg] = useState<Array<string>>([])
    const [portfolioFile, setPortfolioFile] = useState<Array<string>>([])

    const user_info: UserInterface = useSelector((state: RootState) => state.user.user_info)
    const user_skills: Array<SkillsetInterface> = useSelector((state: RootState) => state.category.user_skills)

    useEffect(() => {
        const portfolioImg: Array<string> = []
        const portfolioFile: Array<string> = []
        if (portfolioItem?.file!.split(',').length > 0) {
            portfolioItem?.file?.split(',').map((file: string) => {
                const filePath: string = file.split('.').at(-1)!
                const isImg = validImg.includes(filePath)
                if (isImg) {
                    portfolioImg.push(file)
                } else {
                    portfolioFile.push(file)
                }
            })
        }
        setPortfolioFile(portfolioFile)
        setPortfolioFileImg(portfolioImg)
    }, [portfolioItem])

    const onConfirmCancel = () => {
        setVisible(false)
    }

    const onDownload = async (link: string) => {
        const downloadResult = await fetch(
            link
        );
        const blob = await downloadResult.blob();
        saveAs(blob, link.split('/').at(-1));
    }

    return (
        <>
            <Modal
                className="modal-portfolio-container"
                visible={visible}
                onCancel={() => onConfirmCancel()}
            >
                <div className="modal-portfolio-content-container">
                    <Row>
                        <Col lg={16} sm={24} xs={24}>
                            <div className="portfolio-title">{portfolioItem?.title}</div>
                            <div className={`portfolio-context ${portfolioItem?.portfolio_type === 'code' && 'code'}`}>{portfolioItem?.summary}</div>
                            <div className="list-images">
                                {portfolioFileImg.length > 0 && portfolioFileImg.map((file, index) => {
                                    return (
                                        <img src={file} key={index} />
                                    )
                                })}
                            </div>
                            <div className="list-files">
                                {portfolioFile.length > 0 && portfolioFile.map((file, index) => {
                                    const fileToDownload = file.replace('/upload', '/upload/fl_attachment')
                                    const filePath = file.split('.').at(-1)
                                    const fileContext = file.split('/').at(-1)
                                    return (
                                        <div className="file-item" key={index}>
                                            <img className="file-icon" src={renderFileIcon(filePath!)} />
                                            <div className="file-content" onClick={() => onDownload(fileToDownload)}>{fileContext}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Col>
                        <Col lg={8} sm={24} xs={24}>
                            <div className="portfolio-modal-right-header">
                                <div className="avatar">
                                    <img src={user_info.avatar_cropped} />
                                    <span></span>
                                </div>
                                <div className="general-info">
                                    <div className="flag"><img src={`http://flags.fmcdn.net/data/flags/mini/${(user_info?.country?.country_name)?.toLowerCase()}.png`} /></div>
                                    <div className="name">{user_info?.first_name} {user_info?.last_name}</div>
                                </div>
                            </div>
                            <div className="portfolio-modal-reviews">
                                <Rate defaultValue={0} style={{ fontSize: 14 }} />
                                <span className="rating-budget-number"> 0.0 (0 reviews)</span>
                            </div>
                            <div className="portfolio-modal-paid">
                                $7 USD / Hour
                            </div>
                            <div className="portfolio-modal-description">
                                <div className="title">About the project</div>
                                <div className="desc">{portfolioItem?.description}</div>
                            </div>
                            <div className="portfolio-modal-skills">
                                <div className="title">Skills</div>
                                <div className="skills">
                                    <div className="list-skills">
                                        {portfolioItem?.skills?.length > 0 && portfolioItem?.skills?.map((skill, index) => {
                                            return (
                                                <div className="skill-item" key={index}>{skill.name}</div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Modal>
        </>
    )
}
