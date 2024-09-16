import React from 'react';
import { Avatar, Card, Typography, Box } from '@mui/material';
import styles from './index.module.scss';

interface CardProps {
  imageSrc?: string;
  timeCreated: string;
  address: string;
  title: string;
  description: string;
  createdBy: string;
}

const ActiveCard: React.FC<CardProps> = ({ title, description, address, createdBy, imageSrc }) => {
  return (
    <Card className={styles.card} elevation={3} style={{ borderRadius: 0 }}>
      <Box className={styles.leftBox}>
        <Box className={styles.userInfo}>
          <Avatar>{createdBy.charAt(0)}</Avatar> 
          <Typography variant="subtitle1" className={styles.username}>{createdBy}</Typography> {/* Username */}
        </Box>
        <Typography variant="h5" className={styles.title}>{title}</Typography>
        <Typography variant="body1" className={styles.description}>{description}</Typography>
        <Typography variant="body2" className={styles.address}>{address}</Typography>
      </Box>
      <Box className={styles.rightBox}>
        <img src={imageSrc || 'https://via.placeholder.com/300x300'} alt="Placeholder" />
      </Box>
    </Card>
  );
};

export default ActiveCard;
