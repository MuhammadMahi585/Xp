"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { auth, setAuth } = useAuth();
  const router = useRouter();
  
  const [checked, setChecked] = useState(false);


  useEffect(() => {
    if (!auth.isLoading) {
      if (auth.isAuthenticated) {
        const target = auth.role === "admin"
          ? "/components/dashboard/admin"
          : "/components/dashboard/customer";
        router.replace(target);
      } else {
        setChecked(true); 
      }
    }
  }, [auth, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/authentication/login', { email, password });
      setAuth({
        isAuthenticated: true,
        role: response.data.user.type,
        isLoading: false,
      });
      const redirectPath = response.data.user.type === 'admin'
        ? '/components/dashboard/admin'
        : '/components/dashboard/customer';
      router.replace(redirectPath);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const letters = ['X','P',' ','C','o','m','p','u','t','e','r','s'];

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.5, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    hidden: { opacity: 0, y: `0.25em` },
    visible: {
      opacity: 1,
      y: `0em`,
      transition: { duration: 2, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };
  if (auth.isLoading) {
  return <div className="flex justify-center items-center h-screen">Loading...</div>
}
  if (auth.isLoading || !checked) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }


  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Main Login Section */}
      <div className="flex flex-col lg:flex-row min-h-screen">

        {/* Left: Brand */}
        <div className="w-full lg:w-1/2 bg-gray-600 text-white flex items-center justify-center p-6 md:p-12 h-[60vh] lg:h-auto">
          <div className="max-w-md text-center">
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            >
              {letters.map((char, i) => (
                <motion.span key={i} variants={child}>
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.div>
            <p className="text-base md:text-xl">
              Your trusted partner for all computer solutions
              - sales, service, and support.
            </p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-12 bg-gray-50">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-600 mb-6">Welcome Back</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
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
                <label className="flex items-center text-sm text-gray-900">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2" />
                  Remember me
                </label>
                <a href="./signup" className="text-gray-600 hover:underline">Sign up?</a>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 rounded-md shadow-lg text-sm font-medium text-white bg-gray-600  ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
                }`}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Owner Section */}
      <section className="w-full py-12 px-4 bg-white text-center">
        <h2 className="text-4xl font-bold text-black mb-8">Owner</h2>
        <div className="flex justify-center">
          <img
            src="/assets/Image/nain.jpg"
            alt="Owner"
            className="w-40 h-40 rounded-full object-cover shadow-lg"
           
          />
        </div>
        <p className="mt-4 text-lg font-semibold text-black">Zulqarnain Mahessar</p>
      </section>

      {/* Our Team */}
      <section className="w-full py-12 px-4 bg-gray-50 text-center">
        <h2 className="text-4xl font-bold text-black mb-8">Our Team</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { name: "Jameel Kanasro (Co-owner)", image: "/assets/Image/jameel.jpg" },
            { name: "Sajjad Soomro (Manager)", image: "/assets/Image/sajjad.png" },
            { name: "Musharaf Hussain (Vice Manager)", image: "/assets/Image/musho.jpg"},
             { name: "Sufiyan Mahesar (Vice Manager)", image: "/assets/Image/sufi.png"}
          ].map((member, i) => (
            <div key={i}>
              <img src={member.image} alt={member.name} className="w-36 h-36 rounded-full object-cover mx-auto shadow-md" />
              <p className="mt-2 font-semibold text-black">{member.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Branches */}
      <section className="w-full py-12 px-6 md:px-12 bg-white text-center">
        <h2 className="text-4xl font-bold text-black mb-8">Our Branches</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Xp laptop Store",
              location: "Saddar, Rawalpindi",
              image: "/assets/Image/xp_laptop.jpg",
            },
            {
              name: "New Xp Computer",
              location: "6th Road Rawalpindi",
              image: "/assets/Image/newxp.jpg",
            },
            {
              name: "Xp Computer accessories",
              location: "Saddar Rawalpindi",
              image: "/assets/Image/xp_saddar.png",
            },
          ].map((branch, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-lg">
              <img src={branch.image} alt={branch.name} className="w-full h-60 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-black">{branch.name}</h3>
                <p className="text-gray-600">{branch.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-700 text-white py-12 px-6">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">XP Computer</h3>
            <p className="text-gray-400 mb-4">Your complete computer solution</p>
            <p className="flex items-center space-x-2">📍 <span>Near Rania Mall, Saddar, Rawalpindi</span></p>
            <p className="flex items-center space-x-2">📞 <span>+92 308 2269979</span></p>
            <p className="flex items-center space-x-2">✉️ <span>xpcomputer789@gmail.com</span></p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1">
              <li><a href="/" className="hover:underline">Home</a></li>
              <li><a href="/components/authentication/login" className="hover:underline">Login</a></li>
              <li><a href="/components/authentication/signup" className="hover:underline">Sign Up</a></li>
  
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/Nainmahessar" target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a>
              <a href="https://www.instagram.com/xpcomputer" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-500 text-xs sm:text-sm">
    © {new Date().getFullYear()} XP Computer. All rights reserved.
     </div>
      </footer>
    </div>
  );
}