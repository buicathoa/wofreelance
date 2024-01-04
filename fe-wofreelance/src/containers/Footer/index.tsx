import { Link } from 'react-router-dom'

import './style.scss'
const Footer = () => {
    return (
        <footer className="footer-wrapper">
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-top-item">
                        <div className="quantity">67,109,317</div>
                        <div className="content">Registered users</div>
                    </div>
                    <div className="footer-top-item">
                        <div className="quantity">22,743,8967</div>
                        <div className="content">Total Job Posted</div>
                    </div>
                    <div className="footer-top-item logo">
                        <img src="https://www.f-cdn.com/assets/img/apple-app-store-transparent-236e0741.svg" alt="" />
                        <img src="https://www.f-cdn.com/assets/img/google-play-store-transparent-4a34ba3a.svg" alt="" />
                    </div>
                </div>
                <div className="footer-mid">
                    <div className="footer-mid-item">
                        <div className="title">Network</div>
                        <ul>
                            <li><Link to="#">Browse Categories</Link></li>
                            <li><Link to="#">Browse Projects</Link></li>
                            <li><Link to="#">Browse Contests</Link></li>
                            <li><Link to="#">Browse Freelancers</Link></li>
                        </ul>
                    </div>
                    <div className="footer-mid-item">
                        <div className="title">About</div>
                        <ul>
                            <li><Link to="#">About Works</Link></li>
                            <li><Link to="#">How it works</Link></li>
                            <li><Link to="#">Team</Link></li>
                            <li><Link to="#">Securities</Link></li>
                        </ul>
                    </div>
                    <div className="footer-mid-item">
                        <div className="title">Press</div>
                        <ul>
                            <li><Link to="#">In the News</Link></li>
                            <li><Link to="#">Press Releases</Link></li>
                            <li><Link to="#">Awards</Link></li>
                            <li><Link to="#">Timeline</Link></li>
                        </ul>
                    </div>
                    <div className="footer-mid-item">
                        <div className="title">Get In Touch</div>
                        <ul>
                            <li><Link to="#">Get Supports</Link></li>
                            <li><Link to="#">Careers</Link></li>
                            <li><Link to="#">Community</Link></li>
                            <li><Link to="#">Contact us</Link></li>
                        </ul>
                    </div>
                    <div className="footer-mid-item">
                        <div className="title">Freelancerh</div>
                        <ul>
                            <li><Link to="#">Privacy Policy</Link></li>
                            <li><Link to="#">Terms and Conditions</Link></li>
                            <li><Link to="#">Code of Conduct</Link></li>
                            <li className="nlink">Freelancer ® is a registered Trademark of Freelancer Technology Pty Limited (ACN 142 189 759)</li>
                            <li className="nlink">Copyright © 2023 Freelancer Technology Pty Limited (ACN 142 189 759)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer