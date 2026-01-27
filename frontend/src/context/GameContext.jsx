import { createContext, useContext, useState, useMemo } from 'react'
import { createPlayer } from '../../services/playerService.js'
import postsData from '../data/posts.json'
import postImageMap from '../data/postImages.js'

const GameContext = createContext(null)

/**
 * Step 4.1 + 4.3: GameContext holds both "who is playing" (playerId, etc.)
 * and "what’s happening in the game" (score, posts, popups, pause, etc.).
 * Posts are loaded once from posts.json and merged with image URLs.
 */
export function GameProvider({ children }) {
  // --- Already had: current player (from Welcome) ---
  const [playerId, setPlayerId] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [playerName, setPlayerName] = useState('')
  const [playerError, setPlayerError] = useState(null)

  // --- Step 4.1: Gameplay state ---
  const [score, setScore] = useState(0)
  const [foundItems, setFoundItems] = useState([]) // { postId, zoneId, category }[]
  const [currentPopup, setCurrentPopup] = useState(null) // { type: 'unsafe'|'safe'|'completion', data }
  const [isPaused, setIsPaused] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [countdownActive, setCountdownActive] = useState(true) // start with countdown on
  const [countdownValue, setCountdownValue] = useState(3)
  const [safePostClickCounts, setSafePostClickCounts] = useState({}) // { postId: number }
  const [gameStartTime, setGameStartTime] = useState(null) // for playingTimeSeconds later

  // --- Step 4.3: Load posts and add imageUrl from postImageMap ---
  const posts = useMemo(() => {
    return postsData.map((p) => ({
      ...p,
      imageUrl: postImageMap[p.imageKey] ?? '',
    }))
  }, [])

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

  // --- Step 4.1: Placeholder handlers (real logic comes in Phase 7/8) ---

  const handleCorrectClick = (post, zone) => {
    if (foundItems.some((f) => f.zoneId === zone.id)) return // already found
    setIsPaused(true)
    setFoundItems((prev) => [...prev, { postId: post.id, zoneId: zone.id, category: zone.category }])
    setScore((s) => s + 1)
    setCurrentPopup({ type: 'unsafe', data: { post, zone } })
    if (score + 1 >= 8) setGameComplete(true)
  }

  const handleIncorrectClick = (post) => {
    if (post.type !== 'safe') return
    const next = { ...safePostClickCounts, [post.id]: (safePostClickCounts[post.id] ?? 0) + 1 }
    setSafePostClickCounts(next)
    if (next[post.id] > 3) {
      setIsPaused(true)
      setCurrentPopup({ type: 'safe', data: { post } })
    }
  }

  const handleUnsafePopupContinue = () => {
    if (score >= 8) {
      setCurrentPopup({ type: 'completion', data: {} })
    } else {
      setCurrentPopup(null)
      setIsPaused(false)
    }
  }

  const handleSafePopupContinue = () => {
    setCurrentPopup(null)
    setIsPaused(false)
  }

  const handleCompletionClose = () => {
    setCurrentPopup(null)
    // Play Again / navigate will be done by the component that uses this
  }

  const value = {
    playerId,
    sessionId,
    playerName,
    playerError,
    setPlayerError,
    createPlayerAndGo,
    score,
    setScore,
    foundItems,
    setFoundItems,
    currentPopup,
    setCurrentPopup,
    isPaused,
    setIsPaused,
    gameComplete,
    setGameComplete,
    scrollPosition,
    setScrollPosition,
    countdownActive,
    setCountdownActive,
    countdownValue,
    setCountdownValue,
    safePostClickCounts,
    setSafePostClickCounts,
    gameStartTime,
    setGameStartTime,
    posts,
    handleCorrectClick,
    handleIncorrectClick,
    handleUnsafePopupContinue,
    handleSafePopupContinue,
    handleCompletionClose,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
