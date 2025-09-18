// src/components/StickyCartButton.jsx
import React from 'react';
import { ShoppingCart, Clock } from 'lucide-react';

const StickyCartButton = ({ onClick, onOrderHistoryClick, itemCount }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white p-3 border-t shadow-md z-40">
    <div className="flex justify-between items-center gap-3">
      {/* Left side - Item count */}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-700">Items: {itemCount}</p>
      </div>
      
      {/* Right side - Buttons */}
      <div className="flex gap-3">
        {/* Order History Button */}
        <button 
          type="button" 
          onClick={onOrderHistoryClick}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md"
        >
          <Clock className="w-4 h-4" />
          <span>Orders</span>
        </button>
        
        {/* View Cart Button */}
        <button 
          type="button" 
          onClick={onClick} 
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>View Cart</span>
        </button>
      </div>
    </div>
  </div>
);
export default StickyCartButton;