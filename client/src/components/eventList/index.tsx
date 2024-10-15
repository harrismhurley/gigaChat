import React, { useState } from 'react';
import { useQuery, useMutation, useSubscription, gql } from '@apollo/client';
import { Avatar, Card, CardContent, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../../utils/authContext';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import styles from './index.module.scss';
import { GET_EVENTS, DELETE_EVENT, EVENT_ADDED, EVENT_UPDATED, EVENT_DELETED } from '../../schemas';
import UpdateForm from '../updateForm';

interface Event {
  id: string;
  title: string;
  content: string;
  address: string;
  date: string;
  user: {
    username: string;
  };
}

interface EventListProps {
  onEventSelect: (event: Event) => void;
}

// Date formatting function
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const formattedDate = date.toLocaleDateString(undefined, options);

  const day = date.getDate();
  const suffix = day % 10 === 1 && day !== 11 ? 'st' :
    day % 10 === 2 && day !== 12 ? 'nd' :
      day % 10 === 3 && day !== 13 ? 'rd' : 'th';

  return `${formattedDate}${suffix}`;
};

const EventList: React.FC<EventListProps> = ({ onEventSelect }) => {
  const { user: currentUser } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<{ id: string; content: string } | null>(null);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);

  const { data, loading, error } = useQuery<{ events: Event[] }>(GET_EVENTS);
  const [deleteEvent] = useMutation(DELETE_EVENT);

  // Subscription for newly added events
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
                    user {
                      username
                    }
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

  // Subscription for updated events
  useSubscription(EVENT_UPDATED, {
    onData: ({ client, data }) => {
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

  const handleCloseEvent = (id: string) => {
    handleDeleteEvent(id);
  };

  if (loading) return <Box className={styles.loading}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error.message}</Alert>;

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
                <Box className={styles.iconContainer}>
                  {currentUser?.username === event.user.username && (
                    <>
                      <EditIcon
                        className={styles.editIcon}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          handleUpdateEvent(event.id, event.content);
                        }}
                        fontSize="small"
                        style={{ cursor: 'pointer' }} 
                      />
                      <CloseIcon
                        className={styles.closeIcon}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          handleCloseEvent(event.id);
                        }}
                        fontSize="small"
                        style={{ cursor: 'pointer', marginLeft: '8px' }} // Spacing between icons
                      />
                    </>
                  )}
                </Box>
              </Box>

              {/* Remove the image rendering logic */}
              {/* <img src={event.imageUrl} alt={event.title} className={styles.eventImage} /> */}

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
                    {formatDate(event.date) || "Date not set"}
                  </Typography>
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
