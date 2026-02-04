import { createContext, useContext, useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { createPlayer } from '../services/playerService'
import { playBuzzerSound } from '../lib/sounds.js'
import { useSounds } from './SoundContext'
import postsData from '../data/posts.json'
import postImageMap from '../data/postImages.js'

const GameContext = createContext(null)

const POST_VIEW_TIMER_SECONDS = 15

export function GameProvider({ children }) {
  const { playButtonClickSound } = useSounds()
  // --- Already had: current player (from Welcome) ---
  const [playerId, setPlayerId] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [playerName, setPlayerName] = useState('')
  const [playerError, setPlayerError] = useState(null)

  const [score, setScore] = useState(0)
  const [foundItems, setFoundItems] = useState([]) // { postId, zoneId, category }[]
  const [currentPopup, setCurrentPopup] = useState(null) // { type: 'unsafe'|'safe'|'completion', data }
  const [isPaused, setIsPaused] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [countdownActive, setCountdownActive] = useState(true) // start with countdown on
  const [countdownValue, setCountdownValue] = useState(3)
  const [safePostClickCounts, setSafePostClickCounts] = useState({}) // { postId: number }
  const [likedSafePostIds, setLikedSafePostIds] = useState(new Set()) // postIds correctly liked via heart
  const [shakingHeartPostId, setShakingHeartPostId] = useState(null) // postId for wrong heart click (unsafe)
  const [incorrectZoneTooltip, setIncorrectZoneTooltip] = useState(null) // { x, y } for "that area doesn't contain a privacy risk"
  const [gameStartTime, setGameStartTime] = useState(null) // for playingTimeSeconds later
  const [scrollDelayActive, setScrollDelayActive] = useState(false) // true = hold feed still for 1.5s after countdown

  // --- Post-by-post flow ---
  // Note: stop post timer when any popup opens (incl. instruction) - via useEffect below
  const [currentPostIndex, setCurrentPostIndex] = useState(0)
  const currentPostIndexRef = useRef(0)
  const [scrollPhase, setScrollPhase] = useState('holding') // 'scrolling' | 'holding'
  const [postTimerSeconds, setPostTimerSeconds] = useState(POST_VIEW_TIMER_SECONDS)
  const postTimerRef = useRef(null)

  const foundItemsRef = useRef([])
  useEffect(() => {
    currentPostIndexRef.current = currentPostIndex
  }, [currentPostIndex])
  useEffect(() => {
    foundItemsRef.current = foundItems
  }, [foundItems])

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


  const stopPostTimer = useCallback(() => {
    if (postTimerRef.current) {
      clearInterval(postTimerRef.current)
      postTimerRef.current = null
    }
  }, [])

  const advanceToNextPost = useCallback(() => {
    stopPostTimer()
    const prev = currentPostIndexRef.current
    const next = prev + 1
    if (next >= posts.length) {
      setGameComplete(true)
      setTimeout(() => {
        setCurrentPopup({ type: 'completion', data: {} })
      }, 2000)
      return
    }
    currentPostIndexRef.current = next
    setCurrentPostIndex(next)
    setScrollPhase('scrolling')
    setPostTimerSeconds(POST_VIEW_TIMER_SECONDS)
  }, [posts.length, stopPostTimer])

  const handleTimeExpired = useCallback(() => {
    stopPostTimer()
    const idx = currentPostIndexRef.current
    const post = posts[idx]
    if (!post) {
      advanceToNextPost()
      return
    }
    if (post.type === 'danger') {
      const foundThisPost = foundItemsRef.current.some((f) => f.postId === post.id)
      if (!foundThisPost && post.dangerZones?.length > 0) {
        setIsPaused(true)
        setCurrentPopup({ type: 'unsafe', data: { post, zone: post.dangerZones[0] } })
        return
      }
    }
    if (post.type === 'safe') {
      setIsPaused(true)
      setCurrentPopup({ type: 'safe', data: { post } })
      return
    }
    advanceToNextPost()
  }, [posts, stopPostTimer, advanceToNextPost])

  const startPostTimer = useCallback(() => {
    stopPostTimer()
    setPostTimerSeconds(POST_VIEW_TIMER_SECONDS)
    postTimerRef.current = setInterval(() => {
      setPostTimerSeconds((s) => {
        if (s <= 1) {
          stopPostTimer()
          handleTimeExpired()
          return 0
        }
        return s - 1
      })
    }, 1000)
  }, [stopPostTimer, handleTimeExpired])

  const onScrollReachedTarget = useCallback(() => {
    setScrollPhase('holding')
    startPostTimer()
  }, [startPostTimer])

  const handleCorrectClick = (post, zone) => {
    if (foundItems.some((f) => f.zoneId === zone.id)) return // already found
    const newItem = { postId: post.id, zoneId: zone.id, category: zone.category }
    const updatedFound = [...foundItems, newItem]
    const categories = new Set(updatedFound.map((f) => f.category))
    setIsPaused(true)
    stopPostTimer()
    setFoundItems((prev) => [...prev, newItem])
    setScore((s) => s + 1)
    setCurrentPopup({ type: 'unsafe', data: { post, zone } })
    if (categories.size >= 5) setGameComplete(true)
  }

  const incorrectZoneTooltipTimerRef = useRef(null)
  const showTooltip = useCallback((ev, message) => {
    if (incorrectZoneTooltipTimerRef.current) clearTimeout(incorrectZoneTooltipTimerRef.current)
    setIncorrectZoneTooltip({ x: ev.clientX, y: ev.clientY, message })
    incorrectZoneTooltipTimerRef.current = setTimeout(() => {
      setIncorrectZoneTooltip(null)
      incorrectZoneTooltipTimerRef.current = null
    }, 2000)
  }, [])

  const handleIncorrectZoneClick = useCallback((ev) => {
    showTooltip(ev, "That area doesn't contain a privacy risk")
  }, [showTooltip])

  const handleSafePostImageClick = useCallback((post, ev) => {
    if (post.type !== 'safe') return
    showTooltip(ev, "This post is safe. Use the like button to show you've checked it!")
    setSafePostClickCounts((prev) => {
      const count = (prev[post.id] ?? 0) + 1
      if (count >= 3) {
        setIsPaused(true)
        stopPostTimer()
        setCurrentPopup({ type: 'safe', data: { post } })
      }
      return { ...prev, [post.id]: count }
    })
  }, [showTooltip, stopPostTimer])

  const handleHeartClick = useCallback((post, ev) => {
    ev.stopPropagation()
    if (post.type === 'safe') {
      playButtonClickSound()
      setLikedSafePostIds((prev) => new Set([...prev, post.id]))
      setIsPaused(true)
      stopPostTimer()
      setTimeout(() => {
        setCurrentPopup({ type: 'safe', data: { post } })
      }, 1000)
    } else {
      setShakingHeartPostId(post.id)
      playBuzzerSound()
      setTimeout(() => setShakingHeartPostId(null), 500)
    }
  }, [stopPostTimer])

  const handleUnsafePopupContinue = () => {
    const categories = new Set(foundItems.map((f) => f.category))
    if (categories.size >= 5) {
      setCurrentPopup({ type: 'completion', data: {} })
    } else {
      setCurrentPopup(null)
      setIsPaused(false)
      advanceToNextPost()
    }
  }

  const handleSafePopupContinue = () => {
    setCurrentPopup(null)
    setIsPaused(false)
    advanceToNextPost()
  }

  useEffect(() => {
    if (currentPopup) stopPostTimer()
  }, [currentPopup, stopPostTimer])

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
    likedSafePostIds,
    setLikedSafePostIds,
    shakingHeartPostId,
    setShakingHeartPostId,
    incorrectZoneTooltip,
    setIncorrectZoneTooltip,
    handleIncorrectZoneClick,
    gameStartTime,
    setGameStartTime,
    scrollDelayActive,
    setScrollDelayActive,
    currentPostIndex,
    setCurrentPostIndex,
    scrollPhase,
    setScrollPhase,
    postTimerSeconds,
    onScrollReachedTarget,
    startPostTimer,
    stopPostTimer,
    POST_VIEW_TIMER_SECONDS,
    posts,
    handleCorrectClick,
    handleSafePostImageClick,
    handleHeartClick,
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
