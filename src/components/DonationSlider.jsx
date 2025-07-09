import { useState } from 'react'

export default function DonationSlider({ onDonationSelect, onCancel }) {
  const [amount, setAmount] = useState(18)
  const [isProcessing, setIsProcessing] = useState(false)

  const presetAmounts = [0, 6, 18, 36, 66, 108]
  
  const handleSliderChange = (e) => {
    setAmount(parseInt(e.target.value))
  }

  const handlePresetSelect = (preset) => {
    setAmount(preset)
  }

  const handleDonate = async () => {
    if (amount === 0) {
      onDonationSelect(0)
      return
    }

    setIsProcessing(true)
    
    try {
      // Mock Stripe checkout
      const success = await mockStripeCheckout(amount)
      if (success) {
        onDonationSelect(amount)
      } else {
        // Fallback to ¥0 if payment cancelled
        onDonationSelect(0)
      }
    } catch (error) {
      console.error('Payment error:', error)
      onDonationSelect(0)
    } finally {
      setIsProcessing(false)
    }
  }

  const mockStripeCheckout = (amount) => {
    return new Promise((resolve) => {
      // Simulate payment processing
      setTimeout(() => {
        // 80% success rate for demo
        resolve(Math.random() > 0.2)
      }, 1500)
    })
  }

  return (
    <div className="glass-card p-6 max-w-md mx-auto">
      <h3 className="text-lg font-chinese text-primary mb-4 text-center">
        随喜功德
      </h3>
      
      <div className="space-y-6">
        {/* Amount Display */}
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">
            ¥{amount}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {amount === 0 ? '心意最重要' : '功德无量'}
          </p>
        </div>

        {/* Slider */}
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="108"
            value={amount}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #F6AD55 0%, #F6AD55 ${(amount/108)*100}%, #e5e7eb ${(amount/108)*100}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>¥0</span>
            <span>¥108</span>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              onClick={() => handlePresetSelect(preset)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                amount === preset
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {preset === 0 ? '心意' : `¥${preset}`}
            </button>
          ))}
        </div>

        {/* Donation Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 40% 用于平台运营维护</p>
          <p>• 40% 捐赠慈善机构</p>
          <p>• 20% 用于内容制作</p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            暂不布施
          </button>
          <button
            onClick={handleDonate}
            disabled={isProcessing}
            className="flex-1 py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {isProcessing ? '处理中...' : amount === 0 ? '确认' : '支付'}
          </button>
        </div>
      </div>
    </div>
  )
} 