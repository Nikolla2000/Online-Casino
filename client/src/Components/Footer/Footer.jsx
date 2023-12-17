import React from 'react';
import "./FooterStyles.scss";

const Footer = () => {
    return (
        <div className="footer-wrapper">
            <div className="technologies-used-section">
                <h3>This Website was made by me - <span className='text-red-500'>Nikola Uzunov</span>, with the help of:</h3>
                <div className="technologies-icons">
                    <div className="icon">
                        <img src="../../src/assets/images/technologies-icons/html-icon.svg" alt="technology-icon" />
                        <p><span>HTML</span></p>
                    </div>
                    <div className="icon">
                        <img src="../../src/assets/images/technologies-icons/javascript-icon.svg" alt="technology-icon" />
                        <p><span>Javascript</span></p>
                    </div>
                    <div className="icon">
                        <img src="../../src/assets/images/technologies-icons/css-icon.svg" alt="technology-icon" />
                        <p><span>CSS</span></p>
                    </div>
                </div>
                <div className="technologies-icons row-2">
                    <div className="icon">
                        <img src="../../src/assets/images/technologies-icons/react-icon.svg" alt="technology-icon" />
                        <p><span>ReactJS</span></p>
                    </div>
                    <div className="icon">
                        <img src="../../src/assets/images/technologies-icons/nodejs-icon.svg" alt="technology-icon" />
                        <p><span>NodeJS</span></p>
                    </div>
                    <div className="icon">
                        <img src="../../src/assets/images/technologies-icons/sass-icon.svg" alt="technology-icon" />
                        <p><span>SASS</span></p>
                    </div>
                    <div className="icon">
                        <img src="../../src/assets/images/technologies-icons/mongodb-icon.svg" alt="technology-icon" />
                        <p><span>MongoDB</span></p>
                    </div>
                    <div className="icon">
                        <img src="../../src/assets/images/technologies-icons/redux-icon.svg" alt="technology-icon" />
                        <p><span>Redux</span></p>
                    </div>
                </div>
            </div>
            <div className="social-medias-section">
                <h3>Play Responsibly!</h3>
                <div className="social-media-icons">
                    React, NodeJs, HTML/SASS, JavaScript, ExpressJS, 
                    MongoDb, Tailwind, Redux
                </div>
            </div>
        </div>
    )
}

export default Footer