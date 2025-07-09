import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function GiftPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { chipId, profile, donationAmount = 0 } = location.state || {}
  
  const [shareLink, setShareLink] = useState('')
  const [copied, setCopied] = useState(false)

  const generateGiftLink = () => {
    const relayId = `relay_${Date.now()}`
    const link = `https://bless.top/hb?r=${relayId}&u=${chipId}`
    setShareLink(link)
    return link
  }

  const handleCopyLink = async () => {
    const link = shareLink || generateGiftLink()
    
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleSaveImage = () => {
    // TODO: Implement gift canvas generation
    console.log('Save gift image')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="glass-card p-8 max-w-md mx-auto text-center space-y-6">
        <div className="text-4xl">🎁</div>
        
        <h2 className="text-xl font-chinese text-primary">
          分享勇气之光
        </h2>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
          <div className="text-6xl mb-4">🪷</div>
          <p className="text-sm text-gray-600 mb-2">
            您的布施已点亮一盏明灯
          </p>
          {donationAmount > 0 && (
            <p className="text-xs text-primary">
              功德金额: ¥{donationAmount}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            分享给朋友，让更多人获得内心安宁
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={handleSaveImage}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              保存图片
            </button>
            <button
              onClick={handleCopyLink}
              className="flex-1 py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              {copied ? '已复制' : '复制链接'}
            </button>
          </div>
          
          {shareLink && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 break-all">
                {shareLink}
              </p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <button
            onClick={() => navigate('/bracelet', { state: { chipId, profile } })}
            className="text-sm text-primary hover:text-primary-600"
          >
            查看我的手串
          </button>
        </div>
      </div>
    </div>
  )
} 