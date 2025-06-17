'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useRequireAuth } from '../../hooks/useRequireAuth';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, '現在のパスワードを入力してください'),
  newPassword: z.string().min(6, 'パスワードは6文字以上である必要があります'),
  confirmPassword: z.string().min(1, 'パスワードの確認を入力してください'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const { } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // 认证检查
  useRequireAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'パスワードの変更に失敗しました');
      }

      setSuccess(true);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'パスワードの変更に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

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
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 712 2m0 0a2 2 0 712 2v6a2 2 0 71-2 2H9a2 2 0 71-2-2V9a2 2 0 712-2m0 0V7a2 2 0 712-2m-6 2a2 2 0 002-2v0a2 2 0 712-2m2 2v2a2 2 0 71-2 2H9a2 2 0 71-2-2V9a2 2 0 712-2h2z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">パスワード変更</h1>
                <p className="text-white/70 text-sm">アカウントのセキュリティを保護するため、定期的にパスワードを変更することをお勧めします。</p>
              </div>

              {/* 成功メッセージ */}
              {success && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-400 text-sm">パスワードが正常に変更されました。</p>
                  </div>
                </div>
              )}

              {/* エラーメッセージ */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* 現在のパスワード */}
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    現在のパスワード
                  </label>
                  <input
                    {...register('currentPassword')}
                    type="password"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="現在のパスワードを入力"
                  />
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-400">{errors.currentPassword.message}</p>
                  )}
                </div>

                {/* 新しいパスワード */}
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    新しいパスワード
                  </label>
                  <input
                    {...register('newPassword')}
                    type="password"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="新しいパスワードを入力"
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-400">{errors.newPassword.message}</p>
                  )}
                </div>

                {/* パスワード確認 */}
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    新しいパスワード（確認）
                  </label>
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="新しいパスワードを再入力"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* ボタン */}
                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? '変更中...' : 'パスワードを変更'}
                  </button>

                  <Link
                    href="/main"
                    className="block w-full py-3 px-4 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 text-center font-medium"
                  >
                    キャンセル
                  </Link>
                </div>
              </form>

              {/* パスワードのヒント */}
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h3 className="text-blue-400 text-sm font-medium mb-2">安全なパスワードのヒント:</h3>
                <ul className="text-blue-300/80 text-xs space-y-1">
                  <li>• 6文字以上で設定してください</li>
                  <li>• 英数字と記号を組み合わせて使用してください</li>
                  <li>• 他のサイトで使用しているパスワードは避けてください</li>
                  <li>• 定期的にパスワードを変更してください</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}