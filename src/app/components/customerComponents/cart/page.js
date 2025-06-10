'use client'
import { useState, useEffect } from 'react'
import CustomerLayout from '@/app/components/dashboard/customer/layout'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import 'primeicons/primeicons.css';
        
export default function Cart() {
  const router = useRouter()
  const { auth } = useAuth()

  const [cart, setCart] = useState([])
  const [statusSummary, setStatusSummary] = useState(null)
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  })
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [originalCartQuantities, setOriginalCartQuantities] = useState({})
  const [originalProductNames, setOriginalProductNames] = useState({})

  useEffect(() => {
    if (auth?.isLoading) return
    if (!auth || auth.isAuthenticated === false) {
      router.replace('/components/authentication/login')
      return
    }
    if (auth.role === 'admin') {
      router.replace('/components/dashboard/admin')
      return
    }
  }, [auth, router])

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchCart()
      setAddress()
    }
  
  }, [auth])

  const setAddress = async () => {
    try {
      const res = await axios.get('/api/getUserAddress')
      if (res.data.success) setShippingAddress(res.data.address)
    } catch {
      console.log('error occurred while fetching address')
    }
  }

  const fetchCart = async () => {
    try {
      const res = await axios.get('/api/cart/getCartItems')
      if (res.data.unauthorized) {
        router.replace('/components/authentication/login')
        window.location.reload()
      } else if (res.data.isCartEmpty) {
        setCart([])
        setOriginalCartQuantities({})
        setOriginalProductNames({})
      } else if (res.data.success) {
        setCart(res.data.cartProducts)

        const initialQuantities = {}
        const productNames = {}
        res.data.cartProducts.forEach(({ product, quantity }) => {
          initialQuantities[product._id] = quantity
          productNames[product._id] = product.name
        })
        setOriginalCartQuantities(initialQuantities)
        setOriginalProductNames(productNames)
      }
    } catch (error) {
      console.log('Error occurred while fetching a cart: ', error)
    }
  }

 
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * (item.quantity ?? 1),
    0
  )

 
  const placeOrder = async () => {
    try {
      const res = await axios.post('/api/orders/addOrder', {
        shippingAddress,
        confirm: orderConfirmed,
      })


      if (res.data.adjustments?.length > 0 && !orderConfirmed) {
        const updatedCart = [...cart]

        res.data.adjustments.forEach(adj => {
          const idx = updatedCart.findIndex(item => item.product._id === adj.product)
          if (adj.status === 'adjusted' && idx !== -1) updatedCart[idx].quantity = adj.newQuantity
          if (adj.status === 'removed' && idx !== -1) updatedCart.splice(idx, 1)
        })

 
        setCart(updatedCart)

 
        const sorted = [...res.data.adjustments].sort((a, b) => {
          if (a.status === 'removed' && b.status !== 'removed') return -1
          if (a.status !== 'removed' && b.status === 'removed') return 1
          return 0
        })

        setStatusSummary(sorted)
        setOrderConfirmed(true)
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        return
      }

      if (res.data.success) {
        // order placed
        setCart([])
        setStatusSummary(null)
        setOrderConfirmed(false)
        setOriginalCartQuantities({})
        setOriginalProductNames({})
        alert('Order placed successfully!')
        fetchCart()
      } else {
        alert(`Failed to place order: ${res.data.message}`)
      }
    } catch (error) {
      console.log('Error placing order:', error.message)
      alert('An error occurred while placing your order.')
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      const res = await axios.delete('/api/cart/removeFromCart', { data: { itemId } })
      if (res.data.success) {
        await fetchCart()
        setStatusSummary(null)
        setOrderConfirmed(false)
      }
    } catch (error) {
      console.error('Error removing item from cart', error)
    }
  }

  if (auth?.isLoading) {
    return <div className="flex justify-center items-center h-screen bg-gray-700">
      <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
    </div>
  }
  if (!auth?.isAuthenticated) return null
  const content = (
          <div className="min-h-screen bg-white px-4 py-4 flex justify-center">
        <div className="bg-gray-600 w-[99%] backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl ring-1 ring-white/30 text-white overflow-hidden">
          <div className="p-6 bg-gray-600">

       
            {statusSummary && (
              <div className="mb-10 bg-gray-700 rounded-xl p-4">
                <h2 className="text-lg font-semibold mb-2">Order adjustments</h2>
                <p className="mb-4">
                  Some items were adjusted or removed due to stock issues. Please review and
                  confirm.
                </p>

                <table className="w-full table-fixed text-left">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 border-b border-white/30">Product</th>
                      <th className="px-3 py-2 border-b border-white/30">Old&nbsp;Qty</th>
                      <th className="px-3 py-2 border-b border-white/30">New&nbsp;Qty</th>
                      <th className="px-3 py-2 border-b border-white/30">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statusSummary.map((adj) => {
                      const oldQty = originalCartQuantities[adj.product] ?? 0
                      const productName =
                        cart.find((i) => i.product._id === adj.product)?.product.name ||
                        originalProductNames[adj.product] ||
                        'Unknown product'
                      return (
                        <tr key={adj.product} className="border-b border-white/20">
                          <td className="px-3 py-2">{productName}</td>
                          <td className="px-3 py-2">{oldQty}</td>
                          <td className="px-3 py-2">{adj.newQuantity ?? 0}</td>
                          <td className="px-3 py-2">
                            {adj.status === 'removed' ? 'Removed (OOS)' : 'Adjusted'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {}
            {cart.length > 0 ? (
              <>
                {cart.map((item) => (
                  <div
                    key={item.product._id}
                    className="bg-gray-500 backdrop-blur-sm border border-white/10 rounded-xl p-4 mb-4 hover:border-purple-400/30 transition-all flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="bg-slate-600 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-white truncate">{item.product.name}</h3>
                        <p className="text-white font-medium">Rs. {item.product.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <h1 className="w-12 h-8 border-t border-b border-white/20 bg-white/5 text-center text-white">{item.quantity}</h1>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="flex items-center gap-1 text-white-600 hover:text-gray-900 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="text-sm font-medium">Remove</span>
                    </button>
                  </div>
                ))}

                {/* totals, address and place-order button */}
                <div className="mt-8 pt-6 border-t border-white/20">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Total</h3>
                    <p className="text-2xl font-bold text-white">
                      Rs.&nbsp;{totalAmount.toLocaleString()}
                    </p>
                  </div>

                  {/* shipping address form */}
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['street', 'city', 'state', 'postalCode', 'country'].map((field) => (
                        <div key={field}>
                          <label className="block text-sm font-medium text-white mb-1">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 rounded-xl bg-white/10 text-white placeholder-white/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                            value={shippingAddress[field]}
                            onChange={(e) =>
                              setShippingAddress((prev) => ({ ...prev, [field]: e.target.value }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* place / confirm button */}
                  <button
                    onClick={placeOrder}
                    disabled={cart.length === 0}
                    className={`w-full h-10 mt-4 transition-all shadow-lg flex items-center justify-center gap-2 ${
                      orderConfirmed
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{orderConfirmed ? 'Confirm order with adjustments' : 'Place order'}</span>
                  </button>
                </div>
              </>
            ) : (
              
              !statusSummary && (
                <div className="text-center py-16">
                  <div className="mx-auto h-24 w-24 text-white/30">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-white">Your cart is empty</h3>
                  <p className="mt-2 text-white/70">Add some products to your cart</p>
                  <button
                    onClick={() => router.push('/../../components/customerComponents/products')}
                    className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                  >
                    Go to Products
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
  )

  return (
      <CustomerLayout>{content}</CustomerLayout>  
  )
}
