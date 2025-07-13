import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import BlessingVideo from '../components/BlessingVideo'
import BreathCircle from '../components/BreathCircle'
import useBraceletProfile from '../hooks/useBraceletProfile'

export default function BlessingPage() {
  const [currentStep, setCurrentStep] = useState('intro')
  const [isVisible, setIsVisible] = useState(false)
  const { profile, loading, error } = useBraceletProfile()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleVideoComplete = () => {
    setCurrentStep('breathing')
  }

  const handleBreathingComplete = () => {
    setCurrentStep('completed')
  }

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="deity-glass-card p-8 text-center">
          <div className="deity-aura mb-6">
            <div className="guanyin-container w-24 h-24 mx-auto mb-4">
              <img 
                src="https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/%E5%8D%83%E6%89%8B%E8%A7%82%E9%9F%B3.jpg" 
                alt="千手观音" 
                className="guanyin-image animate-pulse"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.parentNode.innerHTML = '<div class="text-6xl animate-pulse">🙏</div>'
                }}
              />
            </div>
          </div>
          <p className="text-xl font-chinese text-deity-gradient">
            神仙朋友正在为您准备专属体验...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="deity-glass-card p-8 text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-chinese text-deity-gradient mb-4">连接中断</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="deity-button"
          >
            重新连接
          </button>
        </div>
      </div>
    )
  }

  if (currentStep === 'completed') {
    return <Navigate to="/blessing/eval" replace />
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景装饰 - 神仙朋友风格 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl opacity-10 animate-pulse">✨</div>
        <div className="absolute top-20 right-20 text-3xl opacity-15 animate-pulse delay-1000">🌟</div>
        <div className="absolute bottom-20 left-20 text-5xl opacity-10 animate-pulse delay-2000">💫</div>
        <div className="absolute bottom-10 right-10 text-3xl opacity-20 animate-pulse delay-3000">⭐</div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* 顶部进度指示 */}
          <div className="text-center mb-8">
            <div className="deity-glass-card p-4 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-4 mb-2">
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentStep === 'intro' ? 'bg-deity-purple scale-125 shadow-deity-glow' : 'bg-gray-300'
                }`}></div>
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentStep === 'breathing' ? 'bg-deity-pink scale-125 shadow-deity-glow' : 'bg-gray-300'
                }`}></div>
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentStep === 'completed' ? 'bg-deity-gold scale-125 shadow-deity-glow' : 'bg-gray-300'
                }`}></div>
              </div>
              <p className="text-sm font-chinese text-gray-600">
                {currentStep === 'intro' && '神仙显现'}
                {currentStep === 'breathing' && '静心守护'}
                {currentStep === 'completed' && '体验完成'}
              </p>
            </div>
          </div>

          {/* 主要内容区域 */}
          <div className="max-w-lg mx-auto">
            
            {/* 介绍阶段 */}
            {currentStep === 'intro' && (
              <div className="deity-glass-card p-6 text-center deity-decoration">
                <div className="mb-6">
                  {/* 千手观音显现 */}
                  <div className="deity-aura mb-6">
                    <div className="guanyin-container w-32 h-32 mx-auto mb-4">
                      <img 
                        src="https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/%E5%8D%83%E6%89%8B%E8%A7%82%E9%9F%B3.jpg" 
                        alt="千手观音" 
                        className="guanyin-image"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.parentNode.innerHTML = '<div class="text-8xl animate-pulse">🙏</div>'
                        }}
                      />
                    </div>
                  </div>
                  
                  <h1 className="text-3xl font-chinese text-deity-shine mb-4">
                    千手观音 · 神仙显现
                  </h1>
                  <p className="text-gray-600 leading-relaxed">
                    您的专属神仙朋友已经到达
                    <br />
                    准备为您带来个性化的守护体验
                  </p>
                </div>

                {/* 个性化信息 */}
                {profile && (
                  <div className="gradient-border-card mb-6">
                    <div className="gradient-border-inner">
                      <div className="flex items-center justify-center space-x-4">
                        <div className="text-center">
                          <div className="text-sm text-gray-500">守护主题</div>
                          <div className="font-chinese text-deity-gradient">{profile.theme}</div>
                        </div>
                        <div className="w-px h-8 bg-gray-300"></div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500">心境状态</div>
                          <div className="font-chinese text-deity-gradient">{profile.mood}</div>
                        </div>
                        <div className="w-px h-8 bg-gray-300"></div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500">功德值</div>
                          <div className="font-chinese text-deity-gradient">{profile.meritPoints}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <BlessingVideo 
                  theme={profile?.theme || 'guanyin'}
                  language={profile?.language || 'zh'}
                  onComplete={handleVideoComplete}
                />
              </div>
            )}

            {/* 呼吸阶段 */}
            {currentStep === 'breathing' && (
              <div className="deity-glass-card p-8 text-center deity-decoration">
                <div className="mb-8">
                  <h2 className="text-2xl font-chinese text-deity-gradient mb-4">
                    神仙守护 · 静心呼吸
                  </h2>
                  <p className="text-gray-600">
                    跟随千手观音的慈悲之光，让心灵获得平静
                  </p>
                </div>

                <div className="mb-8">
                  <BreathCircle 
                    cycles={2} 
                    bpm={7} 
                    onComplete={handleBreathingComplete}
                  />
                </div>

                {/* 呼吸指导 */}
                <div className="gradient-border-card">
                  <div className="gradient-border-inner">
                    <div className="text-sm text-gray-600 space-y-2">
                      <p>✨ 吸气时，感受神仙的守护能量</p>
                      <p>🌟 呼气时，释放内心的焦虑与不安</p>
                      <p>💫 让千手观音的慈悲之光充满全身</p>
                      <p>⭐ 在神仙朋友的陪伴下获得内心平静</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 底部神仙朋友装饰 */}
          <div className="text-center mt-12">
            <div className="deity-glass-card p-4 max-w-2xl mx-auto">
              <p className="text-xs font-chinese text-gray-500 leading-relaxed">
                科技与玄学的完美融合 · 让每一次呼吸都有神仙相伴
                <br />
                千手观音千手千眼，时刻守护着您的内心安宁
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 