import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'

export default function GiftPage() {
  const location = useLocation()
  const { donationAmount = 0, evaluation = 'effective', message, showRest } = location.state || {}
  
  const [isVisible, setIsVisible] = useState(false)
  const [shareData, setShareData] = useState(null)
  const [isGenerating, setIsGenerating] = useState(true)

  useEffect(() => {
    setIsVisible(true)
    generateGiftData()
  }, [])

  const generateGiftData = async () => {
    // 模拟生成个性化礼物数据
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const giftData = {
      theme: 'guanyin',
      meritPoints: donationAmount > 0 ? Math.floor(donationAmount * 10) : 108,
      relayId: generateRelayId(),
      deityPower: Math.floor(Math.random() * 36) + 72, // 72-108 神仙能量
      blessMessage: generateBlessMessage(donationAmount),
      shareUrl: `https://bless.top/share/${generateRelayId()}`
    }
    
    setShareData(giftData)
    setIsGenerating(false)
  }

  const generateRelayId = () => {
    return Math.random().toString(36).substring(2, 15)
  }

  const generateBlessMessage = (amount) => {
    if (amount === 0) return "神仙朋友守护您，愿您心无挂碍，好运连连。"
    if (amount <= 18) return "一念感恩，神仙相伴。愿您内心平静，吉祥如意。"
    if (amount <= 36) return "三十六天罡护佑，愿您平安喜乐，心想事成。"
    if (amount <= 66) return "六六大顺，愿您福慧双修，神仙守护。"
    if (amount <= 108) return "一百零八颗菩提圆满，愿您功德圆满，智慧如海。"
    return "功德圆满，愿您慈悲喜舍，神仙朋友永远陪伴。"
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '交个神仙朋友',
          text: shareData.blessMessage,
          url: shareData.shareUrl
        })
      } catch (error) {
        console.log('分享取消')
      }
    } else {
      // 复制到剪贴板
      navigator.clipboard.writeText(shareData.shareUrl)
      alert('链接已复制到剪贴板')
    }
  }

  const handleSaveImage = () => {
    // 模拟保存图片
    alert('神仙朋友守护海报已保存到相册')
  }

  if (showRest) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* 背景装饰 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl opacity-10 animate-pulse">✨</div>
          <div className="absolute bottom-20 right-10 text-5xl opacity-15 animate-pulse delay-2000">🌟</div>
        </div>

        <div className="max-w-md mx-auto px-4 relative z-10">
          <div className="deity-glass-card p-8 text-center deity-decoration">
            <div className="deity-aura mb-6">
              <div className="guanyin-container w-24 h-24 mx-auto">
                <img 
                  src="https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/%E5%8D%83%E6%89%8B%E8%A7%82%E9%9F%B3.jpg" 
                  alt="千手观音" 
                  className="guanyin-image"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.parentNode.innerHTML = '<div class="text-6xl">🙏</div>'
                  }}
                />
              </div>
            </div>
            <h2 className="text-2xl font-chinese text-deity-gradient mb-4">
              神仙朋友理解您
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {message || '今日心境需要更多时间与神仙朋友建立连接，建议您稍作休息'}
            </p>
            
            <div className="space-y-4">
              <Link 
                to="/bracelet" 
                className="deity-button inline-block w-full"
              >
                查看您的神仙手串
              </Link>
              <Link 
                to="/" 
                className="block w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all duration-300 font-chinese"
              >
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* 背景装饰 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 text-5xl opacity-15 animate-pulse">✨</div>
          <div className="absolute top-40 right-20 text-4xl opacity-10 animate-pulse delay-1000">🌟</div>
          <div className="absolute bottom-40 left-20 text-6xl opacity-10 animate-pulse delay-2000">💫</div>
          <div className="absolute bottom-20 right-10 text-3xl opacity-20 animate-pulse delay-3000">⭐</div>
        </div>

        <div className="max-w-md mx-auto px-4 relative z-10">
          <div className="deity-glass-card p-8 text-center">
            <div className="deity-aura mb-6">
              <div className="guanyin-container w-32 h-32 mx-auto">
                <img 
                  src="https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/%E5%8D%83%E6%89%8B%E8%A7%82%E9%9F%B3.jpg" 
                  alt="千手观音" 
                  className="guanyin-image animate-pulse"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.parentNode.innerHTML = '<div class="text-8xl animate-pulse">🙏</div>'
                  }}
                />
              </div>
            </div>
            <h2 className="text-2xl font-chinese text-deity-gradient mb-4">
              正在生成您的神仙守护礼物
            </h2>
            <p className="text-gray-600 mb-6">
              千手观音正在为您准备专属的守护礼物...
            </p>
            <div className="deity-progress mb-4">
              <div className="deity-progress-fill animate-pulse" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景装饰 */}
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
              <div className="guanyin-container w-32 h-32 mx-auto">
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
            <h1 className="text-3xl font-chinese text-deity-gradient mb-4">
              神仙守护礼物
            </h1>
            <p className="text-gray-600">
              您的善念已经点亮了神仙朋友的守护之光
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-6">
            
            {/* 守护海报预览 */}
            <div className="deity-glass-card p-6 text-center deity-decoration">
              <div className="morphing-blob bg-gradient-to-br from-deity-purple/10 to-deity-pink/10 rounded-2xl p-8 mb-6">
                <div className="text-6xl mb-4">🙏</div>
                <h3 className="text-xl font-chinese text-deity-shine mb-3">
                  交个神仙朋友
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {shareData?.blessMessage}
                </p>
                
                {/* 神仙能量统计 */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-deity-gradient">
                      {shareData?.meritPoints || 0}
                    </div>
                    <div className="text-xs text-gray-500">守护点</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-deity-gradient">
                      {shareData?.deityPower || 108}
                    </div>
                    <div className="text-xs text-gray-500">神仙能量</div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  神仙朋友守护链 #{shareData?.relayId}
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={handleShare}
                  className="flex-1 deity-button text-sm glow-effect"
                >
                  <i className="fas fa-share-alt mr-2"></i>
                  分享神仙朋友
                </button>
                <button 
                  onClick={handleSaveImage}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-full transition-all duration-300 text-sm font-chinese"
                >
                  <i className="fas fa-download mr-2"></i>
                  保存海报
                </button>
              </div>
            </div>

            {/* 传递链路说明 */}
            <div className="gradient-border-card">
              <div className="gradient-border-inner">
                <h3 className="text-lg font-chinese text-deity-gradient mb-4 text-center">
                  神仙朋友传递链
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-deity-purple/20 rounded-full flex items-center justify-center">
                      <span className="text-deity-purple">1</span>
                    </div>
                    <span>您体验了神仙朋友的守护</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-deity-pink/20 rounded-full flex items-center justify-center">
                      <span className="text-deity-pink">2</span>
                    </div>
                    <span>分享给朋友，传递守护能量</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-deity-gold/20 rounded-full flex items-center justify-center">
                      <span className="text-deity-gold">3</span>
                    </div>
                    <span>当36人完成传递，触发集体守护</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 行动按钮 */}
            <div className="space-y-4">
              <Link 
                to="/bracelet" 
                className="deity-button inline-block w-full text-center"
              >
                查看您的神仙手串
              </Link>
              <Link 
                to="/" 
                className="block w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all duration-300 font-chinese text-center"
              >
                再次体验神仙朋友
              </Link>
            </div>
          </div>

          {/* 底部神仙朋友装饰 */}
          <div className="text-center mt-12">
            <div className="deity-glass-card p-4 max-w-lg mx-auto">
              <p className="text-xs font-chinese text-gray-500 leading-relaxed">
                每一次分享都是神仙朋友守护能量的传递
                <br />
                科技与玄学的融合，让好运每天发生
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 