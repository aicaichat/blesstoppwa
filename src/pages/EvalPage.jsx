import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DonationSlider from '../components/DonationSlider'

export default function EvalPage() {
  const [evaluation, setEvaluation] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [showDonation, setShowDonation] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleEvaluation = (isEffective) => {
    setEvaluation(isEffective)
    
    if (isEffective) {
      setShowDonation(true)
    } else {
      if (retryCount < 2) {
        // 显示重试选项
        setTimeout(() => {
          setEvaluation(null)
          setRetryCount(prev => prev + 1)
        }, 2000)
      } else {
        // 超过重试次数，建议休息
        setTimeout(() => {
          navigate('/blessing/gift', { 
            state: { 
              message: '今日已达到最佳体验次数，建议稍后再试',
              showRest: true 
            }
          })
        }, 3000)
      }
    }
  }

  const handleDonationComplete = (amount) => {
    navigate('/blessing/gift', { 
      state: { 
        donationAmount: amount,
        evaluation: 'effective'
      }
    })
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景装饰 - 神仙朋友风格 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-5xl opacity-15 animate-pulse">✨</div>
        <div className="absolute top-40 right-20 text-4xl opacity-10 animate-pulse delay-1000">🌟</div>
        <div className="absolute bottom-40 left-20 text-6xl opacity-10 animate-pulse delay-2000">💫</div>
        <div className="absolute bottom-20 right-10 text-3xl opacity-20 animate-pulse delay-3000">⭐</div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* 顶部标题 */}
          <div className="text-center mb-8">
            <div className="deity-aura mb-6">
              <div className="guanyin-container w-24 h-24 mx-auto">
                <img 
                  src="https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/%E5%8D%83%E6%89%8B%E8%A7%82%E9%9F%B3.jpg" 
                  alt="千手观音" 
                  className="guanyin-image"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.parentNode.innerHTML = '<div class="text-6xl animate-pulse">🙏</div>'
                  }}
                />
              </div>
            </div>
            <h1 className="text-3xl font-chinese text-deity-gradient mb-4">
              神仙守护效果评估
            </h1>
            <p className="text-gray-600">
              请诚实地评估这次神仙朋友体验的效果
            </p>
          </div>

          <div className="max-w-md mx-auto">
            
            {/* 评估选择 */}
            {!evaluation && !showDonation && (
              <div className="deity-glass-card p-8 text-center deity-decoration card-hover">
                <div className="mb-8">
                  <div className="text-5xl mb-4">🧘‍♀️</div>
                  <h2 className="text-xl font-chinese text-deity-gradient mb-4">
                    您现在的感受如何？
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {retryCount > 0 && `第 ${retryCount + 1} 次神仙体验`}
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => handleEvaluation(true)}
                    className="w-full deity-button flex items-center justify-center space-x-3 glow-effect"
                  >
                    <span className="text-2xl">✨</span>
                    <span className="font-chinese">内心平静了许多</span>
                  </button>
                  
                  <button
                    onClick={() => handleEvaluation(false)}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-4 rounded-full transition-all duration-300 flex items-center justify-center space-x-3"
                  >
                    <span className="text-2xl">🔄</span>
                    <span className="font-chinese">仍感到焦虑不安</span>
                  </button>
                </div>

                {retryCount > 0 && (
                  <div className="mt-6 gradient-border-card">
                    <div className="gradient-border-inner">
                      <p className="text-sm text-gray-600">
                        💡 每个人与神仙朋友的连接不同，多次尝试有助于找到最适合的频率
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 有效果的反馈 */}
            {evaluation === true && !showDonation && (
              <div className="deity-glass-card p-8 text-center deity-decoration">
                <div className="text-6xl mb-4 animate-bounce">🌟</div>
                <h2 className="text-2xl font-chinese text-deity-gradient mb-4">
                  神仙守护成功
                </h2>
                <p className="text-gray-600 mb-6">
                  千手观音的慈悲之光已经照亮了您的心田
                </p>
                <div className="deity-progress mb-4">
                  <div className="deity-progress-fill" style={{ width: '100%' }}></div>
                </div>
                <p className="text-sm text-gray-500">
                  正在为您准备感谢神仙朋友的选项...
                </p>
              </div>
            )}

            {/* 无效果的反馈 */}
            {evaluation === false && (
              <div className="deity-glass-card p-8 text-center deity-decoration">
                <div className="text-5xl mb-4">🤗</div>
                <h2 className="text-xl font-chinese text-deity-gradient mb-4">
                  神仙朋友理解您
                </h2>
                {retryCount < 2 ? (
                  <div>
                    <p className="text-gray-600 mb-6">
                      每个人与神仙的连接频率不同，让我们再试一次
                    </p>
                    <div className="gradient-border-card">
                      <div className="gradient-border-inner">
                        <p className="text-sm text-gray-600">
                          正在为您调整神仙朋友的守护频率...
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-6">
                      今日心境可能需要更多时间与神仙朋友建立连接
                    </p>
                    <div className="gradient-border-card">
                      <div className="gradient-border-inner">
                        <p className="text-sm text-gray-600">
                          建议您稍后再来，或尝试其他与神仙朋友交流的方式
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 捐赠滑块 */}
            {showDonation && (
              <div className="deity-glass-card p-8 deity-decoration">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">💝</div>
                  <h2 className="text-2xl font-chinese text-deity-gradient mb-4">
                    感谢神仙朋友
                  </h2>
                  <p className="text-gray-600 text-sm">
                    您的感谢将用于维护神仙朋友平台，帮助更多人获得神仙守护
                  </p>
                </div>

                <DonationSlider 
                  onComplete={handleDonationComplete}
                  maxAmount={108}
                />

                <div className="mt-6 gradient-border-card">
                  <div className="gradient-border-inner">
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>🤖 40% 用于AI技术升级与维护</p>
                      <p>🔮 40% 用于玄学内容研发与更新</p>
                      <p>⚔️ 20% 用于为用户提供更好的守护体验</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 底部神仙朋友装饰 */}
          <div className="text-center mt-12">
            <div className="deity-glass-card p-4 max-w-lg mx-auto">
              <p className="text-xs font-chinese text-gray-500 leading-relaxed">
                每一次评估都帮助神仙朋友更好地了解您的需求
                <br />
                科技与玄学的融合，让守护更加精准有效
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 