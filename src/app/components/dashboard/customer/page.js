"use client";
import {motion} from "framer-motion";
import React, { useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import CustomerLayout from './layout';


const Home = () => {
  const { auth } = useAuth();
  const router = useRouter();
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
        duration: 2,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
     if(auth.role==="admin"){
        router.replace("/components/dashboard/admin")
     }
     else if(auth.role==="customer"){
      router.replace("/components/dashboard/customer")
     }
    }
    else{
      router.replace("/components/authentication/login")
    }
  }, [auth, router]);


  return (
    <div className="flex flex-col min-h-screen">

    {/* Main Section*/}
    <div className="flex flex-1 min-h-screen">
      
      {/* Left Side */}
      <div className="w-1/2 bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 text-white shadow-lg flex flex-col justify-center p-12 sticky top-0 h-screen">
        <div className="max-w-md">
        <motion.div
    variants={container}
    initial="hidden"
    animate="visible"
    className="text-5xl font-bold mb-4"
  >
    {letters.map((char, index) => (
      <motion.span key={index} variants={child}>
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ))}
  </motion.div>
          <p className="text-xl mb-8">
            Your trusted partner for all computer solutions - sales, service, and support.
          </p>
        </div>
      </div>
      <div className="w-1/2 bg-white flex flex-col justify-center p-12 text-black sticky top-0 h-screen">
      <h1 className="text-gray-900 	text-[3rem] lrading:[4rem] font-bold">
        About us
      </h1>
      <p>Welcome to <strong>XP Computer</strong> — your one-stop destination for all things tech. We're a passionate team committed to delivering top-quality computer accessories, laptops, and essential gadgets to customers across the region.</p>

<p>Founded with a vision to make technology <strong>accessible, affordable, and reliable</strong>, XP Computer offers a diverse range of products, including:</p>

<ul>
  <li>💾 High-performance RAMs and SSDs</li>
  <li>💻 Premium laptops for work, gaming, and studies</li>
  <li>🔋 Long-lasting power banks</li>
  <li>🖥️ Ergonomic laptop tables and workspace accessories</li>
  <li>🧩 A wide variety of computer peripherals and upgrade kits</li>
</ul>

<p>At XP Computer, we don’t just sell tech — <strong>we simplify it</strong>. Whether you're a casual user, gamer, or business professional, our mission is to help you discover the perfect tech solutions with ease.</p>
</div>
      </div>
      <section className="w-full py-16 bg-white text-center">
        <h2 className="text-4xl font-bold mb-8 text-black">Our Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-12">
          {[
            {
              name: 'Computer accessories', 
              image: '/assets/Image/accessories.png',
            },
            {
              name: 'Laptops',
              image: '/assets/Image/laptop.png',
            },
            {
              name: 'Mobile accessories',
              
              image: '/assets/Image/cellphone.png',
            },
          ].map((branch, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-lg">
              <img
                src={branch.image}
                alt={branch.name}
                className="w-full h-100 object-contain"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-black">{branch.name}</h3>
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
};

export default Home;
