import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import { useSounds } from './context/SoundContext'
import MusicToggleButton from './components/MusicToggleButton'
import WelcomePage from './pages/WelcomePage'
import InstructionsPage from './pages/InstructionPage'
import GamePage from './pages/GamePage'

const GAME_ROUTES = ['/', '/instructions', '/game']

function AppContent() {
  const { playClickSound, playButtonClickSound } = useSounds()
  const location = useLocation()
  const showMusicToggle = GAME_ROUTES.includes(location.pathname)

  useEffect(() => {
    const handleGlobalClick = (ev) => {
      if (ev.target.closest('[data-skip-global-click-sound]')) return
      if (ev.target.closest('button, [role="button"]')) {
        playButtonClickSound()
      } else {
        playClickSound()
      }
    }
    document.addEventListener('click', handleGlobalClick, true)
    return () => document.removeEventListener('click', handleGlobalClick, true)
  }, [playClickSound, playButtonClickSound])

  return (
    <>
      {showMusicToggle && <MusicToggleButton />}
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/instructions' element={<InstructionsPage />} />
        <Route path='/game' element={<GamePage />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <GameProvider>
      <Router>
        <AppContent />
      </Router>
    </GameProvider>
  )
}

export default App
