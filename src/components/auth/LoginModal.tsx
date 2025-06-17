'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useTranslation, Locale } from '../../i18n';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  locale?: Locale;
}

type ModalMode = 'login' | 'register';

export function LoginModal({ 
  open, 
  onClose, 
  onSuccess, 
  locale = 'ja' 
}: LoginModalProps) {
  const { t } = useTranslation(locale);
  const [mode, setMode] = useState<ModalMode>('login');

  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  const handleModeSwitch = (newMode: ModalMode) => {
    setMode(newMode);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-xl font-semibold text-white">
                {mode === 'login' ? t('auth.modalTitle') : t('auth.register')}
              </Dialog.Title>
              <Dialog.Close className="text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg p-1 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Dialog.Close>
            </div>

            {mode === 'login' && (
              <>
                <Dialog.Description className="text-white/70 text-sm mb-6">
                  {t('auth.modalDescription')}
                </Dialog.Description>
                <LoginForm 
                  locale={locale} 
                  onSuccess={handleSuccess}
                  showOAuth={true}
                />
                <div className="mt-6 text-center text-sm text-white/70">
                  {t('auth.firstTime')}{' '}
                  <button
                    onClick={() => handleModeSwitch('register')}
                    className="text-purple-400 hover:text-purple-300 transition-colors underline"
                  >
                    {t('auth.createAccount')}
                  </button>
                </div>
              </>
            )}

            {mode === 'register' && (
              <>
                <Dialog.Description className="text-white/70 text-sm mb-6">
                  アカウントを作成して、いいねや購入を行いましょう。
                </Dialog.Description>
                <RegisterForm 
                  locale={locale} 
                  onSuccess={handleSuccess}
                  showOAuth={true}
                />
                <div className="mt-6 text-center text-sm text-white/70">
                  すでにアカウントをお持ちですか？{' '}
                  <button
                    onClick={() => handleModeSwitch('login')}
                    className="text-purple-400 hover:text-purple-300 transition-colors underline"
                  >
                    {t('auth.login')}
                  </button>
                </div>
              </>
            )}

          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}