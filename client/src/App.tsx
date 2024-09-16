import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import client from './apolloClient';
import FrontPage from './pages/frontPage/index';
import Home from './pages/home/index';
import { APIProvider } from '@vis.gl/react-google-maps'; // Import the APIProvider for Google Maps
import './App.module.scss';

// Use the API key from environment variables
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const App: React.FC = () => (
  <div className="appContainer">
    <ApolloProvider client={client}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <APIProvider apiKey={API_KEY} solutionChannel="GMP_devsite_samples_v3_rgmautocomplete">
          <Router>
            <Routes>
              <Route path="/" element={<FrontPage />} />
              <Route path="/home" element={<Home />} />
            </Routes>
          </Router>
        </APIProvider>
      </LocalizationProvider>
    </ApolloProvider>
  </div>
);

export default App;
