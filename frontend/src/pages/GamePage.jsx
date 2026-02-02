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
    if (skipScrollDelayRef.current) {
      skipScrollDelayRef.current = false
      setScrollDelayActive(false)
      return
    }
    setScrollDelayActive(true)
    if (scrollDelayTimerRef.current) clearTimeout(scrollDelayTimerRef.current)
    scrollDelayTimerRef.current = setTimeout(() => {
      setScrollDelayActive(false)
      scrollDelayTimerRef.current = null
    }, 1500)
  }, [setCountdownActive, setGameStartTime, setScrollDelayActive])

  const categoriesFound = new Set(foundItems.map((f) => f.category)).size

  return (
    <div className="relative flex flex-col items-center h-screen w-full max-w-[920px] mx-auto bg-blue-200 overflow-hidden">
      {countdownActive && (
        <CountdownOverlay onComplete={handleCountdownComplete} />
      )}
      {/* Banner + progress */}
      <div className="flex flex-col items-center justify-center p-3 gap-2 bg-yellow-300 rounded-xl mt-2">
        <h1 className="text-2xl font-bold text-center text-blue-500">Digital footprint detective</h1>
        <ProgressBar currentStep={categoriesFound} totalSteps={5} label="categories" />
      </div>

      <div className="w-full h-px bg-gray-900 my-4" />

      {/* Friends */}
      <div>
        <FriendSection />
      </div>

      {/* Main: fixed sidebar widths + gap prevents sticking; identical local + remote */}
      <div className="grid grid-cols-[100px_1fr_100px] items-stretch w-full flex-1 min-h-0 px-4 py-2 mt-2 gap-6">
        <div className="flex justify-center items-start pt-8 overflow-hidden min-w-0">
          <MenuBar />
        </div>

        <div className="flex justify-center items-stretch overflow-hidden min-w-0">
          <FeedContainer />
        </div>

        <div className="flex justify-center items-start pt-8 overflow-hidden min-w-0">
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
      {currentPopup?.type === 'instruction' && (
        <InstructionPopup onContinue={handleInstructionContinue} />
      )}
      {currentPopup?.type === 'completion' && (
        <GameEndPopup
          onPlayAgain={handlePlayAgain}
          unsafePostsFound={score}
          categoriesFound={categoriesFound}
          playAgainLoading={playAgainLoading}
          playAgainError={playAgainError}
        />
      )}
    </div>
  )
}

export default GamePage