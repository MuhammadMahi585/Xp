'use client'
import { useState,useEffect } from 'react'
import CustomerLayout from '../../dashboard/customer/layout'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiBox, FiShoppingCart, FiLogOut } from 'react-icons/fi';
import axios from 'axios'


export default function Product() {
  const router = useRouter()
  const { auth, setAuth } = useAuth()
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  
  useEffect(()=>{
    var redirectPath="/components/customerComponents/products"
    if(!auth.isAuthenticated){
      redirectPath="/components/authenctication/login"
    }
    if(auth.isAuthenticated){
      if(auth.role==="admin"){
        redirectPath="/components/dashboard/admin"
      }
    }
    router.replace(redirectPath)
    fetchProducts()
  },[searchTerm,selectedCategory,auth,router])

  const fetchProducts = async()=>{
    try{
      const response = await axios.get('/api/products',{
        params: {
          search: searchTerm,
          category: selectedCategory
        }
      })
      setProducts(response.data.data);
      setCategories(response.data.categories || ['All']);
    }

    catch(err){
      console.error('Error fetching products:', error);
    }
  }
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {});
  
  const addToCart=async(productId)=>{
    try{
       const response = await axios.post('/api/cart/addToCart',
        {productId}
       )
       if(response.data.unauthorized){
       router.replace("components/authentication/login");
       window.location.reload()
       }
       else if(response.data.alreadyExist){
        alert("product already in cart")
       }
       else if(response.data.success){
        alert("product added successfully")
       }
    }
    catch(error){
        
    }
  }
 return (
 <CustomerLayout>
  <div className="bg-white h-full rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <h2 className="text-xl font-bold text-gray-800">Products</h2>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="text-black pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
  
              {/* Products List */}
              {Object.keys(productsByCategory).length > 0 ? (
                Object.entries(productsByCategory).map(([category, categoryProducts]) => (
                  <div key={category} className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">{category}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {categoryProducts.map((product) => (
                        <div key={product._id} className="bg-white-100 shadow-lg text-white shadow-lg border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1">
                            {product.images?.[0] && (
                              <img 
                                src={product.images[0]} 
                                alt={product.name}
                                className="h-12 w-100 h-100 object-cover rounded"
      
                              />
                            )}
                              <h4 className="font-medium text-gray-900 line-clamp-1">{product.name}</h4>
                              <p className="text-purple-400 font-semibold mt-1">€{product.price.toFixed(2)}</p>
                              {product.stock > 0 ? (
                                <span className="text-xs text-pink-600">In Stock: {product.stock}</span>
                              ) : (
                                <span className="text-xs text-red-600">Out of Stock</span>
                              )}
                            </div>
                         
                          </div>
                          <div className="mt-4 flex justify-end gap-2">
                            <button
                            onClick={() => addToCart(product._id)}
                             className='text-black font-bold text-lg'
                            >+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto h-24 w-24 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
        
                </div>
              )}
            </div>
    
 </CustomerLayout>
     
  )
}

