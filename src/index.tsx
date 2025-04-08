import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './client/components/App';
import MainAppBar from './client/components/AppBar';

const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <MainAppBar />   
    <App />
  </BrowserRouter>
);