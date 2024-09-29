// src/components/WelcomePage.js
import React, { useState } from 'react';

const WelcomePage = () => {
    const [name, setName] = useState('');
    const handleSubmit = (e) =>{
        setName(e.target.value);
    };
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Welcome!</h1>
            <p>We are as excited as you are!</p>
            <p>Lets start by knowing a bit about you</p>
            <h3>What is your name?</h3>
            <form onSubmit={handleSubmit}>
                 <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default WelcomePage;
