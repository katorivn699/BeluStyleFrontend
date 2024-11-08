import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../../core/api";
import { toast, Zoom } from "react-toastify";
import { FaPlus, FaTrash } from "react-icons/fa";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const DashboardViewSaleProduct = () => {
  const [products, setProducts] = useState([]);
  const [sale, setSale] = useState(null);
  const { saleId } = useParams();

  const varToken = useAuthHeader();

  useEffect(() => {
    // Fetch sale details
    apiClient
      .get(`/api/sales/${saleId}`, {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        setSale(response.data); // Set sale data
      })
      .catch((error) => {
        console.error("Error fetching sale details:", error);
      });

    // Fetch products in sale
    apiClient
      .get(`/api/sales/${saleId}/products`, {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products for sale:", error);
      });
  }, [saleId]);

  // Function to delete a product from the sale
  const handleDeleteProduct = (productId) => {
    apiClient
      .delete(`/api/sales/${saleId}/products?productId=${productId}`, {
        headers: {
          Authorization: varToken,
        },
      })
      .then(() => {
        // Remove the deleted product from the state
        setProducts(
          products.filter((product) => product.productId !== productId)
        );
        toast.success("Product removed from sale", {
          position: "bottom-center",
          transition: Zoom,
        });
      })
      .catch((error) => {
        console.error("Error deleting product from sale:", error);
        toast.error("Failed to remove product from sale", {
          position: "bottom-center",
          transition: Zoom,
        });
      });
  };

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
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold mb-6">Products in Sale {saleId}</h1>
        </div>
        <Link to={`/Dashboard/Sales/${saleId}/AddProduct`}>
          <button className="text-blue-600 border border-blue-500 px-4 py-2 rounded-lg flex items-center">
            <FaPlus className="mr-2" /> Add Products
          </button>
        </Link>
      </div>
      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead className="border border-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Product Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Brand</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Remove</th>{" "}
              {/* New Action column */}
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.productId} className="hover:bg-gray-50">
                <td className="px-4 py-2">{product.productId}</td>
                <td className="px-4 py-2">{product.productName}</td>
                <td className="px-4 py-2">{product.category.categoryName}</td>
                <td className="px-4 py-2">{product.brand.brandName}</td>
                <td className="px-4 py-2">{product.productDescription}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDeleteProduct(product.productId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
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

export default DashboardViewSaleProduct;
