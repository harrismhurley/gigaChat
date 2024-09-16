import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../../schemas/mutations';
import { useAuth } from '../../utils/authContext'; 
import styles from './index.module.scss';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { setToken, setUser } = useAuth(); // Get setToken and setUser from context
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

  const handleLogin = async () => {
    try {
      const { data } = await login({ variables: { username, password } });
  
      if (data?.login?.token && data?.login?.user) {
        console.log('Login successful. Token:', data.login.token);  // Log token
        console.log('Login successful. User:', data.login.user);    // Log user
        
        setToken(data.login.token);
        setUser(data.login.user); // Update user in context
        localStorage.setItem('token', data.login.token);
        localStorage.setItem('user', JSON.stringify(data.login.user));
        window.location.href = '/home';
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };
  

  return (
    <div className={styles.login}>
      <h1>Login</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
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
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p>Error logging in. Please try again.</p>}
      </form>
    </div>
  );
};

export default Login;
