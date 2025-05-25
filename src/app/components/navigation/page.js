'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuth } from '@/app/context/AuthContext'
import { FiLogOut } from 'react-icons/fi'

export default function Navigation() {
  const router = useRouter()
  const { auth, setAuth } = useAuth()

  const logout = async () => {
    try {
      const response = await axios.post("/api/authentication/logout")
      if (response.data.success) {
        setAuth({
          isAuthenticated: false,
          role: null,
          isLoading: false, // set isLoading to false after logout
          error: null
        })
      console.log("logout success");
        router.replace("/components/authentication/login")
        window.location.reload()
        
      }
    } catch (error) {
      console.error("Error occurred during logout", error)
    }
  }

  useEffect(() => {
    if (!auth.isAuthenticated && !auth.isLoading) {
      router.replace("/components/authentication/login")
    }
  }, [auth, router])

  return (
    <header className="mb-0 bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center animate-fade-in">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 md:mb-0">
          <span className="text-yellow-300">XP</span> Computers
        </h1>

        <nav>
          <ul className="flex flex-wrap justify-center items-center gap-4 text-lg font-medium">
            <li>
              <a
                onClick={() => router.push("/components/dashboard/customer")}
                className="hover:text-yellow-300 transition-colors duration-300"
              >
                Home
              </a>
            </li>
            <li>
              <a
                onClick={() => router.push("/components/customerComponents/products")}
                className="hover:text-yellow-300 transition-colors duration-300"
              >
                Products
              </a>
            </li>
            <li>
              <a
                onClick={() => router.push("/components/customerComponents/cart")}
                className="hover:text-yellow-300 transition-colors duration-300"
              >
                Cart
              </a>
            </li>
            <li>
              <a
                onClick={() => router.push("/components/customerComponents/order")}
                className="hover:text-yellow-300 transition-colors duration-300"
              >
                Orders
              </a>
            </li>
            <li>
              <a
                onClick={() => router.push("/components/customerComponents/profile")}
                className="hover:text-yellow-300 transition-colors duration-300"
              >
                Profile
              </a>
            </li>
            <li>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition-colors duration-300"
              >
                <FiLogOut className="text-white text-xl" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
