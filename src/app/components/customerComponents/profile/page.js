'use client'
import { useEffect, useState } from 'react'
import CustomerLayout from '../../dashboard/customer/layout'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import 'primeicons/primeicons.css';
import axios from 'axios'

export default function Profile() {
  const router = useRouter()
  const { auth } = useAuth()
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (auth.isLoading) return // wait for auth to finish loading

    if (!auth.isAuthenticated) {
      router.replace("/components/authentication/login")
      return
    }

    if (auth.role === "admin") {
      router.replace("/components/dashboard/admin")
      return
    }

    // Only fetch user if authenticated as customer
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/getUser")
        if (response.data.success) {
          setUser(response.data.user)
        } else {
          console.error("Failed to load user data")
        }
      } catch (error) {
        console.error("Unable to fetch user data", error)
      }
    }

    fetchUser()
  }, [auth, router])

  if (auth.isLoading) {
    return <div className="flex justify-center items-center h-screen bg-gray-700">
      <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
    </div>
  }

  if (!auth.isAuthenticated || auth.role === "admin") {
    return null // Redirect is handled by useEffect
  }

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-white px-6 py-12 flex justify-center items-center">
        <div className=" bg-gray-600 w-full max-w-5xl backdrop-blur-md rounded-3xl p-10 shadow-2xl ring-1 ring-white/30 text-white">
          {!user ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-white border-dashed rounded-full animate-spin"></div>
              <p className="mt-4 text-lg">Loading profile...</p>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Header */}
              <div className="b flex flex-col md:flex-row items-center md:items-start md:justify-between gap-6">
                <div className="flex items-center gap-5">
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.name}&background=475569&color=fff&bold=true`}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                  <div>
                    <h1 className="text-3xl md:text-2xl font-bold break-words whitespace-normal">Welcome, {user.name}!</h1>
                    <p className="text-white/80">Explore and manage your profile information</p>
                  </div>
                </div>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Info Card */}
                <div className="bg-gray-500 p-6 rounded-xl shadow-xl">
                  <h3 className="text-2xl font-semibold mb-4">👤 Personal Info</h3>
                 
                  <p><span className="font-medium break-words text-white">Email:</span> {user.email}</p>
                  <p><span className="font-medium text-whitw">Phone:</span> {user.number}</p>
                  <p><span className="font-medium text-white">Role:</span> {user.type}</p>
                  <p><span className="font-medium text-white">Total Orders:</span> {user.orders?.length || 0}</p>
                </div>

                {/* Address Info Card */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
                  <h3 className="text-2xl font-semibold mb-4">📍 Address</h3>
                  {user.addresses?.length > 0 ? (
                    user.addresses.map((addr, index) => (
                      <div key={index} className="mb-4 text-sm text-white/90">
                        <p>{addr.street}, {addr.city}, {addr.state}</p>
                        <p>{addr.postalCode}, {addr.country}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/70">No address found.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  )
}
