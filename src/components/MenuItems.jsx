import React from 'react';
import { Plus, Minus } from 'lucide-react';

const MenuItems = ({
  item,
  subcategoryName,
  getItemQuantityInCart,
  addToCart,
  updateCartQuantity
}) => {

  const isAvailable = item.isActive == 1;

  return (
    <div className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white">
      
      {/* Image */}
      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shadow-md flex-shrink-0">
        {item.imageData ? (
         <img
            src={`data:image/jpeg;base64,${item.imageData}`}
            alt={item.name}
            className={`w-full h-full object-cover ${!isAvailable ? 'opacity-50' : ''}`}
            loading="lazy"
          />
        ) : (
          <span className="text-2xl">🍽️</span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow justify-between">
        
        <div>
          <h3 className={`text-sm font-semibold leading-tight break-words ${!isAvailable ? 'opacity-60' : ''}`}>
            {item.name}
          </h3>
          <p className="text-xs text-gray-500">{subcategoryName}</p>

          {!isAvailable && (
            <p className="text-xs text-red-500 font-bold mt-1">
                * Item Currently Unavailable
            </p>
          )}
        </div>

        <div className={`flex flex-wrap gap-2 mt-2 ${!isAvailable ? 'opacity-60' : ''}`}>
          {Object.entries(item.prices)
            .map(([key, value]) => [key.toLowerCase(), value])
            .filter(([, price]) => price > 0)
            .map(([size, price]) => {

              const quantity = getItemQuantityInCart(item.id, size);

              return (
                <div
                  key={size}
                  className={`flex items-center justify-between border rounded-md px-2 py-1 shadow-sm w-[120px] h-10
                    ${isAvailable ? 'bg-gray-50 border-gray-300' : 'bg-gray-100 border-gray-200'}
                  `}
                >
                  <span className="text-xs font-medium capitalize text-gray-800">
                    {size} - ₹{price}
                  </span>

                  {isAvailable && (
                    <div className="flex items-center gap-1">
                      {quantity > 0 && (
                        <button
                          onClick={() =>
                            updateCartQuantity(`${item.id}-${size}`, quantity - 1)
                          }
                          className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <Minus size={14} />
                        </button>
                      )}

                      {quantity > 0 && (
                        <span className="text-xs font-bold text-gray-800">
                          {quantity}
                        </span>
                      )}

                      <button
                        onClick={() => addToCart(item, size)}
                        className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-orange-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default MenuItems;