import React, { useEffect, useState } from "react";
import { apiClient } from "../../core/api";
import { Link } from "react-router-dom";
import { Box, Button, Typography, Modal, TextField } from "@mui/material";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import DeleteConfirmationModal from "../../components/buttons/DeleteConfirmationModal";
import { toast } from "react-toastify";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { formatPrice } from "../../components/format/formats";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

const DashboardProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const role = useAuthUser().role;
  const varToken = useAuthHeader();

  useEffect(() => {
    apiClient
      .get("/api/products", {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data); // Initialize filtered products
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, [varToken]);

  // Filter products based on search term
  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term === "") {
      setFilteredProducts(products); // Reset to all products if search is empty
    } else {
      setFilteredProducts(
        products.filter((product) =>
          product.productName.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
  };

  const handleDeleteProduct = (productId) => {
    apiClient
      .delete(`/api/products/${productId}`, {
        headers: {
          Authorization: varToken,
        },
      })
      .then(() => {
        setProducts(
          products.filter((product) => product.productId !== productId)
        );
        setFilteredProducts(
          filteredProducts.filter((product) => product.productId !== productId)
        );
        setIsModalOpen(false);
        toast.success("Delete product successfully", {
          position: "bottom-right",
        });
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product", {
          position: "bottom-right",
        });
      });
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold">Products</h1>
        {role === "STAFF" || (
          <Link to="/Dashboard/Products/Add">
            <button className="text-blue-600 border border-blue-500 px-4 py-2 rounded-lg flex items-center">
              <FaPlus className="mr-2" /> Add New Product
            </button>
          </Link>
        )}
      </div>

      {/* Search Input */}
      <TextField
        label="Search Products"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
      />

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.productId}
              className="border rounded-md p-4 flex flex-col relative transition-all duration-300 border-gray-300 hover:shadow-lg"
            >
              <Link
                to={`/Dashboard/Products/${product.productId}`}
                className="flex-grow"
              >
                <div className="flex flex-col items-center justify-center mb-2">
                  <img
                    src={
                      product.productVariationImage || "/images/placeholder.png"
                    }
                    alt={product.productName}
                    className="w-full h-32 object-cover mb-2"
                  />
                  <h2 className="font-semibold">{product.productName}</h2>
                  <p className="text-sm">{product.productDescription}</p>
                  <p className="text-gray-500">Brand: {product.brandName}</p>
                  <p className="text-gray-500">
                    Category: {product.categoryName}
                  </p>
                  <p className="font-bold">
                    Price:{" "}
                    {product.productPrice
                      ? formatPrice(product.productPrice)
                      : "N/A"}
                  </p>

                  <p className="text-gray-400">
                    Avg. Rating: {product.averageRating} ({product.totalRatings}{" "}
                    ratings)
                  </p>
                </div>
              </Link>
              {role === "STAFF" || (
                <div>
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="absolute top-2 right-2 text-red-500 p-2 hover:text-red-700 bg-white"
                  >
                    <FaTrash />
                  </button>
                  <Link
                    to={`/Dashboard/Products/Edit/${product.productId}`}
                    className="absolute top-2 right-10 text-blue-500 hover:text-blue-700 p-2 bg-white"
                  >
                    <FaEdit />
                  </Link>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-red-500">No products found.</p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={() => {
          handleDeleteProduct(selectedProduct.productId);
        }}
        name={selectedProduct ? selectedProduct.productName : ""}
      />
    </div>
  );
};

export default DashboardProducts;
