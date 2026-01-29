import { useEffect, useRef } from 'react'
import { useGame } from '../src/context/GameContext.jsx'

const SCROLL_SPEED_PX_PER_FRAME = 1

/**
 * Phase B: Drives vertical auto-scroll of the feed.
 * Uses requestAnimationFrame. Each frame: if !isPaused && !countdownActive && !gameComplete,
 * add SCROLL_SPEED_PX_PER_FRAME to scrollPosition. Stops when scrollPosition >= maxScroll
 * (feed height - viewport height).
 *
 * @param {React.RefObject<HTMLElement>} viewportRef - Ref on the viewport div (overflow hidden)
 * @param {React.RefObject<HTMLElement>} feedInnerRef - Ref on the inner feed div (contains all posts)
 */
function useScroll(viewportRef, feedInnerRef) {
  const {
    setScrollPosition,
    isPaused,
    countdownActive,
    gameComplete,
    scrollDelayActive,
  } = useGame()
  const rafIdRef = useRef(null)

  useEffect(() => {
    const tick = () => {
      const viewport = viewportRef?.current
      const feedInner = feedInnerRef?.current
      if (!viewport || !feedInner) {
        rafIdRef.current = requestAnimationFrame(tick)
        return
      }

      const viewportHeight = viewport.clientHeight
      const feedHeight = feedInner.scrollHeight
      const maxScroll = Math.max(0, feedHeight - viewportHeight)

      const shouldScroll =
        !countdownActive &&
        !scrollDelayActive &&
        !isPaused &&
        !gameComplete &&
        maxScroll > 0

      if (shouldScroll) {
        setScrollPosition((prev) => {
          const next = Math.min(prev + SCROLL_SPEED_PX_PER_FRAME, maxScroll)
          return next
        })
      }

      rafIdRef.current = requestAnimationFrame(tick)
    }

    rafIdRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [
    viewportRef,
    feedInnerRef,
    countdownActive,
    scrollDelayActive,
    isPaused,
    gameComplete,
    setScrollPosition,
  ])
}

export default useScroll
