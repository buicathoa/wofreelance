import { useEffect, useState } from 'react'
import { Col, Modal, Rate, Row } from 'antd'
import { saveAs } from "file-saver";

import { ModalPortfolioInterface, SkillsetInterface, UserInterface } from 'interface'
import { validImg } from '../../../constants'
import { useSelector } from 'react-redux'
import { RootState } from 'reducers/rootReducer'
import { renderFileIcon } from 'utils/helper'

import './style.scss'
const ModalPortfolio = ({ portfolioAction, setPortfolioAction }: ModalPortfolioInterface) => {
    const [portfolioFileImg, setPortfolioFileImg] = useState<Array<string>>([])
    const [portfolioFile, setPortfolioFile] = useState<Array<string>>([])

    const user_info: UserInterface = useSelector((state: RootState) => state.user.user_info)

    useEffect(() => {
        const portfolioImg: Array<string> = []
        const portfolioFile: Array<string> = []
        if (portfolioAction?.selected?.file.split(',').length > 0) {
            portfolioAction?.selected?.file?.split(',').map((file: string) => {
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
    }, [portfolioAction?.selected])

    const onConfirmCancel = () => {
        const portfolioActionClone = {...portfolioAction}
        portfolioActionClone['visible'] = false
        setPortfolioAction(portfolioActionClone)
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
                visible={portfolioAction?.visible}
                onCancel={() => onConfirmCancel()}
            >
                <div className="modal-portfolio-content-container">
                    <Row>
                        <Col lg={16} sm={24} xs={24}>
                            <div className="portfolio-title">{portfolioAction?.selected?.title}</div>
                            <div className={`portfolio-context ${portfolioAction?.selected?.portfolio_type === 'code' && 'code'}`}>{portfolioAction?.selected?.summary}</div>
                            <div className="list-images">
                                {portfolioFileImg.length > 0 && portfolioFileImg.map((file, index) => {
                                    return (
                                        <img src={file} key={index} alt=""/>
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
                                            <img className="file-icon" src={renderFileIcon(filePath!)} alt=""/>
                                            <div className="file-content" onClick={() => onDownload(fileToDownload)}>{fileContext}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Col>
                        <Col lg={8} sm={24} xs={24}>
                            <div className="portfolio-modal-right-header">
                                <div className="avatar">
                                    <img src={user_info.avatar_cropped} alt=""/>
                                    <span></span>
                                </div>
                                <div className="general-info">
                                    <div className="flag"><img alt="" src={`http://flags.fmcdn.net/data/flags/mini/${(user_info?.country?.country_name)?.toLowerCase()}.png`} /></div>
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
                                <div className="desc">{portfolioAction?.selected?.description}</div>
                            </div>
                            <div className="portfolio-modal-skills">
                                <div className="title">Skills</div>
                                <div className="skills">
                                    <div className="list-skills">
                                        {portfolioAction?.selected?.skills?.length > 0 && portfolioAction?.selected?.skills?.map((skill: SkillsetInterface, index: number) => {
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

export default ModalPortfolio
