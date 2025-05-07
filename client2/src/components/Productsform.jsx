import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { getProducts, addProduct, updateProduct, deleteProduct } from "../services/api";
import StockHistoryModal from './StockHistoryModal';
import StockAdjustmentModal from './StockAdjustmentModal';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    gstpercent: '0',
    availablestock: '',
    unit: 'KG'
  });
  const [editMode, setEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // New state for modals
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again.');
      setProducts([]);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert numerical values from strings
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      gstpercent: formData.gstpercent ? parseFloat(formData.gstpercent) : 0,
      availablestock: parseInt(formData.availablestock)
    };

    try {
      if (editMode) {
        // Update existing product
        await updateProduct(currentProductId, productData);
        alert('Product updated successfully');
      } else {
        // Create new product
        await addProduct(productData);
        alert('Product added successfully');
      }
      
      // Reset form and fetch updated product list
      resetForm();
      fetchProducts();
      // Hide form after successful submission
      setShowForm(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      gstpercent: '0',
      availablestock: '',
      unit: 'KG'
    });
    setEditMode(false);
    setCurrentProductId(null);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      gstpercent: product.gstpercent.toString(),
      availablestock: product.availablestock.toString(),
      unit: product.unit
    });
    setEditMode(true);
    setCurrentProductId(product._id);
    setShowForm(true); // Show form when editing
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
        alert('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleAddNewClick = () => {
    resetForm();
    setShowForm(true);
  };

  const handleCancelClick = () => {
    resetForm();
    setShowForm(false);
  };

  // New functions for stock management
  const openStockHistory = (product) => {
    setSelectedProduct(product);
    setShowHistoryModal(true);
  };

  const openStockAdjustment = (product) => {
    setSelectedProduct(product);
    setShowAdjustModal(true);
  };

  const handleStockAdjustmentSuccess = () => {
    fetchProducts(); // Refresh product list after stock adjustment
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Product Management</h1>
          {!showForm && (
            <button
              onClick={handleAddNewClick}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Product
            </button>
          )}
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Product Form - Only shown when showForm is true */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4">
              {editMode ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Product Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1">Price*</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1">GST Percentage</label>
                  <input
                    type="number"
                    name="gstpercent"
                    value={formData.gstpercent}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block mb-1">Available Stock*</label>
                  <input
                    type="number"
                    name="availablestock"
                    value={formData.availablestock}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1">Unit</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="KG">KG</option>
                    <option value="G">G</option>
                    <option value="L">L</option>
                    <option value="ML">ML</option>
                    <option value="PCS">PCS</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows="3"
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all"
                >
                  {editMode ? 'Update Product' : 'Add Product'}
                </button>
                
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Product List */}
        <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2">Loading products...</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-indigo-900 text-white">
                <tr>
                  <th className="p-4 text-left">#</th>
                  <th className="p-4 text-left">Product Name</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">GST %</th>
                  <th className="p-4 text-left">Stock</th>
                  <th className="p-4 text-left">Unit</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <tr key={product._id} className="border-b hover:bg-gray-50 transition-all duration-200">
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4 font-medium text-gray-800">{product.name}</td>
                      <td className="p-4 text-green-600 font-semibold">₹{product.price.toFixed(2)}</td>
                      <td className="p-4">{product.gstpercent}%</td>
                      <td className="p-4">
                        <span className="flex items-center gap-2">
                          {product.availablestock} {product.unit}
                        </span>
                      </td>
                      <td className="p-4">{product.unit}</td>
                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg shadow hover:bg-blue-700 transition-all"
                          title="Edit Product"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openStockAdjustment(product)}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg shadow hover:bg-green-700 transition-all"
                          title="Adjust Stock"
                        >
                          Stock
                        </button>
                        <button
                          onClick={() => openStockHistory(product)}
                          className="bg-purple-600 text-white px-3 py-1 rounded-lg shadow hover:bg-purple-700 transition-all"
                          title="View Stock History"
                        >
                          History
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition-all"
                          title="Delete Product"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-8 px-4 text-center text-gray-500">
                      No products found. Add some products to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Stock History Modal */}
      <StockHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        productId={selectedProduct?._id}
        productName={selectedProduct?.name}
      />

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={showAdjustModal}
        onClose={() => setShowAdjustModal(false)}
        product={selectedProduct}
        onSuccess={handleStockAdjustmentSuccess}
      />
    </div>
  );
};

export default ProductManagement;