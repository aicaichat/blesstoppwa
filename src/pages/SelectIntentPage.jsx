import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function SelectIntentPage() {
  const [selectedIntent, setSelectedIntent] = useState(null)
  const [currentStep, setCurrentStep] = useState('select') // select -> confirm -> personalized
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  // 7大神仙功能配置
  const intentOptions = [
    {
      id: 'blessing',
      name: '祈福许愿',
      emoji: '🙏',
      description: '为自己和家人祈福，许下美好愿望',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700',
      keywords: ['平安', '健康', '顺利', '如意'],
      videoType: 'blessing',
      sutraFocus: 'compassion',
      meditationStyle: 'loving-kindness'
    },
    {
      id: 'divination',
      name: '占卜指引',
      emoji: '🎯',
      description: '人生重大决策，寻求智慧指引',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      keywords: ['智慧', '指引', '决策', '明晰'],
      videoType: 'wisdom',
      sutraFocus: 'wisdom',
      meditationStyle: 'insight'
    },
    {
      id: 'reminder',
      name: '每日提醒',
      emoji: '⏰',
      description: '建立良好习惯，每日正念提醒',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      keywords: ['坚持', '习惯', '提醒', '成长'],
      videoType: 'mindfulness',
      sutraFocus: 'mindfulness',
      meditationStyle: 'awareness'
    },
    {
      id: 'wealth',
      name: '财运加持',
      emoji: '💰',
      description: '事业发展，财运亨通，正财偏财',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
      keywords: ['财运', '事业', '成功', '丰盛'],
      videoType: 'prosperity',
      sutraFocus: 'abundance',
      meditationStyle: 'gratitude'
    },
    {
      id: 'beauty',
      name: '美丽祝福',
      emoji: '💅',
      description: '内在外在美丽提升，自信魅力',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-700',
      keywords: ['美丽', '自信', '魅力', '优雅'],
      videoType: 'beauty',
      sutraFocus: 'self-love',
      meditationStyle: 'confidence'
    },
    {
      id: 'love',
      name: '感情和合',
      emoji: '💕',
      description: '爱情美满，人际关系和谐',
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      keywords: ['爱情', '和合', '关系', '缘分'],
      videoType: 'love',
      sutraFocus: 'harmony',
      meditationStyle: 'loving-kindness'
    },
    {
      id: 'health',
      name: '健康平安',
      emoji: '🏥',
      description: '身心健康，远离疾病，平安喜乐',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-700',
      keywords: ['健康', '平安', '康复', '活力'],
      videoType: 'healing',
      sutraFocus: 'healing',
      meditationStyle: 'body-scan'
    }
  ]

  // 个性化问题配置
  const personalizedQuestions = {
    blessing: [
      { question: '您最希望为谁祈福？', options: ['自己', '家人', '朋友', '所有人'] },
      { question: '您最希望祈求什么？', options: ['健康', '平安', '顺利', '如意'] }
    ],
    divination: [
      { question: '您遇到的主要困惑是？', options: ['工作选择', '人生方向', '重要决定', '内心迷茫'] },
      { question: '您希望获得什么指引？', options: ['智慧启发', '方向明确', '内心平静', '决策勇气'] }
    ],
    wealth: [
      { question: '您的财运需求是？', options: ['事业发展', '投资理财', '创业机会', '财富增长'] },
      { question: '您最重视的是？', options: ['稳定收入', '事业成功', '投资回报', '财务自由'] }
    ],
    love: [
      { question: '您的感情状态是？', options: ['单身寻缘', '恋爱中', '已婚夫妻', '修复关系'] },
      { question: '您最希望改善的是？', options: ['遇到真爱', '关系和谐', '沟通理解', '长久幸福'] }
    ],
    beauty: [
      { question: '您最关注的美丽方面？', options: ['外貌气质', '内在修养', '自信魅力', '整体形象'] },
      { question: '您希望提升的是？', options: ['外在美丽', '内在气质', '自信心', '个人魅力'] }
    ],
    health: [
      { question: '您的健康关注点是？', options: ['身体健康', '心理健康', '疾病康复', '整体平衡'] },
      { question: '您最希望改善的是？', options: ['体质强健', '心情愉悦', '远离疾病', '精力充沛'] }
    ],
    reminder: [
      { question: '您希望培养的习惯是？', options: ['冥想修行', '健康生活', '学习成长', '工作效率'] },
      { question: '您希望的提醒频率？', options: ['每日一次', '每周三次', '特定时间', '随机提醒'] }
    ]
  }

  const [personalizedAnswers, setPersonalizedAnswers] = useState({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSelectIntent = (intent) => {
    setSelectedIntent(intent)
    setCurrentStep('confirm')
  }

  const handleConfirmIntent = () => {
    setCurrentStep('personalized')
    setCurrentQuestionIndex(0)
  }

  const handlePersonalizedAnswer = (answer) => {
    const questions = personalizedQuestions[selectedIntent.id]
    const currentQuestion = questions[currentQuestionIndex]
    
    setPersonalizedAnswers(prev => ({
      ...prev,
      [currentQuestion.question]: answer
    }))

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      // 完成个性化配置，保存到sessionStorage
      const userProfile = {
        intent: selectedIntent,
        personalizedAnswers: {
          ...personalizedAnswers,
          [currentQuestion.question]: answer
        },
        timestamp: new Date().toISOString()
      }
      
      sessionStorage.setItem('userProfile', JSON.stringify(userProfile))
      
      // 跳转到个性化体验页面
      navigate('/experience')
    }
  }

  const currentQuestions = selectedIntent ? personalizedQuestions[selectedIntent.id] : []
  const currentQuestion = currentQuestions[currentQuestionIndex]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-4xl opacity-10 animate-pulse">✨</div>
        <div className="absolute bottom-20 right-10 text-3xl opacity-15 animate-pulse delay-2000">💫</div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* 功能选择阶段 */}
          {currentStep === 'select' && (
            <div className="text-center max-w-4xl mx-auto">
              <div className="deity-glass-card p-8">
                <div className="mb-8">
                  <h1 className="text-4xl font-chinese text-deity-gradient mb-4">
                    选择您的神仙功能
                  </h1>
                  <p className="text-gray-600 text-lg">
                    告诉我们您的需求，获得个性化的神仙守护体验
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {intentOptions.map((intent) => (
                    <button
                      key={intent.id}
                      onClick={() => handleSelectIntent(intent)}
                      className="group relative overflow-hidden rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                      {/* 背景渐变 */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${intent.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      
                      {/* 卡片内容 */}
                      <div className="relative z-10">
                        <div className={`w-16 h-16 rounded-full ${intent.bgColor} flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors duration-300`}>
                          <span className="text-3xl">{intent.emoji}</span>
                        </div>
                        
                        <h3 className={`text-xl font-chinese ${intent.textColor} group-hover:text-white mb-2 transition-colors duration-300`}>
                          {intent.name}
                        </h3>
                        
                        <p className="text-gray-600 group-hover:text-white/80 text-sm leading-relaxed transition-colors duration-300">
                          {intent.description}
                        </p>
                        
                        {/* 关键词标签 */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {intent.keywords.map((keyword, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-gray-100 group-hover:bg-white/20 text-xs rounded-full text-gray-600 group-hover:text-white/80 transition-colors duration-300"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 确认选择阶段 */}
          {currentStep === 'confirm' && selectedIntent && (
            <div className="text-center max-w-lg mx-auto">
              <div className="deity-glass-card p-8">
                <div className="mb-8">
                  <div className={`w-20 h-20 rounded-full ${selectedIntent.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-4xl">{selectedIntent.emoji}</span>
                  </div>
                  
                  <h1 className="text-3xl font-chinese text-deity-gradient mb-4">
                    {selectedIntent.name}
                  </h1>
                  
                  <p className="text-gray-600 text-lg mb-6">
                    {selectedIntent.description}
                  </p>
                  
                  <div className="gradient-border-card mb-6">
                    <div className="gradient-border-inner">
                      <h3 className="text-lg font-chinese text-deity-gradient mb-3">
                        您将获得的个性化体验
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <span>🎬</span>
                          <span>专属{selectedIntent.name}视频内容</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>📿</span>
                          <span>针对性心经片段选择</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>🧘</span>
                          <span>定制化冥想引导</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>✨</span>
                          <span>个性化祝福与回向</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleConfirmIntent}
                    className="deity-button text-lg font-chinese py-3 px-8 glow-effect"
                  >
                    确认选择，进入个性化设置
                  </button>
                  
                  <button
                    onClick={() => setCurrentStep('select')}
                    className="block w-full text-deity-gradient hover:text-deity-purple transition-colors"
                  >
                    ← 重新选择
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 个性化问题阶段 */}
          {currentStep === 'personalized' && selectedIntent && currentQuestion && (
            <div className="text-center max-w-lg mx-auto">
              <div className="deity-glass-card p-8">
                <div className="mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-16 h-16 rounded-full ${selectedIntent.bgColor} flex items-center justify-center`}>
                      <span className="text-2xl">{selectedIntent.emoji}</span>
                    </div>
                  </div>
                  
                  <h1 className="text-2xl font-chinese text-deity-gradient mb-4">
                    个性化设置
                  </h1>
                  
                  <div className="mb-6">
                    <div className="text-sm text-gray-500 mb-2">
                      第 {currentQuestionIndex + 1} 题 / 共 {currentQuestions.length} 题
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-deity-purple to-deity-pink h-2 rounded-full transition-all duration-500"
                        style={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-chinese text-gray-700 mb-6">
                    {currentQuestion.question}
                  </h2>
                </div>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handlePersonalizedAnswer(option)}
                      className="w-full p-4 rounded-lg border-2 border-transparent hover:border-deity-purple transition-all duration-200 deity-glass-card text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full ${selectedIntent.bgColor} flex items-center justify-center`}>
                          <span className="text-xs">{index + 1}</span>
                        </div>
                        <span className="font-chinese text-lg">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 