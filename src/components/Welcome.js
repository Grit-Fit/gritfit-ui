// src/components/WelcomePage.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';
import './Welcome.css'; 


const WelcomePage = () => {
    const { logout } = useAuth();
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (e) =>{
        setName(e.target.value);
    };
        const handleLogout = () => {
        logout();
        navigate('/');
    };
    return (
        <div className="container">
            <img src={logo} alt="Logo" className="logo" />
            <h1 className="welcome">Welcome!</h1>
            <p className="text">We are as excited as you are!</p>
            <p className="text">Lets start by knowing a bit about you</p>
            <h3 className="nameprompt" >What is your name?</h3>
            <form onSubmit={handleSubmit}>
                 <input
                    type="text"
                    value={name}
                    className="inputbx"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                />
                <button type="submit" className="btn" >Submit</button>
                <button onClick={handleLogout} className="btn">Logout</button>
            </form>
        </div>
    );
};

export default WelcomePage;
