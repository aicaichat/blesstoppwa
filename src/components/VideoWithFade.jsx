import React, { useState } from 'react'

export default function VideoWithFade({ src, title = '', poster }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative w-full mb-6">
      {title && (
        <h3 className="text-xl md:text-2xl font-chinese text-deity-gradient mb-4 text-center tracking-wide">
          {title}
        </h3>
      )}
      <video
        preload="metadata"
        poster={poster}
        controls
        playsInline
        className={`w-full rounded-xl shadow-xl transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoadedData={() => setLoaded(true)}
      >
        <source src={src} type="video/mp4" />
        您的浏览器不支持 video 标签。
      </video>
    </div>
  )
} 
 