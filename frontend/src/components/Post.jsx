import React, { useCallback } from 'react'
import {
  getImageRelativeClick,
  toOriginalCoords,
  isPointInZone,
} from '../lib/clickDetection'

const CAPTION_DANGER_IDS = ['post6', 'post9']

function Post({ post, onCorrectClick, onIncorrectClick }) {
  const { username, imageUrl, likes, comments, caption, tags = [] } = post
  const tagString = Array.isArray(tags) ? tags.join(' ') : ''
  const zones = post.dangerZones ?? []
  const orig = zones[0]
  const isCaptionDanger = CAPTION_DANGER_IDS.includes(post.id)

  const handleImageClick = useCallback(
    (ev) => {
      if (!onCorrectClick || !onIncorrectClick) return
      if (isCaptionDanger) return

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
        if (post.type === 'danger') return
      }

      if (post.type === 'safe') {
        onIncorrectClick(post)
      }
    },
    [post, zones, orig, isCaptionDanger, onCorrectClick, onIncorrectClick]
  )

  const handleCaptionClick = useCallback(() => {
    if (!onCorrectClick || !zones.length || !isCaptionDanger) return
    onCorrectClick(post, zones[0])
  }, [post, zones, isCaptionDanger, onCorrectClick])

  const handleSafePostClick = useCallback(() => {
    if (onIncorrectClick) onIncorrectClick(post)
  }, [post, onIncorrectClick])

  const isSafe = post.type === 'safe'

  return (
    <article
      className={`w-full max-w-[600px] shrink-0 bg-white rounded-2xl border border-gray-800 overflow-hidden shadow-sm ${isSafe ? 'cursor-pointer' : ''}`}
      {...(isSafe && { onClick: handleSafePostClick })}
    >
      {/* Header: avatar + username */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div
          className="w-10 h-10 rounded-full shrink-0 bg-gradient-to-tl from-green-400 via-yellow-300 to-sky-300"
          aria-hidden
        />
        <span className="font-semibold text-gray-900">{username}</span>
      </div>
      <div className='w-full h-[1px] bg-gray-900 my-2'></div>

      {/* Main image — clickable for zone hit-test (danger posts only); safe posts use whole-post click */}
      <div
        className={`relative w-full aspect-square bg-gray-100 ${!isSafe ? 'cursor-pointer' : ''}`}
        {...(!isSafe && { onClick: handleImageClick })}
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
      <div className='w-full h-[1px] bg-gray-900 my-2'></div>

      {/* Footer: icons + counts + caption */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button type="button" className="flex items-center gap-1.5 p-1 -m-1 rounded-full hover:bg-gray-100" aria-label="Like">
              <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {typeof likes === 'number' && (
                <span className="text-lg font-medium text-gray-700">{likes}</span>
              )}
            </button>
            <button type="button" className="flex items-center gap-1.5 p-1 -m-1 rounded-full hover:bg-gray-100" aria-label="Comment">
              <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>      
              {typeof comments === 'number' && (
                <span className="text-lg font-medium text-gray-700">{comments}</span>
              )}
            </button>
            <button type="button" className="p-1 -m-1 rounded-full hover:bg-gray-100" aria-label="Share">
              <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <button type="button" className="p-1 -m-1 rounded-full hover:bg-gray-100" aria-label="Save">
            <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {caption && (
          isCaptionDanger ? (
            <div
              role="button"
              tabIndex={0}
              onClick={handleCaptionClick}
              onKeyDown={(e) => e.key === 'Enter' && handleCaptionClick()}
              className="text-lg text-gray-800 leading-snug break-words cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 rounded"
            >
              {caption}
              {tagString && (
                <span className="text-gray-500"> {tagString}</span>
              )}
            </div>
          ) : (
            <p className="text-lg text-gray-800 leading-snug break-words">
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
