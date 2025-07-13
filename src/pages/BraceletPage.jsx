import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import GlassCard from '../components/GlassCard'
import VideoWithFade from '../components/VideoWithFade'
import MeritRing from '../components/MeritRing'
import TypingSutra from '../components/TypingSutra'

// 复用背景粒子组件
import ParticleBackground from '../components/ParticleBackground'
import FloatingOrbs from '../components/FloatingOrbs'
import ParallaxBuddhaBackground from '../components/ParallaxBuddhaBackground'
import { motion } from 'framer-motion'

export default function BraceletPage() {
  const { braceletId } = useParams()
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [merit, setMerit] = useState(() => +localStorage.getItem('merit') || 0)

  // 全屏视频
  const [fullSrc, setFullSrc] = useState(null) // for other videos
  const sutraRef = useRef(null)
  const [showTrend, setShowTrend] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        // 如果是默认ID，使用默认信息
        if (braceletId === 'default') {
          const defaultInfo = {
            owner: '观音菩萨',
            chipId: 'GUANYIN-001',
            material: '紫檀木',
            beadCount: 108,
            level: '神级',
            imageUrl: 'https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/%E5%8D%83%E6%89%8B%E8%A7%82%E9%9F%B3.jpg',
            consecrationVideo: 'https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/676.mp4',
            lampOfferingVideo: 'https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/676.mp4'
          }
          setInfo(defaultInfo)
          setLoading(false)
          return
        }
        
        const res = await fetch(`https://bless.top/wp-json/bracelet-info/v1/bracelet/${braceletId}`)
        if (!res.ok) throw new Error('请求失败')
        const data = await res.json()
        setInfo(data)
      } catch (err) {
        console.error(err)
        setError('无法获取法宝信息')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [braceletId])

  const addMerit = () => {
    const m = merit + 1
    setMerit(m)
    localStorage.setItem('merit', m)
  }

  const gotoDraw = () => { window.location.href = 'https://bless.top/sss.html' }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory relative deity-bg">
      <ParallaxBuddhaBackground images={[
        'https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/%E5%8D%83%E6%89%8B%E8%A7%82%E9%9F%B3.jpg'
      ]} />
      <FloatingOrbs />
      <ParticleBackground />
      <MeritRing value={merit} onLongPress={() => setShowTrend(true)} />

      {/* Section 1: Hero */}
      <motion.section
        className="min-h-screen snap-start flex flex-col justify-center items-center px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
          <GlassCard className="max-w-md w-full p-6 text-center">
            <img
              src="https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/%E5%8D%83%E6%89%8B%E8%A7%82%E9%9F%B3.jpg"
              alt="观音菩萨"
              className="w-48 h-48 object-cover object-top rounded-full mx-auto mb-4 shadow-lg"
            />
            <h2 className="text-3xl md:text-4xl font-chinese text-deity-gradient mb-2 tracking-wide">观音菩萨</h2>
            <p className="text-lg font-chinese text-gray-600 mb-4">神名：观音</p>
            <p className="text-gray-700 font-chinese mb-2">观音菩萨慈悲加持，闻声救苦。</p>
            <p className="font-chinese text-gradient mb-1">愿你心无挂碍，福慧增长。</p>
          </GlassCard>
        </motion.div>
      </motion.section>

      {/* Section 2: 基本信息 + 视频 */}
      <motion.section
        className="min-h-screen snap-start flex justify-center items-center p-4"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <GlassCard className="w-full max-w-4xl p-6">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <img src={info?.imageUrl} alt="bracelet" loading="lazy" className="w-full rounded-xl shadow-xl" />
            <div>
              <h2 className="text-3xl font-chinese text-deity-gradient mb-4 tracking-wide">法宝信息</h2>
              <ul className="space-y-2 text-gray-700">
                <li>主人：{info?.owner}</li>
                <li>芯片编号：{info?.chipId}</li>
                <li>材质类型：{info?.material}</li>
                <li>佛珠数量：{info?.beadCount}</li>
                <li>法宝等级：{info?.level}</li>
              </ul>
            </div>
          </div>

          {/* 视频区域 */}
          {info?.consecrationVideo && (
            <VideoWithFade src={info.consecrationVideo} title="开光仪式视频" poster={info?.imageUrl} />
          )}
          {info?.lampOfferingVideo && (
            <VideoWithFade src={info.lampOfferingVideo} title="供灯仪式视频" poster={info?.imageUrl} />
          )}
        </GlassCard>
      </motion.section>

      {/* Section 3: 修持心经 */}
      <motion.section
        className="min-h-screen snap-start flex justify-center items-center p-4"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <GlassCard className="w-full max-w-3xl p-6">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4">修持心经</h2>

          <div className="relative mb-4">
            <video
              ref={sutraRef}
              controls
              playsInline
              preload="metadata"
              crossorigin="anonymous"
              className="w-full rounded-xl shadow-xl"
              onLoadStart={() => console.log('Video loading started')}
              onLoadedData={() => console.log('Video data loaded')}
              onError={(e) => {
                console.error('Video error:', e);
                console.error('Error code:', e.target.error?.code);
                console.error('Error message:', e.target.error?.message);
              }}
              onCanPlay={() => console.log('Video can play')}
            >
              <source src="https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/676.mp4" type="video/mp4" />
              您的浏览器不支持视频播放。
            </video>
            <button
              className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full"
              onClick={() => {
                if (sutraRef.current) {
                  if (sutraRef.current.requestFullscreen) {
                    sutraRef.current.requestFullscreen()
                  } else if (sutraRef.current.webkitEnterFullscreen) {
                    sutraRef.current.webkitEnterFullscreen()
                  }
                }
              }}
            >
              <i className="fas fa-expand"></i>
            </button>
          </div>

          <TypingSutra />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-full shadow-md hover:scale-105 transition" onClick={addMerit}>完成修持 +1</button>
            <button className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-full shadow-md hover:scale-105 transition" onClick={gotoDraw}>今日求签</button>
          </div>
        </GlassCard>
      </motion.section>

      {/* 全屏视频 */}
      {fullSrc && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={() => setFullSrc(null)}>
          <video src={fullSrc} autoPlay controls playsInline className="w-full h-full object-contain" />
          <button className="absolute top-4 right-4 text-white text-3xl" onClick={() => setFullSrc(null)}>
            ×
          </button>
        </div>
      )}

      {showTrend && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 120 }}
          className="fixed top-0 right-0 h-full w-4/5 md:w-1/3 bg-white/90 backdrop-blur-lg shadow-2xl z-50 p-6 overflow-auto"
        >
          <h3 className="text-xl font-semibold mb-4 text-orange-500">近 7 日功德趋势</h3>
          <p className="text-gray-600 mb-4">(示例) 您已累计 {merit} 点功德。</p>
          <button className="bg-orange-500 text-white px-4 py-2 rounded" onClick={() => setShowTrend(false)}>关闭</button>
        </motion.div>
      )}
    </div>
  )
} 
 