import React, { useEffect } from 'react'
import { useGame } from '../context/GameContext'

/*
CountdownOverlay component displays a countdown timer on the screen.
*/
function CountdownOverlay({ onComplete }) {
  const { countdownValue, setCountdownValue } = useGame()

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownValue((prev) => {
        const next = prev - 1;
        if(next < 0) {
          clearInterval(interval)
          onComplete()
          return 0
        }
        return next;
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [countdownValue, setCountdownValue, onComplete])

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <span className='text-8xl md:text-9xl font-bold text-white drop-shadow-lg tabular-nums'>
        {countdownValue > 0 ? countdownValue : 0}
      </span>
    </div>
  )
}

export default CountdownOverlay
