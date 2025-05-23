import React, { useState, useEffect } from 'react';
import { getProductStockHistory } from '../services/api';

const StockHistoryModal = ({ isOpen, onClose, productId, productName }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && productId) {
      fetchStockHistory();
    }
  }, [isOpen, productId]);

  const fetchStockHistory = async () => {
    setLoading(true);
    try {
      const { data } = await getProductStockHistory(productId);
      setHistory(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stock history:', err);
      setError('Failed to load stock history');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            Stock History for {productName}
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

        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : history.length === 0 ? (
            <div className="text-gray-500 text-center p-4">No stock history available</div>
          ) : (
            <div className="space-y-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {history.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.previousStock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.newStock}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        record.changeAmount > 0 
                          ? 'text-green-600' 
                          : record.changeAmount < 0 
                            ? 'text-red-600' 
                            : 'text-gray-500'
                      }`}>
                        {record.changeAmount > 0 ? '+' : ''}{record.changeAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {record.changeType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          
        </div>
      </div>
    </div>
  );
};

export default StockHistoryModal;