import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Changed from { App } to App (default import)
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);