// src/components/Signup.tsx
import React, { useState } from 'react';

const Signup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = () => {
        // Implement your signup logic here, e.g., sending the data to a server.
        console.log('Signup with:', { email, password });
        // After successful signup, redirect to the homepage.
        window.location.href = '/home';
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
