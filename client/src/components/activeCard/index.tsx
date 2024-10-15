import React from 'react';
import { Avatar, Card, Typography, Box } from '@mui/material';
import styles from './index.module.scss';

interface CardProps {
  imageSrc?: string; // Image URL for the event
  timeCreated: string; // Time the event was created
  address: string; // Event address
  title: string; // Event title
  description: string; // Event description
  createdBy: string; // User who created the event
}

const ActiveCard: React.FC<CardProps> = ({ title, description, address, createdBy, imageSrc }) => {
  return (
    <Card className={styles.card} elevation={3} style={{ borderRadius: 0 }}>
      <Box className={styles.leftBox}>
        <Box className={styles.userInfo}>
          <Avatar>{createdBy.charAt(0)}</Avatar> 
          <Typography variant="subtitle1" className={styles.username}>{createdBy}</Typography>
        </Box>
        <Typography variant="h5" className={styles.title}>{title}</Typography>
        <Typography variant="body1" className={styles.description}>{description}</Typography>
        <Typography variant="body2" className={styles.address}>{address}</Typography>
      </Box>
      <Box className={styles.rightBox}>
        {/* Use the imageSrc prop to display the event image, or a placeholder if none exists */}
        <img 
          src={imageSrc} 
          alt={title} // Alt text for better accessibility
          style={{ width: '100%', height: 'auto', borderRadius: '0' }} // Ensures image fits well
        />
      </Box>
    </Card>
  );
};

export default ActiveCard;
