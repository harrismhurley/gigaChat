// client/src/components/signup/index.tsx
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SIGNUP_MUTATION } from '../../schemas/mutations';
import styles from '../../pages/frontPage/index.module.scss';

const Signup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [signup] = useMutation(SIGNUP_MUTATION, {
        onCompleted: () => {
            window.location.href = '/home'; // Redirect after successful signup
        },
        onError: (error) => {
            console.error('Error signing up:', error);
        },
    });

    const handleSignup = () => {
        signup({
            variables: {
                email,
                password,
            },
        });
    };

    return (
        <div className={styles.signup}>
            <h1>Signup</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSignup();
                }}
            >
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
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
