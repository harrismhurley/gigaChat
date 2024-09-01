import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import client from './apolloClient';
import FrontPage from './pages/frontPage/index';
import Home from './pages/main/index';
import { AuthProvider } from './utils/authContext'; // Import AuthProvider

const App: React.FC = () => (
  <ApolloProvider client={client}>
    <AuthProvider> {/* Wrap the app with AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  </ApolloProvider>
);

export default App;
