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
import CountdownOverlay from '../components/CountdownOverlay'

function GamePage() {
  const navigate = useNavigate()
  const [playAgainLoading, setPlayAgainLoading] = useState(false)
  const [playAgainError, setPlayAgainError] = useState(null)
  const {
    playerId,
    score,
    foundItems,
    gameStartTime,
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
    setScrollDelayActive,
    currentPopup,
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

      await updatePlayer(playerId, {
        score,
        totalPossible: 5,
        categoriesFound,
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
    gameStartTime,
    handleCompletionClose,
    navigate,
  ])

  const scrollDelayTimerRef = useRef(null)

  useEffect(() => {
    setCountdownValue(3)
    setCountdownActive(true)
    setGameStartTime(null)
    setScrollPosition(0)
    setScrollDelayActive(false)
    setScore(0)
    setFoundItems([])
    setCurrentPopup(null)
    setIsPaused(false)
    setGameComplete(false)
    setSafePostClickCounts({})
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
    setScrollDelayActive,
  ])

  const handleCountdownComplete = useCallback(() => {
    setCountdownActive(false)
    setGameStartTime(Date.now())
    setScrollDelayActive(true)
    if (scrollDelayTimerRef.current) clearTimeout(scrollDelayTimerRef.current)
    scrollDelayTimerRef.current = setTimeout(() => {
      setScrollDelayActive(false)
      scrollDelayTimerRef.current = null
    }, 1500)
  }, [setCountdownActive, setGameStartTime, setScrollDelayActive])

  const categoriesFound = new Set(foundItems.map((f) => f.category)).size

  return (
    <div className="relative flex flex-col items-center h-screen w-[55%] mx-auto bg-blue-200 overflow-hidden">
      {countdownActive && (
        <CountdownOverlay onComplete={handleCountdownComplete} />
      )}
      {/* Banner + progress */}
      <div className="flex flex-col items-center justify-center p-4 gap-4 bg-yellow-300 rounded-xl mt-3">
        <h1 className="text-3xl font-bold text-center text-blue-500">Digital footprint detective</h1>
        <ProgressBar currentStep={categoriesFound} totalSteps={5} label="categories" />
      </div>

      <div className="w-full h-px bg-gray-900 my-4" />

      {/* Friends */}
      <div>
        <FriendSection />
      </div>

      {/* Main: MenuBar | Feed (scrollable) | MessageBar */}
      <div className="flex items-stretch justify-between w-full flex-1 min-h-0 p-5 mt-2">
        <div className="shrink-0">
          <MenuBar />
        </div>

        <div className="flex-1 min-w-0 flex justify-center items-stretch overflow-hidden">
          <FeedContainer />
        </div>

        <div className="shrink-0">
          <MessageBar />
        </div>
      </div>

      {/* Popups driven by currentPopup */}
      {currentPopup?.type === 'unsafe' && currentPopup.data?.post && currentPopup.data?.zone && (
        <UnsafePopup
          post={currentPopup.data.post}
          zone={currentPopup.data.zone}
          onClose={handleUnsafePopupContinue}
        />
      )}
      {currentPopup?.type === 'safe' && currentPopup.data?.post && (
        <SafePopup
          post={currentPopup.data.post}
          onClose={handleSafePopupContinue}
        />
      )}
      {currentPopup?.type === 'completion' && (
        <GameEndPopup
          onPlayAgain={handlePlayAgain}
          unsafePostsFound={score}
          playAgainLoading={playAgainLoading}
          playAgainError={playAgainError}
        />
      )}
    </div>
  )
}

export default GamePage