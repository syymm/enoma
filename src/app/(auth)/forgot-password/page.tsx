'use client';

import { useRouter } from 'next/navigation';
import { ForgotPasswordForm } from '../../../components/auth/ForgotPasswordForm';
import { use } from 'react';

interface ForgotPasswordPageProps {
  params: Promise<{ locale?: string }>;
}

export default function ForgotPasswordPage({ params }: ForgotPasswordPageProps) {
  const resolvedParams = use(params);
  const locale = (resolvedParams.locale as 'ja' | 'zh') || 'ja';
  const router = useRouter();

  const handleBack = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md">
        <ForgotPasswordForm 
          locale={locale}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}