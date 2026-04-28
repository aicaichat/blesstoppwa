import { useMemo, useState } from 'react'

const focusOptions = [
  { value: 'career', label: '事业走势' },
  { value: 'love', label: '感情关系' },
  { value: 'wealth', label: '财富机会' },
  { value: 'health', label: '身心状态' }
]

const lineTemplates = {
  life: {
    title: '生命线',
    descriptions: [
      '生命线圆润有力，代表精力稳定，适合循序渐进地推进长期目标。',
      '生命线略有波折，提示你近期节奏较快，建议给自己留出恢复空间。',
      '生命线起点清晰，说明你对生活方向有把控力，执行力会成为优势。'
    ]
  },
  head: {
    title: '智慧线',
    descriptions: [
      '智慧线较长，思考深入，适合做分析、策划与创意类决策。',
      '智慧线末端微微上扬，意味着你学习吸收快，适合尝试新领域。',
      '智慧线分叉，代表你具备多角度思维，但要注意避免过度内耗。'
    ]
  },
  heart: {
    title: '感情线',
    descriptions: [
      '感情线清晰柔和，说明你表达情绪的能力较强，人际关系较顺畅。',
      '感情线中段偏浅，提示你近期容易把压力藏在心里，可多做沟通。',
      '感情线稳定向上，代表你在关系中更愿意主动经营与投入。'
    ]
  },
  fate: {
    title: '事业线',
    descriptions: [
      '事业线向上明显，近期目标感增强，适合推进关键项目。',
      '事业线断续，意味着阶段变化较多，建议先稳住基本盘再扩张。',
      '事业线靠近中央，说明你在团队中逐步建立影响力。'
    ]
  }
}

const guidanceMap = {
  career: '未来 2 周建议你优先处理“重要但不紧急”的任务，专注比忙碌更关键。',
  love: '未来 2 周适合主动表达感受，一次高质量沟通胜过反复猜测。',
  wealth: '未来 2 周适合做预算和复盘，稳健策略比追逐热点更有收益。',
  health: '未来 2 周建议固定作息并增加轻运动，你的状态会明显改善。'
}

const scoreColor = (score) => {
  if (score >= 85) return 'text-emerald-600'
  if (score >= 70) return 'text-amber-600'
  return 'text-rose-500'
}

const getReadingResult = (seed, focus) => {
  const pick = (arr, offset) => arr[(seed + offset) % arr.length]
  const makeScore = (offset) => 65 + ((seed * (offset + 3)) % 36)

  const lifeScore = makeScore(1)
  const headScore = makeScore(2)
  const heartScore = makeScore(3)
  const fateScore = makeScore(4)

  return {
    summary: `你的手相整体呈现“稳中有升”的趋势。当前最值得发力的是${focusOptions.find((f) => f.value === focus)?.label || '事业走势'}。`,
    lines: [
      {
        key: 'life',
        title: lineTemplates.life.title,
        score: lifeScore,
        description: pick(lineTemplates.life.descriptions, 1)
      },
      {
        key: 'head',
        title: lineTemplates.head.title,
        score: headScore,
        description: pick(lineTemplates.head.descriptions, 2)
      },
      {
        key: 'heart',
        title: lineTemplates.heart.title,
        score: heartScore,
        description: pick(lineTemplates.heart.descriptions, 3)
      },
      {
        key: 'fate',
        title: lineTemplates.fate.title,
        score: fateScore,
        description: pick(lineTemplates.fate.descriptions, 4)
      }
    ],
    advice: guidanceMap[focus]
  }
}

export default function PalmReadingPage() {
  const [hand, setHand] = useState('left')
  const [focus, setFocus] = useState('career')
  const [nickname, setNickname] = useState('')
  const [photo, setPhoto] = useState('')
  const [seed, setSeed] = useState(7)
  const [generated, setGenerated] = useState(false)

  const result = useMemo(() => getReadingResult(seed, focus), [seed, focus])

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const localSeed = Array.from(file.name).reduce((acc, char) => acc + char.charCodeAt(0), 0)
    setSeed((localSeed % 97) + 3)

    const reader = new FileReader()
    reader.onload = () => {
      setPhoto(reader.result?.toString() || '')
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-fuchsia-50 via-white to-violet-50 p-4 pb-10">
      <div className="max-w-md mx-auto">
        <header className="pt-5 pb-4 text-center">
          <p className="text-xs tracking-[0.2em] text-violet-500">PALM READING H5</p>
          <h1 className="text-3xl font-bold text-violet-900 mt-2">AI 手相解读</h1>
          <p className="text-sm text-gray-600 mt-2">上传手掌照片，30 秒生成你的专属运势报告</p>
        </header>

        <section className="rounded-2xl bg-white shadow-lg border border-violet-100 p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">昵称（可选）</label>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="请输入你的昵称"
              className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">选择手掌</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => setHand('left')}
                className={`rounded-xl py-2 text-sm border ${hand === 'left' ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-700 border-gray-200'}`}
              >
                左手（先天）
              </button>
              <button
                onClick={() => setHand('right')}
                className={`rounded-xl py-2 text-sm border ${hand === 'right' ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-700 border-gray-200'}`}
              >
                右手（后天）
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">重点解读方向</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {focusOptions.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFocus(item.value)}
                  className={`rounded-xl py-2 text-sm border ${focus === item.value ? 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200' : 'bg-white text-gray-700 border-gray-200'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">上传手掌照片</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="mt-2 w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-100 file:px-3 file:py-2 file:text-violet-700"
            />
            {photo && (
              <img src={photo} alt="手掌预览" className="mt-3 h-40 w-full rounded-xl object-cover border border-violet-100" />
            )}
          </div>

          <button
            onClick={() => setGenerated(true)}
            className="w-full rounded-xl bg-violet-600 text-white py-3 font-medium active:scale-[0.98] transition"
          >
            开始解读
          </button>
        </section>

        {generated && (
          <section className="mt-5 rounded-2xl bg-white shadow-lg border border-violet-100 p-4">
            <h2 className="text-lg font-bold text-violet-900">{nickname ? `${nickname} 的手相报告` : '你的手相报告'}</h2>
            <p className="text-xs text-gray-500 mt-1">解读手掌：{hand === 'left' ? '左手（先天）' : '右手（后天）'}</p>
            <p className="mt-3 text-sm text-gray-700 leading-6">{result.summary}</p>

            <div className="mt-4 space-y-3">
              {result.lines.map((line) => (
                <article key={line.key} className="rounded-xl bg-violet-50/60 p-3 border border-violet-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-violet-900">{line.title}</h3>
                    <span className={`text-sm font-bold ${scoreColor(line.score)}`}>{line.score} 分</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">{line.description}</p>
                </article>
              ))}
            </div>

            <div className="mt-4 rounded-xl bg-fuchsia-50 border border-fuchsia-100 p-3">
              <p className="text-sm text-fuchsia-800">🔮 运势建议：{result.advice}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
