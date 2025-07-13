import { useState, useEffect } from 'react'

export default function DonationSlider({ onComplete, maxAmount = 108 }) {
  const [amount, setAmount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)

  const presetAmounts = [0, 6, 18, 36, 66, 108]
  
  const handleAmountChange = (e) => {
    setAmount(Number(e.target.value))
  }

  const handlePresetClick = (preset) => {
    setAmount(preset)
  }

  const handleDonation = async () => {
    setIsProcessing(true)
    
    // 模拟支付处理
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsProcessing(false)
    setShowThankYou(true)
    
    // 延迟后完成
    setTimeout(() => {
      onComplete(amount)
    }, 2000)
  }

  const getMeritMessage = (amount) => {
    if (amount === 0) return "无畏布施，功德无量"
    if (amount <= 18) return "一念慈悲，福慧增长"
    if (amount <= 36) return "三十六天罡，护佑平安"
    if (amount <= 66) return "六六大顺，吉祥如意"
    if (amount <= 108) return "一百零八颗菩提，圆满功德"
    return "功德圆满"
  }

  const getAmountColor = (amount) => {
    if (amount === 0) return "text-gray-600"
    if (amount <= 18) return "text-green-600"
    if (amount <= 36) return "text-blue-600"
    if (amount <= 66) return "text-purple-600"
    return "text-gradient"
  }

  if (showThankYou) {
    return (
      <div className="text-center">
        <div className="lotus-petals mb-6">
          <div className="text-8xl animate-pulse">🪷</div>
        </div>
        <h3 className="text-2xl font-chinese text-gradient mb-4">
          功德圆满
        </h3>
        <p className="text-gray-600 mb-6">
          您的随喜已经点亮了一盏明灯
        </p>
        <div className="merit-progress mb-4">
          <div className="merit-progress-fill" style={{ width: '100%' }}></div>
        </div>
        <p className="text-sm text-gray-500">
          正在为您准备回向礼物...
        </p>
      </div>
    )
  }

  if (isProcessing) {
    return (
      <div className="text-center">
        <div className="lotus-petals mb-6">
          <div className="text-6xl animate-spin">🪷</div>
        </div>
        <h3 className="text-xl font-chinese text-gradient mb-4">
          正在处理随喜
        </h3>
        <p className="text-gray-600 mb-6">
          {amount > 0 ? `¥${amount}` : '无畏布施'}
        </p>
        <div className="merit-progress mb-4">
          <div className="merit-progress-fill animate-pulse" style={{ width: '60%' }}></div>
        </div>
        <p className="text-sm text-gray-500">
          请稍候，正在连接支付系统...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* 金额显示 */}
      <div className="text-center">
        <div className="text-6xl mb-4">💝</div>
        <div className={`text-4xl font-bold mb-2 ${getAmountColor(amount)}`}>
          {amount > 0 ? `¥${amount}` : '¥0'}
        </div>
        <p className="text-sm font-chinese text-gray-600">
          {getMeritMessage(amount)}
        </p>
      </div>

      {/* 滑块 */}
      <div className="relative">
        <input
          type="range"
          min="0"
          max={maxAmount}
          value={amount}
          onChange={handleAmountChange}
          className="w-full h-3 bg-gradient-to-r from-orange-200 to-orange-100 rounded-full appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, #F6AD55 0%, #F6AD55 ${(amount / maxAmount) * 100}%, #FED7AA ${(amount / maxAmount) * 100}%, #FED7AA 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>¥0</span>
          <span>¥{maxAmount}</span>
        </div>
      </div>

      {/* 预设金额 */}
      <div className="grid grid-cols-3 gap-3">
        {presetAmounts.map((preset) => (
          <button
            key={preset}
            onClick={() => handlePresetClick(preset)}
            className={`p-3 rounded-xl border-2 transition-all duration-300 ${
              amount === preset
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300'
            }`}
          >
            <div className="font-bold">
              {preset === 0 ? '随心' : `¥${preset}`}
            </div>
            <div className="text-xs opacity-75">
              {preset === 0 && '无畏'}
              {preset === 6 && '六顺'}
              {preset === 18 && '要发'}
              {preset === 36 && '三六'}
              {preset === 66 && '六六'}
              {preset === 108 && '圆满'}
            </div>
          </button>
        ))}
      </div>

      {/* 功德说明 */}
      <div className="info-card-enhanced">
        <div className="text-center mb-3">
          <div className="text-2xl mb-2">🙏</div>
          <h4 className="font-chinese text-gradient">随喜功德</h4>
        </div>
        <div className="text-xs text-gray-600 space-y-1">
          <p>💡 所有金额都是建议，您可以根据自己的情况选择</p>
          <p>🌟 即使是¥0，您的善念也是无价的功德</p>
          <p>🔄 资金将用于维护平台，帮助更多人获得安宁</p>
        </div>
      </div>

      {/* 确认按钮 */}
      <div className="flex space-x-3">
        <button
          onClick={handleDonation}
          className="flex-1 lotus-button flex items-center justify-center space-x-2"
        >
          <span>🪷</span>
          <span className="font-chinese">
            {amount > 0 ? '随喜功德' : '无畏布施'}
          </span>
        </button>
        
        <button
          onClick={() => onComplete(0)}
          className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all duration-300 font-chinese"
        >
          暂时跳过
        </button>
      </div>

      {/* 支付方式提示 */}
      {amount > 0 && (
        <div className="text-center">
          <div className="flex justify-center space-x-4 text-2xl opacity-50">
            <span>💳</span>
            <span>📱</span>
            <span>🏦</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            支持微信、支付宝、银行卡等多种支付方式
          </p>
        </div>
      )}
    </div>
  )
}

// 自定义滑块样式
const styles = `
  .slider-thumb::-webkit-slider-thumb {
    appearance: none;
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #F6AD55 0%, #ED8936 100%);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(246, 173, 85, 0.4);
    transition: all 0.3s ease;
  }
  
  .slider-thumb::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 12px rgba(246, 173, 85, 0.6);
  }
  
  .slider-thumb::-moz-range-thumb {
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #F6AD55 0%, #ED8936 100%);
    border-radius: 50%;
    cursor: pointer;
    border: none;
    box-shadow: 0 4px 8px rgba(246, 173, 85, 0.4);
  }
`

// 注入样式
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.innerText = styles
  document.head.appendChild(styleSheet)
}