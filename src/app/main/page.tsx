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
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">絵</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                絵の間
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