'use client'
import { useEffect } from 'react'
import CustomerLayout from '../../dashboard/customer/layout'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function Cart() {
  const router = useRouter()
  const { auth, setAuth } = useAuth()



  return (
    <CustomerLayout></CustomerLayout>
     
  )
}


