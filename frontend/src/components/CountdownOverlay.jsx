import React, { useEffect } from 'react'
import { useGame } from '../context/GameContext'

/**
 * Phase A: 3→2→1→0 countdown overlay. Full-screen, dimmed.
 * Uses countdownValue from context; ticks every 1s. At 0, calls onComplete.
 */
function CountdownOverlay({ onComplete }) {
  const { countdownValue, setCountdownValue } = useGame()

  useEffect(() => {
    const id = setInterval(() => {
      setCountdownValue((prev) => {
        const next = prev - 1
        if (next <= 0) {
          onComplete()
          return 0
        }
        return next
      })
    }, 1000)
    return () => clearInterval(id)
  }, [setCountdownValue, onComplete])

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
      aria-live="polite"
      aria-atomic="true"
    >
      <span
        className="text-8xl md:text-9xl font-bold text-white drop-shadow-lg tabular-nums"
        aria-label={`Countdown: ${countdownValue}`}
      >
        {countdownValue > 0 ? countdownValue : 0}
      </span>
    </div>
  )
}

export default CountdownOverlay
