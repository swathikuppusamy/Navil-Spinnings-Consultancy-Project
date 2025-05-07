import React from 'react';

const StockInfoDisplay = ({ product }) => {
  if (!product) return null;

  return (
    <div className="flex items-center gap-2">
      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
        product.availablestock > 10 
          ? 'bg-green-100 text-green-800' 
          : product.availablestock > 0 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-red-100 text-red-800'
      }`}>
        {product.availablestock > 0 
          ? `${product.availablestock} ${product.unit || 'KG'} in stock` 
          : 'Out of stock'}
      </div>
      
      {product.availablestock <= 5 && product.availablestock > 0 && (
        <span className="text-xs text-orange-600 font-medium">
          Low stock!
        </span>
      )}
    </div>
  );
};

export default StockInfoDisplay;