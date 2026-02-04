import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react'
import bgMusicSrc from '../assets/Sound/Background music.mp3'

const MusicContext = createContext(null)

export function MusicProvider({ children }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.volume = 0.4
      audio.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }, [isPlaying])

  const startMusic = useCallback(() => {
    const audio = audioRef.current
    if (!audio || isPlaying) return
    audio.volume = 0.4
    audio.play().then(() => setIsPlaying(true)).catch(() => {})
  }, [isPlaying])

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause()
    }
  }, [])

  const value = { isPlaying, toggleMusic, startMusic }

  return (
    <MusicContext.Provider value={value}>
      <audio
        ref={audioRef}
        src={bgMusicSrc}
        loop
        preload="auto"
        aria-hidden
      />
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error('useMusic must be used inside MusicProvider')
  return ctx
}
