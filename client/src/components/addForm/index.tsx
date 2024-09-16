import React, { useState } from 'react';
import { Drawer, Button, TextField } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useMutation } from '@apollo/client';
import { ADD_EVENT } from '../../schemas';
import PlaceAutocompleteInput from '../autocomplete/index';
import styles from './index.module.scss';
import { useAuth } from '../../utils/authContext';

const FormDrawer: React.FC = () => {
  const { user, token } = useAuth(); // Get user from context
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
    console.log('Adding event with data:', {
      title,
      content,
      address,
      date: date ? date.toISOString() : null,
      userId: user?.id
    });

    if (title && content && user) {
      try {
        await addEvent({
          variables: {
            title,
            content,
            address,
            date: date ? date.toISOString() : null,
            userId: user.id
          }
        });
        // Reset fields after successful submission
        setTitle('');
        setContent('');
        setAddress('');
        setDate(new Date());
        setIsOpen(false);
      } catch (e) {
        console.error('Error adding event:', e);
        alert('Error adding event: ' + (e instanceof Error ? e.message : 'Unknown error'));
      }
    } else {
      console.error('Title, content, and user ID are required');
      alert('Title, content, and user ID are required');
    }
  };

  // Handle place selection from autocomplete
  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    if (place?.formatted_address) {
      setAddress(place.formatted_address); // Set the address based on the selected place
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={toggleDrawer(true)}>
        <AddBoxIcon />
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

          <PlaceAutocompleteInput
            onPlaceSelect={handlePlaceSelect}
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
            disabled={loading} 
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
