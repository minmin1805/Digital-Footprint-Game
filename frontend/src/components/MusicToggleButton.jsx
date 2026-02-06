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
      className="fixed top-3 right-3 max-[430px]:top-1.5 max-[430px]:right-1.5 z-50 flex items-center gap-1.5 max-[430px]:gap-0 px-2.5 py-2 max-[430px]:px-1 max-[430px]:py-0.5 rounded-lg max-[430px]:rounded-md bg-white/90 hover:bg-white shadow-md border border-gray-200 transition-colors"
      aria-label={isPlaying ? 'Mute music' : 'Play music'}
      title={isPlaying ? 'Mute music' : 'Play music'}
    >
      <SiYoutubemusic className={`w-7 h-7 max-[430px]:w-4 max-[430px]:h-4 text-red-600 ${isPlaying ? '' : 'opacity-60'}`} />
      <span className="text-sm max-[430px]:hidden font-semibold text-gray-700">
        {isPlaying ? 'Music on' : 'Toggle on music'}
      </span>
      {!isPlaying && (
        <svg className="w-4 h-4 max-[430px]:hidden text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      )}
    </button>
  )
}
