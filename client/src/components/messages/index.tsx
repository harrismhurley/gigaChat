import React, { useState } from 'react';
import { useQuery, useMutation, useSubscription, gql } from '@apollo/client';
import styles from './index.module.scss';
import {
  GET_MESSAGES,
  ADD_MESSAGE,
  UPDATE_MESSAGE,
  DELETE_MESSAGE,
  MESSAGE_ADDED,
  MESSAGE_UPDATED,
  MESSAGE_DELETED,
} from '../../schemas';

interface Message {
  id: string;
  content: string;
}

const Messages: React.FC = () => {
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch existing messages
  const { data, loading, error } = useQuery<{ messages: Message[] }>(GET_MESSAGES);

  // Define mutations for adding, updating, and deleting messages
  const [addMessage] = useMutation(ADD_MESSAGE);
  const [updateMessage] = useMutation(UPDATE_MESSAGE);
  const [deleteMessage] = useMutation(DELETE_MESSAGE);

  // Subscription for added messages
  useSubscription(MESSAGE_ADDED, {
    onData: ({ client, data }) => {

    console.log('Received new message data:', data);

      if (data) {
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

  // Subscription for updated messages
  useSubscription(MESSAGE_UPDATED, {
    onData: ({ client, data }) => {
      if (data) {
        client.cache.modify({
          fields: {
            messages(existingMessages = []) {
              return existingMessages.map((message: { __ref: string }) =>
                message.__ref === `Message:${data.data?.messageUpdated.id}`
                  ? client.cache.writeFragment({
                      data: data.data?.messageUpdated,
                      fragment: gql`
                        fragment UpdatedMessage on Message {
                          id
                          content
                        }
                      `,
                    })
                  : message
              );
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

  const handleAddMessage = () => {
    if (!content.trim()) {
      setErrorMessage('Message cannot be empty. Please enter your message...');
      return;
    }
    addMessage({ variables: { content } }).then(response => {
      console.log('Message added:', response.data);
    }).catch(error => {
      console.error('Error adding message:', error);
    });
    setContent('');
    setErrorMessage('');
  };
   
  const handleUpdateMessage = (id: string) => {
    const messageObj = data?.messages.find(msg => msg.id === id);
    if (messageObj) {
      const newContent = prompt('Enter new content:', `${messageObj.content}`);
      if (newContent) {
        updateMessage({ variables: { id, content: newContent } });
      }
    }
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
            <div className='button-wrapper'>
              <button onClick={() => handleUpdateMessage(message.id)}>Update</button>
              <button onClick={() => handleDeleteMessage(message.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <div className={styles.inputGroup}>
        <input
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button onClick={handleAddMessage}>Add Message</button>
      </div>
      {errorMessage && (
        <span className={styles['error-text']}>
          {errorMessage}
          <button className={styles.close} onClick={() => setErrorMessage('')}>Close</button>
        </span>
      )}
    </div>
  );
};

export default Messages;
