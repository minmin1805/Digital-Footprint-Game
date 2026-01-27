import { createContext, useContext, useState } from 'react'
import { createPlayer } from '../../services/playerService.js'

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [playerId, setPlayerId] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [playerName, setPlayerName] = useState('')
  const [playerError, setPlayerError] = useState(null)

  const createPlayerAndGo = async (name, navigate) => {
    if (!name || !String(name).trim()) {
      setPlayerError('Please enter your name')
      return
    }
    setPlayerError(null)
    try {
      const data = await createPlayer(name.trim())
      setPlayerId(data.id)
      setSessionId(data.sessionId)
      setPlayerName(data.playerName ?? name.trim())
      navigate('/instructions')
    } catch (err) {
      console.error('createPlayerAndGo error:', err)
      setPlayerError('Failed to create player. Please try again.')
    }
  }

  const value = {
    playerId,
    sessionId,
    playerName,
    playerError,
    setPlayerError,
    createPlayerAndGo,
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) {
    throw new Error('useGame must be used inside GameProvider')
  }
  return ctx
}
