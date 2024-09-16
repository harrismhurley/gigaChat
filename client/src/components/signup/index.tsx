import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SIGNUP_MUTATION } from '../../schemas/mutations';
import { useAuth } from '../../utils/authContext'; // Import useAuth
import styles from './index.module.scss';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);

  const { setToken, setUser } = useAuth(); // Get setToken and setUser from context
  const [signup, { loading }] = useMutation(SIGNUP_MUTATION);

  const handleSignup = async () => {
    try {
      const { data } = await signup({ variables: { username, password } });
  
      if (data?.signup?.token && data?.signup?.user) {
        console.log('Signup successful. Token:', data.signup.token);  // Log token
        console.log('Signup successful. User:', data.signup.user);    // Log user
        
        setToken(data.signup.token);
        setUser(data.signup.user);
        localStorage.setItem('token', data.signup.token);
        localStorage.setItem('user', JSON.stringify(data.signup.user));
        window.location.href = '/home';
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('username is already in use')) {
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
          <h3>Username</h3>
          <input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <p>Username Already in Use</p>
          <p>The username address you entered is already associated with an account. Please use a different username address.</p>
        </div>
      )}
    </div>
  );
};

export default Signup;
