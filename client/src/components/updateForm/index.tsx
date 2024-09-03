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
  const [updateMessage] = useMutation(UPDATE_MESSAGE);

  const handleUpdate = () => {
    if (content.trim()) {
      updateMessage({ variables: { id: messageId, content } })
        .then(() => {
          onClose(); // Close drawer on successful update
        })
        .catch(error => {
          console.error('Error updating message:', error);
        });
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Update Message</DrawerHeader>
        <DrawerBody>
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter new message content"
          />
        </DrawerBody>
        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleUpdate}>
            Update
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default UpdateForm;
