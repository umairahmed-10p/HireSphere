'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!authApi.isAuthenticated()) {
      // Redirect to login if not authenticated
      router.push('/login');
      return;
    }

    // Get current user details
    const currentUser = authApi.getCurrentUser();
    setUser(currentUser);
  }, [router]);

  // If no user is found, show loading or nothing
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Welcome, {user.firstName} {user.lastName}
        </h2>
        <div className="space-y-2">
          <p>Email: {user.email}</p>
          {user.role && <p>Role: {user.role}</p>}
        </div>
      </div>
    </div>
  );
}
