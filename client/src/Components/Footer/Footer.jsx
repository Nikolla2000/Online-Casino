import React from 'react';
import "./FooterStyles.scss";

const Footer = () => {
    return (
        <div className="footer-wrapper">
            <div className="technologies-used-section">
                <h3>This Website was made from scratch by me - <span className='text-red-500'>Nikola Uzunov</span>, with the help of:</h3>
                <h5><span>Important</span> - The games are purely simulative and the money is not real !</h5>
                <div className="technologies-icons">
                    <div className="icon">
                        <img src="/images/technologies-icons/html-icon.svg" alt="technology-icon" />
                        <p><span>HTML</span></p>
                    </div>
                    <div className="icon">
                        <img src="/images/technologies-icons/javascript-icon.svg" alt="technology-icon" />
                        <p><span>Javascript</span></p>
                    </div>
                    <div className="icon">
                        <img src="/images/technologies-icons/css-icon.svg" alt="technology-icon" />
                        <p><span>CSS</span></p>
                    </div>
                </div>
                <div className="technologies-icons row-2">
                    <div className="icon">
                        <img src="/images/technologies-icons/react-icon.svg" alt="technology-icon" />
                        <p><span>ReactJS</span></p>
                    </div>
                    <div className="icon">
                        <img src="/images/technologies-icons/nodejs-icon.svg" alt="technology-icon" />
                        <p><span>NodeJS</span></p>
                    </div>
                    <div className="icon">
                        <img src="/images/technologies-icons/sass-icon.svg" alt="technology-icon" />
                        <p><span>SASS</span></p>
                    </div>
                    <div className="icon">
                        <img src="/images/technologies-icons/mongodb-icon.svg" alt="technology-icon" />
                        <p><span>MongoDB</span></p>
                    </div>
                    <div className="icon">
                        <img src="/images/technologies-icons/redux-icon.svg" alt="technology-icon" />
                        <p><span>Redux</span></p>
                    </div>
                </div>
            </div>
            <div className="line"></div>
            <div className="social-medias-section">
                <div className="social-media-icons">
                    <div className="social-media-icon">
                        <a href='https://www.facebook.com/nikola.uzunov.18/' target='_blank' >
                            <img src="/images/social-media-icons/facebook-svgrepo-com.svg" alt="social-media-icon" />
                        </a>
                    </div>
                    <div className="social-media-icon">
                        <a href='https://instagram.com/nikola.uzunov19/' target='_blank'>
                            <img src="/images/social-media-icons/instagram-svgrepo-com.svg" alt="social-media-icon" />
                        </a>
                    </div>
                    <div className="social-media-icon">
                        <a href='https://nikolauzunov.netlify.app' target='_blank'>
                            <img src="/images/social-media-icons/letter-n-svgrepo-com.svg" alt="social-media-icon" />
                        </a>
                    </div>
                    <div className="social-media-icon">
                        <a href='https://github.com/Nikolla2000' target='_blank'>
                            <img src="/images/social-media-icons/github-svgrepo-com.svg" alt="social-media-icon" />
                        </a>
                    </div>
                    <div className="social-media-icon">
                        <a href='https://www.linkedin.com/in/nikola-uzunov/' target='_blank'>
                            <img src="/images/social-media-icons/linkedin-svgrepo-com.svg" alt="social-media-icon" />
                        </a>
                    </div>
                </div>
                <h3>Play Responsibly!</h3>
            </div>
        </div>
    )
}

export default Footer