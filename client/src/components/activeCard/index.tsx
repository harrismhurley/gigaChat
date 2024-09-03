import React from 'react';
import { Avatar } from '@chakra-ui/react';
import styles from './index.module.scss';

interface CardProps {
  imageSrc?: string;
  timeCreated: string;
  address: string;
  title: string;
  description: string;
  createdBy: string;
}

const ActiveCard: React.FC<CardProps> = ({ title, description, address, createdBy }) => {
  return (
    <div className={styles.card}>
      <div className={styles.leftBox}>
        <div className={styles.userInfo}>
          <Avatar name={createdBy} />
          <span className={styles.username}>{createdBy}</span>
        </div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        <p className={styles.address}>{address}</p>
      </div>
      <div className={styles.rightBox}>
        <img src="https://via.placeholder.com/300x300" alt="Placeholder" />
      </div>
    </div>
  );
};

export default ActiveCard;
