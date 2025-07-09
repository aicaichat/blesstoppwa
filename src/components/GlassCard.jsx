import React from 'react';

/**
 * GlassCard – 玻璃拟态容器，沿用 blessnow 视觉。
 * 用法:
 * <GlassCard className="p-4">...</GlassCard>
 */
export default function GlassCard({ children, className = '' }) {
  return (
    <div className={`bg-white/90 backdrop-blur rounded-lg shadow-lg ${className}`}>
      {children}
    </div>
  );
} 