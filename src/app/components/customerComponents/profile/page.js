'use client'
import { useEffect } from 'react'
import CustomerLayout from '../../dashboard/customer/layout'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function Profile() {
  const router = useRouter()
  const { auth } = useAuth()

  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.replace("/components/authentication/login");
    }
  }, [auth, router]);

  return (
    <CustomerLayout>
      <div className="profile-container">
        {/* Your Profile content here */}
        <h2>Welcome to your profile, {auth.username}</h2>
      </div>
    </CustomerLayout>
  );
}
