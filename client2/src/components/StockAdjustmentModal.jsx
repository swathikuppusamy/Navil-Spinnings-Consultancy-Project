import React, { useState } from 'react';
import { adjustProductStock } from '../services/api';

const StockAdjustmentModal = ({ isOpen, onClose, product, onSuccess }) => {
  const [formData, setFormData] = useState({
    adjustment: '',
    changeType: 'add',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !product) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.adjustment || isNaN(Number(formData.adjustment))) {
      setError('Please enter a valid number');
      return;
    }
    
    try {
      setLoading(true);
      await adjustProductStock(product._id, formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error adjusting stock:', err);
      setError('Failed to adjust stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            Adjust Stock for {product.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block mb-1 font-medium">Current Stock</label>
            <div className="p-2 bg-gray-100 rounded border border-gray-200">
              {product.availablestock} {product.unit}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 font-medium">Adjustment Type</label>
            <select
              name="changeType"
              value={formData.changeType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="add">Add Stock</option>
              <option value="subtract">Remove Stock</option>
              <option value="set">Set Exact Value</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              {formData.changeType === 'set' ? 'New Stock Level' : 'Quantity to Adjust'}
            </label>
            <div className="flex items-center">
              <input
                type="number"
                name="adjustment"
                value={formData.adjustment}
                onChange={handleInputChange}
                className="flex-1 p-2 border rounded-l"
                min={0}
                required
              />
              <span className="bg-gray-100 border border-l-0 border-gray-300 p-2 rounded-r">
                {product.unit}
              </span>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 font-medium">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows="2"
              placeholder="Reason for adjustment"
            ></textarea>
          </div>
          
          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processing...' : 'Save Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockAdjustmentModal;