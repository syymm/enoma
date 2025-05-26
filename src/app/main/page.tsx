'use client';

import Link from 'next/link';
import { useState } from 'react';

const galleries = [
  { id: 1, title: '山水画集', thumbnail: '/file.svg', color: 'from-emerald-400 to-teal-600' },
  { id: 2, title: '動物写真', thumbnail: '/globe.svg', color: 'from-orange-400 to-pink-600' },
  { id: 3, title: '都市風景', thumbnail: '/window.svg', color: 'from-purple-400 to-indigo-600' },
  { id: 4, title: '抽象芸術', thumbnail: '/file.svg', color: 'from-yellow-400 to-orange-600' },
  { id: 5, title: '風景写真', thumbnail: '/globe.svg', color: 'from-blue-400 to-cyan-600' },
  { id: 6, title: '人物画', thumbnail: '/window.svg', color: 'from-rose-400 to-pink-600' },
];

const comics = [
  { id: 'a', title: '第1話：始まり', thumbnail: '/next.svg', color: 'from-red-400 to-rose-600' },
  { id: 'b', title: '第2話：冒険', thumbnail: '/vercel.svg', color: 'from-indigo-400 to-purple-600' },
  { id: 'c', title: '第3話：謎', thumbnail: '/next.svg', color: 'from-green-400 to-emerald-600' },
  { id: 'd', title: '第4話：決戦', thumbnail: '/vercel.svg', color: 'from-amber-400 to-orange-600' },
];

export default function MainPage() {
  const [activeTab, setActiveTab] = useState('gallery');
  const [hoveredCard, setHoveredCard] = useState<string | number | null>(null);

  const tabs = [
    { id: 'gallery', label: 'ギャラリー', data: galleries, icon: '🎨' },
    { id: 'comics', label: '漫画', data: comics, icon: '📚' },
  ];

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
            <nav className="flex space-x-3 sm:space-x-4">
              <Link
                href="/login"
                className="px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              >
                ログイン
              </Link>
              <Link
                href="/register"
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25 text-sm sm:text-base"
              >
                新規登録
              </Link>
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
                      className="group relative"
                      onMouseEnter={() => setHoveredCard(item.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      {/* 卡片主体 */}
                      <div className={`
                        relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20
                        transform transition-all duration-500 cursor-pointer
                        ${hoveredCard === item.id 
                          ? 'scale-105 rotate-1 shadow-2xl shadow-purple-500/20' 
                          : 'hover:scale-102 hover:shadow-xl hover:shadow-black/20'
                        }
                      `}>
                      {/* 渐变背景 */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
                      
                        {/* 图片区域 */}
                        <div className="relative h-40 sm:h-48 overflow-hidden">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {/* 悬浮时的装饰元素 */}
                          {hoveredCard === item.id && (
                            <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce">
                              <span className="text-white text-xl">✨</span>
                            </div>
                          )}
                        </div>
                        
                        {/* 标题区域 */}
                        <div className="relative p-4 sm:p-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-white font-bold text-sm sm:text-lg leading-tight flex-1 mr-2">
                              {item.title}
                            </h3>
                            <div className={`
                              w-3 h-3 rounded-full bg-gradient-to-r ${item.color}
                              transform transition-all duration-500
                              ${hoveredCard === item.id ? 'scale-150 animate-pulse' : ''}
                            `}></div>
                          </div>
                          
                          {/* 进度条装饰 */}
                          <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className={`
                              h-full bg-gradient-to-r ${item.color} rounded-full
                              transform transition-all duration-1000 ease-out
                              ${hoveredCard === item.id ? 'w-full' : 'w-1/3'}
                            `}></div>
                          </div>
                        </div>
                        
                        {/* 光效 */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                      </div>

                      {/* 悬浮阴影 */}
                      <div className={`
                        absolute inset-0 bg-gradient-to-br ${item.color} rounded-3xl blur-xl opacity-0 -z-10
                        transition-opacity duration-500 transform scale-95
                        ${hoveredCard === item.id ? 'opacity-20' : ''}
                      `}></div>
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