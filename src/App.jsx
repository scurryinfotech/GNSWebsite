import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import CategoryButtons from "./components/CategoryButtons";
import MenuList from "./components/menuList";
import CartModal from "./components/CartModal";
import TableSelectionModal from "./components/TableSelectionModal";
import StickyCartButton from "./components/StickyCartButton.jsx";
import Loader from "./components/Loader.jsx";
import OrderHistory from './components/OrderHistory';
import { useLocation } from "react-router-dom";
 import { ToastContainer, toast } from 'react-toastify';
 import "react-toastify/dist/ReactToastify.css";


const RestaurantApp = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [menuItems, setMenuItems] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");
  const [showTableSelection, setShowTableSelection] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
   const [showOrderHistory, setShowOrderHistory] = useState(false);
  // const [customerName, setCustomerName] = useState("");
  // const [userPhone, setUserPhone] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tableFromURL = queryParams.get("table");

  // ---- Place Order ----
  // -----Toastify is used for better user experience------
 const handlePlaceOrder = async ({ customerName, userPhone }) => {
  try {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IkdyaWxsX05fU2hha2VzIiwibmJmIjoxNzUxMjA5MTg4LCJleHAiOjE3NTg5ODUxODgsImlhdCI6MTc1MTIwOTE4OH0.H2XoHKLvlrM8cpb68ht18K2Mkj6PVnSSd-tM4HmMIfI";

    if (!token) {
      toast.error("User not authenticated");
      return;
    }
    if (!selectedTable) {
      toast.error("Please select a table");
      return;
    }

    const orderData = {
      selectedTable:
        selectedTable.TableNo ||
        selectedTable.tableNo ||
        selectedTable.id ||
        selectedTable,
        userName:2,
      customerName,  // ✅ from user input
      userPhone,     // ✅ from user input
      orderItems: cart.map((item) => ({
        price: item.price,
        item_id: parseInt(item.id),
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

    toast.success("Order placed successfully!");
    setCart([]);
    setShowCart(false);
  } catch (error) {
    toast.error("Failed to place order. " + error.message);
  }
};
const handleOrderHistoryClick = () => {
  if (!selectedTable) {
    toast.error("Please select a table first");
    setShowTableSelection(true);
    return;
  }
  setShowOrderHistory(true);
};


  // ---- Fetch Data ----
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IkdyaWxsX05fU2hha2VzIiwibmJmIjoxNzUxMjA5MTg4LCJleHAiOjE3NTg5ODUxODgsImlhdCI6MTc1MTIwOTE4OH0.H2XoHKLvlrM8cpb68ht18K2Mkj6PVnSSd-tM4HmMIfI";

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

        // Expand ALL categories by default (keyed by categoryId)
        const initialExpanded = {};
        (catRes.data || []).forEach((cat) => {
          initialExpanded[cat.categoryId] = true;
        });
        setExpandedCategories(initialExpanded);

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
            name: item.itemName, // ✅ always set name for search
            imageData:
              item.imageSrc && item.imageSrc.length > 50 ? item.imageSrc : null,
            prices: {
              full: item.price1 || 0,
              half: item.price2 || 0,
            },
          });
        });
        setMenuItems(groupedItemsBySubcategory);
      } catch (err) {
        toast.error("Failed to load menu data. Please try again later.");
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto select table from URL
  
  useEffect(() => {
    if (tableFromURL) {
      setSelectedTable(tableFromURL);
      setShowTableSelection(false);

    }
  }, [tableFromURL]);

  // categoryId -> categoryName map
  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((cat) => (map[cat.categoryId] = cat.categoryName));
    return map;
  }, [categories]);

  // Flatten & filter items once per render
  const filteredFlatItems = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase();
    let all = [];

    Object.values(subcategories).forEach((subsOfCat) => {
      subsOfCat.forEach((sub) => {
        const subId = Number(sub.subcategoryId || sub.id || sub.subCatId);
        const items = menuItems[subId] || [];
        const subName = sub.subcategoryName || sub.name || "Unknown";
        const catId = Number(sub.categoryId);
        const catName = categoryMap[catId] || "";

        items.forEach((it) => {
          all.push({
            ...it,
            subcategoryName: subName,
            categoryId: catId,
            categoryName: catName,
          });
        });
      });
    });

    if (!lowerSearch) return all;

    return all.filter(
      (it) =>
        it.name?.toLowerCase().includes(lowerSearch) ||
        it.subcategoryName?.toLowerCase().includes(lowerSearch) ||
        it.categoryName?.toLowerCase().includes(lowerSearch)
    );
  }, [subcategories, menuItems, categoryMap, searchTerm]);
