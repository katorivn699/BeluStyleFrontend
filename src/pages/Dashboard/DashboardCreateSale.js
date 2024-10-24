import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../core/api"; // Assuming you have an api client setup

const DashboardCreateSale = () => {
  const [saleType, setSaleType] = useState("PERCENTAGE"); // Default to PERCENTAGE
  const [saleValue, setSaleValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [saleStatus, setSaleStatus] = useState("ACTIVE"); // Default to ACTIVE
  const navigate = useNavigate();

  const varToken = localStorage.getItem("_auth");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newSale = {
      saleType,
      saleValue: parseFloat(saleValue), // Make sure sale value is a number
      startDate,
      endDate,
      saleStatus,
    };

    apiClient
      .post("/api/sales", newSale, {
        headers: {
          Authorization: "Bearer " + varToken,
        },
      })
      .then((response) => {
        console.log("Sale created successfully:", response.data);
        navigate("/Dashboard/Sales"); // Redirect to sales list after creating the sale
      })
      .catch((error) => {
        console.error("Error creating sale:", error);
      });
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-4xl font-bold mb-6">Create New Sale</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sale Type
          </label>
          <select
            value={saleType}
            onChange={(e) => setSaleType(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED_AMOUNT">Fixed Amount</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sale Value
          </label>
          <input
            type="number"
            value={saleValue}
            onChange={(e) => setSaleValue(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            placeholder="Enter sale value"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sale Status
          </label>
          <select
            value={saleStatus}
            onChange={(e) => setSaleStatus(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Create Sale
          </button>
        </div>
      </form>
    </div>
  );
};

export default DashboardCreateSale;
