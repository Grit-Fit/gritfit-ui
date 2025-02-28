import React, { useState } from 'react';
import { supabase } from "../supabaseClient";
import './Auth.css';  // Keeping your styling intact
import backIcon from '../assets/back-icon.svg'; // Example, in case you have a back icon button like in the screenshots

const CreateAccountForm = ({ setAuthMode }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmitSignUp = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            }, {
                redirectTo: "https://www.gritfit.site/welcome"  // This is where the user lands after clicking the verification email link.
            });

            if (error) {
                setMessage(`❌ ${error.message}`);
            } else {
                setMessage("✅ Account created! Please check your email to verify your account.");
            }
        } catch (err) {
            setMessage("An unexpected error occurred.");
            console.error(err);
        }
    };

    return (
        <div className="auth-container">
            <button className="back-button" onClick={() => setAuthMode('signIn')}>
                <img src={backIcon} alt="Back" />
            </button>

            <img src="/path-to-your-logo.png" alt="Logo" className="logo-auth" />
            <h2 className="welcome">Create Account</h2>

            <div className="form-container create-account-form">
                <form onSubmit={handleSubmitSignUp}>
                    <input
                        type="email"
                        placeholder="Email*"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Create Password*"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <p className="pwdLen">Password must be at least 6 characters.</p>

                    <button type="submit" className="createAcc-button">Create Account</button>
                </form>

                {message && <p className="message">{message}</p>}
            </div>

            <button className="auth-button" onClick={() => window.location.reload()}>Refresh App</button>
        </div>
    );
};

export default CreateAccountForm;
