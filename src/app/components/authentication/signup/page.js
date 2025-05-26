"use client"
import {motion} from "framer-motion"
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    password: '',
    confirmPassword: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Pakistan'
  });
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const {auth,setAuth} = useAuth();
  const router = useRouter()

  useEffect(()=>{
    if(auth.isAuthenticated){
      if(auth.role==="admin"){
        router.push("/components/dashboard/admin")
      }
      else if(auth.role==="customer"){
        router.push("/components/dashboard/customer")
      }
    }
  },[auth,router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
  
    try {
      const response = await axios.post('/api/authentication/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        number: formData.number,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country
      })
         
      router.push('/components/authentication/login')
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }
  
  const letters = ['X','P',' ','C','o','m','p','u','t','e','r','s']

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.5, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    hidden: {
      opacity: 0,
      y: `0.25em`,
    },
    visible: {
      opacity: 1,
      y: `0em`,
      transition: {
        duration: 1,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  return (
    <div className="flex flex-col bg-white">
    {/* Signup Section (100vh) */}
   <div className="flex flex-col lg:flex-row min-h-screen">
  {/* Left Side - Brand Section */}
  <div className="w-full lg:w-1/2 bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 text-white shadow-lg flex flex-col justify-center p-6 md:p-12 sticky top-0 lg:h-screen">
    <div className="max-w-md">
      {/* XP Computers Logo/Text - Left Aligned */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="visible"
        className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-left"
      >
        {["X","P"," ","C","o","m","p","u","t","e","r","s"].map((char, index) => (
          <motion.span key={index} variants={child}>
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.div>

      {/* Tagline - Left Aligned */}
      <p className="text-base md:text-xl mb-6 lg:mb-8 text-left">
        Join our community of tech enthusiasts and<br />
        professionals.
      </p>

      {/* Team Images - Left Aligned Row */}
      <div className="flex space-x-3 md:space-x-4 mt-6 lg:mt-8">
        {[1,2,3].map((i) => (
          <div key={i} className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white bg-opacity-20 rounded-full overflow-hidden">
            <img 
              src="/assets/Image/team1.png"
              alt={`Team member ${i}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Right Side - Signup Form */}
  <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-gray-50 sticky top-0 lg:h-screen overflow-auto">
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Create Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div>
          <input
            id="name"
            name="name"
            placeholder="👤 Full Name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="text-black mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="📧 Email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="text-black mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <input
            id="number"
            name="number"
            type="text"
            placeholder="📞 03XXXXXXXXX or 92XXXXXXXXXX"
            required
            value={formData.number}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, ''); // remove non-digits globally
              setFormData(prev => ({
                ...prev,
                number: onlyNumbers
              }));
            }}
            className="text-black mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="🔒 Password"
            required
            minLength="8"
            value={formData.password}
            onChange={handleChange}
            className="text-black mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="🔐 Confirm Password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="text-black mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Address fields in 2-column grid on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <input
              id="street"
              name="street"
              type="text"
              placeholder="📍 Street Address"
              required
              value={formData.street}
              onChange={handleChange}
              className="text-black mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <input
              id="city"
              name="city"
              type="text"
              placeholder="🏙️ City"
              required
              value={formData.city}
              onChange={handleChange}
              className="text-black mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <input
              id="state"
              name="state"
              type="text"
              placeholder="🗺️ Province"
              required
              value={formData.state}
              onChange={handleChange}
              className="text-black mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              placeholder="✉️ Postal Code"
              required
              value={formData.postalCode}
              onChange={handleChange}
              className="text-black mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="text-black mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Pakistan">Pakistan</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            I agree to the <a href="#" className="text-purple-400 hover:underline">Terms and Conditions</a>
          </label>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </div>

        <div className="text-sm text-center pt-2">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="./login" className="font-medium text-purple-400 hover:text-purple-200">
              Log in
            </a>
          </p>
        </div>
      </form>
    </div>
  </div>
</div>

  {/* Additional Content Sections */}
<section className="w-full min-h-screen bg-white flex items-center justify-center p-6 sm:p-12">
  <div className="max-w-4xl text-center">
    <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-black">Why Join Us?</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8 sm:mt-12">
      {[
        { title: 'Exclusive Deals', icon: '💰', description: 'Get 5% Discount now' },
        { title: 'Tech Support', icon: '🛠️', description: '24/7 expert assistance' },
        { title: 'Replaces', icon: '👥', description: 'Free replacement till 1 week' }
      ].map((item, index) => (
        <div key={index} className="p-6 bg-gray-50 rounded-lg shadow-sm">
          <div className="text-4xl sm:text-5xl mb-4">{item.icon}</div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-black">{item.title}</h3>
          <p className="text-gray-600 text-sm sm:text-base">{item.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>

<section className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-6 sm:p-12">
  <div className="max-w-4xl text-center">
    <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-black">Our Happy Customers</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8 sm:mt-12">
      {[
        { name: 'Taimoor Ayaz', quote: 'Best Products', role: 'Premium Member' },
        { name: 'Abdul Basit', quote: 'Cheap Prices', role: 'Pro Member' },
        { name: 'Armaghan Amir', quote: 'Quality Products', role: 'VIP Member' }
      ].map((testimonial, index) => (
        <div key={index} className="p-6 bg-white rounded-lg shadow-sm">
          <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <p className="italic mb-4 text-black text-sm sm:text-base">"{testimonial.quote}"</p>
          <p className="font-semibold text-black">{testimonial.name}</p>
          <p className="text-xs sm:text-sm text-gray-500">{testimonial.role}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* Footer */}
<footer className="bg-gray-900 text-gray-200 py-12 px-6">
  <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
    
    {/* Brand & Contact */}
    <div className="md:w-1/3 space-y-4 text-center md:text-left">
      <h3 className="text-2xl font-bold mb-2">XP Computer</h3>
      <p className="text-gray-400 mb-4">Your complete computer solution</p>
      <p className="flex  md:justify-start space-x-2 text-sm md:text-base">
        <span>📍</span>
        <span>Near Rania Mall, Saddar, Rawalpindi</span>
      </p>
      <p className="flex md:justify-start space-x-2 text-sm md:text-base">
        <span>📞</span>
        <span>+92 308 2269979</span>
      </p>
      <p className="flex md:justify-start space-x-2 text-sm md:text-base">
        <span>✉️</span>
        <span>xpcomputer789@gmail.com</span>
      </p>
    </div>

    {/* Quick Links */}
    <div className="md:w-1/3">
      <h4 className="text-xl font-semibold mb-2">Quick Links</h4>
      <ul className="space-y-1">
        <li><a href="/components/authentication/login" className="hover:underline">Home</a></li>
        <li><a href="/components/authentication/login" className="hover:underline">Login</a></li>
        <li><a href="/components/authentication/signup" className="hover:underline">Sign Up</a></li>
      </ul>
    </div>

    {/* Social & Website */}
    <div className="md:w-1/3 text-center md:text-left space-y-4">
      <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
      <div className="flex justify-center md:justify-start space-x-6 text-gray-400">
        <a href="https://www.facebook.com/Nainmahessar" target="_blank" rel="noopener" className="hover:text-white" aria-label="Facebook">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22 12a10 10 0 10-11.5 9.95v-7.05h-2.2v-2.9h2.2V9.8c0-2.18 1.3-3.4 3.3-3.4.95 0 1.95.17 1.95.17v2.14h-1.1c-1.1 0-1.45.69-1.45 1.4v1.7h2.48l-.4 2.9h-2.08v7.05A10 10 0 0022 12z" />
          </svg>
        </a>
        <a href="https://www.instagram.com/xpcomputer" target="_blank" rel="noopener" className="hover:text-white" aria-label="Instagram">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm4.75-.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z"/>
          </svg>
        </a>
        <a href="https://xpcomputer.com" target="_blank" rel="noopener" className="hover:text-white" aria-label="Website">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 4.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15zm0 1.5a6 6 0 110 12 6 6 0 010-12zm0 2.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z"/>
          </svg>
        </a>
      </div>
    </div>
  </div>

  <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-500 text-xs sm:text-sm">
    © {new Date().getFullYear()} XP Computer. All rights reserved.
  </div>
</footer>

  </div>
  
  )
}

