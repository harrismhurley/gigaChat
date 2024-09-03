import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Import the user icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import styles from './index.module.scss';
import FormDrawer from '../addForm'; // Import the new drawer component

const Navbar: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    // Clear the token from localStorage or cookies
    localStorage.removeItem('token');
    // Redirect to the front page or login page
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.logo}>GigaChat</h1>
      <div className={styles.buttonGroup}>
        <FormDrawer /> {/* Add the FormDrawer component here */}
        <button onClick={handleLogout}>Logout</button>
        <button>
          <FontAwesomeIcon icon={faUser} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
