import React, { useState } from 'react';
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Button, Input, useDisclosure } from '@chakra-ui/react';
import { useMutation } from '@apollo/client';
import { ADD_MESSAGE } from '../../schemas';

const FormDrawer: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Define the mutation for adding a message
  const [addMessage] = useMutation(ADD_MESSAGE);

  const handleAddMessage = async () => {
    if (!content.trim()) {
      setErrorMessage('Message cannot be empty. Please enter your message...');
      return;
    }
    try {
      await addMessage({ variables: { content } });
      setContent('');
      setErrorMessage('');
      onClose();
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  return (
    <>
      <Button onClick={onOpen}>Add Post</Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add a New Message</DrawerHeader>
          <DrawerBody>
            <Input
              placeholder="Type your message here..."
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
            <Button colorScheme="blue" onClick={handleAddMessage}>
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default FormDrawer;
