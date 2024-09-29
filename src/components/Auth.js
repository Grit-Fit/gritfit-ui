// src/components/Auth.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'

const Auth = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const isLogin = location.pathname === '/login';
    const isSignup = location.pathname === '/signup';

    const handleSubmitSignUp = async(e) => {
        e.preventDefault();
        // Handle authentication logic here
        console.log(email, password, isLogin ? 'Login' : 'Signup');
        try {
            const response = await axios.post('http://localhost:5000/api/createAccount', {
                username,
                email,
                password,
            });
            setMessage(response.data.message); // Display success message
            console.log(response.data); // Log the response
            navigate('/logo');
        } catch (error) {
            console.error(error);
            setMessage(error.response ? error.response.data.message : 'Error occurred');
        }

    };
    const handleSubmitLogin = async(e) =>{
        e.preventDefault();
        console.log('login process started');
        try{
            const res = await axios.post('http://localhost:5000/api/signIn',{
                email,
                password
            });
            setMessage(res.data.message);
            navigate('/logo');
        }catch (error) {
            console.error(error);
            setMessage(error.response ? error.response.data.message : 'Error occurred');
        }
    }


    return (
        <div>
            {!isLogin && !isSignup ? (
                <div>
                    <h2>Welcome!</h2>
                    <button onClick={() => navigate('/login')}>Sign In</button>
                    <button onClick={() => navigate('/signup')}>Create Account</button>
                </div>
            ) : isLogin ? (
                <div>
                    <h2>Sign In</h2>
                    <form onSubmit={handleSubmitLogin}>
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
                    <button onClick={() => navigate('/')}>Back</button>
                </div>
            ) : (
                <div>
                    <h2>Create Account</h2>
                    <form onSubmit={handleSubmitSignUp}>
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
                    <button onClick={() => navigate('/')}>Back</button>
                </div>
            )}
        </div>
    );
};

export default Auth;
