import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import GlassCard from '../components/GlassCard'
import ParticleBackground from '../components/ParticleBackground'
import FloatingOrbs from '../components/FloatingOrbs'
import ParallaxBuddhaBackground from '../components/ParallaxBuddhaBackground'

export default function SummonPage() {
  const { braceletId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    // mock fetch — replace with real API
    async function fetchData() {
      try {
        // demo only
        const mock = {
          owner: '小李',
          god: {
            name: '势曜',
            title: '大势至菩萨',
            image: 'https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/%E5%A4%A7%E5%8A%BF%E8%87%B3%E8%8F%A9%E8%90%A8.jpg',
            video: 'https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/675.mp4?OSSAccessKeyId=TMP.3Kp9CZrBxeyhyQb3Mo6paef3d4KVwB3dH5H7ajXP2DUToJUPdNnwFeWV3jVEchAyQy5LRghUx44WERAw3WYaE5vfeRAzYK&Expires=1752306238&Signature=AIgSIAneTkXEcQhyt07urGD4Dic%3D',
            voiceGreeting: '我是势曜神，感应到你今日气场澄明。',
            blessing: '愿你得势乘时，突破难关。',
            suggestion: '今日适合推进重要事项，下午申时（15-17点）为佳。'
          }
        }
        // simulate delay
        await new Promise(r => setTimeout(r, 400))
        setData(mock)
      } catch (e) {
        setError('加载失败')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [braceletId])

  if (loading) return <div className="min-h-screen flex items-center justify-center">加载中...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>

  const { god, owner } = data

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParallaxBuddhaBackground />
      <FloatingOrbs />
      <ParticleBackground />

      <motion.div
        className="min-h-screen flex items-center justify-center p-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <GlassCard className="max-w-md w-full p-6 text-center">
          <img src={god.image} alt={god.title} className="w-48 h-48 object-cover rounded-full mx-auto mb-4 shadow-lg" />
          <h2 className="text-2xl font-bold text-orange-600 mb-1">{god.title}</h2>
          <p className="text-lg text-gray-700 mb-4">神名：{god.name}</p>
          <p className="text-gray-800 mb-2">{god.voiceGreeting}</p>
          <p className="font-semibold text-orange-600 mb-2">{god.blessing}</p>
          <p className="text-gray-700 mb-4">{god.suggestion}</p>

          <button
            onClick={() => setShowVideo(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full shadow-md hover:scale-105 transition"
          >
            开启加持仪式
          </button>
        </GlassCard>
      </motion.div>

      {showVideo && (
        <motion.div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <video src={god.video} autoPlay controls playsInline className="w-full h-full object-contain" />
          <button onClick={() => setShowVideo(false)} className="absolute top-4 right-4 text-white text-3xl">×</button>
        </motion.div>
      )}
    </div>
  )
} 