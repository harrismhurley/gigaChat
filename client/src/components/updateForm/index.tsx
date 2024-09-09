import React, { useState } from 'react';
import { Drawer, Button, TextField } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useMutation } from '@apollo/client';
import { UPDATE_EVENT } from '../../schemas';
import styles from './index.module.scss';

interface UpdateFormProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  initialContent: string;
}

const UpdateForm: React.FC<UpdateFormProps> = ({ isOpen, onClose, eventId, initialContent }) => {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState<Date | null>(new Date());
  const [errorMessage, setErrorMessage] = useState('');

  const [updateEvent] = useMutation(UPDATE_EVENT);

  const handleUpdateEvent = async () => {
    if (!content.trim()) {
      setErrorMessage('Event content cannot be empty. Please enter your event details...');
      return;
    }
    try {
      await updateEvent({ variables: { id: eventId, content, title, address, date: date?.toISOString() } });
      setContent('');
      setTitle('');
      setAddress('');
      setDate(new Date());
      setErrorMessage('');
      onClose();
    } catch (error) {
      console.error('Error updating event:', error);
      setErrorMessage('Failed to update event. Please try again later.');
    }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <div className={styles.drawerContainer}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          className={styles.textField}
        />
        <TextField
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          margin="normal"
          className={styles.textField}
        />
        <TextField
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          fullWidth
          margin="normal"
          className={styles.textField}
        />
        <DatePicker
          selected={date}
          onChange={(newDate: Date | null) => setDate(newDate)}
          dateFormat="yyyy/MM/dd"
          className={styles.datePicker}
          customInput={
            <TextField
              label="Select Date"
              fullWidth
              margin="normal"
            />
          }
        />
        {errorMessage && (
          <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateEvent}
          className={styles.submitButton}
        >
          Submit
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
          className={styles.cancelButton}
        >
          Cancel
        </Button>
      </div>
    </Drawer>
  );
};

export default UpdateForm;
