import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import { useSounds } from './context/SoundContext'
import WelcomePage from './pages/WelcomePage'
import InstructionsPage from './pages/InstructionPage'
import GamePage from './pages/GamePage'

function App() {
  const { playClickSound, playButtonClickSound } = useSounds()

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
    <GameProvider>
      <Router>
        <Routes>
          <Route path='/' element={<WelcomePage />} />
          <Route path='/instructions' element={<InstructionsPage />} />
          <Route path='/game' element={<GamePage />} />
        </Routes>
      </Router>
    </GameProvider>
  )
}

export default App
