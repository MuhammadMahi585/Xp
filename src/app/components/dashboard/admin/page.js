'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuth } from '@/app/context/AuthContext'

export default function Admin() {
  const router = useRouter()
  const { auth, setAuth } = useAuth()

  const logout = async () => {
    try {
      const response = await axios.post("/api/authentication/logout")
      if (response.data.success) {
        setAuth({
          isAuthenticated: false,
          role: null,
          isLoading: false, // change to false after logout
          error: null
        })
        router.replace("/components/authentication/login")
      }
    } catch (error) {
      console.error("Error occurred during logout", error)
    }
  }

  useEffect(() => {
    if (!auth.isAuthenticated && !auth.isLoading) {
      router.replace("/components/authentication/login")
    }
  }, [auth, router]) // Listen to auth changes

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Admin Dashboard</h1>
      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  )
}
