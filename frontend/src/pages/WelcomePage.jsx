import React from 'react'
import detectivekid from '../assets/GamePage/EndGamePopup/detectivekid.png'
import welcomebanner from '../assets/WelcomePage/welcomebanner.png'
import useWelcomePage from '../../hooks/useWelcomePage.js'
import glass from '../assets/WelcomePage/glass.png'
import magnifyingglass from '../assets/WelcomePage/glass.png'

function WelcomePage() {
  const { username, setUsername, handleStart, playerError } = useWelcomePage()

  return (
    <div className="min-h-screen w-full bg-blue-200">
      <div className="flex flex-col items-center px-4 pt-6 pb-12">
        {/* Golden banner */}
        <img
          src={welcomebanner}
          alt=""
          className="w-full max-w-[40%] object-contain mx-auto"
          aria-hidden
        />

        {/* Instructional text */}
        <div className="flex flex-col items-center gap-1 mt-4 text-blue-900 font-semibold text-lg">
          <div className="flex items-center gap-2">
            <img src={magnifyingglass} alt="magnifyingglass" className="w-10 h-10 text-blue-800 shrink-0" />
            <span className="text-2xl">Spot unsafe posts.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">Protect your digital life.</span>
          </div>
        </div>

        {/* Detective character */}
        <img
          src={detectivekid}
          alt=""
          className="w-100 h-100 max-w-[40%] object-contain mt-6"
          aria-hidden
        />

        {/* Input card */}
        <div className="w-full max-w-md -mt-6 relative z-10 bg-amber-50 rounded-3xl border-4 border-amber-700/80 shadow-lg px-6 py-6">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-3">
            Detective Name
          </h2>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 bg-amber-50/80 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-300 focus:outline-none transition"
          />
          <p className="text-sm text-gray-500 mt-2 text-center">
            This name will appear in your investigation.
          </p>
          {playerError && (
            <p className="text-red-600 text-sm mt-2 text-center">{playerError}</p>
          )}
          <button
            type="button"
            onClick={handleStart}
            className="w-full mt-4 py-3.5 rounded-2xl bg-green-500 text-white font-bold text-lg shadow-md border-2 border-amber-400 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition"
          >
            Start Investigating!
          </button>
          <div className="flex items-center justify-center gap-2 mt-4 text-blue-900 font-medium text-sm">
            <span>Find unsafe posts across 5 privacy categories.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage
