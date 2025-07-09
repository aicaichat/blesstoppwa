import { useSearchParams, useNavigate } from 'react-router-dom'
import { useBraceletProfile } from '../hooks/useBraceletProfile'
import BlessingVideo from '../components/BlessingVideo'

export default function BlessingPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const chipId = searchParams.get('chipId') || 'demo-chip'
  
  const { profile, loading, error } = useBraceletProfile(chipId)

  const handleVideoComplete = () => {
    navigate('/blessing/eval', { 
      state: { chipId, profile } 
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="glass-card p-8 max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">获取个性化设置中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="glass-card p-8 max-w-md mx-auto text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">无法获取手串信息</p>
          <p className="text-sm text-gray-500">错误: {error}</p>
        </div>
      </div>
    )
  }

  const theme = profile?.theme || 'guanyin'
  const language = profile?.language || 'zh-CN'

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 text-center">
        <h1 className="text-xl font-chinese text-primary">
          {profile?.owner ? `${profile.owner}的专属布施` : '无畏布施'}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          主题: {theme} | 语言: {language}
        </p>
      </div>

      {/* Video Container */}
      <div className="flex-1 px-4 pb-4">
        <div className="h-full max-w-lg mx-auto">
          <BlessingVideo
            theme={theme}
            language={language}
            onComplete={handleVideoComplete}
          />
        </div>
      </div>

      {/* Footer hint */}
      <div className="p-4 text-center">
        <p className="text-xs text-gray-500">
          长按屏幕可跳过视频
        </p>
      </div>
    </div>
  )
} 