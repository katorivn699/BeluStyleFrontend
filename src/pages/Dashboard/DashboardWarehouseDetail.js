import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../../core/api";
import { FaPlus } from "react-icons/fa";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { formatPrice } from "../../components/format/formats";

const DashboardWarehouseDetail = () => {
  const { stockId } = useParams();
  const [stockProducts, setStockProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);

  const varToken = useAuthHeader();

  useEffect(() => {
    apiClient
      .get(`/api/stocks/${stockId}`, {
        headers: {
          Authorization: varToken,
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
      ? group.productName.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
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

      {/* Products Display Section - Card Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((group) => (
            <div
              key={group.productName}
              className="border border-gray-300 rounded-lg p-4 shadow-lg"
            >
              <h3 className="text-2xl font-semibold mb-2">
                {group.productName}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Brand: {group.brandName}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Category: {group.categoryName}
              </p>

              {/* Product Variations */}
              {group.variations
                .filter((variation) =>
                  showOnlyLowStock ? variation.quantity < 10 : true
                )
                .map((variation) => (
                  <div
                    key={variation.variationId}
                    className="border-t pt-4 mb-4 flex justify-between items-center"
                  >
                    {/* Variation Image */}
                    <div className="flex items-center">
                      <img
                        src={
                          variation.productVariationImage ||
                          "/images/placeholder.png"
                        }
                        alt={variation.colorName}
                        className="w-10 h-10 object-cover mr-2 rounded"
                      />
                      <div>
                        <div
                          className="w-5 h-5 rounded-full mr-2"
                          style={{
                            backgroundColor: variation.hexCode,
                            border: "1px solid gray",
                          }}
                        ></div>
                        <p className="text-sm text-gray-500">
                          {variation.colorName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                       {formatPrice(variation.productPrice)}
                      </p>
                      <p
                        className={`text-sm ${
                          variation.quantity < 10
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {variation.quantity} in stock
                      </p>
                    </div>
                  </div>
                ))}
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
