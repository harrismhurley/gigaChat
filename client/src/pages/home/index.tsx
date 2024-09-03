import React from 'react';
import Navbar from '../../components/navbar/index';
import Active from '../../components/activeCard/index';
import styles from './index.module.scss';

const Home: React.FC = () => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.mainContent}>
        <div className={styles.redSection}>
          <Navbar />  
        </div>
        <div className={styles.blueYellowSection}>
          <div className={styles.blueBox}>Blue Box</div>
          <div className={styles.yellowBox}>         
            <Active
              imageSrc="https://via.placeholder.com/300x200"
              timeCreated="2024-09-02 12:00 PM"
              address="123 Example St, City, Country"
              title="Sample Active Card Title"
              description="This is a description of the active card. It provides some details about the content of the card."
              createdBy="User"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
