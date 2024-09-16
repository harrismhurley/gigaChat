import React, { useState } from 'react';
import { useQuery, useMutation, useSubscription, gql } from '@apollo/client';
import { Avatar, Card, CardContent, Typography, Button, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin } from '@fortawesome/free-solid-svg-icons';
import styles from './index.module.scss';
import { GET_EVENTS, DELETE_EVENT, EVENT_ADDED, EVENT_DELETED } from '../../schemas';
import UpdateForm from '../updateForm';

interface Event {
  id: string;
  title: string;
  content: string;
  address: string;
  date: string;
  username?: string;
}

interface EventListProps {
  onEventSelect: (event: Event) => void; 
}

const EventList: React.FC<EventListProps> = ({ onEventSelect }) => {
  const [selectedEvent, setSelectedEvent] = useState<{ id: string; content: string } | null>(null);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);

  const { data, loading, error } = useQuery<{ events: Event[] }>(GET_EVENTS);
  const [deleteEvent] = useMutation(DELETE_EVENT);

  useSubscription(EVENT_ADDED, {
    onData: ({ client, data }) => {
      if (data) {
        client.cache.modify({
          fields: {
            events(existingEvents = []) {
              const newEventRef = client.cache.writeFragment({
                data: data.data?.eventAdded,
                fragment: gql`
                  fragment NewEvent on Event {
                    id
                    title
                    content
                    address
                    date
                  }
                `,
              });
              return [newEventRef, ...existingEvents]; 
            },
          },
        });
      }
    },
  });

  useSubscription(EVENT_DELETED, {
    onData: ({ client, data }) => {
      if (data) {
        client.cache.modify({
          fields: {
            events(existingEvents = []) {
              return existingEvents.filter(
                (event: { __ref: string }) =>
                  event.__ref !== `Event:${data.data?.eventDeleted.id}`
              );
            },
          },
        });
      }
    },
  });

  const handleUpdateEvent = (id: string, content: string) => {
    setSelectedEvent({ id, content });
    setIsUpdateFormOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent({ variables: { id } });
  };

  const handleSelectEvent = (event: Event) => {
    onEventSelect(event); // Notify parent component
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  // Sort events by date in descending order
  const sortedEvents = data?.events.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        {sortedEvents?.map((event: Event) => (
          <Card className={styles.card} key={event.id} elevation={3} onClick={() => handleSelectEvent(event)}>
            <CardContent>
              <Box className={styles.header}>
                <Typography variant="h6" className={styles.headerText}>{event.title || "Event Title"}</Typography>
                <Box className={styles.distance}>
                  <FontAwesomeIcon icon={faMapPin} />
                  <span className={styles.distanceValue}>42.0 mi</span>
                </Box>
              </Box>
              <Box className={styles.cardContent}>
                <Box className={styles.avatarWrapper}>
                  <Box className={styles.avatarGroup}>
                    <Avatar className={styles.avatar}>{event.username?.charAt(0) || "U"}</Avatar>
                    <Typography className={styles.username}>{event.username || "Unknown"}</Typography>
                  </Box>
                  <Typography className={styles.date}>{new Date(event.date).toLocaleDateString() || "Date not set"}</Typography>
                </Box>
                <Box className={styles.buttonWrapper}>
                  <Button variant="contained" color="primary" onClick={() => handleUpdateEvent(event.id, event.content)}>
                    Update
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDeleteEvent(event.id)}>
                    Delete
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedEvent && (
        <UpdateForm
          isOpen={isUpdateFormOpen}
          onClose={() => setIsUpdateFormOpen(false)}
          eventId={selectedEvent.id}
          initialContent={selectedEvent.content}
        />
      )}
    </div>
  );
};

export default EventList;
