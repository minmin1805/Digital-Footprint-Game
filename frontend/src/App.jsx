import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import WelcomePage from './pages/WelcomePage'
import InstructionsPage from './pages/InstructionPage'
import GamePage from './pages/GamePage'

function App() {
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
