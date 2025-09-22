// src/components/OrderHistory.jsx
import React, { useState, useEffect } from "react";
import noOrdersImage from "../assets/image.png";
import axios from "axios";

const OrderHistory = ({ onClose, selectedTable, tableNo }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IkdyaWxsX05fU2hha2VzIiwibmJmIjoxNzUxMjA5MTg4LCJleHAiOjE3NTg5ODUxODgsImlhdCI6MTc1MTIwOTE4OH0.H2XoHKLvlrM8cpb68ht18K2Mkj6PVnSSd-tM4HmMIfI";
      const actualTableNo = getTableNumber();
      
      const response = await axios.get(
        `https://localhost:7104/api/Order/GetOrder?username=Grill_N_Shakes${actualTableNo ? `&tableNo=${actualTableNo}` : ''}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data || [];
      const ordersArray = Array.isArray(data) ? data : [];
      
      // Filter orders by table number if specified
      const filteredOrders = actualTableNo 
        ? ordersArray.filter(order => {
            const orderTableNo = order.tableNo || order.TableNo || order.table_no;
            return orderTableNo == actualTableNo;
          })
        : ordersArray;
      
      // Hide orders if all are complete
      const allOrdersComplete = filteredOrders.length > 0 && 
        filteredOrders.every(order => order.orderStatusId === 3);
      
      setOrders(allOrdersComplete ? [] : filteredOrders);
      
    } catch (err) {
      setError("Failed to load orders");
      console.error("Error fetching orders:", err);
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

  // const getExpectedTime = (status) => {
  //   switch (status) {
  //     case 1: return "Waiting for confirmation";
  //     case 2: return "5-10 minutes";
  //     case 3: return "Served";
  //     case 4: return "Cancelled";
  //     default: return "N/A";
  //   }
  // };

  // const getTimeLabel = (status) => {
  //   switch (status) {
  //     case 2: return "Expected Time: ";
  //     default: return "Status: ";
  //   }
  // };

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
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-lg">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-xl font-bold">Orders</h1>
          <span className="text-gray-400 text-sm">{getOrderId()}</span>
          <button
            onClick={onClose}
            className="px-6 py-2 font-bold bg-gray-200 text-black rounded hover:bg-gray-300 transition-colors"
            aria-label="Close orders modal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[75vh]">
          {error ? (
            <div className="text-center p-4">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={fetchOrders}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : orders.length === 0 ? (
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
                      <h2 className="font-semibold text-gray-900">
                        {order.itemName || "Item Name"}, {formatPortionText(order)}
                      </h2>
                      
                      {/* <p className="text-sm text-gray-500 mt-1">
                        {getTimeLabel(status)}
                        <span className={
                          status === 2 
                            ? "font-medium text-blue-600"
                            : "font-medium"
                        }>
                          {getExpectedTime(status)}
                        </span>
                      </p> */}
                      
                      <p className="text-sm font-medium text-green-600 mt-1">
                        Price: ₹{calculateTotalPrice(order)}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded text-white text-sm font-medium ${getStatusColor(status)}`}>
                      {getStatusText(status)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;