import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BionexusProvider } from './context';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BionexusProvider>
      <App />
    </BionexusProvider>
  </React.StrictMode>
);
