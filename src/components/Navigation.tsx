'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Enoma
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700">Welcome, {user?.name || user?.email}</span>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-x-2">
                <button className="text-gray-700 hover:text-gray-900">
                  Login
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}