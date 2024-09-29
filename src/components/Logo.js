// src/components/LogoPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';
import './Logo.css';

const LogoPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/welcome');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
            <div className="tagline">A classy tagline ;)</div>
        </div>
    );
};

export default LogoPage;