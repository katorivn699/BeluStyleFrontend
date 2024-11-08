import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../core/api"; // Assuming you have an api client setup
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const DashboardWarehouse = () => {
  const [stocks, setStocks] = useState([]); // State to store stock items
  const navigate = useNavigate();

  const varToken = useAuthHeader();

  useEffect(() => {
    apiClient
      .get("/api/stocks", {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        setStocks(response.data); // Set the fetched data to stocks state
      })
      .catch((error) => {
        console.error("Error fetching stocks:", error);
      });
  }, []); // Empty dependency array means this useEffect runs once when the component mounts

  const handleViewDetail = (stock) => {
    navigate(`/Dashboard/Warehouse/${stock.stockId}`); // Navigate to detail page
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold mb-6">Stock List</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead className="border border-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>

              <th className="px-4 py-2 text-left">Stock Name</th>
              <th className="px-4 py-2 text-left">Stock Address</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.stockId} className="hover:bg-gray-50">
                <td className="px-4 py-2">{stock.stockId}</td>

                <td className="px-4 py-2">{stock.stockName}</td>
                <td className="px-4 py-2">{stock.stockAddress}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleViewDetail(stock)}
                    className="flex items-center justify-center py-2 text-blue-500 hover:bg-gray-200"
                  >
                    <FaEye className="mr-2" /> View Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DashboardWarehouse;
