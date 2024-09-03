import React from 'react';
import styles from './index.module.scss';

interface CardProps {
  imageSrc?: string;
  timeCreated: string;
  address: string;
  title: string;
  description: string;
  createdBy: string;
}

const ActiveCard: React.FC<CardProps> = () => {

};

export default ActiveCard;
