// client/src/pages/frontpage/index.tsx
import React from 'react';
import Signup from '../../components/signup';
import Login from '../../components/login';
import styles from './index.module.scss';

const FrontPage: React.FC = () => (
  <div className={styles.container}>
    <div className={`${styles.box} `}>
      <Signup />
    </div>
    <div className={`${styles.box}`}>
      <Login />
    </div>
  </div>
);

export default FrontPage;
