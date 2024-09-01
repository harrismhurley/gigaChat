import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SIGNUP_MUTATION } from '../../schemas/mutations';
import styles from './index.module.scss';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);

  const [signup, { loading }] = useMutation(SIGNUP_MUTATION);

  const handleSignup = async () => {
    try {
      await signup({
        variables: { email, password },
      });
      window.location.href = '/home';
    } catch (err) {
      if (err instanceof Error && err.message.includes('Email is already in use')) {
        setShowError(true);
      } else {
        console.error('Signup error:', err);
      }
    }
  };

  return (
    <div className={styles.signup}>
      <h1>Signup</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
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
        <button type="submit" disabled={loading}>
          Sign Up
        </button>
      </form>
      {showError && (
        <div className={styles.error}>
          <p>Email Already in Use</p>
          <p>The email address you entered is already associated with an account. Please use a different email address.</p>
        </div>
      )}
    </div>
  );
};

export default Signup;
