import React from 'react';
import './Footer.css';


function FooterPage() {

    const Copyright = () => {
        return (
            <h2 variant="body2" color="textSecondary" align="center">
            {'Copyright @'}
            {'Coding Cafe'}
            {new Date().getFullYear()}
            {'.'}
        </h2>
        )
    }

    return (
        <footer>
            <div className="footer 1-box is-center">
                {Copyright()}
            </div>
        </footer>
    )
}

export default FooterPage;