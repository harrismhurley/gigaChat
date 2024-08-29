// src/pages/main/index.tsx
import React from 'react';
import Messages from '../../components/messages';

const MainPage: React.FC = () => {
  return (
    <div>
      <h2>Messages</h2>
      <Messages />
    </div>
  );
};

export default MainPage;
