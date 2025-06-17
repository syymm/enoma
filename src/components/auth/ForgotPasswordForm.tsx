'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation, Locale } from '../../i18n';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  locale?: Locale;
  onBack?: () => void;
  className?: string;
}

export function ForgotPasswordForm({ 
  locale = 'ja', 
  onBack,
  className = ''
}: ForgotPasswordFormProps) {
  const { t } = useTranslation(locale);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || t('auth.genericError'));
      }
    } catch {
      setError(t('auth.genericError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{t('auth.emailSent')}</h2>
          <p className="text-white/70 mb-6">{t('auth.checkEmailInstructions')}</p>
          <button
            onClick={onBack}
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            {t('auth.backToLogin')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">{t('auth.forgotPasswordTitle')}</h2>
        <p className="text-white/70">{t('auth.forgotPasswordDescription')}</p>
      </div>

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
          {isLoading ? '...' : t('auth.sendResetEmail')}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={onBack}
          className="text-white/70 hover:text-white font-medium transition-colors"
        >
          {t('auth.backToLogin')}
        </button>
      </div>
    </div>
  );
}