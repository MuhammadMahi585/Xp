'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuth } from '@/app/context/AuthContext'
import { FiLogOut } from 'react-icons/fi'

export default function Navigation() {
  const router = useRouter()
  const { auth, setAuth } = useAuth()


  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.replace('/components/authentication/login');
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

   const logout = async () => {
    try {
      const response = await axios.post("/api/authentication/logout")
      if (response.data.success) {
        setAuth({
          isAuthenticated: false,
          role: null,
          isLoading: false,
          error: null
        })
      window.location.replace("/components/authentication/login");
      }
    } catch (error) {
      
    }
  }
  
  if (auth.isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!auth.isAuthenticated) {
    return null // Redirect happening via useEffect, don't render anything
  }


  return (
    <header className="mb-0 bg-gradient-to-r from-gray-600 via-gray-800 to-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row justify-between items-center animate-fade-in">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4 md:mb-0">
          <span className="text-yellow-300">XP</span> Computers
        </h1>

        <nav>
          <ul className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-sm sm:text-base md:text-lg font-medium">
            <li>
              <a
                onClick={() => router.push("/components/dashboard/customer")}
                className="hover:text-gray-300 transition-colors duration-300 cursor-pointer"
              >
                Home
              </a>
            </li>
            <li>
              <a
                onClick={() => router.push("/components/customerComponents/products")}
                className="text-white-600 hover:text-gray-300 transition-colors duration-300 cursor-pointer"
              >
                Products
              </a>
            </li>
            <li>
              <a
                onClick={() => router.push("/components/customerComponents/cart")}
                className="text-white-600 hover:text-gray-300 transition-colors duration-300 cursor-pointer"
              >
                Cart
              </a>
            </li>
            <li>
              <a
                onClick={() => router.push("/components/customerComponents/order")}
                className="text-white-600 hover:text-gray-300 transition-colors duration-300 cursor-pointer"
              >
                Orders
              </a>
            </li>
            <li>
              <a
                onClick={() => router.push("/components/customerComponents/profile")}
                className="text-white-600 hover:text-gray-300 transition-colors duration-300 cursor-pointer"
              >
                Profile
              </a>
            </li>
            <li>
              <button
                onClick={logout}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded bg-slate-600 hover:bg-gray-700 transition-colors duration-300 text-xs sm:text-sm md:text-base"
              >
                <FiLogOut className="text-white text-base sm:text-lg md:text-xl" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
