import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './config/theme';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
