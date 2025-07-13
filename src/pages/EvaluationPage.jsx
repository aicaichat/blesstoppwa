import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function EvaluationPage() {
  const [currentStep, setCurrentStep] = useState('pre-evaluation') // pre-evaluation -> post-evaluation -> result
  const [preEmotion, setPreEmotion] = useState(null)
  const [postEmotion, setPostEmotion] = useState(null)
  const [experienceRating, setExperienceRating] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  // 情绪状态选项
  const emotionOptions = [
    { id: 1, label: '很焦虑', emoji: '😰', value: 1, color: 'bg-red-500' },
    { id: 2, label: '有些焦虑', emoji: '😟', value: 2, color: 'bg-orange-500' },
    { id: 3, label: '一般', emoji: '😐', value: 3, color: 'bg-yellow-500' },
    { id: 4, label: '比较平静', emoji: '😌', value: 4, color: 'bg-green-500' },
    { id: 5, label: '很平静', emoji: '😇', value: 5, color: 'bg-blue-500' }
  ]

  // 体验评价选项
  const experienceOptions = [
    { id: 1, label: '完全无效', value: 1 },
    { id: 2, label: '有一点效果', value: 2 },
    { id: 3, label: '有明显效果', value: 3 },
    { id: 4, label: '效果很好', value: 4 },
    { id: 5, label: '效果极佳', value: 5 }
  ]

  useEffect(() => {
    setIsVisible(true)
    
    // 模拟从体验页面传递的前置评估数据
    const preEvaluationData = sessionStorage.getItem('preEvaluation')
    if (preEvaluationData) {
      setPreEmotion(JSON.parse(preEvaluationData))
      setCurrentStep('post-evaluation')
    }
  }, [])

  const handlePreEvaluation = (emotion) => {
    setPreEmotion(emotion)
    // 保存到sessionStorage，供体验完成后使用
    sessionStorage.setItem('preEvaluation', JSON.stringify(emotion))
    setCurrentStep('post-evaluation')
  }

  const handlePostEvaluation = (emotion) => {
    setPostEmotion(emotion)
    setCurrentStep('result')
  }

  const handleExperienceRating = (rating) => {
    setExperienceRating(rating)
    
    // 发送评估数据到后端
    sendEvaluationData({
      preEmotion: preEmotion.value,
      postEmotion: emotion.value,
      experienceRating: rating.value,
      improvementRate: ((emotion.value - preEmotion.value) / preEmotion.value * 100).toFixed(1),
      timestamp: new Date().toISOString()
    })
  }

  const sendEvaluationData = async (data) => {
    try {
      // 这里会调用后端API保存评估数据
      console.log('发送评估数据:', data)
      // await fetch('/api/evaluation', { method: 'POST', body: JSON.stringify(data) })
    } catch (error) {
      console.error('发送评估数据失败:', error)
    }
  }

  const calculateImprovement = () => {
    if (!preEmotion || !postEmotion) return 0
    const improvement = ((postEmotion.value - preEmotion.value) / preEmotion.value * 100)
    return Math.max(0, improvement).toFixed(1)
  }

  const getImprovementMessage = () => {
    const improvement = calculateImprovement()
    if (improvement >= 50) return '效果显著！心情明显改善'
    if (improvement >= 20) return '效果不错，有明显改善'
    if (improvement >= 10) return '有一定效果，心情有所改善'
    return '继续坚持，效果会逐渐显现'
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
          
          {/* 体验前评估 */}
          {currentStep === 'pre-evaluation' && (
            <div className="text-center max-w-lg mx-auto">
              <div className="deity-glass-card p-8">
                <div className="mb-8">
                  <h1 className="text-3xl font-chinese text-deity-gradient mb-4">
                    开始前的心情状态
                  </h1>
                  <p className="text-gray-600">
                    请选择最符合您当前心情的选项
                  </p>
                </div>

                <div className="space-y-4">
                  {emotionOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handlePreEvaluation(option)}
                      className="w-full p-4 rounded-lg border-2 border-transparent hover:border-deity-purple transition-all duration-200 deity-glass-card"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl">{option.emoji}</div>
                          <div className="text-left">
                            <div className="font-chinese text-lg">{option.label}</div>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full ${option.color}`}></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 体验后评估 */}
          {currentStep === 'post-evaluation' && (
            <div className="text-center max-w-lg mx-auto">
              <div className="deity-glass-card p-8">
                <div className="mb-8">
                  <h1 className="text-3xl font-chinese text-deity-gradient mb-4">
                    体验后的心情状态
                  </h1>
                  <p className="text-gray-600">
                    经过神仙朋友的陪伴，您现在的心情如何？
                  </p>
                </div>

                <div className="space-y-4">
                  {emotionOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handlePostEvaluation(option)}
                      className="w-full p-4 rounded-lg border-2 border-transparent hover:border-deity-purple transition-all duration-200 deity-glass-card"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl">{option.emoji}</div>
                          <div className="text-left">
                            <div className="font-chinese text-lg">{option.label}</div>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full ${option.color}`}></div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* 显示之前的状态 */}
                {preEmotion && (
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                      体验前状态：{preEmotion.emoji} {preEmotion.label}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 评估结果 */}
          {currentStep === 'result' && (
            <div className="text-center max-w-lg mx-auto">
              <div className="deity-glass-card p-8">
                <div className="mb-8">
                  <div className="text-6xl mb-4 animate-bounce">✨</div>
                  <h1 className="text-3xl font-chinese text-deity-gradient mb-4">
                    体验效果评估
                  </h1>
                </div>

                {/* 改善效果展示 */}
                <div className="mb-8">
                  <div className="gradient-border-card mb-6">
                    <div className="gradient-border-inner">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-center">
                          <div className="text-2xl mb-2">{preEmotion.emoji}</div>
                          <div className="text-sm text-gray-600">体验前</div>
                          <div className="font-chinese">{preEmotion.label}</div>
                        </div>
                        <div className="flex-1 mx-4">
                          <div className="text-center mb-2">
                            <div className="text-2xl font-bold text-deity-gradient">
                              +{calculateImprovement()}%
                            </div>
                            <div className="text-sm text-gray-600">改善</div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-deity-purple to-deity-pink h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min(calculateImprovement(), 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-2">{postEmotion.emoji}</div>
                          <div className="text-sm text-gray-600">体验后</div>
                          <div className="font-chinese">{postEmotion.label}</div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-chinese text-deity-gradient mb-2">
                          {getImprovementMessage()}
                        </div>
                        <div className="text-sm text-gray-600">
                          🙏 千手观音已为您送上祝福
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 体验评价 */}
                <div className="mb-8">
                  <h3 className="text-lg font-chinese text-deity-gradient mb-4">
                    请为这次体验打分
                  </h3>
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleExperienceRating({ value: star })}
                        className={`text-3xl transition-all duration-200 ${
                          experienceRating && experienceRating.value >= star
                            ? 'text-yellow-400 scale-110'
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>

                {/* 行动按钮 */}
                <div className="space-y-4">
                  <Link
                    to="/blessing/gift"
                    className="deity-button text-lg font-chinese py-3 px-6 glow-effect block"
                  >
                    🎁 查看专属祝福
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