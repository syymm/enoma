'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const requireAuth = (action: () => void) => {
    if (isAuthenticated) {
      action();
    } else {
      setPendingAction(() => action);
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setPendingAction(null);
  };

  const handleLoginSuccess = () => {
    if (pendingAction) {
      pendingAction();
    }
    handleModalClose();
  };

  return {
    requireAuth,
    isModalOpen,
    handleModalClose,
    handleLoginSuccess,
  };
}