'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuth } from '@/app/context/AuthContext'
import {FiBox, FiLogIn } from 'react-icons/fi';
import 'primeicons/primeicons.css';
        

export default function PublicNavigation() {
  const router = useRouter()

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
                onClick={() => router.replace("/components/customerComponents/products")}
                className="flex items-center text-white-600 hover:text-gray-300 transition-colors duration-300 cursor-pointer"
              >
              
                 <FiBox className="mr-1" /> Products
              </a>
            </li>
            <li>
              <a
                onClick={() => router.replace("/components/authentication/login")}
                className="flex items-center text-white-600 hover:text-gray-300 transition-colors duration-300 cursor-pointer"
              >
                <FiLogIn className="mr-1" /> Login
               
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
