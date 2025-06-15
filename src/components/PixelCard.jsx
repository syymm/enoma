'use client';

import { useState } from 'react';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { LoginModal } from './auth/LoginModal';

const PixelCard = ({ 
  title, 
  thumbnail, 
  price, 
  likesCount = 0,
  onLike, 
  onBuy,
  isLiked = false 
}) => {
  const [hovered, setHovered] = useState(false);
  const { requireAuth, isModalOpen, handleModalClose, handleLoginSuccess } = useRequireAuth();

  return (
    <div 
      className="group relative pixel-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 主卡片容器 - 像素风格 */}
      <div className={`
        relative bg-gray-800 border-4 border-gray-600 
        transition-all duration-300 cursor-pointer
        ${hovered ? 'border-yellow-400 shadow-xl shadow-yellow-400/60 ring-2 ring-yellow-400/30' : 'shadow-md shadow-black/50'}
        ${hovered ? 'transform -translate-y-2 scale-105' : ''}
        hover:bg-gray-750
      `}>
        {/* 展示区域 */}
        <div className="relative h-32 sm:h-40 bg-gray-700 border-b-4 border-gray-600 overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className={`
              w-full h-full object-cover transition-all duration-300
              ${hovered ? 'scale-110 filter brightness-110' : 'filter brightness-90'}
            `}
          />
          
          {/* 像素风格覆盖层 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
          
          {/* 标题显示在图片上方 */}
          <div className="absolute top-2 left-2 right-2">
            <div className="bg-black/70 border-2 border-gray-500 px-2 py-1 backdrop-blur-sm">
              <h3 className="text-white font-bold text-xs sm:text-sm leading-tight font-mono truncate">
                {title}
              </h3>
            </div>
          </div>
          
          {/* 悬浮时的像素装饰 */}
          {hovered && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-400 border-2 border-yellow-600 flex items-center justify-center animate-bounce">
              <span className="text-black text-xs">★</span>
            </div>
          )}
        </div>
        
        {/* 底部按钮区域 */}
        <div className="flex h-12 sm:h-14">
          {/* Like 按钮 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              requireAuth(() => onLike && onLike());
            }}
            className={`
              flex-1 flex items-center justify-center space-x-1 sm:space-x-2
              border-r-2 border-gray-600 transition-all duration-300 font-mono
              transform hover:scale-105 active:scale-95
              ${isLiked 
                ? 'bg-red-600 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/25 text-white' 
                : 'bg-rose-900/40 hover:bg-rose-800/60 hover:shadow-lg hover:shadow-rose-500/20 text-rose-200 hover:text-rose-100'
              }
              ${hovered ? 'border-r-yellow-400 shadow-inner' : ''}
              relative overflow-hidden
            `}
          >
            {/* Hover光效 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full transition-transform duration-700 hover:translate-x-full"></div>
            
            {/* 像素风心形图标 */}
            <div className={`
              w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center relative z-10
            `}>
              <img 
                src="/heart.svg" 
                alt="heart" 
                className={`
                  w-full h-full
                  ${isLiked 
                    ? 'brightness-110 hue-rotate-15 drop-shadow-lg animate-pulse' 
                    : 'brightness-90 opacity-75 saturate-50'
                  }
                  transition-all duration-300 hover:scale-125 hover:brightness-125
                  ${isLiked ? 'hover:animate-ping' : 'hover:opacity-100 hover:saturate-100 hover:brightness-110'}
                `}
                style={{
                  filter: isLiked ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))' : ''
                }}
              />
            </div>
            <div className="flex flex-col items-center relative z-10">
              <span className="text-xs sm:text-sm font-bold transition-all duration-200 hover:tracking-wider">LIKE</span>
              <span className={`text-xs transition-colors duration-200 ${
                isLiked ? 'text-red-200' : 'text-rose-300/80'
              }`}>{likesCount}</span>
            </div>
          </button>
          
          {/* 价格按钮 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              requireAuth(() => onBuy && onBuy());
            }}
            className={`
              flex-1 flex items-center justify-center space-x-1 sm:space-x-2
              bg-gray-700 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-600 
              text-gray-300 hover:text-black transition-all duration-300 font-mono
              transform hover:scale-105 active:scale-95
              hover:shadow-lg hover:shadow-yellow-500/25
              ${hovered ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-inner' : ''}
              relative overflow-hidden
            `}
          >
            {/* Hover光效 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full transition-transform duration-700 hover:translate-x-full"></div>
            
            {/* 像素风金币图标 */}
            <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center relative z-10">
              <img 
                src="/coin.svg" 
                alt="coin" 
                className={`
                  w-full h-full
                  ${hovered 
                    ? 'brightness-150 saturate-200 drop-shadow-lg scale-110' 
                    : 'brightness-100 saturate-125'
                  }
                  transition-all duration-300 hover:scale-125 hover:rotate-6
                  hover:brightness-125 hover:drop-shadow-xl
                `}
                style={{
                  filter: hovered ? 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.8))' : ''
                }}
              />
            </div>
            <span className={`
              text-xs sm:text-sm font-bold relative z-10
              transition-all duration-200 hover:tracking-wider
              ${hovered ? 'text-black drop-shadow-sm' : ''}
            `}>{price}</span>
          </button>
        </div>
        
        {/* 像素风格光效 */}
        <div className={`
          absolute inset-0 pointer-events-none transition-opacity duration-300
          bg-gradient-to-r from-transparent via-white/10 to-transparent
          ${hovered ? 'opacity-100' : 'opacity-0'}
        `}></div>
      </div>
      
      {/* 阴影效果 */}
      <div className={`
        absolute inset-0 bg-black border-4 border-transparent
        transform translate-x-1 translate-y-1 -z-10 transition-all duration-300
        ${hovered ? 'translate-x-3 translate-y-3 opacity-80' : 'opacity-60'}
      `}></div>
      
      {/* 额外的深层阴影 */}
      {hovered && (
        <div className="absolute inset-0 bg-gradient-radial from-yellow-400/10 via-transparent to-transparent -z-20 transform scale-110 transition-all duration-500"></div>
      )}
      
      {/* Login Modal */}
      <LoginModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleLoginSuccess}
        locale="ja"
      />
    </div>
  );
};

export default PixelCard;