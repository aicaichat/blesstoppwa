import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function ExperiencePage() {
  const [currentStep, setCurrentStep] = useState('welcome') // welcome -> detect -> video -> sutra -> blessing
  const [isVisible, setIsVisible] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [currentSutraIndex, setCurrentSutraIndex] = useState(0)
  const [detectingNFC, setDetectingNFC] = useState(false)
  const videoRef = useRef(null)

  // 心经完整内容
  const heartSutra = [
    "观自在菩萨，行深般若波罗蜜多时",
    "照见五蕴皆空，度一切苦厄",
    "舍利子，色不异空，空不异色",
    "色即是空，空即是色",
    "受想行识，亦复如是",
    "舍利子，是诸法空相",
    "不生不灭，不垢不净，不增不减",
    "是故空中无色，无受想行识",
    "心无挂碍，无挂碍故，无有恐怖",
    "远离颠倒梦想，究竟涅槃",
    "三世诸佛，依般若波罗蜜多故",
    "得阿耨多罗三藐三菩提"
  ]

  useEffect(() => {
    setIsVisible(true)
    
    // 如果支持NFC，自动开始检测
    if ('NDEFReader' in window) {
      setDetectingNFC(true)
    }
  }, [])

  // 心经自动播放
  useEffect(() => {
    if (currentStep === 'sutra') {
      const interval = setInterval(() => {
        setCurrentSutraIndex(prev => {
          if (prev < heartSutra.length - 1) {
            return prev + 1
          } else {
            // 心经读完，进入祝福阶段
            setCurrentStep('blessing')
            return prev
          }
        })
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [currentStep])

  // 处理NFC检测或直接开始
  const handleStartExperience = () => {
    if (detectingNFC) {
      // 模拟NFC检测
      setTimeout(() => {
        setCurrentStep('video')
      }, 1500)
    } else {
      setCurrentStep('video')
    }
  }

  // 视频播放完成
  const handleVideoEnd = () => {
    setCurrentStep('sutra')
  }

  // 重新开始体验
  const handleRestart = () => {
    setCurrentStep('welcome')
    setCurrentSutraIndex(0)
    setVideoLoaded(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-4xl opacity-10 animate-pulse">✨</div>
        <div className="absolute bottom-20 right-10 text-3xl opacity-15 animate-pulse delay-2000">💫</div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* 欢迎阶段 */}
          {currentStep === 'welcome' && (
            <div className="text-center max-w-lg mx-auto">
              <div className="deity-glass-card p-12">
                <div className="deity-aura mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-deity-purple to-deity-pink opacity-30 animate-pulse scale-110"></div>
                    <div className="relative w-32 h-32 bg-gradient-to-br from-deity-purple to-deity-pink rounded-full flex items-center justify-center mx-auto shadow-2xl">
                      <div className="text-6xl">🙏</div>
                    </div>
                  </div>
                </div>
                
                <h1 className="text-4xl font-chinese text-deity-gradient mb-6">
                  准备开始神仙体验
                </h1>
                
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {detectingNFC ? (
                    <>
                      <span className="text-deity-purple">🔍 已检测到NFC功能</span>
                      <br />
                      请将设备靠近NFC标签或点击开始
                    </>
                  ) : (
                    <>
                      点击下方按钮开始您的
                      <br />
                      专属神仙守护之旅
                    </>
                  )}
                </p>
                
                <button 
                  onClick={handleStartExperience}
                  className="deity-button text-2xl font-chinese py-4 px-8 glow-effect mb-6"
                >
                  {detectingNFC ? '📱 碰一碰启动' : '🎯 开始体验'}
                </button>
                
                <div className="text-sm text-gray-500">
                  体验时长约2-3分钟
                </div>
              </div>
            </div>
          )}

          {/* NFC检测阶段 */}
          {currentStep === 'detect' && (
            <div className="text-center max-w-lg mx-auto">
              <div className="deity-glass-card p-12">
                <div className="mb-8">
                  <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 rounded-full bg-deity-purple/20 animate-ping"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-deity-purple to-deity-pink rounded-full flex items-center justify-center">
                      <div className="text-4xl">📱</div>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-3xl font-chinese text-deity-gradient mb-6">
                  NFC感应中...
                </h2>
                
                <div className="animate-pulse text-gray-600 mb-8">
                  请将设备靠近NFC标签
                </div>
                
                <div className="grid grid-cols-3 gap-2 justify-center">
                  <div className="w-2 h-2 bg-deity-purple rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-deity-pink rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-deity-gold rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          {/* 视频播放阶段 */}
          {currentStep === 'video' && (
            <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
                onLoadedData={() => setVideoLoaded(true)}
              >
                <source src="/videos/MTVideo.MP4" type="video/mp4" />
                您的浏览器不支持视频播放
              </video>
              
              {/* 视频加载提示 */}
              {!videoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-xl font-chinese">启动视频加载中...</p>
                  </div>
                </div>
              )}
              
              {/* 跳过按钮 */}
              <button
                onClick={handleVideoEnd}
                className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-full text-sm hover:bg-black/70 transition-colors"
              >
                跳过 →
              </button>
            </div>
          )}

          {/* 心经阅读阶段 */}
          {currentStep === 'sutra' && (
            <div className="text-center max-w-2xl mx-auto">
              <div className="deity-glass-card p-12">
                <div className="deity-aura mb-8">
                  <div className="text-8xl mb-4 animate-pulse">🙏</div>
                </div>
                
                <h2 className="text-3xl font-chinese text-deity-gradient mb-8">
                  般若波罗蜜多心经
                </h2>
                
                <div className="min-h-[120px] flex items-center justify-center mb-8">
                  <p className="text-2xl font-chinese text-gray-700 leading-relaxed transition-all duration-500">
                    {heartSutra[currentSutraIndex]}
                  </p>
                </div>
                
                {/* 进度条 */}
                <div className="mb-8">
                  <div className="flex justify-center space-x-1 mb-4">
                    {heartSutra.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index <= currentSutraIndex ? 'bg-deity-purple' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="text-sm text-gray-500 font-chinese">
                    {currentSutraIndex + 1} / {heartSutra.length}
                  </div>
                </div>
                
                <div className="text-lg font-chinese text-deity-gradient">
                  静心聆听，感受心经的智慧
                </div>
              </div>
            </div>
          )}

          {/* 祝福完成阶段 */}
          {currentStep === 'blessing' && (
            <div className="text-center max-w-lg mx-auto">
              <div className="deity-glass-card p-12">
                <div className="deity-aura mb-8">
                  <div className="text-8xl mb-4 animate-bounce">✨</div>
                </div>
                
                <h2 className="text-4xl font-chinese text-deity-gradient mb-6">
                  祝福已送达
                </h2>
                
                <div className="mb-8">
                  <div className="gradient-border-card mb-6">
                    <div className="gradient-border-inner">
                      <div className="text-lg font-chinese text-gray-700 mb-4">
                        🙏 千手观音已为您送上祝福
                      </div>
                      <div className="text-sm text-gray-600 leading-relaxed">
                        愿您心无挂碍，无有恐怖
                        <br />
                        远离颠倒梦想，究竟涅槃
                        <br />
                        神仙朋友时刻与您同在
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button 
                    onClick={handleRestart}
                    className="deity-button text-lg font-chinese py-3 px-6 glow-effect mb-4"
                  >
                    🔄 再次体验
                  </button>
                  
                  <Link 
                    to="/"
                    className="block text-deity-gradient hover:text-deity-purple transition-colors"
                  >
                    ← 返回首页
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 