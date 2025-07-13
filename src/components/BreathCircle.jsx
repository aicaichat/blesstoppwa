import { useState, useEffect } from 'react'

export default function BreathCircle({ cycles = 2, bpm = 7, onComplete }) {
  const [currentCycle, setCurrentCycle] = useState(0)
  const [phase, setPhase] = useState('inhale') // 'inhale', 'hold', 'exhale', 'pause'
  const [isCompleted, setIsCompleted] = useState(false)
  const [breathText, setBreathText] = useState('准备开始')

  // 计算呼吸节奏时间（毫秒）
  const cycleTime = (60 / bpm) * 1000 // 每个呼吸周期的时间
  const inhaleTime = cycleTime * 0.4   // 吸气时间
  const holdTime = cycleTime * 0.1     // 屏息时间
  const exhaleTime = cycleTime * 0.4   // 呼气时间
  const pauseTime = cycleTime * 0.1    // 暂停时间

  useEffect(() => {
    if (isCompleted) return

    const timer = setTimeout(() => {
      setBreathText('开始呼吸')
      startBreathingCycle()
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const startBreathingCycle = () => {
    if (currentCycle >= cycles) {
      setIsCompleted(true)
      setBreathText('呼吸完成')
      setTimeout(() => {
        onComplete?.()
      }, 1000)
      return
    }

    // 开始新的呼吸周期
    breatheIn()
  }

  const breatheIn = () => {
    setPhase('inhale')
    setBreathText('缓慢吸气')
    
    setTimeout(() => {
      holdBreath()
    }, inhaleTime)
  }

  const holdBreath = () => {
    setPhase('hold')
    setBreathText('屏住呼吸')
    
    setTimeout(() => {
      breatheOut()
    }, holdTime)
  }

  const breatheOut = () => {
    setPhase('exhale')
    setBreathText('慢慢呼气')
    
    setTimeout(() => {
      pauseBreath()
    }, exhaleTime)
  }

  const pauseBreath = () => {
    setPhase('pause')
    setBreathText('放松片刻')
    
    setTimeout(() => {
      setCurrentCycle(prev => prev + 1)
      startBreathingCycle()
    }, pauseTime)
  }

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale': return 'scale-110'
      case 'hold': return 'scale-110'
      case 'exhale': return 'scale-90'
      case 'pause': return 'scale-90'
      default: return 'scale-100'
    }
  }

  const getCircleOpacity = () => {
    switch (phase) {
      case 'inhale': return 'opacity-90'
      case 'hold': return 'opacity-95'
      case 'exhale': return 'opacity-70'
      case 'pause': return 'opacity-60'
      default: return 'opacity-80'
    }
  }

  const getAnimationDuration = () => {
    switch (phase) {
      case 'inhale': return { transitionDuration: `${inhaleTime}ms` }
      case 'hold': return { transitionDuration: `${holdTime}ms` }
      case 'exhale': return { transitionDuration: `${exhaleTime}ms` }
      case 'pause': return { transitionDuration: `${pauseTime}ms` }
      default: return { transitionDuration: '1000ms' }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      
      {/* 呼吸圆 */}
      <div className="relative">
        {/* 外层光环 */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-orange-200 to-orange-300 blur-lg transform transition-all ease-in-out ${getCircleScale()} ${getCircleOpacity()}`}
             style={getAnimationDuration()}>
        </div>
        
        {/* 中层圆环 */}
        <div className={`relative w-48 h-48 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 border-4 border-orange-300 transform transition-all ease-in-out ${getCircleScale()} ${getCircleOpacity()}`}
             style={getAnimationDuration()}>
          
          {/* 莲花花瓣装饰 */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white to-orange-50 flex items-center justify-center">
            <div className="text-6xl animate-pulse">🪷</div>
          </div>
          
          {/* 呼吸指示点 */}
          <div className="absolute inset-0 rounded-full">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-3 h-3 bg-orange-400 rounded-full transform transition-all duration-1000 ${
                  phase === 'inhale' ? 'scale-150 opacity-100' : 'scale-100 opacity-60'
                }`}
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-${phase === 'inhale' ? '100px' : '80px'})`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 呼吸指导文字 */}
      <div className="text-center space-y-4">
        <div className="glass-card-soft p-6 min-w-[200px]">
          <h3 className="text-xl font-chinese text-gradient mb-2">
            {breathText}
          </h3>
          
          {/* 进度指示 */}
          <div className="flex justify-center space-x-2 mb-4">
            {[...Array(cycles)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i < currentCycle ? 'bg-orange-500' : 
                  i === currentCycle ? 'bg-orange-400 animate-pulse' : 
                  'bg-orange-200'
                }`}
              />
            ))}
          </div>
          
          {/* 呼吸提示 */}
          <div className="text-sm text-gray-600 space-y-1">
            {phase === 'inhale' && (
              <p>🌸 想象莲花在心中绽放</p>
            )}
            {phase === 'hold' && (
              <p>✨ 感受内心的平静</p>
            )}
            {phase === 'exhale' && (
              <p>🍃 释放所有的焦虑</p>
            )}
            {phase === 'pause' && (
              <p>🧘 享受这份宁静</p>
            )}
            {isCompleted && (
              <p>🙏 内心已获得平静</p>
            )}
          </div>
        </div>
        
        {/* 心经文字 */}
        <div className="max-w-xs mx-auto">
          <p className="text-xs font-chinese text-gray-500 leading-relaxed">
            {phase === 'inhale' && '观自在菩萨，行深般若波罗蜜多时'}
            {phase === 'hold' && '照见五蕴皆空，度一切苦厄'}
            {phase === 'exhale' && '心无挂碍，无挂碍故，无有恐怖'}
            {phase === 'pause' && '远离颠倒梦想，究竟涅槃'}
            {isCompleted && '三世诸佛，依般若波罗蜜多故，得阿耨多罗三藐三菩提'}
          </p>
        </div>
      </div>
      
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 text-2xl opacity-10 animate-pulse">🪷</div>
        <div className="absolute top-3/4 right-1/4 text-2xl opacity-10 animate-pulse delay-1000">🪷</div>
        <div className="absolute bottom-1/4 left-1/3 text-2xl opacity-10 animate-pulse delay-2000">🪷</div>
      </div>
    </div>
  )
}