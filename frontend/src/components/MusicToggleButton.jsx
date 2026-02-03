import React from 'react'
import { SiYoutubemusic } from 'react-icons/si'
import { useMusic } from '../context/MusicContext'

export default function MusicToggleButton() {
  const { isPlaying, toggleMusic } = useMusic()

  return (
    <button
      type="button"
      onClick={toggleMusic}
      data-skip-global-click-sound
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-white/90 hover:bg-white shadow-md border border-gray-200 transition-colors"
      aria-label={isPlaying ? 'Mute music' : 'Play music'}
      title={isPlaying ? 'Mute music' : 'Play music'}
    >
      <SiYoutubemusic className={`w-10 h-10 text-red-600 ${isPlaying ? '' : 'opacity-60'}`} />
      <span className="text-base font-semibold text-gray-700">
        {isPlaying ? 'Music on' : 'Toggle on music'}
      </span>
      {!isPlaying && (
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      )}
    </button>
  )
}
