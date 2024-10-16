import React from 'react';
import { Avatar, Card, Typography, Box, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import styles from './index.module.scss';

interface CardProps {
  imageSrc?: string;
  timeCreated: string;
  address: string;
  title: string;
  description: string;
  createdBy: string;
}

const ActiveCard: React.FC<CardProps> = ({
  title,
  description,
  address,
  createdBy,
  imageSrc,
}) => {
  return (
    <Card className={styles.card} elevation={3} style={{ borderRadius: 0 }}>
      <Box className={styles.content}>
        {/* Left Box */}
        <Box className={styles.leftBox}>
          <Typography variant="h5" className={styles.title}>
            {title}
          </Typography>
          <Typography variant="body1" className={styles.description}>
            {description}
          </Typography>
          <Typography variant="body2" className={styles.address}>
            {address}
          </Typography>

          {/* Moved User Info below Address */}
          <Box className={styles.userInfo}>
            <Avatar>{createdBy.charAt(0)}</Avatar>
            <Typography variant="subtitle1" className={styles.username}>
              {createdBy}
            </Typography>
          </Box>
        </Box>

        {/* Right Box with Image and Action Bar */}
        <Box className={styles.rightBox}>
          <img src={imageSrc} alt={title} className={styles.image} />
          <Box className={styles.actionBar}>
            <IconButton aria-label="like">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="comment">
              <CommentIcon />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default ActiveCard;
