import React, { useState, useEffect } from "react";
import { apiClient } from "../../core/api";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const DashboardStockTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const varToken = useAuthHeader();

  useEffect(() => {
    apiClient
      .get("/api/stock-transactions", {
        headers: {
          Authorization: varToken,
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.transactionId}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg"
          >
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={displayValue(
                  transaction.productVariation?.productVariationImage
                )}
                alt="Product Variation"
                className="h-16 w-16 object-cover rounded-md"
              />
              <div>
                <h2 className="font-semibold">
                  {displayValue(
                    transaction.productVariation?.product?.productName
                  )}
                </h2>
                <p className="text-sm text-gray-600">
                  {displayValue(transaction.stock?.stockName)} |{" "}
                  {displayValue(transaction.transactionType)}
                </p>
              </div>
            </div>
            <div className="text-sm">
              <p>
                <strong>Category:</strong>{" "}
                {displayValue(
                  transaction.productVariation?.product?.category?.categoryName
                )}
              </p>
              <p>
                <strong>Brand:</strong>{" "}
                {displayValue(
                  transaction.productVariation?.product?.brand?.brandName
                )}
              </p>
              <p>
                <strong>Size:</strong>{" "}
                {displayValue(transaction.productVariation?.size?.sizeName)}
              </p>
              <p className="flex items-center">
                <strong>Color:</strong>{" "}
                <span
                  className="inline-block w-4 h-4 mr-1 rounded-full border border-gray-200"
                  style={{
                    backgroundColor:
                      transaction.productVariation?.color?.hexCode ||
                      "transparent",
                  }}
                ></span>
                {displayValue(transaction.productVariation?.color?.colorName)}
              </p>
              <p>
                <strong>Price:</strong> $
                {transaction.productVariation?.productPrice?.toFixed(2) ||
                  "null"}
              </p>
              <p>
                <strong>Quantity:</strong> {displayValue(transaction.quantity)}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {displayValue(
                  new Date(transaction.transactionDate).toLocaleString()
                )}
              </p>
              <p>
                <strong>Staff:</strong>{" "}
                {displayValue(transaction.user.username)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStockTransactions;
