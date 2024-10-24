import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../../core/api"; // Assuming you have an api client setup

const DashboardViewSaleProduct = () => {
  const [products, setProducts] = useState([]); // State to store products
  const [sale, setSale] = useState(null); // State to store sale details
  const { saleId } = useParams(); // Get saleId from route params

  const varToken = localStorage.getItem("_auth");

  useEffect(() => {
    apiClient
      .get(`/api/sales/${saleId}`, {
        headers: {
          Authorization: "Bearer " + varToken,
        },
      })
      .then((response) => {
        setSale(response.data); // Set sale data
      })
      .catch((error) => {
        console.error("Error fetching sale details:", error);
      });

    apiClient
      .get(`/api/sales/${saleId}/products`, {
        headers: {
          Authorization: "Bearer " + varToken,
        },
      })
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products for sale:", error);
      });
  }, [saleId]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold mb-6">Sale Details</h1>
      </div>

      {/* Sale Information Section */}
      {sale ? (
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Sale ID: {sale.saleId}</h2>
          <p>Type: {sale.saleType}</p>
          <p>Value: {sale.saleValue}</p>
          <p>Start Date: {new Date(sale.startDate).toLocaleDateString()}</p>
          <p>End Date: {new Date(sale.endDate).toLocaleDateString()}</p>
          <p>Status: {sale.saleStatus}</p>
        </div>
      ) : (
        <p>Loading sale details...</p>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold mb-6">Products in Sale {saleId}</h1>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead className="border border-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">Product Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Brand</th>
              <th className="px-4 py-2 text-left">Description</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.productId} className="hover:bg-gray-50">
                <td className="px-4 py-2">{product.productName}</td>
                <td className="px-4 py-2">{product.category.categoryName}</td>
                <td className="px-4 py-2">{product.brand.brandName}</td>
                <td className="px-4 py-2">{product.productDescription}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DashboardViewSaleProduct;
