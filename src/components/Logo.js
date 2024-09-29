// src/components/LogoPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';

const LogoPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/welcome');
        }, 5000);

        return () => clearTimeout(timer); // Reset the timer
    }, [navigate]);

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <img src={logo} alt="Logo" style={{ width: '200px', height: 'auto' }} />
        </div>
    );
};

export default LogoPage;
