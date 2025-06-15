'use client';

import Link from 'next/link';
import { useState } from 'react';
import PixelCard from '../../components/PixelCard';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../i18n';

interface GalleryItem {
  id: number;
  title: string;
  thumbnail: string;
  color: string;
  price: string;
  likesCount: number;
}

interface ComicItem {
  id: string;
  title: string;
  thumbnail: string;
  color: string;
  price: string;
  likesCount: number;
}

type ItemType = GalleryItem | ComicItem;

const galleries: GalleryItem[] = [
  { id: 1, title: '山水画集', thumbnail: '/file.svg', color: 'from-emerald-400 to-teal-600', price: '100', likesCount: 42 },
  { id: 2, title: '動物写真', thumbnail: '/globe.svg', color: 'from-orange-400 to-pink-600', price: '200', likesCount: 128 },
  { id: 3, title: '都市風景', thumbnail: '/window.svg', color: 'from-purple-400 to-indigo-600', price: '150', likesCount: 73 },
  { id: 4, title: '抽象芸術', thumbnail: '/file.svg', color: 'from-yellow-400 to-orange-600', price: '300', likesCount: 95 },
  { id: 5, title: '風景写真', thumbnail: '/globe.svg', color: 'from-blue-400 to-cyan-600', price: '180', likesCount: 167 },
  { id: 6, title: '人物画', thumbnail: '/window.svg', color: 'from-rose-400 to-pink-600', price: '250', likesCount: 89 },
];

const comics: ComicItem[] = [
  { id: 'a', title: '第1話：始まり', thumbnail: '/next.svg', color: 'from-red-400 to-rose-600', price: '50', likesCount: 234 },
  { id: 'b', title: '第2話：冒険', thumbnail: '/vercel.svg', color: 'from-indigo-400 to-purple-600', price: '50', likesCount: 189 },
  { id: 'c', title: '第3話：謎', thumbnail: '/next.svg', color: 'from-green-400 to-emerald-600', price: '50', likesCount: 156 },
  { id: 'd', title: '第4話：決戦', thumbnail: '/vercel.svg', color: 'from-amber-400 to-orange-600', price: '60', likesCount: 301 },
];

