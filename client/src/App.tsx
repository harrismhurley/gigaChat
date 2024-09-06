import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import client from './apolloClient';
import FrontPage from './pages/frontPage/index';
import Home from './pages/home/index';
import './App.module.scss';

const App: React.FC = () => (
  <div className="appContainer">
    <ApolloProvider client={client}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
          <Routes>
            <Route path="/" element={<FrontPage />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </Router>
      </LocalizationProvider>
    </ApolloProvider>
  </div>
);

export default App;
