import React, { useCallback } from 'react'
import {
  getImageRelativeClick,
  toOriginalCoords,
  isPointInZone,
} from '../lib/clickDetection'
import { useGame } from '../context/GameContext'

const CAPTION_DANGER_IDS = ['post6', 'post9']

function Post({ post, onCorrectClick }) {
  const { handleHeartClick, likedSafePostIds, shakingHeartPostId, handleIncorrectZoneClick, handleSafePostImageClick } = useGame()
  const { username, imageUrl, likes, comments, caption, tags = [] } = post
  const tagString = Array.isArray(tags) ? tags.join(' ') : ''
  const zones = post.dangerZones ?? []
  const orig = zones[0]
  const isCaptionDanger = CAPTION_DANGER_IDS.includes(post.id)

  const handleImageClick = useCallback(
    (ev) => {
      if (!onCorrectClick) return
      if (isCaptionDanger) {
        handleIncorrectZoneClick?.(ev)
        return
      }

      const el = ev.currentTarget
      const { x: relX, y: relY } = getImageRelativeClick(ev, el)
      const displayW = el.offsetWidth
      const displayH = el.offsetHeight

      if (zones.length > 0 && orig) {
        const { x: origX, y: origY } = toOriginalCoords(
          relX,
          relY,
          displayW,
          displayH,
          orig.originalWidth,
          orig.originalHeight
        )
        for (const zone of zones) {
          if (isPointInZone(origX, origY, zone)) {
            onCorrectClick(post, zone)
            return
          }
        }
        if (post.type === 'danger') {
          handleIncorrectZoneClick?.(ev)
          return
        }
      }
    },
    [post, zones, orig, isCaptionDanger, onCorrectClick, handleIncorrectZoneClick]
  )

  const handleCaptionClick = useCallback(() => {
    if (!onCorrectClick || !zones.length || !isCaptionDanger) return
    onCorrectClick(post, zones[0])
  }, [post, zones, isCaptionDanger, onCorrectClick])

  const handleCaptionDangerPostClick = useCallback(
    (ev) => {
      if (!isCaptionDanger || post.type !== 'danger') return
      if (ev.target.closest('[data-caption-danger]')) return
      handleIncorrectZoneClick?.(ev)
    },
    [isCaptionDanger, post.type, handleIncorrectZoneClick]
  )

  const isSafe = post.type === 'safe'
  const isLiked = likedSafePostIds?.has(post.id)
  const isShaking = shakingHeartPostId === post.id

  return (
    <article
      className={`w-full max-w-[600px] shrink-0 bg-white rounded-2xl border border-gray-800 overflow-hidden shadow-sm ${isSafe || isCaptionDanger ? 'cursor-pointer' : ''}`}
      {...(isCaptionDanger && { onClick: handleCaptionDangerPostClick })}
    >
      {/* Header: avatar + username - compact on small screens */}
      <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1 sm:py-2">
        <div
          className="w-7 h-7 sm:w-9 sm:h-9 rounded-full shrink-0 bg-gradient-to-tl from-green-400 via-yellow-300 to-sky-300"
          aria-hidden
        />
        <span className="font-semibold text-gray-900 text-xs sm:text-sm">{username}</span>
      </div>
      <div className='w-full h-px bg-gray-900 my-0.5 sm:my-1.5'></div>

      {/* Main image — shorter aspect on small screens so post fits viewport */}
      <div
        className="relative w-full aspect-[3/2] sm:aspect-[4/3] lg:aspect-square bg-gray-100 cursor-pointer"
        onClick={isSafe ? (ev) => handleSafePostImageClick?.(post, ev) : handleImageClick}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>
      <div className='w-full h-px bg-gray-900 my-0.5 sm:my-1.5'></div>

      {/* Footer: icons + counts + caption */}
      <div className="px-2 sm:px-3 py-1 sm:py-2 space-y-1 sm:space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-skip-global-click-sound
              onClick={(ev) => handleHeartClick?.(post, ev)}
              className={`flex items-center gap-1.5 p-1 -m-1 rounded-full hover:bg-gray-100 cursor-pointer ${isShaking ? 'animate-shake-wrong' : ''}`}
              aria-label="Like - I think this post is safe"
            >
              <svg
                className={`w-7 h-7 transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-800'}`}
                fill={isLiked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {typeof likes === 'number' && (
                <span className="text-base font-medium text-gray-700">{likes + (isLiked ? 1 : 0)}</span>
              )}
            </button>
            <button type="button" className="flex items-center gap-1.5 p-1 -m-1 rounded-full hover:bg-gray-100" aria-label="Comment">
              <svg className="w-7 h-7 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>      
              {typeof comments === 'number' && (
                <span className="text-base font-medium text-gray-700">{comments}</span>
              )}
            </button>
            <button type="button" className="p-1 -m-1 rounded-full hover:bg-gray-100" aria-label="Share">
              <svg className="w-7 h-7 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <button type="button" className="p-1 -m-1 rounded-full hover:bg-gray-100" aria-label="Save">
            <svg className="w-7 h-7 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {caption && (
          isCaptionDanger ? (
            <div
              data-caption-danger
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); handleCaptionClick() }}
              onKeyDown={(e) => e.key === 'Enter' && handleCaptionClick()}
              className="text-xs sm:text-base text-gray-800 leading-snug break-words cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 rounded"
            >
              {caption}
              {tagString && (
                <span className="text-gray-500"> {tagString}</span>
              )}
            </div>
          ) : (
            <p className="text-xs sm:text-base text-gray-800 leading-snug break-words">
              {caption}
              {tagString && (
                <span className="text-gray-500"> {tagString}</span>
              )}
            </p>
          )
        )}
      </div>
    </article>
  )
}

export default Post
