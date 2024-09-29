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
    try {
      const { data } = await signup({ variables: { username, password } });
  
      if (data?.signup?.token && data?.signup?.user) {
        console.log('Signup successful. Token:', data.signup.token);
        console.log('Signup successful. User:', data.signup.user);   
        
        setToken(data.signup.token);
        setUser(data.signup.user);
        localStorage.setItem('token', data.signup.token);
        localStorage.setItem('user', JSON.stringify(data.signup.user));
        window.location.href = '/home';
      }
    } catch (err: any) {
      console.error('Full error object:', err); // Log the entire error object
    
      if (err?.graphQLErrors && err.graphQLErrors.length > 0) {
        const errorMessage = err.graphQLErrors[0].message;
        window.alert('Username is already in use. Please choose a different username.');
        console.log('GraphQL Error Message:', errorMessage); // Log the specific error message
      } else {
        console.error('Signup error:', err);
      }
    }
}

  

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
