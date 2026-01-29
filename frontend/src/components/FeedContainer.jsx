import React, { useRef } from 'react'
import { useGame } from '../context/GameContext'
import useScroll from '../../hooks/useScroll.js'
import Post from './Post'


function FeedContainer() {
  const { posts, scrollPosition, handleCorrectClick, handleIncorrectClick } = useGame()
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
      className="w-full max-w-[600px] h-full min-h-0 overflow-hidden flex justify-center items-start"
    >
      <div
        ref={feedInnerRef}
        className="flex flex-col items-center gap-6 py-4 w-full max-w-[600px] shrink-0"
        style={{ transform: `translateY(-${scrollPosition}px)` }}
      >
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onCorrectClick={handleCorrectClick}
            onIncorrectClick={handleIncorrectClick}
          />
        ))}
      </div>
    </div>
  )
}

export default FeedContainer
