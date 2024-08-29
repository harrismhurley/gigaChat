import React, { useState } from 'react';
import styles from '../../pages/frontPage/index.module.scss';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log('Login with:', { email, password });
        window.location.href = '/home'; // Redirect after successful login
    };

    return (
        <div className={styles.login}>
            <h1>Login</h1>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <div>
                    <h3>Email</h3>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <h3>Password</h3>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
