import React, { useState } from "react";
import { Plus, Minus, Trash2, MapPin } from "lucide-react";
import { toast } from "react-toastify";

const CartModal = ({
  cart,
  updateCartQuantity,
  removeFromCart,
  handlePlaceOrder,
  selectedTable,
  setShowCart,
  isPlacingOrder
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [userPhone, setUserPhone] = useState("");

  const handleFinalOrder = () => {
    if (!customerName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!/^[0-9]{10}$/.test(userPhone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    // ✅ Pass details to API function
    handlePlaceOrder({ customerName, userPhone });
  };

  // Calculate total amount
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] sm:max-h-[80vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold">Your Cart</h2>
            <button
              onClick={() => setShowCart(false)}
              className="text-white hover:text-gray-200 text-xl sm:text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="p-3 sm:p-4">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8 text-sm sm:text-base">
              Your cart is empty.
            </p>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 border-b gap-3 hover:bg-gray-50 px-2 rounded"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 capitalize">
                      {item.size} Portion
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-green-600 mt-1">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() =>
                        updateCartQuantity(item.id, item.quantity - 1)
                      }
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-semibold text-sm sm:text-base">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateCartQuantity(item.id, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Total Amount */}
              <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border-2 border-green-300">
                <div className="flex items-center justify-between">
                  <span className="text-base sm:text-lg font-bold text-gray-800">
                    Total Amount:
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-green-700">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              {/* Table Info */}
              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <MapPin size={16} />
                  <span className="text-sm sm:text-base font-semibold">
                    Table: {selectedTable || "Not Selected"}
                  </span>
                </div>
              </div>

              {/* User Details Form */}
              {showDetails ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-gray-600 block mb-1 text-sm sm:text-base font-medium">
                      Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="text-gray-600 block mb-1 text-sm sm:text-base font-medium">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={userPhone}
                      onChange={(e) =>
                        setUserPhone(
                          e.target.value.replace(/\D/g, "").slice(0, 10)
                        )
                      }
                      placeholder="Enter your phone number"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none text-sm sm:text-base"
                    />
                  </div>

                  {/* Order Summary Before Confirm */}
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                      Order Summary
                    </h3>
                    <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Items:</span>
                        <span>{cart.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Table:</span>
                        <span>{selectedTable}</span>
                      </div>
                      <div className="flex justify-between font-bold text-green-700 text-sm sm:text-base pt-2 border-t">
                        <span>Total:</span>
                        <span>₹{totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleFinalOrder}
                    disabled={isPlacingOrder}
                    className={`w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg transition font-semibold text-sm sm:text-base shadow-md
                          ${isPlacingOrder ? "opacity-50 cursor-not-allowed" : "hover:from-green-700 hover:to-green-800"}
                           `}
                  >
                    {isPlacingOrder ? "Placing Order..." : "Confirm & Place Order"}
                  </button>

                </div>
              ) : (
                <button
                  onClick={() => setShowDetails(true)}
                  disabled={!selectedTable}
                  className={`mt-4 w-full py-3 rounded-lg font-semibold text-sm sm:text-base shadow-md transition-all duration-200 
                    ${selectedTable
                      ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                >
                  Place Order
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;