import React, { useState } from 'react';
import { useQuery, useMutation, useSubscription, gql } from '@apollo/client';
import { Avatar, Card, CardContent, Typography, Button, Box, CircularProgress, Alert } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin } from '@fortawesome/free-solid-svg-icons';
import styles from './index.module.scss';
import { GET_EVENTS, DELETE_EVENT, EVENT_ADDED, EVENT_UPDATED, EVENT_DELETED } from '../../schemas';
import UpdateForm from '../updateForm';

interface Event {
  id: string;
  title: string;
  content: string;
  address: string;
  date: string;
  imageUrl?: string;  
  user: { 
    username: string;
  };
}

interface EventListProps {
  onEventSelect: (event: Event) => void; 
}

const EventList: React.FC<EventListProps> = ({ onEventSelect }) => {
  const [selectedEvent, setSelectedEvent] = useState<{ id: string; content: string } | null>(null);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);

  const { data, loading, error } = useQuery<{ events: Event[] }>(GET_EVENTS);
  const [deleteEvent] = useMutation(DELETE_EVENT);

  // Subscription for newly added events
  useSubscription(EVENT_ADDED, {
    onData: ({ client, data }) => {
      console.log("EVENT_ADDED data:", data);  // Log the incoming data
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
                    user {
                      username
                    }
                    imageUrl  # Ensure imageUrl is included
                  }
                `,
              });
              // Log the new event reference
              console.log("New Event Reference:", newEventRef);  
              return [newEventRef, ...existingEvents];
            },
          },
        });
      }
    },
  });

  // Subscription for updated events
  useSubscription(EVENT_UPDATED, {
    onData: ({ client, data }) => {
      // Log the updated data
      console.log("EVENT_UPDATED data:", data);  
      if (data) {
        client.cache.modify({
          fields: {
            events(existingEvents = []) {
              return existingEvents.map((event: { __ref: string }) =>
                event.__ref === `Event:${data.data?.eventUpdated.id}`
                  ? { ...event, ...data.data?.eventUpdated }
                  : event
              );
            },
          },
        });
      }
    },
  });

  // Subscription for deleted events
  useSubscription(EVENT_DELETED, {
    onData: ({ client, data }) => {
      // Log the deleted data
      console.log("EVENT_DELETED data:", data);  
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
    onEventSelect(event);
  };

  if (loading) return <Box className={styles.loading}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  // Sort events by date in descending order
  const sortedEvents = data?.events.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        {sortedEvents?.map((event: Event) => (
          <Card className={styles.card} key={event.id} elevation={3} onClick={() => handleSelectEvent(event)}>
            <CardContent>
              <Box className={styles.header}>
                <Typography variant="h6" className={styles.headerText}>
                  {event.title || "Event Title"}
                </Typography>
                <Box className={styles.distance}>
                  <FontAwesomeIcon icon={faMapPin} />
                  <span className={styles.distanceValue}>42.0 mi</span> {/* Placeholder for distance */}
                </Box>
              </Box>

              {event.imageUrl && (
                <img src={event.imageUrl} alt={event.title} className={styles.eventImage} />
              )}

              <Box className={styles.cardContent}>
                <Box className={styles.avatarWrapper}>
                  <Box className={styles.avatarGroup}>
                    <Avatar className={styles.avatar}>
                      {event.user?.username?.charAt(0) || "U"}
                    </Avatar>
                    <Typography className={styles.username}>
                      {event.user?.username || "Unknown"}
                    </Typography>
                  </Box>
                  <Typography className={styles.date}>
                    {new Date(event.date).toLocaleDateString() || "Date not set"}
                  </Typography>
                </Box>

                <Typography className={styles.content}>
                  {event.content}
                </Typography>

                <Box className={styles.buttonWrapper}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateEvent(event.id, event.content)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
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