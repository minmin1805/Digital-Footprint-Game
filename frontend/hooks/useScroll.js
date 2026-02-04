import { useEffect, useRef } from 'react'
import { useGame } from '../src/context/GameContext.jsx'

const SCROLL_SPEED_PX_PER_FRAME = 6
const TARGET_TOLERANCE_PX = 2

function useScroll(viewportRef, feedInnerRef) {
  const {
    setScrollPosition,
    countdownActive,
    gameComplete,
    scrollDelayActive,
    scrollPhase,
    currentPostIndex,
    onScrollReachedTarget,
  } = useGame()
  const rafIdRef = useRef(null)
  const hasReachedTargetRef = useRef(false)

  useEffect(() => {
    hasReachedTargetRef.current = false
  }, [currentPostIndex])

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

      const children = feedInner.children
      let targetScroll = 0
      if (children && currentPostIndex < children.length) {
        const postEl = children[currentPostIndex]
        const postTop = postEl.offsetTop
        const postHeight = postEl.offsetHeight
        // Align post TOP with viewport top so head/username is visible on small screens
        // (centering cut off top/bottom when viewport < post height)
        const topPadding = 8
        targetScroll = Math.max(
          0,
          Math.min(maxScroll, postTop - topPadding)
        )
      }

      const shouldScroll =
        !countdownActive &&
        !scrollDelayActive &&
        !gameComplete &&
        scrollPhase === 'scrolling' &&
        maxScroll > 0

      if (shouldScroll) {
        setScrollPosition((prev) => {
          const diff = targetScroll - prev
          const step = Math.sign(diff) * Math.min(SCROLL_SPEED_PX_PER_FRAME, Math.abs(diff))
          const next = Math.max(0, Math.min(prev + step, maxScroll))

          if (Math.abs(next - targetScroll) <= TARGET_TOLERANCE_PX && !hasReachedTargetRef.current) {
            hasReachedTargetRef.current = true
            onScrollReachedTarget()
          }
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
    gameComplete,
    scrollPhase,
    currentPostIndex,
    setScrollPosition,
    onScrollReachedTarget,
  ])
}

export default useScroll
