'use client'
import { useEffect, useState } from 'react'
import CustomerLayout from '../../dashboard/customer/layout'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import 'primeicons/primeicons.css';
        

export default function Order() {
  const router = useRouter()
  const { auth } = useAuth()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (auth?.isLoading) return 
    if (!auth || !auth.isAuthenticated) {
      router.replace("/components/authentication/login")
    } else if (auth.role === "admin") {
      router.replace("/components/dashboard/admin")
    }
  }, [auth, router])

  useEffect(() => {
    if (auth?.isAuthenticated) {
      fetchOrders()
    }
  }, [auth])


  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/orders/getUserOrders")
      if (res.data.success) {
        setOrders(res.data.orders)
      } else {
        console.error("Failed to fetch orders:", res.data.message)
      }
    } catch (err) {
      console.error("Error fetching orders:", err.message)
    }
  }
    if (auth?.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-700">
       <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
      </div>
    )
  }


  if (!auth?.isAuthenticated) {
    return null
  }

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-white px-4 py-8 flex justify-center">
        <div className="bg-gray-600 w-[90%] max-w-7xl backdrop-blur-md rounded-2xl shadow-2xl ring-1 ring-white/30 text-white p-8 space-y-10">
          <h1 className="text-4xl font-bold text-center text-white drop-shadow">Your Orders</h1>

          {orders.length === 0 ? (
            <div className="text-center py-20 bg-gray-600">
              <p className="text-xl text-white/70">No orders found. Start shopping now!</p>
              <button
                onClick={() => router.push("/components/customerComponents/products")}
                className="mt-8 bg-slate-600 hover:bg-slate-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
              >
                Browse Products
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.orderId} className="bg-gray-500 border border-white/10 rounded-xl p-6 shadow-inner">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Order #{order.orderId.slice(-6).toUpperCase()}</h2>
                    <p className="text-sm text-white">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <p className="text-white-900 font-semibold capitalize mt-2 sm:mt-0">Status: {order.status}</p>
                </div>

                <div className="text-sm text-white space-y-1 mb-4">
                  <p><strong>Shipping Address:</strong> {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                  <p><strong>Total Amount:</strong> Rs. {order.totalAmount.toLocaleString()}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Items</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/10 border border-white/10 rounded-lg p-4">
                        <div>
                          <h4 className="text-white font-medium">{item.productName}</h4>
                          <p className="text-white text-sm">Rs. {item.price.toLocaleString()} × {item.quantity}</p>
                        </div>
                        <p className="text-sm text-white">Total: Rs. {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </CustomerLayout>
  )
}
