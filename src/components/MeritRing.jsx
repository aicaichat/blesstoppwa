import React from 'react'

/**
 * MeritRing – 固定在屏幕右上方的功德 HUD。
 * props:
 *   value: 当前功德值 (number)
 *   onClick: 点击回调，可用于展开面板
 */
export default function MeritRing({ value = 0, onClick, onLongPress }) {
  const radius = 36
  const circ = 2 * Math.PI * radius
  const dailyTarget = 3 // 日目标功德
  const pct = Math.min(value % dailyTarget, dailyTarget) / dailyTarget

  // 颜色随总功德渐变
  const interpolate = (count) => {
    const start = { r: 254, g: 235, b: 200 }
    const end = { r: 192, g: 86, b: 33 }
    const c = Math.min(count, 500)
    const ratio = c / 500
    const r = Math.round(start.r + (end.r - start.r) * ratio)
    const g = Math.round(start.g + (end.g - start.g) * ratio)
    const b = Math.round(start.b + (end.b - start.b) * ratio)
    return `rgb(${r},${g},${b})`
  }

  const ringColor = interpolate(value)
  const textColor = value < 200 ? '#744210' : '#ffffff'

  let timer
  const handleMouseDown = () => {
    timer = setTimeout(() => {
      onLongPress && onLongPress()
    }, 800)
  }
  const clear = () => clearTimeout(timer)

  return (
    <div
      className="fixed top-4 right-4 z-50" style={{ width: 80, height: 80 }}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={clear}
      onMouseLeave={clear}
      onTouchStart={handleMouseDown}
      onTouchEnd={clear}
    >
      <svg width="80" height="80" viewBox="0 0 100 100" className="drop-shadow-lg">
        <circle cx="50" cy="50" r={radius} stroke="#FEEBC8" strokeWidth="8" fill="none" />
        <circle
          cx="50" cy="50" r={radius}
          stroke={ringColor}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={(1 - pct) * circ}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="55" textAnchor="middle" fontSize="20" fill={textColor} fontWeight="bold">
          {value}
        </text>
      </svg>
    </div>
  )
} 
 