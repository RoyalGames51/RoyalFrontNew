import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { initMercadoPago } from '@mercadopago/sdk-react';

import store from './redux/store/index.js';
import { Provider } from 'react-redux'

import { setupAxiosInterceptors } from './api/axiosInterceptors.js';

import './index.css'

// Registra el interceptor global de axios: ante un 401 en una sesión activa,
// limpia el token y avisa a la app (evento `auth:session-expired`).
setupAxiosInterceptors();

// Initialize Mercado Pago SDK
initMercadoPago('APP_USR-8373006830302721-053121-3dbe937245fe9857906dec4ec8b21152-3440257234');

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  
  <BrowserRouter>
  <ChakraProvider>
    <App />
  </ChakraProvider>
  </BrowserRouter>
  
  </Provider>
)
