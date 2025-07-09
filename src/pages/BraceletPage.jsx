import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useBraceletProfile } from '../hooks/useBraceletProfile'

// 信息展示项组件
function InfoItem({ label, value, icon }) {
  return (
    <div className="flex items-center bg-orange-100 p-3 rounded-lg shadow-sm">
      <i className={`fas ${icon} text-orange-500 mr-3 text-xl`}></i>
      <div>
        <span className="font-semibold text-orange-800">{label}:</span>
        <span className="ml-2 text-orange-700">{value || '暂无'}</span>
      </div>
    </div>
  )
}

// 导航项组件
function NavItem({ id, label, icon, active, onClick }) {
  return (
    <li
      className={`cursor-pointer nav-item ${
        active
          ? 'text-orange-500 border-b-2 border-orange-500'
          : 'text-gray-600'
      } hover:text-orange-500 transition-colors duration-200 pb-2 px-2 md:px-4`}
      onClick={onClick}
    >
      <i className={`fas ${icon} mr-1 md:mr-2`}></i>
      <span className="text-sm md:text-base">{label}</span>
    </li>
  )
}

// 视频播放器组件
function VideoPlayer({ src, title }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <video controls className="w-full rounded-lg shadow-lg">
        <source src={src} type="video/mp4" />
        您的浏览器不支持视频播放。
      </video>
    </div>
  )
}

export default function BraceletPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  // 从 URL 或 state 获取 chipId
  const chipIdFromState = location.state?.chipId
  const chipIdFromURL = searchParams.get('braceletId') || searchParams.get('braceletid') || searchParams.get('chipId')
  const chipId = chipIdFromState || chipIdFromURL || 'demo-chip'
  
  const { profile: braceletInfo, loading, error } = useBraceletProfile(chipId)
  const [activeSection, setActiveSection] = useState('basic')

  // 滚动到指定 section
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(sectionId)
    }
  }

  // 导航到修炼页面
  const navigateToWishPractice = () => {
    window.open('https://bless.top/bg.html', '_blank')
  }

  // 如果数据还在加载
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-300 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl text-orange-700">加载法宝信息中，请稍候...</p>
        </div>
      </div>
    )
  }

  // 如果出现错误
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-red-600 text-lg">
          无法获取法宝信息，请检查 braceletId 是否正确或稍后重试。
        </p>
        <p className="text-sm text-gray-600">错误: {error}</p>
        <div className="flex space-x-4">
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
            onClick={() => window.location.reload()}
          >
            重试
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            onClick={() => navigate('/blessing', { state: { chipId } })}
          >
            开始布施
          </button>
        </div>
      </div>
    )
  }

  // 如果成功获取到 braceletInfo
  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: 'url(https://package-app-storage.oss-cn-shenzhen.aliyuncs.com/h5/open_light_bg2.webp)',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-8 font-chinese" 
            style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
          心无挂碍般若文创
        </h1>
        
        {/* 导航栏 */}
        <nav className="mb-8 sticky top-0 bg-white shadow-md rounded-lg p-2 md:p-4 z-10 overflow-x-auto">
          <ul className="flex justify-between md:justify-around">
            <NavItem
              id="basic"
              label="法宝信息"
              icon="fa-info-circle"
              active={activeSection === 'basic'}
              onClick={() => scrollToSection('basic')}
            />
            <NavItem
              id="consecration"
              label="仪式加持"
              icon="fa-pray"
              active={activeSection === 'consecration'}
              onClick={() => scrollToSection('consecration')}
            />
            <NavItem
              id="lamp"
              label="供灯加持"
              icon="fa-fire"
              active={activeSection === 'lamp'}
              onClick={() => scrollToSection('lamp')}
            />
            <NavItem
              id="merit"
              label="今日求签"
              icon="fa-heart"
              active={activeSection === 'merit'}
              onClick={() => scrollToSection('merit')}
            />
          </ul>
        </nav>
        
        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-lg overflow-hidden">
          <div className="p-4 md:p-6">
            {/* 基本信息 */}
            <div id="basic" className="flex flex-col md:flex-row items-center mb-12">
              <div className="w-full md:w-1/3 mb-6 md:mb-0">
                <img
                  src={braceletInfo?.imageUrl || '/placeholder-bracelet.jpg'}
                  alt="Buddhist prayer beads"
                  className="w-full h-auto rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0Y2QUQ1NSIvPgogIDx0ZXh0IHg9IjE1MCIgeT0iMTcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI2MCI+8J+qtzwvdGV4dD4KPC9zdmc+'
                  }}
                />
              </div>
              <div className="w-full md:w-2/3 md:pl-8">
                <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-orange-600 border-b-2 border-orange-500 inline-block pb-1">
                  法宝基本信息
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoItem label="主人" value={braceletInfo?.owner} icon="fa-user" />
                  <InfoItem label="芯片编号" value={chipId} icon="fa-microchip" />
                  <InfoItem label="材质类型" value={braceletInfo?.material} icon="fa-gem" />
                  <InfoItem label="佛珠数量" value={braceletInfo?.beadCount || '108'} icon="fa-circle" />
                  <InfoItem label="法宝等级" value={braceletInfo?.level || '一级'} icon="fa-star" />
                  <InfoItem label="功德积分" value={braceletInfo?.meritPoints || '108'} icon="fa-heart" />
                </div>
              </div>
            </div>

            {/* 仪式加持 */}
            <div id="consecration" className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-orange-600 border-b-2 border-orange-500 inline-block pb-1">
                仪式加持
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <InfoItem label="开光时间" value={braceletInfo?.consecrationDate || '2024-01-01'} icon="fa-calendar-alt" />
                <InfoItem label="开光寺院" value={braceletInfo?.consecrationTemple || '普陀山寺'} icon="fa-place-of-worship" />
                <InfoItem label="开光殿堂" value={braceletInfo?.consecrationHall || '观音殿'} icon="fa-gopuram" />
                <InfoItem label="主持法师" value={braceletInfo?.consecrationMaster || '慧明法师'} icon="fa-user-tie" />
              </div>
              <VideoPlayer
                src={braceletInfo?.consecrationVideo || ''}
                title="开光仪式视频"
              />
            </div>

            {/* 供灯加持 */}
            <div id="lamp" className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-orange-600 border-b-2 border-orange-500 inline-block pb-1">
                供灯许愿
              </h2>
              <VideoPlayer
                src={braceletInfo?.lampOfferingVideo || ''}
                title="供灯仪式视频"
              />
            </div>

            {/* 修炼加持 */}
            <div id="merit" className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-orange-600 border-b-2 border-orange-500 inline-block pb-1">
                今日求签
              </h2>
              <div className="bg-gray-200 rounded-full h-6 overflow-hidden mb-6">
                <div
                  className="bg-orange-500 h-full transition-all duration-1000 ease-in-out"
                  style={{ width: `${braceletInfo?.meritProgress || 75}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <button
                    onClick={navigateToWishPractice}
                    className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition duration-300 transform hover:scale-105 shadow-lg text-lg"
                  >
                    今日求签
                  </button>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => navigate('/blessing', { state: { chipId, profile: braceletInfo } })}
                    className="bg-primary text-white px-6 py-3 rounded-full hover:bg-primary-600 transition duration-300 transform hover:scale-105 shadow-lg text-lg"
                  >
                    开始布施
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 