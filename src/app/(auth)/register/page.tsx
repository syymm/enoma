'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { RegisterForm } from '../../../components/auth/RegisterForm';
import { useTranslation } from '../../../i18n';

function RegisterPageContent() {
  const { t } = useTranslation('ja');
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  useEffect(() => {
    if (isAuthenticated) {
      router.push(returnTo || '/main');
    }
  }, [isAuthenticated, router, returnTo]);

  const handleRegisterSuccess = () => {
    setTimeout(() => {
      router.push(returnTo || '/main');
    }, 1000);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {t('auth.register')}
        </h1>
        <p className="text-white/70">
          {t('auth.loginSubtitle')}
        </p>
      </div>

      <RegisterForm onSuccess={handleRegisterSuccess} />

      <div className="mt-6 text-center text-sm text-white/70">
        すでにアカウントをお持ちですか？{' '}
        <Link
          href={`/login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`}
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          {t('auth.login')}
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}