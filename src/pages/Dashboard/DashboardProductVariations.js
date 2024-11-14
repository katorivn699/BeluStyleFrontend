import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../../core/api"; // Your API client
import {
  Skeleton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { toast, Zoom } from "react-toastify";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

const DashboardProductVariations = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [variationToDelete, setVariationToDelete] = useState(null);
  const role = useAuthUser().role;
  const varToken = useAuthHeader();

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = () => {
    setLoading(true);
    apiClient
      .get(`/api/products/${productId}/product-variations`, {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setLoading(false);
      });
  };

  const handleDeleteVariation = (variationId, size, color) => {
    setVariationToDelete({ variationId, size, color });
    setOpenModal(true);
  };

  const confirmDeleteVariation = () => {
    if (!variationToDelete) return;

    const { variationId } = variationToDelete;

    apiClient
      .delete(`/api/product-variations/${variationId}`, {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        toast.success(response.data.message, {
          position: "bottom-right",
          transition: Zoom,
        });
        setProduct((prevProduct) => ({
          ...prevProduct,
          productVariations: prevProduct.productVariations.filter(
            (variation) => variation.variationId !== variationId
          ),
        }));
        setOpenModal(false); // Close modal after deletion
      })
      .catch((error) => {
        console.error("Error deleting product variation:", error);
        setOpenModal(false); // Close modal on error as well
      });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  if (loading) {
    return <Skeleton variant="rectangular" width="100%" height={400} />;
  }

  return (
    <div className="p-4">
      <div>
        <h1 className="text-3xl font-bold">{product.productName}</h1>
        <p className="mt-2 text-gray-600">{product.productDescription}</p>

        <div className="mt-4">
          <p className="text-gray-600">
            Category: {product.category.categoryName}
          </p>
          <p className="text-gray-600">Brand: {product.brand.brandName}</p>
          <p className="text-gray-600">
            Created At: {new Date(product.createdAt).toLocaleString()}
          </p>
          <p className="text-gray-600">
            Updated At: {new Date(product.updatedAt).toLocaleString()}
          </p>
        </div>

        <div className="mt-4 flex justify-end space-x-4">
          {role === "STAFF" || (
            <button className="text-blue-600 border border-blue-500 px-4 py-2 rounded-lg flex items-center">
              <Link
                to={`/Dashboard/Products/Edit/${product.productId}`}
                className="flex items-center"
              >
                <FaEdit className="mr-2" /> Edit Product
              </Link>
            </button>
          )}

          <button className="text-blue-600 border border-blue-500 px-4 py-2 rounded-lg flex items-center z-10">
            <Link
              to={`/Dashboard/Products/${product.productId}/Add`}
              className="flex items-center"
            >
              <FaPlus className="mr-2" /> Add New Variation
            </Link>
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {product.productVariations.map((variation) => (
          <div
            key={variation.variationId}
            className="border rounded-lg p-4 flex flex-col items-center shadow-md relative transition-transform duration-300 transform hover:scale-105"
          >
            <button
              onClick={() =>
                handleDeleteVariation(
                  variation.variationId,
                  variation.size.sizeName,
                  variation.color.colorName
                )
              }
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-2 bg-white"
              aria-label="Delete Variation"
            >
              <FaTrash size={18} />
            </button>
            <Link
              to={`/Dashboard/Products/${productId}/Edit/${variation.variationId}`}
              className="absolute top-2 right-10 text-blue-500 hover:text-blue-700 p-2 bg-white"
              aria-label="Delete Variation"
            >
              <FaEdit size={18} />
            </Link>
            <img
              src={variation.productVariationImage || "/images/placeholder.png"}
              alt={`${product.productName} - ${variation.color.colorName}`}
              className="w-full h-64 object-cover mb-4 rounded-md"
              style={{ backgroundColor: variation.color.hexCode }}
            />
            <h2 className="font-semibold text-lg">
              Size: {variation.size.sizeName}
            </h2>
            <p className="text-gray-500">Color: {variation.color.colorName}</p>
            <div
              className="w-5 h-5 rounded-full border-2"
              style={{ backgroundColor: variation.color.hexCode }}
            />
            <p className="font-bold mt-2 text-xl">
              Price: ${variation.productPrice.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          {variationToDelete && (
            <p>
              Are you sure you want to delete the variation? <br />
              <strong>{`Size: ${variationToDelete.size}, Color: ${variationToDelete.color}`}</strong>
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteVariation} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DashboardProductVariations;
