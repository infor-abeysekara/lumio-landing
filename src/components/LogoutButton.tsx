'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors"
    >
      Logout
    </button>
  );
}
