import React, { useState, useEffect, useCallback } from 'react'
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
    posts,
    score,
    countdownActive,
    setCountdownActive,
    setCountdownValue,
    setGameStartTime,
    setScrollPosition,
  } = useGame()

  useEffect(() => {
    setCountdownValue(3)
    setCountdownActive(true)
    setGameStartTime(null)
    setScrollPosition(0)
  }, [setCountdownValue, setCountdownActive, setGameStartTime, setScrollPosition])

  const handleCountdownComplete = useCallback(() => {
    setCountdownActive(false)
    setGameStartTime(Date.now())
  }, [setCountdownActive, setGameStartTime])

  /** Stub: controls popup visibility for design tweaks. */
  const [showUnsafePopup, setShowUnsafePopup] = useState(false)
  const [showSafePopup, setShowSafePopup] = useState(false)

  const unsafePopupData = posts?.find((p) => p.id === 'post5')
  const unsafeZone = unsafePopupData?.dangerZones?.[0]
  const safePopupData = posts?.find((p) => p.id === 'post13')
  const [showGameEndPopup, setShowGameEndPopup] = useState(false)

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

      {/* Stub: toggles to show popups (for design). Remove when game logic is wired. */}
      <div className="flex items-center gap-6 mb-2">
        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800">
          <input
            type="checkbox"
            checked={showUnsafePopup}
            onChange={(e) => setShowUnsafePopup(e.target.checked)}
            className="rounded"
          />
          Show unsafe popup
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800">
          <input
            type="checkbox"
            checked={showSafePopup}
            onChange={(e) => setShowSafePopup(e.target.checked)}
            className="rounded"
          />
          Show safe popup
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800">
          <input
            type="checkbox"
            checked={showGameEndPopup}
            onChange={(e) => setShowGameEndPopup(e.target.checked)}
            className="rounded"
          />
          Show game end popup
        </label>
      </div>

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

      {/* Unsafe popup (blurred background + popup on top) */}
      {showUnsafePopup && unsafePopupData && unsafeZone && (
        <UnsafePopup
          post={unsafePopupData}
          zone={unsafeZone}
          onClose={() => setShowUnsafePopup(false)}
        />
      )}

      {/* Safe popup (blurred background + popup on top) */}
      {showSafePopup && safePopupData && (
        <SafePopup
          post={safePopupData}
          onClose={() => setShowSafePopup(false)}
        />
      )}

      {/* Game end popup */}
      {showGameEndPopup && (
        <GameEndPopup
          onClose={() => setShowGameEndPopup(false)}
        />
      )}
    </div>
  )
}

export default GamePage