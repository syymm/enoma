'use client';

import { useState, useEffect } from 'react';
import PixelCard from '../../components/PixelCard';
import { LoginModal } from '../../components/auth/LoginModal';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../i18n';

interface GalleryItem {
  id: number;
  title: string;
  thumbnail: string;
  imageUrl?: string;
  color: string;
  price: string;
  likesCount: number;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

interface ComicItem {
  id: string;
  title: string;
  thumbnail: string;
  imageUrl?: string;
  color: string;
  price: string;
  likesCount: number;
  episode?: number;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

type ItemType = GalleryItem | ComicItem;

// Mock数据作为示例保留
const mockGalleries: GalleryItem[] = [
  { id: -1, title: '【サンプル】山水画集', thumbnail: '/file.svg', color: 'from-emerald-400 to-teal-600', price: '100', likesCount: 42 },
  { id: -2, title: '【サンプル】動物写真', thumbnail: '/globe.svg', color: 'from-orange-400 to-pink-600', price: '200', likesCount: 128 },
  { id: -3, title: '【サンプル】都市風景', thumbnail: '/window.svg', color: 'from-purple-400 to-indigo-600', price: '150', likesCount: 73 },
];

const mockComics: ComicItem[] = [
  { id: 'mock-a', title: '【サンプル】第1話：始まり', thumbnail: '/next.svg', color: 'from-red-400 to-rose-600', price: '50', likesCount: 234 },
  { id: 'mock-b', title: '【サンプル】第2話：冒険', thumbnail: '/vercel.svg', color: 'from-indigo-400 to-purple-600', price: '50', likesCount: 189 },
];

export default function MainPage() {
  const [activeTab, setActiveTab] = useState<string>('gallery');
  const [likedItems, setLikedItems] = useState<Set<string | number>>(new Set());
  const [itemLikeCounts, setItemLikeCounts] = useState<Record<string | number, number>>({});
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [comics, setComics] = useState<ComicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { t } = useTranslation('ja');

  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 并行获取galleries和comics数据
        const [galleriesResponse, comicsResponse] = await Promise.all([
          fetch('/api/gallery?public=true'),
          fetch('/api/comic?public=true')
        ]);

        if (!galleriesResponse.ok || !comicsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const galleriesData = await galleriesResponse.json();
        const comicsData = await comicsResponse.json();

        // 合并API数据和mock数据
        setGalleries([...mockGalleries, ...(galleriesData.galleries || [])]);
        setComics([...mockComics, ...(comicsData.comics || [])]);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('データの取得に失敗しました');
        // 如果API失败，至少显示mock数据
        setGalleries(mockGalleries);
        setComics(mockComics);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tabs = [
    { id: 'gallery', label: 'ギャラリー', data: galleries, icon: '🎨' },
    { id: 'comics', label: '漫画', data: comics, icon: '📚' },
  ];

  const handleLike = async (itemId: string | number): Promise<void> => {
    const wasLiked = likedItems.has(itemId);
    
    // 乐观更新UI
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (wasLiked) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
    
    setItemLikeCounts(prevCounts => ({
      ...prevCounts,
      [itemId]: (prevCounts[itemId] || 0) + (wasLiked ? -1 : 1)
    }));

    // 如果是mock数据（负数ID或以mock-开头），不调用API
    if (typeof itemId === 'number' && itemId < 0) return;
    if (typeof itemId === 'string' && itemId.startsWith('mock-')) return;

    try {
      // 确定是gallery还是comic
      const isGallery = typeof itemId === 'number';
      const endpoint = isGallery 
        ? `/api/gallery/${itemId}/like`
        : `/api/comic/${itemId}/like`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ increment: !wasLiked }),
      });

      if (!response.ok) {
        throw new Error('Failed to update likes');
      }

      const data = await response.json();
      
