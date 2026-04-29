import { createContext, useContext, useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { createPlayer } from '../services/playerService'
import { playBuzzerSound } from '../lib/sounds.js'
import { useSounds } from './SoundContext'
import postsData from '../data/posts.json'
import postImageMap from '../data/postImages.js'
import { emitTelemetryEvent } from '../services/telemetryService.js'

const GameContext = createContext(null)

const POST_VIEW_TIMER_SECONDS = 15

export function GameProvider({ children }) {
  const { playLikeSound } = useSounds()
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
      emitTelemetryEvent({
        eventType: 'welcome_submitted',
        sessionId: data.sessionId,
        playerId: String(data.id),
      })
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
        emitTelemetryEvent({
          eventType: 'timer_expired',
          sessionId,
          playerId: playerId ?? undefined,
          stepNumber: idx,
          stepId: post.id,
          metadata: { postId: post.id, postType: post.type },
        })
        setIsPaused(true)
        setCurrentPopup({ type: 'unsafe', data: { post, zone: post.dangerZones[0] } })
        return
      }
    }
    if (post.type === 'safe') {
      setIsPaused(true)
      emitTelemetryEvent({
        eventType: 'timer_expired',
        sessionId,
        playerId: playerId ?? undefined,
        stepNumber: idx,
        stepId: post.id,
        metadata: { postId: post.id, postType: post.type },
      })
      setCurrentPopup({ type: 'safe', data: { post, fromBruteForce: false } })
      return
    }
    advanceToNextPost()
  }, [posts, stopPostTimer, advanceToNextPost, sessionId, playerId])

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
    const idx = currentPostIndexRef.current
    emitTelemetryEvent({
      eventType: 'unsafe_zone_correct',
      sessionId,
      playerId: playerId ?? undefined,
      stepNumber: idx,
      stepId: typeof post?.id === 'string' ? post.id : undefined,
      metadata: { postId: post.id, category: zone.category },
    })
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

  const handleIncorrectZoneClick = useCallback(
    (post, ev) => {
      const idx = currentPostIndexRef.current
      emitTelemetryEvent({
        eventType: 'incorrect_zone_click',
        sessionId,
        playerId: playerId ?? undefined,
        stepNumber: idx,
        stepId: post?.id,
        metadata: post?.id ? { postId: post.id } : {},
      })
      showTooltip(ev, "That area doesn't contain a privacy risk")
    },
    [showTooltip, sessionId, playerId]
  )

  const handleSafePostImageClick = useCallback(
    (post, ev) => {
      if (post.type !== 'safe') return
      showTooltip(ev, "This area does not contain a privacy risk")
      setSafePostClickCounts((prev) => {
        const count = (prev[post.id] ?? 0) + 1
        const i = currentPostIndexRef.current
        emitTelemetryEvent({
          eventType: 'safe_image_click',
          sessionId,
          playerId: playerId ?? undefined,
          stepNumber: i,
          stepId: post.id,
          metadata: { postId: post.id, clickCount: count },
        })
        if (count >= 3) {
          setIsPaused(true)
          stopPostTimer()
          setCurrentPopup({ type: 'safe', data: { post, fromBruteForce: true } })
        }
        return { ...prev, [post.id]: count }
      })
    },
    [showTooltip, stopPostTimer, sessionId, playerId]
  )

  const handleHeartClick = useCallback(
    (post, ev) => {
      ev.stopPropagation()
      const idx = currentPostIndexRef.current
      if (post.type === 'safe') {
        emitTelemetryEvent({
          eventType: 'safe_like_correct',
          sessionId,
          playerId: playerId ?? undefined,
          stepNumber: idx,
          stepId: post.id,
          metadata: { postId: post.id },
        })
        playLikeSound()
        setLikedSafePostIds((prev) => new Set([...prev, post.id]))
        setIsPaused(true)
        stopPostTimer()
        setTimeout(() => {
          setCurrentPopup({ type: 'safe', data: { post, fromBruteForce: false } })
        }, 1000)
      } else {
        emitTelemetryEvent({
          eventType: 'wrong_heart_on_unsafe',
          sessionId,
          playerId: playerId ?? undefined,
          stepNumber: idx,
          stepId: post.id,
          metadata: { postId: post.id },
        })
        setShakingHeartPostId(post.id)
        playBuzzerSound()
        setTimeout(() => setShakingHeartPostId(null), 500)
      }
    },
    [stopPostTimer, playLikeSound, sessionId, playerId]
  )

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
