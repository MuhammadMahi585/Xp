"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { auth, setAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    var redirectPath = "/components/authentication/login";
    if (auth.isAuthenticated) {
      console.log(auth);
      if (auth.role === "admin") {
        redirectPath = "/components/dashboard/admin";
      } else if (auth.role === "customer") {
        redirectPath = "/components/dashboard/customer";
      }
      router.replace(redirectPath);
    }
  }, [auth, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/authentication/login', { email, password });
      console.log('Full response:', response);
      setAuth({
        isAuthenticated: true,
        role: response.data.user.type,
        isLoading: false,
      });
      const redirectPath = response.data.user.type === 'admin'
        ? '/components/dashboard/admin'
        : '/components/dashboard/customer';
      router.push(redirectPath);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* Main Login Section */}
      <div className="flex flex-1 min-h-screen">
        
        {/* Left Side */}
        <div className="w-1/2 bg-gradient-to-br from-blue-600 to-indigo-900 flex flex-col justify-center p-12 text-white sticky top-0 h-screen">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-4">XP Computer</h1>
            <p className="text-xl mb-8">
              Your trusted partner for all computer solutions - sales, service, and support.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-1/2 flex items-center justify-center p-12 bg-gray-50 sticky top-0 h-screen">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Welcome Back</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-black mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-black mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="./signup" className="font-medium text-blue-600 hover:text-blue-500">
                    SignUp?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Owner Section */}
      <section className="w-full py-16 bg-white text-center">
        <h2 className="text-4xl font-bold mb-8 text-black">Owner</h2>
        <div className="flex justify-center">
          <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg">
            <img src="/assets/image/nain.jpg" alt="Owner" className="w-full h-full object-cover" />
          </div>
        </div>
        <p className="mt-4 text-xl font-semibold text-black">Zulqarnain Mahessar</p>
      </section>

      {/* Our Team Section */}
      <section className="w-full py-16 bg-gray-50 text-center">
        <h2 className="text-4xl font-bold mb-8 text-black">Our Team</h2>
        <div className="flex justify-center space-x-12">
          {/* Co-owner */}
          <div>
            <div className="w-36 h-36 rounded-full overflow-hidden shadow-md mx-auto">
              <img src="/assets/Image/jameel.jpg" alt="Co-Owner" className="w-full h-full object-cover" />
            </div>
            <p className="mt-2 font-semibold text-black">Jameel Kanasro (Co-owner)</p>
          </div>
          {/* Manager */}
          <div>
            <div className="w-36 h-36 rounded-full overflow-hidden shadow-md mx-auto">
              <img src="/assets/Image/sajjad.png" alt="Manager" className="w-full h-full object-cover" />
            </div>
            <p className="mt-2 font-semibold text-black">Sajjad Soomro (Manager)</p>
          </div>
        </div>
      </section>

      {/* Our Branches Section */}
      <section className="w-full py-16 bg-white text-center">
        <h2 className="text-4xl font-bold mb-8 text-black">Our Branches</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-12">
          {[
            {
              name: 'Xp laptop Store',
              location: 'Saddar, Rawalpindi',
              image: '/assets/Image/xp_laptop.jpg',
            },
            {
              name: 'New Xp Computer',
              location: '6th Road Rawalpindi',
              image: '/assets/Image/newxp.jpg',
            },
            {
              name: 'Xp Computer accessories',
              location: 'Saddar Rawalpindi',
              image: '/assets/Image/xp_saddar.png',
            },
          ].map((branch, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-lg">
              <img
                src={branch.image}
                alt={branch.name}
                className="w-full h-80 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-black">{branch.name}</h3>
                <p className="text-gray-600">{branch.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-gray-200 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">

          {/* Brand & Contact */}
          <div className="md:w-1/3">
            <h3 className="text-2xl font-bold mb-2">XP Computer</h3>
            <p className="text-gray-400 mb-4">Your complete computer solution</p>
            <p className="flex items-center space-x-2">
              <span>📍</span>
              <span>Near Rania Mall, Saddar, Rawalpindi</span>
            </p>
            <p className="flex items-center space-x-2">
              <span>📞</span>
              <span>+92 300 42454893</span>
            </p>
            <p className="flex items-center space-x-2">
              <span>✉️</span>
              <span>info@xpcomputer.com</span>
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:w-1/3">
            <h4 className="text-xl font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1">
              <li><a href="/" className="hover:underline">Home</a></li>
              <li><a href="/components/authentication/login" className="hover:underline">Login</a></li>
              <li><a href="/components/authentication/signup" className="hover:underline">Sign Up</a></li>
              <li><a href="/components/pages/about" className="hover:underline">About Us</a></li>
              <li><a href="/components/pages/contact" className="hover:underline">Contact</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="md:w-1/3">
            <h4 className="text-xl font-semibold mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/Nainmahessar" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Facebook
              </a>
              <a href="https://www.instagram.com/xpcomputer" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Instagram
              </a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
