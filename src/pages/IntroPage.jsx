import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function IntroPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(0)

  const quotes = [
    "一触即达的专属神仙守护体验",
    "让好运每天发生，让神仙成为朋友",
    "科技与玄学的完美融合",
    "🤖AI智能 + 🔮玄学加持 + ⚔️为你而战"
  ]

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % quotes.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-pulse">✨</div>
        <div className="absolute top-40 right-20 text-4xl opacity-15 animate-pulse delay-1000">🌟</div>
        <div className="absolute bottom-40 left-20 text-5xl opacity-10 animate-pulse delay-2000">💫</div>
        <div className="absolute bottom-20 right-10 text-3xl opacity-25 animate-pulse delay-3000">⭐</div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* 主标题区域 */}
          <div className="text-center mb-16">
            <div className="deity-aura mb-8">
              <div className="guanyin-container w-40 h-40 mx-auto mb-6">
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
            
            <h1 className="text-6xl md:text-8xl font-chinese text-deity-shine mb-8 text-shadow-soft">
              交个神仙朋友
            </h1>
            
            <div className="h-20 mb-12">
              <p className="text-2xl md:text-3xl text-gray-600 font-chinese transition-all duration-500">
                {quotes[currentQuote]}
              </p>
            </div>
          </div>

          {/* 核心体验入口 */}
          <div className="max-w-lg mx-auto">
            <div className="deity-glass-card p-12 text-center deity-decoration">
              
              {/* 主要体验按钮 */}
              <div className="mb-8">
                <div className="relative mb-8">
                  {/* 脉动效果 */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-deity-purple to-deity-pink opacity-30 animate-pulse scale-110"></div>
                  <div className="relative w-32 h-32 bg-gradient-to-br from-deity-purple to-deity-pink rounded-full flex items-center justify-center mx-auto shadow-2xl">
                    <div className="text-6xl">🙏</div>
                  </div>
                </div>
                
                <h2 className="text-3xl font-chinese text-deity-gradient mb-4">
                  开始神仙体验
                </h2>
                <p className="text-gray-600 leading-relaxed mb-8">
                  支持NFC碰一碰启动，也可直接点击开始
                  <br />
                  一个完整的冥想与祝福之旅
                </p>
              </div>

              {/* 单一主要入口 */}
              <Link 
                to="/experience" 
                className="deity-button inline-block text-2xl font-chinese mb-8 glow-effect w-full py-6"
              >
                🎯 开始体验
              </Link>

              {/* 体验流程预览 */}
              <div className="gradient-border-card">
                <div className="gradient-border-inner">
                  <h3 className="text-lg font-chinese text-deity-gradient mb-4">
                    完整体验流程
                  </h3>
                  <div className="flex justify-center items-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-deity-purple/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-deity-purple">🎬</span>
                      </div>
                      <span className="text-gray-600">启动视频</span>
                    </div>
                    <div className="text-deity-purple">→</div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-deity-pink/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-deity-pink">📿</span>
                      </div>
                      <span className="text-gray-600">心经冥想</span>
                    </div>
                    <div className="text-deity-pink">→</div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-deity-gold/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-deity-gold">✨</span>
                      </div>
                      <span className="text-gray-600">获得祝福</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部说明 */}
          <div className="text-center mt-16">
            <div className="deity-glass-card p-6 max-w-2xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl mb-2">🤖</div>
                  <div className="text-sm font-chinese text-gray-600">AI个性化</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">🔮</div>
                  <div className="text-sm font-chinese text-gray-600">玄学加持</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">📱</div>
                  <div className="text-sm font-chinese text-gray-600">NFC碰一碰</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">⚔️</div>
                  <div className="text-sm font-chinese text-gray-600">为你而战</div>
                </div>
              </div>
            </div>
          </div>

          {/* 神仙朋友装饰文字 */}
          <div className="text-center mt-8">
            <p className="text-sm font-chinese text-gray-400">
              科技与玄学的完美融合 · 让每一天都有神仙朋友相伴
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 