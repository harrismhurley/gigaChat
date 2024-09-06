import React, { useState } from 'react';
import { Drawer, Button, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { TextFieldProps } from '@mui/material';
import { useMutation } from '@apollo/client';
import { ADD_MESSAGE } from '../../schemas'; // Update the path as needed
import styles from './index.module.scss';

const FormDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [addMessage, { loading, error }] = useMutation(ADD_MESSAGE);

  const toggleDrawer = (open: boolean) => () => {
    setIsOpen(open);
  };

  const handleAddMessage = async () => {
    if (content) {
      try {
        // Execute the mutation
        await addMessage({ variables: { content } });
        setContent(''); // Clear the content after successful submission
        setIsOpen(false); // Close the drawer
      } catch (e) {
        console.error('Error adding message:', e);
      }
    } else {
      console.error('Content is required');
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={toggleDrawer(true)}>
        <AddBoxIcon /> {/* Use the MUI icon */}
      </Button>
      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
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
            label="Select Date"
            value={date}
            onChange={(newValue: Dayjs | null) => setDate(newValue)}
            renderInput={(params: TextFieldProps) => (
              <TextField {...params} fullWidth margin="normal" className={styles.datePicker} />
            )}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddMessage}
            className={styles.submitButton}
            disabled={loading} // Disable the button while loading
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
          {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
        </div>
      </Drawer>
    </>
  );
};

export default FormDrawer;
