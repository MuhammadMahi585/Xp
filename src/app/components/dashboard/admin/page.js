'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiBox, FiShoppingCart, FiLogOut } from 'react-icons/fi';

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

function AdminDashboardContent() {
  const {auth,setAuth} = useAuth()
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'products';
  const options=["processing","pending", "shipped", "delivered", "cancelled"];
  const [selectedOption,setSelectedOption] =useState({})
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Laptops',
    subcategory: '',
    stock: 0,
    images: []
  });
  
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [orders, setOrders] = useState([]);

  // Fetch data based on tab
  useEffect(() => {
  if (auth.isLoading) return;

  if (auth.isAuthenticated) {
    if (auth.type === "admin") {
      router.replace("/components/dashboard/admin");
    } else if (auth.type === "customer") {
      router.replace("/components/dashboard/customer");
    }
  } else {
    router.replace("/components/authentication/login");
  }
}, [auth, router]);

useEffect(() => {
  if (!auth.isAuthenticated || auth.isLoading) return;

  if (tab === "products") {
    fetchProducts();
  } else if (tab === "orders") {
    fetchOrders();
  }
}, [tab, auth.isAuthenticated, auth.isLoading]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`/api/products`, {
        params: {
          search: searchTerm,
          category: selectedCategory
        }
      });
      setProducts(response.data.data);
      setCategories(response.data.categories || ['All']);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders/getAllOrders');
      setOrders(response.data.orders);

    const statusMap = {};
    response.data.orders.forEach(order => {
      statusMap[order.orderId] = order.status;
    });
    
    setSelectedOption(statusMap)

    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(selectedFile.type)) {
        alert('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('File size too large (max 5MB)');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleImageUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      setIsUploading(true);
      const response = await axios.post('/api/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, response.data.url]
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert(error.response?.data?.error || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/products', formData);
      alert('Product added successfully!');
      setFormData({
        name: '',
        price: '',
        description: '',
        category: 'Laptops',
        subcategory: '',
        stock: 0,
        images: []
      });
      fetchProducts();
      router.push('/components/dashboard/admin?tab=products');
    } catch (error) {
      console.error('Error adding product:', error);
      alert(error.response?.data?.error || 'Failed to add product');
    }
  };
 

  const handleDelete = async (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const res= await axios.delete(`/api/products/${productId}`);
        if(res.data.success){
        alert("Product deleted successfully")
      }
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {});

    const logout = async () => {
      try {
        const response = await axios.post("/api/authentication/logout")
        if (response.data.success) {
          setAuth({
            isAuthenticated: false,
            role: null,
            isLoading: false, 
            error: null
          })
          router.replace("/components/authentication/login")
        }
      } catch (error) {
        console.error("Error occurred during logout", error)
      }
    }
const handleStatus = async (e, orderId) => {
  const newStatus = e.target.value;

  setSelectedOption(prev => ({
    ...prev,
    [orderId]: newStatus
  }));

  try {
    await axios.put('/api/orders/setOrderStatus', {
      orderId,
      status: newStatus
    });
  } catch (err) {
    console.error('Failed to update status', err);
  }
};

    
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">XP Computer Admin</h1>
          
          <nav className="w-full md:w-auto">
            <ul className="flex flex-wrap justify-center gap-2 md:gap-4">
              <li>
                <button 
                  onClick={() => router.push('/components/dashboard/admin?tab=add-product')}
                  className={`flex items-center px-3 py-2 rounded ${tab === 'add-product' ? 'bg-white text-blue-600' : 'hover:bg-blue-700'}`}
                >
                  <FiPlus className="mr-1" /> Add Product
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.push('/components/dashboard/admin?tab=products')}
                  className={`flex items-center px-3 py-2 rounded ${tab === 'products' ? 'bg-white text-blue-600' : 'hover:bg-blue-700'}`}
                >
                  <FiBox className="mr-1" /> Products
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.push('/components/dashboard/admin?tab=orders')}
                  className={`flex items-center px-3 py-2 rounded ${tab === 'orders' ? 'bg-white text-blue-600' : 'hover:bg-blue-700'}`}
                >
                  <FiShoppingCart className="mr-1" /> Orders
                </button>
              </li>
              <li>
                <button 
                  onClick={logout}
                  className="flex items-center px-3 py-2 rounded hover:bg-blue-700"
                >
                  <FiLogOut className="mr-1" /> Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        {/* Add Product Tab */}
        {tab === 'add-product' && (
          <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Add New Product</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/jpeg, image/png, image/webp"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      disabled={isUploading}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={!file || isUploading}
                    className={`px-4 py-2 rounded text-white font-medium flex-shrink-0 ${(!file || isUploading) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </button>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={img} 
                          alt={`Product preview ${index}`}
                          className="h-20 w-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index)
                          }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (Rs)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                    className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                    className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Laptops">Laptops</option>
                    <option value="Desktops">Desktops</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Components">Components</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                  <input
                    type="text"
                    id="subcategory"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                    className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    required
                    className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Tab */}
        {tab === 'products' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-800">Product Listing</h2>
              
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
                      <div key={product._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1">
                          {product.images?.[0] && (
                            <div className="bg-white/5 rounded-xl overflow-hidden mb-4 flex items-center justify-center h-48">
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-full h-full object-contain p-4"
                              
                            />
                              </div>
                          )}
                            <h4 className="font-medium text-gray-900 line-clamp-1">{product.name}</h4>
                            <p className="text-blue-600 font-semibold mt-1">Rs {product.price.toFixed(2)}</p>
                            {product.stock > 0 ? (
                              <span className="text-xs text-green-600">In Stock: {product.stock}</span>
                            ) : (
                              <span className="text-xs text-red-600">Out of Stock</span>
                            )}
                          </div>
                       
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                          <button 
                            onClick={() => router.push(`/components/dashboard/admin/edit-product?id=${product._id}`)}
                            className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                          >
                            <FiEdit className="mr-1" /> Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(product._id)}
                            className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800"
                          >
                            <FiTrash2 className="mr-1" /> Delete
                          </button>
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
                <p className="mt-2 text-gray-500">
                  {searchTerm || selectedCategory !== 'All' ? (
                    'Try adjusting your search or filter'
                  ) : (
                    'Add your first product to get started'
                  )}
                </p>
                {!searchTerm && selectedCategory === 'All' && (
                  <button
                    onClick={() => router.push('/components/dashboard/admin?tab=add-product')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Product
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div className="bg-gray-200 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Orders</h2>
            
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.orderId} className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-gray-300">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 ">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">Order #{order.orderId}</h3>
                        <p className="text-gray-500 text-sm">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium self-start sm:self-auto ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
          <div className="px-3 py-1 rounded-full text-sm font-medium self-start sm:self-auto">
      <select
        id="status"
        value={selectedOption[order.orderId] || "pending"}
        onChange={(e)=>handleStatus(e,order.orderId)}
        className={`
          px-2 py-1 rounded 
          ${selectedOption[order.orderId] === "delivered" ? "bg-green-100 text-green-800" :
            selectedOption[order.orderId] === "processing" ? "bg-yellow-100 text-yellow-800" :
            selectedOption[order.orderId] === "pending" ? "bg-blue-100 text-blue-800" :
            selectedOption[order.orderId] === "cancelled" ? "bg-red-100 text-red-800" :
            "bg-gray-100 text-gray-800"}
        `}
      >
        {options.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
                       
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div className='text-gray-700'>
                        <h4 className="font-medium text-gray-700 mb-2">Customer Info</h4>
                        <p>{order.user?.name || 'N/A'}</p>
                        <p>{order.user?.number || 'N/A'}</p>
                        <p className="text-blue-600">{order.user?.email || 'N/A'}</p>
                      </div>

                      <div className='text-gray-700'>
                        <h4 className="font-medium text-gray-700 mb-2">Delivery Info</h4>
                        <p>{order.shippingAddress?.street || 'N/A'}</p>
                        <p>{order.shippingAddress?.city || 'N/A'}</p>
                        <p>{order.shippingAddress?.state || 'N/A'}</p>
                        <p>{order.shippingAddress?.postalCode || 'N/A'}</p>
                        <p>{order.shippingAddress?.country || 'N/A'}</p>
                       </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Ordered Products</h4>
                      <ul className="space-y-2">
                        {order.items?.map((item, index) => (
                          <li key={item.productId} className="flex justify-between text-gray-700">
                            <span>{item.quantity}x {item.productName || 'Unknown Product'}</span>
                            <span>Rs {(item.quantity * item.price).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between font-medium text-gray-900">
                        <span>Total</span>
                        <span>Rs {order.totalAmount?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div key="no user found" className="text-center py-12">
                  <div className="mx-auto h-24 w-24 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
                  <p className="mt-2 text-gray-500">Orders will appear here when customers make purchases</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} XP Computer Admin Dashboard</p>
        </div>
      </footer>
    </div>

  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminDashboardContent />
    </Suspense>
  );
}