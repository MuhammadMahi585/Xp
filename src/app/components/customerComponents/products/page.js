'use client'
import { useState, useEffect } from 'react'
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
  const [quantities, setQuantities] = useState({});
 
 // Redirect if not authorized or wrong role
  useEffect(() => {
    if (!auth?.isLoading) {
      if (!auth?.isAuthenticated) {
        router.replace("/components/authentication/login")
      } else if (auth.role === "admin") {
        router.replace("/components/dashboard/admin")
      }
    }
  }, [auth, router])

  // Fetch products when search term or category changes (only for customers)
  useEffect(() => {
    if (auth?.isAuthenticated && auth.role !== "admin") {
      fetchProducts()
    }
  }, [searchTerm, selectedCategory, auth])

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products', {
        params: { search: searchTerm, category: selectedCategory }
      });
      
      setProducts(response.data.data);
      setCategories(response.data.categories || ['All']);
      
      
      const initialQuantities = {};
      response.data.data.forEach(product => {
        initialQuantities[product._id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {});

  const handleQuantityChange = (productId, value) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      const product = products.find(p => p._id === productId);
      const newValue = Math.max(1, Math.min(product?.stock || 1, numValue));
      
      setQuantities(prev => ({
        ...prev,
        [productId]: newValue
      }));
    }
  };

  const incrementQuantity = (productId) => {
    const product = products.find(p => p._id === productId);
    if (!product) return;
    
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.min(product.stock, (prev[productId] || 1) + 1)
    }));
  };

  const decrementQuantity = (productId) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1)
    }));
  };

  const addToCart = async (productId) => {
    try {
      const quantity = quantities[productId] || 1;
      const product = products.find(p => p._id === productId);
      
      if (!product || product.stock <= 0) {
        alert("This product is out of stock");
        return;
      }

      const response = await axios.post('/api/cart/addToCart', {
        productId,
        quantity
      });

      
      if (response.data.unauthorized) {
        router.replace("/components/authentication/login");
        window.location.reload();
      } 
      else if(response.data.roductoutOfStock){
        alert("product out of stock")
      }
      else if (response.data.success) {
        alert(`${quantity} ${product.name}(s) added to cart`);
        fetchProducts()
        
      }
    } catch (error) {
      console.error("Failed to add to Cart:", error);
      alert("Failed to add product to cart");
    }
  };

  return (
  <CustomerLayout>
      <div className="min-h-screen bg-white flex justify-center px-4 py-8">
        <div className="w-[95%] mx-auto backdrop-blur-md bg-gray-600 rounded-2xl shadow-2xl ring-1 ring-white/40 text-white overflow-hidden">
          {/* Header Section */}
          <div className="p-6 border-b border-white/30">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-3xl font-bold">Products</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {/* Search Bar */}
                <div className=" relative flex-1 min-w-[250px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-white/70" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/10 backdrop-blur-sm text-white pl-10 w-full px-4 py-3 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white-500 focus:border-gray-900 placeholder-white/50"
                  />
                </div>
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white/10 backdrop-blur-sm text-white px-4 py-3 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white-500 focus:border-white-500 min-w-[180px]"
                >
                  {categories.map((category) => (
                    <option key={category} value={category} className="bg-[#322f5b]">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Products List */}
          <div className="p-6">
            {Object.keys(productsByCategory).length > 0 ? (
              Object.entries(productsByCategory).map(([category, categoryProducts]) => (
                <div key={category} className="mb-10">
                  <h3 className="text-2xl font-semibold mb-6 pb-2 border-b border-white/30">{category}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {categoryProducts.map((product) => (
                      <div key={product._id} className="bg-gray-500 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-400/30 transition-all">
                        <div className="p-5">
                          {product.images?.[0] && (
                            <div className="bg-white/5 rounded-xl overflow-hidden mb-4 flex items-center justify-center h-48">
                              <img 
                                src={product.images[0]} 
                                alt={product.name}
                                className="h-full w-full object-contain p-4"
                              />
                            </div>
                          )}
                          <div className="flex flex-col gap-3">
                            <h4 className="font-medium text-white line-clamp-2 h-14">{product.name}</h4>
                            <p className="text-white-900 font-semibold text-xl">Rs. {product.price.toLocaleString()}</p>
                            {product.stock > 0 ? (
                              <span className="text-sm text-white-900">In Stock: {product.stock}</span>
                            ) : (
                              <span className="text-sm text-gray-900">Out of Stock</span>
                            )}
                            {/* Quantity Selector */}
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm text-white/70">Quantity:</span>
                              <div className="flex items-center bg-white/10 rounded-lg overflow-hidden">
                                <button 
                                  onClick={() => decrementQuantity(product._id)}
                                  disabled={quantities[product._id] <= 1}
                                  className="px-3 py-1 hover:bg-white/20 transition-colors disabled:opacity-50"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  max={product.stock}
                                  value={quantities[product._id] || 1}
                                  onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                                  className="w-12 text-center bg-transparent border-none focus:outline-none text-white"
                                />
                                <button 
                                  onClick={() => incrementQuantity(product._id)}
                                  disabled={quantities[product._id] >= product.stock}
                                  className="px-3 py-1 hover:bg-white/20 transition-colors disabled:opacity-50"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="px-5 pb-5">
                          <button
                            onClick={() => addToCart(product._id)}
                            disabled={product.stock <= 0}
                            className={`w-full py-3 px-6 rounded-xl transition-all shadow-lg ${product.stock > 0 ? 'bg-slate-600 hover:bg-slate-7000' : 'bg-gray-600 cursor-not-allowed'}`}
                          >
                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto h-24 w-24 text-white/30">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="mt-6 text-xl font-medium text-white">No products found</h3>
                <p className="mt-2 text-white/70">Try adjusting your search or filter</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}
