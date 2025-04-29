'use client'
import { useEffect } from 'react'
import CustomerLayout from '../../dashboard/customer/layout'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function Cart() {
  const router = useRouter()
  const { auth, setAuth } = useAuth()
  
  useEffect(()=>{
    var redirectPath="/components/customerComponents/order"
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
    <CustomerLayout></CustomerLayout>
     
  )
}


