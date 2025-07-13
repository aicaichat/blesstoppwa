import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function DonationPage() {
  const [currentStep, setCurrentStep] = useState('amount') // amount -> dedication -> payment -> success
  const [selectedAmount, setSelectedAmount] = useState(0)
  const [customAmount, setCustomAmount] = useState('')
  const [dedicationTarget, setDedicationTarget] = useState('')
  const [dedicationMessage, setDedicationMessage] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('wechat')
  const [isVisible, setIsVisible] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const navigate = useNavigate()

  // 预设金额选项
  const presetAmounts = [
    { amount: 0, label: '￥0', description: '心意最重要', merit: 10 },
    { amount: 2, label: '￥2', description: '一片心意', merit: 50 },
    { amount: 6, label: '￥6', description: '六六大顺', merit: 100 },
    { amount: 8, label: '￥8', description: '发发发', merit: 150 },
    { amount: 18, label: '￥18', description: '要发要发', merit: 300 },
    { amount: 66, label: '￥66', description: '六六大顺', merit: 800 },
    { amount: 88, label: '￥88', description: '发发发发', merit: 1200 },
    { amount: 188, label: '￥188', description: '要发发发', merit: 2000 }
  ]

  // 回向对象选项
  const dedicationOptions = [
    { id: 'self', label: '为自己', emoji: '🙏', description: '愿自己身心健康，事事顺利' },
    { id: 'family', label: '为家人', emoji: '👨‍👩‍👧‍👦', description: '愿家人平安健康，幸福美满' },
    { id: 'friends', label: '为朋友', emoji: '🤝', description: '愿朋友友谊长存，互相扶持' },
    { id: 'all', label: '为众生', emoji: '🌍', description: '愿一切众生离苦得乐，获得幸福' },
    { id: 'custom', label: '自定义', emoji: '✏️', description: '为特定的人或事回向' }
  ]

  // 支付方式选项
  const paymentOptions = [
    { id: 'wechat', label: '微信支付', icon: '💚', description: '快速便捷' },
    { id: 'alipay', label: '支付宝', icon: '🔵', description: '安全可靠' },
    { id: 'union', label: '银联支付', icon: '💳', description: '银行卡支付' }
  ]

  useEffect(() => {
    setIsVisible(true)
    
    // 获取用户个性化数据
    const profile = sessionStorage.getItem('userProfile')
    if (profile) {
      setUserProfile(JSON.parse(profile))
    }
    
    // 获取体验效果数据
    const evaluationData = sessionStorage.getItem('evaluationData')
    if (evaluationData) {
      const data = JSON.parse(evaluationData)
      // 基于体验效果推荐布施金额
      if (data.improvementRate > 50) {
        setSelectedAmount(18) // 效果很好，推荐18元
      } else if (data.improvementRate > 20) {
        setSelectedAmount(8) // 效果不错，推荐8元
      } else {
        setSelectedAmount(2) // 有效果，推荐2元
      }
    }
  }, [])

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (e) => {
    const value = e.target.value
    if (value === '' || /^\d+$/.test(value)) {
      setCustomAmount(value)
      setSelectedAmount(parseInt(value) || 0)
    }
  }

  const handleNextStep = () => {
    if (currentStep === 'amount') {
      setCurrentStep('dedication')
    } else if (currentStep === 'dedication') {
      setCurrentStep('payment')
    } else if (currentStep === 'payment') {
      // 处理支付
      handlePayment()
    }
  }

  const handlePayment = async () => {
    // 模拟支付流程
    try {
      const paymentData = {
        amount: selectedAmount,
        dedicationTarget,
        dedicationMessage,
        paymentMethod,
        userProfile: userProfile?.intent,
        timestamp: new Date().toISOString()
      }
      
      console.log('发起支付:', paymentData)
      
      // 模拟支付延迟
      setTimeout(() => {
        // 计算功德值
        const selectedPreset = presetAmounts.find(p => p.amount === selectedAmount)
        const meritPoints = selectedPreset?.merit || Math.max(selectedAmount * 10, 10)
        
        // 保存功德记录
        const meritRecord = {
          amount: selectedAmount,
          merit: meritPoints,
          dedication: {
            target: dedicationTarget,
            message: dedicationMessage
          },
          timestamp: new Date().toISOString()
        }
        
        sessionStorage.setItem('meritRecord', JSON.stringify(meritRecord))
        setCurrentStep('success')
      }, 2000)
      
    } catch (error) {
      console.error('支付失败:', error)
      alert('支付失败，请重试')
    }
  }

  const getMeritPoints = (amount) => {
    const preset = presetAmounts.find(p => p.amount === amount)
    return preset?.merit || Math.max(amount * 10, 10)
  }

  const getPersonalizedMessage = () => {
    if (!userProfile) return '您的布施将为您带来功德与福报'
    
    const intent = userProfile.intent
    const messages = {
      blessing: '您的布施将为您和家人带来更多祝福与平安',
      divination: '您的布施将为您带来更多智慧与指引',
      wealth: '您的布施将为您带来更多财运与机遇',
      love: '您的布施将为您带来更多爱情与和谐',
      beauty: '您的布施将为您带来更多美丽与自信',
      health: '您的布施将为您带来更多健康与活力',
      reminder: '您的布施将帮助您保持良好的修行习惯'
    }
    
    return messages[intent.id] || '您的布施将为您带来功德与福报'
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
          
          {/* 金额选择阶段 */}
          {currentStep === 'amount' && (
            <div className="text-center max-w-lg mx-auto">
              <div className="deity-glass-card p-8">
                <div className="mb-8">
                  <div className="text-6xl mb-4">🙏</div>
                  <h1 className="text-3xl font-chinese text-deity-gradient mb-4">
                    随喜布施
                  </h1>
                  <p className="text-gray-600">
                    {getPersonalizedMessage()}
                  </p>
                </div>

                {/* 金额选择 */}
                <div className="mb-8">
                  <h3 className="text-lg font-chinese text-deity-gradient mb-4">
                    选择布施金额
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {presetAmounts.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => handleAmountSelect(preset.amount)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          selectedAmount === preset.amount
                            ? 'border-deity-purple bg-deity-purple/10 scale-105'
                            : 'border-gray-200 hover:border-deity-purple/50'
                        }`}
                      >
                        <div className="font-bold text-lg">{preset.label}</div>
                        <div className="text-sm text-gray-600">{preset.description}</div>
                        <div className="text-xs text-deity-purple mt-1">
                          获得 {preset.merit} 功德值
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* 自定义金额 */}
                  <div className="mb-6">
                    <label className="block text-sm font-chinese text-gray-700 mb-2">
                      自定义金额
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">￥</span>
                      <input
                        type="text"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        placeholder="输入金额"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-deity-purple"
                      />
                    </div>
                    {customAmount && (
                      <div className="text-xs text-deity-purple mt-1">
                        将获得 {getMeritPoints(parseInt(customAmount) || 0)} 功德值
                      </div>
                    )}
                  </div>

                  {/* 当前选择显示 */}
                  <div className="gradient-border-card mb-6">
                    <div className="gradient-border-inner">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-chinese text-lg">当前选择</div>
                          <div className="text-sm text-gray-600">功德无量，心意最重要</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-deity-gradient">
                            ￥{selectedAmount}
                          </div>
                          <div className="text-sm text-deity-purple">
                            +{getMeritPoints(selectedAmount)} 功德值
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleNextStep}
                    className="deity-button text-lg font-chinese py-3 px-8 glow-effect w-full"
                  >
                    下一步：选择回向
                  </button>
                  
                  <Link
                    to="/blessing/gift"
                    className="block text-center text-deity-gradient hover:text-deity-purple transition-colors"
                  >
                    跳过布施，直接查看祝福
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* 回向选择阶段 */}
          {currentStep === 'dedication' && (
            <div className="text-center max-w-lg mx-auto">
              <div className="deity-glass-card p-8">
                <div className="mb-8">
                  <div className="text-6xl mb-4">🌟</div>
                  <h1 className="text-3xl font-chinese text-deity-gradient mb-4">
                    功德回向
                  </h1>
                  <p className="text-gray-600">
                    选择您希望为谁回向功德
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {dedicationOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setDedicationTarget(option.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                        dedicationTarget === option.id
                          ? 'border-deity-purple bg-deity-purple/10'
                          : 'border-gray-200 hover:border-deity-purple/50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{option.emoji}</div>
                        <div className="text-left">
                          <div className="font-chinese text-lg">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* 自定义回向消息 */}
                {dedicationTarget === 'custom' && (
                  <div className="mb-8">
                    <label className="block text-sm font-chinese text-gray-700 mb-2">
                      自定义回向内容
                    </label>
                    <textarea
                      value={dedicationMessage}
                      onChange={(e) => setDedicationMessage(e.target.value)}
                      placeholder="请输入您的回向内容..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-deity-purple resize-none"
                      rows={3}
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <button
                    onClick={handleNextStep}
                    disabled={!dedicationTarget}
                    className="deity-button text-lg font-chinese py-3 px-8 glow-effect w-full disabled:opacity-50"
                  >
                    下一步：选择支付方式
                  </button>
                  
                  <button
                    onClick={() => setCurrentStep('amount')}
                    className="block w-full text-deity-gradient hover:text-deity-purple transition-colors"
                  >
                    ← 返回上一步
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 支付方式选择 */}
          {currentStep === 'payment' && (
            <div className="text-center max-w-lg mx-auto">
              <div className="deity-glass-card p-8">
                <div className="mb-8">
                  <div className="text-6xl mb-4">💳</div>
                  <h1 className="text-3xl font-chinese text-deity-gradient mb-4">
                    支付方式
                  </h1>
                  <p className="text-gray-600">
                    选择您的支付方式
                  </p>
                </div>

                {/* 支付方式选择 */}
                <div className="space-y-4 mb-8">
                  {paymentOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setPaymentMethod(option.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                        paymentMethod === option.id
                          ? 'border-deity-purple bg-deity-purple/10'
                          : 'border-gray-200 hover:border-deity-purple/50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{option.icon}</div>
                        <div className="text-left">
                          <div className="font-chinese text-lg">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* 订单详情 */}
                <div className="gradient-border-card mb-8">
                  <div className="gradient-border-inner">
                    <h3 className="text-lg font-chinese text-deity-gradient mb-4">
                      订单详情
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>布施金额：</span>
                        <span className="font-bold">￥{selectedAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>获得功德值：</span>
                        <span className="text-deity-purple">+{getMeritPoints(selectedAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>回向对象：</span>
                        <span>{dedicationOptions.find(d => d.id === dedicationTarget)?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>支付方式：</span>
                        <span>{paymentOptions.find(p => p.id === paymentMethod)?.label}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleNextStep}
                    className="deity-button text-lg font-chinese py-3 px-8 glow-effect w-full"
                  >
                    确认支付 ￥{selectedAmount}
                  </button>
                  
                  <button
                    onClick={() => setCurrentStep('dedication')}
                    className="block w-full text-deity-gradient hover:text-deity-purple transition-colors"
                  >
                    ← 返回上一步
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 支付成功 */}
          {currentStep === 'success' && (
            <div className="text-center max-w-lg mx-auto">
              <div className="deity-glass-card p-8">
                <div className="mb-8">
                  <div className="text-6xl mb-4 animate-bounce">🎉</div>
                  <h1 className="text-3xl font-chinese text-deity-gradient mb-4">
                    布施成功
                  </h1>
                  <p className="text-gray-600">
                    您的善心已经传递，功德无量！
                  </p>
                </div>

                <div className="gradient-border-card mb-8">
                  <div className="gradient-border-inner">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-chinese text-lg">本次布施</span>
                        <span className="text-2xl font-bold text-deity-gradient">￥{selectedAmount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-chinese text-lg">获得功德值</span>
                        <span className="text-xl font-bold text-deity-purple">+{getMeritPoints(selectedAmount)}</span>
                      </div>
                      <div className="text-sm text-gray-600 pt-4 border-t">
                        💫 您的功德已回向给：{dedicationOptions.find(d => d.id === dedicationTarget)?.label}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link
                    to="/blessing/gift"
                    className="deity-button text-lg font-chinese py-3 px-8 glow-effect block"
                  >
                    查看专属祝福
                  </Link>
                  
                  <div className="flex space-x-4">
                    <Link
                      to="/experience"
                      className="flex-1 text-center py-2 px-4 border border-deity-purple text-deity-purple rounded-lg hover:bg-deity-purple/10 transition-colors"
                    >
                      🔄 再次体验
                    </Link>
                    <Link
                      to="/"
                      className="flex-1 text-center py-2 px-4 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      🏠 返回首页
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 