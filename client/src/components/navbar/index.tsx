import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FormDrawer from '../addForm'; // Import the FormDrawer
import styles from './index.module.scss';
import { useAuth } from '../../utils/authContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { setToken, setUser, user } = useAuth(); // Access the user from auth context
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State to manage drawer visibility

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleDrawer = (open: boolean) => {
    setIsDrawerOpen(open);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.avatarWrapper}>
          <Avatar alt={user?.username} className={styles.avatar}>
            {user?.username?.charAt(0) || "U"} {/* Use the first letter of the username */}
          </Avatar>
        </div>
        <div className={styles.buttonGroup}>
          <button
            className={styles.addButton}
            onClick={() => toggleDrawer(true)} // Open drawer
          >
            <AddIcon />
          </button>
          <button
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>
      <FormDrawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} /> {/* Pass props to FormDrawer */}
    </>
  );
};

export default Navbar;
