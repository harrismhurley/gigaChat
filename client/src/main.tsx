import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'; // Import ChakraProvider
import { AuthProvider } from './utils/authContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ChakraProvider> {/* Wrap with ChakraProvider */}
            <AuthProvider>
                <App />
            </AuthProvider>
        </ChakraProvider>
    </React.StrictMode>
);
