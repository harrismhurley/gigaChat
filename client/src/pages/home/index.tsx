import React, { useState } from 'react';
import Navbar from '../../components/navbar/index';
import ActiveCard from '../../components/activeCard/index';
import EventList from '../../components/eventList/index';
import styles from './index.module.scss';

interface Event {
  id: string;
  title: string;
  content: string;
  address: string;
  date: string;
  // username?: string;
}

const Home: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <div className={styles.homeContainer}>
      <div className={styles.mainContent}>
        <div className={styles.redSection}>
          <Navbar />
          <EventList onEventSelect={(event) => setSelectedEvent(event)} />
        </div>
        <div className={styles.blueYellowSection}>
          <div className={styles.blueBox}>Blue Box</div>
          <div className={styles.yellowBox}>
            {selectedEvent ? (
              <ActiveCard
                imageSrc="https://via.placeholder.com/300x200"
                timeCreated={new Date(selectedEvent.date).toLocaleString()}
                address={selectedEvent.address || "Address not set"}
                title={selectedEvent.title || "No Title"}
                description={selectedEvent.content || "No Description"}
                createdBy={"Unknown"}
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
