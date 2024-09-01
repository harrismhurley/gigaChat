// client/src/components/login/index.tsx
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../../schemas/mutations';
import styles from './index.module.scss'; 
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

  const handleLogin = async () => {
    try {
      const { data } = await login({ variables: { email, password } });

      if (data?.login?.token) {
        localStorage.setItem('token', data.login.token);
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
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p>Error logging in. Please try again.</p>}
      </form>
    </div>
  );
};

export default Login;
