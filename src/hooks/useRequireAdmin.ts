'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useRequireAdmin() {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/');
        return;
      }
      
      if (!isAdmin) {
        router.push('/');
        return;
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  return {
    user,
    isAuthenticated,
    isAdmin,
    isLoading: isLoading || (!isAuthenticated || !isAdmin),
  };
}