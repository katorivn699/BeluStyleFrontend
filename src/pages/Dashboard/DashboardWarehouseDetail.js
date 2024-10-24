import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../../core/api"; // Assuming you have an API client setup
import { FaPlus } from "react-icons/fa";

const DashboardWarehouseDetail = () => {
  const { stockId } = useParams();
  const [stock, setStock] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
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
        setStock(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stock details:", error);
      });
  }, [stockId]);

  if (!stock) {
    return <div>Loading stock details...</div>;
  }

  const groupedProducts = stock.stockProducts.reduce(
    (grouped, stockProduct) => {
      const { product } = stockProduct.productVariation;
      if (!grouped[product.productId]) {
        grouped[product.productId] = {
          product,
          variations: [],
        };
      }
      grouped[product.productId].variations.push(stockProduct);
      return grouped;
    },
    {}
  );

  const filteredProducts = Object.values(groupedProducts).filter((group) => {
    const matchesSearch = group.product.productName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand
      ? group.product.brand.brandName === selectedBrand
      : true;
    const matchesCategory = selectedCategory
      ? group.product.category.categoryName === selectedCategory
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
          <h1 className="text-4xl font-bold">{stock.stockName}</h1>
          <p className="text-lg text-gray-600">{stock.stockAddress}</p>
        </div>
        <Link to="/Dashboard/Warehouse/Import">
          <button className="text-blue-600 border border-blue-500 px-4 py-2 rounded-lg flex items-center">
            <FaPlus className="mr-2" /> Import Product
          </button>
        </Link>
      </div>

      {/* Filters Section: Search, Brand, Category, Low Stock */}
      <div className="flex justify-end space-x-4 mb-6 w-full items-center">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Brands</option>
          {[
            ...new Set(
              Object.values(groupedProducts).map(
                (group) => group.product.brand.brandName
              )
            ),
          ].map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Categories</option>
          {[
            ...new Set(
              Object.values(groupedProducts).map(
                (group) => group.product.category.categoryName
              )
            ),
          ].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
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
            <div key={group.product.productId} className="mb-8">
              <div className="mb-4">
                <h3 className="text-2xl font-semibold mb-2">
                  {group.product.productName}
                </h3>
                <div className="flex items-center mb-2">
                  <span className="mr-4 flex items-center font-bold">
                    <span className="text-sm text-gray-500">
                      {group.product.brand.brandName}
                    </span>
                  </span>
                  <span className="flex items-center">
                    <img
                      src={group.product.category.imageUrl}
                      alt={group.product.category.categoryName}
                      className="w-6 h-6 object-cover mr-2"
                    />
                    <span className="text-sm text-gray-500">
                      {group.product.category.categoryName}
                    </span>
                  </span>
                </div>
              </div>

              <table className="table-auto w-full border-collapse">
                <thead>
                  <tr>
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
                    .map((stockProduct) => {
                      const { productVariation, quantity } = stockProduct;
                      return (
                        <tr
                          key={productVariation.variationId}
                          className="border-t"
                        >
                          <td className="px-4 py-2">
                            <img
                              src={productVariation.productVariationImage}
                              alt={`${productVariation.color.colorName} ${group.product.productName}`}
                              className="w-12 h-12 object-cover"
                            />
                          </td>
                          <td className="px-4 py-2">
                            {productVariation.size.sizeName}
                          </td>
                          <td className="px-4 py-6 flex items-center">
                            {productVariation.color.colorName}
                            <span
                              className="ml-2 inline-block w-4 h-4 border rounded"
                              style={{
                                backgroundColor: productVariation.color.hexCode,
                              }}
                            ></span>
                          </td>
                          <td className="px-4 py-2">
                            ${productVariation.productPrice.toFixed(2)}
                          </td>
                          <td
                            className={`px-4 py-2 ${
                              quantity < 10 ? "text-red-500" : ""
                            }`}
                          >
                            {quantity}
                          </td>
                        </tr>
                      );
                    })}
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
