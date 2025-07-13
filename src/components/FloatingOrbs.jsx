import React from 'react'
import { Parallax } from 'react-scroll-parallax'

export default function FloatingOrbs() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <Parallax speed={-10} className="floating-orb w-64 h-64 bg-deity-purple/20 absolute" style={{ top: '10%', left: '10%' }} />
      <Parallax speed={5} className="floating-orb w-48 h-48 bg-deity-pink/15 absolute" style={{ top: '60%', right: '15%' }} />
      <Parallax speed={-4} className="floating-orb w-32 h-32 bg-deity-gold/10 absolute" style={{ bottom: '20%', left: '20%' }} />
    </div>
  )
} 
 