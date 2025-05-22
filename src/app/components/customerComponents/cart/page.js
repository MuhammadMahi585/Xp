'use client'
import {useState,useEffect } from 'react'
import CustomerLayout from '../../dashboard/customer/layout'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Product from '../products/page'

export default function Cart() {
  const router = useRouter()
  const { auth, setAuth } = useAuth()
  const [cart,setCart] = useState([])
  
  useEffect(()=>{
    fetchCart()
    var redirectPath="/components/customerComponents/cart"
    if(!auth.isAuthenticated){
      redirectPath="/components/authenctication/login"
    }
    if(auth.isAuthenticated){
      if(auth.role==="admin"){
        redirectPath="/components/dashboard/admin"
      }
    }
    router.replace(redirectPath)
    
  },[auth,router])
      
   const fetchCart =async()=>{
    try{
      const res = await axios.get("/api/cart/getCartItems")
      if(res.data.unauthorized){
         router.replace("components/authentication/login")
         window.location.reload()
      }
      else if(res.data.isCartEmpty){
          setCart([])
      }
      else if(res.data.success){
          setCart(res.data.cartProducts)
      }
    }
    catch(error){
       console.log("Error occured while fetching a cart: ",error)
    }
   }
  
  return (
    <CustomerLayout>
    <div className="min-h-screen bg-gradient-to-br from-[#15172b] via-[#322f5b] to-[#72649b] px-4 py-8 flex justify-center">
      <div className="w-[95%] backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl ring-1 ring-white/30 text-white overflow-hidden">
        <div className="p-6">
          {cart.length > 0 ? (
            <>
              {cart.map((item) => (
                <div key={item._id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 mb-4 hover:border-purple-400/30 transition-all flex flex-col sm:flex-row items-center justify-between gap-4">
                  
                  {/* Product Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate">{item.name}</h3>
                      <p className="text-purple-300 font-medium">Rs. {item.price.toLocaleString()}</p>
                    </div>
                  </div>
        
                  {/* Quantity Controls */}
                  <div className="flex items-center">
                    <button className="w-8 h-8 flex items-center justify-center border border-white/20 rounded-l-md hover:bg-white/10 text-white hover:text-purple-300 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <input
                      type="number"
                      id={`quantity-${item._id}`}
                      name="quantity"
                      min="1"
                      max="100"
                      value={item.quantity || 1}
                      onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                      className="w-12 h-8 border-t border-b border-white/20 bg-white/5 text-center text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    <button className="w-8 h-8 flex items-center justify-center border border-white/20 rounded-r-md hover:bg-white/10 text-white hover:text-purple-300 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
        
                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="text-sm font-medium">Remove</span>
                  </button>
                </div>
              ))}
              
              {/* Total and Checkout Section */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Total</h3>
                  <p className="text-2xl font-bold text-purple-300">
                    Rs. {cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0).toLocaleString()}
                  </p>
                </div>
                
                <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-purple-500/20 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="font-semibold">Place Order</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 text-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-medium text-white">Your cart is empty</h3>
              <p className="mt-2 text-white/70">Add some products to your cart</p>
              <button
              onClick={()=>{router.push("/../../components/customerComponents/products")}}
               className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
               >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </CustomerLayout>
  )
}


