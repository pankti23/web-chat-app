import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Home.css';

import Header from './../../Components/Header';
import FooterPage from './../../Components/Footer';

const HomePage = (props) => {
    
    return(
        <div>
            <Header></Header>
            <div className="splash-container">
                <div className="splash">
                    <h1 className="splash-head">WEB CHAT APP</h1>
                    <p className="splash-subhead">
                        Lets talk with our loved ones
                    </p>

                    <div id="custom-button-wrapper">
                        <Link to="/login" className="my-super-cool-btn">
                        <div className="dots-container">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                        <span className="buttoncooltext">Get Started</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="content-wrapper">
                <div className="content">
                    <h2 className="content-head is-center">Features of WebChat Application</h2>
                </div>
                <FooterPage></FooterPage>
            </div>
        </div>
    )
    
}

export default HomePage;