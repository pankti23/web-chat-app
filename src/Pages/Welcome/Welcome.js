import React from 'react';
import './Welcome.css';

const Welcome = (props) => { 
    const {
        currentUserPhoto,
        currentUserName
    }=props

    return (
        <div className="viewWelcomeBoard">
            <img 
                className="avatarWelcome"
                src={currentUserPhoto}
                alt=""
            />
            <span className="textTitleWelcome">{`Welcome, ${currentUserName}`}</span>
            <span className="textDesciptionWelcome">
                Let's connet the world
            </span>
        </div>
    )

}

export default Welcome;