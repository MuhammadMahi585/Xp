'use client'
import { useEffect } from 'react'
import CustomerLayout from '../../dashboard/customer/layout'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function Profile() {
  const router = useRouter()
  const { auth } = useAuth()

  useEffect(()=>{
    var redirectPath="/components/customerComponents/profile"
    if(!auth.isAuthenticated){
      redirectPath="/components/authenctication/login"
    }
    if(auth.isAuthenticated){
      if(auth.role==="admin"){
        redirectPath="/components/dashboard/admin"
      }
    }
    router.replace(redirectPath)
  },[auth,router])

  return (
    <CustomerLayout>
      <div className="profile-container">
        {/* Your Profile content here */}
        <h2>Welcome to your profile, {auth.username}</h2>
      </div>
    </CustomerLayout>
  );
}
