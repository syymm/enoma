'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation, Locale } from '../../i18n';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  locale?: Locale;
  onSuccess?: () => void;
  showOAuth?: boolean;
  className?: string;
}

export function LoginForm({ 
  locale = 'ja', 
  onSuccess, 
  showOAuth = true,
  className = ''
}: LoginFormProps) {
  const { t } = useTranslation(locale);
  const { login, loginWithOAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const success = await login(data.email, data.password);
      if (success) {
        onSuccess?.();
      } else {
        setError(t('auth.loginFailed'));
      }
    } catch {
      setError(t('auth.genericError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'x') => {
    try {
      await loginWithOAuth(provider);
    } catch {
      setError(t('auth.genericError'));
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register('email')}
            type="email"
            placeholder={t('auth.emailPlaceholder')}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">
              {errors.email.type === 'invalid_string' ? t('auth.emailInvalid') : t('auth.emailRequired')}
            </p>
          )}
        </div>

        <div>
          <input
            {...register('password')}
            type="password"
            placeholder={t('auth.passwordPlaceholder')}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-400">{t('auth.passwordRequired')}</p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? '...' : t('auth.loginButton')}
        </button>
      </form>

      {showOAuth && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900 text-white/70">{t('auth.or')}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              className="w-full py-3 px-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all"
            >
              {t('auth.googleLogin')}
            </button>
            
            <button
              type="button"
              onClick={() => handleOAuthLogin('x')}
              className="w-full py-3 px-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all"
            >
              {t('auth.xLogin')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}