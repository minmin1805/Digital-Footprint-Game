import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { SoundProvider } from './context/SoundContext'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SoundProvider>
      <App />
    </SoundProvider>
  </StrictMode>,
)
