// src/components/updateForm/index.tsx
import React, { useState } from 'react';
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Button, Input } from '@chakra-ui/react';
import { useMutation } from '@apollo/client';
import { UPDATE_MESSAGE } from '../../schemas';

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
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Update Message</DrawerHeader>
        <DrawerBody>
          <Input
            placeholder="Update your message here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            mb={4}
          />
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </DrawerBody>
        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleUpdateMessage}>
            Submit
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default UpdateForm;
