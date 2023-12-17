import React from 'react';
import "./FooterStyles.scss";

const Footer = () => {
    return (
        <div className="footer-wrapper">
            <div className="technologies-used-section">
                <h3>This Website was made with the invaluable  help of</h3>
                <div className="technologies-icons">
                    <img src="../../src/assets/images/technologies-icons/react-icon.svg" alt="technology-icon" />
                    <img src="../../src/assets/images/technologies-icons/nodejs-icon.svg" alt="technology-icon" />
                    <img src="../../src/assets/images/technologies-icons/html-icon.svg" alt="technology-icon" />
                    <img src="../../src/assets/images/technologies-icons/css-icon.svg" alt="technology-icon" />
                    <img src="../../src/assets/images/technologies-icons/javascript-icon.svg" alt="technology-icon" />
                    <img src="../../src/assets/images/technologies-icons/mongodb-icon.svg" alt="technology-icon" />
                    <img src="../../src/assets/images/technologies-icons/redux-icon.svg" alt="technology-icon" />
                    <img src="../../src/assets/images/technologies-icons/sass-icon.svg" alt="technology-icon" />
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