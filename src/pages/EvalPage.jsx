import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DonationSlider from '../components/DonationSlider'

export default function EvalPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { chipId, profile } = location.state || {}
  
  const [showDonation, setShowDonation] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [showRetryWarning, setShowRetryWarning] = useState(false)

  const handleEffective = () => {
    setShowDonation(true)
    // Track success
    console.log('Blessing effective for chipId:', chipId)
  }

  const handleIneffective = () => {
    if (retryCount >= 2) {
      setShowRetryWarning(true)
      return
    }
    
    // Show retry options
    setRetryCount(prev => prev + 1)
  }

  const handleRetry = () => {
    navigate('/blessing', { 
      state: { chipId, profile } 
    })
  }

  const handleRestLater = () => {
    navigate('/bracelet', { 
      state: { chipId, profile } 
    })
  }

  const handleDonationComplete = (amount) => {
    console.log('Donation completed:', amount)
    navigate('/blessing/gift', { 
      state: { chipId, profile, donationAmount: amount } 
    })
  }

  const handleDonationCancel = () => {
    navigate('/blessing/gift', { 
      state: { chipId, profile, donationAmount: 0 } 
    })
  }

  if (showRetryWarning) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="glass-card p-8 max-w-md mx-auto text-center space-y-6">
          <div className="text-4xl">🙏</div>
          <h2 className="text-xl font-chinese text-primary">
            建议稍作休息
          </h2>
          <p className="text-gray-600">
            连续布施可能让心更加疲惫。不如先看看您的手串，或稍后再试？
          </p>
          <div className="flex space-x-3">
            <button
              onClick={handleRestLater}
              className="flex-1 py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              查看手串
            </button>
            <button
              onClick={handleRetry}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              再试一次
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showDonation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <div className="text-4xl mb-2">✨</div>
          <h2 className="text-xl font-chinese text-primary">
            感受到宁静了吗？
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            您的布施让更多人获得安宁
          </p>
        </div>
        
        <DonationSlider
          onDonationSelect={handleDonationComplete}
          onCancel={handleDonationCancel}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="glass-card p-8 max-w-md mx-auto text-center space-y-6">
        <div className="text-4xl">🤔</div>
        <h2 className="text-xl font-chinese text-primary">
          感受如何？
        </h2>
        <p className="text-gray-600">
          布施视频是否帮助您获得内心的宁静？
        </p>
        
        {retryCount > 0 && (
          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-sm text-orange-700">
              这是第 {retryCount + 1} 次尝试
            </p>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={handleEffective}
            className="flex-1 py-4 px-4 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <div className="text-lg mb-1">✔️</div>
            <div className="text-sm">有效</div>
          </button>
          <button
            onClick={handleIneffective}
            className="flex-1 py-4 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <div className="text-lg mb-1">🔄</div>
            <div className="text-sm">仍烦躁</div>
          </button>
        </div>

        {retryCount > 0 && (
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">
              或者您可以稍后再试
            </p>
            <button
              onClick={handleRestLater}
              className="mt-2 text-sm text-primary hover:text-primary-600"
            >
              查看手串信息
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 