useEffect(() => {
  if (searchTerm.trim()) {
    // Open all categories (or filter to just the matching one if you want)
    const expanded = {};
    categories.forEach(cat => {
      expanded[cat.categoryId] = true;
    });
    setExpandedCategories(expanded);
  }
}, [searchTerm, categories]);
  // Grouped items for MenuList
  const groupedItemsForList = useMemo(() => {
    const grouped = {};

    if (searchTerm.trim()) {
      // Group only filtered items
      filteredFlatItems.forEach((item) => {
        const catName = item.categoryName || "Uncategorized";
        const subName = item.subcategoryName || "Uncategorized";

        if (!grouped[catName]) grouped[catName] = {};
        if (!grouped[catName][subName]) grouped[catName][subName] = [];
        grouped[catName][subName].push(item);
      });

      // During search, keep all categories visually expanded
      // (no state change needed — CategorySection will render regardless)
      return grouped;
    }

    // No search: group by categories -> subcategories from source structures
    categories.forEach((cat) => {
      const catSubs = subcategories[cat.categoryId] || [];
      catSubs.forEach((sub) => {
        const subId = Number(sub.subcategoryId || sub.id || sub.subCatId);
        const subName = sub.subcategoryName || sub.name || "Uncategorized";
        const items = (menuItems[subId] || []).map((it) => ({
          ...it,
          subcategoryName: subName,
          categoryId: cat.categoryId,
          categoryName: cat.categoryName,
        }));

        if (items.length) {
          if (!grouped[cat.categoryName]) grouped[cat.categoryName] = {};
          grouped[cat.categoryName][subName] = items;
        }
      });
    });

    return grouped;
  }, [categories, subcategories, menuItems, filteredFlatItems, searchTerm]);

  // --- Cart helpers ---
  const addToCart = (item, size) => {
    const cartId = `${item.id}-${size}`;
    const cartItem = {
      id: cartId,
      name: item.name,
      size,
      price: item.prices[size],
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

  const removeFromCart = (itemId) =>
    setCart((prev) => prev.filter((it) => it.id !== itemId));

  const getCartTotal = () =>
    cart.reduce((total, it) => total + it.price * it.quantity, 0);

  const getCartItemCount = () =>
    cart.reduce((count, it) => count + it.quantity, 0);

  const getItemQuantityInCart = (itemId, size) => {
    const found = cart.find((it) => it.id === `${itemId}-${size}`);
    return found ? found.quantity : 0;
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <div className="min-h-screen bg-white relative scroll-smooth">
      <Header getCartItemCount={getCartItemCount} setShowCart={setShowCart} />

      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="text-black-500 text-center mt-10">
          Error Occured While Loading Data
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="sticky top-14 z-20 bg-white max-w-7xl mx-auto p-3 sm:p-4 shadow-md">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>

          {/* Category Buttons */}
          <div className="sticky top-28 bg-white z-10 pt-2 pr-0.5 pb-2 pl-0.5">
            <CategoryButtons
              categories={categories}
              toggleCategory={(id) => {
                // ensure expanded before scroll
                setExpandedCategories((prev) => ({ ...prev, [id]: true }));
                // smooth scroll to the section
                const section = document.getElementById(`menu-category-${id}`);
                if (section)
                  section.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
              }}
              expandedCategories={expandedCategories}
            />
          </div>

          {/* Menu List */}
          <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-8">
            <MenuList
              groupedItems={groupedItemsForList}
              categories={categories}
              expandedCategories={expandedCategories}
              toggleCategory={toggleCategory}
              getItemQuantityInCart={getItemQuantityInCart}
              addToCart={addToCart}
              updateCartQuantity={updateCartQuantity}
            />
          </div>


          {showCart && (
            <CartModal
              cart={cart}
              getCartTotal={getCartTotal}
              updateCartQuantity={updateCartQuantity}
              removeFromCart={removeFromCart}
              handlePlaceOrder={handlePlaceOrder}
              selectedTable={selectedTable}
              setShowCart={setShowCart}
              //   setCustomerName={setCustomerName}
              // setUserPhone={setUserPhone}
            />
          )}

          {showTableSelection && !selectedTable && (
            <TableSelectionModal
              setSelectedTable={setSelectedTable}
              setShowTableSelection={setShowTableSelection}
            />
          )}

          {/* ✅ Order History Modal */}
          {showOrderHistory && (
            <OrderHistory
              selectedTable={selectedTable}
              onClose={() => setShowOrderHistory(false)}
              tableNo={selectedTable} 
              // orderId={generatedOrderId} 
            />
          )}


          <StickyCartButton
            // itemCount={getCartItemCount()}
            itemCount={getCartItemCount()}
            onClick={() => setShowCart(true)}
            onOrderHistoryClick={handleOrderHistoryClick}
            
          />
          
          <ToastContainer position="top-right" autoClose={3000} />
        </>
      )}
    </div>
  );
};

export default RestaurantApp;
