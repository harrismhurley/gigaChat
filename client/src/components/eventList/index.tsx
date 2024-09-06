import React, { useState } from 'react';
import { useQuery, useMutation, useSubscription, gql } from '@apollo/client';
import { Avatar, Card, CardContent, Typography, Button, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin } from '@fortawesome/free-solid-svg-icons';
import styles from './index.module.scss';
import { GET_MESSAGES, DELETE_MESSAGE, MESSAGE_ADDED, MESSAGE_DELETED } from '../../schemas';
// import UpdateForm from '../updateForm';

interface Message {
  id: string;
  content: string;
  username?: string;
}

const EventList: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState<{ id: string; content: string } | null>(null);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);

  const { data, loading, error } = useQuery<{ messages: Message[] }>(GET_MESSAGES);
  const [deleteMessage] = useMutation(DELETE_MESSAGE);

  useSubscription(MESSAGE_ADDED, {
    onData: ({ client, data }) => {
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
                    username
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
      <div className={styles.cardContainer}>
        {data?.messages.map((message: Message) => (
          <Card className={styles.card} key={message.id} elevation={3}>
            <CardContent>
              <Box className={styles.header}>
                <Typography variant="h6" className={styles.headerText}>Event Header</Typography>
                <Box className={styles.distance}>
                  <FontAwesomeIcon icon={faMapPin} />
                  <span className={styles.distanceValue}>42.0 mi</span>
                </Box>
              </Box>
              <Box className={styles.cardContent}>
                <Typography>{message.content}</Typography>
                <Typography className={styles.address}>123 Placeholder St, City, Country</Typography>
                <Box className={styles.avatarWrapper}>
                  <Avatar>{message.username?.charAt(0) || "U"}</Avatar>
                  <Typography className={styles.username}>{message.username || "Unknown"}</Typography>
                </Box>
                <Box className={styles.buttonWrapper}>
                  <Button variant="contained" color="primary" onClick={() => handleUpdateMessage(message.id, message.content)}>
                    Update
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDeleteMessage(message.id)}>
                    Delete
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* {selectedMessage && (
        <UpdateForm
          isOpen={isUpdateFormOpen}
          onClose={() => setIsUpdateFormOpen(false)}
          messageId={selectedMessage.id}
          initialContent={selectedMessage.content}
        /> */}
      {/* )} */}
    </div>
  );
};

export default EventList;
