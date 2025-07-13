import React from 'react'
import { Parallax } from 'react-scroll-parallax'

const DEFAULT_IMGS = [
  'https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/%E4%B8%8D%E5%8A%A8%E5%B0%8A%E8%8F%A9%E8%90%A8.jpg',
  'https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/%E5%8D%83%E6%89%8B%E8%A7%82%E9%9F%B3.jpg',
  'https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/%E5%A4%A7%E5%8A%BF%E8%87%B3%E8%8F%A9%E8%90%A8.jpg',
  'https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/%E5%A4%A7%E6%97%A5%E5%A6%82%E6%9D%A5.jpg'
]

export default function ParallaxBuddhaBackground({ images = DEFAULT_IMGS }) {
  return (
    <div className="absolute inset-0 -z-20 pointer-events-none overflow-hidden">
      {/* 底色 */}
      <div className="absolute inset-0 bg-[#FBEFDD]" />
      {images.map((src, idx) => (
        <Parallax
          key={idx}
          speed={-5 + idx * 3} // -5, -2, 1, 4 speeds for depth
          className="absolute inset-0"
        >
          <img src={src} alt="Buddha layer" className="w-full h-full object-cover opacity-40" />
        </Parallax>
      ))}
      {/* 顶部渐变遮罩确保文字可读 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FBEFDD] via-transparent to-transparent" />
    </div>
  )
} 