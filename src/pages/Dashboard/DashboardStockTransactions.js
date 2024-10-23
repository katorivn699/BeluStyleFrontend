import React, { useState, useEffect } from "react";
import { apiClient } from "../../core/api";

const DashboardStockTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  const varToken = localStorage.getItem("_auth");

  useEffect(() => {
    apiClient
      .get("/api/stock-transactions", {
        headers: {
          Authorization: "Bearer " + varToken,
        },
      })
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stock transactions:", error);
      });
  }, [varToken]);

  const displayValue = (value) =>
    value !== null && value !== undefined ? value : "null";

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Stock Transactions</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full min-w-max border-collapse">
          <thead className="border border-gray-300">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Warehouse</th>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Brand</th>
              <th className="px-4 py-2">Size</th>
              <th className="px-4 py-2">Color</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.transactionId} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap">
                  {displayValue(transaction.transactionId)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {displayValue(transaction.stock?.stockName)}
                </td>
                <td className="px-4 py-2 truncate">
                  {displayValue(
                    transaction.productVariation?.product?.productName
                  )}
                </td>
                <td className="px-4 py-2">
                  {displayValue(
                    transaction.productVariation?.product?.category
                      ?.categoryName
                  )}
                </td>
                <td className="px-4 py-2">
                  {displayValue(
                    transaction.productVariation?.product?.brand?.brandName
                  )}
                </td>
                <td className="px-4 py-2">
                  {displayValue(transaction.productVariation?.size?.sizeName)}
                </td>
                <td className="px-4 py-2">
                  <span
                    className="inline-block w-4 h-4 mr-2 rounded-full border-gray-200 border-2"
                    style={{
                      backgroundColor:
                        transaction.productVariation?.color?.hexCode ||
                        "transparent",
                    }}
                  ></span>
                  {displayValue(transaction.productVariation?.color?.colorName)}
                </td>
                <td className="px-4 py-2">
                  $
                  {transaction.productVariation?.productPrice?.toFixed(2) ||
                    "null"}
                </td>
                <td className="px-4 py-2">
                  {displayValue(transaction.quantity)}
                </td>
                <td className="px-4 py-2">
                  {displayValue(transaction.transactionType)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {displayValue(
                    new Date(transaction.transactionDate).toLocaleDateString()
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardStockTransactions;
