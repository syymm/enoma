'use client';

import { useState } from 'react';

const PixelCard = ({ 
  title, 
  thumbnail, 
  price, 
  onLike, 
  onBuy,
  isLiked = false 
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="group relative pixel-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 主卡片容器 - 像素风格 */}
      <div className={`
        relative bg-gray-800 border-4 border-gray-600 
        transition-all duration-200 cursor-pointer
        ${hovered ? 'border-yellow-400 shadow-lg shadow-yellow-400/50' : 'shadow-md shadow-black/50'}
        ${hovered ? 'transform -translate-y-1' : ''}
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
              onLike && onLike();
            }}
            className={`
              flex-1 flex items-center justify-center space-x-1 sm:space-x-2
              border-r-2 border-gray-600 transition-all duration-200 font-mono
              ${isLiked 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
              }
              ${hovered ? 'border-r-yellow-400' : ''}
            `}
          >
            {/* 像素风心形图标 */}
            <div className={`
              w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs sm:text-sm
              ${isLiked ? 'text-pink-200' : 'text-gray-400'}
            `}>
              {isLiked ? '♥' : '♡'}
            </div>
            <span className="text-xs sm:text-sm font-bold">LIKE</span>
          </button>
          
          {/* 价格按钮 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBuy && onBuy();
            }}
            className={`
              flex-1 flex items-center justify-center space-x-1 sm:space-x-2
              bg-gray-700 hover:bg-yellow-600 text-gray-300 hover:text-black
              transition-all duration-200 font-mono
              ${hovered ? 'bg-yellow-500 text-black' : ''}
            `}
          >
            {/* 像素风金币图标 */}
            <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs sm:text-sm text-yellow-400">
              ¥
            </div>
            <span className="text-xs sm:text-sm font-bold">{price}</span>
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
        transform translate-x-1 translate-y-1 -z-10 transition-all duration-200
        ${hovered ? 'translate-x-2 translate-y-2' : ''}
      `}></div>
    </div>
  );
};

export default PixelCard;