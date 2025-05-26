"use client";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

const Home = () => {
  const { auth } = useAuth();
  const router = useRouter();
  const letters = ["X", "P", " ", "C", "o", "m", "p", "u", "t", "e", "r", "s"];

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.5, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    hidden: { opacity: 0, y: "0.25em" },
    visible: {
      opacity: 1,
      y: "0em",
      transition: { duration: 2, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      if (auth.role === "admin") {
        router.replace("/components/dashboard/admin");
      } else if (auth.role === "customer") {
        router.replace("/components/dashboard/customer");
      }
    } else {
      router.replace("/components/authentication/login");
    }
  }, [auth, router]);

  return (
    <div className="w-screen min-h-screen flex flex-col bg-white text-black">
      {/* Hero & About Section */}
      <section className="flex flex-col lg:flex-row w-full">
        {/* Hero */}
        <div className="w-full lg:w-1/2 min-h-[100vh] flex items-center justify-center bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 text-white px-4 py-12 sm:px-6 md:px-10 lg:px-16">
          <div className="max-w-md sm:max-w-lg text-center lg:text-left">
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 leading-snug"
            >
              {letters.map((char, index) => (
                <motion.span key={index} variants={child}>
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.div>
            <p className="text-base sm:text-lg">
              Your trusted partner for all computer solutions <br />
              — sales, service, and support.
            </p>
          </div>
        </div>

        {/* About */}
        <div className="w-full lg:w-1/2 min-h-[100vh] flex items-center justify-center bg-white px-4 py-12 sm:px-6 md:px-10 lg:px-16">
          <div className="max-w-md sm:max-w-lg">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">About Us</h1>
            <p className="mb-4 text-sm sm:text-base">
              Welcome to <strong>XP Computer</strong> — your one-stop destination for all things tech. We're a passionate team committed to delivering top-quality computer accessories, laptops, and essential gadgets to customers across the region.
            </p>
            <p className="mb-4 text-sm sm:text-base">
              Founded with a vision to make technology <strong>accessible, affordable, and reliable</strong>, XP Computer offers a diverse range of products, including:
            </p>
            <ul className="list-none space-y-2 text-sm sm:text-base">
              <li>💾 High-performance RAMs and SSDs</li>
              <li>💻 Premium laptops for work, gaming, and studies</li>
              <li>🔋 Long-lasting power banks</li>
              <li>🖥️ Ergonomic laptop tables and accessories</li>
              <li>🧩 Upgrade kits & peripherals</li>
            </ul>
            <p className="mt-4 text-sm sm:text-base">
              At XP Computer, we don’t just sell tech — <strong>we simplify it</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="w-full py-16 bg-white text-center px-4 sm:px-6 md:px-10 lg:px-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-black">Our Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Computer accessories", image: "/assets/Image/accessories.png" },
            { name: "Laptops", image: "/assets/Image/laptop.png" },
            { name: "Mobile accessories", image: "/assets/Image/cellphone.png" },
          ].map((item, idx) => (
            <div key={idx} className="rounded-lg overflow-hidden shadow-lg bg-white">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-64 object-contain bg-gray-100"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-black">{item.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-12 px-4 sm:px-6 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between items-start space-y-10 md:space-y-0">
          {/* Contact Info */}
          <div className="md:w-1/3">
            <h3 className="text-2xl font-bold mb-2">XP Computer</h3>
            <p className="text-gray-400 mb-4">Your complete computer solution</p>
            <p className="flex items-center">📍 Near Rania Mall, Saddar, Rawalpindi</p>
            <p className="flex items-center">📞 +92 308 2269979</p>
            <p className="flex items-center">✉️ xpcomputer789@gmail.com</p>
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
              <a href="https://www.facebook.com/Nainmahessar" target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a>
              <a href="https://www.instagram.com/xpcomputer" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
