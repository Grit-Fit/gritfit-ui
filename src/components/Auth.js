// src/components/Auth.js
import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
// import axios from 'axios'
import axios from '../axios'; 
import logo from '../assets/Logo.png';
import './Auth.css'

const Auth = () => {
    const { login } = useContext(AuthContext);
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
            const { token, message: responseMessage } = response.data;
             if (token) {
                const userData = { email, username };
                login(token, userData);
                navigate('/logo');
                setMessage(responseMessage); // Display success message
                console.log(response.data); // Log the response
            }
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
            const { token, message: responseMessage } = res.data;
            setMessage(responseMessage);
            console.log('Login Response:', res.data);
             if (token) {
                // Prepare user data
                const userData = { email }; // Adjust based on your backend response
                // Store token and user data in AuthContext
                login(token, userData);
                // Navigate to the logo page
                navigate('/logo');
            }
        }catch (error) {
            console.error(error);
            setMessage(error.response ? error.response.data.message : 'Error occurred');
        }
    }


    return (
        <div className="auth-container">
            <div className="content-wrapper">
             <img src={logo} alt="Logo" className="logo" />
            {!isLogin && !isSignup ? (
                <div>
                     <>
                    <h2 className="welcome">Welcome!</h2>
                    <div className="button-container">
                        <button className="auth-button" onClick={() => navigate('/login')}>
                            Sign In
                        </button>
                        <button className="auth-button" onClick={() => navigate('/signup')}>
                            Create Account
                        </button>
                    </div>
                    <p className="guestline">Continue as Guest</p>
                </>
                </div>
            ) : isLogin ? (
                <div>
                    <h2 className="welcome">Sign In</h2>
                    <form onSubmit={handleSubmitLogin}>
                        <div>
                            {/* <label>Email*</label> */}
                            <input type="email" 
                            value={email}
                            placeholder="Email*"
                        onChange={(e) => setEmail(e.target.value)}
                            required />
                        </div>
                        <div>
                            {/* <label>Password*</label> */}
                            <input type="password" 
                            value={password}
                            placeholder="Password*"
                        onChange={(e) => setPassword(e.target.value)}
                            required />
                        </div>
                        <button className = "signin-button" type="submit">Sign In</button>
                    </form>
                    <button onClick={() => navigate('/')}>Back</button>
                      {message && <p>{message}</p>}
                </div>
            ) : (
                <div>
                    <h2 className="welcome">Create Account</h2>
                    <form onSubmit={handleSubmitSignUp}>
                        <div>
                            <button  className="google">Continue with Google</button>
                            {/* <label>Username*</label> */}
                            <input type="username" 
                            value={username}
                            placeholder="Username*"
                        onChange={(e) => setUsername(e.target.value)}
                            required />
                        </div>
                        <div>
                            {/* <label>Email*</label> */}
                            <input type="email" 
                            value={email}
                            placeholder="Email*"
                        onChange={(e) => setEmail(e.target.value)}
                            required />
                        </div>
                        <div>
                            {/* <label>Create Password*</label> */}
                            <input type="password" 
                            value={password}
                            placeholder=" Create Password*"
                        onChange={(e) => setPassword(e.target.value)}
                            required />
                            <p className="pwdLen">Your password must contain 7 letters</p>
                        </div>
                        <button className = "signin-button" type="submit">Create Account</button>
                    </form>
                    <button onClick={() => navigate('/')}>Back</button>
                      {message && <p>{message}</p>}
                </div>
            )}
        </div>
        </div>
    );
};

export default Auth;
