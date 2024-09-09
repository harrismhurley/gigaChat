import React, { useState } from 'react';
import { Drawer, Button, TextField } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useMutation } from '@apollo/client';
import { ADD_EVENT } from '../../schemas'; 
import styles from './index.module.scss';

const FormDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState<Date | null>(new Date());
  const [addEvent, { loading, error }] = useMutation(ADD_EVENT);

  const toggleDrawer = (open: boolean) => () => {
    setIsOpen(open);
  };

  const handleAddEvent = async () => {
    if (title && content) {
      try {
        // Execute the mutation with all required fields
        await addEvent({ 
          variables: { 
            title, 
            content, 
            address, 
            date: date ? date.toISOString() : null 
          } 
        });
        setTitle('');  // Reset the title field
        setContent(''); // Reset the content field
        setAddress(''); // Reset the address field
        setDate(new Date()); // Reset date to initial value
        setIsOpen(false); // Close the drawer
      } catch (e) {
        console.error('Error adding event:', e);
      }
    } else {
      console.error('Title and content are required');
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddEvent}
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
