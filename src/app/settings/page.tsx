'use client';

import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useRequireAuth } from '../../hooks/useRequireAuth';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  
  // 认证检查
  useRequireAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 顶部导航 */}
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20">
          <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
            <Link href="/main" className="flex items-center space-x-3">
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
              </div>
              <span className="text-xl font-bold text-white">絵の間</span>
            </Link>
            
            <Link 
              href="/main"
              className="px-4 py-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 text-sm"
            >
              メインに戻る
            </Link>
          </div>
        </header>

        {/* 主要内容 */}
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">アカウント設定</h1>
              <p className="text-white/70">アカウント情報の確認と設定の変更</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ユーザー情報カード */}
              <div className="lg:col-span-1">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">
                      {user?.name || 'ユーザー'}
                    </h2>
                    <p className="text-white/60 text-sm mb-4">{user?.email}</p>
                    <div className="text-xs text-white/50">
                      アカウント作成日: 不明
                    </div>
                  </div>
                </div>
              </div>

              {/* 設定オプション */}
              <div className="lg:col-span-2">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">設定メニュー</h3>
                  
                  <div className="space-y-4">
                    {/* パスワード変更 */}
                    <Link
                      href="/change-password"
                      className="flex items-center justify-between p-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 712 2v6a2 2 0 71-2 2H9a2 2 0 71-2-2V9a2 2 0 712-2m0 0V7a2 2 0 712-2m-6 2a2 2 0 002-2v0a2 2 0 712-2m2 2v2a2 2 0 71-2 2H9a2 2 0 71-2-2V9a2 2 0 712-2h2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-white font-medium">パスワード変更</h4>
                          <p className="text-white/60 text-sm">アカウントのセキュリティを保護</p>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>

                    {/* プロフィール編集 */}
                    <div className="flex items-center justify-between p-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg opacity-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-white/60 font-medium">プロフィール編集</h4>
                          <p className="text-white/40 text-sm">名前や個人情報の変更（近日公開）</p>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>

                    {/* 通知設定 */}
                    <div className="flex items-center justify-between p-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg opacity-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM7 17l5 5v-5H7zM7 7l5-5v5H7zM17 7h-5V2l5 5z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-white/60 font-medium">通知設定</h4>
                          <p className="text-white/40 text-sm">メール通知の管理（近日公開）</p>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>

                    {/* プライバシー設定 */}
                    <div className="flex items-center justify-between p-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg opacity-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-white/60 font-medium">プライバシー設定</h4>
                          <p className="text-white/40 text-sm">データとプライバシーの管理（近日公開）</p>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 危険ゾーン */}
                <div className="mt-8 backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-red-400 mb-4">危険ゾーン</h3>
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        if (confirm('本当にログアウトしますか？')) {
                          logout();
                        }
                      }}
                      className="flex items-center space-x-3 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>ログアウト</span>
                    </button>
                    
                    <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-lg opacity-50">
                      <h4 className="text-red-400/60 font-medium mb-2">アカウント削除</h4>
                      <p className="text-red-300/40 text-sm mb-3">
                        アカウントを完全に削除します。この操作は取り消せません。
                      </p>
                      <button
                        disabled
                        className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400/40 text-sm cursor-not-allowed"
                      >
                        アカウント削除（近日公開）
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}