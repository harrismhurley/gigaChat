import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button } from '@mui/material';
import styles from './index.module.scss';
import FormDrawer from '../addForm'; // Re-added FormDrawer

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <Avatar alt="GigaChat" src="path-to-your-avatar-image" className={styles.logo} />

      <div className={styles.buttonGroup}>
        <FormDrawer /> 
        <Button variant="contained" className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
