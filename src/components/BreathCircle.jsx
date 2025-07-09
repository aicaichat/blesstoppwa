import { useEffect, useState } from 'react'

export default function BreathCircle({ cycles = 2, bpm = 7, onComplete }) {
  const [currentCycle, setCurrentCycle] = useState(0)
  const [phase, setPhase] = useState('inhale') // 'inhale', 'hold', 'exhale'
  const [isActive, setIsActive] = useState(true)

  // Calculate timing based on BPM (breaths per minute)
  const breathDuration = (60 / bpm) * 1000 // milliseconds per breath
  const inhaleDuration = breathDuration * 0.4
  const holdDuration = breathDuration * 0.2
  const exhaleDuration = breathDuration * 0.4

  useEffect(() => {
    if (!isActive || currentCycle >= cycles) {
      if (currentCycle >= cycles) {
        onComplete?.()
      }
      return
    }

    let timer
    
    if (phase === 'inhale') {
      timer = setTimeout(() => setPhase('hold'), inhaleDuration)
    } else if (phase === 'hold') {
      timer = setTimeout(() => setPhase('exhale'), holdDuration)
    } else if (phase === 'exhale') {
      timer = setTimeout(() => {
        setCurrentCycle(prev => prev + 1)
        setPhase('inhale')
      }, exhaleDuration)
    }

    return () => clearTimeout(timer)
  }, [phase, currentCycle, cycles, isActive, inhaleDuration, holdDuration, exhaleDuration, onComplete])

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale': return 1.2
      case 'hold': return 1.2
      case 'exhale': return 0.8
      default: return 1
    }
  }

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return '吸气'
      case 'hold': return '屏息'
      case 'exhale': return '呼气'
      default: return ''
    }
  }

  const getAnimationDuration = () => {
    switch (phase) {
      case 'inhale': return `${inhaleDuration}ms`
      case 'hold': return `${holdDuration}ms`
      case 'exhale': return `${exhaleDuration}ms`
      default: return '1000ms'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#F6AD55"
            strokeWidth="2"
            opacity="0.3"
          />
          
          {/* Animated breathing circle */}
          <circle
            cx="100"
            cy="100"
            r="60"
            fill="rgba(246, 173, 85, 0.2)"
            stroke="#F6AD55"
            strokeWidth="3"
            style={{
              transform: `scale(${getCircleScale()})`,
              transformOrigin: '100px 100px',
              transition: `transform ${getAnimationDuration()} ease-in-out`
            }}
          />
          
          {/* Center dot */}
          <circle
            cx="100"
            cy="100"
            r="4"
            fill="#F6AD55"
          />
        </svg>
        
        {/* Lotus petals decoration */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-chinese text-primary/60">
            🪷
          </div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-2xl font-chinese text-primary">
          {getPhaseText()}
        </h3>
        <p className="text-sm text-gray-600">
          第 {currentCycle + 1} / {cycles} 轮
        </p>
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-500 font-chinese">
          跟随呼吸，放下烦恼
        </p>
        <div className="flex space-x-1">
          {Array.from({ length: cycles }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < currentCycle ? 'bg-primary' : 
                i === currentCycle ? 'bg-primary/60' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}