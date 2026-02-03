import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { SoundProvider } from './context/SoundContext'
import { MusicProvider } from './context/MusicContext'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SoundProvider>
      <MusicProvider>
        <App />
      </MusicProvider>
    </SoundProvider>
  </StrictMode>,
)
