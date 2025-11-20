// src/components/OrderHistory.jsx
import React, { useState, useEffect } from "react";
import noOrdersImage from "../assets/image.png";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const OrderHistory = ({ onClose, selectedTable, tableNo }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    fetchOrders();
    
    // Refresh orders every 30 seconds
    const fetchInterval = setInterval(fetchOrders, 30000);
    
    return () => clearInterval(fetchInterval);
  }, []);

  const getTableNumber = () => {
    return tableNo || 
           selectedTable?.TableNo || 
           selectedTable?.tableNo || 
           selectedTable?.id || 
           selectedTable;
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IkdyaWxsX05fU2hha2VzIiwibmJmIjoxNzYxOTEzOTIyLCJleHAiOjE3Njk2ODk5MjIsImlhdCI6MTc2MTkxMzkyMn0.03UaoHr4_jBpuAwCNacnteOxmt47aiiJdCilQsRihbs";
      const actualTableNo = getTableNumber();
      
      const response = await axios.get(
        `http://115.187.17.90:84/api/Order/GetOrder?username=Grill_N_Shakes${actualTableNo ? `&tableNo=${actualTableNo}` : ''}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data || [];
      const ordersArray = Array.isArray(data) ? data : [];
      
      
      const filteredByTable = actualTableNo 
        ? ordersArray.filter(order => {
            const orderTableNo = order.tableNo || order.TableNo || order.table_no;
            return orderTableNo == actualTableNo;
          })
        : ordersArray;
      
      
      const hasCompletedOrders = filteredByTable.some(order => order.orderStatusId === 3);
      const allOrdersCompleted = filteredByTable.length > 0 && 
        filteredByTable.every(order => order.orderStatusId === 3 || order.isActive === 0 || order.isActive === false);
      
      
      let shouldShowThankYou = false;
      if (allOrdersCompleted && hasCompletedOrders) {
        const completedOrders = filteredByTable.filter(order => order.orderStatusId === 3);
        const currentTime = new Date();
        
       
        shouldShowThankYou = completedOrders.some(order => {
          const lastModified = order.lastModified || order.LastModified || order.modifiedDate;
          if (lastModified) {
            const modifiedTime = new Date(lastModified);
            const timeDiffMinutes = (currentTime - modifiedTime) / (1000 * 60);
            return timeDiffMinutes <= 1;
          }
          return false;
        });
      }
      
      // Filter out completed orders (status 3) and inactive orders (isActive 0)
      const activeOrders = filteredByTable.filter(order => {
        const isNotComplete = order.orderStatusId !== 3;
        const isActive = order.isActive !== 0 && order.isActive !== false;
        return isNotComplete && isActive;
      });
      
      setOrders(activeOrders);
      setShowThankYou(shouldShowThankYou);
      
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Failed to fetch orders. Please try again.");
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      1: "bg-yellow-500",  // Order Placed
      2: "bg-blue-500",    // Preparing
      3: "bg-green-500",   // Complete
      4: "bg-red-500",     // Cancelled
    };
    return colors[status] || "bg-gray-400";
  };

  const getStatusText = (status) => {
    const statusMap = {
      1: "Order Placed",
      2: "Preparing",
      3: "Complete",
      4: "Cancelled",
    };
    return statusMap[status] || "Unknown";
  };

  const calculateTotalPrice = (order) => {
    const basePrice = order.price || 0;
    const quantity = order.fullPortion || order.halfPortion || order.quantity || 1;
    return basePrice * quantity;
  };

  const formatPortionText = (order) => {
    if (order.fullPortion) {
      return `${order.fullPortion} Full Portion${order.fullPortion > 1 ? "s" : ""}`;
    }
    if (order.halfPortion) {
      return `${order.halfPortion} Half Portion${order.halfPortion > 1 ? "s" : ""}`;
    }
    const qty = order.quantity || 0;
    return `${qty} portion${qty > 1 ? "s" : ""}`;
  };

  const getOrderId = () => {
    if (orders.length === 0) return "#OrderId";
    return `#${orders[0].orderId || orders[0].OrderId || "N/A"}`;
  };

  // Calculate total amount to be paid
  const calculateTotalAmount = () => {
    return orders.reduce((total, order) => {
      return total + calculateTotalPrice(order);
    }, 0);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-gray-500 ml-3">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <ToastContainer />
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-lg flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-teal-600 to-teal-700 text-black rounded-t-xl">
          <div>
            <h1 className="text-xl font-bold">Orders</h1>
            <span className="text-black-700 text-sm">{getOrderId()}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 font-bold bg-teal bg-opacity-20 text-black rounded hover:bg-opacity-30 transition-colors"
            aria-label="Close orders modal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {error ? (
            <div className="text-center p-4">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={fetchOrders}
                className="mt-2 px-4 py-2 bg-teal-400 text-black rounded hover:bg-teal-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : orders.length === 0 ? (
            showThankYou ? (
              <div className="flex flex-col items-center justify-center text-center p-8">
                <div className="bg-green-100 rounded-full p-6 mb-4">
                  <svg 
                    className="w-20 h-20 text-green-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">
                  Thank You!
                </h2>
                <p className="text-gray-600 text-lg mb-1">
                  Your order has been completed
                </p>
                <p className="text-gray-500 text-sm">
                  We hope you enjoyed your meal!
                </p>
                <p className="text-gray-400 text-xs mt-4">
                  Please visit us again soon
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8">
                <img 
                  src={noOrdersImage} 
                  alt="No orders available" 
                  className="w-48 h-auto mb-5"
                />
                <p className="text-gray-500 text-lg">
                  You haven't Ordered Yet!
                </p>
              </div>
            )
          ) : (
            <div className="space-y-3">
              {orders.map((order, index) => {
                const orderId = order.Id || order.id || index;
                const status = order.orderStatusId;
                
                return (
                  <div
                    key={orderId}
                    className="flex items-center justify-between p-4 rounded-lg shadow-sm bg-white border hover:shadow-md transition-shadow"
                  >
                    {/* Status Indicator */}
                    <div className={`w-2 h-16 rounded-full ${getStatusColor(status)}`} />

                    {/* Order Details */}
                    <div className="flex-1 ml-4">
                      <h2 className="font-semibold text-gray-900 text-sm sm:text-base">
                        {order.itemName || "Item Name"}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {formatPortionText(order)}
                      </p>
                      <p className="text-sm font-bold text-green-600 mt-1">
                        ₹{calculateTotalPrice(order)}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded text-white text-xs sm:text-sm font-medium ${getStatusColor(status)}`}>
                      {getStatusText(status)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Total Amount Section - Fixed at bottom */}
        {orders.length > 0 && (
          <div className="border-t bg-gradient-to-r from-green-50 to-teal-50 p-4">
            <div className="bg-white rounded-lg p-4 shadow-md border-2 border-green-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium">Total Items:</span>
                <span className="text-gray-900 font-semibold">{orders.length}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t-2 border-dashed border-gray-300">
                <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                <span className="text-2xl font-bold text-green-600">
                  ₹{calculateTotalAmount()}
                </span>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                After enjoying your meal visit at counter to make payment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default OrderHistory;