      // 更新实际的点赞数
      if (isGallery) {
        setGalleries(prev => prev.map(item => 
          item.id === itemId ? { ...item, likesCount: data.likesCount } : item
        ));
      } else {
        setComics(prev => prev.map(item => 
          item.id === itemId ? { ...item, likesCount: data.likesCount } : item
        ));
      }
    } catch (error) {
      console.error('Error updating likes:', error);
      // 回滚UI状态
      setLikedItems(prev => {
        const newSet = new Set(prev);
        if (wasLiked) {
          newSet.add(itemId);
        } else {
          newSet.delete(itemId);
        }
        return newSet;
      });
      
      setItemLikeCounts(prevCounts => ({
        ...prevCounts,
        [itemId]: (prevCounts[itemId] || 0) + (wasLiked ? 1 : -1)
      }));
    }
  };

  const handleBuy = (item: ItemType): void => {
    alert(`購入: ${item.title} - ¥${item.price}`);
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
  };

  // 点击外部关闭用户菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen) {
        const target = event.target as Element;
        if (!target.closest('.user-menu-container')) {
          setIsUserMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

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
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium">{user?.name || user?.email}</span>
                    </div>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* 下拉菜单 */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
                      <div className="py-2">
                        {/* 用户信息 */}
                        <div className="px-4 py-3 border-b border-white/10">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                              <span className="text-lg font-bold text-white">
                                {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">{user?.name || 'ユーザー'}</p>
                              <p className="text-white/60 text-xs">{user?.email}</p>
                            </div>
                          </div>
                        </div>

                        {/* 菜单选项 */}
                        <div className="py-1">
                          {isAdmin && (
                            <>
                              <a
                                href="/admin"
                                className="flex items-center space-x-3 px-4 py-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 transition-colors text-sm"
                                onClick={() => setIsUserMenuOpen(false)}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>管理面板</span>
                              </a>
                              <div className="border-t border-white/10 my-1"></div>
                            </>
                          )}
                          
                          <a
                            href="/settings"
                            className="flex items-center space-x-3 px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 transition-colors text-sm"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>アカウント設定</span>
                          </a>
                          
                          <a
                            href="/change-password"
                            className="flex items-center space-x-3 px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 transition-colors text-sm"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2m0 0V7a2 2 0 112-2m-6 2a2 2 0 002-2v0a2 2 0 012-2m2 2v2a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2h2z" />
                            </svg>
                            <span>パスワード変更</span>
                          </a>

                          <div className="border-t border-white/10 my-1"></div>
                          
                          <button
                            onClick={() => {
                              logout();
                              setIsUserMenuOpen(false);
                            }}
                            className="flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-sm w-full text-left"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>ログアウト</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                  >
                    {t('auth.login')}
                  </button>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25 text-sm sm:text-base"
                  >
                    {t('auth.register')}
                  </button>
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

          {/* 错误状态 */}
          {error && (
            <div className="max-w-7xl mx-auto mb-8">
              <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                  <span className="text-red-400 text-xl">⚠️</span>
                </div>
                <p className="text-red-300 mb-2">{error}</p>
                <p className="text-red-300/60 text-sm">サンプルデータを表示しています</p>
              </div>
            </div>
          )}

          {/* 加载状态 */}
          {loading && (
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-16 sm:py-20">
                <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-2xl sm:text-3xl">🎨</span>
                </div>
                <p className="text-white/60 text-lg sm:text-xl mb-2">データを読み込み中...</p>
                <div className="w-32 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          {/* 内容区域 */}
          {!loading && (
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
          )}

          {/* 底部装饰 */}
          <div className="mt-12 sm:mt-20 text-center pb-8">
            <div className="inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm bg-white/5 rounded-full border border-white/10">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-white/60 text-xs sm:text-sm">すべてのコンテンツが読み込まれました</span>
            </div>
          </div>
        </main>
      </div>

      {/* Login Modal */}
      <LoginModal
        open={isLoginModalOpen}
        onClose={handleLoginModalClose}
        onSuccess={handleLoginSuccess}
        locale="ja"
      />
    </div>
  );
}