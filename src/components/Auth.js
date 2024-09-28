// src/components/Auth.js
import React, { useState } from 'react';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
     const [email, setEmail] = useState('');
     const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle authentication logic here
        console.log(email, password, isLogin ? 'Login' : 'Signup');
    };

    const handleLoginClick = () => {
        setIsLogin(true);
        setIsSignup(false);
    };

    const handleSignupClick = () => {
        setIsLogin(false);
        setIsSignup(true);
    };


    return (
        <div>
            {!isLogin && !isSignup ? (
                <div>
                    <h2>Welcome!</h2>
                    <button onClick={handleLoginClick}>Sign In</button>
                    <button onClick={handleSignupClick}>Create Account</button>
                </div>
            ) : isLogin ? (
                <div>
                    <h2>Sign In</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Email*</label>
                            <input type="email" 
                            value={email}
                        onChange={(e) => setEmail(e.target.value)}
                            required />
                        </div>
                        <div>
                            <label>Password*</label>
                            <input type="password" 
                            value={password}
                        onChange={(e) => setPassword(e.target.value)}
                            required />
                        </div>
                        <button type="submit">Sign In</button>
                    </form>
                    <button onClick={() => setIsLogin(false)}>Back</button>
                </div>
            ) : (
                <div>
                    <h2>Create Account</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Username*</label>
                            <input type="username" 
                            value={username}
                        onChange={(e) => setUsername(e.target.value)}
                            required />
                        </div>
                        <div>
                            <label>Email*</label>
                            <input type="email" 
                            value={email}
                        onChange={(e) => setEmail(e.target.value)}
                            required />
                        </div>
                        <div>
                            <label>Create Password*</label>
                            <input type="password" 
                            value={password}
                        onChange={(e) => setPassword(e.target.value)}
                            required />
                        </div>
                        <button type="submit">Create Account</button>
                    </form>
                    <button onClick={() => {setIsLogin(false); setIsSignup(false); }}>Back</button>
                </div>
            )}
        </div>
    );
};

export default Auth;
