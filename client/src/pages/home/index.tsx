import React, { useState } from 'react';
import Navbar from '../../components/navbar/index';
import ActiveCard from '../../components/activeCard/index';
import EventList from '../../components/eventList/index';
import Map from '../../components/map/index';
import styles from './index.module.scss';

interface User {
  username: string;
}

interface Event {
  id: string;
  title: string;
  content: string;
  address: string;
  date: string;
  user: User;
}

const Home: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <div className={styles.homeContainer}>
      <div className={styles.mainContent}>
        <div className={styles.sidebarContainer}>
          <Navbar />
          <EventList onEventSelect={(event) => setSelectedEvent(event)} />
        </div>
        <div className={styles.eventDetailsSection}>
          <div className={styles.aerialViewContainer}>
            {selectedEvent && <Map address={selectedEvent.address} />}
          </div>
          <div className={styles.eventCardContainer}>
            {selectedEvent ? (
              <ActiveCard
                imageSrc="https://via.placeholder.com/300x200"
                timeCreated={new Date(selectedEvent.date).toLocaleString()}
                address={selectedEvent.address || 'Address not set'}
                title={selectedEvent.title || 'No Title'}
                description={selectedEvent.content || 'No Description'}
                createdBy={selectedEvent.user.username}
              />
            ) : (
              <div>Select an event to see details</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
