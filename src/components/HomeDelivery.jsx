    // HomeDelivery.jsx
import React, { useState, useEffect, useMemo } from "react";
import { X, MapPin, Phone, User, Clock, Plus, Minus, ShoppingCart } from "lucide-react";
import axios from "axios";
import { toast } from 'react-toastify';

const HomeDelivery = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [menuItems, setMenuItems] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
//   const [showCart, setShowCart] = useState(false);

  // Delivery form state
  const [deliveryForm, setDeliveryForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    landmark: "",
    deliveryTime: "30-40 mins"
  });

  // Fetch menu data from API
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IkdyaWxsX05fU2hha2VzIiwibmJmIjoxNzUxMjA5MTg4LCJleHAiOjE3NTg5ODUxODgsImlhdCI6MTc1MTIwOTE4OH0.H2XoHKLvlrM8cpb68ht18K2Mkj6PVnSSd-tM4HmMIfI";

        const [catRes, subcatRes, itemRes] = await Promise.all([
          axios.get(
            "https://localhost:7104/api/Order/GetMenuCategory?username=Grill_N_Shakes",
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(
            "https://localhost:7104/api/Order/GetMenuSubcategory?username=Grill_N_Shakes",
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(
            "https://localhost:7104/api/Order/GetMenuItem?username=Grill_N_Shakes",
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);

        // Categories
        setCategories(catRes.data || []);

        // Group subcategories by categoryId
        const groupedSubcats = {};
        (subcatRes.data || []).forEach((sub) => {
          const catId = Number(sub.categoryId);
          if (!groupedSubcats[catId]) groupedSubcats[catId] = [];
          groupedSubcats[catId].push(sub);
        });
        setSubcategories(groupedSubcats);

        // Group items by subcategoryId, normalize fields
        const groupedItemsBySubcategory = {};
        (itemRes.data || []).forEach((item) => {
          const subId = Number(item.subcategoryId);
          if (!groupedItemsBySubcategory[subId])
            groupedItemsBySubcategory[subId] = [];
          groupedItemsBySubcategory[subId].push({
            ...item,
            id: item.itemId,
            name: item.itemName,
            imageData: item.imageSrc && item.imageSrc.length > 50 ? item.imageSrc : null,
            prices: {
              full: item.price1 || 0,
              half: item.price2 || 0,
            },
          });
        });
        setMenuItems(groupedItemsBySubcategory);
      } catch (error) {
        toast.error("Failed to load menu data for delivery");
        console.error("Error fetching menu data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Create category map
  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((cat) => (map[cat.categoryId] = cat.categoryName));
    return map;
  }, [categories]);

  // Flatten and filter items
  const filteredItems = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase();
    let allItems = [];

    Object.values(subcategories).forEach((subsOfCat) => {
      subsOfCat.forEach((sub) => {
        const subId = Number(sub.subcategoryId || sub.id || sub.subCatId);
        const items = menuItems[subId] || [];
        const subName = sub.subcategoryName || sub.name || "Unknown";
        const catId = Number(sub.categoryId);
        const catName = categoryMap[catId] || "";

        items.forEach((item) => {
          allItems.push({
            ...item,
            subcategoryName: subName,
            categoryId: catId,
            categoryName: catName,
          });
        });
      });
    });

    // Filter by category
    if (selectedCategory !== "all") {
      allItems = allItems.filter((item) => 
        item.categoryName.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search term
    if (lowerSearch) {
      allItems = allItems.filter(
        (item) =>
          item.name?.toLowerCase().includes(lowerSearch) ||
          item.subcategoryName?.toLowerCase().includes(lowerSearch) ||
          item.categoryName?.toLowerCase().includes(lowerSearch)
      );
    }

    return allItems;
  }, [subcategories, menuItems, categoryMap, searchTerm, selectedCategory]);

  // Cart functions
  const addToCart = (item, size) => {
    const cartId = `${item.id}-${size}`;
    const price = item.prices[size];
    
    if (price === 0) {
      toast.error(`${size} size not available for ${item.name}`);
      return;
    }

    const cartItem = {
      id: cartId,
      itemId: item.id,
      name: item.name,
      size,
      price: price,
      quantity: 1,
      subcategoryName: item.subcategoryName,
    };

    setCart((prev) => {
      const existing = prev.find((ci) => ci.id === cartId);
      if (existing) {
        return prev.map((ci) =>
          ci.id === cartId ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, cartItem];
    });
    toast.success(`${item.name} (${size}) added to cart`);
  };

  const updateCartQuantity = (itemId, newQty) => {
    if (newQty === 0) {
      setCart((prev) => prev.filter((it) => it.id !== itemId));
    } else {
      setCart((prev) =>
        prev.map((it) => (it.id === itemId ? { ...it, quantity: newQty } : it))
      );
    }
  };

//   const removeFromCart = (itemId) => {
//     setCart((prev) => prev.filter((it) => it.id !== itemId));
//   };

  const getCartTotal = () =>
    cart.reduce((total, it) => total + it.price * it.quantity, 0);

  const getCartItemCount = () =>
    cart.reduce((count, it) => count + it.quantity, 0);

  const getItemQuantityInCart = (itemId, size) => {
    const found = cart.find((it) => it.id === `${itemId}-${size}`);
    return found ? found.quantity : 0;
  };

  // Handle delivery order placement
  const handleDeliveryOrder = async () => {
    if (!deliveryForm.customerName.trim()) {
      toast.error("Please enter customer name");
      return;
    }
    if (!deliveryForm.phone.trim()) {
      toast.error("Please enter phone number");
      return;
    }
    if (!deliveryForm.address.trim()) {
      toast.error("Please enter delivery address");
      return;
    }
    if (cart.length === 0) {
      toast.error("Please add items to cart");
      return;
    }

    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IkdyaWxsX05fU2hha2VzIiwibmJmIjoxNzUxMjA5MTg4LCJleHAiOjE3NTg5ODUxODgsImlhdCI6MTc1MTIwOTE4OH0.H2XoHKLvlrM8cpb68ht18K2Mkj6PVnSSd-tM4HmMIfI";

      const orderData = {
        selectedTable: "HOME_DELIVERY",
        userName: 2,
        customerName: deliveryForm.customerName,
        userPhone: deliveryForm.phone,
        deliveryAddress: `${deliveryForm.address}${deliveryForm.landmark ? ', ' + deliveryForm.landmark : ''}`,
        orderType: "DELIVERY",
        orderItems: cart.map((item) => ({
          price: item.price,
          item_id: parseInt(item.itemId),
          full: item.size === "full" ? item.quantity : 0,
          half: item.size === "half" ? item.quantity : 0,
        })),
      };

      await axios.post("https://localhost:7104/api/Order/Post", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Delivery order placed successfully!");
      setCart([]);
      setDeliveryForm({
        customerName: "",
        phone: "",
        address: "",
        landmark: "",
        deliveryTime: "30-40 mins"
      });
      onClose();
    } catch (error) {
      toast.error("Failed to place delivery order: " + error.message);
    }
  };

  const handleFormChange = (field, value) => {
    setDeliveryForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-center">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-teal-600 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            <h2 className="text-xl font-bold">Home Delivery</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-teal-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Menu */}
          <div className="flex-1 flex flex-col">
            {/* Search and Filters */}
            <div className="p-4 border-b bg-gray-50">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === "all" 
                      ? "bg-teal-600 text-white" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All Items
                </button>
                {categories.map((category) => (
                  <button
                    key={category.categoryId}
                    onClick={() => setSelectedCategory(category.categoryName)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.categoryName
                        ? "bg-teal-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {category.categoryName}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No items found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      {item.imageData && (
                        <img 
                          src={`data:image/jpeg;base64,${item.imageData}`}
                          alt={item.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}
                      
                      <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{item.subcategoryName}</p>
                      
                      <div className="space-y-2">
                        {/* Full Size */}
                        {item.prices.full > 0 && (
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-gray-600">Full - </span>
                              <span className="font-medium">₹{item.prices.full}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {getItemQuantityInCart(item.id, "full") > 0 ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => updateCartQuantity(`${item.id}-full`, getItemQuantityInCart(item.id, "full") - 1)}
                                    className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center hover:bg-teal-200 transition-colors"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="w-8 text-center font-medium">
                                    {getItemQuantityInCart(item.id, "full")}
                                  </span>
                                  <button
                                    onClick={() => addToCart(item, "full")}
                                    className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition-colors"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addToCart(item, "full")}
                                  className="px-3 py-1 bg-teal-600 text-white text-sm rounded-full hover:bg-teal-700 transition-colors"
                                >
                                  Add
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Half Size */}
                        {item.prices.half > 0 && (
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-gray-600">Half - </span>
                              <span className="font-medium">₹{item.prices.half}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {getItemQuantityInCart(item.id, "half") > 0 ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => updateCartQuantity(`${item.id}-half`, getItemQuantityInCart(item.id, "half") - 1)}
                                    className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center hover:bg-teal-200 transition-colors"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="w-8 text-center font-medium">
                                    {getItemQuantityInCart(item.id, "half")}
                                  </span>
                                  <button
                                    onClick={() => addToCart(item, "half")}
                                    className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition-colors"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addToCart(item, "half")}
                                  className="px-3 py-1 bg-teal-600 text-white text-sm rounded-full hover:bg-teal-700 transition-colors"
                                >
                                  Add
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Order Summary & Delivery Form */}
          <div className="w-96 bg-gray-50 border-l flex flex-col">
            {/* Cart Summary */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5" />
                <h3 className="font-semibold">Your Order ({getCartItemCount()} items)</h3>
              </div>
              
              {cart.length === 0 ? (
                <p className="text-gray-500 text-sm">No items added yet</p>
              ) : (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-600">{item.size} - ₹{item.price}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {cart.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between font-semibold">
                    <span>Total: ₹{getCartTotal()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Form */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="font-semibold mb-4">Delivery Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={deliveryForm.customerName}
                    onChange={(e) => handleFormChange('customerName', e.target.value)}
                    placeholder="Enter your name"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={deliveryForm.phone}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Delivery Address *
                  </label>
                  <textarea
                    value={deliveryForm.address}
                    onChange={(e) => handleFormChange('address', e.target.value)}
                    placeholder="Enter complete address"
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={deliveryForm.landmark}
                    onChange={(e) => handleFormChange('landmark', e.target.value)}
                    placeholder="Nearby landmark"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Estimated Delivery Time
                  </label>
                  <select
                    value={deliveryForm.deliveryTime}
                    onChange={(e) => handleFormChange('deliveryTime', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="30-40 mins">30-40 mins</option>
                    <option value="45-60 mins">45-60 mins</option>
                    <option value="60-75 mins">60-75 mins</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <div className="p-4 border-t">
              <button
                onClick={handleDeliveryOrder}
                disabled={cart.length === 0}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  cart.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
              >
                Place Delivery Order - ₹{getCartTotal()}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDelivery;