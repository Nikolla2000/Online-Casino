import React from 'react';

const Footer = () => {
    return (
        <div className="footer-wrapper">
            <div className="technologies-used-section">
                <h3>This Website was made with the invaluable  help of</h3>
                <div className="technologies-icons"></div>
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