export default function MainPage() {
  const [activeTab, setActiveTab] = useState<string>('gallery');
  const [likedItems, setLikedItems] = useState<Set<string | number>>(new Set());
  const [itemLikeCounts, setItemLikeCounts] = useState<Record<string | number, number>>({});
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation('ja');

  const tabs = [
    { id: 'gallery', label: 'ギャラリー', data: galleries, icon: '🎨' },
    { id: 'comics', label: '漫画', data: comics, icon: '📚' },
  ];

  const handleLike = (itemId: string | number): void => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      const wasLiked = newSet.has(itemId);
      
      if (wasLiked) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      
      return newSet;
    });
    
    // 更新点赞数
    setItemLikeCounts(prevCounts => {
      const wasLiked = likedItems.has(itemId);
      return {
        ...prevCounts,
        [itemId]: (prevCounts[itemId] || 0) + (wasLiked ? -1 : 1)
      };
    });
  };

  const handleBuy = (item: ItemType): void => {
    alert(`購入: ${item.title} - ¥${item.price}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-purple-900/50 to-slate-900/50"></div>
      </div>

      {/* 主要内容容器 */}
      <div className="relative z-10 h-screen overflow-y-auto">
        {/* 玻璃态导航栏 */}
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-20">
          <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 rounded-xl flex items-center justify-center animate-pulse border border-cyan-400/50">
                <span 
                  className="text-white font-black text-lg relative z-10"
                  style={{
                    textShadow: '0 0 10px #00ffff, 0 0 20px #ff00ff',
                    filter: 'drop-shadow(0 0 2px #00ffff)'
                  }}
                >
                  絵
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-pink-400/20 rounded-xl blur-sm"></div>
              </div>
              <div className="relative group">
                {/* 带抖动效果的标题 */}
                <div className="text-2xl sm:text-3xl font-bold tracking-wide relative">
                  <span 
                    className="relative z-10 text-white tv-flicker"
                    style={{
                      textShadow: `
                        0 0 10px rgba(0, 255, 255, 0.5),
                        0 0 20px rgba(255, 0, 255, 0.3)
                      `,
                      animation: 'tv-flicker 3s infinite ease-in-out'
                    }}
                  >
                    絵の間
                  </span>
                  
                  {/* 轻微的发光底层 */}
                  <span 
                    className="absolute top-0 left-0 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent opacity-60 -z-10"
                    style={{
                      transform: 'translate(1px, 1px)',
                      filter: 'blur(1px)'
                    }}
                  >
                    絵の間
                  </span>
                  
                  {/* 右侧装饰元素 */}
                  <div className="absolute -right-4 top-1/2 w-0.5 h-6 bg-gradient-to-b from-cyan-400 to-pink-400 opacity-70 -translate-y-1/2"></div>
                  <div className="absolute -right-6 top-1/2 w-1 h-1 bg-cyan-400 rounded-full opacity-80 -translate-y-1/2 animate-pulse"></div>
                </div>
                
                {/* 扫描线和信号干扰效果 */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* 扫描线 */}
                  <div 
                    className="absolute inset-0 opacity-40"
                    style={{
                      background: `
                        repeating-linear-gradient(
                          0deg,
                          transparent,
                          transparent 1px,
                          rgba(0, 255, 255, 0.1) 1px,
                          rgba(0, 255, 255, 0.1) 2px
                        )
                      `,
                      animation: 'scan-lines 0.1s linear infinite'
                    }}
                  />
                  
                  {/* 信号干扰条纹 */}
                  <div 
                    className="absolute inset-0 opacity-60"
                    style={{
                      background: `
                        linear-gradient(
                          90deg,
                          transparent 0%,
                          rgba(255, 255, 255, 0.1) 10%,
                          transparent 20%,
                          transparent 80%,
                          rgba(0, 255, 255, 0.1) 90%,
                          transparent 100%
                        )
                      `,
                      animation: 'tv-interference 4s ease-in-out infinite'
                    }}
                  />
                  
                  {/* 随机条状干扰 */}
                  <div 
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: `
                        repeating-linear-gradient(
                          0deg,
                          transparent,
                          transparent 8px,
                          rgba(255, 255, 255, 0.05) 8px,
                          rgba(255, 255, 255, 0.05) 12px
                        )
                      `,
                      animation: 'signal-noise 2s steps(20) infinite'
                    }}
                  />
                </div>
                
                {/* CSS 动画定义 */}
                <style jsx>{`
                  @keyframes tv-flicker {
                    0%, 100% { 
                      transform: translate(0, 0);
                      opacity: 1;
                    }
                    2% { 
                      transform: translate(0.2px, -0.1px);
                      opacity: 0.98;
                    }
                    4% { 
                      transform: translate(-0.1px, 0.1px);
                      opacity: 1;
                    }
                    10% { 
                      transform: translate(0.1px, 0);
                      opacity: 0.99;
                    }
                    15% { 
                      transform: translate(-0.1px, -0.05px);
                      opacity: 1;
                    }
                    50% { 
                      transform: translate(0, 0);
                      opacity: 1;
                    }
                    52% { 
                      transform: translate(0.05px, 0.1px);
                      opacity: 0.97;
                    }
                    55% { 
                      transform: translate(-0.05px, 0);
                      opacity: 1;
                    }
                  }
                  
                  @keyframes scan-lines {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(2px); }
                  }
                  
                  @keyframes tv-interference {
                    0%, 100% { 
                      transform: translateX(0) scaleX(1);
                      opacity: 0.6;
                    }
                    25% { 
                      transform: translateX(2px) scaleX(0.98);
                      opacity: 0.3;
                    }
                    50% { 
                      transform: translateX(-1px) scaleX(1.02);
                      opacity: 0.8;
                    }
                    75% { 
                      transform: translateX(1px) scaleX(0.99);
                      opacity: 0.4;
                    }
                  }
                  
                  @keyframes signal-noise {
                    0%, 100% { 
                      transform: translateY(0);
                      opacity: 0.3;
                    }
                    10% { 
                      transform: translateY(-1px);
                      opacity: 0.1;
                    }
                    20% { 
                      transform: translateY(1px);
                      opacity: 0.5;
                    }
                    30% { 
                      transform: translateY(0);
                      opacity: 0.2;
                    }
                    40% { 
                      transform: translateY(-0.5px);
                      opacity: 0.4;
                    }
                    50% { 
                      transform: translateY(0.5px);
                      opacity: 0.1;
                    }
                  }
                `}</style>
                
                {/* 下方小字效果 */}
                <div className="text-xs sm:text-sm text-cyan-300/60 font-mono tracking-[0.2em] mt-1 text-center">
                  <span className="opacity-80">{'>'} GALLERY_SYSTEM.EXE {'<'}</span>
                </div>
              </div>
              
            </div>
            <nav className="flex items-center space-x-3 sm:space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 text-white/90">
                    <span className="text-sm sm:text-base">こんにちは、</span>
                    <span className="font-semibold">{user?.name || user?.email}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                  >
                    ログアウト
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                  >
                    {t('auth.login')}
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25 text-sm sm:text-base"
                  >
                    {t('auth.register')}
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-8">
          {/* 现代化标签导航 */}
          <div className="mb-12">
            <div className="flex justify-center">
              <div className="flex p-2 backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-500
                      ${activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <span className="text-lg sm:text-xl">{tab.icon}</span>
                    <span className="text-sm sm:text-lg whitespace-nowrap">{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl blur-xl opacity-30 -z-10"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="max-w-7xl mx-auto">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`
                  transition-all duration-700 ease-out transform
                  ${activeTab === tab.id
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95 absolute pointer-events-none'
                  }
                `}
              >
                {/* 响应式网格布局 */}
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {tab.data.map((item, index) => (
                    <div
                      key={item.id}
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      <PixelCard
                        title={item.title}
                        thumbnail={item.thumbnail}
                        price={item.price}
                        likesCount={item.likesCount + (itemLikeCounts[item.id] || 0)}
                        isLiked={likedItems.has(item.id)}
                        onLike={() => handleLike(item.id)}
                        onBuy={() => handleBuy(item)}
                      />
                    </div>
                  ))}
                </div>

                {/* 空状态 */}
                {tab.data.length === 0 && (
                  <div className="text-center py-16 sm:py-20">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <span className="text-2xl sm:text-3xl">📁</span>
                    </div>
                    <p className="text-white/60 text-lg sm:text-xl mb-2">まだコンテンツがありません</p>
                    <p className="text-white/40 text-sm sm:text-base">新しい{tab.label}を追加してみましょう</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 底部装饰 */}
          <div className="mt-12 sm:mt-20 text-center pb-8">
            <div className="inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm bg-white/5 rounded-full border border-white/10">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-white/60 text-xs sm:text-sm">すべてのコンテンツが読み込まれました</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}