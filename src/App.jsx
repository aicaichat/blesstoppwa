import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'

// Lazy load pages for better performance
const IntroPage = lazy(() => import('./pages/IntroPage'))
const SelectIntentPage = lazy(() => import('./pages/SelectIntentPage'))
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'))
const EvaluationPage = lazy(() => import('./pages/EvaluationPage'))
const DonationPage = lazy(() => import('./pages/DonationPage'))
const BlessingPage = lazy(() => import('./pages/BlessingPage'))
const EvalPage = lazy(() => import('./pages/EvalPage'))
const GiftPage = lazy(() => import('./pages/GiftPage'))
const SummonPage = lazy(() => import('./pages/SummonPage'))
const BraceletPage = lazy(() => import('./pages/BraceletPage'))

// Particle component
const ParticleBackground = () => {
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.left = Math.random() * 100 + '%'
      particle.style.animationDelay = Math.random() * 6 + 's'
      particle.style.animationDuration = (Math.random() * 3 + 3) + 's'
      
      const particleContainer = document.querySelector('.particle-bg')
      if (particleContainer) {
        particleContainer.appendChild(particle)
        
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle)
          }
        }, 6000)
      }
    }

    const interval = setInterval(createParticle, 300)
    return () => clearInterval(interval)
  }, [])

  return <div className="particle-bg" />
}

// Floating orbs component
const FloatingOrbs = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div 
      className="floating-orb w-64 h-64 bg-deity-purple/20"
      style={{ top: '10%', left: '10%' }}
    />
    <div 
      className="floating-orb w-48 h-48 bg-deity-pink/15"
      style={{ top: '60%', right: '15%' }}
    />
    <div 
      className="floating-orb w-32 h-32 bg-deity-gold/10"
      style={{ bottom: '20%', left: '20%' }}
    />
  </div>
)

// Loading component
const Loading = () => (
  <div className="min-h-screen deity-bg relative overflow-hidden flex items-center justify-center">
    <FloatingOrbs />
    <ParticleBackground />
    <div className="deity-glass-card p-8 relative z-10">
      <div className="deity-aura mb-6">
        <div className="text-6xl mb-4 animate-pulse">✨</div>
      </div>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deity-purple mx-auto mb-4"></div>
      <p className="text-gray-600 text-center font-chinese">神仙朋友正在准备...</p>
    </div>
  </div>
)

function App() {
  return (
    <Router>
      <div className="min-h-screen deity-bg relative overflow-hidden">
        <FloatingOrbs />
        <ParticleBackground />
        <div className="relative z-10">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Navigate to="/bracelet/default" replace />} />
              <Route path="/intro" element={<IntroPage />} />
              <Route path="/select-intent" element={<SelectIntentPage />} />
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/evaluation" element={<EvaluationPage />} />
              <Route path="/donation" element={<DonationPage />} />
              <Route path="/blessing" element={<BlessingPage />} />
              <Route path="/blessing/eval" element={<EvalPage />} />
              <Route path="/blessing/gift" element={<GiftPage />} />
              <Route path="/bracelet/:braceletId" element={<BraceletPage />} />
              <Route path="/summon/:braceletId" element={<SummonPage />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </Router>
  )
}

export default App 