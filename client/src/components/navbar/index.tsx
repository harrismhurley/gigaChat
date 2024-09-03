import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Avatar, IconButton, Input } from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';
import styles from './index.module.scss';
import FormDrawer from '../addForm'; 

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear the token from localStorage or cookies
    localStorage.removeItem('token');
    // Redirect to the front page or login page
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <Avatar name="GigaChat" src="path-to-your-avatar-image" className={styles.logo} />
      <div className={styles.middleSection}>
        <Input placeholder="Search..." variant="outline" className={styles.searchInput} />
      </div>
      <div className={styles.buttonGroup}>
        <FormDrawer />
        <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
