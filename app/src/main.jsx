import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/tokens.css';
import './styles/app.css';
import './styles/noite.css';

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
