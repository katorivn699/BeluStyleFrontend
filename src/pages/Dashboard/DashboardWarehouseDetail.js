import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../../core/api"; // Assuming you have an API client setup
import { FaPlus } from "react-icons/fa";

const DashboardWarehouseDetail = () => {
  const { stockId } = useParams();
  const [stockProducts, setStockProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);

  const varToken = localStorage.getItem("_auth");

  useEffect(() => {
    apiClient
      .get(`/api/stocks/${stockId}`, {
        headers: {
          Authorization: "Bearer " + varToken,
        },
      })
      .then((response) => {
        setStockProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stock details:", error);
      });
  }, [stockId]);

  if (!stockProducts.length) {
    return <div>Loading stock details...</div>;
  }

  const groupedProducts = stockProducts.reduce((grouped, product) => {
    if (!grouped[product.productId]) {
      grouped[product.productId] = {
        productName: product.productName,
        brandId: product.brandId,
        brandName: product.brandName,
        categoryId: product.categoryId,
        categoryName: product.categoryName,
        variations: [],
      };
    }
    grouped[product.productId].variations.push(product);
    return grouped;
  }, {});

  const filteredProducts = Object.values(groupedProducts).filter((group) => {
    const matchesSearch = group.productName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrandId
      ? group.brandId === parseInt(selectedBrandId, 10)
      : true;
    const matchesCategory = selectedCategoryId
      ? group.categoryId === parseInt(selectedCategoryId, 10)
      : true;
    const matchesLowStock = showOnlyLowStock
      ? group.variations.some((variation) => variation.quantity < 10)
      : true;
    return matchesSearch && matchesBrand && matchesCategory && matchesLowStock;
  });

  return (
    <div>
      {/* Header Section: Warehouse Name and Import Button */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-4xl font-bold">{stockProducts[0].stockName}</h1>
          <p className="text-lg text-gray-600">
            {stockProducts[0].stockAddress}
          </p>
        </div>
        <Link to={`/Dashboard/Warehouse/${stockId}/Import`}>
          <button className="text-blue-600 border border-blue-500 px-4 py-2 rounded-lg flex items-center">
            <FaPlus className="mr-2" /> Import Product
          </button>
        </Link>
      </div>

      {/* Filters Section */}
      <div className="flex justify-end space-x-4 mb-6 w-full items-center">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <select
          value={selectedBrandId}
          onChange={(e) => setSelectedBrandId(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Brands</option>
          {[...new Set(stockProducts.map((product) => product.brandId))].map(
            (brandId) => {
              const brandName = stockProducts.find(
                (product) => product.brandId === brandId
              ).brandName;
              return (
                <option key={brandId} value={brandId}>
                  {brandName}
                </option>
              );
            }
          )}
        </select>
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Categories</option>
          {[...new Set(stockProducts.map((product) => product.categoryId))].map(
            (categoryId) => {
              const categoryName = stockProducts.find(
                (product) => product.categoryId === categoryId
              ).categoryName;
              return (
                <option key={categoryId} value={categoryId}>
                  {categoryName}
                </option>
              );
            }
          )}
        </select>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={showOnlyLowStock}
            onChange={() => setShowOnlyLowStock(!showOnlyLowStock)}
            className="form-checkbox"
          />
          <span className="ml-2">Show Low Stock Only</span>
        </label>
      </div>

      {/* Products Display Section */}
      <div>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((group) => (
            <div key={group.productName} className="mb-8">
              <div className="mb-4">
                <h3 className="text-2xl font-semibold mb-2">
                  {group.productName}
                </h3>
                <div className="flex items-center mb-2">
                  <span className="mr-4 flex items-center font-bold">
                    <span className="text-sm text-gray-500">
                      {group.brandName}
                    </span>
                  </span>
                  <span className="flex items-center">
                    <span className="text-sm text-gray-500">
                      {group.categoryName}
                    </span>
                  </span>
                </div>
              </div>

              <table className="table-auto w-full border-collapse">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Image</th>
                    <th className="px-4 py-2 text-left">Size</th>
                    <th className="px-4 py-2 text-left">Color</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {group.variations
                    .filter((variation) =>
                      showOnlyLowStock ? variation.quantity < 10 : true
                    )
                    .map((variation) => (
                      <tr key={variation.variationId} className="border-t">
                        <td className="px-4 py-2">{variation.variationId}</td>
                        <td className="px-4 py-2">
                          <img
                            src={variation.productVariationImage}
                            alt={`${variation.colorName} ${group.productName}`}
                            className="w-12 h-12 object-cover"
                          />
                        </td>
                        <td className="px-4 py-2">{variation.sizeName}</td>
                        <td className="px-4 py-6 flex items-center">
                          {variation.colorName}
                          <span
                            className="ml-2 inline-block w-4 h-4 border rounded"
                            style={{
                              backgroundColor: variation.hexCode,
                            }}
                          ></span>
                        </td>
                        <td className="px-4 py-2">
                          ${variation.productPrice.toFixed(2)}
                        </td>
                        <td
                          className={`px-4 py-2 ${
                            variation.quantity < 10 ? "text-red-500" : ""
                          }`}
                        >
                          {variation.quantity}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p className="text-lg text-gray-600">
            No products available in this stock.
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardWarehouseDetail;
