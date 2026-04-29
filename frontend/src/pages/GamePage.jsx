import React, { useEffect, useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { updatePlayer } from '../services/playerService'
import ProgressBar from '../components/ProgressBar'
import FriendSection from '../components/FriendSection'
import MenuBar from '../components/MenuBar'
import MessageBar from '../components/MessageBar'
import FeedContainer from '../components/FeedContainer'
import UnsafePopup from '../components/UnsafePopup'
import SafePopup from '../components/SafePopup'
import GameEndPopup from '../components/GameEndPopup'
import InstructionPopup from '../components/InstructionPopup'
import CountdownOverlay from '../components/CountdownOverlay'
import { emitTelemetryEvent } from '../services/telemetryService.js'

function GamePage() {
  const navigate = useNavigate()
  const [playAgainLoading, setPlayAgainLoading] = useState(false)
  const [playAgainError, setPlayAgainError] = useState(null)
  const completionTelemetrySentRef = useRef(false)
  const {
    playerId,
    sessionId,
    score,
    foundItems,
    likedSafePostIds,
    posts,
    gameStartTime,
    currentPostIndex,
    countdownActive,
    setCountdownActive,
    setCountdownValue,
    setGameStartTime,
    setScrollPosition,
    setScore,
    setFoundItems,
    setCurrentPopup,
    setIsPaused,
    setGameComplete,
    setSafePostClickCounts,
    setLikedSafePostIds,
    setShakingHeartPostId,
    incorrectZoneTooltip,
    setIncorrectZoneTooltip,
    setScrollDelayActive,
    setScrollPhase,
    setCurrentPostIndex,
    currentPopup,
    postTimerSeconds,
    startPostTimer,
    handleUnsafePopupContinue,
    handleSafePopupContinue,
    handleCompletionClose,
  } = useGame()

  const handlePlayAgain = useCallback(async () => {
    if (!playerId) {
      handleCompletionClose()
      navigate('/')
      return
    }
    setPlayAgainError(null)
    setPlayAgainLoading(true)
    try {
      const playingTimeSeconds = gameStartTime
        ? Math.round((Date.now() - gameStartTime) / 1000)
        : 0
      const categoriesFound = [...new Set(foundItems.map((f) => f.category))]
      const safepostTotal = posts.filter((p) => p.type === 'safe').length
      const safepostDetected = likedSafePostIds?.size ?? 0

      await updatePlayer(playerId, {
        score,
        totalPossible: 5,
        categoriesFound,
        safepostDetected,
        safepostTotal,
        playingTimeSeconds,
        completedAt: new Date().toISOString(),
      })
      handleCompletionClose()
      navigate('/')
    } catch (err) {
      console.error('updatePlayer error:', err)
      setPlayAgainError('Could not save results. Playing again anyway.')
      handleCompletionClose()
      navigate('/')
    } finally {
      setPlayAgainLoading(false)
    }
  }, [
    playerId,
    score,
    foundItems,
    likedSafePostIds,
    posts,
    gameStartTime,
    handleCompletionClose,
    navigate,
  ])

  const scrollDelayTimerRef = useRef(null)
  const skipScrollDelayRef = useRef(false)

  const handleInstructionContinue = useCallback(() => {
    setCurrentPopup(null)
    setCountdownValue(3)
    setCountdownActive(true)
    setScrollDelayActive(false)
    setIsPaused(false)
    skipScrollDelayRef.current = true
  }, [
    setCurrentPopup,
    setCountdownValue,
    setCountdownActive,
    setScrollDelayActive,
    setIsPaused,
  ])

  useEffect(() => {
    setCountdownValue(3)
    setCountdownActive(true)
    setGameStartTime(null)
    setScrollPosition(0)
    setScrollDelayActive(false)
    setScore(0)
    setFoundItems([])
    setLikedSafePostIds(new Set())
    setShakingHeartPostId(null)
    setIncorrectZoneTooltip(null)
    setCurrentPopup(null)
    setIsPaused(false)
    setGameComplete(false)
    setSafePostClickCounts({})
    setCurrentPostIndex(0)
    setScrollPhase('scrolling')
    completionTelemetrySentRef.current = false
    return () => {
      if (scrollDelayTimerRef.current) clearTimeout(scrollDelayTimerRef.current)
    }
  }, [
    setCountdownValue,
    setCountdownActive,
    setGameStartTime,
    setScrollPosition,
    setScore,
    setFoundItems,
    setCurrentPopup,
    setIsPaused,
    setGameComplete,
    setSafePostClickCounts,
    setLikedSafePostIds,
    setShakingHeartPostId,
    setIncorrectZoneTooltip,
    setScrollDelayActive,
    setCurrentPostIndex,
    setScrollPhase,
  ])

  const handleCountdownComplete = useCallback(() => {
    setCountdownActive(false)
    setGameStartTime(Date.now())
    emitTelemetryEvent({
      eventType: 'game_session_start',
      sessionId,
      playerId: playerId ?? undefined,
    })
    if (skipScrollDelayRef.current) {
      skipScrollDelayRef.current = false
      setScrollDelayActive(false)
      setScrollPhase('holding')
      startPostTimer()
      return
    }
    setScrollPhase('scrolling')
    setScrollDelayActive(true)
    if (scrollDelayTimerRef.current) clearTimeout(scrollDelayTimerRef.current)
    scrollDelayTimerRef.current = setTimeout(() => {
      setScrollDelayActive(false)
      scrollDelayTimerRef.current = null
    }, 1500)
  }, [
    setCountdownActive,
    setGameStartTime,
    setScrollDelayActive,
    setScrollPhase,
    startPostTimer,
    sessionId,
    playerId,
  ])

  useEffect(() => {
    if (!sessionId || countdownActive || !gameStartTime) return
    const post = posts[currentPostIndex]
    if (!post?.id) return
    emitTelemetryEvent({
      eventType: 'post_turn_start',
      sessionId,
      playerId: playerId ?? undefined,
      stepNumber: currentPostIndex,
      stepId: post.id,
      metadata: {
        postIndex: currentPostIndex,
        postId: post.id,
        postType: post.type,
      },
    })
  }, [sessionId, playerId, countdownActive, gameStartTime, currentPostIndex, posts])

  useEffect(() => {
    if (
      currentPopup?.type !== 'safe' ||
      !sessionId ||
      !currentPopup.data?.post
    )
      return
    const p = currentPopup.data.post
    emitTelemetryEvent({
      eventType: 'safe_feedback_opened',
      sessionId,
      playerId: playerId ?? undefined,
      stepNumber: currentPostIndex,
      stepId: p.id,
      metadata: {
        postId: p.id,
        fromBruteForce: !!currentPopup.data.fromBruteForce,
      },
    })
  }, [currentPopup, sessionId, playerId, currentPostIndex])

  useEffect(() => {
    if (currentPopup?.type !== 'completion' || !sessionId || completionTelemetrySentRef.current)
      return
    completionTelemetrySentRef.current = true
    const cats = new Set(foundItems.map((f) => f.category)).size
    const playingSec =
      gameStartTime != null
        ? Math.round((Date.now() - gameStartTime) / 1000)
        : undefined
    emitTelemetryEvent({
      eventType: 'session_completed',
      sessionId,
      playerId: playerId ?? undefined,
      metadata: {
        score,
        categoriesDistinct: cats,
        safepostDetected: likedSafePostIds?.size ?? 0,
        safepostTotal: posts.filter((p) => p.type === 'safe').length,
        durationPlayingSec: playingSec ?? 0,
        totalPostsInGame: posts.length,
        wonAllCategories: cats >= 5,
      },
    })
  }, [
    currentPopup,
    sessionId,
    playerId,
    foundItems,
    gameStartTime,
    likedSafePostIds,
    posts,
    score,
  ])

  const categoriesFound = new Set(foundItems.map((f) => f.category)).size
  const safepostTotal = posts.filter((p) => p.type === 'safe').length
  const safepostDetected = likedSafePostIds?.size ?? 0

  return (
    <div className="relative flex flex-col items-center h-screen w-full max-w-[920px] mx-auto bg-blue-200 overflow-hidden min-h-0">
      {countdownActive && (
        <CountdownOverlay onComplete={handleCountdownComplete} />
      )}
      {/* Banner + progress - compact to maximize space for post; smaller on phone (≤430px) */}
      <div className="flex flex-col items-center justify-center gap-2 max-[430px]:gap-1 sm:gap-4 p-1.5 max-[430px]:p-2 sm:p-3 bg-yellow-300 rounded-xl mt-1 max-[430px]:mt-0.5 sm:mt-2 shrink-0">
        <h1 className="text-base sm:text-2xl font-bold text-blue-500 shrink-0 max-[430px]:text-l">Digital footprint detective</h1>
        <div className="flex items-center gap-2 max-[430px]:gap-1 sm:gap-6">
          <ProgressBar currentStep={categoriesFound} totalSteps={5} label="categories" />
          {!countdownActive && !currentPopup && (
            <div className="flex items-center gap-2 max-[430px]:gap-1 text-gray-800 font-bold">
              <span className="text-sm max-[430px]:text-xs sm:text-lg">⏱</span>
              <span className="text-base max-[430px]:text-xs sm:text-xl tabular-nums">{postTimerSeconds}s</span>
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-px bg-gray-900 my-1 max-[430px]:my-0.5 sm:my-3 shrink-0" />

      {/* Friends - hidden on short viewports (max-height: 700px) to free space */}
      <div className="shrink-0 px-2">
        <FriendSection />
      </div>

      {/* Main: narrower sidebars on phone (≤430px) so post gets more space */}
      <div className="grid grid-cols-[52px_1fr_68px] sm:grid-cols-[90px_1fr_115px] lg:grid-cols-[100px_1fr_125px] items-stretch w-full flex-1 min-h-0 px-1 max-[430px]:px-1 sm:px-4 py-0.5 sm:py-2 mt-0.5 sm:mt-2 gap-2 max-[430px]:gap-2 sm:gap-6 overflow-hidden">
        <div className="flex justify-center items-start pt-2 max-[430px]:pt-2 sm:pt-8 overflow-y-auto overflow-x-hidden min-w-0">
          <MenuBar />
        </div>

        <div className="flex justify-center items-stretch overflow-hidden min-w-0 min-h-0">
          <FeedContainer />
        </div>

        <div className="flex justify-center items-start pt-2 max-[430px]:pt-2 sm:pt-8 overflow-y-auto overflow-x-hidden min-w-0">
          <MessageBar />
        </div>
      </div>

      {/* Popups driven by currentPopup */}
      {currentPopup?.type === 'unsafe' && currentPopup.data?.post && currentPopup.data?.zone && (
        <UnsafePopup
          post={currentPopup.data.post}
          zone={currentPopup.data.zone}
          onClose={() => {
            const post = currentPopup.data?.post
            emitTelemetryEvent({
              eventType: 'unsafe_feedback_continue',
              sessionId,
              playerId: playerId ?? undefined,
              stepNumber: currentPostIndex,
              stepId: post?.id,
              metadata: post?.id ? { postId: post.id } : {},
            })
            handleUnsafePopupContinue()
          }}
        />
      )}
      {currentPopup?.type === 'safe' && currentPopup.data?.post && (
        <SafePopup
          post={currentPopup.data.post}
          onClose={() => {
            const post = currentPopup.data?.post
            emitTelemetryEvent({
              eventType: 'safe_feedback_continue',
              sessionId,
              playerId: playerId ?? undefined,
              stepNumber: currentPostIndex,
              stepId: post?.id,
              metadata: {
                postId: post?.id,
                fromBruteForce: !!currentPopup.data?.fromBruteForce,
              },
            })
            handleSafePopupContinue()
          }}
        />
      )}
      {currentPopup?.type === 'instruction' && (
        <InstructionPopup onContinue={handleInstructionContinue} />
      )}
      {currentPopup?.type === 'completion' && (
        <GameEndPopup
          onPlayAgain={handlePlayAgain}
          unsafePostsFound={score}
          categoriesFound={categoriesFound}
          safepostDetected={safepostDetected}
          safepostTotal={safepostTotal}
          playAgainLoading={playAgainLoading}
          playAgainError={playAgainError}
        />
      )}

      {/* Feedback tooltip - near cursor for 2 seconds (unsafe: wrong zone; safe: use like button) */}
      {incorrectZoneTooltip && (
        <div
          className="fixed z-50 pointer-events-none px-3 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium shadow-lg max-w-[280px]"
          style={{
            left: incorrectZoneTooltip.x + 12,
            top: incorrectZoneTooltip.y + 12,
          }}
          role="status"
          aria-live="polite"
        >
          {incorrectZoneTooltip.message ?? "That area doesn't contain a privacy risk"}
        </div>
      )}
    </div>
  )
}

export default GamePage