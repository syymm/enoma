'use client';

import { ReactNode } from 'react';
import { useRequireAdmin } from '../../hooks/useRequireAdmin';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isLoading } = useRequireAdmin();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Upload Content', href: '/admin/upload', icon: '📤' },
    { name: 'Manage Content', href: '/admin/content', icon: '📝' },
    { name: 'Back to Site', href: '/', icon: '🏠' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
          </div>
          <nav className="mt-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 ${
                  pathname === item.href ? 'bg-gray-50 border-r-4 border-blue-500' : ''
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}