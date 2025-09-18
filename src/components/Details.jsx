import React, { useState } from "react";

const Details = () => {
 const [customerName, setCustomerName] = useState("");
const [userPhone, setUserPhone] = useState("");


  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Validation check
    if (!customerName.trim()) {
      alert("Please enter your name");
      return;
    }
    if (userPhone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    // ✅ API call yahan kar sakte ho
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-50% max-w-md bg-white p-6 rounded-2xl shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          Enter Your Details
        </h2>

        {/* Name Input */}
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter your name +91"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Phone Input */}
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Phone</label>
          <div className="flex">
            <span className="flex items-center px-3 bg-gray-200 border border-r-0 rounded-l-lg text-gray-600">
              +91       </span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{10}"
              value={userPhone}
              onChange={(e) => { 
                let value = e.target.value.replace(/\D/g, "").slice(0, 10); // sirf 10 digits
                setUserPhone(value);
              }}
              placeholder="Enter 10-digit number"
              className="flex-1 p-3 border rounded-r-lg focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Details;
