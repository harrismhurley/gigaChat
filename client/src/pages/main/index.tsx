import React from 'react';
import Navbar from '../../components/navbar/index';
import Messages from '../../components/messages/index';

const MainPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div>
        <h2>Messages</h2>
        <Messages />
      </div>
    </div>
  );
};

export default MainPage;
