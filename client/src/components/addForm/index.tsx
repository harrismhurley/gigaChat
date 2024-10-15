import React, { useState } from 'react';
import { Drawer, TextField, Button } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useMutation } from '@apollo/client';
import { ADD_EVENT, GET_PRESIGNED_URL } from '../../schemas';
import PlaceAutocompleteInput from '../autocomplete/index';
import styles from './index.module.scss';
import { useAuth } from '../../utils/authContext';

const S3_BUCKET_NAME = import.meta.env.VITE_AWS_S3_BUCKET_NAME;

interface FormDrawerProps {
  isOpen: boolean;
  toggleDrawer: (open: boolean) => void;
}

const FormDrawer: React.FC<FormDrawerProps> = ({ isOpen, toggleDrawer }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState<Date | null>(new Date());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [addEvent, { loading, error }] = useMutation(ADD_EVENT);
  const [getPresignedUrl] = useMutation(GET_PRESIGNED_URL);

  const uploadImageToS3 = async (file: File) => {
    try {
      const fileType = file.type;
      console.log('Requesting presigned URL for:', { fileType });

      // Get presigned URL from server
      const { data } = await getPresignedUrl({
        variables: { fileName: file.name, fileType }
      });

      console.log('Received presigned URL:', data);

      const { url: presignedUrl, fileName: uniqueFileName } = data.generateUploadURL;

      // Upload the image to S3 using the presigned URL
      await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': fileType
        }
      });

      console.log('Image uploaded successfully.');

      // Return the file's public URL on S3
      return `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${uniqueFileName}`;
    } catch (err) {
      console.error('Error uploading image to S3:', err);
      throw new Error('Failed to upload image');
    }
  };

  const handleAddEvent = async () => {
    if (title && content && user) {
      try {
        let imageUrl = null;

        // If an image file is selected, upload it
        if (imageFile) {
          imageUrl = await uploadImageToS3(imageFile); // Upload image and get URL
        }

        // Log data being sent to mutation
        console.log('Submitting event with data:', {
          title,
          content,
          address,
          date: date ? date.toISOString() : null,
          userId: user.id,
          imageUrl,
        });

        // Submit event data including the uploaded image URL
        const { data } = await addEvent({
          variables: {
            title,
            content,
            address,
            date: date ? date.toISOString() : null,
            userId: user.id,
            imageUrl, // Include image URL in mutation
          },
        });

        console.log('Event added successfully:', data);

        // Reset fields after successful submission
        setTitle('');
        setContent('');
        setAddress('');
        setDate(new Date());
        setImageFile(null); // Clear the image state
        toggleDrawer(false); // Close the drawer after successful submission
      } catch (e) {
        console.error('Error adding event:', e);
        alert(`Error adding event: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    } else {
      alert('Title, content, and user ID are required');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    if (place?.formatted_address) {
      setAddress(place.formatted_address);
    }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={() => toggleDrawer(false)}>
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
        <PlaceAutocompleteInput onPlaceSelect={handlePlaceSelect} />
        <DatePicker
          selected={date}
          onChange={(newDate: Date | null) => setDate(newDate)}
          dateFormat="yyyy/MM/dd"
          className={styles.datePicker}
          customInput={<TextField label="Select Date" fullWidth margin="normal" />}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ margin: '20px 0' }}
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
  );
};

export default FormDrawer;
