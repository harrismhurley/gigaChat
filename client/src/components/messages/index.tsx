// src/components/messages/index.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useSubscription, gql } from '@apollo/client';
import styles from './index.module.scss';
import {
  GET_MESSAGES,
  DELETE_MESSAGE,
  MESSAGE_ADDED,
  MESSAGE_DELETED,
} from '../../schemas';
import UpdateForm from '../updateForm';

interface Message {
  id: string;
  content: string;
}

const Messages: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState<{ id: string; content: string } | null>(null);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);

  // Fetch existing messages
  const { data, loading, error } = useQuery<{ messages: Message[] }>(GET_MESSAGES);

  // Define mutation for deleting messages
  const [deleteMessage] = useMutation(DELETE_MESSAGE);

  // Subscription for added messages
  useSubscription(MESSAGE_ADDED, {
    onData: ({ client, data }) => {
      if (data) {
        console.log('Message added:', data.data?.messageAdded); // Debug log
        client.cache.modify({
          fields: {
            messages(existingMessages = []) {
              const newMessageRef = client.cache.writeFragment({
                data: data.data?.messageAdded,
                fragment: gql`
                  fragment NewMessage on Message {
                    id
                    content
                  }
                `,
              });
              return [...existingMessages, newMessageRef];
            },
          },
        });
      }
    },
  });

  // Subscription for deleted messages
  useSubscription(MESSAGE_DELETED, {
    onData: ({ client, data }) => {
      if (data) {
        console.log('Message deleted:', data.data?.messageDeleted); // Debug log
        client.cache.modify({
          fields: {
            messages(existingMessages = []) {
              return existingMessages.filter(
                (message: { __ref: string }) =>
                  message.__ref !== `Message:${data.data?.messageDeleted.id}`
              );
            },
          },
        });
      }
    },
  });

  const handleUpdateMessage = (id: string, content: string) => {
    setSelectedMessage({ id, content });
    setIsUpdateFormOpen(true);
  };

  const handleDeleteMessage = (id: string) => {
    deleteMessage({ variables: { id } });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div className={styles.container}>
      <ul className={styles.messageList}>
        {data?.messages.map((message: Message) => (
          <li key={message.id}>
            {message.content}
            <div className="button-wrapper">
              <button onClick={() => handleUpdateMessage(message.id, message.content)}>Update</button>
              <button onClick={() => handleDeleteMessage(message.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {selectedMessage && (
        <UpdateForm
          isOpen={isUpdateFormOpen}
          onClose={() => setIsUpdateFormOpen(false)}
          messageId={selectedMessage.id}
          initialContent={selectedMessage.content}
        />
      )}
    </div>
  );
};

export default Messages;
