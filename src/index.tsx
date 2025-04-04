import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './client/components/App';
import NavDrawer from './client/components/NavDrawer';

const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <NavDrawer />   
    <App />
  </BrowserRouter>
);