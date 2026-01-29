import React, { useEffect, useCallback } from 'react'
import { useGame } from '../context/GameContext'
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
  const {
    score,
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
    currentPopup,
    handleUnsafePopupContinue,
    handleSafePopupContinue,
    handleCompletionClose,
  } = useGame()

  useEffect(() => {
    setCountdownValue(3)
    setCountdownActive(true)
    setGameStartTime(null)
    setScrollPosition(0)
    setScore(0)
    setFoundItems([])
    setCurrentPopup(null)
    setIsPaused(false)
    setGameComplete(false)
    setSafePostClickCounts({})
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
  ])

  const handleCountdownComplete = useCallback(() => {
    setCountdownActive(false)
    setGameStartTime(Date.now())
  }, [setCountdownActive, setGameStartTime])

  return (
    <div className="relative flex flex-col items-center h-screen w-[55%] mx-auto bg-blue-200 overflow-hidden">
      {countdownActive && (
        <CountdownOverlay onComplete={handleCountdownComplete} />
      )}
      {/* Banner + progress */}
      <div className="flex flex-col items-center justify-center p-4 gap-4 bg-yellow-300 rounded-xl mt-3">
        <h1 className="text-3xl font-bold text-center text-blue-500">Digital footprint detective</h1>
        <ProgressBar currentStep={score} totalSteps={8} />
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
        <GameEndPopup onClose={handleCompletionClose} />
      )}
    </div>
  )
}

export default GamePage