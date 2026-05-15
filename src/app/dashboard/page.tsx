'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  // Vérifier l’authentification côté client
  useEffect(() => {
    setIsClient(true);
    if (!token && typeof window !== 'undefined') {
      router.push('/login');
    }
  }, [token, router]);

  if (!isClient || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#326AD1]">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
          >
            Se déconnecter
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Bienvenue, {user.name || user.email} 👋
          </h2>
          <p className="text-gray-600">
            Vous êtes connecté avec succès. Cette page est protégée et accessible uniquement aux utilisateurs authentifiés.
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500">
              <strong>Email :</strong> {user.email}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              <strong>ID utilisateur :</strong> {user.id}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}