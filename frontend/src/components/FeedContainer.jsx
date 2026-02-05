import React, { useRef } from 'react'
import { useGame } from '../context/GameContext'
import useScroll from '../../hooks/useScroll.js'
import Post from './Post'


function FeedContainer() {
  const { posts, scrollPosition, handleCorrectClick } = useGame()
  const viewportRef = useRef(null)
  const feedInnerRef = useRef(null)

  useScroll(viewportRef, feedInnerRef)

  if (!posts?.length) {
    return (
      <div className="flex-1 min-w-0 flex items-center justify-center text-gray-500">
        No posts
      </div>
    )
  }

  return (
    <div
      ref={viewportRef}
      className="w-full min-w-0 max-w-[330px] sm:max-w-[400px] lg:max-w-[440px] h-full min-h-0 overflow-hidden flex justify-center items-start mx-auto"
    >
      <div
        ref={feedInnerRef}
        className="flex flex-col items-center gap-6 sm:gap-12 lg:gap-16 py-1 sm:py-4 w-full max-w-[330px] sm:max-w-[400px] lg:max-w-[440px] shrink-0"
        style={{ transform: `translateY(-${scrollPosition}px)` }}
      >
        {posts.map((post) => (
          <div key={post.id} className="w-full flex justify-center shrink-0">
            <Post
              post={post}
              onCorrectClick={handleCorrectClick}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeedContainer
