'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { ResetPasswordForm } from '../../../components/auth/ResetPasswordForm';
import { useEffect, useState } from 'react';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      router.push('/login');
      return;
    }
    setToken(tokenParam);
  }, [searchParams, router]);

  const handleSuccess = () => {
    router.push('/login');
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md">
        <ResetPasswordForm 
          token={token}
          locale="ja"
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}