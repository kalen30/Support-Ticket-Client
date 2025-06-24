/**
 * Entry point for the Support Ticket Management App.
 * Initializes and renders the main App component using React's StrictMode.
 *
 * @author Kalen
 * @version 1.0.0
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
