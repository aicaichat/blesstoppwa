import { useEffect } from 'react'

export default function ParticleBackground() {
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.left = Math.random() * 100 + '%'
      particle.style.animationDelay = Math.random() * 6 + 's'
      particle.style.animationDuration = Math.random() * 3 + 3 + 's'

      const container = document.querySelector('.particle-bg')
      if (container) {
        container.appendChild(particle)
        setTimeout(() => particle.remove(), 6000)
      }
    }
    const id = setInterval(createParticle, 300)
    return () => clearInterval(id)
  }, [])

  return <div className="particle-bg pointer-events-none" />
} 
 