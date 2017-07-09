import React from 'react';

import logo from './logo.svg';

import './Header.css';

function Header() {
    return (
        <div className="Header">
            <img src={logo} className="Header-logo" alt="logo" />
            <h2>Welcome to React</h2>
        </div>
    );
}

export default Header;