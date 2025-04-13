import { Outlet, Link } from "react-router-dom";
import React from 'react';
import logo from '../assets/logo.png';

const SideNav = () => {
    return (
        <div className="sideNav">
            <div className="logo">
                <img src={logo} alt="Logo" />
            </div>
            <div className='menu'>
                <ul>
                    <li className="menu-item" key="home-button">
                        <Link style={{ color: "white" }} to="/">
                            Home
                        </Link>
                    </li>
                    <li className="menu-item">
                        <a href="#drivers">Drivers</a>
                    </li>
                    <li className="menu-item">
                        <a href="#constructors">Constructors</a>
                    </li>
                    <li className="menu-item">
                        <a href="#teams">Teams</a>
                    </li>
                    <li className="menu-item">
                        <a href="#schedule">Schedule</a>
                    </li>
                    <li className="menu-item">
                        <a href="#results">Results</a>
                    </li>
                    <li className="menu-item">
                        <a href="#standings">Standings</a>
                    </li>
                    <li className="menu-item">
                        <a href="#news">News</a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default SideNav;