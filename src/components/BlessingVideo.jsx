import { useRef, useEffect, useState } from 'react'
import BreathCircle from './BreathCircle'

export default function BlessingVideo({ theme, language, onComplete }) {
  const videoRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showBreathCircle, setShowBreathCircle] = useState(false)
  const [longPressTimer, setLongPressTimer] = useState(null)
  const [showSkipHint, setShowSkipHint] = useState(false)
  const [videoError, setVideoError] = useState(false)

  const posterUrl = `/videos/${theme}/poster.webp`
  const hlsUrl = `/videos/${theme}/${language}/index.m3u8`

  useEffect(() => {
    // For development, skip video and go directly to breath circle after 3 seconds
    const devTimer = setTimeout(() => {
      console.log('Development mode: skipping to breath circle')
      setShowBreathCircle(true)
    }, 3000)

    const video = videoRef.current
    if (!video) return () => clearTimeout(devTimer)

    const handleLoadedData = () => {
      setIsLoading(false)
      clearTimeout(devTimer)
    }

    const handleEnded = () => {
      setShowBreathCircle(true)
      clearTimeout(devTimer)
    }

    const handleError = () => {
      console.log('Video load error, showing breath circle')
      setVideoError(true)
      setShowBreathCircle(true)
      clearTimeout(devTimer)
    }

    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)

    return () => {
      clearTimeout(devTimer)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
    }
  }, [])

  const handleLongPressStart = () => {
    setShowSkipHint(true)
    const timer = setTimeout(() => {
      setShowBreathCircle(true)
    }, 400)
    setLongPressTimer(timer)
  }

  const handleLongPressEnd = () => {
    setShowSkipHint(false)
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
  }

  const handleBreathComplete = () => {
    onComplete?.()
  }

  if (showBreathCircle) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <BreathCircle 
          cycles={2} 
          bpm={7} 
          onComplete={handleBreathComplete}
        />
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="glass-card p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-gray-600 mb-2">准备布施视频...</p>
            <p className="text-xs text-gray-500">开发模式将自动跳转到呼吸练习</p>
          </div>
        </div>
      )}
      
      {/* Poster image as background */}
      <div 
        className="absolute inset-0 bg-cover bg-center rounded-lg"
        style={{
          backgroundImage: `url(${posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-lg relative z-10"
        poster={posterUrl}
        autoPlay
        playsInline
        muted
        onTouchStart={handleLongPressStart}
        onTouchEnd={handleLongPressEnd}
        onMouseDown={handleLongPressStart}
        onMouseUp={handleLongPressEnd}
        onMouseLeave={handleLongPressEnd}
        style={{ display: videoError ? 'none' : 'block' }}
      >
        <source src={hlsUrl} type="application/x-mpegURL" />
        <source src={`/videos/${theme}/${language}/fallback.mp4`} type="video/mp4" />
      </video>

      {/* Development overlay */}
      {!showBreathCircle && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
          <div className="glass-card p-6 text-center">
            <div className="text-4xl mb-4">🪷</div>
            <p className="text-lg font-chinese text-primary mb-2">观音布施</p>
            <p className="text-sm text-gray-600 mb-4">
              {theme} · {language}
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>长按屏幕可跳过</p>
              <p>开发模式自动跳转中...</p>
            </div>
          </div>
        </div>
      )}

      {showSkipHint && (
        <div className="absolute top-4 right-4 glass-card px-3 py-1 z-20">
          <p className="text-sm text-gray-600">继续长按跳过</p>
        </div>
      )}
    </div>
  )
} 