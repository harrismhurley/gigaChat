import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SIGNUP_MUTATION } from '../../schemas/mutations';
import { useAuth } from '../../utils/authContext'; // Import useAuth
import styles from './index.module.scss';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { setToken, setUser } = useAuth(); // Get setToken and setUser from context
  const [signup, { loading }] = useMutation(SIGNUP_MUTATION);

  const handleSignup = async () => {
    console.log('Attempting signup with username:', username);
    try {
      const { data } = await signup({ variables: { username, password } });
      
      // Log the raw mutation response
      console.log('Signup mutation response:', data);
      
      if (data?.signup?.token && data?.signup?.user) {
        console.log('Signup successful. Token:', data.signup.token);
        console.log('User details:', data.signup.user);
        
        setToken(data.signup.token);
        setUser(data.signup.user);
        localStorage.setItem('token', data.signup.token);
        localStorage.setItem('user', JSON.stringify(data.signup.user));
        window.location.href = '/home';
      } else {
        console.warn('Signup response did not contain token or user.');
      }
    } catch (err: any) {
      console.error('Full error object:', err);  // Log the complete error object
      
      // Check for GraphQL errors
      if (err?.graphQLErrors && err.graphQLErrors.length > 0) {
        console.error('GraphQL errors:', err.graphQLErrors);
        window.alert('Username is already in use. Please choose a different username.');
      }
  
      // Check for network errors
      if (err?.networkError) {
        console.error('Network error:', err.networkError);
        window.alert('Network error occurred. Please check your connection.');
      }
  
      // If no specific errors were logged, just log the general error
      console.error('Signup error:', err);
    }
  };
  

  

  return (
    <div className={styles.signup}>
      <h1>Signup</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
        <div>
          <h3>Username</h3>
          <input
            type="text"
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
    </div>
  );
};

export default Signup;
