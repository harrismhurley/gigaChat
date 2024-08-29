// client/src/App.tsx
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import client from './apolloClient';
import FrontPage from './pages/frontPage/index';
import Messages from './components/messages';

const App: React.FC = () => (
  <ApolloProvider client={client}>
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/home" element={<Messages />} />
      </Routes>
    </Router>
  </ApolloProvider>
);

export default App;
