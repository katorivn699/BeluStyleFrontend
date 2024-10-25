import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../../core/api"; // Assuming you have an api client setup

const DashboardEditSale = () => {
  const [saleType, setSaleType] = useState("PERCENTAGE");
  const [saleValue, setSaleValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [saleStatus, setSaleStatus] = useState("ACTIVE");
  const navigate = useNavigate();
  const { saleId } = useParams();

  const varToken = localStorage.getItem("_auth");

  // Fetch sale details on component mount
  useEffect(() => {
    apiClient
      .get(`/api/sales/${saleId}`, {
        headers: {
          Authorization: "Bearer " + varToken,
        },
      })
      .then((response) => {
        const sale = response.data;
        setSaleType(sale.saleType);
        setSaleValue(sale.saleValue);
        setStartDate(formatDate(sale.startDate));
        setEndDate(formatDate(sale.endDate));
        setSaleStatus(sale.saleStatus);
      })
      .catch((error) => {
        console.error("Error fetching sale details:", error);
      });
  }, [saleId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedSale = {
      saleType,
      saleValue: parseFloat(saleValue),
      startDate,
      endDate,
      saleStatus,
    };

    apiClient
      .put(`/api/sales/${saleId}`, updatedSale, {
        headers: {
          Authorization: "Bearer " + varToken,
        },
      })
      .then((response) => {
        console.log("Sale updated successfully:", response.data);
        navigate("/Dashboard/Sales"); // Redirect to sales list after updating the sale
      })
      .catch((error) => {
        console.error("Error updating sale:", error);
      });
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-4xl font-bold mb-6">Edit Sale {saleId}</h1>

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
            Update Sale
          </button>
        </div>
      </form>
    </div>
  );
};

export default DashboardEditSale;
