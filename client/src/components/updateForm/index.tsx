import React, { useState } from 'react';
import { Drawer, Button, TextField } from '@mui/material';
import { useMutation } from '@apollo/client';
import { UPDATE_MESSAGE } from '../../schemas';
import styles from './index.module.scss'; // Import the SCSS module

interface UpdateFormProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: string;
  initialContent: string;
}

const UpdateForm: React.FC<UpdateFormProps> = ({ isOpen, onClose, messageId, initialContent }) => {
  const [content, setContent] = useState(initialContent);
  const [errorMessage, setErrorMessage] = useState('');

  // Define the mutation for updating a message
  const [updateMessage] = useMutation(UPDATE_MESSAGE);

  const handleUpdateMessage = async () => {
    if (!content.trim()) {
      setErrorMessage('Message cannot be empty. Please enter your message...');
      return;
    }
    try {
      await updateMessage({ variables: { id: messageId, content } });
      setContent('');
      setErrorMessage('');
      onClose();
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <div className={styles.drawerContainer}>
        <TextField
          label="Update Message"
          placeholder="Update your message here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          margin="normal"
          className={styles.textField}
        />
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateMessage}
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
