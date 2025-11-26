import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import { SocketContextProvider } from './contextAPI/socketContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
    </StrictMode>,
  </BrowserRouter>
)
