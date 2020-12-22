import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="header-login-signup">
            <div className="header-limiter">
                <h1>
                    <a href="/">Coding<span>Cafe</span></a>
                </h1>
                <nav>
                    <Link to='/'>Home</Link>
                    <Link to="/">About App</Link>
                    <Link to='/'>Contact Us</Link>
                </nav>
                <ul>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Sign Up</Link></li>
                </ul>
            </div>
        </header>
    )
}

export default Header;